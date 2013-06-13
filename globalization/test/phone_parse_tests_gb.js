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

function PhoneParseTestsGB() {
}

PhoneParseTestsGB.prototype.testParseGBFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("020 1234 5678", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("3456789", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "3456789", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBBogusPrefix = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("06 69812345", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "669812345", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


PhoneParseTestsGB.prototype.testParseGBFullLongAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01946712345", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "19467",
		subscriberNumber: "12345", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBFullSpecialAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01946123456", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1946",
		subscriberNumber: "123456", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(020) 1234-5678", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBFullLongAreaCodeIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(01999)123456", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1999",
		subscriberNumber: "123456", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("$020@1234&5678-", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBNoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("82345678", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "82345678", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseInvalidLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("12345678", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "12345678",
		locale : {
			region: "gb"
		},
		invalid: true
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBServiceCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("034012345678", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "340",
		subscriberNumber: "12345678", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBWithVSC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("14102012345678", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "141",
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBPersonalNumbering = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("07012345678", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "70",
		subscriberNumber: "12345678", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("07534123456", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "7534",
		subscriberNumber: "123456", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBPlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBLongAreaCodeNoTrunk = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("1999123456", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "1999123456",
		locale : {
			region: "gb"
		},
		invalid: true
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("116", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "116", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("116116", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "116",
		subscriberNumber: "116", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseGBPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "1", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("019", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "19", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0199", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "199", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01999", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "1999", 
			locale : {
				region: "gb"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("019991", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1999",
		subscriberNumber: "1", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0199912", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1999",
		subscriberNumber: "12", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01999123", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1999",
		subscriberNumber: "123", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("019991234", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "1999",
			subscriberNumber: "1234", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0199912345", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "1999",
			subscriberNumber: "12345", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsGB.prototype.testParseGBPartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01999123456", "en_gb");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "1999",
			subscriberNumber: "123456", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseWithUSMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_gb", "316");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "615",
		subscriberNumber: "3222313", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseWithFRMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_gb", "208");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6153222313", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseWithMXMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_gb", "334");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "615",
		subscriberNumber: "3222313", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseWithDEMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_gb", "262");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6153222313", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsGB.prototype.testParseWithGBMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_gb", "235");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6153222313", 
		locale : {
			region: "gb"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
