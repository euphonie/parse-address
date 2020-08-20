import vocabulary from "../vocabulary/ca";
import Utils from "../utils";
import XRegExp from "xregexp";

const Normalization_Map = {
  prefix: vocabulary.directional,
  prefix1: vocabulary.directional,
  prefix2: vocabulary.directional,
  suffix: vocabulary.directional,
  suffix1: vocabulary.directional,
  suffix2: vocabulary.directional,
  type: vocabulary.street_type,
  type1: vocabulary.street_type,
  type2: vocabulary.street_type,
  province: vocabulary.province_code
};

const Normalization_Regex = /^\s+|\s+$/g;

const Direction_Code = Utils.invert(vocabulary.directional);

let Address_Rules = {};
Address_Rules.type = Utils.flatten(vocabulary.street_type)
  .sort()
  .filter(function (v, i, arr) {
    return arr.indexOf(v) === i;
  })
  .join("|");

Address_Rules.fraction = "\\d+\\/\\d+";

Address_Rules.unit_suffix = `
  (?<civic_number_suffix> (
      (\\W*${Address_Rules.fraction}) |
      ((?<=\\d+)[A-Za-z]{1}) |
    ) | (\\W*)
  )
`;

Address_Rules.province =
  "\\b(?:" +
  Utils.keys(vocabulary.province_code)
    .concat(Utils.values(vocabulary.province_code))
    .map(XRegExp.escape)
    .join("|") +
  ")\\b";

Address_Rules.direct = Utils.values(vocabulary.directional)
  .sort(function (a, b) {
    return a.length < b.length;
  })
  .reduce(function (prev, curr) {
    return prev.concat([XRegExp.escape(curr.replace(/\w/g, "$&.")), curr]);
  }, Utils.keys(vocabulary.directional))
  .join("|");

Address_Rules.dircode = Utils.keys(Direction_Code).join("|");
Address_Rules.corner = "(?:\\band\\b|\\bat\\b|&|\\@)";

Address_Rules.postalcode =
  "(?<fsa>[A-Za-z][0-9][A-Za-z])[ ]?(?<ldu>[0-9][A-Za-z][0-9])?";
Address_Rules.number =
  "(?<unit_number>(\\d+-?\\d*)|([N|S|E|W]\\d{1,3}[N|S|E|W]\\d{1,6}))(?=\\D)";

Address_Rules.street = `
(?:
  (?:(?<street_0>${Address_Rules.direct})\\W+
     (?<type_0>${Address_Rules.type})\\b
  )
  |
  (?:(?<prefix_0>${Address_Rules.direct}\\.?)\\W+)?
  (?:
    (?<street_1>[^,]*\\d)
    (?:[^\\w,]*(?<st_suffix_1>${Address_Rules.direct})\\b)
    |
    (?<street_2>((?!((${Address_Rules.type})\\w))[^,])+)
    (?:[^\\w,]+(?<type_2>${Address_Rules.type})\\b)
    (?:[^\\w,]+(?<st_suffix_2>${Address_Rules.direct})\\b)?
    |
    (?<street_3>[^,]+?)
    (?:[^\\w,]+(?<type_3>${Address_Rules.type})\\b)?
    (?:[^\\w,]+(?<st_suffix_3>${Address_Rules.direct})\\b)?
  )
)`;

Address_Rules.po_box = "p\\W*(?:[om]|ost\\ ?office)\\W*b(?:ox)?";

Address_Rules.sec_unit_type_numbered = `
(?<sec_unit_type_1>su?i?te
  |${Address_Rules.po_box}
  |(?:ap|dep)(?:ar)?(t|p)(?:me?nt)?
  |bureau
  |ro*m
  |flo*r?
  |uni?té?
  |bu?i?ldi?n?g
  |ha?nga?r
  |lo?t
  |pier
  |slip
  |spa?ce?
  |stop
  |tra?i?le?r
  |box)(?![a-z]
)
`;

Address_Rules.sec_unit_type_unnumbered = `
(?<sec_unit_type_2>ba?se?me?n?t
  |fro?nt
  |lo?bby
  |lowe?r
  |off?i?ce?
  |pe?n?t?ho?u?s?e?
  |rear
  |side
  |uppe?r
)\\b`;

Address_Rules.sec_unit = `
(?:  #fix3
  (?:  #fix1
    (?:
      (?:${Address_Rules.sec_unit_type_numbered}\\W*)
      |(?<sec_unit_type_3>\\#)\\W*
    )
    (?<sec_unit_num_1>[\\w-]+)
  )
  |
  ${Address_Rules.sec_unit_type_unnumbered}
)`;

Address_Rules.city_and_state = `
(?:
  (?<city>[^\\d,]+?)\\W+
  (?<state>${Address_Rules.province})
)
`;

Address_Rules.place = `
(?:${Address_Rules.city_and_state}\\W*)?
(?:${Address_Rules.postalcode})?
`;

// Main entry rules

Address_Rules.address = XRegExp(`
^
[^\\w\\#]*
(${Address_Rules.number})
(?:${Address_Rules.unit_suffix}\\W*)?
   ${Address_Rules.street}\\W+
(?:${Address_Rules.sec_unit})?\\W*  #fix2
    ${Address_Rules.place}
\\W*$`,'ix');

var sep = '(?:\\W+|$)'; // no support for \Z

Address_Rules.informal_address = XRegExp(`
  ^
  \\s*
  (?:${Address_Rules.sec_unit}${sep})?
  (?:${Address_Rules.number})?
  (?:${Address_Rules.unit_suffix}\\W*)?
      ${Address_Rules.street}${sep}
  (?:${Address_Rules.sec_unit.replace(/_\d/g,'$&1')}${sep})?
  (?:${Address_Rules.place})?
  `,'ix');

Address_Rules.po_address = XRegExp(`
  ^
  \\s*
  (?:${Address_Rules.sec_unit.replace(/_\d/g,'$&1')}${sep})?
  (?:${Address_Rules.place})?
  `,'ix');

Address_Rules.intersection = XRegExp(`
  ^\\W*
  ${Address_Rules.street.replace(/_\d/g,'1$&')}\\W*?
  \\s+${Address_Rules.corner}\\s+
  ${Address_Rules.street.replace(/_\d/g,'2$&')}($|\\W+)
  ${Address_Rules.place}\\W*$`,'ix');

export default{
  Normalization_Map,
  Normalization_Regex,
  Direction_Code,
  Address_Rules
};
