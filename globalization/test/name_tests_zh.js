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

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function NameTestsZH() {
}

/*
 * Parser Tests
 */

NameTestsZH.prototype.testParseSimpleName = function(){
	var parsed = Globalization.Name.parsePersonalName("蔡良", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "良",
		familyName: "蔡"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseOnePlusTwo = function(){
	var parsed = Globalization.Name.parsePersonalName("王良会", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "良会",
		familyName: "王"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseTwoPlusOne = function(){
	var parsed = Globalization.Name.parsePersonalName("歐陽良", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "良",
		familyName: "歐陽"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseTwoPlusTwo = function(){
	var parsed = Globalization.Name.parsePersonalName("司徒良会", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "良会",
		familyName: "司徒"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseMaidenPlusMarriedName = function(){
	var parsed = Globalization.Name.parsePersonalName("錢林慧君", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "慧君",
		familyName: "錢林"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseTitle = function(){
	var parsed = Globalization.Name.parsePersonalName("老錢慧君", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "老",
		givenName: "慧君",
		familyName: "錢"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseMultipleTitles = function(){
	var parsed = Globalization.Name.parsePersonalName("錢總理先生", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		familyName: "錢",
		suffix: "總理先生"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseEuroName = function(){
	var parsed = Globalization.Name.parsePersonalName("Johan Schmidt", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Johan",
		familyName: "Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseSuffix = function(){
	var parsed = Globalization.Name.parsePersonalName("王媽媽", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		suffix: "媽媽",
		familyName: "王"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseTitleSuffix = function(){
	var parsed = Globalization.Name.parsePersonalName("李老師", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		suffix: "老師",
		familyName: "李"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseEverything = function(){
	var parsed = Globalization.Name.parsePersonalName("老錢林慧君外公", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "老",
		givenName: "慧君",
		familyName: "錢林",
		suffix: "外公"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

/*
 * Format Tests
 */

NameTestsZH.prototype.testFormatNameShort = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsZH.prototype.testFormatNameMedium = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsZH.prototype.testFormatNameLong = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸太太";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsZH.prototype.testFormatEuroNameShort = function(){
	var name = {
		prefix: "Dr.",
		givenName: "John",
		middleName: "Robert",
		familyName: "Goffin",
		suffix: "Jr."
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Goffin";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsZH.prototype.testFormatEuroNameMedium = function(){
	var name = {
		prefix: "Dr.",
		givenName: "John",
		middleName: "Robert",
		familyName: "Goffin",
		suffix: "Jr."
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Robert Goffin";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsZH.prototype.testFormatEuroNameLong = function(){
	var name = {
		prefix: "Dr.",
		givenName: "John",
		middleName: "Robert",
		familyName: "Goffin",
		suffix: "Jr."
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "Dr. John Robert Goffin Jr.";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

//for DFISH-25501
NameTestsZH.prototype.testParseCompoundFamilyName3 = function () {
	var parsed = Globalization.Name.parsePersonalName("司马小凤", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "司马"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsZH.prototype.testParseCompoundFamilyName4 = function () {
	var parsed = Globalization.Name.parsePersonalName("段干小凤", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "段干"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};


NameTestsZH.prototype.testParseAmbiguousLengthFamilyName1 = function () {
	var parsed = Globalization.Name.parsePersonalName("鍾小凤", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "鍾"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseAmbiguousLengthFamilyName2 = function () {
	var parsed = Globalization.Name.parsePersonalName("鐘離小凤", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "鐘離"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseName2 = function () {
	var parsed = Globalization.Name.parsePersonalName("王什", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "什",
		familyName: "王"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseMissingNames1 = function () {
	var parsed = Globalization.Name.parsePersonalName("曲小凤", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "曲"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsZH.prototype.testParseMissingNames2 = function () {
	var parsed = Globalization.Name.parsePersonalName("揭小凤", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "揭"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsZH.prototype.testParseMissingNames3 = function () {
	var parsed = Globalization.Name.parsePersonalName("关小凤", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "关"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};

//for DFISH-12905
NameTestsZH.prototype.testParseHPEmailName = function () {
	var parsed = Globalization.Name.parsePersonalName("王永慶(Palm GBU)", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "永慶",
		familyName: "王",
		suffix: "(Palm GBU)"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsZH.prototype.testParseHPEmailName2 = function () {
	var parsed = Globalization.Name.parsePersonalName("王永慶 (Palm GBU)", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "永慶",
		familyName: "王",
		suffix: " (Palm GBU)"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseHPEmailNameWithOtherSuffix = function () {
	var parsed = Globalization.Name.parsePersonalName("王永慶外公(Palm GBU)", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "永慶",
		familyName: "王",
		suffix: "外公(Palm GBU)"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsZH.prototype.testParseHPEmailNameWithOtherSuffix2 = function () {
	var parsed = Globalization.Name.parsePersonalName("王永慶外公 (Palm GBU)", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "永慶",
		familyName: "王",
		suffix: "外公 (Palm GBU)"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsZH.prototype.testFormatHPEmailNameShort = function () {
	var name = {
		prefix: null,
		givenName: "永慶",
		middleName: null,
		familyName: "王",
		suffix: "(Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "王永慶";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
NameTestsZH.prototype.testFormatHPEmailNameLong = function () {
	var name = {
		prefix: null,
		givenName: "永慶",
		middleName: null,
		familyName: "王",
		suffix: "(Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "王永慶(Palm GBU)";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
NameTestsZH.prototype.testFormatHPEmailNameLong2 = function () {
	var name = {
		prefix: null,
		givenName: "永慶",
		middleName: null,
		familyName: "王",
		suffix: " (Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "王永慶 (Palm GBU)";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
NameTestsZH.prototype.testFormatHPEmailNameShortMultiple = function () {
	var name = {
		prefix: null,
		givenName: "永慶",
		middleName: null,
		familyName: "王",
		suffix: "外公(Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "王永慶";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
NameTestsZH.prototype.testFormatHPEmailNameLongMultiple = function () {
	var name = {
		prefix: null,
		givenName: "永慶",
		middleName: null,
		familyName: "王",
		suffix: "外公(Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'zh_cn');
	UnitTest.requireDefined(formatted);
	
	var expected = "王永慶外公(Palm GBU)";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsZH.prototype.testParseHPEmailNameWithSpace = function () {
	var parsed = Globalization.Name.parsePersonalName("徐小凤 (Palm GBU)", 'zh_cn');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "小凤",
		familyName: "徐",
		suffix: " (Palm GBU)"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
