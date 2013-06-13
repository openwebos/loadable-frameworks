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

function PhoneFormatTestsIT() {
}

PhoneFormatTestsIT.prototype.testFormatITStyle0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "89",
			subscriberNumber: "1234567"
	};
	var expected = "089 1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "89",
			subscriberNumber: "1234567"
	};
	var expected = "089-1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "89",
			subscriberNumber: "1234567"
	};
	var expected = "089/1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 2);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIT.prototype.testFormatITInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "39",
			trunkAccess: "0",
			areaCode: "6",
			subscriberNumber: "12345678"
	};
	var expected = "+39 06 12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIT.prototype.testFormatITInternationalAccessCode = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "39",
			trunkAccess: "0",
			areaCode: "6",
			subscriberNumber: "12345678"
	};
	var expected = "00 39 06 12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIT.prototype.testFormatITMobile = function(){
	var formatted;
	var parsed = {
			mobilePrefix: "399",
			subscriberNumber: "1234567"
	};
	var expected = "399 1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITService = function(){
	var formatted;
	var parsed = {
			serviceCode: "799",
			subscriberNumber: "1234567"
	};
	var expected = "799 1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITNetService = function(){
	var formatted;
	var parsed = {
			serviceCode: "4",
			subscriberNumber: "34565434"
	};
	var expected = "4 34565434";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITSpecialRate = function(){
	var formatted;
	var parsed = {
			serviceCode: "899",
			subscriberNumber: "1234567"
	};
	var expected = "899 1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIT.prototype.testFormatITStyle0Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "9"
	};
	var expected = "09";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "96"
	};
	var expected = "096";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962"
	};
	var expected = "0962 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "1"
	};
	var expected = "0962 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "12"
	};
	var expected = "0962 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "123"
	};
	var expected = "0962 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "1234"
	};
	var expected = "0962 1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "12345"
	};
	var expected = "0962 12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "123456"
	};
	var expected = "0962 123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial11 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "1234567"
	};
	var expected = "0962 1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial12 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "12345678"
	};
	var expected = "0962 12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle0Partial12 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "123456789" // too long
	};
	var expected = "0962123456789"; // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIT.prototype.testFormatITStyle1Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "9"
	};
	var expected = "09";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "96"
	};
	var expected = "096";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962"
	};
	var expected = "0962-";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "1"
	};
	var expected = "0962-1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "12"
	};
	var expected = "0962-12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "123"
	};
	var expected = "0962-123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "1234"
	};
	var expected = "0962-1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "12345"
	};
	var expected = "0962-12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "123456"
	};
	var expected = "0962-123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial11 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "1234567"
	};
	var expected = "0962-1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial12 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "12345678"
	};
	var expected = "0962-12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIT.prototype.testFormatITStyle1Partial13 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "962",
			subscriberNumber: "123456789" // too long
	};
	var expected = "0962123456789"; // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "it_it", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
