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

/*global _, beforeEach, describe, expect, Future, it, IO, JSON, ObjectUtils, stringify */

// TODO: add tests for BYXXX rule fields
// TODO: add negative/error condition tests

describe("VCal2EventTests", function () {
	it("should know that one equals one", function() {
	  expect(1).toEqual(1);
	});
});


describe("vCalendar to event conversion tests", function () {
	beforeEach(function () {
		this.addMatchers({
			toBeEquivalent: function (expected) {
				/*jslint eqeqeq: false */
				var result = this.actual == expected;
				/*jslint eqeqeq: true */
				return result;
			}
		});
	});

var VCal2EventTestsUtils = {};
function doOneTest(event, conditions) {
	var i,
		testName;

	for (i = 0; i < conditions.length; ++i) {
		// console.log("-->> Testing: " + conditions[i].name);
		// console.log("--->>> rrule: " + stringify(event.rrule));
		// console.log("--->>> cond:  " + stringify(conditions[i].value));
		if (conditions[i].test) {
			conditions[i].test(event);
		} else {
			testName = conditions[i].name + 'Test';
			VCal2EventTestsUtils[testName](event, conditions[i].value);
		}
	}
}

function doTest(reportResults, rrule) {
	// console.log("\n\n---->>>> conditions: " + stringify(conditions));
	// console.log("           rrule: " + stringify(rrule) + "\n\n");

	var vcal = rrule,
		events = IO.parseVCalendarToEvent(vcal, {includeUnknownFields: true}),
		conditionSet = Array.prototype.slice.apply(arguments, [2]),
		i;

	// console.log("Events: " + stringify(events));
	// console.log("Condition set: " + stringify(conditionSet));
	expect(events.length).toEqual(conditionSet.length);

	// console.log("\n--->>> Converted event: \n" + stringify(event));
	for (i = 0; i < conditionSet.length; ++i) {
		doOneTest(events[i], conditionSet[i]);
	}
}

function doNegativeTest(reportResults, vcal, expectedError) {
	try {
		IO.parseVCalendarToEvent(vcal);
	} catch (e) {
		expect(e.message).toEqual(expectedError);
	}
}

function lookupField(obj, fieldPath) {
	fieldPath = fieldPath.split('.');
	for (var i = 0; i < fieldPath.length; ++i) {
		obj = obj[fieldPath[i]];
	}
	return obj;
}

function identicalTest(field, result, value) {
	expect(lookupField(result, field)).toEqual(value);
}

VCal2EventTestsUtils.freqTest = _.curry(identicalTest, 'rrule.freq');
VCal2EventTestsUtils.wkstTest = _.curry(identicalTest, 'rrule.wkst');

VCal2EventTestsUtils.dateTimeTest = function(field, result, value) {
	// console.log("Result: " + stringify(result));
	expect(lookupField(result, field)/*.time*/).toEqual(value.time);
	// expect(lookupField(result, field).tzId).toEqual(value.tzId);
};

VCal2EventTestsUtils.dtstartTest = _.curry(VCal2EventTestsUtils.dateTimeTest, 'dtstart');
VCal2EventTestsUtils.dtendTest = _.curry(VCal2EventTestsUtils.dateTimeTest, 'dtend');

function equalTest(field, result, value) {
	expect(lookupField(result, field)).toBeEquivalent(value);
}

VCal2EventTestsUtils.countTest = _.curry(equalTest, 'rrule.count');
VCal2EventTestsUtils.intervalTest = _.curry(equalTest, 'rrule.interval');
VCal2EventTestsUtils.untilTest = _.curry(equalTest, 'rrule.until');

VCal2EventTestsUtils.subjectTest = _.curry(equalTest, 'subject');
VCal2EventTestsUtils.locationTest = _.curry(equalTest, 'location');
VCal2EventTestsUtils.noteTest = _.curry(equalTest, 'note');

VCal2EventTestsUtils.arrayTest = function(test, field, result, value) {
	// console.log("arrayTest: result: " + stringify(result));
	// console.log("arrayTest: field: " + stringify(field));
	// console.log("arrayTest: value: " + stringify(value));
	expect(lookupField(result, field)).toBeDefined();
	expect(lookupField(result, field).length).toEqual(value.length);
	for (var i = 0; i < value.length; ++i) {
		test(lookupField(result, field)[i], value[i]);
	}
};

VCal2EventTestsUtils.ordDayTest = function(result, value) {
	// console.log("ordDayTest: result: " + stringify(result));
	// console.log("ordDayTest: value: " + stringify(value));
	expect(result.length).toEqual(value.length);
	for (var i = 0; i < value.length; ++i) {
		expect(result[i].ord).toBeEquivalent(value[i].ord);
		expect(result[i].day).toBeEquivalent(value[i].day);
	}
};

VCal2EventTestsUtils.exdatesTest = _.curry(VCal2EventTestsUtils.arrayTest, function(a, b) {expect(a).toEqual(b);}, 'rrule.exdates');

['byday', 'bymonthday', 'byyearday', 'byweekno', 'bymonth', 'bysetpos'].forEach(
function (name) {
	VCal2EventTestsUtils[name+"Test"] = 
		VCal2EventTestsUtils.ordDayTest;
});

VCal2EventTestsUtils.rulesDetect = function(values, valueName) {
	var i,
		result;
	for (i = 0; i < values.length; ++i) {
		if (values[i].ruleType.toLowerCase() === valueName) {
			result = values[i];
			break;
		}
	}
	return result;
};

VCal2EventTestsUtils.rulesTest = function(result, conditions) {
	var i,
		name,
		value;

	// console.log("\n\n--->>> parser.result: " + stringify(result));
	expect(result.rrule).toBeDefined();
	result = result.rrule;
	for (i = 0; i < conditions.length; ++i) {
		name = conditions[i].name;
		// console.log("-->> Testing: " + name);
		value = VCal2EventTestsUtils.rulesDetect(result.rules, name);
		expect(value).toBeDefined();
		name += 'Test';
		this[name](value.ruleValue, conditions[i].value);
	}
};

/*
 *	Condition builders
 */

var makeCondition = function(name, value, test) {
	return {
		name: name,
		value: value,
		test: test
	};
};

[
	'freq', 
	'interval', 
	'count', 
	'wkst', 
	'byday', 
	'bymonthday', 
	'byyearday', 
	'byweekno', 
	'bymonth',
	'bysetpos',
	'subject',
	'location',
	'note'
].forEach(function(name) {
	VCal2EventTestsUtils[name] = _.curry(makeCondition, name);
});

VCal2EventTestsUtils.dateTime = function(params, test) {
	params = params || {};
	params.field = params.field || "dtstart";
	params.tzId = !params.noTZ && (params.tzId || "America/New_York");
	params.date = (params.date || new Date(1997, 8, 2, 9, 0, 0)).getTime();

	return makeCondition(params.field, {
			time: params.date,
			tzId: params.tzId
		}, 
		test || _.bind(VCal2EventTestsUtils.dateTimeTest, this, params.field)
	);
};

VCal2EventTestsUtils.dtstart = function(params) {
	params = params || {};
	params.field = "dtstart";
	return VCal2EventTestsUtils.dateTime(params, _.bind(VCal2EventTestsUtils.dtstartTest, this));
};

VCal2EventTestsUtils.dtend = function(params) {
	params = params || {};
	params.field = "dtend";
	return VCal2EventTestsUtils.dateTime(params, VCal2EventTestsUtils.dtendTest);
};

VCal2EventTestsUtils.until = function(until) {
	return {
		name: "until",
		value: until.getTime()
	};
};

VCal2EventTestsUtils.exdates = function(exdates) {
	for (var i = 0; i < exdates.length; ++i) {
		exdates[i] = exdates[i].getTime();
	}
	return makeCondition('exdates', exdates);
};

VCal2EventTestsUtils.rules = function(rules) {
	return {
		name: "rules",
		value: rules
	};
};

VCal2EventTestsUtils.deepObjectCompare = function(event1, event2, path) {
	var item1,
		item2,
		key;

	/*jslint forin: true */
	for (key in event1) {
		item1 = event1[key];
		item2 = event2[key];

		expect(typeof item1).toEqual(typeof item2);
		switch (ObjectUtils.type(item1)) {
			case "object":
			case "array":
				VCal2EventTestsUtils.deepObjectCompare(item1, item2, path ? path + '.' + key : key);
				break;
			default:
				expect(item1).toEqual(item2);
				break;
		}
	}
	/*jslint forin: false */
};

[
'byday', 
'bymonthday', 
'byyearday', 
'byweekno', 
'bymonth',
'bysetpos',
'byhour',
'byminute'
].forEach(function (name) {
	VCal2EventTestsUtils["make_" + name] = function (values) {
		return {
			ruleType: name.toUpperCase(),
			ruleValue: values
		};
	};
});

VCal2EventTestsUtils.doDeepTest = function(recordResults, vcal, testEvents) {
	vcal = IO.parseVCalendarToEvent(vcal, {includeUnknownFields: true});
	// console.log("vCal: " + stringify(vcal));
	// console.log("testEvents: " + stringify(testEvents));
	VCal2EventTestsUtils.deepObjectCompare(testEvents, vcal);
};


//
//	TESTS
//

it("should test1", function (recordResults) {
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970105T083000\r\nRRULE:FREQ=YEARLY;INTERVAL=2;BYMONTH=1;BYDAY=SU;BYHOUR=8,9;BYMINUTE=30\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonth([{ord:1}]),
			VCal2EventTestsUtils.byday([{day:0}])
		])
		// TODO: TEST: BYXXX fields
	]);
});

