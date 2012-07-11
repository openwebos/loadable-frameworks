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

function PhoneParseTestsUS() {
}

PhoneParseTestsUS.prototype.testParseUSFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(456) 345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSFullNoLocale = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(456) 345-3434");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSFull2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4154154155", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "415",
		subscriberNumber: "4154155", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("456-345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("@456@345@$%^3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSWithTrunk = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1 (456) 345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSWithTrunkAltFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1-456-345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSWithDialAround = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("10-10-321-456-345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		cic: "1010321",
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSWithVSC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*67 (456) 345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*674563453434",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSWithVSCandTrunk = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*67 1 (456) 345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*6714563453434",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseWithAlternateVSC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112 (456) 345-3434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "1124563453434",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseWithAlternateVSCBogusCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("111111111", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "111111111",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("911", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "911", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseEmergencyNumberExtended = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("911 123", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "911",
		subscriberNumber: "123", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseLocalWithPauseChars = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6175568w1234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6175568",
		locale : {
			region: "us"
		},
		extension: "w1234"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseLDWithPauseChars = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4156175568w1234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "415",
		subscriberNumber: "6175568",
		locale : {
			region: "us"
		},
		extension: "w1234"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseLDWithPauseCharsAndTrunk = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1-415-617-5568 w 1234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "415",
		subscriberNumber: "6175568",
		locale : {
			region: "us"
		},
		extension: "w1234"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseLocalWithExtension = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("617-5568x1234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6175568",
		locale : {
			region: "us"
		},
		extension: "1234"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseLDWithExtension = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("415-617-5568 x1234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "415",
		subscriberNumber: "6175568",
		locale : {
			region: "us"
		},
		extension: "1234"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("011442012345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "011",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBLongArea = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+441997123456", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "1997",
		subscriberNumber: "123456", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		subscriberNumber: "4", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		subscriberNumber: "2", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420123", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "123", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1234", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12345", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420123456", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "123456", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201234567", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1234567", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


PhoneParseTestsUS.prototype.testParseUSPlusIDDToUnknown = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+5062012345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "506",	// Costa Rica
		subscriberNumber: "2012345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSZerosIDDToUnknown = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0115062012345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "011",
		countryCode: "506", // Costa Rica
		subscriberNumber: "2012345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "4", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("45", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "45", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("456", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "456", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4563", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "4563", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("45634", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "45634", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("456345", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "456345", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4563453", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "4563453", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("45634534", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "34534", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("456345343", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "345343", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4563453434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("45634534345", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "456",
		subscriberNumber: "34534345",
		invalid: true,	// subscriber number is too long
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPartialTrunk0 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPartialTrunk1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("14", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		subscriberNumber: "4", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPartialTrunk2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("145", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		subscriberNumber: "45", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1456", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("14563", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "3", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("145634", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "34", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1456345", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "345", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("14563453", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "3453", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("145634534", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "34534", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1456345343", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "345343", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("14563453434", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "3453434", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialTrunk11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("145634534345", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "1",
		areaCode: "456",
		subscriberNumber: "34534345",
		invalid: true,	// subscriber number is too long
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		subscriberNumber: "3", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+35", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		subscriberNumber: "35", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+353", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3531", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+35311", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "1", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+353112", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "12", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3531123", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "123", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+35311234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "1234", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+353112345", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "12345", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3531123456", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "123456", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD12 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+35311234567", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "1234567", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDD13 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+353112345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		areaCode: "1",
		subscriberNumber: "12345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry0 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		subscriberNumber: "3", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+39", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "39", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+390", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "39",
		trunkAccess: "0", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3904", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "39",
		trunkAccess: "0",
		subscriberNumber: "4", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+39040", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "40", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+390401", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "40",
		subscriberNumber: "1", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testParseUSPartialIDDtoPreserveZeroCountry7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3904012345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "39",
		trunkAccess: "0",
		areaCode: "40",
		subscriberNumber: "12345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseWithUSMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_us", "316");
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

PhoneParseTestsUS.prototype.testParseWithFRMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_us", "208");
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

PhoneParseTestsUS.prototype.testParseWithMXMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_us", "334");
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

PhoneParseTestsUS.prototype.testParseWithDEMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_us", "262");
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


PhoneParseTestsUS.prototype.testParseWithUSMCCNoLocale = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", undefined, "316");
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

PhoneParseTestsUS.prototype.testParseWithFRMCCNoLocale = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", undefined, "208");
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

PhoneParseTestsUS.prototype.testParseWithMXMCCNoLocale = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", undefined, "334");
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

PhoneParseTestsUS.prototype.testParseWithDEMCCNoLocale = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", undefined, "262");
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


// for NOV-108200
PhoneParseTestsUS.prototype.testParseBogusSpecialChars = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+P13817803573", undefined, "310");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "P1",
		areaCode: "381",
		subscriberNumber: "7803573", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParse555Number = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(408) 555-1234", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "408",
		subscriberNumber: "5551234", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseHtmlGarbage = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("<button>t1</button>", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		extension: "ttt1tt", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseIntermediateSizedNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("56765432", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "567",
		subscriberNumber: "65432", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testParseEmergencyLikeServiceNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("411", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "411", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testBogusInternationalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+33112345678", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "33",
		areaCode: "1",
		subscriberNumber: "12345678", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


PhoneParseTestsUS.prototype.testFictitousNumberLocale = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("5555555", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "5555555", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testFictitousNumberLD = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("5555555555", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "555",
		subscriberNumber: "5555555", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

// for NOV-113367
PhoneParseTestsUS.prototype.testCrazyIntlCall = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+1123", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		trunkAccess: "1",
		subscriberNumber: "23", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

//for NOV-109333
PhoneParseTestsUS.prototype.testWierdVSC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*#43#", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*#43#",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsUS.prototype.testSSCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*646#", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*646#",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

// for CFISH-5088
PhoneParseTestsUS.prototype.testVSCUMTS1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("#*06", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "#*06", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testVSCUMTS2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*#06#", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*#06#",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testVSCUMTS3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*#062#", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*#062#",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testVSCUMTS4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("#62#", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "#62#",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testVSCUMTS5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*##62#", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*##62#",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsUS.prototype.testVSCUMTS6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("##62#", "en_us");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "##62#",
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

// for CFISH-6022
PhoneParseTestsUS.prototype.testVSCVerizon = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*228");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*228", 
		locale : {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

//for CFISH-6444
PhoneParseTestsUS.prototype.testParseWithForeignIDD = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0044209876543"); // US but with a foreign IDD
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44", // uk
		areaCode: "20", // london
		subscriberNumber: "9876543",
		locale: {
			region: "us"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
