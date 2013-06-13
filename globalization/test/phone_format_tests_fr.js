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

function PhoneFormatTestsFR() {
}

PhoneFormatTestsFR.prototype.testFormatFRStyle0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "01 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatFRStyle1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "(0)1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatFRInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "+33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatIEMobile = function(){
	var formatted;
	var parsed = {
		iddPrefix: "+",
		countryCode: "353",
		mobilePrefix: "86",
		subscriberNumber: "8223689"
	};
	var expected = "+353 86 822 3689";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatFRInternationalAccessCode = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "00 33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatFRMobile = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			mobilePrefix: "6",
			subscriberNumber: "12345678"
	};
	var expected = "06 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatFRFreephone = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "800",
			subscriberNumber: "345678"
	};
	var expected = "0800 345 678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatFRToll = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "810",
			subscriberNumber: "345678"
	};
	var expected = "0810 345 678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatFRDepartment = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "590",
			subscriberNumber: "123456"
	};
	var expected = "0590 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatFRInternationalDepartment = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "33",
			serviceCode: "590",
			subscriberNumber: "123456"
	};
	var expected = "+33 590 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "fr_fr", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};







PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "01 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "(0)1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsInternational = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "+33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatIEMobile = function(){
	var formatted;
	var parsed = {
		iddPrefix: "+",
		countryCode: "353",
		mobilePrefix: "86",
		subscriberNumber: "8223689"
	};
	var expected = "+353 86 822 3689";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsInternationalAccessCode = function(){
	var formatted;
	var parsed = {
			iddPrefix: "00",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "00 33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsMobile = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			mobilePrefix: "6",
			subscriberNumber: "12345678"
	};
	var expected = "06 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsDepartment = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			serviceCode: "590",
			subscriberNumber: "123456"
	};
	var expected = "0590 123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsInternationalDepartment = function(){
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "33",
			serviceCode: "590",
			subscriberNumber: "123456"
	};
	var expected = "+33 590 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsSMSPartial = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "12345"
	};
	var expected = "12 34 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsSMSWhole = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "12345"
	};
	var expected = "12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4"
	};
	var expected = "04 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "1"
	};
	var expected = "04 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "12"
	};
	var expected = "04 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "123"
	};
	var expected = "04 12 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "1234"
	};
	var expected = "04 12 34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "12345"
	};
	var expected = "04 12 34 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "123456"
	};
	var expected = "04 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "1234567"
	};
	var expected = "04 12 34 56 7";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "12345678"
	};
	var expected = "04 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "123456789"	// too long
	};
	var expected = "04123456789"; // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial0 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0"
	};
	var expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial1 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4"
	};
	var expected = "(0)4 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial2 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "1"
	};
	var expected = "(0)4 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial3 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "12"
	};
	var expected = "(0)4 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial4 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "123"
	};
	var expected = "(0)4 12 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial5 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "1234"
	};
	var expected = "(0)4 12 34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial6 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "12345"
	};
	var expected = "(0)4 12 34 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial7 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "123456"
	};
	var expected = "(0)4 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial8 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "1234567"
	};
	var expected = "(0)4 12 34 56 7";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial9 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "12345678"
	};
	var expected = "(0)4 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle1Partial10 = function(){
	var formatted;
	var parsed = {
			trunkAccess: "0",
			areaCode: "4",
			subscriberNumber: "123456789"	// too long
	};
	var expected = "04123456789"; // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true, style: "parenthèses"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal1 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4"
	};
	var expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal2 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45"
	};
	var expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal3 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456"
	};
	var expected = "45 6";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal4 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563"
	};
	var expected = "45 63";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal5 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634"
	};
	var expected = "45 63 4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal6 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345"
	};
	var expected = "45 63 45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal7 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "4563453"
	};
	var expected = "45 63 45 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal8 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "45634535"
	};
	var expected = "45 63 45 35";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatWithParamsStyle0PartialLocal9 = function(){
	var formatted;
	var parsed = {
			subscriberNumber: "456345353" // too long
	};
	var expected = "456345353"; 		  // use last resort rule
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "fr_fr", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


// for NOV-113777
PhoneFormatTestsFR.prototype.testFormatLocalNumberPartial = function(){
	var formatted;
	var parsed = {
		subscriberNumber: "41551735"
	};
	var expected = "41 55 17 35";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {partial: true, mcc: "208"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsFR.prototype.testFormatLocalNumberWhole = function(){
	var formatted;
	var parsed = {
		subscriberNumber: "41551735"
	};
	var expected = "41 55 17 35";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {mcc: "208"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
