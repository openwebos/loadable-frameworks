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
 */

/*globals Globalization IMPORTS UnitTest */

var webos = IMPORTS.require("webos");
webos.include("test/loadall.js");

function AddressTestsGB() {
}

AddressTestsGB.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Belgrave House\n76 Buckingham Palace Road\nLondon SW1W 9TQ\nUnited Kingdom", 'en_gb');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Belgrave House, 76 Buckingham Palace Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("London", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("SW1W 9TQ", parsedAddress.postalCode);
	UnitTest.requireIdentical("United Kingdom", parsedAddress.country);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("Peter House\nOxford Street\nManchester", 'en_gb');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Peter House, Oxford Street", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Manchester", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("88 Wood Street\nLondon\nEC2V 7QT", 'en_gb');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("88 Wood Street", parsedAddress.streetAddress);
	UnitTest.requireIdentical("London", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("EC2V 7QT", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("2 Kelvin Close\nBirchwood Science Park North\nNorth Risley\nWarrington\nCheshire\nWA3 7PB\nUK", 'en_gb');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("2 Kelvin Close, Birchwood Science Park North, North Risley, Warrington", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Cheshire", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("WA3 7PB", parsedAddress.postalCode);
	UnitTest.requireIdentical("UK", parsedAddress.country);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("Amen Corner, Cain Road, Bracknell, Berkshire, RG12 1HN, England", 'en_gb');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Amen Corner, Cain Road, Bracknell", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Berkshire", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("RG12 1HN", parsedAddress.postalCode);
	UnitTest.requireIdentical("England", parsedAddress.country);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tAmen Corner\n\t\t\tCain Road, \t\t\t\r\r Bracknell, \n \r \tBerkshire, \n\t\nRG12 1HN\t\n\t England\n\n\n", 'en_gb');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Amen Corner, Cain Road, Bracknell", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Berkshire", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("RG12 1HN", parsedAddress.postalCode);
	UnitTest.requireIdentical("England", parsedAddress.country);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("Amen Corner Cain Road Bracknell Berkshire RG12 1HN England", 'en_gb');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Amen Corner Cain Road Bracknell", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Berkshire", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("RG12 1HN", parsedAddress.postalCode);
	UnitTest.requireIdentical("England", parsedAddress.country);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testParseAddressFromDE = function () {
	var parsedAddress = Globalization.Address.parseAddress("Belgrave House\n76 Buckingham Palace Road\nLondon SW1W 9TQ\nGroßbritannien", 'de_de');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Belgrave House, 76 Buckingham Palace Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("London", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("SW1W 9TQ", parsedAddress.postalCode);
	UnitTest.requireIdentical("Großbritannien", parsedAddress.country);
	UnitTest.requireIdentical("gb", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsGB.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Belgrave House, 76 Buckingham Palace Road",
		locality: "London",
		postalCode: "SW1W 9TQ",
		country: "Old Blighty",
		countryCode: "gb",
		locale: {language: 'en', region: 'gb'}
	};
	
	var expected = "Belgrave House, 76 Buckingham Palace Road\nLondon\nSW1W 9TQ\nOld Blighty";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_gb'));

	return UnitTest.passed;
};

AddressTestsGB.prototype.testFormatAddressFromDE = function () {
	var parsedAddress = {
		streetAddress: "Belgrave House, 76 Buckingham Palace Road",
		locality: "London",
		postalCode: "SW1W 9TQ",
		country: "Old Blighty",
		countryCode: "gb",
		locale: {language: 'de', region: 'de'}
	};
	
	var expected = "Belgrave House, 76 Buckingham Palace Road\nLondon\nSW1W 9TQ\nOld Blighty";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'de_de'));

	return UnitTest.passed;
};
