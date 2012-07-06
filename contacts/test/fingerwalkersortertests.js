/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, include, Test, JSON, ContactFactory, ContactType, Future, MojoTest, FingerWalkerSorter, _ */

var webos = IMPORTS.require('webos');
webos.include("test/loadall.js");

function FingerWalkerSorterTests() {
	
}

FingerWalkerSorterTests.prototype.testSorting = function () {
	var fingerWalkerSorter,
		result,
		expectedResult,
		compareFunction = function (valuesToCompare) {
			var lowestValue = 9999999999999,
				lowsetIndex = -1;
				
			valuesToCompare.forEach(function (value, currentIndex) {
				if (value < lowestValue) {
					lowestValue = value;
					lowsetIndex = currentIndex;
				}
			});
			
			return lowsetIndex;
		};
	
	fingerWalkerSorter = new FingerWalkerSorter([
			[3, 5, 6],
			[1, 4]
		], compareFunction);
	result = fingerWalkerSorter.sort();
	expectedResult = [1, 3, 4, 5, 6];
	MojoTest.require(_.isEqual(result, expectedResult), result + " !== " + expectedResult);
	
	fingerWalkerSorter = new FingerWalkerSorter([
			[1, 2],
			[3, 4],
			[5]
		], compareFunction);
	result = fingerWalkerSorter.sort();
	expectedResult = [1, 2, 3, 4, 5];
	MojoTest.require(_.isEqual(result, expectedResult), result + " !== " + expectedResult);
	
	fingerWalkerSorter = new FingerWalkerSorter([
			[6, 5, 3],
			[1, 4],
			[2, 4, 9]
		], compareFunction);
	result = fingerWalkerSorter.sort();
	expectedResult = [1, 2, 4, 4, 6, 5, 3, 9];
	MojoTest.require(_.isEqual(result, expectedResult), result + " !== " + expectedResult);
	
	fingerWalkerSorter = new FingerWalkerSorter([
			[8, 3, 5, 9],
			[3, 10, 2]
		], compareFunction);
	result = fingerWalkerSorter.sort();
	expectedResult = [3, 8, 3, 5, 9, 10, 2];
	MojoTest.require(_.isEqual(result, expectedResult), result + " !== " + expectedResult);
	
	return MojoTest.passed;
};