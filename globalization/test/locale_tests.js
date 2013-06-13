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

function LocaleTests() {
}

LocaleTests.prototype.testLocaleSet = function() {
	Globalization.Locale._initLocale();
	UnitTest.requireEqual('en_us', Globalization.Locale.current);
	UnitTest.requireEqual('us', Globalization.Locale.formatRegion);
	
	var parsed = Globalization.Locale.setCurrentLocale("de_de");
	
	UnitTest.requireEqual('de_de', Globalization.Locale.current);
	UnitTest.requireEqual('de', Globalization.Locale.language);
	UnitTest.requireEqual('de', Globalization.Locale.region);
	UnitTest.requireEqual('us', Globalization.Locale.formatRegion);
	
	Globalization.Locale.setCurrentLocale("en_us");
	return UnitTest.passed;
};

LocaleTests.prototype.testFormatRegionSet = function() {
	Globalization.Locale._initLocale();
	UnitTest.requireEqual('en_us', Globalization.Locale.current);
	UnitTest.requireEqual('us', Globalization.Locale.formatRegion);
	
	var parsed = Globalization.Locale.setCurrentFormatRegion("de");
	
	UnitTest.requireEqual('en_us', Globalization.Locale.current);
	UnitTest.requireEqual('en', Globalization.Locale.language);
	UnitTest.requireEqual('us', Globalization.Locale.region);
	UnitTest.requireEqual('de', Globalization.Locale.formatRegion);
	
	Globalization.Locale.setCurrentFormatRegion("us");
	return UnitTest.passed;
};

