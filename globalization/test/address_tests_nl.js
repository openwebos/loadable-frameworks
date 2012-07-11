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

function AddressTestsNL() {
}

AddressTestsNL.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Achterberglaan 23, 2345 GD Uithoorn, Nederland", 'nl_nl');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Achterberglaan 23", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Uithoorn", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("2345 GD", parsedAddress.postalCode);
	UnitTest.requireIdentical("Nederland", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("Achterberglaan 23, Uithoorn, Nederland", 'nl_nl');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Achterberglaan 23", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Uithoorn", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("Nederland", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Claude Debussylaan 34\nVinoly Mahler 4\nToren B\n15th Floor\n1082 MD\nAmsterdam\nNederland", 'nl_nl');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Claude Debussylaan 34, Vinoly Mahler 4, Toren B, 15th Floor", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Amsterdam", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("1082 MD", parsedAddress.postalCode);
	UnitTest.requireIdentical("Nederland", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("Startbaan 16, 1187 XR Amstelveen, Nederland", 'nl_nl');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Startbaan 16", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Amstelveen", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("1187 XR", parsedAddress.postalCode);
	UnitTest.requireIdentical("Nederland", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("Startbaan 16,   \n\t\n 1187 XR \t\t Amstelveen,\n\n\n Nederland  \n  \t\t\t", 'nl_nl');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Startbaan 16", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Amstelveen", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("1187 XR", parsedAddress.postalCode);
	UnitTest.requireIdentical("Nederland", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("Startbaan 16 1187 XR Amstelveen Nederland", 'nl_nl');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Startbaan 16", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Amstelveen", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("1187 XR", parsedAddress.postalCode);
	UnitTest.requireIdentical("Nederland", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Óók 16, 1187 XR s'Hertogen-bósch, Nederland", 'nl_nl');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Óók 16", parsedAddress.streetAddress);
	UnitTest.requireIdentical("s'Hertogen-bósch", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("1187 XR", parsedAddress.postalCode);
	UnitTest.requireIdentical("Nederland", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Achterberglaan 23, 2345 GD Uithoorn, The Netherlands", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Achterberglaan 23", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Uithoorn", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("2345 GD", parsedAddress.postalCode);
	UnitTest.requireIdentical("The Netherlands", parsedAddress.country);
	UnitTest.requireIdentical("nl", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsNL.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Achterberglaan 23",
		locality: "Uithoorn",
		postalCode: "2345 GD",
		country: "Nederland",
		countryCode: "nl",
		locale: {language: 'nl', region: 'nl'}
	};
	
	var expected = "Achterberglaan 23\n2345 GD Uithoorn\nNederland";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'nl_nl'));

	return UnitTest.passed;
};

AddressTestsNL.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Achterberglaan 23",
		locality: "Uithoorn",
		postalCode: "2345 GD",
		country: "Netherlands",
		countryCode: "nl",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "Achterberglaan 23\n2345 GD Uithoorn\nNetherlands";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
