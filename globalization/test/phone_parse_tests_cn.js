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

function PhoneParseTestsCN() {
}

PhoneParseTestsCN.prototype.testParseCNFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01012345678", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "12345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNFull2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("08081123456", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "8081",
		subscriberNumber: "123456", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("010-12345678", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "12345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01%0@-12$&34!56^7(8", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "12345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("87654321", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "87654321", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBLongArea = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+441997123456", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "1997",
		subscriberNumber: "123456", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("15005179573", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "150",
		subscriberNumber: "05179573", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseIDDToMobile = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+8615005179573", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "86",
		mobilePrefix: "150",
		subscriberNumber: "05179573", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		subscriberNumber: "4", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		subscriberNumber: "2", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420123", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "123", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201234", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1234", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "12345", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+4420123456", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "123456", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPlusIDDToGBPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+44201234567", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "44",
			areaCode: "20",
			subscriberNumber: "1234567", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("110", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "110", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("120115", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "120",
			subscriberNumber: "115", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNPlusIDDToUnknown = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+5062012345678", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "506",
		subscriberNumber: "2012345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNZerosIDDToUnknown = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("005062012345678", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "506",
		subscriberNumber: "2012345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "1", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("010", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0101", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "1", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01012", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "12", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("010123", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "123", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0101234", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "1234", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01012345", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "12345", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("010123456", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "123456", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0101234567", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "1234567", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01012345678", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "10",
		subscriberNumber: "12345678", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNPartialLocal1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("8", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "8", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsCN.prototype.testParseCNPartialLocal2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("87", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "87", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartialLocal3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("876", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "876", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartialLocal4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("8765", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "8765", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartialLocal5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("87654", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "87654", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartialLocal6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("876543", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "876543", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartialLocal7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("8765432", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "8765432", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseCNPartialLocal8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("87654321", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "87654321", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


// for DFISH-26683
PhoneParseTestsCN.prototype.testParseNewMobilePrefix1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("14782808075", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "147",
		subscriberNumber: "82808075", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsCN.prototype.testParseNewMobilePrefix2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("18721083400", "zh_cn");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "187",
		subscriberNumber: "21083400", 
		locale : {
			region: "cn"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
