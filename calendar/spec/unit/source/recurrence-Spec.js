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
/* Copyright 2009 Palm, Inc.  All rights reserved. */
/**
 * @author lauren
 */

// REVIEWED: Erik Jaesler 2012-01-12

/*global Calendar: false, console, describe, expect, it, require, RRuleManager, xdescribe, xit */
/*jslint laxbreak: true, white: false */

var utils = require('./utils');

var mgr = new RRuleManager();
describe("Recurrence Tests", function () {
	it("should find first day of month", function () {
		//first sunday (first day of month)
		var date = new Date(2009, 10, 1); //November 1, 2009
		expect(mgr.findMonthPosition(date, true)).toEqual(1);
	});

	it("should find middle of month", function () {
		//third wednesday
		var date = new Date(2009, 10, 18); //November 18, 2009
		expect(mgr.findMonthPosition(date, true)).toEqual(3);
	});

	it("should find end of month", function () {
		//last thursday (last day of month)
		var date = new Date(2009, 11, 31); //December 31, 2009
		expect(mgr.findMonthPosition(date, false)).toEqual(-1);
	});

	it("should find negative middle of month", function () {
		//3rd to last tuesday
		var date = new Date(2009, 11, 15); //December 15, 2009
		expect(mgr.findMonthPosition(date, false)).toEqual(-3);
	});

	it("should find negative end of month", function () {
		//Last day of month
		var date = new Date(2009, 11, 31); //December 31, 2009
		expect(mgr.getNegativeDayOfMonth(date)).toEqual(-1);
	});

	it("should find negative first of month", function () {
		//First day of month
		var date = new Date(2009, 11, 1); //December 1, 2009
		expect(mgr.getNegativeDayOfMonth(date)).toEqual(-31);
	});

	it("should find negative middle of month", function () {
		//-15th day
		var date = new Date(2009, 11, 17); //December 17, 2009
		expect(mgr.getNegativeDayOfMonth(date)).toEqual(-15);
	});

	it("should be last week number of year", function () {
		var date = new Date(2009, 11, 28); //December 28, 2009
		expect(mgr.getWeekNumber(date)).toEqual(53);
	});

	it("should be 50th week of year", function () {
		var date = new Date(2009, 11, 8); //December 8, 2009
		expect(mgr.getWeekNumber(date)).toEqual(50);
	});

	it("should be first week of year", function () {
		var date = new Date(2009, 0, 1); //January 1, 2009
		expect(mgr.getWeekNumber(date)).toEqual(1);
	});

	it("should be 3rd week of year", function () {
		var date = new Date(2009, 0, 12); //January 16, 2009
		expect(mgr.getWeekNumber(date)).toEqual(3);
	});

	it("should be negative last week of year", function () {
		//Last week of year
		var date = new Date(2009, 11, 28); //December 28, 2009
		expect(mgr.getNegativeWeekNumber(date)).toEqual(-1);
	});

	it("should be negative 4th week of year", function () {
		var date = new Date(2009, 11, 8); //December 8, 2009
		expect(mgr.getNegativeWeekNumber(date)).toEqual(-4);
	});

	it("should be negative 51st week of year", function () {
		//-51st week
		var date = new Date(2009, 0, 16); //January 16, 2009
		expect(mgr.getNegativeWeekNumber(date)).toEqual(-51);
	});


// End Utils tests
//==================================================================================
//Begin ByXXX sub-rule tests

	it("should match 'by month' rrule", function () {
		var rule = {"ruleType": "BYMONTH", "ruleValue": [{"ord": 2},{"ord": 4},{"ord": 6}]}; //February, April, June
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 3, 15); //April 15, 2009

		mgr.byMonthTest(rule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byMonth);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byMonth);
	});

	it("should not match 'by month' rule", function () {
		var rule = {"ruleType": "BYMONTH", "ruleValue": [{"ord": 2}, {"ord": 4}, {"ord": 6}]}; //February, April, June
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 4, 15);//May 15, 2009

		mgr.byMonthTest(rule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byMonth);
		expect(flags.rulesTrue).toEqual(0);
	});


