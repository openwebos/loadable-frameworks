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

/*jslint devel: true, onevar: false, undef: true, eqeqeq: true, bitwise: true, 
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */

/*global describe, enyo, expect, it, Utils */

describe("Utils.strip", function () {
	it("should remove beginning and ending whitespace", function () {
		var str = "text and more text";
		var ws = "   ";
		var wsset = "\\s";

		expect(Utils.strip(str)).toEqual(str);
		expect(Utils.strip(ws + str)).toEqual(str);
		expect(Utils.strip(str + ws)).toEqual(str);
		expect(Utils.strip(ws + str + ws)).toEqual(str);

		expect(Utils.strip(str, wsset), str);
		expect(Utils.strip(ws + str, wsset), str);
		expect(Utils.strip(str + ws, wsset), str);
		expect(Utils.strip(ws + str + ws, wsset), str);
	});

	it("should remove beginning whitespace", function () {
		var str = "text and more text";
		var ws = "   ";
		var wsset = "\\s";

		expect(Utils.lstrip(str)).toEqual(str);
		expect(Utils.lstrip(ws + str)).toEqual(str);
		expect(Utils.lstrip(str + ws)).toEqual(str + ws);
		expect(Utils.lstrip(ws + str + ws)).toEqual(str + ws);

		expect(Utils.lstrip(str, wsset), str);
		expect(Utils.lstrip(ws + str, wsset), str);
		expect(Utils.lstrip(str + ws, wsset), str + ws);
		expect(Utils.lstrip(ws + str + ws, wsset), str + ws);
	});

	it("should remove ending whitespace", function () {
		var str = "text and more text";
		var ws = "   ";
		var wsset = "\\s";

		expect(Utils.rstrip(str)).toEqual(str);
		expect(Utils.rstrip(ws + str)).toEqual(ws + str);
		expect(Utils.rstrip(str + ws)).toEqual(str);
		expect(Utils.rstrip(ws + str + ws)).toEqual(ws + str);

		expect(Utils.rstrip(str, wsset)).toEqual(str);
		expect(Utils.rstrip(ws + str, wsset)).toEqual(ws + str);
		expect(Utils.rstrip(str + ws, wsset)).toEqual(str);
		expect(Utils.rstrip(ws + str + ws, wsset)).toEqual(ws + str);
	});

	it("should remove characters '1', '2', or '3' from beginning and end", function() {
		var str = "text and more text";
		var charset = "123";
		var chars = "321";

		expect(Utils.strip(str, charset)).toEqual(str);
		expect(Utils.strip(chars + str, charset)).toEqual(str);
		expect(Utils.strip(str + chars, charset)).toEqual(str);
		expect(Utils.strip(chars + str + chars, charset)).toEqual(str);
	});

	it("should remove characters '1', '2', or '3' from beginning", function() {
		var str = "text and more text";
		var charset = "123";
		var chars = "321";

		expect(Utils.lstrip(str, charset)).toEqual(str);
		expect(Utils.lstrip(chars + str, charset)).toEqual(str);
		expect(Utils.lstrip(str + chars, charset)).toEqual(str + chars);
		expect(Utils.lstrip(chars + str + chars, charset)).toEqual(str + chars);
	});

	it("should remove characters '1', '2', or '3' from end", function() {
		var str = "text and more text";
		var charset = "123";
		var chars = "321";

		expect(Utils.rstrip(str, charset)).toEqual(str);
		expect(Utils.rstrip(chars + str, charset)).toEqual(chars + str);
		expect(Utils.rstrip(str + chars, charset)).toEqual(str);
		expect(Utils.rstrip(chars + str + chars, charset)).toEqual(chars + str);
	});

	// =========

	it("should remove characters '1', '2', or '3' and whitespace from beginning and end", function() {
		var str = "text and more text";
		var charset = "123\\s";
		var chars = "32 1";

		expect(Utils.strip(str, charset)).toEqual(str);
		expect(Utils.strip(chars + str, charset)).toEqual(str);
		expect(Utils.strip(str + chars, charset)).toEqual(str);
		expect(Utils.strip(chars + str + chars, charset)).toEqual(str);
	});

	it("should remove characters '1', '2', or '3' and whitespace from beginning", function() {
		var str = "text and more text";
		var charset = "123\\s";
		var chars = "32 1";

		expect(Utils.lstrip(str, charset)).toEqual(str);
		expect(Utils.lstrip(chars + str, charset)).toEqual(str);
		expect(Utils.lstrip(str + chars, charset)).toEqual(str + chars);
		expect(Utils.lstrip(chars + str + chars, charset)).toEqual(str + chars);
	});

	it("should remove characters '1', '2', or '3' and whitespace from end", function() {
		var str = "text and more text";
		var charset = "123\\s";
		var chars = "32 1";

		expect(Utils.rstrip(str, charset)).toEqual(str);
		expect(Utils.rstrip(chars + str, charset)).toEqual(chars + str);
		expect(Utils.rstrip(str + chars, charset)).toEqual(str);
		expect(Utils.rstrip(chars + str + chars, charset)).toEqual(chars + str);
	});
});

