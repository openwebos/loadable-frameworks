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

function PhoneFormatTestsIE() {
}

PhoneFormatTestsIE.prototype.testFormatIEStyle0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "1234567"
	};
	var expected = "(01) 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEStyle1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "1234567"
	};
	var expected = "01 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "+33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEInternationalAccessCode = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "00 33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIELongAreaCode = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12345"
	};
	var expected = "(0404) 12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEMobile = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			mobilePrefix: "85",
			subscriberNumber: "1234567"
	};
	var expected = "085 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatInternationalMobile = function(){
	var formatted;
	var parsed = {
		iddPrefix: "+",
		countryCode: "353",
		mobilePrefix: "86",
		subscriberNumber: "8223689"
	};
	var expected = "+353 86 822 3689";

	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.require(expected, formatted);
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEService = function(){
	var formatted;
	var parsed = {
			serviceCode: "1569",
			subscriberNumber: "1234567"
	};
	var expected = "1569 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEIDD = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "353",
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "1234567"
	};
	var expected = "+353 1 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEPersonal = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "700",
			subscriberNumber: "1234567"
	};
	var expected = "0700 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "4"
	};
	var expected = "04";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "40"
	};
	var expected = "040";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404"
	};
	var expected = "(0404) ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "1"
	};
	var expected = "(0404) 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12"
	};
	var expected = "(0404) 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "123"
	};
	var expected = "(0404) 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "1234"
	};
	var expected = "(0404) 1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12345"
	};
	var expected = "(0404) 12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "123456"
	};
	var expected = "(0404) 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "1234567"
	};
	var expected = "(0404) 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial11 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12345678"
	};
	var expected = "(0404) 1234 5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0Partial12 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "123456789" // too long
	};
	var expected = "0404123456789";	// last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4"
	};
	var expected = "04 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "40"
	};
	var expected = "040 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404"
	};
	var expected = "0404 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "1"
	};
	var expected = "0404 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12"
	};
	var expected = "0404 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "123"
	};
	var expected = "0404 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "1234"
	};
	var expected = "0404 1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12345"
	};
	var expected = "0404 12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "123456"
	};
	var expected = "0404 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "1234567"
	};
	var expected = "0404 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial11 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12345678"
	};
	var expected = "0404 1234 5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1Partial11 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "123456789"
	};
	var expected = "0404123456789";	// last resort rule because subscriberNumber is too long
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal2 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal3 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal4 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "4563";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal5 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "45634";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal6 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "456 345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal7 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "456 3453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle0PartialLocal8 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634535"
	};
	var expected = "4563 4535";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal2 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal3 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal4 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "4563";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal5 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "45634";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal6 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "456 345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal7 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "456 3453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal8 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634534"
	};
	var expected = "4563 4534";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsIE.prototype.testFormatIEStyle1PartialLocal9 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345345"
	};
	var expected = "456345345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_gb", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

//for CFISH-5426
PhoneFormatTestsIE.prototype.testFormatIEEmergency = function(){
	var formatted;
	var parsed = {
		emergency: "999"
	}
	var expected = "999";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_ie");
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

