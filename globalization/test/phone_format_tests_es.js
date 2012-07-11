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

function PhoneFormatTestsES() {
}

PhoneFormatTestsES.prototype.testFormatESStyle0 = function(){
	var formatted;
	var parsed = {
			areaCode: "957",
			subscriberNumber: "123456"
	};
	var expected = "957 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1 = function(){
	var formatted;
	var parsed = {
			areaCode: "957",
			subscriberNumber: "123456"
	};
	var expected = "957 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle2 = function(){
	var formatted;
	var parsed = {
			areaCode: "957",
			subscriberNumber: "123456"
	};
	var expected = "95 712 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 2);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle3 = function(){
	var formatted;
	var parsed = {
			areaCode: "957",
			subscriberNumber: "123456"
	};
	var expected = "957 123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 3);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatESInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "34",
			areaCode: "957",
			subscriberNumber: "123456"
	};
	var expected = "+34 957 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatMobile = function(){
	var formatted;
	var parsed = {
			mobilePrefix: "616",
			subscriberNumber: "846357"
	};
	var expected = "616 846 357";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatESInternationalAccessCode = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "34",
			areaCode: "957",
			subscriberNumber: "123456"
	};
	var expected = "00 34 957 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatESDialAround = function(){
	var formatted;
	var parsed = {
			cic: "1032",
			areaCode: "957",
			subscriberNumber: "123456"
	};
	var expected = "1032 957 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatESStyle0Partial1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "9"
	};
	var expected = "9";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial2 = function(){
	var formatted;
	var parsed = {
			areaCode: "91"
	};
	var expected = "91 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial3 = function(){
	var formatted;
	var parsed = {
			areaCode: "912"
	};
	var expected = "912 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial4 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "1"
	};
	var expected = "912 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial5 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "12"
	};
	var expected = "912 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial6 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "123"
	};
	var expected = "912 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial7 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "1234"
	};
	var expected = "912 123 4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial8 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "12345"
	};
	var expected = "912 123 45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial9 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "123456"
	};
	var expected = "912 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle0Partial10 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "1234567"	// too long
	};
	var expected = "9121234567"; 	// use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatESStyle1Partial1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "9"
	};
	var expected = "9";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial2 = function(){
	var formatted;
	var parsed = {
			areaCode: "91"
	};
	var expected = "91 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial3 = function(){
	var formatted;
	var parsed = {
			areaCode: "912"
	};
	var expected = "912 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial4 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "1"
	};
	var expected = "912 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial5 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "12"
	};
	var expected = "912 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial6 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "123"
	};
	var expected = "912 12 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial7 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "1234"
	};
	var expected = "912 12 34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial8 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "12345"
	};
	var expected = "912 12 34 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial9 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "123456"
	};
	var expected = "912 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatESStyle1Partial10 = function(){
	var formatted;
	var parsed = {
			areaCode: "912",
			subscriberNumber: "1234567"	// too long
	};
	var expected = "9121234567"; 	// use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "34",
			areaCode: "912",
			subscriberNumber: "123456"
	};
	var expected = "+34 912 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsES.prototype.testFormatInternationalPartial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial1 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00"
	};
	var expected = "00 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial2 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1"
	};
	var expected = "00 1 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial3 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			subscriberNumber: "6"
	};
	var expected = "00 1 6";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial4 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			subscriberNumber: "65"
	};
	var expected = "00 1 65";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial5 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650"
	};
	var expected = "00 1 650 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial6 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "5"
	};
	var expected = "00 1 650 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial7 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "55"
	};
	var expected = "00 1 650 55";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial8 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "555"
	};
	var expected = "00 1 650 555";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial9 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "5551"
	};
	var expected = "00 1 650 555 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial10 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "55512"
	};
	var expected = "00 1 650 555 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial11 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "555123"
	};
	var expected = "00 1 650 555 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsES.prototype.testFormatInternationalPartial12 = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "5551234"
	};
	var expected = "00 1 650 555 1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "es_es");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
