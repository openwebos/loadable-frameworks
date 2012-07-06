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

/*globals Globalization, Assert, console IMPORTS objectEquals UnitTest */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function PhoneParseTestsNL() {
}

PhoneParseTestsNL.prototype.testParseFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0201234567", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "1234567", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("020/123-4567", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "1234567", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0@2!0$12^34(56_7", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "1234567", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseNoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("7654321", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "7654321", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParsePlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseLongAreaCodeNoTrunk = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("519123456", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "519123456", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseLocalNumber = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("654 321", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "654321", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParsePlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112", 
			locale : {
				region: "nl"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParseEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112115", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112",
			subscriberNumber: "115", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0612345678", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "6",
		subscriberNumber: "12345678", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParseMobileInternationalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+31 6 12345678", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "31",
		mobilePrefix: "6",
		subscriberNumber: "12345678", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParseService = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1800 12345678", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "1800",
		subscriberNumber: "12345678", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParseBlock = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("116116", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "116",
		subscriberNumber: "116", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParseInternetDialup = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("082 87654321", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "82",
		subscriberNumber: "87654321", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParsePartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNL.prototype.testParsePartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "3", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("034", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "34", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0344", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "344", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03444", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "344",
			subscriberNumber: "4", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("034441", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "344",
		subscriberNumber: "41", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0344412", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "344",
		subscriberNumber: "412", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03444123", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "344",
		subscriberNumber: "4123", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("034441234", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "344",
			subscriberNumber: "41234", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0344412345", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "344",
			subscriberNumber: "412345", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNL.prototype.testParsePartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03444123456", "nl_nl");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "344",
			subscriberNumber: "4123456", 
		locale : {
			region: "nl"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

