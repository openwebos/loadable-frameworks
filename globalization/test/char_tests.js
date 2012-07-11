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

function CharTests() {
}

CharTests.prototype.testIsPunctFalse1 = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct('a'));
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctFalse2 = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct('J'));
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctFalse3 = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct(' '));
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctFalse4 = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct('ä'));
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctFalse5 = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct('地'));
	return UnitTest.passed;
};

CharTests.prototype.testIsPunctTrue1 = function(){
	UnitTest.require(Globalization.Character.isPunct('-'));
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctTrue2 = function(){
	UnitTest.require(Globalization.Character.isPunct('?'));
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctTrue3 = function(){
	UnitTest.require(Globalization.Character.isPunct('„')); // double low-9 quotation mark
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctTrue4 = function(){
	UnitTest.require(Globalization.Character.isPunct(';'));	// this is not a regular semicolon... it's a greek question mark
	return UnitTest.passed;
};
CharTests.prototype.testIsPunctTrue5 = function(){
	UnitTest.require(Globalization.Character.isPunct('。')); // maru -- japanese full stop
	return UnitTest.passed;
};

CharTests.prototype.testIsPunctEmpty = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct(''));
	return UnitTest.passed;
};

CharTests.prototype.testIsPunctUndefined = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct(undefined));
	return UnitTest.passed;
};

CharTests.prototype.testIsPunctIgnoreAnythingButFirstChar = function(){
	UnitTest.requireFalse(Globalization.Character.isPunct('a.?-'));
	UnitTest.require(Globalization.Character.isPunct('?abcd'));
	return UnitTest.passed;
};


CharTests.prototype.testIsWhitespaceFalse1 = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace('a'));
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceFalse2 = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace('A'));
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceFalse3 = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace('-'));
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceFalse4 = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace('Ä'));
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceFalse5 = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace('地'));
	return UnitTest.passed;
};

CharTests.prototype.testIsWhitespaceTrue1 = function(){
	UnitTest.require(Globalization.Character.isWhitespace(' '));
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceTrue2 = function(){
	UnitTest.require(Globalization.Character.isWhitespace('\t'));
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceTrue3 = function(){
	UnitTest.require(Globalization.Character.isWhitespace('\n'));
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceTrue4 = function(){
	UnitTest.require(Globalization.Character.isWhitespace('　')); // ideographic space
	return UnitTest.passed;
};
CharTests.prototype.testIsWhitespaceTrue5 = function(){
	UnitTest.require(Globalization.Character.isWhitespace(' ')); // em space
	return UnitTest.passed;
};

CharTests.prototype.testIsWhitespaceEmpty = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace(''));
	return UnitTest.passed;
};

CharTests.prototype.testIsWhitespaceUndefined = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace(undefined));
	return UnitTest.passed;
};

CharTests.prototype.testIsWhitespaceIgnoreAnythingButFirstChar = function(){
	UnitTest.requireFalse(Globalization.Character.isWhitespace('. \t'));
	UnitTest.require(Globalization.Character.isWhitespace(' abcd'));
	return UnitTest.passed;
};



CharTests.prototype.testIsIdeographFalse1 = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph('a'));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographFalse2 = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph('A'));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographFalse3 = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph('-'));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographFalse4 = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph(' '));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographFalse5 = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph('é'));
	return UnitTest.passed;
};

CharTests.prototype.testIsIdeographTrue2 = function(){
	UnitTest.require(Globalization.Character.isIdeograph('子'));		// ji = "character"
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographTrue3 = function(){
	UnitTest.require(Globalization.Character.isIdeograph('ㄞ'));		// bopomofo letter ai
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographTrue4 = function(){
	UnitTest.require(Globalization.Character.isIdeograph('し'));		// Hiragana letter shi
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographTrue5 = function(){
	UnitTest.require(Globalization.Character.isIdeograph('㈢'));		// Parenthesized ideograph three
	return UnitTest.passed;
};

CharTests.prototype.testIsIdeographHan = function(){
	UnitTest.require(Globalization.Character.isIdeograph('地'));		// Chinese family name
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHanCompatibility = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0xF90A)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHanExtendedA = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x340A)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHiragana = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x304A)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographKatakana = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x30B0)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHalfwidthKatakana = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0xFF90)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographKatakanaExtended = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x31F8)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographBopomofo = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x3110)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographBopomofoExtended = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x31A8)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHangul = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x3138)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHalfwidthHangul = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0xFFA8)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHangulSyllables = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0xACFF)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographYi = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0xA200)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographJamo = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0x1180)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographJamoExtendedA = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0xA968)));
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographJamoExtendedB = function(){
	UnitTest.require(Globalization.Character.isIdeograph(String.fromCharCode(0xD7C0)));
	return UnitTest.passed;
};

