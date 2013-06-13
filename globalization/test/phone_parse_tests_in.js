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

/*globals Globalization, Assert, console IMPORTS objectEquals UnitTest */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function PhoneParseTestsIN() {
}

PhoneParseTestsIN.prototype.testParseINFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01112345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINFull2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("07753123456", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "7753",
		subscriberNumber: "123456", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("011-12345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01%1@-12$&34!56^7(8", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("37654321", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "37654321", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseInvalidLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("8765432100", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "8765432100",
		locale : {
			region: "in"
		},
		invalid: true
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("9912345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "991",
		subscriberNumber: "2345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "112", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112118", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "112",
		subscriberNumber: "118", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINPlusIDDToGBLongArea = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+441997123456", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "1997",
		subscriberNumber: "123456", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		subscriberNumber: "4", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		subscriberNumber: "2", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420123", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "123", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201234", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1234", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12345", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420123456", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "123456", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201234567", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1234567", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


PhoneParseTestsIN.prototype.testParseINPlusIDDToUnknown = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+5062012345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "506",
		subscriberNumber: "2012345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINZerosIDDToUnknown = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("005062012345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "506",
		subscriberNumber: "2012345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "1", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("011", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0111", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "1", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01112", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("011123", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "123", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0111234", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "1234", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01112345", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12345", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("011123456", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "123456", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0111234567", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "1234567", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01112345678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "11",
		subscriberNumber: "12345678", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINPartialLocal1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "4", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseINPartialLocal2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("47", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "47", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartialLocal3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("476", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "476", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartialLocal4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4765", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "4765", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartialLocal5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("47654", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "47654", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartialLocal6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("476543", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "476543", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartialLocal7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4765432", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "4765432", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIN.prototype.testParseINPartialLocal8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("47654321", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "47654321", 
		locale : {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

//for CFISH-8481
PhoneParseTestsIN.prototype.testParseINMobileNumberFromIntl = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+91 99123 45678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "91",
		mobilePrefix: "991",
		subscriberNumber: "2345678",
		locale: {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIN.prototype.testParseCic = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01054 80123 45678", "en_in");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		cic: "1054",
		areaCode: "80",
		subscriberNumber: "12345678",
		locale: {
			region: "in"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
