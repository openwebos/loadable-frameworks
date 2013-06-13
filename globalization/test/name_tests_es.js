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

function NameTestsES() {
}

/*
 * Parser Tests
 */

NameTestsES.prototype.testParseSimpleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Joaquin Cebolla", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Joaquin",
		familyName: "Cebolla"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseTripleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Joaquin Zaragoza Cebolla", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Joaquin",
		familyName: "Zaragoza Cebolla"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseAdjunctNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Mario de Sevilla", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Mario",
		familyName: "de Sevilla"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseMultiAdjunctNames = function(){
	var parsed = Globalization.Name.parsePersonalName("Mario de las Pulgas", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Mario",
		familyName: "de las Pulgas"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseHypenatedName = function(){
	var parsed = Globalization.Name.parsePersonalName("Joaquin Johnson-Cebolla", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Joaquin",
		familyName: "Johnson-Cebolla"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseQuadrupleName = function(){
	var parsed = Globalization.Name.parsePersonalName("Joaquin Michael de los Cruzes Cebolla", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Joaquin",
		middleName: "Michael",
		familyName: "de los Cruzes Cebolla"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseMultiMultiFamily = function(){
	var parsed = Globalization.Name.parsePersonalName("Joaquin Michael de los Cruzes de Namur", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Joaquin",
		middleName: "Michael",
		familyName: "de los Cruzes de Namur"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
NameTestsES.prototype.testParseTitle = function(){
	var parsed = Globalization.Name.parsePersonalName("Dr. Joaquin Cebolla", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Dr.",
		givenName: "Joaquin",
		familyName: "Cebolla"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseHonorific = function(){
	var parsed = Globalization.Name.parsePersonalName("Doña Julia Maria Lopez Ortiz", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Doña",
		givenName: "Julia",
		middleName: "Maria",
		familyName: "Lopez Ortiz"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseEverything = function(){
	var parsed = Globalization.Name.parsePersonalName("Doña Julia Maria Consuela de las Piñas Ortiz III", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Doña",
		givenName: "Julia",
		middleName: "Maria Consuela",
		familyName: "de las Piñas Ortiz",
		suffix: "III"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseConjunction1 = function(){
	var parsed = Globalization.Name.parsePersonalName("Rodrigo y Gabriella", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Rodrigo y Gabriella"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseConjunction2 = function(){
	var parsed = Globalization.Name.parsePersonalName("Rodrigo y Gabriella Cortez", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Rodrigo y Gabriella",
		familyName: "Cortez"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseConjunction3 = function(){
	var parsed = Globalization.Name.parsePersonalName("Rodrigo y Gabriella Cortez Colón", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Rodrigo y Gabriella",
		familyName: "Cortez Colón"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseConjunction4 = function(){
	var parsed = Globalization.Name.parsePersonalName("Miguel, Rodrigo, y Gabriella Cortez Colón", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "Miguel, Rodrigo, y Gabriella",
		familyName: "Cortez Colón"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseFamily = function(){
	var parsed = Globalization.Name.parsePersonalName("Los Hernandez", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Los",
		familyName: "Hernandez"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTestsES.prototype.testParseCompoundHonorific = function(){
	var parsed = Globalization.Name.parsePersonalName("Sr. y Sra. Hernandez", 'es_es');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		prefix: "Sr. y Sra.",
		familyName: "Hernandez"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

/*
 * Format Tests
 */

NameTestsES.prototype.testFormatSimpleNameShort = function(){
	var name = {
		givenName: "Joaquin",
		middleName: "Michael",
		familyName: "Cebolla"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'es_es');
	UnitTest.requireDefined(formatted);
	
	var expected = "Joaquin Cebolla";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatSimpleNameMedium = function(){
	var name = {
		givenName: "Joaquin",
		middleName: "Michael",
		familyName: "Cebolla"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'es_es');
	UnitTest.requireDefined(formatted);
	
	var expected = "Joaquin Michael Cebolla";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatSimpleNameLong = function(){
	var name = {
		givenName: "Joaquin",
		middleName: "Michael",
		familyName: "Cebolla"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'es_es');
	UnitTest.requireDefined(formatted);
	
	var expected = "Joaquin Michael Cebolla";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatComplexNameShort = function(){
	var name = {
		prefix: "Doña",
		givenName: "Julia",
		middleName: "Maria Consuela",
		familyName: "de las Piñas Ortiz",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'es_es');
	UnitTest.requireDefined(formatted);
	
	var expected = "Julia de las Piñas";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatComplexNameMedium = function(){
	var name = {
		prefix: "Doña",
		givenName: "Julia",
		middleName: "Maria Consuela",
		familyName: "de las Piñas Ortiz",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'es_es');
	UnitTest.requireDefined(formatted);
	
	var expected = "Julia Maria Consuela de las Piñas";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatComplexNameLong = function(){
	var name = {
		prefix: "Doña",
		givenName: "Julia",
		middleName: "Maria Consuela",
		familyName: "de las Piñas Ortiz",
		suffix: "III"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'es_es');
	UnitTest.requireDefined(formatted);
	
	var expected = "Doña Julia Maria Consuela de las Piñas Ortiz III";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatAsianNameShort = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.shortName, 'es_mx');
	UnitTest.requireDefined(formatted);
	
	var expected = "地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatAsianNameMedium = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.mediumName, 'es_mx');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};

NameTestsES.prototype.testFormatAsianNameLong = function(){
	var name = {
		prefix: "小",
		givenName: "獸",
		familyName: "地",
		suffix: "太太"
	};
	var formatted = Globalization.Name.formatPersonalName(name, Globalization.Name.longName, 'es_mx');
	UnitTest.requireDefined(formatted);
	
	var expected = "小地獸太太";
	
	UnitTest.requireEqual(expected, formatted);
	return UnitTest.passed;
};
