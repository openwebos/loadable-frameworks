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

/*globals UnitTest */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function PhoneParseTestsHK() {
}

PhoneParseTestsHK.prototype.testLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("23897077", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "23897077",
		locale : {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testFromIntl = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+85223897077", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "852",
		subscriberNumber: "23897077",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testMobile = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("93897077", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "9",
		subscriberNumber: "3897077",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testFromIntlToMobile = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+85293897077", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "852",
		mobilePrefix: "9",
		subscriberNumber: "3897077",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testLocalNumberWithMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("23897077", "en_us", "454");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "23897077",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2123 4567", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "21234567",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("22-34-56-78", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "22345678",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2!1@2$3-^4&5(6)7", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "21234567",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseServiceCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("18501", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "1",
		subscriberNumber: "8501",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("51234567", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "5",
		subscriberNumber: "1234567",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParsePlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00112028675309", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "001",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("999", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "999",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseEmergencyNumberGSM = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "112",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParsePartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParsePartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("21", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "21",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testParsePartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("212", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "212",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testParsePartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2123", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2123",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testParsePartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2123 4", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "21234",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testParsePartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2123 45", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "212345",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testParsePartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2123 456", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2123456",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testParsePartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2123 4567", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "21234567",
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsHK.prototype.testParsePartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("2123 4567 8", "en_hk");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "212345678",
		invalid: true,
		locale: {
			region: "hk"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseWithUSMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_hk", "316");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "615",
		subscriberNumber: "3222313",
		locale: {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseWithFRMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_hk", "208");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6153222313",
		locale: {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseWithMXMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_hk", "334");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "615",
		subscriberNumber: "3222313",
		locale: {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseWithDEMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_hk", "262");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6153222313",
		locale: {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsHK.prototype.testParseWithGBMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_hk", "235");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6153222313",
		locale: {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
