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

function AddressTestsSG() {
}

AddressTestsSG.prototype.testParseAddressLatinNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("#38-01/01A\n8 Shenton Way\nSingapore 068811\nSingapore", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("#38-01/01A, 8 Shenton Way", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("068811", parsedAddress.postalCode);
	UnitTest.requireIdentical("Singapore", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressLatinNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("9 Changi Business Park Central 1\nSingapore", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("9 Changi Business Park Central 1", parsedAddress.streetAddress);
	UnitTest.require(parsedAddress.locality === undefined);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("Singapore", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressLatinNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("#38-01/01A\n8 Shenton Way\nSingapore 068811", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("#38-01/01A, 8 Shenton Way", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("068811", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressAsianNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("新加坡共和國159088新加坡麟記路4＃06-07/08矽統科技大廈", 'zh_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("麟記路4＃06-07/08矽統科技大廈", parsedAddress.streetAddress);
	UnitTest.requireIdentical("新加坡", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("159088", parsedAddress.postalCode);
	UnitTest.requireIdentical("新加坡共和國", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressAsianNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("新加坡麟記路4＃06-07/08矽統科技大廈", 'zh_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("麟記路4＃06-07/08矽統科技大廈", parsedAddress.streetAddress);
	UnitTest.require(parsedAddress.locality === undefined);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical("新加坡", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressAsianNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("159088新加坡麟記路4＃06-07/08矽統科技大廈", 'zh_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("麟記路4＃06-07/08矽統科技大廈", parsedAddress.streetAddress);
	UnitTest.requireIdentical("新加坡", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("159088", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Blk 111\nAng Mo Kio Avenue 4\nSingapore\n560111\nRepublic of Singapore\n\n", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Blk 111, Ang Mo Kio Avenue 4", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("560111", parsedAddress.postalCode);
	UnitTest.requireIdentical("Republic of Singapore", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("152 Beach Rd., #16-00 Gateway East, Singapore 189721, The Republic of Singapore", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("152 Beach Rd., #16-00 Gateway East", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("189721", parsedAddress.postalCode);
	UnitTest.requireIdentical("The Republic of Singapore", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\t2 Orchard Turn\t\t\r\n\t#04-05\r\t ION \tOrchard\t\nSingapore \r\t\n238801\n\t\rSingapore\n\n", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("2 Orchard Turn, #04-05 ION Orchard", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("238801", parsedAddress.postalCode);
	UnitTest.requireIdentical("Singapore", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("152 Beach Rd. #16-00 Gateway East Singapore 189721 The Republic of Singapore", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("152 Beach Rd. #16-00 Gateway East", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("189721", parsedAddress.postalCode);
	UnitTest.requireIdentical("The Republic of Singapore", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Lín Jì Lù 4\n# 06-07/08 Xì Tǒng Kējì Dàshà\nSingapore 159088\n", 'en_sg');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Lín Jì Lù 4, # 06-07/08 Xì Tǒng Kējì Dàshà", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("159088", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("#38-01/01A\n8 Shenton Way\nSingapore 068811\nSingapore", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("#38-01/01A, 8 Shenton Way", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Singapore", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("068811", parsedAddress.postalCode);
	UnitTest.requireIdentical("Singapore", parsedAddress.country);
	UnitTest.requireIdentical("sg", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsSG.prototype.testFormatAddressLatin = function () {
	var parsedAddress = {
		streetAddress: "#38-01/01A, 8 Shenton Way",
		locality: "Singapore",
		postalCode: "068811",
		country: "Singapore",
		countryCode: "sg",
		format: "latin",
		locale: {language: 'en', region: 'sg'}
	};
	
	var expected = "#38-01/01A, 8 Shenton Way\nSingapore 068811\nSingapore";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_sg'));

	return UnitTest.passed;
};

AddressTestsSG.prototype.testFormatAddressAsian = function () {
	var parsedAddress = {
		streetAddress: "麟記路4＃06-07/08矽統科技大廈",
		locality: "新加坡",
		postalCode: "159088",
		country: "新加坡共和國",
		countryCode: "sg",
		format: "asian",
		locale: {language: 'zh', region: 'sg'}
	};
	
	var expected = "新加坡共和國159088新加坡麟記路4＃06-07/08矽統科技大廈";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'zh_sg'));

	return UnitTest.passed;
};

AddressTestsSG.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "#38-01/01A, 8 Shenton Way",
		locality: "Singapore",
		postalCode: "068811",
		country: "Republic of Singapore",
		countryCode: "sg",
		format: "latin",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "#38-01/01A, 8 Shenton Way\nSingapore 068811\nRepublic of Singapore";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