LocaleTests.prototype.testParseLocaleStringLang = function(){
	var parsed = Globalization.Locale.parseLocaleString("en");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		locale: "en",
		language: "en"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

LocaleTests.prototype.testParseLocaleStringLangReg = function(){
	var parsed = Globalization.Locale.parseLocaleString("en_ca");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		locale: "en_ca",
		language: "en",
		region: "ca"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

LocaleTests.prototype.testParseLocaleStringLangRegCar = function(){
	var parsed = Globalization.Locale.parseLocaleString("en_ca_bellmo");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		locale: "en_ca_bellmo",
		language: "en",
		region: "ca",
		carrier: "bellmo"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

LocaleTests.prototype.testParseLocaleStringAllNormalize = function(){
	var parsed = Globalization.Locale.parseLocaleString("en-ca.bellmo");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		locale: "en_ca_bellmo",
		language: "en",
		region: "ca",
		carrier: "bellmo"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

LocaleTests.prototype.testParseLocaleStringMX = function(){
	var parsed = Globalization.Locale.parseLocaleString("es_mx");
	UnitTest.requireDefined(parsed);
	
	var expected = {
		locale: "es_mx",
		language: "es",
		region: "mx"
	};
	
	UnitTest.require(objectEquals(expected, parsed));
	return UnitTest.passed;
};

LocaleTests.prototype.testParseUsingPhoneRegionInsteadOfFormatsRegion = function() {
	Globalization.Locale._initLocale();
	
	// if it used this region incorrectly, it would cause the whole thing to be in the subscriber number
	Globalization.Locale.formatsRegion = "de"; 
	Globalization.Locale.phoneRegion = "us";
	
	var parsed = Globalization.Phone.parsePhoneNumber("9807654321"),
		expected = {
			areaCode: "980",
			subscriberNumber: "7654321", 
			locale : {
				region: "us"
			}
		};
	UnitTest.require(objectEquals(expected, parsed)); 
	
	Globalization.Locale.setCurrentLocale("en_us");
	Globalization.Locale.formatsRegion = "us";
	return UnitTest.passed;
};

LocaleTests.prototype.testFormatUsingPhoneRegionInsteadOfFormatsRegion = function() {
	Globalization.Locale._initLocale();
	
	// if it used this region incorrectly, it would cause the whole thing to be in the subscriber number
	Globalization.Locale.formatsRegion = "us"; 
	Globalization.Locale.phoneRegion = "gb";
	
	var parsed = {
		trunkAccess: "0",
		areaCode: "20",
		subscriberNumber: "87654321", 
		locale : {
			region: "gb"
		}
	};
	UnitTest.requireEqual("(020) 8765 4321", Globalization.Format.formatPhoneNumber(parsed)); 
	
	Globalization.Locale.setCurrentLocale("en_us");
	Globalization.Locale.phoneRegion = "us";
	return UnitTest.passed;
};

/*
LocaleTests.prototype.testGetAlphabeticIndexCharsEnglish = function(){
	var chars = Globalization.Locale.getAlphabeticIndexChars('en_us');
	var expected = [
	    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
	    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", 
	    "Y", "Z", "#" 
	];
	UnitTest.require(objectEquals(expected, chars));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetAlphabeticIndexCharsEnglishNoLocale = function(){
	var chars = Globalization.Locale.getAlphabeticIndexChars();
	var expected = [
	    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
	    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", 
	    "Y", "Z", "#" 
	];
	UnitTest.require(objectEquals(expected, chars));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetAlphabeticIndexCharsSpanish = function(){
	var chars = Globalization.Locale.getAlphabeticIndexChars('es_us');
	var expected = [
    	    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
    	    "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", 
    	    "Y", "Z", "#" 
    	];
   	UnitTest.require(objectEquals(expected, chars));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetAlphabeticIndexCharsUnknownLocale = function(){
	var chars = Globalization.Locale.getAlphabeticIndexChars('xx_xx');
	// should return the regular en_US strings
	var expected = [
    	    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
    	    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", 
    	    "Y", "Z", "#" 
    	];
   	UnitTest.require(objectEquals(expected, chars));
	return UnitTest.passed;
};
*/

LocaleTests.prototype.testGetBaseStringUS = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"ÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂǢÆǼÇĆĈĊČĎĐÐƉǱǲǄǅÈÉÊËĒĔĖĘĚȄȆĜĞĠĢǤǦǴĤĦÌÍÎÏĨĪĬĮİǏȈȊ" +
		"ĲĴĶǨĹĻĽĿŁǇǈÑŃŅŇǊǋÒÓÔÕÖØŌŎŐǑȌȎǾǪǬŒŔŖŘȐȒŠŚŜŞŠŢŤŦ" +
		"ÙÚÛÜǓǕǗǙǛŨŪŬŮŰŲȔȖŴÝŶŸŹŻŽ" +
		"àáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċčďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉ" +
		"ñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźżž";
	var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"AAAAAAAAAAAAAAAAEAEAECCCCCDDDDDZDzDZDzEEEEEEEEEEEGGGGGGGHHIIIIIIIIIIIII" +
		"JJKKLLLLLLJLjNNNNNJNjOOOOOOOOOOOOOOOOERRRRRSSSSSTTTUUUUUUUUUUUUUUUUUWYYYZZZ" +
		"aaaaaaaaaaaaaaaaeaeaecccccddddzdzeeeeeeeeeeeeggggggghhiiiiiiiiiiiii" +
		"jjjkklllllljnnnnnnjooooooooooooooooerrrrrssssssstttuuuuuuuuuuuuuuuuuwyyyzzzz";
   	UnitTest.requireEqual(expected, Globalization.Locale.getBaseString(testString, 'en_us'));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetBaseStringUSNoLocale = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"ÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂǢÆǼÇĆĈĊČĎĐÐƉǱǲǄǅÈÉÊËĒĔĖĘĚȄȆĜĞĠĢǤǦǴĤĦÌÍÎÏĨĪĬĮİǏȈȊ" +
		"ĲĴĶǨĹĻĽĿŁǇǈÑŃŅŇǊǋÒÓÔÕÖØŌŎŐǑȌȎǾǪǬŒŔŖŘȐȒŠŚŜŞŠŢŤŦ" +
		"ÙÚÛÜǓǕǗǙǛŨŪŬŮŰŲȔȖŴÝŶŸŹŻŽ" +
		"àáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċčďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉ" +
		"ñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźżž";
	var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"AAAAAAAAAAAAAAAAEAEAECCCCCDDDDDZDzDZDzEEEEEEEEEEEGGGGGGGHHIIIIIIIIIIIII" +
		"JJKKLLLLLLJLjNNNNNJNjOOOOOOOOOOOOOOOOERRRRRSSSSSTTTUUUUUUUUUUUUUUUUUWYYYZZZ" +
		"aaaaaaaaaaaaaaaaeaeaecccccddddzdzeeeeeeeeeeeeggggggghhiiiiiiiiiiiii" +
		"jjjkklllllljnnnnnnjooooooooooooooooerrrrrssssssstttuuuuuuuuuuuuuuuuuwyyyzzzz";
   	UnitTest.requireEqual(expected, Globalization.Locale.getBaseString(testString));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetBaseStringDE = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"ÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂǢÆǼÇĆĈĊČĎĐÐƉǱǲǄǅÈÉÊËĒĔĖĘĚȄȆĜĞĠĢǤǦǴĤĦÌÍÎÏĨĪĬĮİǏȈȊ" +
		"ĲĴĶǨĹĻĽĿŁǇǈÑŃŅŇǊǋÒÓÔÕÖØŌŎŐǑȌȎǾǪǬŒŔŖŘȐȒŠŚŜŞŠŢŤŦ" +
		"ÙÚÛÜǓǕǗǙǛŨŪŬŮŰŲȔȖŴÝŶŸŹŻŽ" +
		"àáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċčďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉ" +
		"ñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźżž";
	var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"AAAAAAAAAAAAAAAAEAEAECCCCCDDDDDZDzDZDzEEEEEEEEEEEGGGGGGGHHIIIIIIIIIIIII" +
		"JJKKLLLLLLJLjNNNNNJNjOOOOOOOOOOOOOOOOERRRRRSSSSSTTTUUUUUUUUUUUUUUUUUWYYYZZZ" +
		"aaaaaaaaaaaaaaaaeaeaecccccddddzdzeeeeeeeeeeeeggggggghhiiiiiiiiiiiii" +
		"jjjkklllllljnnnnnnjooooooooooooooooerrrrrssssssstttuuuuuuuuuuuuuuuuuwyyyzzzz";
   	UnitTest.requireEqual(expected, Globalization.Locale.getBaseString(testString, 'de_de'));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetBaseStringES = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"ÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂǢÆǼÇĆĈĊČĎĐÐƉǱǲǄǅÈÉÊËĒĔĖĘĚȄȆĜĞĠĢǤǦǴĤĦÌÍÎÏĨĪĬĮİǏȈȊ" +
		"ĲĴĶǨĹĻĽĿŁǇǈÑŃŅŇǊǋÒÓÔÕÖØŌŎŐǑȌȎǾǪǬŒŔŖŘȐȒŠŚŜŞŠŢŤŦ" +
		"ÙÚÛÜǓǕǗǙǛŨŪŬŮŰŲȔȖŴÝŶŸŹŻŽ" +
		"àáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċčďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉ" +
		"ñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźżž";
	var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"AAAAAAAAAAAAAAAAEAEAECCCCCDDDDDZDzDZDzEEEEEEEEEEEGGGGGGGHHIIIIIIIIIIIII" +
		"JJKKLLLLLLJLjÑNNNNJNjOOOOOOOOOOOOOOOOERRRRRSSSSSTTTUUUUUUUUUUUUUUUUUWYYYZZZ" +
		"aaaaaaaaaaaaaaaaeaeaecccccddddzdzeeeeeeeeeeeeggggggghhiiiiiiiiiiiii" +
		"jjjkklllllljñnnnnnjooooooooooooooooerrrrrssssssstttuuuuuuuuuuuuuuuuuwyyyzzzz";
   	UnitTest.requireEqual(expected, Globalization.Locale.getBaseString(testString, 'es_us'));
	return UnitTest.passed;
};


LocaleTests.prototype.testGetBaseStringFR = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"ÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂǢÆǼÇĆĈĊČĎĐÐƉǱǲǄǅÈÉÊËĒĔĖĘĚȄȆĜĞĠĢǤǦǴĤĦÌÍÎÏĨĪĬĮİǏȈȊ" +
		"ĲĴĶǨĹĻĽĿŁǇǈÑŃŅŇǊǋÒÓÔÕÖØŌŎŐǑȌȎǾǪǬŒŔŖŘȐȒŠŚŜŞŠŢŤŦ" +
		"ÙÚÛÜǓǕǗǙǛŨŪŬŮŰŲȔȖŴÝŶŸŹŻŽ" +
		"àáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċčďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉ" +
		"ñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźżž";
	var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"AAAAAAAAAAAAAAAAEAEAECCCCCDDDDDZDzDZDzEEEEEEEEEEEGGGGGGGHHIIIIIIIIIIIII" +
		"JJKKLLLLLLJLjNNNNNJNjOOOOOOOOOOOOOOOOERRRRRSSSSSTTTUUUUUUUUUUUUUUUUUWYYYZZZ" +
		"aaaaaaaaaaaaaaaaeaeaecccccddddzdzeeeeeeeeeeeeggggggghhiiiiiiiiiiiii" +
		"jjjkklllllljnnnnnnjooooooooooooooooerrrrrssssssstttuuuuuuuuuuuuuuuuuwyyyzzzz";
   	UnitTest.requireEqual(expected, Globalization.Locale.getBaseString(testString, 'fr_fr'));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetBaseStringIT = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"ÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂǢÆǼÇĆĈĊČĎĐÐƉǱǲǄǅÈÉÊËĒĔĖĘĚȄȆĜĞĠĢǤǦǴĤĦÌÍÎÏĨĪĬĮİǏȈȊ" +
		"ĲĴĶǨĹĻĽĿŁǇǈÑŃŅŇǊǋÒÓÔÕÖØŌŎŐǑȌȎǾǪǬŒŔŖŘȐȒŠŚŜŞŠŢŤŦ" +
		"ÙÚÛÜǓǕǗǙǛŨŪŬŮŰŲȔȖŴÝŶŸŹŻŽ" +
		"àáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċčďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉ" +
		"ñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźżž";
	var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"AAAAAAAAAAAAAAAAEAEAECCCCCDDDDDZDzDZDzEEEEEEEEEEEGGGGGGGHHIIIIIIIIIIIII" +
		"JJKKLLLLLLJLjNNNNNJNjOOOOOOOOOOOOOOOOERRRRRSSSSSTTTUUUUUUUUUUUUUUUUUWYYYZZZ" +
		"aaaaaaaaaaaaaaaaeaeaecccccddddzdzeeeeeeeeeeeeggggggghhiiiiiiiiiiiii" +
		"jjjkklllllljnnnnnnjooooooooooooooooerrrrrssssssstttuuuuuuuuuuuuuuuuuwyyyzzzz";
   	UnitTest.requireEqual(expected, Globalization.Locale.getBaseString(testString, 'it_it'));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetBaseStringUnknown = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"ÀÁÂÃÄÅĀĂĄǍǞǠǺȀȂǢÆǼÇĆĈĊČĎĐÐƉǱǲǄǅÈÉÊËĒĔĖĘĚȄȆĜĞĠĢǤǦǴĤĦÌÍÎÏĨĪĬĮİǏȈȊ" +
		"ĲĴĶǨĹĻĽĿŁǇǈÑŃŅŇǊǋÒÓÔÕÖØŌŎŐǑȌȎǾǪǬŒŔŖŘȐȒŠŚŜŞŠŢŤŦ" +
		"ÙÚÛÜǓǕǗǙǛŨŪŬŮŰŲȔȖŴÝŶŸŹŻŽ" +
		"àáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċčďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉ" +
		"ñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźżž";
	var expected = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"AAAAAAAAAAAAAAAAEAEAECCCCCDDDDDZDzDZDzEEEEEEEEEEEGGGGGGGHHIIIIIIIIIIIII" +
		"JJKKLLLLLLJLjNNNNNJNjOOOOOOOOOOOOOOOOERRRRRSSSSSTTTUUUUUUUUUUUUUUUUUWYYYZZZ" +
		"aaaaaaaaaaaaaaaaeaeaecccccddddzdzeeeeeeeeeeeeggggggghhiiiiiiiiiiiii" +
		"jjjkklllllljnnnnnnjooooooooooooooooerrrrrssssssstttuuuuuuuuuuuuuuuuuwyyyzzzz";
	// should behave like the US
   	UnitTest.requireEqual(expected, Globalization.Locale.getBaseString(testString, 'xx_xx'));
	return UnitTest.passed;
};

LocaleTests.prototype.testGetBaseStringNoString = function(){
   	UnitTest.require(Globalization.Locale.getBaseString(null, 'en_us') === undefined);
	return UnitTest.passed;
};

LocaleTests.prototype.testUpperCaseEN = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzǲǅǈǋàáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċč" +
			"ďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœ" +
			"ŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźż";
	var expected = "ABCDEFGHIJKLMNOPQRSTUVWXYZǱǄǇǊÀÁÂÃÄÅĀĂĄǍǞǠȀȂǺǼÆǢÇĆĈĊČ" +
			"ĎĐÐǱǄÈÉÊËĒĔĖĘĚƎȄȆĜĞĠĢǴǤǦĤĦĨĪĬĮIǏȈȊÌÍÎÏĲĴJĶǨĹĻĽĿŁǇÑŃŅŇNǊÒÓÔÕÖØŌŎŐǑǪǬǾȌȎŒ" +
			"ŔŖŘȐȒŠŚŜŞŠSSŢŤŦÙÚÛÜŨŪŬŮŰŲǓǕǗǙǛȔȖŴŶÝŸŽŹŻ";
   	UnitTest.requireEqual(expected, Globalization.Locale.toUpperCase(testString, 'en_us'));
	return UnitTest.passed;
};

LocaleTests.prototype.testUpperCaseENNoLocale = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzǲǅǈǋàáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċč" +
			"ďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœ" +
			"ŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźż";
	var expected = "ABCDEFGHIJKLMNOPQRSTUVWXYZǱǄǇǊÀÁÂÃÄÅĀĂĄǍǞǠȀȂǺǼÆǢÇĆĈĊČ" +
			"ĎĐÐǱǄÈÉÊËĒĔĖĘĚƎȄȆĜĞĠĢǴǤǦĤĦĨĪĬĮIǏȈȊÌÍÎÏĲĴJĶǨĹĻĽĿŁǇÑŃŅŇNǊÒÓÔÕÖØŌŎŐǑǪǬǾȌȎŒ" +
			"ŔŖŘȐȒŠŚŜŞŠSSŢŤŦÙÚÛÜŨŪŬŮŰŲǓǕǗǙǛȔȖŴŶÝŸŽŹŻ";
   	UnitTest.requireEqual(expected, Globalization.Locale.toUpperCase(testString));
	return UnitTest.passed;
};

