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

function PhoneParseTestsMX() {
}

PhoneParseTestsMX.prototype.testParseMXFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6241234567", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "624",
		subscriberNumber: "1234567", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXLocal = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("62412345", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "62412345", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("624-123-4567", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "624",
		subscriberNumber: "1234567", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("62@4$1%2^3&45!67", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "624",
		subscriberNumber: "1234567", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXPlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("019981234567", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "01",
		areaCode: "998",
		subscriberNumber: "1234567", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXServiceNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0262412345", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "02",
		subscriberNumber: "62412345", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXServiceNumber2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("80062412345", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "800",
		subscriberNumber: "62412345", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXShortAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("5512345678", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "55",
		subscriberNumber: "12345678", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("5", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "5", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("55", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			subscriberNumber: "55", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("551", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "551", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("5512", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "5512", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("55123", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "55123", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("551234", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "551234", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("5512345", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "5512345", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("55123456", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "55123456", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("551234567", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			areaCode: "55",
			subscriberNumber: "1234567", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("5512345678", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			areaCode: "55",
			subscriberNumber: "12345678", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseMXPartialTrunk0 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			subscriberNumber: "0", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01", 
			locale : {
				region: "mx"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("015", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			subscriberNumber: "5", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0155", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55", 
			locale : {
				region: "mx"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01551", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "1", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("015512", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "12", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0155123", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "123", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01551234", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "1234", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("015512345", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "12345", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0155123456", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "123456", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01551234567", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "1234567", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsMX.prototype.testParseMXPartialTrunk11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("015512345678", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "01",
			areaCode: "55",
			subscriberNumber: "12345678", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsMX.prototype.testParseWithUSMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "es_mx", "316");
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

PhoneParseTestsMX.prototype.testParseWithFRMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "es_mx", "208");
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

PhoneParseTestsMX.prototype.testParseWithMXMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "es_mx", "334");
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

PhoneParseTestsMX.prototype.testParseWithDEMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "es_mx", "262");
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

// for bug NOV-119557
PhoneParseTestsMX.prototype.testParseTollFree = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("01 800 022 0606", "es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "01",
		serviceCode: "800",
		subscriberNumber: "0220606", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
