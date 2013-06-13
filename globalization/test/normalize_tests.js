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

/*globals Globalization, Assert, console IMPORTS objectEquals UnitTest */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function NormalizeTests() {
}

NormalizeTests.prototype.testIDDPrefix = function(){
	var parsed = {
		iddPrefix: "011",
		countryCode: "31",
		areaCode: "456",
		subscriberNumber: "3453434"
	};
	var expected = "+314563453434";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testIDDPrefixAlreadyPlus = function(){
	var parsed = {
		iddPrefix: "+",
		countryCode: "31",
		areaCode: "456",
		subscriberNumber: "3453434"
	};
	var expected = "+314563453434";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testWithNoLocale = function(){
	var parsed = {
		iddPrefix: "011",
		countryCode: "31",
		areaCode: "456",
		subscriberNumber: "3453434"
	};
	var expected = "+314563453434";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}));
	return UnitTest.passed;
};

NormalizeTests.prototype.testNoHints = function(){
	var parsed = {
		iddPrefix: "011",
		countryCode: "31",
		areaCode: "456",
		subscriberNumber: "3453434"
	};
	var expected = "+314563453434";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, undefined, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testWithNoHintsNoLocale = function(){
	var parsed = {
		iddPrefix: "011",
		countryCode: "31",
		areaCode: "456",
		subscriberNumber: "3453434"
	};
	var expected = "+314563453434";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed));
	return UnitTest.passed;
};