LocaleTests.prototype.testUpperCaseENDontTouchUppers = function(){
	var testString = "ABCDEFGHIJKLMNOPQRSTUVWXYZǱǄǇǊÀÁÂÃÄÅĀĂĄǍǞǠȀȂǺǼÆǢÇĆĈĊČ" +
			"ĎĐÐǱǄÈÉÊËĒĔĖĘĚƎȄȆĜĞĠĢǴǤǦĤĦĨĪĬĮIǏȈȊÌÍÎÏĲĴJĶǨĹĻĽĿŁǇÑŃŅŇNǊÒÓÔÕÖØŌŎŐǑǪǬǾȌȎŒ" +
			"ŔŖŘȐȒŠŚŜŞŠSSŢŤŦÙÚÛÜŨŪŬŮŰŲǓǕǗǙǛȔȖŴŶÝŸŽŹŻ";
	var expected   = "ABCDEFGHIJKLMNOPQRSTUVWXYZǱǄǇǊÀÁÂÃÄÅĀĂĄǍǞǠȀȂǺǼÆǢÇĆĈĊČ" +
			"ĎĐÐǱǄÈÉÊËĒĔĖĘĚƎȄȆĜĞĠĢǴǤǦĤĦĨĪĬĮIǏȈȊÌÍÎÏĲĴJĶǨĹĻĽĿŁǇÑŃŅŇNǊÒÓÔÕÖØŌŎŐǑǪǬǾȌȎŒ" +
			"ŔŖŘȐȒŠŚŜŞŠSSŢŤŦÙÚÛÜŨŪŬŮŰŲǓǕǗǙǛȔȖŴŶÝŸŽŹŻ";
   	UnitTest.requireEqual(expected, Globalization.Locale.toUpperCase(testString, 'en_us'));
	return UnitTest.passed;
};

