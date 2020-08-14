# Street Address Parser

This is Node.js port for Perl [Geo::StreetAddress::US](http://search.cpan.org/~timb/Geo-StreetAddress-US-1.04/US.pm) package

*Description from Geo::StreetAddress::US*:

>Geo::StreetAddress::US is a regex-based street address and street intersection parser for the United States. Its basic goal is to be as forgiving as possible when parsing user-provided address strings. Geo::StreetAddress::US knows about directional prefixes and suffixes, fractional building numbers, building units, grid-based addresses (such as those used in parts of Utah), 5 and 9 digit ZIP codes, and all of the official USPS abbreviations for street types and state names... [more](http://search.cpan.org/~timb/Geo-StreetAddress-US-1.04/US.pm)


## Last Changes

The code was ported as ES6 modules and address grammars (set of rules) can now be defined for a wider list of countries. Works in browser and node.

## Usage:

```javascript
//from node:
var AddressParser = require('parse-address');
var parser = new AddressParser('us');
var parsed = parser.parseLocation('1005 N Gravenstein Highway Sebastopol CA 95472');

//from browser:
<script type="text/javascript" src="./parse-address.min.js"></script>
var parser = new AddressParser('ca');
var parsed = parser.parseLocation('1005 N Gravenstein Highway Sebastopol CA 95472');

//Parsed address:
{
 number: '1005',
 prefix: 'N',
 street: 'Gravenstein',
 type: 'Hwy',
 city: 'Sebastopol',
 state: 'CA',
 zip: '95472' }
```
