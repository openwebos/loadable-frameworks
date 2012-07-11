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

/*global console, expect, exports: true, waitsFor */

exports.waitsForFuture = function (future, optionalTimeout) {
	var done = false;
	future.then(function () {
		done = true;
		future.result = future.result;
	});
	waitsFor(function () {
		if (done) {
			// console.log("Waited future done: " + future.status());
			if (future.exception) {
				// console.log("... exception: " + (future.exception.stack || future.exception._stack || future.exception.toString()));
			}
		}
		return done;
	}, optionalTimeout);
};

exports.require = function (condition) {
	expect(condition).toBeTruthy();
};

exports.requireDefined = function (condition) {
	expect(condition !== undefined).toBeTruthy();
};

/**
* Assert.assertError(context, func, args, error[, msg][, params]) -> undefined
* -context(String): "this" value for function call
* -func(String): function to run
* -args(String): array of arguments
* -error(String): expected error
* - msg (String): message to throw
* - params (Object): parameters to fill in in msg template
* throw an error if the function doesn't throw the expected error
**/
exports.requireError = function assertError(context, func, args, error, msg, params) {
	var exception;
	try {
		func.apply(context, args);
	} catch(actual) {
		exception = actual;
	}

	expect(!error || exception == error).toBeTruthy();
};

exports.requireFalse = function (condition) {
	expect(condition).toBeFalsy();
};

exports.requireFunction = function (object) {
	expect(typeof object).toEqual('function');
};

exports.requireIdentical = function (a, b) {
	expect(a).toEqual(b);
};

exports.requireString = function (s) {
	expect(typeof s).toEqual('string');
};
