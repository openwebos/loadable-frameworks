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

function PhoneParseTestsSG() {
}

// for bug NOV-118901
PhoneParseTestsSG.prototype.testLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("93897077", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "93897077", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testFromIntl = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+6593897077", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "65",
		subscriberNumber: "93897077", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testLocalNumberWithMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("83897077", "en_us", "525");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "83897077", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6123 4567", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "61234567", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("62-34-56-78", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "62345678", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6!1@2$3-^4&5(6)7", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "61234567", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseServiceCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1800 345 6789", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "1800",
		subscriberNumber: "3456789", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("81234567", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "81234567", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParsePlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00112028675309", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "001",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("999", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "999", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParsePartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParsePartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("61", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "61", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testParsePartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("612", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "612", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testParsePartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6123", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6123", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testParsePartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6123 4", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "61234", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testParsePartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6123 45", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "612345", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testParsePartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6123 456", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6123456", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testParsePartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6123 4567", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "61234567", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsSG.prototype.testParsePartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6123 4567 8", "en_sg");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "612345678", 
		locale : {
			region: "sg"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsSG.prototype.testParseWithUSMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_sg", "316");
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

PhoneParseTestsSG.prototype.testParseWithFRMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_sg", "208");
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

PhoneParseTestsSG.prototype.testParseWithMXMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_sg", "334");
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

PhoneParseTestsSG.prototype.testParseWithDEMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_sg", "262");
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

PhoneParseTestsSG.prototype.testParseWithGBMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_sg", "235");
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