LocaleTests.prototype.testUpperCaseDE = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzǲǅǈǋàáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċč" +
			"ďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœ" +
			"ŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźż";
	var expected = "ABCDEFGHIJKLMNOPQRSTUVWXYZǱǄǇǊÀÁÂÃÄÅĀĂĄǍǞǠȀȂǺǼÆǢÇĆĈĊČ" +
			"ĎĐÐǱǄÈÉÊËĒĔĖĘĚƎȄȆĜĞĠĢǴǤǦĤĦĨĪĬĮIǏȈȊÌÍÎÏĲĴJĶǨĹĻĽĿŁǇÑŃŅŇNǊÒÓÔÕÖØŌŎŐǑǪǬǾȌȎŒ" +
			"ŔŖŘȐȒŠŚŜŞŠSSŢŤŦÙÚÛÜŨŪŬŮŰŲǓǕǗǙǛȔȖŴŶÝŸŽŹŻ";
	var result = Globalization.Locale.toUpperCase(testString, 'de_de');
	
   	UnitTest.requireEqual(expected, Globalization.Locale.toUpperCase(testString, 'de_de'));
	return UnitTest.passed;
};

LocaleTests.prototype.testUpperCaseUnknown = function(){
	var testString = "abcdefghijklmnopqrstuvwxyzǲǅǈǋàáâãäåāăąǎǟǡȁȃǻǽæǣçćĉċč" +
			"ďđðǳǆèéêëēĕėęěǝȅȇĝğġģǵǥǧĥħĩīĭįıǐȉȋìíîïĳĵǰķǩĺļľŀłǉñńņňŉǌòóôõöøōŏőǒǫǭǿȍȏœ" +
			"ŕŗřȑȓšśŝşšßţťŧùúûüũūŭůűųǔǖǘǚǜȕȗŵŷýÿžźż";
	var expected = "ABCDEFGHIJKLMNOPQRSTUVWXYZǱǄǇǊÀÁÂÃÄÅĀĂĄǍǞǠȀȂǺǼÆǢÇĆĈĊČ" +
			"ĎĐÐǱǄÈÉÊËĒĔĖĘĚƎȄȆĜĞĠĢǴǤǦĤĦĨĪĬĮIǏȈȊÌÍÎÏĲĴJĶǨĹĻĽĿŁǇÑŃŅŇNǊÒÓÔÕÖØŌŎŐǑǪǬǾȌȎŒ" +
			"ŔŖŘȐȒŠŚŜŞŠSSŢŤŦÙÚÛÜŨŪŬŮŰŲǓǕǗǙǛȔȖŴŶÝŸŽŹŻ";
   	UnitTest.requireEqual(expected, Globalization.Locale.toUpperCase(testString, 'xx_xx'));
	return UnitTest.passed;
};