it("should test2", function(recordResults) {
	// Daily for 10 occurences
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=DAILY;COUNT=10\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("DAILY"),
		VCal2EventTestsUtils.count(10)
	]);
});

it("should test3", function(recordResults) {
	// Daily until December 24, 1997:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=DAILY;UNTIL=19971224T000000Z\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("DAILY"),
		VCal2EventTestsUtils.until(new Date(1997, 11, 24, 0, 0, 0))
	]);
});

it("should test4", function(recordResults) {
	// Every other day - forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=DAILY;INTERVAL=2\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("DAILY"),
		VCal2EventTestsUtils.interval(2)
	]);
});

it("should test5", function(recordResults) {
	// Every 10 days, 5 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=DAILY;INTERVAL=10;COUNT=5\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("DAILY"),
		VCal2EventTestsUtils.interval(10),
		VCal2EventTestsUtils.count(5)
	]);
});

it("should test6", function(recordResults) {
	// Every day in January, for 3 years:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19980101T090000\r\nRRULE:FREQ=YEARLY;UNTIL=20000131T140000Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1998, 0, 1, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.until(new Date(2000, 0, 31, 14, 0, 0)),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 0},{day: 1},{day: 2},{day: 3},{day: 4},{day: 5},{day: 6}]),
			VCal2EventTestsUtils.bymonth([{ord:1}])
		])
	]);
});

