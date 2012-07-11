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

function PhoneParseTestsLU() {
}

PhoneParseTestsLU.prototype.testParseFull = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("26 26 45 45", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "26264545", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParseIgnoreFormatting = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("26.26.45.45", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "26264545", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParseIgnoreCrap = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("@23!60$12^34(", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "23601234", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParsePlusIDDToUS = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParseZerosIDDToUS = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParsePlusIDDToGB = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParseZerosIDDToGB = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParseEmergencyNumber = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("112", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "112", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParseEmergencyNumberPlus = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("112115", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112",
			subscriberNumber: "115", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParseMobileNumber = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("621123456", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "621",
		subscriberNumber: "123456", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParseDialAround = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("15232 360 12 34", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		cic: "15232",
		subscriberNumber: "3601234", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParseService = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("80069123456", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "80069",
		subscriberNumber: "123456", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParsePremium = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("908-8765-4321", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "908",
		subscriberNumber: "87654321", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParsePartial1 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("2", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsLU.prototype.testParsePartial2 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("26", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "26", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial3 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("266", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "266", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial4 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("2662", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2662", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial5 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("26621", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "26621", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial6 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("266212", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "266212", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial7 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("2662123", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2662123", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial8 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("26621234", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "26621234", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial9 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("266212345", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "266212345", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsLU.prototype.testParsePartial10 = function() {
	var parsed = Globalization.Phone.parsePhoneNumber("2662123456", "de_lu");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "2662123456", 
		locale : {
			region: "lu"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

