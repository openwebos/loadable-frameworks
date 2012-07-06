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

function ReformatTests() {
}

ReformatTests.prototype.testUSReformatNormal = function() { 
	UnitTest.requireEqual("(456) 345-3434", Globalization.Phone.reformat("456-345-3434", {locale: "en_us"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatDefault = function() { 
	UnitTest.requireEqual("(456) 345-3434", Globalization.Phone.reformat("456-345-3434"));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatLocal = function() { 
	UnitTest.requireEqual("345-3434", Globalization.Phone.reformat("345.3434", {locale: "en_us"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatSMS = function() { 
	UnitTest.requireEqual("34534", Globalization.Phone.reformat("345-34", {locale: "en_us"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatPartial = function() { 
	UnitTest.requireEqual("345-34", Globalization.Phone.reformat("345-34", {locale: "en_us", partial: true}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatTooShortWithNonDialables = function() { 
	UnitTest.requireEqual("ext 345", Globalization.Phone.reformat("ext 345", {locale: "en_us"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatJustEnoughWithNonDialables = function() { 
	UnitTest.requireEqual("650-0023", Globalization.Phone.reformat("nob 6-5000 e 23", {locale: "en_us"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatInvalidPhoneNumber = function() { 
	UnitTest.requireEqual("home number 0-650-234-4567", Globalization.Phone.reformat("home number 0-650-234-4567", {locale: "en_us"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatEnoughWithLotsOfNonDialables = function() { 
	UnitTest.requireEqual("home number 020123445678", Globalization.Phone.reformat("home number 020123445678", {locale: "en_us"}));
	return UnitTest.passed;
};

// for bug NOV-115232
ReformatTests.prototype.testUSReformatHamRadioCallSign = function() { 
	UnitTest.requireEqual("KG6BW", Globalization.Phone.reformat("KG6BW", {locale: "en_us"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testDEReformatNormal = function() { 
	UnitTest.requireEqual("0201 456 78 90", Globalization.Phone.reformat("0201/4567890", {locale: "de_de"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testDEReformatLocal = function() { 
	UnitTest.requireEqual("456 78 90", Globalization.Phone.reformat("45.67.890", {locale: "de_de"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testDEReformatSMS = function() { 
	UnitTest.requireEqual("34334", Globalization.Phone.reformat("34.334", {locale: "de_de"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testDEReformatTooShortWithNonDialables = function() { 
	UnitTest.requireEqual("345", Globalization.Phone.reformat("ea 345", {locale: "de_de"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testDEReformatJustEnoughWithNonDialables = function() { 
	UnitTest.requireEqual("650 00 23", Globalization.Phone.reformat("nob 6-5000 e 23", {locale: "de_de"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testDEReformatEnoughWithLotsOfNonDialables = function() { 
	UnitTest.requireEqual("0201 23 44 56 78", Globalization.Phone.reformat("ins kinderg. 020123445678", {locale: "de_de"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testFRReformatNormal = function() { 
	UnitTest.requireEqual("02 01 45 67 89", Globalization.Phone.reformat("02.01.45.67.89", {locale: "fr_fr"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testFRReformatLocal = function() { 
	UnitTest.requireEqual("45 67 89 50", Globalization.Phone.reformat("45678950", {locale: "fr_fr"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testFRReformatSMS = function() { 
	UnitTest.requireEqual("34334", Globalization.Phone.reformat("34.334", {locale: "fr_fr"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testFRReformatTooShortWithNonDialables = function() { 
	UnitTest.requireEqual("ea 345", Globalization.Phone.reformat("ea 345", {locale: "fr_fr"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testFRReformatJustEnoughWithNonDialables = function() { 
	UnitTest.requireEqual("65 00 02 34", Globalization.Phone.reformat("nob 6-5000 e 234", {locale: "fr_fr"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testFRReformatEnoughWithLotsOfNonDialables = function() { 
	UnitTest.requireEqual("02 12 34 56 78", Globalization.Phone.reformat("mavins au 0212345678", {locale: "fr_fr"}));
	return UnitTest.passed;
};

ReformatTests.prototype.testUSReformatOverrideLocaleWithUSMCC = function() { 
	UnitTest.requireEqual("(456) 345-3434", Globalization.Phone.reformat("456-345-3434", {locale: "de_de", mcc: 316}));
	return UnitTest.passed;
};

ReformatTests.prototype.testDEReformatOverrideLocaleWithDEMCC = function() { 
	UnitTest.requireEqual("0201 456 78 90", Globalization.Phone.reformat("0201/4567890", {locale: "en_us", mcc: 262}));
	return UnitTest.passed;
};

ReformatTests.prototype.testFRReformatNormal = function() { 
	UnitTest.requireEqual("02 01 45 67 89", Globalization.Phone.reformat("02.01.45.67.89", {locale: "en_us", mcc: 208}));
	return UnitTest.passed;
}