CharTests.prototype.testIsIdeographEmpty = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph(''));
	return UnitTest.passed;
};

CharTests.prototype.testIsIdeographUndefined = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph(undefined));
	return UnitTest.passed;
};

CharTests.prototype.testIsIdeographIgnoreAnythingButFirstChar = function(){
	UnitTest.requireFalse(Globalization.Character.isIdeograph('a地'));
	UnitTest.require(Globalization.Character.isIdeograph('地a- '));
	return UnitTest.passed;
};


CharTests.prototype.testIsLetterFalse1 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter('1'));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalse2 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter('#'));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalse3 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter('￡'));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalse4 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter('。'));	// japanese maru (full stop)
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalse5 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter('∞'));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalse6 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(' '));
	return UnitTest.passed;
};

CharTests.prototype.testIsLetterFalseYi = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0xA48D)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseBopomofo1 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x3100)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseBopomofo2 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x312E)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseHanCompability = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0xFADA)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseJamoExtendedB = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0xD7FC)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseHan = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x9FCC)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseJamoExtendedA = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0xA97D)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseEnclosedCJK = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x3200)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseCJKSquaredWords = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x3300)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseCJKSquaredAbbreviations = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x3380)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseHangul2 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x3130)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseHangul3 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x318F)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseKatakana2 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x30A0)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseHiragana2 = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x3040)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseIdeographClosingMark = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x3006)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterFalseMasuMark = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(String.fromCharCode(0x303C)));
	return UnitTest.passed;
};

CharTests.prototype.testIsLetterTrue1 = function(){
	UnitTest.require(Globalization.Character.isLetter('a'));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterTrue2 = function(){
	UnitTest.require(Globalization.Character.isLetter('A'));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterTrue3 = function(){
	UnitTest.require(Globalization.Character.isLetter('Ā'));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterTrue4 = function(){
	UnitTest.require(Globalization.Character.isLetter('ю'));		// Cyrillic character yu
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterTrue5 = function(){
	UnitTest.require(Globalization.Character.isLetter('א'));		// Hebrew letter alef
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterTrue6 = function(){
	UnitTest.require(Globalization.Character.isLetter('倩'));		// CJK character
	return UnitTest.passed;
};
CharTests.prototype.testIsIdeographHan = function(){
	UnitTest.require(Globalization.Character.isLetter('地'));		// Chinese family name
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterHanCompatibility = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0xF90A)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterHanExtendedA = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x340A)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterHiragana = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x304A)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterKatakana = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x30B0)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterHalfwidthKatakana = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0xFF90)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterKatakanaExtended = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x31F8)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterBopomofo = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x3110)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterBopomofoExtended = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x31A8)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterHangul = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x3138)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterHalfwidthHangul = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0xFFA8)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterHangulSyllables = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0xACFF)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterYi = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0xA200)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterJamo = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0x1180)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterJamoExtendedA = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0xA968)));
	return UnitTest.passed;
};
CharTests.prototype.testIsLetterJamoExtendedB = function(){
	UnitTest.require(Globalization.Character.isLetter(String.fromCharCode(0xD7C0)));
	return UnitTest.passed;
};

CharTests.prototype.testIsLetterEmpty = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(''));
	return UnitTest.passed;
};

CharTests.prototype.testIsLetterUndefined = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter(undefined));
	return UnitTest.passed;
};

CharTests.prototype.testIsLetterIgnoreAnythingButFirstChar = function(){
	UnitTest.requireFalse(Globalization.Character.isLetter('-abc'));
	UnitTest.require(Globalization.Character.isLetter('a- ^'));
	return UnitTest.passed;
};