it("should test7", function(recordResults) {
	// Every day in January, for 3 years:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19980101T090000\r\nRRULE:FREQ=DAILY;UNTIL=20000131T140000Z;BYMONTH=1\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1998, 0, 1, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("DAILY"),
		VCal2EventTestsUtils.until(new Date(2000, 0, 31, 14, 0, 0)),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonth([{ord:1}])
		])
	]);
});

it("should test8", function(recordResults) {
	// Weekly for 10 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=WEEKLY;COUNT=10\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.count(10)
	]);
});

it("should test9", function(recordResults) {
	// Weekly until December 24, 1997:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=WEEKLY;UNTIL=19971224T000000Z\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.until(new Date(1997, 11, 24, 0, 0, 0))
	]);
});

it("should test10", function(recordResults) {
	// Every other week - forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=WEEKLY;INTERVAL=2;WKST=SU\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should test11", function(recordResults) {
	// Weekly on Tuesday and Thursday for five weeks:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=WEEKLY;UNTIL=19971007T000000Z;WKST=SU;BYDAY=TU,TH\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.until(new Date(1997, 9, 7, 0, 0, 0)),
		VCal2EventTestsUtils.wkst(0),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 2},{day: 4}])
		])
	]);
});

it("should test12", function(recordResults) {
	// Weekly on Tuesday and Thursday for five weeks:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=WEEKLY;COUNT=10;WKST=SU;BYDAY=TU,TH\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.wkst(0),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 2},{day: 4}])
		])
	]);
});

it("should test13", function(recordResults) {
	// Every other week on Monday, Wednesday, and Friday until December
	// 24, 1997, starting on Monday, September 1, 1997:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970901T090000\r\nRRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=19971224T000000Z;WKST=SU;BYDAY=MO,WE,FR\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 1, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.until(new Date(1997, 11, 24, 0, 0, 0)),
		VCal2EventTestsUtils.wkst(0),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 1},{day: 3},{day: 5}])
		])
	]);
});

it("should test14", function(recordResults) {
	// Every other week on Tuesday and Thursday, for 8 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=8;WKST=SU;BYDAY=TU,TH\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.count(8),
		VCal2EventTestsUtils.wkst(0),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 2},{day: 4}])
		])
	]);
});

it("should test15", function(recordResults) {
	// Monthly on the first Friday for 10 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970905T090000\r\nRRULE:FREQ=MONTHLY;COUNT=10;BYDAY=1FR\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 5, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord: 1, day: 5}])
		])
	]);
});

it("should test16", function(recordResults) {
	// Monthly on the first Friday until December 24, 1997:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970905T090000\r\nRRULE:FREQ=MONTHLY;UNTIL=19971224T000000Z;BYDAY=1FR\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 5, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.until(new Date(1997, 11, 24, 0, 0, 0)),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord: 1, day: 5}])
		])
	]);
});

