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

function AddressTestsCN() {
}

AddressTestsCN.prototype.testParseAddressLatinNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("L30, Unit 3007, Teemtower, Teemmall,\n208 Tianhe Road, Tianhe District,\nGuangzhou, Guangdong 510620\nChina", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("L30, Unit 3007, Teemtower, Teemmall, 208 Tianhe Road, Tianhe District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Guangzhou", parsedAddress.locality);
	UnitTest.requireIdentical("Guangdong", parsedAddress.region);
	UnitTest.requireIdentical("510620", parsedAddress.postalCode);
	UnitTest.requireIdentical("China", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressLatinNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("No. 1 Zhongguancun East Road\nHaidian District\nBeijing, People's Republic of China", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("No. 1 Zhongguancun East Road, Haidian District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Beijing", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("People's Republic of China", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressLatinNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("No.268 Xizang Zhong Road, Huangpu District\nShanghai, 200001", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("No.268 Xizang Zhong Road, Huangpu District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Shanghai", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("200001", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressAsianNormal = function () {
	var parsedAddress = Globalization.Address.parseAddress("中国北京市朝阳区建国路112号 中国惠普大厦100022", 'zh_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("朝阳区建国路112号 中国惠普大厦", parsedAddress.streetAddress);
	UnitTest.requireIdentical("北京市", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("100022", parsedAddress.postalCode);
	UnitTest.requireIdentical("中国", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressAsianNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("中国武汉市汉口建设大道568号新世界国贸大厦I座9楼910室", 'zh_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("汉口建设大道568号新世界国贸大厦I座9楼910室", parsedAddress.streetAddress);
	UnitTest.requireIdentical("武汉市", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("中国", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	UnitTest.require(parsedAddress.postalCode === undefined);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressAsianNoCountry = function () {
	var parsedAddress = Globalization.Address.parseAddress("北京市朝阳区北四环中路 27号盘古大观 A 座 23层200001", 'zh_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("朝阳区北四环中路 27号盘古大观 A 座 23层", parsedAddress.streetAddress);
	UnitTest.requireIdentical("北京市", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("200001", parsedAddress.postalCode);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressAsianWithRegion = function () {
	var parsedAddress = Globalization.Address.parseAddress("中国湖北省武汉市汉口建设大道568号新世界国贸大厦I座9楼910室430000", 'zh_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("汉口建设大道568号新世界国贸大厦I座9楼910室", parsedAddress.streetAddress);
	UnitTest.requireIdentical("武汉市", parsedAddress.locality);
	UnitTest.requireIdentical("湖北省", parsedAddress.region);
	UnitTest.requireIdentical("中国", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	UnitTest.requireIdentical("430000", parsedAddress.postalCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("Tsinghua Science Park Bldg 6\nNo. 1 Zhongguancun East Road\nHaidian District\nBeijing 100084\nPRC\n\n", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("Tsinghua Science Park Bldg 6, No. 1 Zhongguancun East Road, Haidian District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Beijing", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("100084", parsedAddress.postalCode);
	UnitTest.requireIdentical("PRC", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("No. 27, Central North Fourth Ring Road, Chaoyang District, Beijing 100101, PRC", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("No. 27, Central North Fourth Ring Road, Chaoyang District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Beijing", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("100101", parsedAddress.postalCode);
	UnitTest.requireIdentical("PRC", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("\t\t\tNo. 27, Central North Fourth \r\t   \tRing Road\t\t\n\t, Chaoyang \r\tDistrict\n\t\rBeijing\t\r\n100101\n\t\t\r\rPRC\t\n\n\n", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("No. 27, Central North Fourth Ring Road, Chaoyang District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Beijing", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("100101", parsedAddress.postalCode);
	UnitTest.requireIdentical("PRC", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("No. 27 Central North Fourth Ring Road Chaoyang District Beijing 100101 PRC", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("No. 27 Central North Fourth Ring Road Chaoyang District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Beijing", parsedAddress.locality);
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical("100101", parsedAddress.postalCode);
	UnitTest.requireIdentical("PRC", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressSpecialChars = function () {
	var parsedAddress = Globalization.Address.parseAddress("208 Tianhe Road, Tianhe District,\nGuǎngzhōu, Guǎngdōng 510620\nChina", 'en_cn');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("208 Tianhe Road, Tianhe District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Guǎngzhōu", parsedAddress.locality);
	UnitTest.requireIdentical("Guǎngdōng", parsedAddress.region);
	UnitTest.requireIdentical("510620", parsedAddress.postalCode);
	UnitTest.requireIdentical("China", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testParseAddressFromUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("208 Tianhe Road, Tianhe District,\nGuǎngzhōu, Guǎngdōng 510620\nChina", 'en_us');
	
	// the country name is in English because this address is for a contact in a US database
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical("208 Tianhe Road, Tianhe District", parsedAddress.streetAddress);
	UnitTest.requireIdentical("Guǎngzhōu", parsedAddress.locality);
	UnitTest.requireIdentical("Guǎngdōng", parsedAddress.region);
	UnitTest.requireIdentical("510620", parsedAddress.postalCode);
	UnitTest.requireIdentical("China", parsedAddress.country);
	UnitTest.requireIdentical("cn", parsedAddress.countryCode);
	
	return UnitTest.passed;
};

AddressTestsCN.prototype.testFormatAddressLatin = function () {
	var parsedAddress = {
		streetAddress: "208 Tianhe Road, Tianhe District",
		locality: "Guǎngzhōu",
		region: "Guǎngdōng",
		postalCode: "510620",
		country: "China",
		countryCode: "cn",
		format: "latin",
		locale: {language: 'en', region: 'cn'}
	};
	
	var expected = "208 Tianhe Road, Tianhe District\nGuǎngzhōu, Guǎngdōng 510620\nChina";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_cn'));

	return UnitTest.passed;
};

AddressTestsCN.prototype.testFormatAddressAsian = function () {
	var parsedAddress = {
		streetAddress: "汉口建设大道568号新世界国贸大厦I座9楼910室",
		locality: "武汉市",
		country: "中国",
		format: "asian",
		locale: {language: 'zh', region: 'cn'}
	};
	
	var expected = "中国武汉市汉口建设大道568号新世界国贸大厦I座9楼910室";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'zh_cn'));

	return UnitTest.passed;
};

AddressTestsCN.prototype.testFormatAddressAsianBare = function () {
	var parsedAddress = {
		streetAddress: "汉口建设大道568号新世界国贸大厦I座9楼910室",
		locality: "武汉市",
		country: "中国"
	};
	
	var expected = "中国武汉市汉口建设大道568号新世界国贸大厦I座9楼910室";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'zh_cn'));

	return UnitTest.passed;
};

AddressTestsCN.prototype.testFormatAddressFromUS = function () {
	var parsedAddress = {
		streetAddress: "208 Tianhe Road, Tianhe District",
		locality: "Guǎngzhōu",
		region: "Guǎngdōng",
		postalCode: "510620",
		country: "China",
		countryCode: "cn",
		format: "latin",
		locale: {language: 'en', region: 'us'}
	};
	
	var expected = "208 Tianhe Road, Tianhe District\nGuǎngzhōu, Guǎngdōng 510620\nChina";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};