LocaleTests.prototype.testUpperCaseNoString = function(){
   	UnitTest.require(Globalization.Locale.getBaseString(null, 'en_us') === undefined);
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveSimple = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("mama", "mama-mia, here we go again, mama, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveNoMatch = function(){
	var expected = [];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("daddy", "mama-mia, here we go again, mama, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveNoQuery = function(){
	UnitTest.require(undefined === Globalization.Locale.searchAccentInsensitive(undefined, "mama-mia, here we go again, mama, how could I forget you?"));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveNoString = function(){
	UnitTest.require(undefined === Globalization.Locale.searchAccentInsensitive("mama", undefined));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveCaseInsensitiveQuery = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("MaMa", "mama-mia, here we go again, mama, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveCaseInsensitiveString = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("mama", "maMa-mia, here we go again, MaMa, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveNoPartials = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("mama", "mama-mia, here we go again, mama, how mam could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveIgnoreAccentsInQuery = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("måmá", "mama-mia, here we go again, mama, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveIgnoreAccentsInString = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("mama", "måmá-mia, here we go again, màma, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveIgnoreAccentsInBoth = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("mámå", "måmá-mia, here we go again, màma, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveIgnoreAccentsInBothCaseInsensitive = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 28, end: 32 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("mÀmå", "måmá-mia, here we go again, màmÀ, how could I forget you?")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveMatchWithQueryExpansions = function(){
	var expected = [
        { start: 0, end: 6 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("ßaßy", "ssassy sassy ssasy")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveMatchWithStringExpansions = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 15, end: 20 },
        { start: 21, end: 26 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("ssassy", "ßaßy saßy ßasy ßassy ssaßy")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveMatchWithExpansionsInBoth = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 15, end: 20 },
        { start: 21, end: 26 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("ssaßy", "ßaßy saßy ßasy ßassy ssaßy")));
	return UnitTest.passed;
};

LocaleTests.prototype.testSearchAccentInsensitiveMatchWithExpansionsInBothCaseInsensitive = function(){
	var expected = [
        { start: 0, end: 4 },
        { start: 15, end: 20 },
        { start: 21, end: 26 }
	];
   	UnitTest.require(objectEquals(expected, Globalization.Locale.searchAccentInsensitive("sSaßy", "ßaßy saßy ßasy ßasSy Ssaßy")));
	return UnitTest.passed;
};