it("should test17", function(recordResults) {
	// Every other month on the first and last Sunday of the month for 10
	// occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970907T090000\r\nRRULE:FREQ=MONTHLY;INTERVAL=2;COUNT=10;BYDAY=1SU,-1SU\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 7, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord: 1, day: 0}, {ord: -1, day: 0}])
		])
	]);
});

it("should test18", function(recordResults) {
	// Monthly on the second-to-last Monday of the month for 6 months:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970922T090000\r\nRRULE:FREQ=MONTHLY;COUNT=6;BYDAY=-2MO\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 22, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.count(6),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord: -2, day: 1}])
		])
	]);
});

it("should test19", function(recordResults) {
	// Monthly on the third-to-the-last day of the month, forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970928T090000\r\nRRULE:FREQ=MONTHLY;BYMONTHDAY=-3\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 28, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord: -3}])
		])
	]);
});

it("should test20", function(recordResults) {
	// Monthly on the 2nd and 15th of the month for 10 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=MONTHLY;COUNT=10;BYMONTHDAY=2,15\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord:2},{ord:15}])
		])
	]);
});

it("should test21", function(recordResults) {
	// Monthly on the first and last day of the month for 10 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970930T090000\r\nRRULE:FREQ=MONTHLY;COUNT=10;BYMONTHDAY=1,-1\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 30, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord:1},{ord:-1}])
		])
	]);
});

it("should test22", function(recordResults) {
	// Every 18 months on the 10th thru 15th of the month for 10
	// occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970910T090000\r\nRRULE:FREQ=MONTHLY;INTERVAL=18;COUNT=10;BYMONTHDAY=10,11,12,13,14,15\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 10, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(18),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord:10},{ord:11},{ord:12},{ord:13},{ord:14},{ord:15}])
		])
	]);
});

it("should test23", function(recordResults) {
	// Every Tuesday, every other month:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=TU\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 2}])
		])
	]);
});

it("should test24", function(recordResults) {
	// Yearly in June and July for 10 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970610T090000\r\nRRULE:FREQ=YEARLY;COUNT=10;BYMONTH=6,7\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 5, 10, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonth([{ord:6},{ord:7}])
		])
	]);
});

it("should test25", function(recordResults) {
	// Every other year on January, February, and March for 10
	// occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970310T090000\r\nRRULE:FREQ=YEARLY;INTERVAL=2;COUNT=10;BYMONTH=1,2,3\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 2, 10, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonth([{ord:1},{ord:2},{ord:3}])
		])
	]);
});

it("should test26", function(recordResults) {
	// Every third year on the 1st, 100th, and 200th day for 10
	// occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970101T090000\r\nRRULE:FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 0, 1, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.interval(3),
		VCal2EventTestsUtils.count(10),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byyearday([{ord:1},{ord:100},{ord:200}])
		])
	]);
});

it("should test27", function(recordResults) {
	// Every 20th Monday of the year, forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970519T090000\r\nRRULE:FREQ=YEARLY;BYDAY=20MO\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 4, 19, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord: 20, day: 1}])
		])
	]);
});

it("should test28", function(recordResults) {
	// Monday of week number 20 (where the default start of the week is
	// Monday), forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970512T090000\r\nRRULE:FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 4, 12, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 1}]),
			VCal2EventTestsUtils.byweekno([{ord:20}])
		])
	]);	
});

it("should test29", function(recordResults) {
	// Every Thursday in March, forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970313T090000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=TH\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 2, 13, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 4}]),
			VCal2EventTestsUtils.bymonth([{ord:3}])
		])
	]);
});

it("should test30", function(recordResults) {
	// Every Thursday, but only during June, July, and August, forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970605T090000\r\nRRULE:FREQ=YEARLY;BYDAY=TH;BYMONTH=6,7,8\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 5, 5, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 4}]),
			VCal2EventTestsUtils.bymonth([{ord:6},{ord:7},{ord:8}])
		])
	]);
});

it("should test31", function(recordResults) {
	// Every Friday the 13th, forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nEXDATE;TZID=America/New_York:19970902T090000,19970904\r\nRRULE:FREQ=MONTHLY;BYDAY=FR;BYMONTHDAY=13\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("MONTHLY"),
		// VCal2EventTestsUtils.exdates([new Date(1997, 8, 2, 9, 0, 0), new Date(1997, 8, 4)]),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 5}]),
			VCal2EventTestsUtils.bymonthday([{ord:13}])
		])
	]);
});

