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

function AddressTestsFR() {
}

AddressTestsFR.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("38 avenue de l‘Opéra\n75002 Paris\nFrance", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("38 avenue de l‘Opéra", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Paris", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("75002", parsedAddress.postalCode);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("80 rue Camille Desmoulins\nIssy-les-Moulineaux\nFrance", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("80 rue Camille Desmoulins", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Issy-les-Moulineaux", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("38 avenue de l‘Opéra\n75002 Paris", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("38 avenue de l‘Opéra", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Paris", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("75002", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressCedex = function () {
	var parsedAddress = Globalization.Address.parseAddress("38 avenue de l‘Opéra\n75002 Paris cedex 9\nFrance", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("38 avenue de l‘Opéra", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Paris", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("75002 cedex 9", parsedAddress.postalCode);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Technoparc de l'Aubinière\n3, avenie des Améthystes\n44300\nNantes\nFrance", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Technoparc de l'Aubinière, 3, avenie des Améthystes", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Nantes", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("44300", parsedAddress.postalCode);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("4, Avenue Pablo Picasso, 92024 Nanterre, France", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("4, Avenue Pablo Picasso", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Nanterre", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("92024", parsedAddress.postalCode);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tTechnoparc de l'Aubinière\n  \t \t \t  3, avenie des Améthystes\n\n\t \t \n44300 \t\r \n       Nantes\t\nFrance \r\r\t \t \n\n\n", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Technoparc de l'Aubinière, 3, avenie des Améthystes", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Nantes", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("44300", parsedAddress.postalCode);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("4 Avenue Pablo Picasso 92024 Nanterre France", 'fr_fr');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("4 Avenue Pablo Picasso", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Nanterre", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("92024", parsedAddress.postalCode);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Z.I. de Courtaboeuf\n1, avenue du Canada\n91947 Les Ulis\nFrance", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Z.I. de Courtaboeuf, 1, avenue du Canada", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Les Ulis", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("91947", parsedAddress.postalCode);
	UnitTest.requireIdentical("France", parsedAddress.country);
	UnitTest.requireIdentical("fr", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsFR.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "38 avenue de l‘Opéra",
		locality: "Paris",
		postalCode: "75002",
		country: "France",
		countryCode: "fr",
		locale: {language: 'fr', region: 'fr'}
	};
	
	var expected = "38 avenue de l‘Opéra\n75002 Paris\nFrance";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'fr_fr'));

	return UnitTest.passed;
};

AddressTestsFR.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "38 avenue de l‘Opéra",
		locality: "Paris",
		postalCode: "75002",
		country: "France",
		countryCode: "fr",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "38 avenue de l‘Opéra\n75002 Paris\nFrance";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
