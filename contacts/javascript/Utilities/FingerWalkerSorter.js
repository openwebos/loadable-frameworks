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

/* Copyright 2009 Palm, Inc.  All rights reserved. */
/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true,
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global _, FingerWalker, Assert */


/**
 *  arrayOfArrays - each array in this array is a list of values that you want to have sorted
 *                  using the fingerWalkerSort.
 *  compareFunction - function that should expect to get an array of values and return the index
 *                    of the object that it considers the highest.
 */
var FingerWalkerSorter = function (arrayOfArrays, compareFunction) {
	var that = this;

	this.fingerWalkers = [];
	this.compareFunction = compareFunction;

	arrayOfArrays.forEach(function (array) {
		that.fingerWalkers.push(new FingerWalker(array));
	});
};

FingerWalkerSorter.prototype.sort = function () {
	var sortedValues = [],
		objectsToCompare = this._getObjectsToCompare(),
		highestValueIndex;

	while (objectsToCompare.values.length > 0) {

		// Call the compareFunction with an array of values.
		// The compareFunction should return the index of the highest value
		highestValueIndex = this.compareFunction(objectsToCompare.values);

		Assert.require(highestValueIndex > -1 && highestValueIndex < objectsToCompare.values.length, "FingerWalkerSorter - compareFunction returned an index '" + highestValueIndex + "' outside of the bounds of the values it was passed");

		sortedValues.push(objectsToCompare.values[highestValueIndex]);

		objectsToCompare.fingerWalkers[highestValueIndex].usedCurrentValue();

		objectsToCompare = this._getObjectsToCompare();
	}

	return sortedValues;
};

FingerWalkerSorter.prototype._getObjectsToCompare = function () {
	var objectsToCompare = {
		values: [],
		fingerWalkers: []
	};

	this.fingerWalkers.forEach(function (fingerWalker) {
		if (fingerWalker.hasValueLeft()) {
			objectsToCompare.values.push(fingerWalker.getCurrentValue());
			objectsToCompare.fingerWalkers.push(fingerWalker);
		}
	});

	return objectsToCompare;
};