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

/*globals Globalization, Assert, console */

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function ImsiTests() {
}

ImsiTests.prototype.testRegularImsi3DigitMNC = function() {
	var imsi = "31003014084567890"
	var expected = {
		mcc: "310",
		mnc: "030",
		msin: "14084567890"
	};
	
	UnitTest.require(objectEquals(expected, Globalization.Phone.parseImsi(imsi)));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testRegularImsi2DigitMNC = function() {
	var imsi = "26207201234567"
	var expected = {
		mcc: "262",
		mnc: "07",
		msin: "201234567"
	};
	
	UnitTest.require(objectEquals(expected, Globalization.Phone.parseImsi(imsi)));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testSpecialImsi1 = function() {
	var imsi = "31000201234567"
	var expected = {
		mcc: "310",
		mnc: "00",
		msin: "201234567"
	};
	
	UnitTest.require(objectEquals(expected, Globalization.Phone.parseImsi(imsi)));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testSpecialImsi2 = function() {
	var imsi = "310004201234567"
	var expected = {
		mcc: "310",
		mnc: "004",
		msin: "201234567"
	};
	
	UnitTest.require(objectEquals(expected, Globalization.Phone.parseImsi(imsi)));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testBrokenMCC = function() {
	var imsi = "32000414084567890"
	var expected = {
		mcc: "320",
		mnc: "004",
		msin: "14084567890"
	};
	
	// should default to a 3 digit mnc
	UnitTest.require(objectEquals(expected, Globalization.Phone.parseImsi(imsi)));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testBrokenMNC = function() {
	var imsi = "31014114084567890"
	var expected = {
		mcc: "310",
		mnc: "141",
		msin: "14084567890"
	};
	
	// should default to a 3 digit mnc
	UnitTest.require(objectEquals(expected, Globalization.Phone.parseImsi(imsi)));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testTooShort = function() {
	var imsi = "31"
	
	UnitTest.require(Globalization.Phone.parseImsi(imsi) === undefined);
	
	return UnitTest.passed;
};

ImsiTests.prototype.testUndefined = function() {
	// should default to a 3 digit mnc
	UnitTest.require(Globalization.Phone.parseImsi(undefined) === undefined);
	
	return UnitTest.passed;
};


ImsiTests.prototype.testGetMobileCountryCode = function() {
	UnitTest.requireEqual("us", Globalization.Phone.getCountryCodeForMCC("310"));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testGetMobileCountryCodeDE = function() {
	UnitTest.requireEqual("de", Globalization.Phone.getCountryCodeForMCC("262"));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testGetMobileCountryCodeUnknownMCC = function() {
	UnitTest.requireEqual("us", Globalization.Phone.getCountryCodeForMCC("31"));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testGetMobileCountryCodeUndefinedMCC = function() {
	UnitTest.require(Globalization.Phone.getCountryCodeForMCC(undefined) === undefined);
	
	return UnitTest.passed;
};

ImsiTests.prototype.testGetCountryCodeForMCC = function() {
	UnitTest.requireEqual("1", Globalization.Phone.getMobileCountryCode("310"));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testGetCountryCodeForMCCDE = function() {
	UnitTest.requireEqual("49", Globalization.Phone.getMobileCountryCode("262"));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testGetCountryCodeForUnknownMCC = function() {
	UnitTest.requireEqual("1", Globalization.Phone.getMobileCountryCode("31"));
	
	return UnitTest.passed;
};

ImsiTests.prototype.testGetCountryCodeForUndefinedMCC = function() {
	UnitTest.require(Globalization.Phone.getMobileCountryCode(undefined) === undefined);
	
	return UnitTest.passed;
};
