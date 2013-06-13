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
 * @name address_tests.js
 * @fileOverview test the address parsing and formatting routines
 * 
 */

/*globals Globalization IMPORTS UnitTest */

var webos = IMPORTS.require("webos");
webos.include("test/loadall.js");

function AddressTestsCA() {
}

AddressTestsCA.prototype.testParseAddressSimple = function () {
	var parsedAddress = Globalization.Address.parseAddress("5150 Spectrum Way\nMississauga, ON\nL4W 5G1\nCanada", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "5150 Spectrum Way");
	UnitTest.requireIdentical(parsedAddress.locality, "Mississauga");
	UnitTest.requireIdentical(parsedAddress.region, "ON");
	UnitTest.requireIdentical(parsedAddress.postalCode, "L4W 5G1");
	UnitTest.requireIdentical(parsedAddress.country, "Canada");
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

// to verify NOV-111026
AddressTestsCA.prototype.testParseAddressWithAccents = function () {
	var parsedAddress = Globalization.Address.parseAddress("1253 McGill College\nSuite 250\nMontréal, QC, H2B 2Y5", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "1253 McGill College, Suite 250");
	UnitTest.requireIdentical(parsedAddress.locality, "Montréal");
	UnitTest.requireIdentical(parsedAddress.region, "QC");
	UnitTest.requireIdentical(parsedAddress.postalCode, "H2B 2Y5");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressSpelledOutProvince = function () {
	var parsedAddress = Globalization.Address.parseAddress("340 Hagey Blvd\n2nd Floor\nWaterloo, Ontario, N2L 6R6", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "340 Hagey Blvd, 2nd Floor");
	UnitTest.requireIdentical(parsedAddress.locality, "Waterloo");
	UnitTest.requireIdentical(parsedAddress.region, "Ontario");
	UnitTest.requireIdentical(parsedAddress.postalCode, "N2L 6R6");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressSpelledOutProvinceWithSpaces = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Main St.\nMyTown, Prince Edward Island A1B 2C3\nCanada", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Main St.");
	UnitTest.requireIdentical(parsedAddress.locality, "MyTown");
	UnitTest.requireIdentical(parsedAddress.region, "Prince Edward Island");
	UnitTest.requireIdentical(parsedAddress.postalCode, "A1B 2C3");
	UnitTest.requireIdentical(parsedAddress.country, "Canada");
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Main St.\nMyTown, AB\nCanada", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Main St.");
	UnitTest.requireIdentical(parsedAddress.locality, "MyTown");
	UnitTest.requireIdentical(parsedAddress.region, "AB");
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical(parsedAddress.country, "Canada");
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("950 W 21st Ave\nApt 45\nCambridge\nON\nA4C 5N4", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "950 W 21st Ave, Apt 45");
	UnitTest.requireIdentical(parsedAddress.locality, "Cambridge");
	UnitTest.requireIdentical(parsedAddress.region, "ON");
	UnitTest.requireIdentical(parsedAddress.postalCode, "A4C 5N4");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("5150 Spectrum Way, Mississauga, ON, L4W 5G1, Canada", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "5150 Spectrum Way");
	UnitTest.requireIdentical(parsedAddress.locality, "Mississauga");
	UnitTest.requireIdentical(parsedAddress.region, "ON");
	UnitTest.requireIdentical(parsedAddress.postalCode, "L4W 5G1");
	UnitTest.requireIdentical(parsedAddress.country, "Canada");
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("5150 Spectrum Way\n  \t \t Mississauga, \n   \t ON, \n, \n\n L4W 5G1   \n  Canada\n\n   \n\n", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "5150 Spectrum Way");
	UnitTest.requireIdentical(parsedAddress.locality, "Mississauga");
	UnitTest.requireIdentical(parsedAddress.region, "ON");
	UnitTest.requireIdentical(parsedAddress.postalCode, "L4W 5G1");
	UnitTest.requireIdentical(parsedAddress.country, "Canada");
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("5150 Spectrum Way Mississauga ON L4W 5G1 Canada", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "5150 Spectrum Way");
	UnitTest.requireIdentical(parsedAddress.locality, "Mississauga");
	UnitTest.requireIdentical(parsedAddress.region, "ON");
	UnitTest.requireIdentical(parsedAddress.postalCode, "L4W 5G1");
	UnitTest.requireIdentical(parsedAddress.country, "Canada");
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressPOBox = function () {
	var parsedAddress = Globalization.Address.parseAddress("P.O. Box 350\nToronto ON Y5T 5T5", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "P.O. Box 350");
	UnitTest.requireIdentical(parsedAddress.locality, "Toronto");
	UnitTest.requireIdentical(parsedAddress.region, "ON");
	UnitTest.requireIdentical(parsedAddress.postalCode, "Y5T 5T5");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressFrench = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Montée Lavalle\nÉparnay, Nouveau-Brunswick Y7Y 7Y7", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Montée Lavalle");
	UnitTest.requireIdentical(parsedAddress.locality, "Éparnay");
	UnitTest.requireIdentical(parsedAddress.region, "Nouveau-Brunswick");
	UnitTest.requireIdentical(parsedAddress.postalCode, "Y7Y 7Y7");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "ca");
	
	return UnitTest.passed;
};

AddressTestsCA.prototype.testParseAddressForeign = function () {
	var parsedAddress = Globalization.Address.parseAddress("Achterberglaan 23, 2345 GD Uithoorn, Netherlands", 'en_ca');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "Achterberglaan 23");
	UnitTest.requireIdentical(parsedAddress.locality, "Uithoorn");
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical(parsedAddress.postalCode, "2345 GD");
	UnitTest.requireIdentical(parsedAddress.country, "Netherlands");
	UnitTest.requireIdentical(parsedAddress.countryCode, "nl");
	
	return UnitTest.passed;
};
	
AddressTestsCA.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "5150 Spectrum Way",
		locality: "Mississauga",
		region: "Ontario",
		postalCode: "L4W 5G1",
		country: "Canada",
		countryCode: "ca",
		locale: {language: 'en', region: 'ca'}
	};
	
	var expected = "5150 Spectrum Way\nMississauga, Ontario L4W 5G1\nCanada";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_ca'));

	return UnitTest.passed;
};

/*
canada:

5150 Spectrum Way
Mississauga, Ontario
L4W 5G1
Canada

1253 McGill College, Suite 250
Montreal, Quebec, H2B 2Y5

340 Hagey Blvd
2nd Floor
Waterloo, Ontario, N2L 6R6

10 Dundas Street East
Suite 600
Toronto, Ontario M5B 2G9


*/
