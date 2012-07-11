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

function AddressTestsTW() {
}

AddressTestsTW.prototype.testParseAddressLatinNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("Level 73, Taipei 101 Tower\n7 Xinyi Road, Sec. 5\nTaipei, 110\nTaiwan", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taipei", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("110", parsedAddress.postalCode);
	UnitTest.requireIdentical("Taiwan", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressLatinNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("3F-499, Jung-Ming S. Road, West District, Taichung, Taiwan, R.O.C.", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("3F-499, Jung-Ming S. Road, West District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taichung", parsedAddress.locality);
	UnitTest.requireIdentical("Taiwan", parsedAddress.region);
	UnitTest.requireIdentical("R.O.C.", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressLatinNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("3F, No.7\nShong-Ren Rd.\nTaipei City 11045", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("3F, No.7, Shong-Ren Rd.", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taipei City", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("11045", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressAsianNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("中華民國高雄市苓雅區802四維三路6號18樓A", 'zh_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("苓雅區四維三路6號18樓A", parsedAddress.streetAddress);
	UnitTest.requireIdentical("高雄市", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("802", parsedAddress.postalCode);
	UnitTest.requireIdentical("中華民國", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressAsianNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("中華民國台灣省台北市南港區經貿二路66號10樓", 'zh_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("南港區經貿二路66號10樓", parsedAddress.streetAddress);
	UnitTest.requireIdentical("台北市", parsedAddress.locality);
	UnitTest.requireIdentical("台灣省", parsedAddress.region);
	UnitTest.requireIdentical("中華民國", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressAsianNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("高雄市苓雅區 802 四維三路 6 號 26 樓", 'zh_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("苓雅區四維三路 6 號 26 樓", parsedAddress.streetAddress);
	UnitTest.requireIdentical("高雄市", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("802", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressAsianWithRegion = function () {
	var parsedAddress = Globalization.Address.parseAddress("中華民國台灣省台高雄市苓雅區802四維三路6號18樓A", 'zh_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("苓雅區四維三路6號18樓A", parsedAddress.streetAddress);
	UnitTest.requireIdentical("台高雄市", parsedAddress.locality);
	UnitTest.requireIdentical("台灣省", parsedAddress.region);
	UnitTest.requireIdentical("802", parsedAddress.postalCode);
	UnitTest.requireIdentical("中華民國", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressAsianZipAtEnd = function () {
	var parsedAddress = Globalization.Address.parseAddress("中華民國\n台灣省台高雄市苓雅區四維三路6號18樓A 80245", 'zh_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("苓雅區四維三路6號18樓A", parsedAddress.streetAddress);
	UnitTest.requireIdentical("台高雄市", parsedAddress.locality);
	UnitTest.requireIdentical("台灣省", parsedAddress.region);
	UnitTest.requireIdentical("80245", parsedAddress.postalCode);
	UnitTest.requireIdentical("中華民國", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Level 73\nTaipei 101 Tower\n7 Xinyi Road\nSec. 5\nTaipei\n110\nTaiwan\n\n\n", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taipei", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("110", parsedAddress.postalCode);
	UnitTest.requireIdentical("Taiwan", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("3F, 499, Jung-Ming S. Road, West District, Taichung, 403, Taiwan, R.O.C.", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("3F, 499, Jung-Ming S. Road, West District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taichung", parsedAddress.locality);
	UnitTest.requireIdentical("Taiwan", parsedAddress.region);
	UnitTest.requireIdentical("403", parsedAddress.postalCode);
	UnitTest.requireIdentical("R.O.C.", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\t3F, \t\rNo.7\n  \rShong-Ren Rd.\t\t   \n\r \t Taipei \t\tCity\r  \r \n  \tTaiwan  \t \t 110\t \n\t \r \t Republic of China\n\n\n", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("3F, No.7, Shong-Ren Rd.", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taipei City", parsedAddress.locality);
	UnitTest.requireIdentical("Taiwan", parsedAddress.region);
	UnitTest.requireIdentical("110", parsedAddress.postalCode);
	UnitTest.requireIdentical("Republic of China", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("3F 499 Jung-Ming S. Road West District Taichung 403 Taiwan R.O.C.", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("3F 499 Jung-Ming S. Road West District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taichung", parsedAddress.locality);
	UnitTest.requireIdentical("Taiwan", parsedAddress.region);
	UnitTest.requireIdentical("403", parsedAddress.postalCode);
	UnitTest.requireIdentical("R.O.C.", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("Level 73, Taipei 101 Tower\n7 Xinyi Road, Sec. 5\nTáiběi, 110\nTáiwān\nROC", 'en_tw');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Táiběi", parsedAddress.locality);
	UnitTest.requireIdentical("Táiwān", parsedAddress.region);
	UnitTest.requireIdentical("110", parsedAddress.postalCode);
	UnitTest.requireIdentical("ROC", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Level 73, Taipei 101 Tower\n7 Xinyi Road, Sec. 5\nTaipei, 110\nTaiwan\nRepublic of China", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Taipei", parsedAddress.locality);
	UnitTest.requireIdentical("Taiwan", parsedAddress.region);
	UnitTest.requireIdentical("110", parsedAddress.postalCode);
	UnitTest.requireIdentical("Republic of China", parsedAddress.country);
	UnitTest.requireIdentical("tw", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsTW.prototype.testFormatAddressLatin = function () {
	var parsedAddress = {
		streetAddress: "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5",
		locality: "Taipei",
		region: "Taiwan",
		postalCode: "11045",
		country: "Republic of China",
		countryCode: "tw",
		format: "latin",
		locale: {language: 'en', region: 'tw'}
	};
	
	var expected = "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5\nTaipei, Taiwan, 11045\nRepublic of China";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_tw'));

	return UnitTest.passed;
};

AddressTestsTW.prototype.testFormatAddressAsian = function () {
	var parsedAddress = {
		streetAddress: "苓雅區四維三路6號18樓A",
		locality: "高雄市",
		region: "台灣省",
		postalCode: "80212",
		country: "中華民國",
		countryCode: "tw",
		format: "asian",
		locale: {language: "zh", region: "tw"}
	};
	
	var expected = "中華民國\n台灣省高雄市苓雅區四維三路6號18樓A80212";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'zh_tw'));

	return UnitTest.passed;
};

AddressTestsTW.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5",
		locality: "Taipei",
		region: "Taiwan",
		postalCode: "11045",
		country: "Republic of China",
		countryCode: "tw",
		format: "latin",
		locale: {language: "en", region: "us"}
	};
	
	var expected = "Level 73, Taipei 101 Tower, 7 Xinyi Road, Sec. 5\nTaipei, Taiwan, 11045\nRepublic of China";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
