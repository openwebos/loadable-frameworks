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

function AddressTestsES() {
}

AddressTestsES.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Avda.General Avilés, 35-37, Bajo\n46015 - Valencia\nEspaña", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Avda.General Avilés, 35-37, Bajo", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Valencia", parsedAddress.region);
	UnitTest.require(parsedAddress.locality === undefined);
	UnitTest.requireIdentical("46015 -", parsedAddress.postalCode);
	UnitTest.requireIdentical("España", parsedAddress.country);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("Torre Picasso\nPlaza Pablo Ruiz Picasso 1\nMadrid\nEspaña", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Torre Picasso, Plaza Pablo Ruiz Picasso 1", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Madrid", parsedAddress.region);
	UnitTest.require(parsedAddress.locality === undefined);
	UnitTest.requireIdentical("España", parsedAddress.country);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("Isabel de Santo Domingo, 6\n50014 - Zaragoza", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Isabel de Santo Domingo, 6", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Zaragoza", parsedAddress.region);
	UnitTest.require(parsedAddress.locality === undefined);
	UnitTest.requireIdentical("50014 -", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Cami de Can Graells\nno. 1-21\n08174\nSant Cugat del Valles\nBarcelona\nEspaña", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Cami de Can Graells, no. 1-21", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Sant Cugat del Valles", parsedAddress.locality);
	UnitTest.requireIdentical("Barcelona", parsedAddress.region);
	UnitTest.requireIdentical("08174", parsedAddress.postalCode);
	UnitTest.requireIdentical("España", parsedAddress.country);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("Calle José Echegaray, 8, Parque Empresarial Madrid-Las Rozas, 28232 - Las Rozas. Madrid, España", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Calle José Echegaray, 8, Parque Empresarial Madrid-Las Rozas", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Las Rozas.", parsedAddress.locality);
	UnitTest.requireIdentical("Madrid", parsedAddress.region);
	UnitTest.requireIdentical("28232 -", parsedAddress.postalCode);
	UnitTest.requireIdentical("España", parsedAddress.country);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tAvda.General\t\t\r Avilés,\r 35-37,\r Bajo\n\t\t\t\r\r46015\r -\r\r \nValencia,\n,\t\tEspaña\n\n\n", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Avda.General Avilés, 35-37, Bajo", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Valencia", parsedAddress.region);
	UnitTest.require(parsedAddress.locality === undefined);
	UnitTest.requireIdentical("46015 -", parsedAddress.postalCode);
	UnitTest.requireIdentical("España", parsedAddress.country);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("Calle José Echegaray, 8 Parque Empresarial Madrid-Las Rozas 28232 - Las Rozas Madrid España", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Calle José Echegaray, 8 Parque Empresarial Madrid-Las Rozas", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Las Rozas", parsedAddress.locality);
	UnitTest.requireIdentical("Madrid", parsedAddress.region);
	UnitTest.requireIdentical("28232 -", parsedAddress.postalCode);
	UnitTest.requireIdentical("España", parsedAddress.country);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví, València", 'es_es');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Avda.General Avilés, 35-37, Bajo", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Sedaví", parsedAddress.locality);
	UnitTest.requireIdentical("València", parsedAddress.region);
	UnitTest.requireIdentical("46015 -", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví, València, Spain", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Avda.General Avilés, 35-37, Bajo", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Sedaví", parsedAddress.locality);
	UnitTest.requireIdentical("València", parsedAddress.region);
	UnitTest.requireIdentical("46015 -", parsedAddress.postalCode);
	UnitTest.requireIdentical("Spain", parsedAddress.country);
	UnitTest.requireIdentical("es", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsES.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Avda.General Avilés, 35-37, Bajo",
		locality: "Sedaví",
		region: "València",
		postalCode: "46015 -",
		country: "España",
		countryCode: "es",
		locale: {language: 'es', region: 'es'}
	};
	
	var expected = "Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví València\nEspaña";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'es_es'));

	return UnitTest.passed;
};

AddressTestsES.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Avda.General Avilés, 35-37, Bajo",
		locality: "Sedaví",
		region: "València",
		postalCode: "46015 -",
		country: "Spain",
		countryCode: "es",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví València\nSpain";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
