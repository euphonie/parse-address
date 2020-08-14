import AddressParser from "../src/address";
import { deepEqual } from "assert";

describe('Validate addresses',  () => {

  const address_scenarios = {
    "8483 San Pablo Street Gloucester, ON K1B 1L8": {
      unit_number: "8483",
      street: "San Pablo",
      type: "St",
      city: "Gloucester",
      state: "ON",
      fsa: "K1B",
      ldu: "1L8",
    },
    "19 Miller Rd. Keswick, ON L4P 1L1": {
      unit_number: "19",
      street: "Miller",
      type: "Rd",
      city: "Keswick",
      state: "ON",
      fsa: "L4P",
      ldu: "1L1"
    },
    "177 Corona Street Mont-Joli, QC G5H 2Y5": {
      unit_number: "177",
      street: "Corona",
      type: "St",
      city: "Mont-Joli",
      state: "QC",
      fsa: "G5H",
      ldu: "2Y5"
    },
    "68 N. Gonzales Lane Vancouver, BC V5K 5A8": {
      unit_number: "68",
      prefix: "N.",
      street: "Gonzales",
      type: "Ln",
      city: "Vancouver",
      state: "BC",
      fsa: "V5K",
      ldu: "5A8"
    },
    // Test apparent multiple street types
    // place + st
    "19 Errol place St. John's NL A1A 5H6": {
      unit_number: "19",
      street: "Errol",
      type: "Pl",
      city: "St. John's",
      state: "NL",
      fsa: "A1A",
      ldu: "5H6"
    },
    // station + rue
    "1325 Takahana station Rue Paris AB T5T 1E5": {
      unit_number: "1325",
      street: "Takahana",
      type: "Sta",
      city: "Rue Paris",
      state: "AB",
      fsa: "T5T",
      ldu: "1E5"
    },
    "14205 96 Ave NW NW Edmonton AB T5N 0C2": {
      unit_number: "14205",
      street: "96",
      type: "Ave",
      suffix: "NW",
      city: "Northwest Edmonton",
      state: "AB",
      fsa: "T5N",
      ldu: "0C2"
    },
    "1 Argyle St. L'Île-Des-Soeurs, QC H3E 5T5": {
      unit_number: "1",
      street: "Argyle",
      type: "St",
      city: "L'Île-Des-Soeurs",
      state: "QC",
      fsa: "H3E",
      ldu: "5T5"
    },
    "10-123 1/2 main st nw Montréal, QC H3Z 2Y7": {
      unit_number: "10",
      civic_number: "123",
      street: "main",
      type: "St",
      suffix: "nw",
      city: "Montréal",
      state: "QC",
      fsa: "H3Z",
      ldu: "2Y7"
    },
    "64 Cumberland Cres St. John's NL A1B 3M5": {
      unit_number: "64",
      street: "Cumberland",
      type: "Cres",
      city: "St. John's",
      state: "NL",
      fsa: "A1B",
      ldu: "3M5"
    }
  };

  const parser = new AddressParser("ca");

  it('should get same result from address_scenarios when parsing strings', done => {
    Object.keys(address_scenarios).forEach(function (k) {
      var parsed = parser.parseLocation(k);
      deepEqual(
        address_scenarios[k],
        parsed,
        k +
          " was not correctly applied. " +
          " Expected: " +
          JSON.stringify(address_scenarios[k], null, 4) +
          " Result: " +
          JSON.stringify(parsed, null, 4)
      );
    });
    done();
  });
});
