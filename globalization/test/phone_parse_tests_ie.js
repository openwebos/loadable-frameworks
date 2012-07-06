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

function PhoneParseTestsIE() {
}

PhoneParseTestsIE.prototype.testParseIEFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0112345678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1",
		subscriberNumber: "12345678", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEFullLongAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("040412345", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "404",
		subscriberNumber: "12345", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(0404) 12-345", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "404",
		subscriberNumber: "12345", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0@11$23%45&678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1",
		subscriberNumber: "12345678", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIENoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("82345678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "82345678", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseLocalInvalidNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("12345678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "12345678",
		locale : {
			region: "ie"
		},
		invalid: true
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testVSC = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("14282345678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		vsc: "142",
		subscriberNumber: "82345678", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEPlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIELongAreaCodeNoTrunk = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("404123456", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "404123456", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIELocalNumber = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("82345678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "82345678", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEPlusIDDToIE = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+353 86 822 3689", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		mobilePrefix: "86",
		subscriberNumber: "8223689", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEService = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("15308765432", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "1530",
		subscriberNumber: "8765432", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0871234567", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "87",
		subscriberNumber: "1234567", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsIE.prototype.testParseIEPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("04", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "4", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIE.prototype.testParseIEPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("040", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "40", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIE.prototype.testParseIEPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0404", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "404", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIE.prototype.testParseIEPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("04041", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "1", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIE.prototype.testParseIEPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("040412", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "404",
		subscriberNumber: "12", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIE.prototype.testParseIEPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0404123", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "404",
		subscriberNumber: "123", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIE.prototype.testParseIEPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("04041234", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "404",
		subscriberNumber: "1234", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsIE.prototype.testParseIEPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("040412345", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "404",
			subscriberNumber: "12345", 
		locale : {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

//for CFISH-5426
PhoneParseTestsIE.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("999", "en_ie");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		emergency: "999",
		locale: {
			region: "ie"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
