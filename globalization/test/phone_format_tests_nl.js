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

function PhoneFormatTestsNL() {
}

PhoneFormatTestsNL.prototype.testFormatStyle0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "255",
			subscriberNumber: "123456"
	};
	var expected = "(0255) 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatStyle1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "255",
			subscriberNumber: "123456"
	};
	var expected = "0255 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "255",
			subscriberNumber: "123456"
	};
	var expected = "0255 123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 2);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "255",
			subscriberNumber: "123456"
	};
	var expected = "0255-123-456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 3);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "255",
			subscriberNumber: "123456"
	};
	var expected = "0255/12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 4);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "31",
			areaCode: "20",
			subscriberNumber: "1234567"
	};
	var expected = "+31 20 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatInternationalAccessCode = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "31",
			areaCode: "20",
			subscriberNumber: "1234567"
	};
	var expected = "00 31 20 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatLongAreaCode = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "388",
			subscriberNumber: "123456"
	};
	var expected = "(0388) 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsNL.prototype.testFormatMobile = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			mobilePrefix: "6",
			subscriberNumber: "12345678"
	};
	var expected = "06 1234 5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatMobileInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "31",
			trunkAccess: "0",
			mobilePrefix: "6",
			subscriberNumber: "12345678"
	};
	var expected = "+31 6 1234 5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatWithParamsSMSPartial = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "8765"
	};
	var expected = "876 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatWithParamsSMSWhole = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "8765"
	};
	var expected = "8765";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatPremium = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "906",
			subscriberNumber: "12345678"
	};
	var expected = "0906 1234 5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatBlock = function(){
	var formatted;
	var parsed = {
			serviceCode: "116",
			subscriberNumber: "116"
	};
	var expected = "116 116";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatInternetDialUp = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "85",
			subscriberNumber: "7654321"
	};
	var expected = "085 765 4321";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_nl", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};








PhoneFormatTestsNL.prototype.testFormatStyle0Partial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "3"
	};
	var expected = "03";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30"
	};
	var expected = "(030) ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1"
	};
	var expected = "(030) 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12"
	};
	var expected = "(030) 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123"
	};
	var expected = "(030) 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1234"
	};
	var expected = "(030) 123 4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12345"
	};
	var expected = "(030) 123 45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123456"
	};
	var expected = "(030) 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1234567"
	};
	var expected = "(030) 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12345678"
	};
	var expected = "(030) 1234 5678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0Partial11 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123456789"	// too long
	};
	var expected = "030123456789";	// last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal2 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal3 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal4 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "456 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal5 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "456 34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal6 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "456 345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal7 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "456 3453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal8 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634535"
	};
	var expected = "4563 4535";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle0PartialLocal9 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345352"	// too long
	};
	var expected = "456345352";	// use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsNL.prototype.testFormatStyle1Partial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "3"
	};
	var expected = "03";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30"
	};
	var expected = "030 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1"
	};
	var expected = "030 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12"
	};
	var expected = "030 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123"
	};
	var expected = "030 12 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1234"
	};
	var expected = "030 12 34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12345"
	};
	var expected = "030 12 34 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123456"
	};
	var expected = "030 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1234567"
	};
	var expected = "030 123 45 67";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12345678" // too long
	};
	var expected = "03012345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "spatie", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal2 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal3 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "45 6";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal4 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "45 63";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal5 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "45 63 4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal6 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "45 63 45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal7 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "456 34 53";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle1PartialLocal8 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634534" // too long
	};
	var expected = "45634534";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "spatie"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsNL.prototype.testFormatStyle2Partial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			subscriberNumber: "3"
	};
	var expected = "03";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30"
	};
	var expected = "030 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1"
	};
	var expected = "030 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12"
	};
	var expected = "030 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123"
	};
	var expected = "030 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1234"
	};
	var expected = "030 1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12345"
	};
	var expected = "030 12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123456"
	};
	var expected = "030 123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "1234567"
	};
	var expected = "030 1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "12345678"
	};
	var expected = "030 12345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2Partial11 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "30",
			subscriberNumber: "123456789"	// too long
	};
	var expected = "030123456789";	// last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", style: "gecomprimeerd", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal2 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal3 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal4 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "4563";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal5 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "45634";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal6 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "456345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal7 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "4563453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal8 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634534"
	};
	var expected = "45634534";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsNL.prototype.testFormatStyle2PartialLocal9 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345345"	// too long
	};
	var expected = "456345345"; // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_nl", partial: true, style: "gecomprimeerd"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
