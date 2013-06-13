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

/*globals Globalization, Assert, console, UnitTest */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function PhoneFormatTestsLU() {
}

PhoneFormatTestsLU.prototype.testFormatStyle0 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "59",
			subscriberNumber: "123456"
		},
		expected = "059 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatStyle1 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "59",
			subscriberNumber: "123456"
		},
		expected = "059 123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 1);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "59",
			subscriberNumber: "123456"
		},
		expected = "059-12-34-56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 2);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatInternational = function () {
	var formatted,
		parsed = {
			iddPrefix: "+",
			countryCode: "32",
			areaCode: "2",
			subscriberNumber: "1234567"
		},
		expected = "+32 2 123 45 67";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatInternationalAccessCode = function () {
	var formatted,
		parsed = {
			iddPrefix: "00",
			countryCode: "32",
			areaCode: "2",
			subscriberNumber: "1234567"
		},
		expected = "00 32 2 123 45 67";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatLongAreaCode = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "601",
			subscriberNumber: "123456"
		},
		expected = "0601 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsLU.prototype.testFormatMobile = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			mobilePrefix: "491",
			subscriberNumber: "234567"
		},
		expected = "0491 23 45 67";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatMobileInternational = function () {
	var formatted,
		parsed = {
			iddPrefix: "+",
			countryCode: "32",
			trunkAccess: "0",
			mobilePrefix: "491",
			subscriberNumber: "234567"
		},
		expected = "+32 491 23 45 67";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};


PhoneFormatTestsLU.prototype.testFormatWithParamsSMSPartial = function () {
	var formatted,
		parsed = {
			subscriberNumber: "8765"
		},
		expected = "87 65";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatWithParamsSMSWhole = function () {
	var formatted,
		parsed = {
			subscriberNumber: "8765"
		},
		expected = "8765";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatPremium = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			serviceCode: "906",
			subscriberNumber: "12345"
		},
		expected = "0906 12 34 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatBlock = function () {
	var formatted,
		parsed = {
			serviceCode: "116",
			subscriberNumber: "116"
		},
		expected = "116 116";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "nl_be", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};



PhoneFormatTestsLU.prototype.testFormatStyle0Partial0 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0"
		},
		expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial1 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			subscriberNumber: "6"
		},
		expected = "06";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial2 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60"
		},
		expected = "060 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial3 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1"
		},
		expected = "060 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial4 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12"
		},
		expected = "060 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial5 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "123"
		},
		expected = "060 12 3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial6 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1234"
		},
		expected = "060 12 34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial7 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12345"
		},
		expected = "060 12 34 5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial8 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "123456"
		},
		expected = "060 12 34 56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial9 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1234567"
		},
		expected = "060 123 45 67";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0Partial10 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12345678" // too long
		},
		expected = "06012345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal1 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4"
		},
		expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal2 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45"
		},
		expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal3 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "456"
		},
		expected = "45 6";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal4 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4563"
		},
		expected = "45 63";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal5 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45634"
		},
		expected = "45 63 4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal6 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "456345"
		},
		expected = "45 63 45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal7 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4563453"
		},
		expected = "456 34 53";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle0PartialLocal8 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45634535"
		},
		expected = "45634535"; // too long
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatStyle1Partial0 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0"
		},
		expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial1 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			subscriberNumber: "6"
		},
		expected = "06";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial2 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60"
		},
		expected = "060 ";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial3 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1"
		},
		expected = "060 1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial4 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12"
		},
		expected = "060 12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial5 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "123"
		},
		expected = "060 123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial6 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1234"
		},
		expected = "060 1234";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial7 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12345"
		},
		expected = "060 12345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial8 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "123456"
		},
		expected = "060 123456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial9 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1234567"
		},
		expected = "060 1234567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1Partial10 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12345678" // too long
		},
		expected = "06012345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "gecomprimeerd/comprimé", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal1 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4"
		},
		expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal2 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45"
		},
		expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal3 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "456"
		},
		expected = "456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal4 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4563"
		},
		expected = "4563";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal5 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45634"
		},
		expected = "45634";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal6 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "456345"
		},
		expected = "456345";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal7 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4563453"
		},
		expected = "4563453";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle1PartialLocal8 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45634534" // too long
		},
		expected = "45634534";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "gecomprimeerd/comprimé"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatStyle2Partial0 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0"
		},
		expected = "0";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial1 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			subscriberNumber: "6"
		},
		expected = "06";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial2 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60"
		},
		expected = "060-";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial3 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1"
		},
		expected = "060-1";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial4 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12"
		},
		expected = "060-12";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial5 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "123"
		},
		expected = "060-12-3";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial6 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1234"
		},
		expected = "060-12-34";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial7 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12345"
		},
		expected = "060-12-34-5";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial8 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "123456"
		},
		expected = "060-12-34-56";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial9 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "1234567"
		},
		expected = "060-123-45-67";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2Partial10 = function () {
	var formatted,
		parsed = {
			trunkAccess: "0",
			areaCode: "60",
			subscriberNumber: "12345678" // too long
		},
		expected = "06012345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", style: "streepjes/tirets", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal1 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4"
		},
		expected = "4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal2 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45"
		},
		expected = "45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal3 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "456"
		},
		expected = "45-6";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal4 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4563"
		},
		expected = "45-63";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal5 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45634"
		},
		expected = "45-63-4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal6 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "456345"
		},
		expected = "45-63-45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal7 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "4563453"
		},
		expected = "456-34-53";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsLU.prototype.testFormatStyle2PartialLocal8 = function () {
	var formatted,
		parsed = {
			subscriberNumber: "45634534" // too long
		},
		expected = "45634534";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "nl_be", partial: true, style: "streepjes/tirets"});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
