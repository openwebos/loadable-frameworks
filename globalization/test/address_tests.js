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

var webos = IMPORTS.require("webos"); webos.include("test/loadall.js");

function AddressTests() {
}

AddressTests.prototype.testParseAddressSimple = function () {
	var parsedAddress = Globalization.Address.parseAddress("950 W Maude Ave.\nSunnyvale, CA 94085\nUSA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "950 W Maude Ave.");
	UnitTest.requireIdentical(parsedAddress.locality, "Sunnyvale");
	UnitTest.requireIdentical(parsedAddress.region, "CA");
	UnitTest.requireIdentical(parsedAddress.postalCode, "94085");
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

// to verify NOV-111026
AddressTests.prototype.testParseAddressSimple2 = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Main St.\nMyTown, NY 11530\nUSA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Main St.");
	UnitTest.requireIdentical(parsedAddress.locality, "MyTown");
	UnitTest.requireIdentical(parsedAddress.region, "NY");
	UnitTest.requireIdentical(parsedAddress.postalCode, "11530");
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressMoreComplex = function () {
	var parsedAddress = Globalization.Address.parseAddress("950 W 21st Ave, Apt 45\nNY, NY 10234", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "950 W 21st Ave, Apt 45");
	UnitTest.requireIdentical(parsedAddress.locality, "NY");
	UnitTest.requireIdentical(parsedAddress.region, "NY");
	UnitTest.requireIdentical(parsedAddress.postalCode, "10234");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressSpelledOutState = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Main St.\nMyTown, Arizona 11530\nUSA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Main St.");
	UnitTest.requireIdentical(parsedAddress.locality, "MyTown");
	UnitTest.requireIdentical(parsedAddress.region, "Arizona");
	UnitTest.requireIdentical(parsedAddress.postalCode, "11530");
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressSpelledOutStateWithSpaces = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Main St.\nMyTown, New York 11530\nUSA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Main St.");
	UnitTest.requireIdentical(parsedAddress.locality, "MyTown");
	UnitTest.requireIdentical(parsedAddress.region, "New York");
	UnitTest.requireIdentical(parsedAddress.postalCode, "11530");
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressSpelledOutStateWithPrefix = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Main St.\nMyTown, Arkansas 11530\nUSA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Main St.");
	UnitTest.requireIdentical(parsedAddress.locality, "MyTown");
	UnitTest.requireIdentical(parsedAddress.region, "Arkansas");
	UnitTest.requireIdentical(parsedAddress.postalCode, "11530");
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressNoZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Main St.\nMyTown, NY\nUSA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Main St.");
	UnitTest.requireIdentical(parsedAddress.locality, "MyTown");
	UnitTest.requireIdentical(parsedAddress.region, "NY");
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressManyLines = function () {
	var parsedAddress = Globalization.Address.parseAddress("950 W 21st Ave\nApt 45\nNY\nNY\n10234", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "950 W 21st Ave, Apt 45");
	UnitTest.requireIdentical(parsedAddress.locality, "NY");
	UnitTest.requireIdentical(parsedAddress.region, "NY");
	UnitTest.requireIdentical(parsedAddress.postalCode, "10234");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressOneLine = function () {
	var parsedAddress = Globalization.Address.parseAddress("950 W Maude Ave., Sunnyvale, CA 94085 USA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "950 W Maude Ave.");
	UnitTest.requireIdentical(parsedAddress.locality, "Sunnyvale");
	UnitTest.requireIdentical(parsedAddress.region, "CA");
	UnitTest.requireIdentical(parsedAddress.postalCode, "94085");
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressSuperfluousWhitespace = function () {
	var parsedAddress = Globalization.Address.parseAddress("950 W 21st Ave\n\n   Apt 45      \n NY,    NY   10234\n\n   \n\n", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "950 W 21st Ave, Apt 45");
	UnitTest.requireIdentical(parsedAddress.locality, "NY");
	UnitTest.requireIdentical(parsedAddress.region, "NY");
	UnitTest.requireIdentical(parsedAddress.postalCode, "10234");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressNoDelimiters = function () {
	var parsedAddress = Globalization.Address.parseAddress("950 W Maude Ave. Sunnyvale CA 94085 USA", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "950 W Maude Ave.");
	UnitTest.requireIdentical(parsedAddress.locality, "Sunnyvale");
	UnitTest.requireIdentical(parsedAddress.region, "CA");
	UnitTest.requireIdentical(parsedAddress.postalCode, "94085");
	UnitTest.requireIdentical(parsedAddress.country, "USA");
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressWithStreetNumberThatLooksLikeAZip = function () {
	var parsedAddress = Globalization.Address.parseAddress("15672 W 156st St #45\nSeattle, WA 98765", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "15672 W 156st St #45");
	UnitTest.requireIdentical(parsedAddress.locality, "Seattle");
	UnitTest.requireIdentical(parsedAddress.region, "WA");
	UnitTest.requireIdentical(parsedAddress.postalCode, "98765");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressPOBox = function () {
	var parsedAddress = Globalization.Address.parseAddress("P.O. Box 350\nMinneapolis MN 45678-2234", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "P.O. Box 350");
	UnitTest.requireIdentical(parsedAddress.locality, "Minneapolis");
	UnitTest.requireIdentical(parsedAddress.region, "MN");
	UnitTest.requireIdentical(parsedAddress.postalCode, "45678-2234");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressHawaii = function () {
	var parsedAddress = Globalization.Address.parseAddress("20 Hawai'i Oe Lane\nKa'anapali, HI 99232", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "20 Hawai'i Oe Lane");
	UnitTest.requireIdentical(parsedAddress.locality, "Ka'anapali");
	UnitTest.requireIdentical(parsedAddress.region, "HI");
	UnitTest.requireIdentical(parsedAddress.postalCode, "99232");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressUnknown = function () {

	var parsedAddress = Globalization.Address.parseAddress("123 Main Street, Pretoria 5678, South Africa", 'en_us');

	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "123 Main Street");
	UnitTest.requireIdentical(parsedAddress.locality, "Pretoria");
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical(parsedAddress.postalCode, "5678");
	UnitTest.requireIdentical(parsedAddress.country, "South Africa");
	UnitTest.requireIdentical(parsedAddress.countryCode, "za");
	
	return UnitTest.passed;
};

AddressTests.prototype.testParseAddressNonUS = function () {
	var parsedAddress = Globalization.Address.parseAddress("Achterberglaan 23, 2345 GD Uithoorn, Netherlands", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "Achterberglaan 23");
	UnitTest.requireIdentical(parsedAddress.locality, "Uithoorn");
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical(parsedAddress.postalCode, "2345 GD");
	UnitTest.requireIdentical(parsedAddress.country, "Netherlands");
	UnitTest.requireIdentical(parsedAddress.countryCode, "nl");
	
	return UnitTest.passed;
};
	
// for NOV-118061
AddressTests.prototype.testParseAddressNonStandard = function () {
	var parsedAddress = Globalization.Address.parseAddress("123 mcdonald ave, apt 234, sunnyvale, CA 34567", 'en_us');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "123 mcdonald ave, apt 234");
	UnitTest.requireIdentical(parsedAddress.locality, "sunnyvale");
	UnitTest.requireIdentical(parsedAddress.region, "CA");
	UnitTest.requireIdentical(parsedAddress.postalCode, "34567");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "us");
	
	return UnitTest.passed;
};

AddressTests.prototype.testFormatAddress = function () {
	var parsedAddress = {
		streetAddress: "1234 Any Street",
		locality: "Anytown",
		region: "CA",
		postalCode: "94085",
		country: "United States of America",
		countryCode: "us",
		locale: {language: 'en', region: 'us', locale: 'en_us'}
	};
	
	var expected = "1234 Any Street\nAnytown CA 94085\nUnited States of America";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_us'));

	return UnitTest.passed;
};

//for DFISH-9927
AddressTests.prototype.testParseAddressUnknownLocale = function () {
	var parsedAddress = Globalization.Address.parseAddress("123 mcdonald ave, apt 234, sunnyvale, CA 34567", 'xx_xx');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "123 mcdonald ave, apt 234, sunnyvale");
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical(parsedAddress.locality, "CA");
	UnitTest.requireIdentical(parsedAddress.postalCode, "34567");
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "xx");
	
	return UnitTest.passed;
};

// for DFISH-23879
AddressTests.prototype.testParseAddressUnknownLocaleHK = function () {
	var parsedAddress = Globalization.Address.parseAddress("Boulder CO us", 'en_hk');
	
	console.log("address is: " + JSON.stringify(parsedAddress));
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "Boulder CO us");
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.require(parsedAddress.locality === undefined);
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "hk");
	
	return UnitTest.passed;
};
AddressTests.prototype.testParseAddressUnknownLocaleHK = function () {
	var parsedAddress = Globalization.Address.parseAddress("Boulder CO us", 'en_ar');
	
	UnitTest.requireObject(parsedAddress);
	UnitTest.requireIdentical(parsedAddress.streetAddress, "Boulder CO");
	UnitTest.require(parsedAddress.region === undefined);
	UnitTest.requireIdentical(parsedAddress.locality, "us");
	UnitTest.require(parsedAddress.postalCode === undefined);
	UnitTest.require(parsedAddress.country === undefined);
	UnitTest.requireIdentical(parsedAddress.countryCode, "ar");
	
	return UnitTest.passed;
};
AddressTests.prototype.testFormatAddressUnknownAR = function () {
	var parsedAddress = Globalization.Address.parseAddress("Boulder CO us", 'en_ar');
	
	var expected = "Boulder CO\nus";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_ar'));

	return UnitTest.passed;
};


AddressTests.prototype.testParseContactsHK = function () {
	var parsedAddress = Globalization.Address.parseAddress("62 West Wallaby Street Wigan UK", "en_hk");
	
	var expected = "62 West Wallaby Street\nWigan\nUK";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_hk'));

	return UnitTest.passed;
};
AddressTests.prototype.testParseContactsHK2 = function () {
	var parsedAddress = Globalization.Address.parseAddress("Second Address", "en_hk");
	
	var expected = "Second Address";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_hk'));

	return UnitTest.passed;
};

// test formatting a database object from contacts that has fields that didn't necessarily come from
// parseAddress, but from the DB instead
AddressTests.prototype.testParseContactsHKFromDB = function () {
	var parsedAddress = {
		"_id":"250",
		"locality":"Wigan",
		"postalCode":"",
		"primary":false,
		"country":"UK",
		"streetAddress":"62 West Wallaby Street",
		"type":"type_home"
	};
	
	var expected = "62 West Wallaby Street\nWigan\nUK";
	UnitTest.requireEqual(expected, Globalization.Address.formatAddress(parsedAddress, 'en_hk'));

	return UnitTest.passed;
};
