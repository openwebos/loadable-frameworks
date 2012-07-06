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
 * @name address_tests_hk.js
 * @fileOverview test the address parsing and formatting routines in Hong Kong
 */

/*globals G11n Address */

var webos = IMPORTS.require("webos");
webos.include("test/loadall.js");

function AddressTestsHK() {
}

AddressTestsHK.prototype.testParseAddressLatinNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Tower 1, Times Square\n1 Matheson Street\nRoom 1706\nCauseway Bay, Hong Kong", "en_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Tower 1, Times Square, 1 Matheson Street, Room 1706", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Causeway Bay", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressLatinNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("Tower 1, Times Square\n1 Matheson Street\nRoom 1706\nCauseway Bay", "en_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Tower 1, Times Square, 1 Matheson Street, Room 1706", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Causeway Bay", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressLatinDouble = function () {
	var parsedAddress = Globalization.Address.parseAddress("Room 1301-1302, 13/F, Block A, Sea View Estate,\n2 Watson Road, Hong Kong\nHong Kong", "en_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Room 1301-1302, 13/F, Block A, Sea View Estate, 2 Watson Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressAsianNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("香港太古城英皇道1111號太古城中心1期19字樓", "zh_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("英皇道1111號太古城中心1期19字樓", parsedAddress.streetAddress);
	UnitTest.requireIdentical("太古城", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("香港", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressAsianNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("太古城英皇道1111號太古城中心1期19字樓", "zh_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("英皇道1111號太古城中心1期19字樓", parsedAddress.streetAddress);
	UnitTest.requireIdentical("太古城", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

/*
// for DFISH-20855
AddressTestsHK.prototype.testParseAddressMixed = function () {
	// in Hong Kong, it is more likely to be mixed like this
	var parsedAddress = Globalization.Address.parseAddress("Hong Kong太古城英皇道1111號太古城中心1期19字樓", "zh_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("英皇道1111號太古城中心1期19字樓", parsedAddress.streetAddress);
	UnitTest.requireIdentical("太古城", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};
*/

AddressTestsHK.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("Room 1403-5, 14/F, Chinachem Exchange Square, 1 Hoi Wan Street, Quarry Bay, Hong Kong", "en_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Room 1403-5, 14/F, Chinachem Exchange Square, 1 Hoi Wan Street", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Quarry Bay", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\t10/F PCCW Tower\n\t\nTaikoo Place\n \r\n\r\r979 King's Road\n	Quarry Bay\r\r\n	Hong Kong\t\n\n\n", "en_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("10/F PCCW Tower, Taikoo Place, 979 King's Road", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Quarry Bay", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("Tower 1 Times Square 1 Matheson Street Room 1706 Causeway Bay Hong Kong", "en_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Tower 1 Times Square 1 Matheson Street Room 1706", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Causeway Bay", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Suite 19, 1st Floor, Tǎi Gù Chung Zhong Shìn, Hăo 1111, In Huang Street, Dàpǔ Xīn Shìzhèn, Hong Kong", "en_hk");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Suite 19, 1st Floor, Tǎi Gù Chung Zhong Shìn, Hăo 1111, In Huang Street", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Dàpǔ Xīn Shìzhèn", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Tower 1, Times Square\n1 Matheson Street\nRoom 1706\nCauseway Bay, Hong Kong", "en_us");
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Tower 1, Times Square, 1 Matheson Street, Room 1706", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Causeway Bay", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("Hong Kong", parsedAddress.country);
	UnitTest.requireIdentical("hk", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testFormatAddressLatin = function () {
	var parsedAddress = {
		streetAddress: "Tower 1, Times Square, 1 Matheson Street, Room 1706",
		locality: "Causeway Bay",
		country: "Hong Kong",
		countryCode: "hk",
		format: "latin",
		locale: {language: 'en', region: 'hk'}
	};
	
	var expected = "Tower 1, Times Square, 1 Matheson Street, Room 1706\nCauseway Bay\nHong Kong";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_hk'));
	
	return UnitTest.passed;
};

AddressTestsHK.prototype.testFormatAddressAsian = function () {
	var parsedAddress = {
		streetAddress: "英皇道1111號太古城中心1期19字樓",
		locality: "太古城",
		country: "香港",
		countryCode: "hk",
		format: "asian",
		locale: {language: 'en', region: 'hk'}
	};
	
	var expected = "香港太古城英皇道1111號太古城中心1期19字樓";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_hk'));

	return UnitTest.passed;
};

AddressTestsHK.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Tower 1, Times Square, 1 Matheson Street, Room 1706",
		locality: "Causeway Bay",
		country: "Hong Kong",
		countryCode: "hk",
		format: "latin",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "Tower 1, Times Square, 1 Matheson Street, Room 1706\nCauseway Bay\nHong Kong";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
