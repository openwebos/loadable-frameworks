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

function AddressTestsNZ() {
}

AddressTestsNZ.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("PO Box 10362\nWellington 6143\nNew Zealand", 'en_nz');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("PO Box 10362", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Wellington", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("6143", parsedAddress.postalCode);
	UnitTest.requireIdentical("New Zealand", parsedAddress.country);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("23 Kate Sheppard Place,\nThorndon\nWellington\nNew Zealand", 'en_nz');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("23 Kate Sheppard Place, Thorndon", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Wellington", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("New Zealand", parsedAddress.country);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("45a Clevedon-Takanini Rd\nArdmore\nAuckland 2582", 'en_nz');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("45a Clevedon-Takanini Rd, Ardmore", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Auckland", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("2582", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Level 6\nTower Centre\n45 Queen Street\nAuckland\n1010\nNew Zealand\n\n\n", 'en_nz');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Level 6, Tower Centre, 45 Queen Street", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Auckland", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("1010", parsedAddress.postalCode);
	UnitTest.requireIdentical("New Zealand", parsedAddress.country);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("70 Falsgrave St, Waltham, Christchurch 8011, New Zealand", 'en_nz');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("70 Falsgrave St, Waltham", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Christchurch", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("8011", parsedAddress.postalCode);
	UnitTest.requireIdentical("New Zealand", parsedAddress.country);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\t29b Bolt Rd\n\n\r\r\t\n   Tahuna\n\t\r\rNelson\r5678\r\r\n\r\n\tNew\tZealand\n\n\n", 'en_nz');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("29b Bolt Rd, Tahuna", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Nelson", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("5678", parsedAddress.postalCode);
	UnitTest.requireIdentical("New Zealand", parsedAddress.country);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("70 Falsgrave St Waltham Christchurch 8011 New Zealand", 'en_nz');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("70 Falsgrave St Waltham", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Christchurch", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("8011", parsedAddress.postalCode);
	UnitTest.requireIdentical("New Zealand", parsedAddress.country);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("70 Falsgrave St\nWaltham\nChristchurch 8011\nNew Zealand", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("70 Falsgrave St, Waltham", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Christchurch", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("8011", parsedAddress.postalCode);
	UnitTest.requireIdentical("New Zealand", parsedAddress.country);
	UnitTest.requireIdentical("nz", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNZ.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "70 Falsgrave St, Waltham",
		locality: "Christchurch",
		postalCode: "8011",
		country: "New Zealand",
		countryCode: "nz",
		locale: {language: 'en', region: 'nz'}
	};
	
	var expected = "70 Falsgrave St, Waltham\nChristchurch 8011\nNew Zealand";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_nz'));

	return UnitTest.passed;
};

AddressTestsNZ.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "70 Falsgrave St, Waltham",
		locality: "Christchurch",
		postalCode: "8011",
		country: "New Zealand",
		countryCode: "nz",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "70 Falsgrave St, Waltham\nChristchurch 8011\nNew Zealand";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