//--------------------------------------------------------

	it("should match positive 'by month day' rule", function () {
		var positiveRule = {"ruleType": "BYMONTHDAY", "ruleValue": [{"ord": 1}, {"ord": 15}, {"ord": 25}]};   //1st, 15th, 25th
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 3, 25); //April 15, 2009

		mgr.byMonthDayTest(positiveRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byMonthDay);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byMonthDay);
	});

	it("should match positive 'by month day' rule", function () {
		var negativeRule = {"ruleType": "BYMONTHDAY", "ruleValue": [{"ord": -1}, {"ord": -6}, {"ord": -16}]}; //Last, 6th last, 16th last
																		//April 30, April 25, April 15
		var flags = {"rulesPresent": 0, "rulesTrue": 0};
		var date = new Date(2009, 3, 25); //April 15, 2009
		mgr.byMonthDayTest(negativeRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byMonthDay);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byMonthDay);
	});

	it("should not match positive 'by month day' rule", function () {
		var positiveRule = {"ruleType": "BYMONTHDAY", "ruleValue": [{"ord": 1}, {"ord": 15}, {"ord": 25}]};   //1st, 15th, 25th
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 3, 18); //April 18, 2009

		mgr.byMonthDayTest(positiveRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byMonthDay);
		expect(flags.rulesTrue).toEqual(0);
	});

	it("should not match negative 'by month day' rule", function () {
		var negativeRule = {"ruleType": "BYMONTHDAY", "ruleValue": [{"ord": -1}, {"ord": -6}, {"ord": -16}]}; //Last, 6th last, 16th last
																		//April 30, April 25, April 15
		var flags = {"rulesPresent": 0, "rulesTrue": 0};
		var date = new Date(2009, 3, 18); //April 18, 2009
		mgr.byMonthDayTest(negativeRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byMonthDay);
		expect(flags.rulesTrue).toEqual(0);
	});

//--------------------------------------------------------

	it("should match 'by day' rrule", function () {
		var rule = {"ruleType": "BYDAY", "ruleValue": [{"day":1}, {"day":3}, {"day":5}]}; //MO,WE,FR
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 10, 4); //Wednesday, November 4, 2009

		mgr.byDayTest(rule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byDay);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byDay);
	});

	it("should match 'by day' ordinal rrule", function () {
		//1st MO, 2nd WE, 3rd FR
		var rule = {"ruleType": "BYDAY", "ruleValue": [{"day":1, "ord":1}, {"day":3, "ord":2}, {"day":5, "ord":3}]};
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 10, 11); //Wednesday, November 11, 2009

		mgr.byDayTest(rule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byDay);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byDay);
	});

	it("should not match 'by day' rrule", function () {
		var rule = {"ruleType": "BYDAY", "ruleValue": [{"day":1}, {"day":3}, {"day":5}]}; //MO,WE,FR
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 10, 5); //Thursday, November 5, 2009

		mgr.byDayTest(rule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byDay);
		expect(flags.rulesTrue).toEqual(0);
	});

	it("should not match 'by day' ordinal rrule", function () {
		//1st MO, 2nd WE, 3rd FR
		var rule = {"ruleType": "BYDAY", "ruleValue": [{"day":1, "ord":1}, {"day":3, "ord":2}, {"day":5, "ord":3}]};
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 10, 12); //Thursday, November 12, 2009

		mgr.byDayTest(rule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byDay);
		expect(flags.rulesTrue).toEqual(0);
	});

