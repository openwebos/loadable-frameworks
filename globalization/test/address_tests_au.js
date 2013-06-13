// @@@LICENSE
//
//      Copyright (c) 2010-2013 LG Electronics, Inc.
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
 * 
 */

/*globals Globalization IMPORTS UnitTest */

var webos = IMPORTS.require("webos");
webos.include("test/loadall.js");

function AddressTestsAU() {
}

AddressTestsAU.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Level 5, 48 Pirrama Road,\nPyrmont, NSW 2009\nAustralia", 'en_au');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Level 5, 48 Pirrama Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Pyrmont", parsedAddress.locality);
	UnitTest.requireIdentical("NSW", parsedAddress.region);
	UnitTest.requireIdentical("2009", parsedAddress.postalCode);
	UnitTest.requireIdentical("Australia", parsedAddress.country);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("Canberra Nara Centre,\n1 Constitution Ave\nCanberra City, Australia", 'en_au');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Canberra Nara Centre, 1 Constitution Ave", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Canberra City", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("Australia", parsedAddress.country);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("Trevarrick Rd\nSevenhill SA 5453", 'en_au');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Trevarrick Rd", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Sevenhill", parsedAddress.locality);
	UnitTest.requireIdentical("SA", parsedAddress.region);
	UnitTest.requireIdentical("5453", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Dept of Treasury\nLangton Crs\nParkes\nACT 2600\nAustralia\n\n\n", 'en_au');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Dept of Treasury, Langton Crs", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Parkes", parsedAddress.locality);
	UnitTest.requireIdentical("ACT", parsedAddress.region);
	UnitTest.requireIdentical("2600", parsedAddress.postalCode);
	UnitTest.requireIdentical("Australia", parsedAddress.country);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("630 Beaufort St, Mt Lawley, WA 6050, Australia", 'en_au');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("630 Beaufort St", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Mt Lawley", parsedAddress.locality);
	UnitTest.requireIdentical("WA", parsedAddress.region);
	UnitTest.requireIdentical("6050", parsedAddress.postalCode);
	UnitTest.requireIdentical("Australia", parsedAddress.country);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tPiccadilly\t\t\r  Lot 6B Spring \r\r\tGully Rd\nPiccadilly \n\t\rSA \r\t\n5151\nAustralia    \n\n\n", 'en_au');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Piccadilly Lot 6B Spring Gully Rd", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Piccadilly", parsedAddress.locality);
	UnitTest.requireIdentical("SA", parsedAddress.region);
	UnitTest.requireIdentical("5151", parsedAddress.postalCode);
	UnitTest.requireIdentical("Australia", parsedAddress.country);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("630 Beaufort St Mt Lawley WA 6050 Australia", 'en_au');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("630 Beaufort St", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Mt Lawley", parsedAddress.locality);
	UnitTest.requireIdentical("WA", parsedAddress.region);
	UnitTest.requireIdentical("6050", parsedAddress.postalCode);
	UnitTest.requireIdentical("Australia", parsedAddress.country);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Shp1/ Wanneroo Rd\nLandsdale WA 6065\nAustralia", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Shp1/ Wanneroo Rd", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Landsdale", parsedAddress.locality);
	UnitTest.requireIdentical("WA", parsedAddress.region);
	UnitTest.requireIdentical("6065", parsedAddress.postalCode);
	UnitTest.requireIdentical("Australia", parsedAddress.country);
	UnitTest.requireIdentical("au", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsAU.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Shp1/ Wanneroo Rd",
		locality: "Landsdale",
		region: "WA",
		postalCode: "6065",
		country: "Australia",
		countryCode: "au",
		locale: {language: 'en', region: 'au'}
	};
	
	var expected = "Shp1/ Wanneroo Rd\nLandsdale WA 6065\nAustralia";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_au'));

	return UnitTest.passed;
};

AddressTestsAU.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Shp1/ Wanneroo Rd",
		locality: "Landsdale",
		region: "WA",
		postalCode: "6065",
		country: "Australia",
		countryCode: "au",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "Shp1/ Wanneroo Rd\nLandsdale WA 6065\nAustralia";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
