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
 * @fileOverview test the address parsing and formatting routines in the Netherlands.
 */

/*globals Globalization IMPORTS UnitTest */

var webos = IMPORTS.require("webos");
webos.include("test/loadall.js");

function AddressTestsDE() {
}

AddressTestsDE.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Herrenberger Straße 140, 71034 Böblingen, Deutschland", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Herrenberger Straße 140", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Böblingen", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("71034", parsedAddress.postalCode);
	UnitTest.requireIdentical("Deutschland", parsedAddress.country);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("Berliner Straße 111, Ratingen, Deutschland", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Berliner Straße 111", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Ratingen", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("Deutschland", parsedAddress.country);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("Herrenberger Straße 140, 71034 Böblingen", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Herrenberger Straße 140", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Böblingen", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("71034", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Altrottstraße 31\nPartner Port SAP\n69190\nWalldorf/Baden\nDeutschland\n\n\n", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Altrottstraße 31, Partner Port SAP", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Walldorf/Baden", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("69190", parsedAddress.postalCode);
	UnitTest.requireIdentical("Deutschland", parsedAddress.country);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("ABC-Strasse 19, 20354 Hamburg, Deutschland", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("ABC-Strasse 19", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Hamburg", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("20354", parsedAddress.postalCode);
	UnitTest.requireIdentical("Deutschland", parsedAddress.country);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tAltrottstraße 31\n\n\nPartner Port SAP\n   \t\n69190\n   \r\t\n Walldorf/Baden\n   \t \t \t Deutschland\n\n\n", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Altrottstraße 31, Partner Port SAP", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Walldorf/Baden", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("69190", parsedAddress.postalCode);
	UnitTest.requireIdentical("Deutschland", parsedAddress.country);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("ABC-Strasse 19 20354 Hamburg Deutschland", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("ABC-Strasse 19", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Hamburg", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("20354", parsedAddress.postalCode);
	UnitTest.requireIdentical("Deutschland", parsedAddress.country);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Geschäftsstelle Lützowplatz 15\n(Eingang Einemstraße 24)\n10785 Würtzheim", 'de_de');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Geschäftsstelle Lützowplatz 15, (Eingang Einemstraße 24)", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Würtzheim", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("10785", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Dienerstrasse 12\n80331 Munich\nGermany", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Dienerstrasse 12", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Munich", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("80331", parsedAddress.postalCode);
	UnitTest.requireIdentical("Germany", parsedAddress.country);
	UnitTest.requireIdentical("de", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsDE.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Dienerstrasse 12",
		locality: "München",
		postalCode: "80331",
		country: "Deutschland",
		countryCode: "de",
		locale: {language: 'de', region: 'de'}
	};
	
	var expected = "Dienerstrasse 12\n80331 München\nDeutschland";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'de_de'));

	return UnitTest.passed;
};

AddressTestsDE.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Dienerstrasse 12",
		locality: "Munich",
		postalCode: "80331",
		country: "Germany",
		countryCode: "de",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "Dienerstrasse 12\n80331 Munich\nGermany";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
