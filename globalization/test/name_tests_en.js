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

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function NameTestsEN() {
}

/*
 * Parse Tests
 */

NameTestsEN.prototype.testUSParseSimpleName = function(){
	var parsed = Globalization.Name.parsePersonalName("John Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testUSParseTripleName = function(){
	var parsed = Globalization.Name.parsePersonalName("John Michael Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		middleName: "Michael",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testUSParseHypenatedName = function(){
	var parsed = Globalization.Name.parsePersonalName("John Michael Taylor-Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		middleName: "Michael",
		familyName: "Taylor-Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testUSParseQuadrupleName = function(){
	var parsed = Globalization.Name.parsePersonalName("John Michael Kevin Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		middleName: "Michael Kevin",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testUSParseTitle = function(){
	var parsed = Globalization.Name.parsePersonalName("Dr. John Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Dr.",
		givenName: "John",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testUSParseHonorific = function(){
	var parsed = Globalization.Name.parsePersonalName("Mr. John Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Mr.",
		givenName: "John",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testUSParseSuffix = function(){
	var parsed = Globalization.Name.parsePersonalName("John Smith Jr. Esq.", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		familyName: "Smith",
		suffix: "Jr. Esq."
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

//for DFISH-25146
NameTestsEN.prototype.testUSParseSuffixWithComma = function () {
	var parsed = Globalization.Name.parsePersonalName("John Smith, PhD", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		familyName: "Smith",
		suffix: ", PhD"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};

NameTestsEN.prototype.testUSParseEuroMultiName = function(){
	var parsed = Globalization.Name.parsePersonalName("Pieter van der Meulen", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Pieter",
		familyName: "van der Meulen"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testBenStrong = function(){
	var parsed = Globalization.Name.parsePersonalName("Ben Strong", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Ben",
		familyName: "Strong"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
 
NameTestsEN.prototype.testUSParseEverything = function(){
	var parsed = Globalization.Name.parsePersonalName("The Right Honorable Governor General Dr. John Michael Kevin Smith III, DDM", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "The Right Honorable Governor General Dr.",
		givenName: "John",
		middleName: "Michael Kevin",
		familyName: "Smith",
		suffix: "III, DDM"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testSingleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Sting", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Sting"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testLastNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Dr. Roberts", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Dr.",
		familyName: "Roberts"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testCompoundNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Mr. and Mrs. Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Mr. and Mrs.",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testCompoundFamily = function(){
	var parsed = Globalization.Name.parsePersonalName("John and Mary Smith", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John and Mary",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testByFamily = function(){
	var parsed = Globalization.Name.parsePersonalName("The Robertsons", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "The",
		familyName: "Robertsons"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testAuxDE = function(){
	var parsed = Globalization.Name.parsePersonalName("Herbert von Karajan", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Herbert",
		familyName: "von Karajan"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testAuxNL = function(){
	var parsed = Globalization.Name.parsePersonalName("Jan van der Heiden", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Jan",
		familyName: "van der Heiden"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testAuxFR = function(){
	var parsed = Globalization.Name.parsePersonalName("Serges du Maurier", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Serges",
		familyName: "du Maurier"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testAuxIT = function(){
	var parsed = Globalization.Name.parsePersonalName("Leonardo di Caprio", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Leonardo",
		familyName: "di Caprio"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testAuxES = function(){
	var parsed = Globalization.Name.parsePersonalName("Jorge de las Cruces", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Jorge",
		familyName: "de las Cruces"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsEN.prototype.testGibberish= function(){
	var parsed = Globalization.Name.parsePersonalName("Géê ëī a d øö", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Géê",
		middleName: "ëī a d",
		familyName: "øö"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

/*
 * Format tests
 */

NameTestsEN.prototype.testFormatSimpleNameShort = function(){
	var name = {
		prefix: "Dr.",
		givenName: "John",
		middleName: "Michael",
		familyName: "Smith",
		suffix: ", PhD"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Smith";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatSimpleNameMedium = function(){
	var name = {
		prefix: "Dr.",
		givenName: "John",
		middleName: "Michael",
		familyName: "Smith",
		suffix: ", PhD"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Michael Smith";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatSimpleNameLong = function(){
	var name = {
		prefix: "Dr.",
		givenName: "John",
		middleName: "Michael",
		familyName: "Smith",
		suffix: ", PhD"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "Dr. John Michael Smith, PhD";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatComplexNameShort = function(){
	var name = {
		prefix: "Mr.",
		givenName: "John",
		middleName: "Michael Kevin",
		familyName: "von Schmitt",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John von Schmitt";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatComplexNameMedium = function(){
	var name = {
		prefix: "Mr.",
		givenName: "John",
		middleName: "Michael Kevin",
		familyName: "von Schmitt",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Michael Kevin von Schmitt";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatComplexNameLong = function(){
	var name = {
		prefix: "Mr.",
		givenName: "John",
		middleName: "Michael Kevin",
		familyName: "von Schmitt",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "Mr. John Michael Kevin von Schmitt III";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatCommasInSuffix = function(){
	var name = {
		prefix: "Mr.",
		givenName: "John",
		middleName: "Michael Kevin",
		familyName: "von Schmitt",
		suffix: ", III, PhD"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "Mr. John Michael Kevin von Schmitt, III, PhD";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatAsianNameShort = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatAsianNameMedium = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsEN.prototype.testFormatAsianNameLong = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸太太";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

// for bug NOV-115774
NameTestsEN.prototype.testFormatWithNulls = function(){
	var name = {
		prefix: null,
		givenName: "John",
		middleName: null,
		familyName: "Doe",
		suffix: null
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Doe";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

//for DFISH-12905
NameTestsEN.prototype.testParseHPEmailName = function () {
	var parsed = Globalization.Name.parsePersonalName("John Smith (Palm GBU)", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		familyName: "Smith",
		suffix: " (Palm GBU)"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsEN.prototype.testParseHPEmailNameWithOtherSuffix = function () {
	var parsed = Globalization.Name.parsePersonalName("John Smith Jr. (Palm GBU)", 'en_us');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		familyName: "Smith",
		suffix: "Jr. (Palm GBU)"
	};
	
	UnitTest.require(objectEquals(parsed, expected));
	return UnitTest.passed;
};
NameTestsEN.prototype.testFormatHPEmailNameShort = function () {
	var name = {
		prefix: null,
		givenName: "John",
		middleName: null,
		familyName: "Smith",
		suffix: " (Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Smith";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
NameTestsEN.prototype.testFormatHPEmailNameLong = function () {
	var name = {
		prefix: null,
		givenName: "John",
		middleName: null,
		familyName: "Smith",
		suffix: " (Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Smith (Palm GBU)";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
NameTestsEN.prototype.testFormatHPEmailNameShortMultiple = function () {
	var name = {
		prefix: null,
		givenName: "John",
		middleName: null,
		familyName: "Smith",
		suffix: "Jr. (Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Smith";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
NameTestsEN.prototype.testFormatHPEmailNameLongMultiple = function () {
	var name = {
		prefix: null,
		givenName: "John",
		middleName: null,
		familyName: "Smith",
		suffix: "Jr. (Palm GBU)"
	};
	
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'en_us');
	UnitTest.requireDefined(formatted);
	
	var expected = "John Smith Jr. (Palm GBU)";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