describe("Utils tests that require MojoLoader", function () {
describe("Utils.dateFromIso8601", function () {
	it("should convert a date to and from ISO-8601 format", function () {
		var date = new Date(),
			iso8601FromDate = Utils.dateToIso8601(date),
			dateFromIso8601 = Utils.dateFromIso8601(iso8601FromDate);

		console.log("testIso8601RoundTrip(): parsed date: " + iso8601FromDate);
		console.log("testIso8601RoundTrip(): unparsed date: " + Utils.dateToIso8601(dateFromIso8601));

		expect(date.getTime()).toEqual(dateFromIso8601.getTime());
	});

	it("should parse date-only ISO-8601 strings", function () {
		var parsedDate1 = Utils.dateFromIso8601("20101121"),
			parsedDate2 = Utils.dateFromIso8601("2010-11-21"),
			date = new Date(2010, 10, 21);

		expect(date.getTime()).toEqual(parsedDate1.getTime());
		expect(date.getTime()).toEqual(parsedDate2.getTime());
	});

	it("should parse date and time ISO-8601 strings", function () {
		var parsedDate1 = Utils.dateFromIso8601("20101121T235812.089-0700"),
			parsedDate2 = Utils.dateFromIso8601("2010-11-21T23:58:12.089-0700"),
			date = new Date(2010, 10, 21, 23, 58, 12, 89);

		expect(date.getTime()).toEqual(parsedDate1.getTime());
		expect(date.getTime()).toEqual(parsedDate2.getTime());
	});

	it("should parse UTC date and time ISO-8601 strings", function () {
		var parsedDate1 = Utils.dateFromIso8601("20101121T235812.089Z"),
			parsedDate2 = Utils.dateFromIso8601("2010-11-21T23:58:12.089Z"),
			date = new Date();

		date.setUTCFullYear(2010);
		date.setUTCMonth(10);
		date.setUTCDate(21);
		date.setUTCHours(23);
		date.setUTCMinutes(58);
		date.setUTCSeconds(12);
		date.setUTCMilliseconds(89);

		expect(date.getTime()).toEqual(parsedDate1.getTime());
		expect(date.getTime()).toEqual(parsedDate2.getTime());
	});
});

describe("Utils.parseIso8601Duration", function () {
	var dataParseIso8601Duration = [
		{
			duration: "P3Y6M4DT12H30M5S",
			model: {
				years: 3,
				months: 6,
				days: 4,
				hours: 12,
				minutes: 30,
				seconds: 5
			}
		},
		{
			duration: "P23DT23H",
			model: {
				days: 23,
				hours: 23
			}
		},
		{
			duration: "P4Y",
			model: {
				years: 4
			}
		},
		{
			duration: "P1M",
			model: {
				months: 1
			}
		},
		{
			duration: "PT1M",
			model: {
				minutes: 1
			}
		},
		{
			duration: "PT36H",
			model: {
				hours: 36
			}
		},
		{
			duration: "P1DT12H",
			model: {
				days: 1,
				hours: 12
			}
		},
		{
			duration: "-P1D",
			model: {
				days: 1,
				sign: '-'
			}
		}
	];

	function validateDurationResult(model, result) {
		return (
			model.sign === result.sign &&
			model.years === result.years &&
			model.months === result.months &&
			model.days === result.days &&
			model.hours === result.hours &&
			model.minutes === result.minutes &&
			model.seconds === result.seconds &&
			model.weeks === result.weeks
		);
	}

	function doTestParseIso8601Duration(datum, index) {
		var result = Utils.parseIso8601Duration(datum.duration);

		// console.log("parseIso8601Duration" + index + ": model: " + stringify(datum.model));
		// console.log("parseIso8601Duration" + index + ": result: " + stringify(result));

		expect(validateDurationResult(datum.model, result)).toBeTruthy();
	}
	
	it("should parse ISO-8601 duration", function () {
		dataParseIso8601Duration.forEach(function (datum, index) {
			doTestParseIso8601Duration(datum, index);
		});
	});
});
});