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

function PhoneFormatTestsGB() {
}

PhoneFormatTestsGB.prototype.testFormatStyle0 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "20",
			subscriberNumber: "34523434"
	};
	var expected = "(020) 3452 3434";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatStyle1 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "20",
			subscriberNumber: "34523434"
	};
	var expected = "020 3452 3434";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatInternational = function() {
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "+33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatInternationalAccessCode = function() {
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "00 33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatLongAreaCode = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "17684",
			subscriberNumber: "12345"
	};
	var expected = "(0176 84) 12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsGB.prototype.testFormatMobile = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			mobilePrefix: "75",
			subscriberNumber: "1234567"
	};
	var expected = "075 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatMobileInternational = function() {
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "44",
			trunkAccess: "0",
			mobilePrefix: "75",
			subscriberNumber: "1234567"
	};
	var expected = "+44 75 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatService = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "300",
			subscriberNumber: "1234567"
	};
	var expected = "(0300) 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatIEIDD = function() {
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "353",
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "1234567"
	};
	var expected = "+353 1 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatStyle0Partial0 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial1 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "1"
	};
	var expected = "01";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial2 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "12"
	};
	var expected = "012";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial3 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "120"
	};
	var expected = "0120";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial4 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1202"
	};
	var expected = "(01202) ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial5 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1202",
			subscriberNumber: "3"
	};
	var expected = "(01202) 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial6 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1202",
			subscriberNumber: "34"
	};
	var expected = "(01202) 34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial7 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1202",
			subscriberNumber: "345"
	};
	var expected = "(01202) 345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial8 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1202",
			subscriberNumber: "3453"
	};
	var expected = "(01202) 3453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial9 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1202",
			subscriberNumber: "34534"
	};
	var expected = "(01202) 34534";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0Partial10 = function() {
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1202",
			subscriberNumber: "345343"
	};
	var expected = "(01202) 345343";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal1 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal2 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal3 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal4 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "4563";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal5 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "45634";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal6 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "456345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal7 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "456 3453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal8 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "45634535"
	};
	var expected = "4563 4535";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle0PartialLocal9 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "456345352"	// too long
	};
	var expected = "456345352";	// use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal1 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal2 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal3 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal4 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "4563";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal5 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "45634";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal6 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "456345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal7 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "456 3453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal8 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "45634534"
	};
	var expected = "4563 4534";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsGB.prototype.testFormatStyle1PartialLocal9 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "456345345"	// too long
	};
	var expected = "456345345"; // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
