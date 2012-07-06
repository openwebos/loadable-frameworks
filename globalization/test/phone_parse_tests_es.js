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

function PhoneParseTestsES() {
}

PhoneParseTestsES.prototype.testParseESFull = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("925123456", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "925",
		subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESIgnoreFormatting = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("(925) 123 456", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "925",
		subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESIgnoreCrap = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("9@251$23%45&6", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "925",
		subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESPlusIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+12028675309", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESZerosIDDToUS = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0012028675309", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "1",
		areaCode: "202",
		subscriberNumber: "8675309", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESPlusIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+442012345678", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "+",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESZerosIDDToGB = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00442012345678", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		iddPrefix: "00",
		countryCode: "44",
		areaCode: "20",
		subscriberNumber: "12345678", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseEmergencyNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112", 
			locale : {
				region: "es"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseEmergencyNumberPlus = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("112115", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			emergency: "112",
			subscriberNumber: "115", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESMobileNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("654123456", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		mobilePrefix: "654",
		subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESServiceNumber = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("800123456", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		serviceCode: "800",
		subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESDialAround = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("1032955123456", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		cic: "1032",
		areaCode: "955",
		subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESPartial1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("9", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "9", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseESPartial2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("95", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		subscriberNumber: "95", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseESPartial3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("957", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "957", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseESPartial4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("9571", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "957",
		subscriberNumber: "1", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseESPartial5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("957 12", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "957",
		subscriberNumber: "12", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseESPartial6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("957 123", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "957",
		subscriberNumber: "123", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseESPartial7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("957 123 4", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "957",
		subscriberNumber: "1234", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseESPartial8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("957 123 45", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		areaCode: "957",
		subscriberNumber: "12345", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseESPartial9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("957 123 456", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			areaCode: "957",
			subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

PhoneParseTestsES.prototype.testParseDialIDD00International1 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			trunkAccess: "0", 
			locale : {
				region: "es"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International2 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00", 
			locale : {
				region: "es"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International3 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("001", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1", 
			locale : {
				region: "es"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International4 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0016", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			subscriberNumber: "6", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International5 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00165", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			subscriberNumber: "65", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International6 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("001650", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650", 
			locale : {
				region: "es"
			}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International7 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0016505", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "5", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International8 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00165055", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "55", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International9 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("001650555", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "555", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International10 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0016505551", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "5551", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International11 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("00165055512", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "55512", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International12 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("001650555123", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "555123", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
PhoneParseTestsES.prototype.testParseDialIDD00International13 = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("0016505551234", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "00",
			countryCode: "1",
			areaCode: "650",
			subscriberNumber: "5551234", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};


PhoneParseTestsES.prototype.testParseFromInternational = function(){
	var parsed = Globalization.Phone.parsePhoneNumber("+34912123456", "es_es");
	UnitTest.requireDefined(parsed);
	
	var expected = {
			iddPrefix: "+",
			countryCode: "34",
			areaCode: "912",
			subscriberNumber: "123456", 
		locale : {
			region: "es"
		}
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};
