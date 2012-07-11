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

function PhoneParseTestsNZ() {
}

PhoneParseTestsNZ.prototype.testParseFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03 456-7890", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "4567890", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("3456789", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "3456789", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseBogusPrefix = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05 9812345", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "59812345",
		locale : {
			region: "nz"
		},
		invalid: true
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(03) 123-5678", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "1235678", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("$03@1234&567-", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "1234567", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseNoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("91234567", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "91234567", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseServiceCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("080098765", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "800",
		subscriberNumber: "98765", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseWithVSC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("*222", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "*222", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02112345678", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "21",
		subscriberNumber: "12345678", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParsePlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("111", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "111", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParsePartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParsePartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("039", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "9", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0399", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "99", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03999", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "3",
			subscriberNumber: "999", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("039991", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "9991", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0399912", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "99912", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("03999123", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "3",
		subscriberNumber: "999123", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("039991234", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "3",
			subscriberNumber: "9991234", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsNZ.prototype.testParsePartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0399912345", "en_nz");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "3",
			subscriberNumber: "99912345", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsNZ.prototype.testParseWithUSMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_nz", "316");
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

PhoneParseTestsNZ.prototype.testParseWithFRMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_nz", "208");
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

PhoneParseTestsNZ.prototype.testParseWithMXMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_nz", "334");
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

PhoneParseTestsNZ.prototype.testParseWithDEMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_nz", "262");
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

PhoneParseTestsNZ.prototype.testParseWithNZMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("6153222313", "en_nz", "530");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "6153222313", 
		locale : {
			region: "nz"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