//--------------------------------------------------------

	it("should match positive 'by week number' rrule", function () {
		var positiveRule = {"ruleType": "BYWEEKNO", "ruleValue": [{"ord": 1}, {"ord": 5}, {"ord": 15}]};   //1st, 5th, 15th
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 0, 28);//January 28, 2009

		mgr.byWeekNumberTest(positiveRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byWeekNumber);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byWeekNumber);
	});

	it("should match negative 'by week number' rrule", function () {
		var negativeRule = {"ruleType": "BYWEEKNO", "ruleValue": [{"ord": -1}, {"ord": -5}, {"ord": -49}]}; //Last, 5th last, 49th last
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 0, 28);//January 28, 2009

		mgr.byWeekNumberTest(negativeRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byWeekNumber);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byWeekNumber);
	});

	it("should not match positive 'by week number' rrule", function () {
		var positiveRule = {"ruleType": "BYWEEKNO", "ruleValue": [{"ord": 1}, {"ord": 5}, {"ord": 15}]};   //1st, 5th, 15th
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 1, 23);//February 23, 2009

		mgr.byWeekNumberTest(positiveRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byWeekNumber);
		expect(flags.rulesTrue).toEqual(0);
	});

	it("should not match negative 'by week number rrule", function () {
		var negativeRule = {"ruleType": "BYWEEKNO", "ruleValue": [{"ord": -1}, {"ord": -5}, {"ord": -49}]}; //Last, 5th last, 49th last
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 1, 23);//February 23, 2009

		mgr.byWeekNumberTest(negativeRule, date, flags);
		expect(flags.rulesPresent == (1 << mgr.flagPositions.byWeekNumber), "rulesPresent flag set fail");
		expect(flags.rulesTrue === 0, "rulesTrue flag set fail");
	});

//--------------------------------------------------------

	it("should match positive 'by year day' rrule", function () {
		var positiveRule = {"ruleType": "BYYEARDAY", "ruleValue": [{"ord": 1}, {"ord": 100}, {"ord": 364}]};   //Jan 1, April 10, December 30
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 3, 10);//April 10, 2009

		mgr.byYearDayTest(positiveRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byYearDay);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byYearDay);
	});

	it("should match negative 'by year day' rrule", function () {
		var negativeRule = {"ruleType": "BYYEARDAY", "ruleValue": [{"ord": -2}, {"ord": -40}, {"ord": -364}]}; //December 30, November 22, January 2
		var date = new Date(2009, 10, 22); //November 22, 2009
		var flags = {"rulesPresent": 0, "rulesTrue": 0};
		mgr.byYearDayTest(negativeRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byYearDay);
		expect(flags.rulesTrue).toEqual(1 << mgr.flagPositions.byYearDay);
	});

	it("should not match positive 'by year day' rrule", function () {
		var positiveRule = {"ruleType": "BYYEARDAY", "ruleValue": [{"ord": 1}, {"ord": 100}, {"ord": 364}]};   //Jan 1, April 10, December 30
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 1, 28);//February 28, 2009

		mgr.byYearDayTest(positiveRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byYearDay);
		expect(flags.rulesTrue).toEqual(0);
	});

	it("should not match negative 'by year day' rrule", function () {
		var negativeRule = {"ruleType": "BYYEARDAY", "ruleValue": [{"ord": -2}, {"ord": -40}, {"ord": -364}]}; //December 30, October 23, January 2
		var flags = {"rulesPresent": 0, "rulesTrue": 0};

		var date = new Date(2009, 1, 28);//February 28, 2009

		mgr.byYearDayTest(negativeRule, date, flags);
		expect(flags.rulesPresent).toEqual(1 << mgr.flagPositions.byYearDay);
		expect(flags.rulesTrue).toEqual(0);
	});

// End ByXXX sub-rule tests
//====================================================
//begin RRULE tests

