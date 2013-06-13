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

function PhoneParseTestsBE() {
}

PhoneParseTestsBE.prototype.testParseFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("038234567", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "8234567", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03-823-45-67", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "8234567", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0@3!8$2^34(56_7", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "8234567", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseNoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("8234567", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "8234567", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParsePlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseLongAreaCodeNoTrunk = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("71123456", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "71123456", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseLocalNumber = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("82 34 56", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "823456", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParsePlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442082345678", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "82345678", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442082345678", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "82345678", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112", 
			locale : {
				region: "be"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParseEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112115", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112",
			subscriberNumber: "115", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParseMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0492 823456", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "492",
		subscriberNumber: "823456", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParseInternational = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+32 3 823 45 67", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "32",
		areaCode: "3",
		subscriberNumber: "8234567", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParseInternationalMobile = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+32 492 823 456", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "32",
		mobilePrefix: "492",
		subscriberNumber: "823456", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParseService = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0800 82345678", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "800",
		subscriberNumber: "82345678", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParseBlock = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("116116", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "116",
		subscriberNumber: "116", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParsePartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsBE.prototype.testParsePartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "5", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("058", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "58", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0584", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "58",
		subscriberNumber: "4", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05844", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "58",
		subscriberNumber: "44", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("058441", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "58",
		subscriberNumber: "441", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0584412", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "58",
		subscriberNumber: "4412", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05844123", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "58",
		subscriberNumber: "44123", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("058441234", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "58",
			subscriberNumber: "441234", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0584412345", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "58",
			subscriberNumber: "4412345", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsBE.prototype.testParsePartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05844123456", "nl_be");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "58",
			subscriberNumber: "44123456", 
		locale : {
			region: "be"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

