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

/*globals Globalization, Assert, console */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function PhoneFormatTestsIN() {
}

PhoneFormatTestsIN.prototype.testFormatINStyle0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "11",
			subscriberNumber: "12345678"
	};
	var expected = "011-12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "11",
			subscriberNumber: "12345678"
	};
	var expected = "011 1234 5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "11",
			subscriberNumber: "12345678"
	};
	var expected = "011-1234-5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 2);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIN.prototype.testFormatINInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "91",
			areaCode: "11",
			subscriberNumber: "12345678"
	};
	var expected = "+91 11 12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINInternationalLongArea = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "91",
			areaCode: "7753",
			subscriberNumber: "123456"
	};
	var expected = "+91 7753 123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINInternationalAccessCode = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "91",
			areaCode: "11",
			subscriberNumber: "12345678"
	};
	var expected = "00 91 11 12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIN.prototype.testFormatINPlusIDDtoUnknownCountry = function(){
	var formatted;
	var parsed = {
		iddPrefix: "+",
		countryCode: "872",	// pitcairn island
		subscriberNumber: "987654321"
	};
	var expected = "+872 987654321";	// use last resort rule for subscriber number
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIN.prototype.testFormatINInternationalMobile = function(){
	var formatted;
	var parsed = {
		iddPrefix: "+",
		countryCode: "91",
		mobilePrefix: "912",
		subscriberNumber: "7654321"
	};
	var expected = "+91 91276 54321";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_us", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIN.prototype.testFormatINMobile = function(){
	var formatted;
	var parsed = {
		mobilePrefix: "912",
		subscriberNumber: "7654321"
	};
	var expected = "91276-54321";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIN.prototype.testFormatINStyle0Partial1 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial2 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		subscriberNumber: "1"
	};
	var expected = "01";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial3 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11"
	};
	var expected = "011-";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial4 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "1"
	};
	var expected = "011-1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial5 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12"
	};
	var expected = "011-12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial6 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "123"
	};
	var expected = "011-123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial7 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "1234"
	};
	var expected = "011-1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial8 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12345"
	};
	var expected = "011-12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial9 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "123456"
	};
	var expected = "011-123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial10 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "1234567"
	};
	var expected = "011-1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial11 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12345678"
	};
	var expected = "011-12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0Partial12 = function(){
	var formatted;
	var parsed = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "123456789" // too long
	};
	var expected = "011123456789"; // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal1 = function(){
	var formatted;
	var parsed = {
		subscriberNumber: "8"
	};
	var expected = "8";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal2 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "87"
	};
	var expected = "87";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal3 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "876"
	};
	var expected = "876";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal4 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "8765"
	};
	var expected = "8765";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal5 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "87654"
	};
	var expected = "87654";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal6 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "876543"
	};
	var expected = "876543";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal7 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "8765432"
	};
	var expected = "8765432";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal8 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "87654321"
	};
	var expected = "87654321";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINStyle0PartialLocal9 = function(){
	var formatted;
	var parsed = {
		subscriberNumber: "876543210"  // too long
	};
	var expected = "876543210";  // shouldn't matter, but theoretically use the last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIN.prototype.testFormatINMobile = function(){
	var formatted;
	var parsed = {
		mobilePrefix: "991",
		subscriberNumber: "2345678"
	};
	var expected = "99123-45678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_in", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
