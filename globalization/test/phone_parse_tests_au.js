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

function PhoneParseTestsAU() {
}

PhoneParseTestsAU.prototype.testParseFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(08) 1234 5678", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "8",
		subscriberNumber: "12345678", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("23456789", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "23456789", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseBogusPrefix = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("09 69812345", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "969812345", 
		invalid: true,	// because the prefix doesn't parse, the subscriber number ends up being too long
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(02) 1234-5678", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "12345678", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("$02@1234&5678-", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "12345678", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseNoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("91234567", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "91234567", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseServiceCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0198 123 456", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "198",
		subscriberNumber: "123456", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseWithVSC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1831 02 2345 6789", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "1831",
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "23456789", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseInternationalCarrierSelection = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0016 61 2 5678 1234", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "0016",
		countryCode: "61",
		areaCode: "2",
		subscriberNumber: "56781234", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseCarrierSelectionInternational = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1441 0011 61 2 5678 1234", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		cic: "1441",
		iddPrefix: "0011",
		countryCode: "61",
		areaCode: "2",
		subscriberNumber: "56781234", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseCarrierSelectionDomestic = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1441 2 5678 1234", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		cic: "1441",
		areaCode: "2",
		subscriberNumber: "56781234", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0412 345 678", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "4123",
		subscriberNumber: "45678", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParsePlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("001112028675309", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "0011",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseInternationalDialAround = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1456 0011 1 202 867 5309", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		cic: "1456",
		iddPrefix: "0011",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("000", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "000", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParseEmergencyGSM = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "112", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParsePartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParsePartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 2", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "2", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 23", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "23", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 234", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "234", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 2345", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "2345", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 2345 6", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "23456", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 2345 67", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "234567", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 2345 678", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "2",
			subscriberNumber: "2345678", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 2345 6789", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "2",
			subscriberNumber: "23456789", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsAU.prototype.testParsePartial11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 2345 6789 0", "en_au");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "2",
			subscriberNumber: "234567890", 
			invalid: true,	// subscriber number is too long
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseWithUSMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 1234 5678", "en_au", "316");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "0212345678",
		locale : {
			region: "us"
		},
		invalid: true
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseWithFRMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 1234 5678", "en_au", "208");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseWithMXMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 1234 5678", "en_au", "334");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "02",
		subscriberNumber: "12345678", 
		locale : {
			region: "mx"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseWithDEMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 1234 5678", "en_au", "262");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "212",
		subscriberNumber: "345678", 
		locale : {
			region: "de"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsAU.prototype.testParseWithAUMCC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("02 1234 5678", "en_au", "505");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "2",
		subscriberNumber: "12345678", 
		locale : {
			region: "au"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
