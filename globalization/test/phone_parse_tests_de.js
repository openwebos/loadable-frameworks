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

function PhoneParseTestsDE() {
}

PhoneParseTestsDE.prototype.testParseDEFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02360123456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2360",
		subscriberNumber: "123456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02360/ 123456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2360",
		subscriberNumber: "123456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0@23!60$12^34(56", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2360",
		subscriberNumber: "123456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDENoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("8234 5678", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "82345678", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEPlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseIDDToIEMobile = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+353 86 8223689", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		mobilePrefix: "86",
		subscriberNumber: "8223689", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDELongAreaCodeNoTrunk = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("2360/ 123456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2360123456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDELocalNumber = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("723 456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "723456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEInvalidLocalNumber = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("123 456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "123456",
		locale : {
			region: "de"
		},
		invalid: true
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseLocalWithPauseChars = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4156568w1234", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "4156568",
		locale : {
			region: "de"
		},
		extension: "w1234"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseLDWithPauseChars = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02360/ 123456w1234", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2360",
		subscriberNumber: "123456",
		locale : {
			region: "de"
		},
		extension: "w1234"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("19222115", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "19222",
			subscriberNumber: "115", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("016512345678", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "165",
		subscriberNumber: "12345678", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEDialAround = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01032 2360/ 123456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		cic: "1032",
		areaCode: "2360",
		subscriberNumber: "123456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEDialAroundLong = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("010032 2360/ 123456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		cic: "10032",
		areaCode: "2360",
		subscriberNumber: "123456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEService = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01169 123/45678", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "11",
		subscriberNumber: "6912345678", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEBlock = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("116116", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "116116", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEInternetDialup = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01925 87654321", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "192",
		subscriberNumber: "587654321", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsDE.prototype.testParseDEPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "5", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("058", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "58", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0584", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "584", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05844", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "5844", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("058441", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5844",
		subscriberNumber: "1", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0584412", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5844",
		subscriberNumber: "12", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05844123", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5844",
		subscriberNumber: "123", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("058441234", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "5844",
			subscriberNumber: "1234", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0584412345", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "5844",
			subscriberNumber: "12345", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsDE.prototype.testParseDEPartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05844123456", "de_de");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "5844",
			subscriberNumber: "123456", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

