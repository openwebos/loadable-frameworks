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

function PhoneParseTestsFR() {
}

PhoneParseTestsFR.prototype.testParseFRFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0112345678", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1",
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(01) 12 34 56 78", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1",
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0@11$23%45&678", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "1",
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRNoAreaCode = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("12 34 56 78", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRPlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseIDDToIEMobile = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+353 86 8223689", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "353",
		mobilePrefix: "86",
		subscriberNumber: "8223689", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


PhoneParseTestsFR.prototype.testParseFRZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRLongAreaCodeNoTrunk = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("1 23 45 67 89 00", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "12345678900", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRLocalNumber = function(){
	// this number uses an area code to start it, but without the trunk, we should
	// not recognize it as an area code
	var parsed = Globalization.Phone.parsePhoneNumber("12345678", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRDepartments = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0590 123 456", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		serviceCode: "590",
		subscriberNumber: "123456", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRInternationalToDepartments = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+33 590 123 456", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "33",
		serviceCode: "590",
		subscriberNumber: "123456", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0712345678", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		mobilePrefix: "7",
		subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsFR.prototype.testParseFRPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		subscriberNumber: "5", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("051", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5",
		subscriberNumber: "1", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0512", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5",
		subscriberNumber: "12", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05123", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "5",
			subscriberNumber: "123", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("051234", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5",
		subscriberNumber: "1234", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0512345", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5",
		subscriberNumber: "12345", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("05123456", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		trunkAccess: "0",
		areaCode: "5",
		subscriberNumber: "123456", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("051234567", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "5",
			subscriberNumber: "1234567", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsFR.prototype.testParseFRPartial10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0512345678", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0",
			areaCode: "5",
			subscriberNumber: "12345678", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


// for NOV-113777
PhoneParseTestsFR.prototype.testParseLocalNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("41551735", "fr_fr");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "41551735", 
		locale : {
			region: "fr"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
