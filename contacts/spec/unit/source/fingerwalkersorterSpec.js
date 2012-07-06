// LICENSE@@@
//
//      Copyright (c) 2009-2012 Hewlett-Packard Development Company, L.P.
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
// @@@LICENSE

/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true,
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global describe, expect, it, include, Test, JSON, palmGetResource, ContactFactory, ContactType, Future, MojoTest, FingerWalkerSorter, _ */

describe("FingerWalkerSorterTests", function () {

	it("should test sorting", function () {
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
		expect(_.isEqual(result, expectedResult)).toBeTruthy();

		fingerWalkerSorter = new FingerWalkerSorter([
				[1, 2],
				[3, 4],
				[5]
			], compareFunction);
		result = fingerWalkerSorter.sort();
		expectedResult = [1, 2, 3, 4, 5];
		expect(_.isEqual(result, expectedResult)).toBeTruthy();

		fingerWalkerSorter = new FingerWalkerSorter([
				[6, 5, 3],
				[1, 4],
				[2, 4, 9]
			], compareFunction);
		result = fingerWalkerSorter.sort();
		expectedResult = [1, 2, 4, 4, 6, 5, 3, 9];
		expect(_.isEqual(result, expectedResult)).toBeTruthy();

		fingerWalkerSorter = new FingerWalkerSorter([
				[8, 3, 5, 9],
				[3, 10, 2]
			], compareFunction);
		result = fingerWalkerSorter.sort();
		expectedResult = [3, 8, 3, 5, 9, 10, 2];
		expect(_.isEqual(result, expectedResult)).toBeTruthy();
	});
});
