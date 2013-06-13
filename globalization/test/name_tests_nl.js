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

function NameTestsNL() {
}

/*
 * Parser Tests
 */

NameTestsNL.prototype.testParseSimpleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Jan Hoogeboom", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Jan",
		familyName: "Hoogeboom"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseTripleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Jan Michael Hoogeboom", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Jan",
		middleName: "Michael",
		familyName: "Hoogeboom"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseAdjunctNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Ludwig Klaus von Beethoven", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Ludwig",
		middleName: "Klaus",
		familyName: "von Beethoven"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseMultiAdjunctNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Geertje van den Bosch", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Geertje",
		familyName: "van den Bosch"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseHypenatedName = function(){
	var parsed = Globalization.Name.parsePersonalName("Jan Michael Bergische-Hoogeboom", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Jan",
		middleName: "Michael",
		familyName: "Bergische-Hoogeboom"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseQuadrupleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Jan Michael Jürgen Hoogeboom", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Jan",
		middleName: "Michael Jürgen",
		familyName: "Hoogeboom"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseTitle = function(){
	var parsed = Globalization.Name.parsePersonalName("Dr. Jan Hoogeboom", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Dr.",
		givenName: "Jan",
		familyName: "Hoogeboom"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseHonorific = function(){
	var parsed = Globalization.Name.parsePersonalName("Mvw. Julia Maier", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Mvw.",
		givenName: "Julia",
		familyName: "Maier"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsNL.prototype.testParseEverything = function(){
	var parsed = Globalization.Name.parsePersonalName("President Jan Michael Jürgen Hoogeboom III", 'nl_nl');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "President",
		givenName: "Jan",
		middleName: "Michael Jürgen",
		familyName: "Hoogeboom",
		suffix: "III"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

/*
 * Format Tests
 */

NameTestsNL.prototype.testFormatSimpleNameShort = function(){
	var name = {
		givenName: "Jan",
		middleNames: "Michael",
		familyName: "Hoogeboom"
	};
	var formatted = Globalization.Name.formatPersonalName(name, 'short', 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "Jan Hoogeboom";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatSimpleNameMedium = function(){
	var name = {
		givenName: "Jan",
		middleNames: "Michael",
		familyName: "Hoogeboom"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "Jan Michael Hoogeboom";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatSimpleNameLong = function(){
	var name = {
		givenName: "Jan",
		middleNames: "Michael",
		familyName: "Hoogeboom"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "Jan Michael Hoogeboom";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatComplexNameShort = function(){
	var name = {
		prefix: "Dr.",
		givenName: "Jan",
		middleName: "Michael Pieter",
		familyName: "van der Smits",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, 'short', 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "Jan van der Smits";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatComplexNameMedium = function(){
	var name = {
		prefix: "Dr.",
		givenName: "Jan",
		middleName: "Michael Pieter",
		familyName: "van der Smits",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "Jan Michael Pieter van der Smits";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatComplexNameLong = function(){
	var name = {
		prefix: "Dr.",
		givenName: "Jan",
		middleName: "Michael Pieter",
		familyName: "van der Smits",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "Dr. Jan Michael Pieter van der Smits III";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatAsianNameShort = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatAsianNameMedium = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsNL.prototype.testFormatAsianNameLong = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'nl_nl');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸太太";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
