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

function NameTestsDE() {
}

/*
 * Parser Tests
 */

NameTestsDE.prototype.testParseSimpleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Johan Schmidt", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Johan",
		familyName: "Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseTripleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Johan Michael Schmidt", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Johan",
		middleName: "Michael",
		familyName: "Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseAdjunctNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Ludwig Klaus von Beethoven", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Ludwig",
		middleName: "Klaus",
		familyName: "von Beethoven"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseSingleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Ludwig", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Ludwig",
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseSingleNameWithAdjunct = function(){
	var parsed = Globalization.Name.parsePersonalName("von Beethoven", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "von",
		familyName: "Beethoven"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseSingleNameWithPrefixAndAdjunct = function(){
	var parsed = Globalization.Name.parsePersonalName("Herr von Beethoven", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Herr",
		familyName: "von Beethoven"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseMultiAdjunctNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Ludwig von den Wiesthal", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Ludwig",
		familyName: "von den Wiesthal"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseHypenatedName = function(){
	var parsed = Globalization.Name.parsePersonalName("Johan Michael Bergische-Schmidt", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Johan",
		middleName: "Michael",
		familyName: "Bergische-Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseQuadrupleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Johan Michael Jürgen Schmidt", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Johan",
		middleName: "Michael Jürgen",
		familyName: "Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseTitle = function(){
	var parsed = Globalization.Name.parsePersonalName("Herr Dr. Johan Schmidt", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Herr Dr.",
		givenName: "Johan",
		familyName: "Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseTitleWithFamilyOnly = function(){
	var parsed = Globalization.Name.parsePersonalName("Herr Schmidt", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Herr",
		familyName: "Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseTitleWithFamilyOnlyAndAdjunct = function(){
	var parsed = Globalization.Name.parsePersonalName("Herr von Schmidt", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Herr",
		familyName: "von Schmidt"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseHonorific = function(){
	var parsed = Globalization.Name.parsePersonalName("Fr. Julia Maier", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Fr.",
		givenName: "Julia",
		familyName: "Maier"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseEverything = function(){
	var parsed = Globalization.Name.parsePersonalName("Herr Präsident Johan Michael Jürgen Schmidt III", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Herr Präsident",
		givenName: "Johan",
		middleName: "Michael Jürgen",
		familyName: "Schmidt",
		suffix: "III"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseFamily = function(){
	var parsed = Globalization.Name.parsePersonalName("Die Maiers", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Die",
		familyName: "Maiers"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsDE.prototype.testParseCompoundHonorific = function(){
	var parsed = Globalization.Name.parsePersonalName("Herr und Frau Maier", 'de_de');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Herr und Frau",
		familyName: "Maier"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

/*
 * Format Tests
 */

NameTestsDE.prototype.testFormatSimpleNameShort = function(){
	var name = {
		givenName: "Johan",
		middleName: "Michael",
		familyName: "Schmidt"
	};
	var formatted = Globalization.Name.formatPersonalName(name, 'short', 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "Johan Schmidt";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatSimpleNameMedium = function(){
	var name = {
		givenName: "Johan",
		middleName: "Michael",
		familyName: "Schmidt"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "Johan Michael Schmidt";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatSimpleNameLong = function(){
	var name = {
		givenName: "Johan",
		middleName: "Michael",
		familyName: "Schmidt"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "Johan Michael Schmidt";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatComplexNameShort = function(){
	var name = {
		prefix: "Herr Doktor",
		givenName: "Johan",
		middleName: "Michael Uwe",
		familyName: "von Schmidt",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, 'short', 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "Johan von Schmidt";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatComplexNameMedium = function(){
	var name = {
		prefix: "Herr Doktor",
		givenName: "Johan",
		middleName: "Michael Uwe",
		familyName: "von Schmidt",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "Johan Michael Uwe von Schmidt";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatComplexNameLong = function(){
	var name = {
		prefix: "Herr Doktor",
		givenName: "Johan",
		middleName: "Michael Uwe",
		familyName: "von Schmidt",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "Herr Doktor Johan Michael Uwe von Schmidt III";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatAsianNameShort = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatAsianNameMedium = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsDE.prototype.testFormatAsianNameLong = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'de_de');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸太太";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
