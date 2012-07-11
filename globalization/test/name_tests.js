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

function NameTests() {
}

/*
 * Parse Tests
 */

NameTests.prototype.testENGetSortNameNull = function(){
	UnitTest.require(undefined == Globalization.Name.getSortName());
	return UnitTest.passed;
};
 
NameTests.prototype.testENGetSortNameSimple = function(){
	UnitTest.requireEqual("Beethoven", Globalization.Name.getSortName("Beethoven", 'en_us'));
	return UnitTest.passed;
};

NameTests.prototype.testENGetSortNameWithAuxillary = function(){
	UnitTest.requireEqual("von Beethoven", Globalization.Name.getSortName("von Beethoven", 'en_us'));
	return UnitTest.passed;
};

NameTests.prototype.testDEGetSortNameSimple = function(){
	UnitTest.requireEqual("Beethoven", Globalization.Name.getSortName("Beethoven", 'de_de'));
	return UnitTest.passed;
};

NameTests.prototype.testDEGetSortNameWithAuxillary = function(){
	UnitTest.requireEqual("Beethoven, von", Globalization.Name.getSortName("von Beethoven", 'de_de'));
	return UnitTest.passed;
};

NameTests.prototype.testNLGetSortNameSimple = function(){
	UnitTest.requireEqual("Bilt", Globalization.Name.getSortName("Bilt", 'nl_nl'));
	return UnitTest.passed;
};

NameTests.prototype.testNLGetSortNameWithAuxillary = function(){
	UnitTest.requireEqual("Bilt, van der", Globalization.Name.getSortName("van der Bilt", 'nl_nl'));
	return UnitTest.passed;
};


NameTests.prototype.testFRGetSortNameSimple = function(){
	UnitTest.requireEqual("Rothschild", Globalization.Name.getSortName("Rothschild", 'fr_fr'));
	return UnitTest.passed;
};

NameTests.prototype.testFRGetSortNameWithAuxillary = function(){
	UnitTest.requireEqual("de Rothschild", Globalization.Name.getSortName("de Rothschild", 'fr_fr'));
	return UnitTest.passed;
};

NameTests.prototype.testITGetSortNameSimple = function(){
	UnitTest.requireEqual("Checco", Globalization.Name.getSortName("Checco", 'it_it'));
	return UnitTest.passed;
};

NameTests.prototype.testITGetSortNameWithAuxillary = function(){
	UnitTest.requireEqual("di Checco", Globalization.Name.getSortName("di Checco", 'it_it'));
	return UnitTest.passed;
};

NameTests.prototype.testESGetSortNameSimple = function(){
	UnitTest.requireEqual("Reyes", Globalization.Name.getSortName("Reyes", 'es_es'));
	return UnitTest.passed;
};

NameTests.prototype.testESGetSortNameWithAuxillary = function(){
	UnitTest.requireEqual("de los Reyes", Globalization.Name.getSortName("de los Reyes", 'es_es'));
	return UnitTest.passed;
};

NameTests.prototype.testFunkyLanguage = function(){
	var parsed = Globalization.Name.parsePersonalName("John Michael Smith", 'zu_za');
	UnitTest.requireDefined(parsed);
	
	var expected = {
		givenName: "John",
		middleName: "Michael",
		familyName: "Smith"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

NameTests.prototype.testZHNameGetSortNamePinyin1 = function () {
	UnitTest.requireEqual("Wáng2", Globalization.Name.getSortName("王慧君", 'zh_cn'));
	return UnitTest.passed;
};

NameTests.prototype.testZHNameGetSortNamePinyin2 = function () {
	UnitTest.requireEqual("Gǔliáng2", Globalization.Name.getSortName("穀粱慧君", 'zh_cn'));
	return UnitTest.passed;
};

NameTests.prototype.testZHNameGetSortNamePinyin3 = function () {
	UnitTest.requireEqual("Wáng2", Globalization.Name.getSortName("王什", 'zh_cn'));
	return UnitTest.passed;
};

NameTests.prototype.testZHNameGetSortNamePinyin4 = function () {
	UnitTest.requireEqual("Hé1", Globalization.Name.getSortName("何", 'zh_cn'));
	return UnitTest.passed;
};

NameTests.prototype.testZHNameGetSortNameEnglish = function () {
	UnitTest.requireEqual("Williams", Globalization.Name.getSortName("Williams", 'zh_cn'));
	return UnitTest.passed;
};

NameTests.prototype.testZHGetSortNamePinyinMarried = function () {
	UnitTest.requireEqual("Qián2Lín1", Globalization.Name.getSortName("錢林慧君", 'zh_cn'));
	return UnitTest.passed;
};
