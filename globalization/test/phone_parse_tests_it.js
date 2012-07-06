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

function PhoneParseTestsIT() {
}

PhoneParseTestsIT.prototype.testParseITFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("06 1234 5678", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "12345678", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(06) 1234 5678", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "12345678", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0@61$23%45&678", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "6",
		subscriberNumber: "12345678", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITPlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseIDDToSanMarino = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+378 0549 123 456", "it_it");
	UnitTest.requireDefined(parsed);
	
	// San Marino should use the Italian parsing algorithm, so we can get the parts instead
	// of everything being in the subscriber number
	var expected = {
		iddPrefix: "+",
		countryCode: "378",
		trunkAccess: "0",
		areaCode: "549",
		subscriberNumber: "123456", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112", 
			locale : {
				region: "it"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112115", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112",
			subscriberNumber: "115", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("3991234567", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "399",
		subscriberNumber: "1234567", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITServiceNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("7991234567", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "799",
		subscriberNumber: "1234567", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITNetServiceNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("4345654343", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "4",
		subscriberNumber: "345654343", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITSpecialRateNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("8991234567", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "899",
		subscriberNumber: "1234567", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIT.prototype.testParseITPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "5", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("057", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "57", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0577", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "577", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0577 1", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "577",
			subscriberNumber: "1", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0577 12", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "577",
		subscriberNumber: "12", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0577 123", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "577",
		subscriberNumber: "123", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0577 1234", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "577",
		subscriberNumber: "1234", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0577 12345", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "577",
			subscriberNumber: "12345", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseITPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0577 123456", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "577",
			subscriberNumber: "123456", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

// for bug NOV-115337
PhoneParseTestsIT.prototype.testParseIntlToMobile = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3939012345678", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "39",
			mobilePrefix: "390",
			subscriberNumber: "12345678", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIT.prototype.testParseIntlToAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+3903912345678", "it_it");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "39",
			trunkAccess: "0",
			areaCode: "39",
			subscriberNumber: "12345678", 
		locale : {
			region: "it"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
