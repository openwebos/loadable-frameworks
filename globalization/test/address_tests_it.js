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

function AddressTestsIT() {
}

AddressTestsIT.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Corso Europa 2\n20122 Milan\nItalia", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Corso Europa 2", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Milan", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("20122", parsedAddress.postalCode);
	UnitTest.requireIdentical("Italia", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("C.so Trapani 16\nTorino\nItalia", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("C.so Trapani 16", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Torino", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("Italia", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("Corso Europa 2\n20122 Milan", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Corso Europa 2", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Milan", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("20122", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressWithRegion = function () {
	var parsedAddress = Globalization.Address.parseAddress("via Paná, 56\n35027 Noventa Padovana (PD)", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("via Paná, 56", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Noventa Padovana", parsedAddress.locality);
	UnitTest.requireIdentical("(PD)", parsedAddress.region);
	UnitTest.requireIdentical("35027", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressWithRegion2 = function () {
	var parsedAddress = Globalization.Address.parseAddress("via Napoli 45\n96017 Noto (SR)\nItalia", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("via Napoli 45", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Noto", parsedAddress.locality);
	UnitTest.requireIdentical("(SR)", parsedAddress.region);
	UnitTest.requireIdentical("96017", parsedAddress.postalCode);
	UnitTest.requireIdentical("Italia", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Centro Direzionale\nFab. 1 G/7\n80143\nNapoli\nItalia\n", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Centro Direzionale, Fab. 1 G/7", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Napoli", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("80143", parsedAddress.postalCode);
	UnitTest.requireIdentical("Italia", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("Via Achille Campanile 85, 00144 ROMA, Italia", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Via Achille Campanile 85", parsedAddress.streetAddress);
	UnitTest.requireIdentical("ROMA", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("00144", parsedAddress.postalCode);
	UnitTest.requireIdentical("Italia", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tVia Achille   \t\t\t Campanile 85,\n\n\t\r\t00144\t\t\t\n ROMA\t\t\n\r\r Italia\n\n\n", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Via Achille Campanile 85", parsedAddress.streetAddress);
	UnitTest.requireIdentical("ROMA", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("00144", parsedAddress.postalCode);
	UnitTest.requireIdentical("Italia", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("Via Achille Campanile 85 00144 ROMA Italia", 'it_it');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Via Achille Campanile 85", parsedAddress.streetAddress);
	UnitTest.requireIdentical("ROMA", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("00144", parsedAddress.postalCode);
	UnitTest.requireIdentical("Italia", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Via Achille Campanile 85\n00144 ROMA\nItaly", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Via Achille Campanile 85", parsedAddress.streetAddress);
	UnitTest.requireIdentical("ROMA", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("00144", parsedAddress.postalCode);
	UnitTest.requireIdentical("Italy", parsedAddress.country);
	UnitTest.requireIdentical("it", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsIT.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Corso Europa 2",
		locality: "Milan",
		postalCode: "20122",
		country: "Italia",
		countryCode: "it",
		locale: {language: 'it', region: 'it'}
	};
	
	var expected = "Corso Europa 2\n20122 Milan \nItalia";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'it_it'));

	return UnitTest.passed;
};

AddressTestsIT.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Corso Europa 2",
		locality: "Milan",
		postalCode: "20122",
		country: "Italia",
		countryCode: "it",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "Corso Europa 2\n20122 Milan \nItalia";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