NormalizeTests.prototype.testLDNumberUsingUSMCC = function(){
	var parsed = {
		areaCode: "650",
		subscriberNumber: "7654321"
	};
	var hints = {
		mcc: "316"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testLDNumberUsingUSMCCOtherLocale = function(){
	var parsed = {
		areaCode: "650",
		subscriberNumber: "7654321"
	};
	var hints = {
		mcc: "316"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testLDNumberUsingDEMCC = function(){
	var parsed = {
		areaCode: "2302",
		subscriberNumber: "654321"
	};
	var hints = {
		mcc: "262"
	};
	var expected = "+492302654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testServiceNumberUsingDEMCC = function(){
	var parsed = {
		trunkAccess: "0",
		serviceCode: "191",
		subscriberNumber: "7654321"
	};
	var hints = {
		mcc: "262"
	};
	var expected = "+491917654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testServiceNumberDontAddAreaCode = function(){
	var parsed = {
		trunkAccess: "0",
		serviceCode: "191",
		subscriberNumber: "7654321"
	};
	var hints = {
		defaultAreaCode: "30"
	};
	var expected = "+491917654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testMobileNumberUsingDEMCC = function(){
	var parsed = {
		trunkAccess: "0",
		mobilePrefix: "16",
		subscriberNumber: "87654321"
	};
	var hints = {
		mcc: "262"
	};
	var expected = "+491687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testMobileNumberDontAddAreaCode = function(){
	var parsed = {
		trunkAccess: "0",
		mobilePrefix: "16",
		subscriberNumber: "87654321"
	};
	var hints = {
		defaultAreaCode: "30"
	};
	var expected = "+491687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testLDNumberUsingDEMCCOtherLocale = function(){
	var parsed = {
		areaCode: "2302",
		subscriberNumber: "654321"
	};
	var hints = {
		mcc: "262"
	};
	var expected = "+492302654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'fr_fr'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testLDNumberUsingUSLocale = function(){
	var parsed = {
		areaCode: "650",
		subscriberNumber: "7654321"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testLDNumberUsingUSSpanishLocale = function(){
	var parsed = {
		areaCode: "650",
		subscriberNumber: "7654321"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'es_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testLDNumberUsingDELocale = function(){
	var parsed = {
		areaCode: "30",
		subscriberNumber: "87654321"
	};
	var expected = "+493087654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAreaCodeFromHint = function(){
	var parsed = {
		subscriberNumber: "7654321"
	};
	var hints = {
		defaultAreaCode: "650"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAreaCodeIgnoreHint = function(){
	var parsed = {
		areaCode: "408",
		subscriberNumber: "7654321"
	};
	var hints = {
		defaultAreaCode: "650"
	};
	var expected = "+14087654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testNoAreaCodeAndNoCountry = function(){
	var parsed = {
		subscriberNumber: "7654321"
	};
	var expected = "7654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testDontAddCountry = function(){
	var parsed = {
		subscriberNumber: "7654321"
	};
	var hints = {
		mcc: "262"	// de
	};
	var expected = "7654321";	// can't add country because we don't know the area code
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testIgnoreTrunkAccessUS = function(){
	var parsed = {
		trunkAccess: "1",
		areaCode: "408",
		subscriberNumber: "7654321"
	};
	var expected = "+14087654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testIgnoreTrunkAccessDE = function(){
	var parsed = {
		trunkAccess: "0",
		areaCode: "30",
		subscriberNumber: "87654321"
	};
	var expected = "+493087654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testDontIgnoreTrunkAccessIT = function(){
	var parsed = {
		iddPrefix: "+",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "6",	// rome
		subscriberNumber: "87654321"
	};
	var expected = "+390687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'it_it'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testDontIgnoreTrunkAccessNoCountryIT = function(){
	var parsed = {
		trunkAccess: "0",
		areaCode: "6", // rome
		subscriberNumber: "87654321"
	};
	var expected = "+390687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'it_it'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testDontIgnoreTrunkAccessUseMCCIT = function(){
	var parsed = {
		trunkAccess: "0",
		areaCode: "6", // rome
		subscriberNumber: "87654321"
	};
	var hints = {
		mcc: "222"
	};
	var expected = "+390687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAddTrunkAccessNoCountryIT = function(){
	var parsed = {
		areaCode: "6", // rome
		subscriberNumber: "87654321"
	};
	var expected = "+390687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, {}, 'it_it'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testCountryHintUS = function(){
	var parsed = {
		areaCode: "408",
		subscriberNumber: "7654321"
	};
	var hints = {
		country: "us"
	};
	var expected = "+14087654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testCountryHintUSOverrideLocale = function() {
	var parsed = {
		areaCode: "408",
		subscriberNumber: "7654321"
	};
	var hints = {
		country: "us"
	};
	var expected = "+14087654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testCountryHintFR = function(){
	var parsed = {
		areaCode: "2",
		subscriberNumber: "12345678"
	};
	var hints = {
		country: "fr"
	};
	var expected = "+33212345678";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringIDDPrefix = function(){
	var phone = "011-31-456-3453434";
	var expected = "+314563453434";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, {}, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringLDNumberUsingUSMCC = function(){
	var phone = "650-765-4321";
	var hints = {
		mcc: "316"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'en_us'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringLDNumberUsingUSMCCOtherLocale = function(){
	var phone = "650.765.4321";
	var hints = {
		mcc: "316"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringLDNumberUsingDEMCC = function(){
	var phone = "02302-654321";
	var hints = {
		mcc: "262"
	};
	var expected = "+492302654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringServiceNumberUsingDEMCC = function(){
	var phone = "0191 7654321";
	var hints = {
		mcc: "262"
	};
	var expected = "+491917654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringServiceNumberDontAddAreaCode = function(){
	var phone = "0191/7654321";
	var hints = {
		defaultAreaCode: "30"
	};
	var expected = "+491917654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringMobileNumberUsingDEMCC = function(){
	var phone = "016 8765 4321";
	var hints = {
		mcc: "262"
	};
	var expected = "+491687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringMobileNumberDontAddAreaCode = function(){
	var phone = "016 87654321";
	var hints = {
		defaultAreaCode: "30"
	};
	var expected = "+491687654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testStringLDStringNumberUsingUSMCCOtherLocale = function(){
	var phone = "(650) 765-4321";
	var hints = {
		mcc: "316"
	};
	var expected = "+16507654321";
	
	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'de_de'));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalUMTS = function() {
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "316",
		networkType: "umts",
		defaultAreaCode: "650",
		manualDialing: false,
		assistedDialing: true
	};
	var expectedString = "6507654321";
	var expectedPhone = {
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalUMTSAddTrunkClosed = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "33",
		areaCode: "1",
		subscriberNumber: "87654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "umts",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "0187654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "1",
		subscriberNumber: "87654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'fr_fr'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalUMTSAddTrunkOpenNoAreaCodes = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "352",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "270", // from Luxembourg, where there are no area codes
		networkType: "umts",
		assistedDialing: true
	};
	var expectedString = "7654321";
	var expectedPhone = {
		subscriberNumber: "7654321",
		locale: {
			region: "lu"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'de_lu'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalUMTSAddTrunkOpen = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "31",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "204", // from Netherlands
		networkType: "umts",
		defaultAreaCode: "10",
		assistedDialing: true
	};
	var expectedString = "0207654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "nl"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'nl_nl'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalUMTSNoTrunkOpen = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "31",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "204", // from Netherlands
		networkType: "umts",
		defaultAreaCode: "20",
		assistedDialing: true
	};
	var expectedString = "0207654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "nl"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'nl_nl'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalCDMA = function() {
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "310",
		networkType: "cdma",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "6507654321";
	var expectedPhone = {
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalCDMAAddTrunkClosed = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "33",
		areaCode: "1",
		subscriberNumber: "87654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "cdma",
		defaultAreaCode: "1",
		assistedDialing: true
	};
	var expectedString = "0187654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "1",
		subscriberNumber: "87654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'fr_fr'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalCDMAAddTrunkOpen = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "31",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "204", // from Netherlands
		networkType: "cdma",
		defaultAreaCode: "10",
		assistedDialing: true
	};
	var expectedString = "0207654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "nl"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'nl_nl'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalCDMANoTrunkOpen = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "31",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "204", // from Netherlands
		networkType: "cdma",
		defaultAreaCode: "20",
		assistedDialing: true
	};
	var expectedString = "0207654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "nl"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'nl_nl'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLocalUMTS = function() {
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "umts",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "+16507654321";
	var expectedPhone = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLDUMTS = function() {
	var phone = {
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "umts",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "+14167654321";
	var expectedPhone = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLDUMTSRemoveTrunk = function() {
	var phone = {
		trunkAccess: "1",
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "umts",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "+14167654321";
	var expectedPhone = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLDUMTSKeepTrunk = function() {
	var phone = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "87654321",
		locale: {
			region: "it"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "umts",
		defaultAreaCode: "1",
		assistedDialing: true
	};
	var expectedString = "+3901087654321";
	var expectedPhone = {
		iddPrefix: "+",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "87654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'it_it'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLocalCDMA = function() {
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "505", // From Australia
		networkType: "cdma",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "001116507654321";
	var expectedPhone = {
		iddPrefix: "0011",
		countryCode: "1",
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "au"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLDCDMA = function() {
	var phone = {
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "cdma",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "0014167654321";
	var expectedPhone = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLDCDMARemoveTrunk = function() {
	var phone = {
		trunkAccess: "1",
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "cdma",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "0014167654321";
	var expectedPhone = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLDCDMAKeepTrunk = function() {
	var phone = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "87654321",
		locale: {
			region: "it"
		}
	};
	var hints = {
		mcc: "208", // from France
		networkType: "cdma",
		defaultAreaCode: "1",
		assistedDialing: true
	};
	var expectedString = "003901087654321";
	var expectedPhone = {
		iddPrefix: "00",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "87654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'it_it'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalUMTSOpenNoDefAreaCode = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "31",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "204", // from Netherlands
		networkType: "umts",
		assistedDialing: true
	};
	var expectedString = "0207654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "nl"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'nl_nl'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingLocalToLocalCDMAOpenNoDefAreaCode = function() {
	var phone = {
		iddPrefix: "+",
		countryCode: "31",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "204", // from Netherlands
		networkType: "cdma",
		assistedDialing: true
	};
	var expectedString = "0207654321";
	var expectedPhone = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "7654321",
		locale: {
			region: "nl"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'nl_nl'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingIntlToLDDefaultToUMTS = function() {
	var phone = {
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "208", // from France
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "+14167654321";
	var expectedPhone = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "416",
		subscriberNumber: "7654321",
		locale: {
			region: "fr"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingDefaultIntlToLocalUMTS = function() {
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "730", // from Chile
		networkType: "umts",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "+16507654321";
	var expectedPhone = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "cl"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingNonDefaultIntlToLocalUMTS = function(){
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "440",	// from Japan
		networkType: "umts",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "+16507654321";
	var expectedPhone = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "jp"
		}
	};
	
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingDefaultIntlToLocalCDMA = function() {
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "415", // from Lebanon
		networkType: "cdma",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "0016507654321";
	var expectedPhone = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "lb"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingNonDefaultIntlToLocalCDMA = function() {
	var phone = {
		subscriberNumber: "7654321",
		locale: {
			region: "us"
		}
	};
	var hints = {
		mcc: "440", // from Japan
		networkType: "cdma",
		defaultAreaCode: "650",
		assistedDialing: true
	};
	var expectedString = "01016507654321";
	var expectedPhone = {
		iddPrefix: "010",
		countryCode: "1",
		areaCode: "650",
		subscriberNumber: "7654321",
		locale: {
			region: "jp"
		}
	};

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone,
			hints, 'en_us'));
	UnitTest.require(objectEquals(expectedPhone, phone));
	return UnitTest.passed;
};

// for CFISH-5258
NormalizeTests.prototype.testAssistedDialNormalizeBogusNumberNonVerizon = function(){
	var left = Globalization.Phone.parsePhoneNumber("449876543211", 'de_de');
	
	var hints = {
		homeLocale: 'de_de',
		mcc: "262", // in Germany
		networkType: "umts",
		defaultAreaCode: "30",	// phone is a German phone
		assistedDialing: true
	};
	var expectedString = "449876543211"; // don't assume it is international and add the bogus plus

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(left, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialNormalizeBogusNumberForVerizonUMTS = function(){
	var left = Globalization.Phone.parsePhoneNumber("449876543211"); // number is too long, so try with a + prefix
	
	var hints = {
		mcc: "310",
		networkType: "umts",
		defaultAreaCode: "650",	// phone is a US phone
		assistedDialing: true
	};
	var expectedString = "+449876543211"; // assumed to be an international call

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(left, hints)); // 'en_us'

	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialNormalizeBogusNumberForVerizonCDMA = function(){
	var left = Globalization.Phone.parsePhoneNumber("449876543211"); // number is too long, so try with a + prefix
	
	var hints = {
		mcc: "310",  // US
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone
		assistedDialing: true
	};
	var expectedString = "011449876543211"; // the plus gets converted to 011 for cdma

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(left, hints)); // 'en_us'

	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialNormalizeBogusNumberForVerizonAlreadyPlus = function(){
	var left = Globalization.Phone.parsePhoneNumber("+449876543211");
	
	var hints = {
		mcc: "310",  // US
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone
		assistedDialing: true
	};
	var expectedString = "011449876543211"; // plus gets converted to 011 for cdma

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(left, hints)); // 'en_us'

	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialNormalizeBogusNumberForVerizonAlreadyIDD = function(){
	var left = Globalization.Phone.parsePhoneNumber("011449876543211");
	
	var hints = {
		mcc: "310",  // US
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone
		assistedDialing: true
	};
	var expectedString = "011449876543211";

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(left, hints)); // 'en_us'

	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialNormalizeBogusNumberForVerizonWithTrunk = function(){
	var left = Globalization.Phone.parsePhoneNumber("1449876543233");
	
	var hints = {
		mcc: "310",  // US
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone
		assistedDialing: true
	};
	var expectedString = "1449876543233"; // don't touch things that already have a trunk prefix

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(left, hints)); // 'en_us'

	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialNormalizeBogusNumberForVerizonInvalidCountryCode = function(){
	var left = Globalization.Phone.parsePhoneNumber("4259876543233");
	
	var hints = {
		mcc: "310",  // US
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone
		assistedDialing: true
	};
	var expectedString = "4259876543233"; // don't touch things with an invalid country code. ie. the reparse with a + didn't work.

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(left, hints)); // 'en_us'

	return UnitTest.passed;
};

//for CFISH-5447
NormalizeTests.prototype.testDontRemoveDefaultAreaCodeAtHome = function() {
	var phone = Globalization.Phone.parsePhoneNumber("408-234-5678", 'en_us'); // number is invalid in the UK with no valid area code
	var hints = {
		mcc: "310", // currently located in the US
		networkType: "cdma",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true
	};
	var expectedString = "4082345678"; // should not strip default area code

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testDoAddDefaultAreaCodeAtHome = function() {
	var phone = Globalization.Phone.parsePhoneNumber("234-5678", 'en_us');
	var hints = {
		mcc: "310", // currently located in the US
		networkType: "cdma",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true
	};
	var expectedString = "4082345678"; // should add default area code

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};

// for CFISH-5217
NormalizeTests.prototype.testDefaultAreaCodeOnlyAtHome = function() {
	var phone = Globalization.Phone.parsePhoneNumber("+449876543211", 'en_us'); // number is invalid in the UK with no valid area code
	var hints = {
		mcc: "310", // currently located in the US
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true
	};
	var expectedString = "011449876543211"; // should not add default area code, which is for the US, not the UK

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testDefaultAreaCodeAtHome = function() {
	var phone = Globalization.Phone.parsePhoneNumber("6543211", 'en_us'); // number is in the same area code as the device is
	var hints = {
		mcc: "234", // currently located in the UK
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true
	};
	var expectedString = "0016506543211"; // should not add default area code, which is for the US, not the UK

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testDefaultAreaCodeAtHomeNoDefault = function() {
	var phone = Globalization.Phone.parsePhoneNumber("4086543211", 'en_us'); // number is in the same area code as the device is
	var hints = {
		mcc: "234", // currently located in the UK
		networkType: "cdma",
		defaultAreaCode: "650",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true
	};
	var expectedString = "0014086543211"; // should not add default area code, which is for the US, not the UK

	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};

// for CFISH-5307
NormalizeTests.prototype.testSMSToUSNumbersCDMA = function() {
	var phone = Globalization.Phone.parsePhoneNumber("650 456 7890", "en_us");
	var hints = {
		mcc: "208", // currently located in India
		networkType: "cdma",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "16504567890"; // should not add IDD for CDMA and not the default area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testSMSToUSNumbersUMTS = function() {
	var phone = Globalization.Phone.parsePhoneNumber("650 456 7890", "en_us");
	var hints = {
		mcc: "208", // currently located in India
		networkType: "umts",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "+16504567890"; // should not add IDD for CDMA and not the default area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testSMSToUSNumbersNoAreaCodeCDMA = function() {
	var phone = Globalization.Phone.parsePhoneNumber("456 7890", 'en_us');
	var hints = {
		mcc: "208", // currently located in India
		networkType: "cdma",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "14084567890"; // should add IDD and the default area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testSMSToUSNumbersNoAreaCodeUMTS = function() {
	var phone = Globalization.Phone.parsePhoneNumber("456 7890", 'en_us');
	var hints = {
		mcc: "208", // currently located in India
		networkType: "umts",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "+14084567890"; // should add IDD and the default area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
//for CFISH-5308
NormalizeTests.prototype.testSMSToNonUSNumbersFromAbroadCDMA = function() {
	var phone = Globalization.Phone.parsePhoneNumber("+44 20 4567890", 'en_us');
	var hints = {
		mcc: "208", // currently located in India
		networkType: "cdma",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "01144204567890"; // should add special IDD and no area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testSMSToNonUSNumbersFromAbroadUMTS = function() {
	var phone = Globalization.Phone.parsePhoneNumber("+44 20 4567890", 'en_us');
	var hints = {
		mcc: "208", // currently located in India
		networkType: "umts",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "01144204567890"; // should add special IDD and no area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testSMSToNonUSNumbersFromUSCDMA = function() {
	var phone = Globalization.Phone.parsePhoneNumber("+44 20 4567890", 'en_us');
	var hints = {
		mcc: "310", // currently located in US
		networkType: "cdma",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "01144204567890"; // should add special IDD and no area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testSMSToNonUSNumbersFromUSUMTS = function() {
	var phone = Globalization.Phone.parsePhoneNumber("+44 20 4567890", 'en_us');
	var hints = {
		mcc: "310", // currently located in US
		networkType: "umts",
		defaultAreaCode: "408",	// phone is a US phone, so this default area code only applies to calls to US numbers
		assistedDialing: true,
		sms: true
	};
	var expectedString = "+44204567890"; // should add special IDD and no area code
	UnitTest.requireEqual(expectedString, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};

//for CFISH-5729
NormalizeTests.prototype.testAssistedDialingEmergencyNumberDontNormalize = function() {
	var phone = Globalization.Phone.parsePhoneNumber("911", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "204", // from the Netherlands
		defaultAreaCode: "408"
	};
	var expected = "911"; 

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};

// for CFISH-5753
NormalizeTests.prototype.testAssistedDialingServiceNumberDontAddAreaCodeCDMA = function() {
	var phone = {
		trunkAccess: "1",
		serviceCode: "800",
		subscriberNumber: "7654321",
		locale: {
			region: 'us'
		}
	};
	var hints = {
		assistedDialing: true,
		networkType: "cdma",
		mcc: "204", // from the Netherlands
		defaultAreaCode: "430"
	};
	var expected = "0018007654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingServiceNumberDontAddAreaCodeUMTS = function() {
	var phone = {
		trunkAccess: "1",
		serviceCode: "800",
		subscriberNumber: "7654321",
		locale: {
			region: 'us'
		}
	};
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "204", // from the Netherlands
		defaultAreaCode: "430"
	};
	var expected = "+18007654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints)); // 'en_us'
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingTestFR = function() {
	Globalization.Locale.phoneRegion = "fr";
	var phone = Globalization.Phone.parsePhoneNumber("12345678");
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "310", // from the US
		defaultAreaCode: "1"
	};
	var expected = "+33112345678";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints, 'en_fr')); // 'en_us'
	Globalization.Locale.phoneRegion = "us";
	return UnitTest.passed;
};

// for CFISH-6022
NormalizeTests.prototype.testAssistedDialingVerizonVSC = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("*228", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "310", // US
		defaultAreaCode: "430"
	};
	var expected = "*228";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};

// for CFISH-5261
NormalizeTests.prototype.testAssistedDialingNonManual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("987-6543", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: false,
		mcc: "208", // France
		defaultAreaCode: "408"
	};
	var expected = "+14089876543";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingNonManualNoOption = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("987-6543", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "208", // France
		defaultAreaCode: "408"
	};
	var expected = "+14089876543";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingNonManualCDMA = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("987-6543", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "cdma",
		manualDialing: false,
		mcc: "208", // France
		defaultAreaCode: "408"
	};
	var expected = "0014089876543";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingManual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("987-6543", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: true,
		mcc: "208", // France
		defaultAreaCode: "408"
	};
	var expected = "9876543";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingManualWithTrunk = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("1-408-987-6543", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: true,
		mcc: "208", // France
		defaultAreaCode: "408"
	};
	var expected = "+14089876543";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingManualWithIDD = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("011-1-408-987-6543", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: true,
		mcc: "208", // France
		defaultAreaCode: "408"
	};
	var expected = "+14089876543";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingManualWithTrunkFR = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("01 12 34 56 78", 'fr_fr');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: true,
		mcc: "204", // Netherlands
		defaultAreaCode: "2"
	};
	var expected = "+33112345678";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingManualWithIDDFR = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+33 1 12 34 56 78", 'fr_fr');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: true,
		mcc: "208", // France
		defaultAreaCode: "2"
	};
	var expected = "0112345678";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingManualLocalIN = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("40861 76683", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: true,
		mcc: "405", // India
		defaultAreaCode: "80"
	};
	var expected = "4086176683";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingNonManualIN = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("4086176683", 'en_us');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: false,
		mcc: "405", // India
		defaultAreaCode: "80"
	};
	var expected = "+14086176683";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};

//for CFISH-6043
NormalizeTests.prototype.testNormalizeES = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("987654321", 'es_es');
	var hints = {
		networkType: "umts",
		mcc: "214", // from UK
		defaultAreaCode: "984"
	};
	var expected = "+34987654321";  // should not add trunk code

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingESSMS = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("987654321", 'es_es');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: false,
		mcc: "310", // from US
		defaultAreaCode: "984",
		sms: true
	};
	var expected = "+34987654321";  // should not add trunk code

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingES = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("987654321", 'es_es');
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: false,
		mcc: "310", // from US
		defaultAreaCode: "984"
	};
	var expected = "+34987654321";  // should not add trunk code

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints)); // 'en_us'
	return UnitTest.passed;
};

NormalizeTests.prototype.testAssistedDialingFR = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("12345678", 'fr_fr');
	var hints = {
		homeLocale: 'en_fr',
		assistedDialing: true,
		networkType: "umts",
		mcc: "310", // from US
		defaultAreaCode: "1"
	};
	var expected = "+33112345678";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

// for CFISH-6444
NormalizeTests.prototype.testAssistedDialingCN1 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("011 86 10 30123456");
	var hints = {
		assistedDialing: true,
		networkType: "cdma",
		mcc: "460", // from China
		defaultAreaCode: "408"
	};
	var expected = "01030123456";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingCN2 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("011 44 9876543211");
	var hints = {
		assistedDialing: true,
		networkType: "cdma",
		mcc: "460", // from China
		defaultAreaCode: "408"
	};
	var expected = "00449876543211";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

//for DFISH-6274
NormalizeTests.prototype.testAssistedDialingBogusInputs1 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("617 6683");
	var hints = {
		assistedDialing: true,
		networkType: "bogus",
		mcc: "460", // from China
		defaultAreaCode: "408"
	};
	var expected = "+14086176683"; // should default to UMTS

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingBogusInputs2 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("617 6683");
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "460", // from China
		defaultAreaCode: undefined
	};
	var expected = "6176683"; // should return as much as it can

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingBogusInputs3 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("617 6683");
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "-4564", // from never never land
		defaultAreaCode: "408"
	};
	var expected = "+14086176683"; // should default to international call

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingBogusInputs4 = function() {
	var parsed = {};
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: "460", // from China
		defaultAreaCode: "408"
	};
	var expected = ""; // should return something instead of giving an exception

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingBogusInputs5 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("4157773456");
	var hints = {
		assistedDialing: true,
		mcc: "310", // from US
		defaultAreaCode: undefined
	};
	var expected = "4157773456"; // should return something instead of giving an exception

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingBogusInputs6 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("617 6683");
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		mcc: undefined,
		defaultAreaCode: "408"
	};
	var expected = "4086176683"; // should default to international call

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

//for CFISH-6873
NormalizeTests.prototype.testAssistedDialingSMSSameCountryHomeIsUS = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+861098765432");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "011861098765432"; // should go through US first

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

//for CFISH-6444
NormalizeTests.prototype.testAssistedDialingForeignIDD = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("0044209876543");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: false,
		networkType: "cdma",
		mcc: "310", // in US
		defaultAreaCode: "408"
	};
	var expected = "01144209876543"; // normalize the foreign IDD to the proper US one

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

// for CFISH-6845
NormalizeTests.prototype.testAssistedDialingSameCountryHomeIsUS = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("00861098765432");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: false,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "01098765432"; // should be a domestic call

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

//for CFISH-6869
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA1 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("0019087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "19087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA2 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "19087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA2Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "19087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA3 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "19087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA3Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "19087654321"; // don't touch manually dialed stuff

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA4 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "19087654321";  // fix up things in your contact list

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA4Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "9087654321"; // don't touch manually dialed stuff

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA5 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("65876"); // short code
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "65876"; // special case -- don't do anything to short codes

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA6 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("7654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "908"
	};
	var expected = "19087654321";  // fix up things in your contact list

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlCDMA6Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("7654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "908"
	};
	var expected = "7654321";  // don't fix up manually dialed things

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA1 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA1Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA2 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("009087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA2Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("009087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA3 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("908765432101"); // +90 is Turkey
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "011908765432101";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA3Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("908765432101"); // +90 is Turkey
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "011908765432101";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA4 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("658765432101"); // +65 is Singapore -- special case
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "658765432101"; // special case -- don't add the special IDD

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA5 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("0119087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlCDMA5Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("0119087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "cdma",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};


NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS1 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("0019087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "+19087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS2 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "+19087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS2Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "+19087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS3 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "+19087654321";  // fix up things in your contact list

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS3Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("19087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "+19087654321"; // does touch the manually dialed stuff when there is a trunk prefix

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS4 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "+19087654321";  // fix up things in your contact list

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS4Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "9087654321"; // don't touch manually dialed stuff

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS5 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("65876"); // short code
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "65876"; // special case -- don't do anything to short codes

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS6 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("7654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "908"
	};
	var expected = "+19087654321";  // fix up things in your contact list

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToUSFromIntlUMTS6Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("7654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "908"
	};
	var expected = "7654321";  // don't fix up manually dialed things

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlUMTS1 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlUMTS1Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+9087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlUMTS2 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("009087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlUMTS2Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("009087654321");
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "0119087654321";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlUMTS3 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("908765432101"); // +90 is Turkey
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "011908765432101";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlUMTS3Manual = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("908765432101"); // +90 is Turkey
	var hints = {
		assistedDialing: true,
		manualDialing: true,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "011908765432101";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingSMSToIntlFromIntlUMTS4 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("658765432101"); // +65 is Singapore -- special case
	var hints = {
		assistedDialing: true,
		manualDialing: false,
		sms: true,
		networkType: "umts",
		mcc: "460", // in China
		defaultAreaCode: "408"
	};
	var expected = "658765432101"; // special case -- don't add the special IDD

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

//for CFISH-8481
NormalizeTests.prototype.testAssistedDialingLocalMobileIN = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("011 91 9911234567");
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: false,
		mcc: "405", // India
		defaultAreaCode: "80"
	};
	var expected = "09911234567";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};
NormalizeTests.prototype.testAssistedDialingLocalLandLineIN = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("011 91 11 12345678");
	var hints = {
		assistedDialing: true,
		networkType: "umts",
		manualDialing: false,
		mcc: "405", // India
		defaultAreaCode: "80"
	};
	var expected = "01112345678";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(parsed, hints));
	return UnitTest.passed;
};

//for CFISH-10884
NormalizeTests.prototype.testAssistedDialingIntlToLLDUMTSForES= function() {
	var phone = Globalization.Phone.parsePhoneNumber("+34 659 702 066", "es_es");
	var hints = {
		mcc: "214", // already in Spain
		networkType: "umts",
		defaultAreaCode: "659",
		manualDialing: false,
		assistedDialing: true
	};
	var expected = "659702066";

	UnitTest.requireEqual(expected, Globalization.Phone.normalize(phone, hints));
	return UnitTest.passed;
};