//
// * "freq": {"ruleType" : "string"},                   //[secondly|minutely|hourly|daily|weekly|monthly|yearly]
// * "wkst": {type": "int", "optional":"true"},
// * "until": {type": "int", "optional":"true"},
// * "count": {type": "int", "optional":"true"},    //when we receive the event, we should calculate count out to an until value so we can query smarter.  if the event changes, recalculate
// * "interval": {type": "int", "optional":"true"},
// * "rules": {type": "array", "optional":"true"}   //rule objects
//

	it("should match super simple daily frequency rrule", function () {
		//repeats every day
		var rrule = {"freq": "DAILY"};
		var eventStartDate;
		var testDate;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009
		testDate = new Date( 2009, 0, 1); //January 1, 2009

		var result = mgr.frequencyTypeDaily(testDate.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();
	});

	it("should match simple daily frequency rrule", function () {
		//repeats every day
		var rrule = {"freq": "DAILY", "interval":1};
		var eventStartDate;
		var testDate;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009
		testDate = new Date( 2009, 0, 1); //January 1, 2009

		var result = mgr.frequencyTypeDaily(testDate.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();
	});

	it("should match daily frequency interval rrule", function () {
		//repeats every other day
		var rrule = {"freq": "DAILY", "interval":2};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009
		testDateMatch = new Date(2009, 0, 13); //January 13, 2009
		testDateNoMatch = new Date(2009, 0, 14); //January 14, 2009

		result = mgr.frequencyTypeDaily(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeDaily(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match daily frequency 'by month' subrule rrule", function () {
		//every day in Jan-March
		var rrule = {"freq": "DAILY", "interval":1, rules:[{"ruleType": "BYMONTH", "ruleValue": [{"ord": 1}, {"ord": 2}, {"ord": 3}]}]};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009
		testDateMatch = new Date(2009, 2, 13); //March 13, 2009
		testDateNoMatch = new Date(2009, 4, 14); //May 14, 2009

		result = mgr.frequencyTypeDaily(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeDaily(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

//--------------------------------------------------------

	it("should match super simple weekly frequency rrule", function () {
		//repeats every week on Thursday
		var rrule = {"freq": "WEEKLY"};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 0, 22);  //January 22, 2009 (Thursday)
		testDateNoMatch = new Date(2009, 0, 23); //January 23, 2009 (Friday)

		result = mgr.frequencyTypeWeekly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeWeekly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match simple weekly frequency rrule", function () {
		//repeats every week on Thursday
		var rrule = {"freq": "WEEKLY", "interval":1};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 0, 22);  //January 22, 2009 (Thursday)
		testDateNoMatch = new Date(2009, 0, 23); //January 23, 2009 (Friday)

		result = mgr.frequencyTypeWeekly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeWeekly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match weekly frequency interval rrule", function () {
		//repeats every third week on Thursday
		var rrule = {"freq": "WEEKLY", "interval":3};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 0, 22); //January 22, 2009 (Thursday)
		testDateNoMatch = new Date(2009, 0, 8); //January 8, 2009 (Thursday)

		result = mgr.frequencyTypeWeekly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeWeekly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match weekly frequency 'by month, by day' subrule rrule", function () {
		//every week on TH,FR,SA in Jan-March
		var rrule = {"freq": "WEEKLY", "interval":1, rules:[{"ruleType": "BYMONTH", "ruleValue": [{"ord": 1}, {"ord": 2}, {"ord": 3}]},
															{"ruleType": "BYDAY", "ruleValue": [{"day":4}, {"day":5}, {"day":6}]}]};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 0, 16); //January 16, 2009 (Friday)
		testDateNoMatch = new Date(2009, 1, 9); //February 9, 2009 (Monday)

		result = mgr.frequencyTypeWeekly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeWeekly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

//--------------------------------------------------------

	it("should match super simple monthly frequency rrule", function () {
		//repeats every month on the 1st
		var rrule = {"freq": "MONTHLY"};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 2, 1); //March 1, 2009
		testDateNoMatch = new Date(2009, 0, 23); //January 23, 2009

		result = mgr.frequencyTypeMonthly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeMonthly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match simple monthly frequency rrule", function () {
		//repeats every month on the 1st
		var rrule = {"freq": "MONTHLY", "interval":1};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 2, 1); //March 1, 2009
		testDateNoMatch = new Date(2009, 0, 23); //January 23, 2009

		result = mgr.frequencyTypeMonthly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeMonthly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match monthly frequency interval rrule", function () {
		//repeats every third month on the first
		var rrule = {"freq": "MONTHLY", "interval":3};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 6, 1); //July 1, 2009
		testDateNoMatch = new Date(2009, 7, 1); //August 1, 2009

		result = mgr.frequencyTypeMonthly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeMonthly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match monthly frequency 'by month, by day' subrule rrule", function () {
		//repeats on the second thursday of Jan-March
		var rrule = {"freq": "MONTHLY", "interval":1, rules:[{"ruleType": "BYMONTH", "ruleValue": [{"ord": 1}, {"ord": 2}, {"ord": 3}]},
															{"ruleType": "BYDAY", "ruleValue": [{"day":4, "ord":2}]}]};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 1, 12); //February 12, 2009 (Thursday)
		testDateNoMatch = new Date(2009, 1,19); //February 19, 2009 (Thursday)

		result = mgr.frequencyTypeMonthly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeMonthly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

//--------------------------------------------------------

	it("should match super simple yearly rrule", function () {
		//repeats every year on January 1st
		var rrule = {"freq": "YEARLY"};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2011, 0, 1); //January 1, 2011
		testDateNoMatch = new Date(2009, 0, 23); //January 23, 2009

		result = mgr.frequencyTypeYearly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeYearly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match simple yearly rrule", function () {
		//repeats every year on January 1st
		var rrule = {"freq": "YEARLY", "interval":1};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2011, 0, 1); //January 1, 2011
		testDateNoMatch = new Date(2009, 0, 23); //January 23, 2009

		result = mgr.frequencyTypeYearly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeYearly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match yearly frequency interval rrule", function () {
		//repeats every other year on January 1st
		var rrule = {"freq": "YEARLY", "interval":2};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2011, 0, 1); //January 1, 2011
		testDateNoMatch = new Date(2010, 0, 1); //January 1, 2010

		result = mgr.frequencyTypeYearly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeYearly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

	it("should match yearly frequency 'by month, by month day' subrule rrule", function() {
		//repeats on the 2nd, 4th, and 6th of Jan-March every year
		var rrule = {"freq": "YEARLY", "interval":1, rules:[{"ruleType": "BYMONTH", "ruleValue": [{"ord": 1}, {"ord": 2}, {"ord": 3}]},
															{"ruleType": "BYMONTHDAY", "ruleValue": [{"ord": 2}, {"ord": 4}, {"ord": 6}]}]};
		var eventStartDate;
		var testDateMatch;
		var testDateNoMatch;
		var result;

		eventStartDate = new Date(2009, 0, 1); //January 1, 2009 (Thursday)
		testDateMatch = new Date(2009, 1, 4); //February 4, 2009 (Thursday)
		testDateNoMatch = new Date(2009, 5, 4); //June 4, 2009 (Thursday)

		result = mgr.frequencyTypeYearly(testDateMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeTruthy();

		result = mgr.frequencyTypeYearly(testDateNoMatch.getTime(), eventStartDate.getTime(), rrule, undefined);
		expect(result).toBeFalsy();
	});

//--------------------------------------------------------

	it("should match exdates", function () {
		//repeats on the 2nd, 4th, and 6th of Jan-March every year
					   //Date      Date time          UTC date time
		var exdates = ["20100128", "20100129T080000", utils.shiftISO8601FromPST("20100130T160000Z")];
		var eventTzID = "Americas/Los_Angeles";
		var eventStart = new Date("Jan 29 2010 08:00:00").getTime();	// || Fri, 29 Jan 2010 16:00:00 GMT

		//Test against a date type & first in list. Expected result is true.
		var testDate1 = new Date("28 Jan 2010 02:00:00 AM").getTime();	// || Thu 28 Jan 2010 10:00:00 GMT
		var result = mgr.evaluateExceptions(testDate1, exdates, eventStart, eventTzID);
		expect(result).toBeTruthy();

		//Test against a date-time type & middle of list. Expected result is true.
		var testDate2 = new Date("29 Jan 2010 08:00:00 AM").getTime();	// || Fri 29 Jan 2010 16:00:00 GMT
		result = mgr.evaluateExceptions(testDate2, exdates, eventStart, eventTzID);
		expect(result).toBeTruthy();

		//Test against a UTC date-time type & end of list. Expected result is true.
		var testDate3 = 1264867200000;  //Sat 30 Jan 2010 08:00:00 AM PST || Sat 30 Jan 2010 16:00:00 GMT
		result = mgr.evaluateExceptions(testDate3, exdates, eventStart, eventTzID);
		expect(result).toBeTruthy();

		//Test against all types, traversing whole list. Expected result is false.
		var testDate4 = new Date("27 Jan 2010 11:00:00 PM").getTime();	// || Thu 28 Jan 2010 07:00:00 GMT
		result = mgr.evaluateExceptions(testDate4, exdates, eventStart, eventTzID);
		expect(result).toBeFalsy();
	});
});


