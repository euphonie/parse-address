// Copyright (c) 2014-2015, hassansin
//
// Port to ES6 based on: https://github.com/hassansin/parse-address
//Perl Ref: http://cpansearch.perl.org/src/TIMB/Geo-StreetAddress-US-1.04/US.pm
import Utils from "./utils";
import { grammars } from "./grammars/rules";
import XRegExp from "xregexp";

export class AddressParser {
  constructor(country) {
    let root = this;
    root.country = country;
    root.parser = {};
    root.initialized = false;
    root.rules = {};

    root.grammar = grammars[root.country];
  }

  normalize_address(parts) {
    if (!parts) return null;
    var parsed = {};
    const grammarRules = this.grammar;

    Object.keys(parts).forEach(function (k) {
      if (["input", "index"].indexOf(k) !== -1 || isFinite(k)) return;
      var key = isFinite(k.split("_").pop())
        ? k.split("_").slice(0, -1).join("_")
        : k;
      if (parts[k]) parsed[key] = parts[k].trim().replace(grammarRules.Normalization_Regex, "");
    });
    Utils.each(grammarRules.Normalization_Map, function (map, key) {
      if (parsed[key] && map[parsed[key].toLowerCase()]) {
        parsed[key] = map[parsed[key].toLowerCase()];
      }
    });

    ["type", "type1", "type2"].forEach(function (key) {
      if (key in parsed)
        parsed[key] =
          parsed[key].charAt(0).toUpperCase() +
          parsed[key].slice(1).toLowerCase();
    });

    if (parsed.city) {
      parsed.city = XRegExp.replace(
        parsed.city,
        XRegExp(
          "^(?<dircode>" +
            grammarRules.Address_Rules.dircode +
            ")\\s+(?=\\S)",
          "ix"
        ),
        function (match) {
          return (
            Utils.capitalize(
              grammarRules.Direction_Code[match.dircode.toUpperCase()]
            ) + " "
          );
        }
      );
    }
    return parsed;
  }

  parseAddress(address) {
    var parts = XRegExp.exec(
      address,
      this.grammar.Address_Rules.address
    );
    return this.normalize_address(parts);
  }

  parseInformalAddress(address) {
    var parts = XRegExp.exec(
      address,
      this.grammar.Address_Rules.informal_address
    );
    return this.normalize_address(parts);
  }

  parsePoAddress(address) {
    var parts = XRegExp.exec(
      address,
      this.grammar.Address_Rules.po_address
    );
    return this.normalize_address(parts);
  }

  parseLocation(address) {
    if (
      XRegExp(this.grammar.Address_Rules.corner, "xi").test(
        address
      )
    ) {
      return this.parseIntersection(address);
    }
    if (
      XRegExp("^" + this.grammar.Address_Rules.po_box, "xi").test(
        address
      )
    ) {
      return this.parsePoAddress(address);
    }
    return this.parseAddress(address) || this.parseInformalAddress(address);
  }

  parseIntersection(address) {
    var parts = XRegExp.exec(
      address,
      this.grammar.Address_Rules.intersection
    );
    parts = this.normalize_address(parts);
    if (parts) {
      parts.type2 = parts.type2 || "";
      parts.type1 = parts.type1 || "";
      if ((parts.type2 && !parts.type1) || parts.type1 === parts.type2) {
        var type = parts.type2;
        type = XRegExp.replace(type, /s\W*$/, "");
        if (
          XRegExp(
            "^" + this.grammar.Address_Rules.type + "$",
            "ix"
          ).test(type)
        ) {
          parts.type1 = parts.type2 = type;
        }
      }
    }

    return parts;
  }
}
