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

/*globals Globalization, Assert, console */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function ResourcesTests() {
}

ResourcesTests.prototype.testLoadResources = function() {
	var rb = new Globalization.ResourceBundle("de_de", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	return UnitTest.passed;
};

ResourcesTests.prototype.testCorrectStrings = function() {
	var rb = new Globalization.ResourceBundle("de_de", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	UnitTest.requireEqual("German Shtringz", rb.$L("English String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testMergedResources = function() {
	var rb = new Globalization.ResourceBundle("de_de", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	// test that the german from germany and the generic german strings are all merged
	UnitTest.requireEqual("German top level string", rb.$L("Top level string"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testOverridenResources = function() {
	var rb = new Globalization.ResourceBundle("de_de", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	// get the german from germany
	UnitTest.requireEqual("Das Overgeridden String", rb.$L("Overridden String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testNotOverridenResources = function() {
	var rb = new Globalization.ResourceBundle("de", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	// get the generic german
	UnitTest.requireEqual("Overgeriddene String", rb.$L("Overridden String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testDefaultToGenericLanguage = function() {
	var rb = new Globalization.ResourceBundle("de_at", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	// don't have austrian german, so defaulting to generic german
	UnitTest.requireEqual("Overgeriddene String", rb.$L("Overridden String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testDefaultToEnglish = function() {
	var rb = new Globalization.ResourceBundle("xx_xx", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	// should return the US English always
	UnitTest.requireEqual("Overridden String", rb.$L("Overridden String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testKeyValues = function() {
	var rb = new Globalization.ResourceBundle("de_de", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	UnitTest.requireEqual("Das Linux", rb.$L({key: "os", value: "Linux"}));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testKeyValuesDefaultToGeneric = function() {
	var rb = new Globalization.ResourceBundle("de_at", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	UnitTest.requireEqual("Das Ubuntu Linux", rb.$L({key: "os", value: "Linux"}));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testKeyValuesDefaultToEnglish = function() {
	var rb = new Globalization.ResourceBundle("xx_xx", MojoLoader.root + "/test");
	UnitTest.requireDefined(rb);
	
	UnitTest.requireEqual("Linux", rb.$L({key: "os", value: "Linux"}));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleFactory = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleFactoryDefault = function() {
	var cache = new Globalization.ResourceBundleFactory();
	UnitTest.requireDefined(cache);
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleFactoryGetRB = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('de_de');
	UnitTest.requireEqual("German Shtringz", rb.$L("English String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleFactoryGetRBLangOnly = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('de');
	
	UnitTest.requireEqual("German Strings", rb.$L("English String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleFactoryGetUnknownLocale = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('xx_xx');
	
	UnitTest.requireEqual("English String", rb.$L("English String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleFactoryGetNullLocale = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle();
	
	// should default to US English
	UnitTest.requireDefined(rb);
	UnitTest.requireEqual("English String", rb.$L("English String"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesFull = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('de_de');
	
	var expected = '{"test": "test string in de_de"}';
	
	UnitTest.requireEqual(expected, rb.getLocalizedResource("config/test.json"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesLangOnly = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('de');
	
	var expected = '{"test": "test string in de"}';
	
	UnitTest.requireEqual(expected, rb.getLocalizedResource("config/test.json"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesDefaultToLang = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('de_at');
	
	var expected = '{"test": "test string in de"}';
	
	UnitTest.requireEqual(expected, rb.getLocalizedResource("config/test.json"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesOldSchoolLocale = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('nl_nl');
	
	var expected = '{"test": "test string in nl_nl"}';
	
	UnitTest.requireEqual(expected, rb.getLocalizedResource("config/test.json"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesENUS = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('en_us');
	
	var expected = '{"test": "test string in en_us"}';
	
	UnitTest.requireEqual(expected, rb.getLocalizedResource("config/test.json"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesFindDefault = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('de_de');
	
	var expected = '{"test2": "test string in en_us"}';
	
	UnitTest.requireEqual(expected, rb.getLocalizedResource("config/test2.json"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesUnknownLocale = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('xx_xx');
	
	var expected = '{"test": "test string in en_us"}';
	
	UnitTest.requireEqual(expected, rb.getLocalizedResource("config/test.json"));
	
	return UnitTest.passed;
};

ResourcesTests.prototype.testBundleGetLocalizedResourcesMissingFile = function() {
	var cache = new Globalization.ResourceBundleFactory(MojoLoader.root + "/test");
	UnitTest.requireDefined(cache);
	
	var rb = cache.getResourceBundle('de_de');
	
	UnitTest.require(rb.getLocalizedResource("config/foobar.json") === undefined);
	
	return UnitTest.passed;
};
