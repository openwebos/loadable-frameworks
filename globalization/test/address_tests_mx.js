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

function AddressTestsMX() {
}

AddressTestsMX.prototype.testParseAddressNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Paseo de la Reforma #115, Piso 22\nCol. Lomas de Chapultepec\n11000 México D.F.\nMéxico", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Paseo de la Reforma #115, Piso 22, Col. Lomas de Chapultepec", parsedAddress.streetAddress);
	UnitTest.requireIdentical("México", parsedAddress.locality);
	UnitTest.requireIdentical("D.F.", parsedAddress.region);
	UnitTest.requireIdentical("11000", parsedAddress.postalCode);
	UnitTest.requireIdentical("México", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 de Noviembre 855 Sur\nObispado\nMonterrey, NL\nMéxico", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("20 de Noviembre 855 Sur, Obispado", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Monterrey", parsedAddress.locality);
	UnitTest.requireIdentical("NL", parsedAddress.region);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("México", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("AV RIO MIXCOAC N° 125 , INSURGENTES MIXCOAC , C.P 03920 , BENITO JUAREZ , DF", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("AV RIO MIXCOAC N° 125, INSURGENTES MIXCOAC", parsedAddress.streetAddress);
	UnitTest.requireIdentical("BENITO JUAREZ", parsedAddress.locality);
	UnitTest.requireIdentical("DF", parsedAddress.region);
	UnitTest.requireIdentical("C.P 03920", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Colegio Niños de México\nQueretaro 151\nRoma\nC.P 06700\nCuauhtemoc\nDF\nMéxico", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Colegio Niños de México, Queretaro 151, Roma", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Cuauhtemoc", parsedAddress.locality);
	UnitTest.requireIdentical("DF", parsedAddress.region);
	UnitTest.requireIdentical("C.P 06700", parsedAddress.postalCode);
	UnitTest.requireIdentical("México", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("Vicente Guerrero S/N , Centro , C.P 23450 , Cabo San Lucas , BCS , México", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Vicente Guerrero S/N, Centro", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Cabo San Lucas", parsedAddress.locality);
	UnitTest.requireIdentical("BCS", parsedAddress.region);
	UnitTest.requireIdentical("C.P 23450", parsedAddress.postalCode);
	UnitTest.requireIdentical("México", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tVicente     Guerrero \tS/N\n\t\tCentro\t\n C.P\t\r 23450\n\t\t\r Cabo   \t\r San Lucas\n\n\n\tBCS\r\t\nMéxico\n\n\n", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Vicente Guerrero S/N, Centro", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Cabo San Lucas", parsedAddress.locality);
	UnitTest.requireIdentical("BCS", parsedAddress.region);
	UnitTest.requireIdentical("C.P 23450", parsedAddress.postalCode);
	UnitTest.requireIdentical("México", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("Vicente Guerrero S/N Centro C.P 23450 Cabo San Lucas BCS México", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Vicente Guerrero S/N Centro", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Cabo San Lucas", parsedAddress.locality);
	UnitTest.requireIdentical("BCS", parsedAddress.region);
	UnitTest.requireIdentical("C.P 23450", parsedAddress.postalCode);
	UnitTest.requireIdentical("México", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Calle Yucatán No. 45\nC.P 97751 Chichén Itzá, Yucatán\nMéxico", 'es_mx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Calle Yucatán No. 45", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Chichén Itzá", parsedAddress.locality);
	UnitTest.requireIdentical("Yucatán", parsedAddress.region);
	UnitTest.requireIdentical("C.P 97751", parsedAddress.postalCode);
	UnitTest.requireIdentical("México", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Vicente Guerrero S/N , Centro\nC.P 23450 Cabo San Lucas, BCS\nMexico", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Vicente Guerrero S/N, Centro", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Cabo San Lucas", parsedAddress.locality);
	UnitTest.requireIdentical("BCS", parsedAddress.region);
	UnitTest.requireIdentical("C.P 23450", parsedAddress.postalCode);
	UnitTest.requireIdentical("Mexico", parsedAddress.country);
	UnitTest.requireIdentical("mx", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsMX.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "Vicente Guerrero S/N, Centro",
		locality: "Cabo San Lucas",
		region: "BCS",
		postalCode: "C.P 23450",
		country: "México",
		countryCode: "mx",
		locale: {language: 'es', region: 'mx'}
	};
	
	var expected = "Vicente Guerrero S/N, Centro\nC.P 23450 Cabo San Lucas, BCS\nMéxico";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'es_mx'));

	return UnitTest.passed;
};

AddressTestsMX.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Vicente Guerrero S/N, Centro",
		locality: "Cabo San Lucas",
		region: "BCS",
		postalCode: "C.P 23450",
		country: "Mexico",
		countryCode: "mx",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "Vicente Guerrero S/N, Centro\nC.P 23450 Cabo San Lucas, BCS\nMexico";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
