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
/*global describe, expect, it, include, console, ListWidget, Future, require, SortKey */

var utils = require('./utils');

describe("Sort Key Tests", function () {
	var companyLastFirst = {
			listSortOrder: ListWidget.SortOrder.companyLastFirst,
			shouldConvertToPinyin: false
		},
		companyFirstLast = {
			listSortOrder: ListWidget.SortOrder.companyFirstLast,
			shouldConvertToPinyin: false
		},
		firstLast = {
			listSortOrder: ListWidget.SortOrder.firstLast,
			shouldConvertToPinyin: false
		},
		lastFirst = {
			listSortOrder: ListWidget.SortOrder.lastFirst,
			shouldConvertToPinyin: false
		};

	/*
	 * SortKey._generateSortKeyHelper test
	 */
	it("should test generateSortKeyHelperEverythingPresent", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Strictly alphabetical
			 */
			//everything's present
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, "first", "last", "company", "display"), "company\tlast\tfirst");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, "first", "last", "company", "display"), "company\tfirst\tlast");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, "first", "last", "company", "display"), "last\tfirst");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, "first", "last", "company", "display"), "first\tlast");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperMissingFirst", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Strictly alphabetical
			 */
			//missing first
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, undefined, "last", "company", "display"), "company\tlast");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, undefined, "last", "company", "display"), "company\tlast");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, undefined, "last", "company", "display"), "last");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, undefined, "last", "company", "display"), "last");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperMissingLast", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Strictly alphabetical
			 */
			//missing last
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, "first", undefined, "company", "display"), "company\tfirst");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, "first", undefined, "company", "display"), "company\tfirst");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, "first", undefined, "company", "display"), "first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, "first", undefined, "company", "display"), "first");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperMissingCompany", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Strictly alphabetical
			 */
			//missing company
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, "first", "last", undefined, "display"), "\uFAD7\uFAD7\tlast\tfirst");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, "first", "last", undefined, "display"), "\uFAD7\uFAD7\tfirst\tlast");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, "first", "last", undefined, "display"), "last\tfirst");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, "first", "last", undefined, "display"), "first\tlast");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperMissingFirstAndLast", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Strictly alphabetical
			 */
			//missing first and last
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, undefined, undefined, "company", "display"), "company\tdisplay");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, undefined, undefined, "company", "display"), "company\tdisplay");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, undefined, undefined, "company", "display"), "display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, undefined, undefined, "company", "display"), "display");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperMissingFirstLastAndCompany", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Strictly alphabetical
			 */
			//missing first, last, and company
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, undefined, undefined, undefined, "display"), "\uFAD7\uFAD7\tdisplay");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, undefined, undefined, undefined, "display"), "\uFAD7\uFAD7\tdisplay");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, undefined, undefined, undefined, "display"), "display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, undefined, undefined, undefined, "display"), "display");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperNumericalEverything", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Numerical
			 */
			//everything's present
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, "1first", "2last", "3company", "4display"), "\uFAD73company\t2last\t1first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, "1first", "2last", "3company", "4display"), "\uFAD73company\t1first\t2last");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, "1first", "2last", "3company", "4display"), "\uFAD72last\t1first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, "1first", "2last", "3company", "4display"), "\uFAD71first\t2last");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperNumericalMissingFirst", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			//missing first
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, undefined, "2last", "3company", "4display"), "\uFAD73company\t2last");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, undefined, "2last", "3company", "4display"), "\uFAD73company\t2last");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, undefined, "2last", "3company", "4display"), "\uFAD72last");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, undefined, "2last", "3company", "4display"), "\uFAD72last");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperNumericalMissingLast", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			//missing last
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, "1first", undefined, "3company", "4display"), "\uFAD73company\t1first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, "1first", undefined, "3company", "4display"), "\uFAD73company\t1first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, "1first", undefined, "3company", "4display"), "\uFAD71first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, "1first", undefined, "3company", "4display"), "\uFAD71first");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperNumericalMissingCompany", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			//missing company
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, "1first", "2last", undefined, "4display"), "\uFAD7\uFAD7\t2last\t1first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, "1first", "2last", undefined, "4display"), "\uFAD7\uFAD7\t1first\t2last");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, "1first", "2last", undefined, "4display"), "\uFAD72last\t1first");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, "1first", "2last", undefined, "4display"), "\uFAD71first\t2last");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperNumericalMissingFirstAndLast", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Numerical
			 */
			//missing first and last
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, undefined, undefined, "3company", "4display"), "\uFAD73company\t4display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, undefined, undefined, "3company", "4display"), "\uFAD73company\t4display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, undefined, undefined, "3company", "4display"), "\uFAD74display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, undefined, undefined, "3company", "4display"), "\uFAD74display");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperNumericalMissingFirstLastAndCompany", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {
			/*
			 * Numerical
			 */
			//missing first, last, and company
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, undefined, undefined, undefined, "4display"), "\uFAD7\uFAD7\t4display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, undefined, undefined, undefined, "4display"), "\uFAD7\uFAD7\t4display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, undefined, undefined, undefined, "4display"), "\uFAD74display");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, undefined, undefined, undefined, "4display"), "\uFAD74display");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});

	it("should test generateSortKeyHelperNumericalMissingEverything", function (reportResults) {
		var future = new Future();

		/*
		 * First all the synchronous tests.
		 */
		future.now(this, function () {

			/*
			 * Numerical
			 */
			/*
			 * missing everything
			 */
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyLastFirst, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");
			utils.requireIdentical(SortKey._generateSortKeyHelper(companyFirstLast, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");
			utils.requireIdentical(SortKey._generateSortKeyHelper(lastFirst, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");
			utils.requireIdentical(SortKey._generateSortKeyHelper(firstLast, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");

			future.result = true;
		});

		future.then(this, function () {
			var dummy = future.result;

			future.nest(SortKey.generateSortKey({
				name: {
					givenName: "FirstName",
					familyName: "LastName"
				},
				organization: {
					name: "ACompany"
				}
			}, lastFirst));
		});

		future.then(this, function () {
			var sortKey = future.result;

			utils.requireIdentical(sortKey, "lastname\tfirstname");

			return true;
		});

		utils.waitsForFuture(future);
	});
});