it("should test32", function(recordResults) {
	// The first Saturday that follows the first Sunday of the month,
	// forever:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970913T090000\r\nRRULE:FREQ=MONTHLY;BYDAY=SA;BYMONTHDAY=7,8,9,10,11,12,13\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 13, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 6}]),
			VCal2EventTestsUtils.bymonthday([{ord:7},{ord:8},{ord:9},{ord:10},{ord:11},{ord:12},{ord:13}])
		])
	]);
});

it("should test33", function(recordResults) {
	// Every 4 years, the first Tuesday after a Monday in November,
	// forever (U.S. Presidential Election day):
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19961105T090000\r\nRRULE:FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1996, 10, 5, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.interval(4),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonth([{ord:11}]),
			VCal2EventTestsUtils.byday([{day: 2}]),
			VCal2EventTestsUtils.bymonthday([{ord:2},{ord:3},{ord:4},{ord:5},{ord:6},{ord:7},{ord:8}])
		])
	]);
});

it("should test34", function(recordResults) {
	// The third instance into the month of one of Tuesday, Wednesday, or
	// Thursday, for the next 3 months:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970904T090000\r\nRRULE:FREQ=MONTHLY;COUNT=3;BYDAY=TU,WE,TH;BYSETPOS=3\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 4, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.count(3),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day: 2},{day: 3},{day: 4}]),
			VCal2EventTestsUtils.bysetpos([{ord:3}])
		])
	]);
});

it("should test35", function(recordResults) {
	// The second-to-last weekday of the month:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970929T090000\r\nRRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 8, 29, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:1},{day:2},{day:3},{day:4},{day:5}]),
			VCal2EventTestsUtils.bysetpos([{ord:-2}])
		])
	]);
});

it("should test36", function(recordResults) {
	// Every 3 hours from 9:00 AM to 5:00 PM on a specific day:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=HOURLY;INTERVAL=3;UNTIL=19970902T170000Z\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("HOURLY"),
		VCal2EventTestsUtils.interval(3),
		VCal2EventTestsUtils.until(new Date(1997, 8, 2, 17, 0, 0))
	]);
});

it("should test37", function(recordResults) {
	// Every 15 minutes for 6 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=MINUTELY;INTERVAL=15;COUNT=6\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("MINUTELY"),
		VCal2EventTestsUtils.interval(15),
		VCal2EventTestsUtils.count(6)
	]);
});

it("should test38", function(recordResults) {
	// Every hour and a half for 4 occurrences:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=MINUTELY;INTERVAL=90;COUNT=4\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("MINUTELY"),
		VCal2EventTestsUtils.interval(90),
		VCal2EventTestsUtils.count(4)
	]);
});

it("should test39", function(recordResults) {
	// Every 20 minutes from 9:00 AM to 4:40 PM every day:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=DAILY;BYHOUR=9,10,11,12,13,14,15,16;BYMINUTE=0,20,40\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("DAILY")
		// TODO: TEST: BYXXX fields
	]);
});

it("should test40", function(recordResults) {
	// Every 20 minutes from 9:00 AM to 4:40 PM every day:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970902T090000\r\nRRULE:FREQ=MINUTELY;INTERVAL=20;BYHOUR=9,10,11,12,13,14,15,16\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime(),
		VCal2EventTestsUtils.freq("MINUTELY"),
		VCal2EventTestsUtils.interval(20)
		// TODO: TEST: BYXXX fields
	]);
});

it("should test41", function(recordResults) {
	// An example where the days generated makes a difference because of
	// WKST:
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970805T090000\r\nRRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 7, 5, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.count(4),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:2},{day:0}])
		]),
		VCal2EventTestsUtils.wkst(1)
	]);
});

it("should test42", function(recordResults) {
	// changing only WKST from MO to SU, yields different results...
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970805T090000\r\nRRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=SU\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(1997, 7, 5, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(2),
		VCal2EventTestsUtils.count(4),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:2},{day:0}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should test43", function(recordResults) {
	// An example where an invalid date (i.e., February 30) is ignored.
	doTest(recordResults, "BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:20070115T090000\r\nRRULE:FREQ=MONTHLY;BYMONTHDAY=15,30;COUNT=5\r\nEND:VEVENT\r\n", [
		// VCal2EventTestsUtils.dateTime({date: new Date(2007, 0, 15, 9, 0, 0)}),
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord:15},{ord:30}])
		]),
		VCal2EventTestsUtils.count(5)
	]);
});

//
// Examples from the Calendar DB schema wiki page
//

