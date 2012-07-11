// @@@LICENSE
//
//      Copyright (c) 2010-2012 Hewlett-Packard Development Company, L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// LICENSE@@@

/*$
 * @name address_tests_nl.js
 * @fileOverview test the address parsing and formatting routines in the Netherlands
 */

/*globals Globalization IMPORTS UnitTest */

var webos = IMPORTS.require("webos");
webos.include("test/loadall.js");

function AddressTestsIE() {
}

AddressTestsIE.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Gordon House\nBarrow Street\nDublin 4\nIreland", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Gordon House, Barrow Street", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Dublin", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("4", parsedAddress.postalCode);
	UnitTest.requireIdentical("Ireland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("Metro Park\nCloughfern Avenue\nNewtownabbey\nCo. Antrim\nIreland", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Metro Park, Cloughfern Avenue", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Newtownabbey", parsedAddress.locality);
	UnitTest.requireIdentical("Co. Antrim", parsedAddress.region);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Ireland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("Liffey Park Technology Campus\nBarnhall Road\nLeixlip\nCo Kildare", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Liffey Park Technology Campus, Barnhall Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Leixlip", parsedAddress.locality);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Co Kildare", parsedAddress.region);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressDublinPostalCode = function () {
	var parsedAddress = Globalization.Address.parseAddress("Gordon House\nBarrow Street\nDublin D6W\nIreland", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Gordon House, Barrow Street", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Dublin", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("D6W", parsedAddress.postalCode);
	UnitTest.requireIdentical("Ireland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Belfield Office Park\nBeaver Row\nClonskeagh\nDublin 4\nIreland\n\n", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Belfield Office Park, Beaver Row, Clonskeagh", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Dublin", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("4", parsedAddress.postalCode);
	UnitTest.requireIdentical("Ireland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("Swords Business Campus, Balheary Road, Swords, County: Dublin, Ireland", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Swords Business Campus, Balheary Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Swords", parsedAddress.locality);
	UnitTest.requireIdentical("County: Dublin", parsedAddress.region);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Ireland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tSwords Business Campus\n\t\r Balheary Road\n\t\n\tSwords\   \t \t \t   County:    Dublin   \n\n\t Ireland  \n\n\n", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Swords Business Campus, Balheary Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Swords", parsedAddress.locality);
	UnitTest.requireIdentical("County: Dublin", parsedAddress.region);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Ireland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("Swords Business Campus Balheary Road Swords County: Dublin Ireland", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Swords Business Campus Balheary Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Swords", parsedAddress.locality);
	UnitTest.requireIdentical("County: Dublin", parsedAddress.region);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Ireland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Teach Ceilteach, Sráid Doire, Cill Iníon Léinín, Tamhlacht, Contae Átha Cliath, Éire", 'en_ie');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Teach Ceilteach, Sráid Doire, Cill Iníon Léinín", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Tamhlacht", parsedAddress.locality);
	UnitTest.requireIdentical("Contae Átha Cliath", parsedAddress.region);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Éire", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Metro Park\nCloughfern Avenue\nNewtownabbey\nCo. Antrim\nIrland", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Metro Park, Cloughfern Avenue", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Newtownabbey", parsedAddress.locality);
	UnitTest.requireIdentical("Co. Antrim", parsedAddress.region);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Irland", parsedAddress.country);
	UnitTest.requireIdentical("ie", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIE.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Gordon House, Barrow Street",
		locality: "Dublin",
		postalCode: "4",
		country: "Ireland",
		countryCode: "ie",
		locale: {language: 'en', region: 'ie'}
	};
	
	var expected = "Gordon House, Barrow Street\nDublin 4\nIreland";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_ie'));

	return UnitTest.passed;
};

AddressTestsIE.prototype.testFormatAddressWithCounty = function () {
	var parsedAddress = {
		streetAddress: "Gordon House, Barrow Street",
		locality: "Galway",
		region: "County Galway",
		country: "Ireland",
		countryCode: "ie",
		locale: {language: 'en', region: 'ie'}
	};
	
	var expected = "Gordon House, Barrow Street\nGalway \nCounty Galway\nIreland";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_ie'));

	return UnitTest.passed;
};

AddressTestsIE.prototype.testFormatAddressFromFR = function () {
	var parsedAddress = {
		streetAddress: "Gordon House, Barrow Street",
		locality: "Dublin",
		postalCode: "4",
		country: "Irlande",
		countryCode: "ie",
		locale: {language: 'fr', region: 'fr'}
	};
	
	var expected = "Gordon House, Barrow Street\nDublin 4\nIrlande";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'fr_fr'));

	return UnitTest.passed;
};
