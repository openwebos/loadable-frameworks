/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, include, MojoTest, console, ListWidget, Future, SortKey */

var webos = IMPORTS.require('webos');
webos.include("test/loadall.js");

function SortKeyTests() {
	this.companyLastFirst = {
		listSortOrder: ListWidget.SortOrder.companyLastFirst,
		shouldConvertToPinyin: false
	};
	this.companyFirstLast = {
		listSortOrder: ListWidget.SortOrder.companyFirstLast,
		shouldConvertToPinyin: false
	};
	this.firstLast = {
		listSortOrder: ListWidget.SortOrder.firstLast,
		shouldConvertToPinyin: false
	};
	this.lastFirst = {
		listSortOrder: ListWidget.SortOrder.lastFirst,
		shouldConvertToPinyin: false
	};
}

/*
 * SortKey._generateSortKeyHelper test
 */
SortKeyTests.prototype.testGenerateSortKeyHelperEverythingPresent = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Strictly alphabetical
		 */
		//everything's present
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, "first", "last", "company", "display"), "company\tlast\tfirst");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, "first", "last", "company", "display"), "company\tfirst\tlast");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, "first", "last", "company", "display"), "last\tfirst");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, "first", "last", "company", "display"), "first\tlast");

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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperMissingFirst = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Strictly alphabetical
		 */
		//missing first
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, undefined, "last", "company", "display"), "company\tlast");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, undefined, "last", "company", "display"), "company\tlast");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, undefined, "last", "company", "display"), "last");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, undefined, "last", "company", "display"), "last");

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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperMissingLast = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Strictly alphabetical
		 */
		//missing last
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, "first", undefined, "company", "display"), "company\tfirst");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, "first", undefined, "company", "display"), "company\tfirst");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, "first", undefined, "company", "display"), "first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, "first", undefined, "company", "display"), "first");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperMissingCompany = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Strictly alphabetical
		 */
		//missing company
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, "first", "last", undefined, "display"), "\uFAD7\uFAD7\tlast\tfirst");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, "first", "last", undefined, "display"), "\uFAD7\uFAD7\tfirst\tlast");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, "first", "last", undefined, "display"), "last\tfirst");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, "first", "last", undefined, "display"), "first\tlast");
				
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperMissingFirstAndLast = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Strictly alphabetical
		 */
		//missing first and last
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, undefined, undefined, "company", "display"), "company\tdisplay");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, undefined, undefined, "company", "display"), "company\tdisplay");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, undefined, undefined, "company", "display"), "display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, undefined, undefined, "company", "display"), "display");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperMissingFirstLastAndCompany = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Strictly alphabetical
		 */
		//missing first, last, and company
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, undefined, undefined, undefined, "display"), "\uFAD7\uFAD7\tdisplay");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, undefined, undefined, undefined, "display"), "\uFAD7\uFAD7\tdisplay");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, undefined, undefined, undefined, "display"), "display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, undefined, undefined, undefined, "display"), "display");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperNumericalEverything = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Numerical
		 */
		//everything's present
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, "1first", "2last", "3company", "4display"), "\uFAD73company\t2last\t1first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, "1first", "2last", "3company", "4display"), "\uFAD73company\t1first\t2last");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, "1first", "2last", "3company", "4display"), "\uFAD72last\t1first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, "1first", "2last", "3company", "4display"), "\uFAD71first\t2last");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperNumericalMissingFirst = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		//missing first
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, undefined, "2last", "3company", "4display"), "\uFAD73company\t2last");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, undefined, "2last", "3company", "4display"), "\uFAD73company\t2last");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, undefined, "2last", "3company", "4display"), "\uFAD72last");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, undefined, "2last", "3company", "4display"), "\uFAD72last");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperNumericalMissingLast = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		//missing last
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, "1first", undefined, "3company", "4display"), "\uFAD73company\t1first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, "1first", undefined, "3company", "4display"), "\uFAD73company\t1first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, "1first", undefined, "3company", "4display"), "\uFAD71first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, "1first", undefined, "3company", "4display"), "\uFAD71first");

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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperNumericalMissingCompany = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		//missing company
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, "1first", "2last", undefined, "4display"), "\uFAD7\uFAD7\t2last\t1first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, "1first", "2last", undefined, "4display"), "\uFAD7\uFAD7\t1first\t2last");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, "1first", "2last", undefined, "4display"), "\uFAD72last\t1first");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, "1first", "2last", undefined, "4display"), "\uFAD71first\t2last");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperNumericalMissingFirstAndLast = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Numerical
		 */
		//missing first and last
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, undefined, undefined, "3company", "4display"), "\uFAD73company\t4display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, undefined, undefined, "3company", "4display"), "\uFAD73company\t4display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, undefined, undefined, "3company", "4display"), "\uFAD74display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, undefined, undefined, "3company", "4display"), "\uFAD74display");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperNumericalMissingFirstLastAndCompany = function (reportResults) {
	var future = new Future();
	
	/*
	 * First all the synchronous tests.
	 */
	future.now(this, function () {
		/*
		 * Numerical
		 */
		//missing first, last, and company
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, undefined, undefined, undefined, "4display"), "\uFAD7\uFAD7\t4display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, undefined, undefined, undefined, "4display"), "\uFAD7\uFAD7\t4display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, undefined, undefined, undefined, "4display"), "\uFAD74display");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, undefined, undefined, undefined, "4display"), "\uFAD74display");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};

SortKeyTests.prototype.testGenerateSortKeyHelperNumericalMissingEverything = function (reportResults) {
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
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyLastFirst, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.companyFirstLast, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.lastFirst, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");
		MojoTest.requireIdentical(SortKey._generateSortKeyHelper(this.firstLast, undefined, undefined, undefined, undefined), "\uFAD7\uFAD7");
		
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
		}, this.lastFirst));
	});
	
	future.then(this, function () {
		var sortKey = future.result;

		MojoTest.requireIdentical(sortKey, "lastname\tfirstname");
		
		reportResults(MojoTest.passed);
	});
};