it("should testSchemaEx1", function(recordResults) {
	// Monthly on the fourth weekday of the month
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=4;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([
				{day:1},
				{day:2},
				{day:3},
				{day:4},
				{day:5}
			]),
			VCal2EventTestsUtils.bysetpos([{ord:4}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx2", function(recordResults) {
	// Monthly on the fourth weekend day of the month
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=SU,SA;BYSETPOS=4;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:0},{day:6}]),
			VCal2EventTestsUtils.bysetpos([{ord:4}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx3a", function(recordResults) {
	// Monthly on the fourth Friday of the month, using BYSETPOS
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=FR;BYSETPOS=4;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:5}]),
			VCal2EventTestsUtils.bysetpos([{ord:4}])
		])
	]);
});

it("should testSchemaEx3b", function(recordResults) {
	// Monthly on the fourth Friday of the month, without using BYSETPOS
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=4FR;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord:4,day:5}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx4a", function(recordResults) {
	// Monthly on the last Friday of the month, using BYSETPOS
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=FR;BYSETPOS=-1;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:5}]),
			VCal2EventTestsUtils.bysetpos([{ord:-1}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx4b", function(recordResults) {
	// Monthly on the last Friday of the month, without using BYSETPOS
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=-1FR;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord:-1,day:5}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx5a", function(recordResults) {
	// Yearly on the fourth Friday of March
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=FR;BYMONTH=3;BYSETPOS=4;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:5}]),
			VCal2EventTestsUtils.bymonth([{ord:3}]),
			VCal2EventTestsUtils.bysetpos([{ord:4}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx5b", function(recordResults) {
	// Yearly on the fourth Friday of March
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=4FR;BYMONTH=3;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{ord:4,day:5}]),
			VCal2EventTestsUtils.bymonth([{ord:3}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx6", function(recordResults) {
	// Every day
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=DAILY;INTERVAL=1;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("DAILY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx7", function(recordResults) {
	// Every week on Friday
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=FR;WKST=SU\r\nEND:VEVENT\r\n",[
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:5}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx8", function(recordResults) {
	// Every week on Friday and Saturday
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=FR,SA;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:5},{day:6}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx9", function(recordResults) {
	// Every weekday
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([
				{day:1},
				{day:2},
				{day:3},
				{day:4},
				{day:5}
			])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx10", function(recordResults) {
	// Monthly on the 26th
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=26;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord:26}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx11", function(recordResults) {
	// Yearly on March 26
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=YEARLY;INTERVAL=1;BYMONTHDAY=26;BYMONTH=3;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("YEARLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord:26}]),
			VCal2EventTestsUtils.bymonth([{ord:3}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testSchemaEx12", function(recordResults) {
	// Monthly on the fourth day of the month
	doTest(recordResults, "BEGIN:VEVENT\r\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=4;WKST=SU\r\nEND:VEVENT\r\n", [
		VCal2EventTestsUtils.freq("MONTHLY"),
		VCal2EventTestsUtils.interval(1),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.bymonthday([{ord:4}])
		]),
		VCal2EventTestsUtils.wkst(0)
	]);
});

it("should testYaneekaRecurrence", function(recordResults) {
	VCal2EventTestsUtils.doDeepTest(recordResults, "BEGIN:VEVENT\r\nDTSTART:20091216T190000Z\r\nDTEND:20091216T190000Z\r\nEND:VEVENT\r\n",//RRULE:FREQ=WEEKLY;INTERVAL=4;BYDAY=WE;WKST=MO\r\nEXDATE:20061010T220000\r\nEXDATE:20061011T220000\r\nEXDATE:20061205T210000\r\nEXDATE:20061206T210000\r\nEXDATE:20070102T210000\r\nEXDATE:20070103T210000\r\nEXDATE:20070327T220000\r\nEXDATE:20070328T220000\r\nEXDATE:20070522T220000\r\nEXDATE:20070523T220000\r\n",
	[{
		dtstart: (new Date(2009, 11, 16, 19, 0, 0)).getTime(),
		dtend: (new Date(2009, 11, 16, 19, 0, 0)).getTime()// ,
		// VCal2EventTestsUtils.freq("WEEKLY"),
		// VCal2EventTestsUtils.interval(4),
		// VCal2EventTestsUtils.rules([
		// ]),
	}]);
});

it("should testZuluTimes_NOV_114206", function(recordResults) {
	VCal2EventTestsUtils.doDeepTest(recordResults, "BEGIN:VEVENT\r\nDTSTART:20100830T160000Z\r\nDTEND:20100830T170000Z\r\nEND:VEVENT\r\n",
	[{
		tzId: "UTC",
		dtstart: (new Date(2010, 7, 30, 16, 0, 0)).getTime(),
		dtend: (new Date(2010, 7, 30, 17, 0, 0)).getTime()
	}]);
});

