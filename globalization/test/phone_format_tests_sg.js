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

function PhoneFormatTestsSG() {
}

PhoneFormatTestsSG.prototype.testFormatStyle0 = function() {
	var formatted;
	var parsed = {
		subscriberNumber: "34523434"
	};
	var expected = "3452 3434";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_sg", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsSG.prototype.testFormatInternational = function() {
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "+33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_sg", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsSG.prototype.testFormatInternationalAccessCode = function() {
	var formatted;
	var parsed = {
			iddPrefix: "001",
			countryCode: "33",
			areaCode: "1",
			subscriberNumber: "12345678"
	};
	var expected = "001 33 1 12 34 56 78";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_sg", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsSG.prototype.testFormatMobile = function() {
	var formatted;
	var parsed = {
		subscriberNumber: "81234567"
	};
	var expected = "8123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_sg", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsSG.prototype.testFormatMobileInternational = function() {
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "65",
			subscriberNumber: "81234567"
	};
	var expected = "+65 8123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_sg", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsSG.prototype.testFormatService = function() {
	var formatted;
	var parsed = {
			serviceCode: "800",
			subscriberNumber: "1234567"
	};
	var expected = "800 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_sg", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsSG.prototype.testFormatIEIDD = function() {
	var formatted;
	var parsed = {
			iddPrefix: "+",
			countryCode: "353",
			trunkAccess: "0",
			areaCode: "1",
			subscriberNumber: "1234567"
	};
	var expected = "+353 1 123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, "en_sg", 0);
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};

PhoneFormatTestsSG.prototype.testFormatStyle0Partial0 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "6"
	};
	var expected = "6";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial1 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "61"
	};
	var expected = "61";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial2 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "612"
	};
	var expected = "612";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial3 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "6123"
	};
	var expected = "6123";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial4 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "61234"
	};
	var expected = "6123 4";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial5 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "612345"
	};
	var expected = "6123 45";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial6 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "6123456"
	};
	var expected = "6123 456";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial7 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "61234567"
	};
	var expected = "6123 4567";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
PhoneFormatTestsSG.prototype.testFormatStyle0Partial8 = function() {
	var formatted;
	var parsed = {
			subscriberNumber: "612345678"	// too long
	};
	var expected = "612345678";
	
	formatted = Globalization.Format.formatPhoneNumber(parsed, {locale: "en_sg", partial: true});
	
	UnitTest.requireEqual(expected, formatted);
	
	return UnitTest.passed;
};
