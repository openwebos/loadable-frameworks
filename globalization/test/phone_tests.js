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

function PhoneNumberTests() {
}

PhoneNumberTests.prototype.testNumberMatchFRDepartments1 = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "fr_fr"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchFRDepartments1Reverse = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, "fr_fr"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchFRDepartmentsWrongArea = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "591",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "fr_fr"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchFRDepartmentsWrongAreaReverse = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "591",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(right, left, "fr_fr"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchFRDepartmentsDifferentCountryCodes = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "33",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "fr_fr"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchFRDifferentSN = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "590",
		subscriberNumber: "123454"
	};
	
	UnitTest.require(20, Globalization.Phone.comparePhoneNumbers(left, right, "fr_fr"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSTrunk = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSTrunkReverse = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSTrunkDefaultLocale = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSTrunkDefaultLocaleReverse = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSTrunkWrongLocale = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, 'fr_fr'));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSTrunkWrongLocaleReverse = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, 'fr_fr'));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchUSMissingArea = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(88, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSMissingAreaReverse = function(){
	var left = {
		trunkAccess: "1",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(88, Globalization.Phone.comparePhoneNumbers(right, left, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSDifferentArea = function(){
	var left = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "407",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSDifferentAreaReverse = function(){
	var left = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		areaCode: "407",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(right, left, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSCompletelyDifferentCountryCodes = function(){
	// different area codes, where neither is the US
	var left = {
		iddPrefix: "+",
		countryCode: "30",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "34",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSMissingCountryCodeThisCountry = function(){
	// missing area code, where the one that is present is the same as the locale
	var left = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "34",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(84, Globalization.Phone.comparePhoneNumbers(left, right, "es_es"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSMissingCountryCodeThisCountryReverse = function(){
	// missing area code, where the one that is present is the same as the locale
	var left = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "34",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(84, Globalization.Phone.comparePhoneNumbers(right, left, "es_es"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSMissingCountryCodeOtherCountry = function(){
	// missing area codes, where the one that is present is not the same as the current locale (US)
	var left = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "34",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(68, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSMissingCountryCodeOtherCountryReverse = function(){
	// missing area codes, where the one that is present is not the same as the current locale (US)
	var left = {
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "34",
		areaCode: "590",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(68, Globalization.Phone.comparePhoneNumbers(right, left, "en_us"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchITSanMarino = function(){
	var left = {
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchITSanMarinoReverse = function(){
	var left = {
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSSanMarino = function(){
	var left = {
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};

	// only a 100% match if calling from inside of italy
	UnitTest.requireEqual(68, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchITSanMarinoWrongArea = function(){
	var left = {
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "374",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "it_it"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchITSanMarinoDifferentCountryCodes = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	var right = {
		iddPrefix: "00",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchITSanMarinoDifferentCountryCodesReverse = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	var right = {
		iddPrefix: "00",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchITSanMarinoDifferentCountryCodesDiffAreaCodes = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "378",
		subscriberNumber: "123456"
	};
	var right = {
		iddPrefix: "00",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "374",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchITVaticanCity = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "379",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchITVaticanCityReverse = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "379",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, "it_it"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchITOther = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "44",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	
	UnitTest.requireEqual(84, Globalization.Phone.comparePhoneNumbers(left, right, "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchITOtherReverse = function(){
	var left = {
		iddPrefix: "+",
		countryCode: "44",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	
	UnitTest.requireEqual(84, Globalization.Phone.comparePhoneNumbers(right, left, "it_it"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testNumberMatchUSDifferentCountryCodesIT = function(){
	// both ways are valid ways to reach the Vatican from abroad
	var left = {
		countryCode: "379",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	var right = {
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSDifferentCountryCodesITReverse = function(){
	// both ways are valid ways to reach the Vatican from abroad
	var left = {
		countryCode: "379",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	var right = {
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "69812345"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSDifferentCountryCodesFR = function(){
	// both ways are valid ways to reach the departments from abroad
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "33",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSDifferentCountryCodesFRReverse = function(){
	// both ways are valid ways to reach the departments from abroad
	var left = {
		iddPrefix: "+",
		countryCode: "590",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	var right = {
		iddPrefix: "+",
		countryCode: "33",
		areaCode: "590",
		subscriberNumber: "123456"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(right, left, "en_us"));
	
	return UnitTest.passed;
};


PhoneNumberTests.prototype.testNumberMatchDEMissingExtension = function(){
	var left = {
		trunkAccess: "0",
		areaCode: "2203",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "2203",
		subscriberNumber: "123456",
		extension: "789"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "de_de"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchDEMissingExtensionReverse = function(){
	var left = {
		trunkAccess: "0",
		areaCode: "2203",
		subscriberNumber: "123456"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "2203",
		subscriberNumber: "123456",
		extension: "789"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(right, left, "de_de"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchDEDifferentExtension = function(){
	var location;
	var left = {
		trunkAccess: "0",
		areaCode: "2203",
		subscriberNumber: "123456",
		extension: "833"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "2203",
		subscriberNumber: "123456",
		extension: "789"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "de_de"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchUSEverythingDifferent = function(){
	var location;
	var left = {
		trunkAccess: "0",
		countryCode: "49",
		areaCode: "2203",
		subscriberNumber: "123456",
		extension: "833"
	};
	var right = {
		trunkAccess: "1",
		areaCode: "650",
		subscriberNumber: "7654321"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchCAUseNanpRules = function(){
	var location;
	var left = {
		areaCode: "416",
		subscriberNumber: "1234567"
	};
	var right = {
		trunkAccess: "1",
		areaCode: "416",
		subscriberNumber: "1234567"
	};
	
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers(left, right, "en_ca"));
	
	return UnitTest.passed;
};

// for bug NOV-116615
PhoneNumberTests.prototype.testNumberMatchMobileVsLDNumber = function(){
	var location;
	var left = {
		iddPrefix: "+",
		countryCode: "44",
		mobilePrefix: "7734",
		subscriberNumber: "345345"
	};
	var right = {
		trunkAccess: "0",
		areaCode: "1483",
		subscriberNumber: "345345"
	};
	
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers(left, right, "en_gb"));
	
	return UnitTest.passed;
};

//for bug NOV-118901
PhoneNumberTests.prototype.testNumberMatchSG = function(){
	var location;
	var left = {
		iddPrefix: "+",
		countryCode: "65",
		subscriberNumber: "93897077"
	};
	var right = {
		subscriberNumber: "93897077"
	};
	
	UnitTest.requireEqual(84, Globalization.Phone.comparePhoneNumbers(left, right, "en_sg"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testNumberMatchSGWrongLocale = function(){
	var location;
	var left = {
		iddPrefix: "+",
		countryCode: "65",
		subscriberNumber: "93897077"
	};
	var right = {
		subscriberNumber: "93897077"
	};
	
	UnitTest.requireEqual(68, Globalization.Phone.comparePhoneNumbers(left, right, "en_us"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testStringsNumberMatchUSIgnoreSomeFields = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('1 (650) 456-7890', '650-456-7890', "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITSanMarinoDifferentCountryCodes = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('+378 0549 123 456', '+39 0549 123 456', "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITSanMarinoMissingCountryCodes = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('+378 0549 123 456', '0549 123 456', "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITSanMarinoDifferentCountryCodesDiffAreaCodes = function(){
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers('+378 0548 123 456', '+39 0545 123 456', "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITOther = function(){
	UnitTest.requireEqual(84, Globalization.Phone.comparePhoneNumbers('+39 06 69812345', '06-69812345', "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchFRDepartments1 = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('+590 590 123 456', '0590 123 456', "fr_fr"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchDEMissingExtension = function(){
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers('02203 123456', '02203 123456-789', "de_de"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchDEDifferentExtension = function(){
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers('02203/123456-833', '02203 123456-789', "de_de"));
	
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testStringsNumberMatchUSIgnoreSomeFieldsReverse = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('650-456-7890', '1 (650) 456-7890', "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITSanMarinoDifferentCountryCodesReverse = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('+39 0549 123 456', '+378 0549 123 456', "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITSanMarinoMissingCountryCodesReverse = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('0549 123 456', '+378 0549 123 456', "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITSanMarinoDifferentCountryCodesDiffAreaCodesReverse = function(){
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers('+39 0545 123 456', '+378 0548 123 456', "en_us"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchITOtherReverse = function(){
	UnitTest.requireEqual(84, Globalization.Phone.comparePhoneNumbers('06-69812345', '+39 06 69812345', "it_it"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchFRDepartments1Reverse = function(){
	UnitTest.requireEqual(100, Globalization.Phone.comparePhoneNumbers('0590 123 456', '+590 590 123 456', "fr_fr"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchDEMissingExtensionReverse = function(){
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers('02203 123456-789', '02203 123456', "de_de"));
	
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testStringsNumberMatchDEDifferentExtensionReverse = function(){
	UnitTest.requireEqual(0, Globalization.Phone.comparePhoneNumbers('02203 123456-789', '02203/123456-833', "de_de"));
	
	return UnitTest.passed;
};


PhoneNumberTests.prototype.testMinLengthUS = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('en_us'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthCA = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('en_ca'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthBE = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength('nl_be'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthCN = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('zh_cn'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthDE = function () {
	UnitTest.requireEqual(3, Globalization.Phone.getMinLocalPhoneNumberLength('de_de'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthES = function () {
	UnitTest.requireEqual(9, Globalization.Phone.getMinLocalPhoneNumberLength('es_es'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthFR = function () {
	UnitTest.requireEqual(8, Globalization.Phone.getMinLocalPhoneNumberLength('fr_fr'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthGB = function () {
	UnitTest.requireEqual(4, Globalization.Phone.getMinLocalPhoneNumberLength('en_gb'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthIE = function () {
	UnitTest.requireEqual(5, Globalization.Phone.getMinLocalPhoneNumberLength('en_ie'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthIN = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength('en_in'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthIT = function () {
	UnitTest.requireEqual(4, Globalization.Phone.getMinLocalPhoneNumberLength('it_it'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthLU = function () {
	UnitTest.requireEqual(3, Globalization.Phone.getMinLocalPhoneNumberLength('de_lu'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthMX = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('es_mx'));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthNL = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength('nl_nl'));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testMinLengthUSWithMCC = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 316));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthCAWithMCC = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 302));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthBEWithMCC = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 206));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthCNWithMCC = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 460));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthDEWithMCC = function () {
	UnitTest.requireEqual(3, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 262));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthESWithMCC = function () {
	UnitTest.requireEqual(9, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 214));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthFRWithMCC = function () {
	UnitTest.requireEqual(8, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 208));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthGBWithMCC = function () {
	UnitTest.requireEqual(4, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 235));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthIEWithMCC = function () {
	UnitTest.requireEqual(5, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 272));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthINWithMCC = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 405));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthITWithMCC = function () {
	UnitTest.requireEqual(4, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 222));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthLUWithMCC = function () {
	UnitTest.requireEqual(3, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 270));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthMXWithMCC = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 334));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthNLWithMCC = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength(undefined, 204));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testMinLengthUSWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('de_de', 316));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthCAWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 302));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthBEWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 206));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthCNWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 460));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthDEWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(3, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 262));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthESWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(9, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 214));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthFRWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(8, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 208));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthGBWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(4, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 235));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthIEWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(5, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 272));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthINWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 405));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthITWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(4, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 222));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthLUWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(3, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 270));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthMXWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(7, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 334));
	return UnitTest.passed;
};
PhoneNumberTests.prototype.testMinLengthNLWithMCCOverrideLocale = function () {
	UnitTest.requireEqual(6, Globalization.Phone.getMinLocalPhoneNumberLength('en_us', 204));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testGetPhoneFormatExamplesUS = function () {
	var expected = [
		{key: "default", value: "1 (650) 555-1234"},
		{key: "dashes", value: "1-650-555-1234"},
		{key: "dots", value: "1.650.555.1234"}
	];
	
	UnitTest.require(objectEquals(expected, Globalization.Format.getPhoneFormatExamples('us')));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testGetPhoneFormatExamplesNL = function () {
	var expected = [
		{key: "default", value: "(020) 123 4567"},
		{key: "spatie", value: "020 123 4567"},
		{key: "gecomprimeerd", value: "020 1234567"},
		{key: "streepjes", value: "020-123-45-67"},
		{key: "japen", value: "020/123 45 67"}
	];
	
	UnitTest.require(objectEquals(expected, Globalization.Format.getPhoneFormatExamples('nl')));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testGetPhoneFormatExamplesCN = function () {
	var expected = [
		{key: "default", value: "010 12345678"},
		{key: "破折号", value: "010-12345678"}
	];
	
	UnitTest.require(objectEquals(expected, Globalization.Format.getPhoneFormatExamples('cn')));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testGetCountryCodeForMCC1 = function () {
	UnitTest.requireEqual("de", Globalization.Phone.getCountryCodeForMCC("262"));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testGetCountryCodeForMCC2 = function () {
	UnitTest.requireEqual("us", Globalization.Phone.getCountryCodeForMCC("316"));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testGetCountryCodeForMCC3 = function () {
	// this is actually canada, but it should be under the US numbering plan
	UnitTest.requireEqual("us", Globalization.Phone.getCountryCodeForMCC("302"));
	return UnitTest.passed;
};

PhoneNumberTests.prototype.testGetCountryCodeForMCC4 = function () {
	UnitTest.requireEqual("sg", Globalization.Phone.getCountryCodeForMCC("525"));
	return UnitTest.passed;
};