it("should testExdates", function(recordResults) {
	VCal2EventTestsUtils.doDeepTest(recordResults, "BEGIN:VEVENT\r\nEXDATE:20100915T160000Z,20100917T160000Z,20100918T160000Z,20100919T160000Z,20100921T160000Z,20100922T160000Z,20100924T160000Z\r\nEND:VEVENT\r\n",
	[{
		exdates: [
			"20100915T160000Z",
			"20100917T160000Z",
			"20100918T160000Z",
			"20100919T160000Z",
			"20100921T160000Z",
			"20100922T160000Z",
			"20100924T160000Z"
		]
	}]);
});

it("should testAlarms", function (recordResults) {
	VCal2EventTestsUtils.doDeepTest(recordResults, [
		"BEGIN:VCALENDAR",
			"BEGIN:VEVENT",
				"BEGIN:VALARM",
					"ACTION:DISPLAY",
					"TRIGGER:-PT15M",
					"DESCRIPTION:Reminder",
				"END:VALARM",
			"END:VEVENT",
		"END:VCALENDAR\r\n"
		].join("\r\n"),
	[{
		alarm: [
			
		]
	}]);
});

it("should testExceptionsInOnceVCalendar", function(recordResults) {
	VCal2EventTestsUtils.doDeepTest(recordResults, [
		"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:Zimbra-Calendar-Provider",
			"BEGIN:VEVENT",
				"UID:~~HEvQrJTjCGzC22-20100910T134017-palm.com",
				"RRULE:FREQ=DAILY;INTERVAL=1",
				"SUMMARY:A one hour tour",
				"DTSTART;TZID=\"America/Los_Angeles\":20100910T150000",
				"DTEND;TZID=\"America/Los_Angeles\":20100910T160000",
				"STATUS:CONFIRMED",
				"CLASS:PUBLIC",
				"X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY",
				"TRANSP:OPAQUE",
				"X-MICROSOFT-DISALLOW-COUNTER:TRUE",
				"DTSTAMP:19700101T000000Z",
				"FOOBAR:BAZ",
				"SEQUENCE:0",
				"BEGIN:VALARM",
					"ACTION:DISPLAY",
					"TRIGGER:-PT15M",
					"DESCRIPTION:Reminder",
				"END:VALARM",
			"END:VEVENT",
			"BEGIN:VEVENT",
				"UID:~~HEvQrJTjCGzC22-20100910T134017-palm.com",
				"SUMMARY:A one hour tour",
				"DTSTART;TZID=\"America/Los_Angeles\":20100910T160000",
				"DURATION:PT1H",
				"STATUS:CONFIRMED",
				"CLASS:PUBLIC",
				"X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY",
				"TRANSP:OPAQUE",
				"X-MICROSOFT-DISALLOW-COUNTER:TRUE",
				"RECURRENCE-ID:20100910T220000Z",
				"DTSTAMP:20100910T204450Z",
				"SEQUENCE:1",
				"BEGIN:VALARM",
					"ACTION:DISPLAY",
					"TRIGGER:-PT15M",
					"DESCRIPTION:Reminder",
				"END:VALARM",
			"END:VEVENT",
		"END:VCALENDAR\r\n"].join("\r\n"),
	[{
		version: "2.0",
		prodid: "Zimbra-Calendar-Provider",
		uid: "~~HEvQrJTjCGzC22-20100910T134017-palm.com",
		rrule: {
			freq: "DAILY",
			interval: "1"
		},
		subject: "A one hour tour",
		tzId: "America/Los_Angeles",
		dtstart: (new Date(2010, 8, 10, 15)).getTime(),
		dtend: (new Date(2010, 8, 10, 16)).getTime(),
		status: "CONFIRMED",
		classification: "PUBLIC",
		"x-microsoft-cdo-intendedstatus": "BUSY",
		transp: "OPAQUE",
		"x-microsoft-disallow-counter": "TRUE",
		dtstamp: (new Date(1970, 0, 1, 0, 0, 0)).getTime(),
		foobar: "BAZ",
		sequence: "0"
		// "BEGIN:VALARM",
		//	"ACTION:DISPLAY",
		//	"TRIGGER:-PT15M",
		//	"DESCRIPTION:Reminder",
		// "END:VALARM",
	}, {
		version: "2.0",
		prodid: "Zimbra-Calendar-Provider",
		uid: "~~HEvQrJTjCGzC22-20100910T134017-palm.com",
		subject: "A one hour tour",
		tzId: "America/Los_Angeles", 
		dtstart: (new Date(2010, 8, 10, 16)).getTime(),
		dtend: (new Date(2010, 8, 10, 17)).getTime(),
		status: "CONFIRMED",
		classification: "PUBLIC",
		"x-microsoft-cdo-intendedstatus": "BUSY",
		transp: "OPAQUE",
		"x-microsoft-disallow-counter": "TRUE",
		dtstamp: (new Date(2010, 8, 10, 20, 44, 50)).getTime(),
		foobar: "BAZ",
		sequence: "1"
		// "BEGIN:VALARM",
		//	"ACTION:DISPLAY",
		//	"TRIGGER:-PT15M",
		//	"DESCRIPTION:Reminder",
		// "END:VALARM",
	}]);
});

it("should testRruleBydayMixedCase", function(recordResults) {
	doTest(recordResults, [
		"BEGIN:VEVENT",
		"RRULE:FREQ=WEEKLY;BYDAY=Th;UNTIL=20101216",	// Note that "Th" is not the uppercase "TH" one might believe RFC-5545 requires (it is silent on casing)
		"END:VEVENT\r\n"].join('\r\n'),
	[
		VCal2EventTestsUtils.freq("WEEKLY"),
		VCal2EventTestsUtils.rules([
			VCal2EventTestsUtils.byday([{day:4}])
		])
	]);
});

//
//	Negative tests
//

it("should testBadMonthDayRRule", function(recordResults) {
	doNegativeTest(recordResults, 
		"BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970928T090000\r\nRRULE:FREQ=MONTHLY;BYMONTHDAY=32\r\nEND:VEVENT\r\n", 
		"wrong monthday in RRULES BYMONTHDAY, item number 0, 0-based"
	);
});

it("should testBadMonthDayRRule2", function(recordResults) {
	doNegativeTest(recordResults, 
		"BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970928T090000\r\nRRULE:FREQ=MONTHLY;BYMONTHDAY=Z\r\nEND:VEVENT\r\n", 
		"could not parse monthday, item number 0, 0-based"
	);
});

it("should testBadDayRRule", function(recordResults) {
	// "ZX" is not a valid day
	doNegativeTest(recordResults, 
		"BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970105T083000\r\nRRULE:FREQ=YEARLY;INTERVAL=2;BYMONTH=1;BYDAY=ZX;BYHOUR=8,9;BYMINUTE=30\r\nEND:VEVENT\r\n",
		"wrong day in RRULE BYDAY ORDDAY, item number 0, 0-based"
	);
});

it("should testBadDayRRule2", function(recordResults) {
	// "SUN" exceeds the characters in a valid day specifier (only 2 allowed)
	doNegativeTest(recordResults, 
		"BEGIN:VEVENT\r\nDTSTART;TZID=America/New_York:19970105T083000\r\nRRULE:FREQ=YEARLY;INTERVAL=2;BYMONTH=1;BYDAY=SUN;BYHOUR=8,9;BYMINUTE=30\r\nEND:VEVENT\r\n",
		"could not parse day, item number 0, 0-based"
	);
});

it("should testUnEscapeSubject", function(recordResults) {
	doTest(recordResults, [
		"BEGIN:VEVENT",
		"SUMMARY:Text with \\; \\, \\\" \\\\\\\\\\ escaped", // The backslashes should not be escaped in this case as stated in RFC-5545 because
		"END:VEVENT\r\n"].join('\r\n'),						 // because when displayed they must be escaped 
	[
		VCal2EventTestsUtils.subject("Text with ; , \" \\\\\\\\\\ escaped")
	]);
});

it("should testUnEscapeNote", function(recordResults) {
	doTest(recordResults, [
		"BEGIN:VEVENT",
		"DESCRIPTION:Text with \\; \\, \\\" \\\\\\\\\\ escaped", // The backslashes should not be escaped in this case as stated in RFC-5545 because
		"END:VEVENT\r\n"].join('\r\n'),							 // because when displayed they must be escaped
	[
		VCal2EventTestsUtils.note("Text with ; , \" \\\\\\\\\\ escaped")
	]);
});

it("should testUnEscapeLocation", function(recordResults) {
	doTest(recordResults, [
		"BEGIN:VEVENT",
		"LOCATION:Text with \\; \\, \\\" \\\\\\\\\\ escaped", // The backslashes should not be escaped in this case as stated in RFC-5545 because
		"END:VEVENT\r\n"].join('\r\n'),						  // because when displayed they must be escaped
	[
		VCal2EventTestsUtils.location("Text with ; , \" \\\\\\\\\\ escaped")
	]);
});
});
