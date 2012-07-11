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
/* Copyright 2010 Palm, Inc.  All rights reserved. */
/**
 * @author lauren
 */

// REVIEWED: Erik Jaesler 2012-01-12

/*global beforeEach, console, describe, EventManager, expect, Foundations: false, it, MojoLoader, require, TimezoneManager, waitsFor, xdescribe, xit  */
/*jslint laxbreak: true, white: false */

//occursInRange
//getDatesInRange
//findRepeatsInRange
//splitByDays
//getEventRenderTimes
//formatResponse
//getEventsInRange

var utils = require('./utils');
var fm = MojoLoader.require({name: "foundations.mock", version: "1.0"})["foundations.mock"];

describe("Timezone event tests", function () {
	var initialized = false,
		tzMgr;

	beforeEach(function () {
		fm.Comms.Mock.PalmCall.useMock();

		if(!initialized){
			tzMgr = new TimezoneManager();
			var future = new Foundations.Control.Future();
			future.tzIds = ["America/Los_Angeles", "America/New_York", "Asia/Kabul", "Pacific/Honolulu"];
			future.years = [2010];
			future.now(tzMgr, tzMgr.setup);
			future.then(tzMgr, tzMgr.getTimezones);
			future.then(this, function(future){
				initialized = true;
				return true;
			});

			utils.waitsForFuture(future);
		}
	});

	function timezoneInitialized() {
		return initialized;
	}

	var mgr = new EventManager();

	/*
	 * 1. Test an event within the range. Expect true.
	 * 2. Test an event that spans into the range. Expect true.
	 * 3. Test an event that spans out of the range. Expect true.
	 * 4. Test an event that spans across the range. Expect true.
	 * 5. Test an event that is not within the range. Expect false.
	 *        |----- range -----|
	 *           |--case 1--|
	 *     |-- case 2--|
	 *                       |-- case 3--|
	 *   |----------case 4------------|
	 *                               |---case 5---|
	 */
	//Timezone variation: range is a tz ahead of local, events are in local time (take your phone to new york)
	it("should test occursInRangeTZ 1", function(){
		var occurs;

		var range = {
			start: 1264568400000,  //Wed 27 Jan 2010 00:00:00 EST || Tue 26 Jan 2010 21:00:00 PST || Wed 27 Jan 2010 05:00:00 GMT
			end:   1264654799000,  //Wed 27 Jan 2010 23:59:59 EST || Wed 27 Jan 2010 20:59:59 PST || Thu 28 Jan 2010 04:59:59 GMT
			tzId: "America/New_York"
		};

		//Case 1: event within range
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 20:00:00 EST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 22:00:00 EST || Wed 27 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventWithinRange, range);
		expect(occurs).toEqual(true);

		//Case 2: event spans into range
		var eventSpansIntoRange = {
			dtstart: 1264561200000,  //Tue 26 Jan 2010 22:00:00 EST || Tue 26 Jan 2010 19:00:00 PST || Wed 27 Jan 2010 02:00:00 GMT
			dtend:   1264582800000,  //Wed 27 Jan 2010 04:00:00 EST || Wed 27 Jan 2010 01:00:00 PST || Wed 27 Jan 2010 09:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventSpansIntoRange, range);
		expect(occurs).toEqual(true);

		//Case 3: event spans out of range
		var eventSpansOutOfRange = {
			dtstart: 1264582800000,  //Wed 27 Jan 2010 04:00:00 EST || Wed 27 Jan 2010 01:00:00 PST || Wed 27 Jan 2010 09:00:00 GMT
			dtend:   1264672800000,  //Thu 28 Jan 2010 05:00:00 EST || Thu 28 Jan 2010 02:00:00 PST || Thu 28 Jan 2010 10:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventSpansOutOfRange, range);
		expect(occurs).toEqual(true);

		//Case 4: event spans across range
		var eventSpansAcrossRange = {
			dtstart: 1264561200000,  //Tue 26 Jan 2010 22:00:00 EST || Tue 26 Jan 2010 19:00:00 PST || Wed 27 Jan 2010 02:00:00 GMT
			dtend:   1264672800000,  //Thu 28 Jan 2010 05:00:00 EST || Thu 28 Jan 2010 02:00:00 PST || Thu 28 Jan 2010 10:00:00 GMT
			tzId: "America/Los_Angeles"
		};
		occurs = mgr.utils.occursInRange(eventSpansAcrossRange, range);
		expect(occurs).toEqual(true);

		//Case 5: event not in range
		var eventNotInRange = {
			dtstart: 1264726800000,  //Thu 28 Jan 2010 20:00:00 EST || Thu 28 Jan 2010 17:00:00 PST || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   1264734000000,  //Thu 28 Jan 2010 22:00:00 EST || Thu 28 Jan 2010 19:00:00 PST || Fri 29 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventNotInRange, range);
		expect(occurs).toEqual(false);

		//Case 6: event with same boundaries as range
		var eventWithSameBoundaries = {
			start: 1264568400000,  //Wed 27 Jan 2010 00:00:00 EST || Tue 26 Jan 2010 21:00:00 PST || Wed 27 Jan 2010 05:00:00 GMT
			end:   1264654799000,  //Wed 27 Jan 2010 23:59:59 EST || Wed 27 Jan 2010 20:59:59 PST || Thu 28 Jan 2010 04:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventNotInRange, range);
		expect(occurs).toEqual(false);

	});

	//Timezone variation: range is local, events are in a tz ahead (take your new york phone to L.A.)
	it("should test occursInRangeTZ 2", function(){
		var occurs;

		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 03:00:00 EST || Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1264665599000,  //Thu 28 Jan 2010 02:59:59 EST || Wed 27 Jan 2010 23:59:59 PST || Thu 28 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		//Case 1: event within range
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 20:00:00 EST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 22:00:00 EST || Wed 27 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/New_York"
		};

		occurs = mgr.utils.occursInRange(eventWithinRange, range);
		expect(occurs).toEqual(true);

		//Case 2: event spans into range
		var eventSpansIntoRange = {
			dtstart: 1264568400000,  //Wed 27 Jan 2010 00:00:00 EST || Tue 26 Jan 2010 21:00:00 PST || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   1264582800000,  //Wed 27 Jan 2010 04:00:00 EST || Wed 27 Jan 2010 01:00:00 PST || Wed 27 Jan 2010 09:00:00 GMT
			tzId: "America/New_York"
		};

		occurs = mgr.utils.occursInRange(eventSpansIntoRange, range);
		expect(occurs).toEqual(true);

		//Case 3: event spans out of range
		var eventSpansOutOfRange = {
			dtstart: 1264662000000,  //Thu 28 Jan 2010 02:00:00 EST || Wed 27 Jan 2010 23:00:00 PST || Thu 28 Jan 2010 07:00:00 GMT
			dtend:   1264672800000,  //Thu 28 Jan 2010 05:00:00 EST || Thu 28 Jan 2010 02:00:00 PST || Thu 28 Jan 2010 10:00:00 GMT
			tzId: "America/New_York"
		};

		occurs = mgr.utils.occursInRange(eventSpansOutOfRange, range);
		expect(occurs).toEqual(true);

		//Case 4: event spans across range
		var eventSpansAcrossRange = {
			dtstart: 1264568400000,  //Wed 27 Jan 2010 00:00:00 EST || Tue 26 Jan 2010 21:00:00 PST || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   1264672800000,  //Thu 28 Jan 2010 05:00:00 EST || Thu 28 Jan 2010 02:00:00 PST || Thu 28 Jan 2010 10:00:00 GMT
			tzId: "America/New_York"
		};
		occurs = mgr.utils.occursInRange(eventSpansAcrossRange, range);
		expect(occurs).toEqual(true);

		//Case 5: event not in range
		var eventNotInRange = {
			dtstart: 1264726800000,  //Thu 28 Jan 2010 20:00:00 EST || Thu 28 Jan 2010 17:00:00 PST || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   1264734000000,  //Thu 28 Jan 2010 23:00:00 EST || Thu 28 Jan 2010 19:00:00 PST || Fri 29 Jan 2010 03:00:00 GMT
			tzId: "America/New_York"
		};

		occurs = mgr.utils.occursInRange(eventNotInRange, range);
		expect(occurs).toEqual(false);

		//Case 6: event with same boundaries as range
		var eventWithSameBoundaries = {
			start: 1264579200000,  //Wed 27 Jan 2010 03:00:00 EST || Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1264665599000,  //Thu 28 Jan 2010 02:59:59 EST || Wed 27 Jan 2010 23:59:59 PST || Thu 28 Jan 2010 07:59:59 GMT
			tzId: "America/New_York"
		};

		occurs = mgr.utils.occursInRange(eventNotInRange, range);
		expect(occurs).toEqual(false);
	});

	//--------------------------------------------------------------------------------

	//TIMEZONES THAT SHIFT FORWARD
	/*
	 * Test a multi day range that ends evenly on midnight boundaries.
	 */
	it("should test getDatesInRangeTZ 1", function(){
		var tmgr = new TimezoneManager();
		var range = {
			start: 1264568400000,  //Wed 27 Jan 2010 00:00:00 New_York || Tue 26 Jan 2010 21:00:00 PST
			end:   1265000399000,  //Sun 31 Jan 2010 23:59:59 New_York || Sun 31 Jan 2010 20:59:59 PST
			tzId: "America/New_York"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 0, 27, 0, 0, 0, 0).getTime(); //Wed 27 Jan 2010 00:00:00 PST
		expectedResults[1] = new Date(2010, 0, 28, 0, 0, 0, 0).getTime(); //Thu 28 Jan 2010 00:00:00 PST
		expectedResults[2] = new Date(2010, 0, 29, 0, 0, 0, 0).getTime(); //Fri 29 Jan 2010 00:00:00 PST
		expectedResults[3] = new Date(2010, 0, 30, 0, 0, 0, 0).getTime(); //Sat 30 Jan 2010 00:00:00 PST
		expectedResults[4] = new Date(2010, 0, 31, 0, 0, 0, 0).getTime(); //Sun 31 Jan 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a single day range that ends evenly on midnight boundaries.
	 */
	it("should test getDatesInRangeTZ 2", function(){
		var range = {
			start: 1264568400000,  //Wed 27 Jan 2010 00:00:00 New_York || Tue 26 Jan 2010 21:00:00 PST
			end:   1264654799000,  //Wed 27 Jan 2010 23:59:59 New_York || Wed 27 Jan 2010 20:59:59 PST
			tzId: "America/New_York"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 0, 27, 0, 0, 0, 0).getTime(); //Wed 27 Jan 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a range shorter than 24 hours within a day
	 */
	it("should test getDatesInRangeTZ 3", function(){
		var range = {
			start: 1264582800000,  //Wed 27 Jan 2010 04:00:00 New_York || Wed 27 Jan 2010 01:00:00 PST
			end:   1264597200000,  //Wed 27 Jan 2010 08:00:00 New_York || Wed 27 Jan 2010 05:00:00 PST
			tzId: "America/New_York"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 0, 27, 0, 0, 0, 0).getTime(); //Wed 27 Jan 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a range shorter than 24 hours across a midnight boundary
	 */
	it("should test getDatesInRangeTZ 4", function(){
		var range = {
			start: 1264651200000,  //Wed 27 Jan 2010 23:00:00 New_York || Wed 27 Jan 2010 20:00:00 PST
			end:   1264662000000,  //Thu 28 Jan 2010 02:00:00 New_York || Wed 27 Jan 2010 23:00:00 PST
			tzId: "America/New_York"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 0, 27, 0, 0, 0, 0).getTime(); //Wed 27 Jan 2010 00:00:00 PST
		expectedResults[1] = new Date(2010, 0, 28, 0, 0, 0, 0).getTime(); //Thu 28 Jan 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	//TIMEZONES THAT SHIFT BACKWARD
	/*
	 * Test a multi day range that ends evenly on midnight boundaries.
	 */
	it("should test getDatesInRangeTZ 5", function(){
		var range = {
			start: 1274781600000,  //Tue 25 May 2010 00:00:00 Honolulu || Tue 25 May 2010 03:00:00 PDT
			end:   1275386399000,  //Mon 31 May 2010 23:59:59 Honolulu || Tue 01 Jun 2010 02:59:59 PST
			tzId: "Pacific/Honolulu"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 4, 25, 0, 0, 0, 0).getTime(); //Tue 25 May 2010 00:00:00 PST
		expectedResults[1] = new Date(2010, 4, 26, 0, 0, 0, 0).getTime(); //Wed 26 May 2010 00:00:00 PST
		expectedResults[2] = new Date(2010, 4, 27, 0, 0, 0, 0).getTime(); //Thu 27 May 2010 00:00:00 PST
		expectedResults[3] = new Date(2010, 4, 28, 0, 0, 0, 0).getTime(); //Fri 28 May 2010 00:00:00 PST
		expectedResults[4] = new Date(2010, 4, 29, 0, 0, 0, 0).getTime(); //Sat 29 May 2010 00:00:00 PST
		expectedResults[5] = new Date(2010, 4, 30, 0, 0, 0, 0).getTime(); //Sun 30 May 2010 00:00:00 PST
		expectedResults[6] = new Date(2010, 4, 31, 0, 0, 0, 0).getTime(); //Mon 31 May 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a single day range that ends evenly on midnight boundaries.
	 */
	it("should test getDatesInRangeTZ 6", function(){
		var range = {
			start: 1274781600000,  //Tue 25 May 2010 00:00:00 Honolulu || Tue 25 May 2010 03:00:00 PDT
			end:   1274867999000,  //Tue 25 May 2010 23:59:59 Honolulu || Tue 25 May 2010 02:59:59 PDT
			tzId: "Pacific/Honolulu"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 4, 25, 0, 0, 0, 0).getTime(); //Tue 25 May 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a range shorter than 24 hours within a day
	 */
	it("should test getDatesInRangeTZ 7", function(){
		var range = {
			start: 1274792400000,  //Tue 25 May 2010 03:00:00 Honolulu || Tue 25 May 2010 06:00:00 PDT
			end:   1274803200000,  //Tue 25 May 2010 06:00:00 Honolulu || Tue 25 May 2010 09:00:00 PDT
			tzId: "Pacific/Honolulu"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 4, 25, 0, 0, 0, 0).getTime(); //Wed 27 Jan 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);

		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a range shorter than 24 hours across a midnight boundary
	 */
	it("should test getDatesInRangeTZ 8", function(){
		var range = {
			start: 1274846400000,  //Tue 25 May 2010 18:00:00 Honolulu || Tue 25 May 2010 21:00:00 PDT
			end:   1274882400000,  //Wed 26 May 2010 04:00:00 Honolulu || Wed 26 May 2010 07:00:00 PST
			tzId: "Pacific/Honolulu"
		};

		var expectedResults = [];
		expectedResults[0] = new Date(2010, 4, 25, 0, 0, 0, 0).getTime(); //Tue 25 May 2010 00:00:00 PST
		expectedResults[1] = new Date(2010, 4, 26, 0, 0, 0, 0).getTime(); //Wed 26 May 2010 00:00:00 PST

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	//--------------------------------------------------------------------------------
	//Events are in a TZ ahead of range

	/*
	 * Test a 24-hour range, and a repeating event whose first occurrence is within the range.
	 */
	it("should test findRepeatsInRange 1", function(){

		//Event repeats 8pm-10pm every other day in New York until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 20:00:00 EST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 22:00:00 EST || Wed 27 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //UNTIL = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that does contain the event
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 03:00:00 EST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1264665599000,  //Wed 27 Jan 2010 23:59:59 PST || Thu 28 Jan 2010 02:59:59 EST || Thu 28 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventWithinRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end the same as the first occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		expect(resultEvent.currentLocalStart).toEqual(eventWithinRange.dtstart);
		expect(resultEvent.currentLocalEnd).toEqual(eventWithinRange.dtend);

	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence is within the range.
	 */
	it("should test findRepeatsInRange 2", function(){

		//Event repeats 8pm-10pm every other day in New York until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 20:00:00 EST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 22:00:00 EST || Wed 27 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264752000000,  //Fri 29 Jan 2010 00:00:00 PST || Fri 29 Jan 2010 03:00:00 EST || Fri 29 Jan 2010 08:00:00 GMT
			end:   1264838399000,  //Fri 29 Jan 2010 23:59:59 PST || Sat 30 Jan 2010 02:59:59 EST || Sat 30 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		var secondOccurrenceStart = eventWithinRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventWithinRange.dtend + (86400000 * 2);
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrenceStart);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrenceEnd);
	});

	/*
	 * Test a multi-day range, and a repeating event that occurs multiple times in that range
	 */
	it("should test findRepeatsInRange 3", function(){

		//Event repeats 8pm-10pm every other day in New York until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 20:00:00 EST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 22:00:00 EST || Wed 27 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 5-day span that contains 3 occurrences of the event
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 03:00:00 EST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1265011199000,  //Sun 31 Jan 2010 23:59:59 PST || Mon 01 Feb 2010 02:59:59 EST || Mon 01 Feb 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventWithinRange);
		utils.shiftObjectFromPST(range);

		//Expected response is three occurrences, (first, second, and third)
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		var expectedNumOccurrences = 3;
		expect(occurrences.length).toEqual(expectedNumOccurrences);

		var secondOccurrenceStart = eventWithinRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventWithinRange.dtend + (86400000 * 2);
		var thirdOccurrenceStart = secondOccurrenceStart + (86400000 * 2);
		var thirdOccurrenceEnd = secondOccurrenceEnd + (86400000 * 2);
		var expectedStarts = [eventWithinRange.dtstart, secondOccurrenceStart, thirdOccurrenceStart];
		var expectedEnds = [eventWithinRange.dtend, secondOccurrenceEnd, thirdOccurrenceEnd];

		for (var i = 0; i < expectedNumOccurrences; i++) {
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStarts[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnds[i]);
		}
	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence spans into the range.
	 */
	it("should test findRepeatsInRange 4", function(){

		//Event repeats 12pm-6am every other day in New York until 1/27/2011
		var eventSpansIntoRange = {
			dtstart: 1264525200000,  //Tue 26 Jan 2010 12:00:00 EST || Tue 26 Jan 2010 09:00:00 PST || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   1264590000000,  //Wed 27 Jan 2010 06:00:00 EST || Wed 27 Jan 2010 03:00:00 PST || Wed 27 Jan 2010 11:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264752000000,  //Fri 29 Jan 2010 00:00:00 PST || Fri 29 Jan 2010 03:00:00 EST || Fri 29 Jan 2010 08:00:00 GMT
			end:   1264838399000,  //Fri 29 Jan 2010 23:59:59 PST || Sat 30 Jan 2010 02:59:59 EST || Sat 30 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		var secondOccurrence = {
			start: 1264698000000,	//Thu Jan 28 2010 09:00:00 PST
			end: 1264762800000		//Fri Jan 29 2010 03:00:00 PST
		 };

		utils.shiftObjectFromPST(eventSpansIntoRange);
		utils.shiftObjectFromPST(range);
		utils.shiftObjectFromPST(secondOccurrence);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventSpansIntoRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrence.start);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrence.end);
	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence spans out of the range.
	 */
	it("should test findRepeatsInRange 5", function(){

		//Event repeats 11pm-5am every other day in New York until 1/27/2011
		var eventSpansOutOfRange = {
			dtstart: 1264564800000,  //Tue 26 Jan 2010 23:00:00 EST || Tue 26 Jan 2010 20:00:00 PST || Wed 27 Jan 2010 04:00:00 GMT
			dtend:   1264586400000,  //Wed 27 Jan 2010 05:00:00 EST || Wed 27 Jan 2010 02:00:00 PST || Wed 27 Jan 2010 10:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264665600000,  //Thu 28 Jan 2010 00:00:00 PST || Thu 28 Jan 2010 03:00:00 EST || Thu 28 Jan 2010 08:00:00 GMT
			end:   1264751999000,  //Thu 28 Jan 2010 23:59:59 PST || Fri 29 Jan 2010 02:59:59 EST || Fri 29 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		var secondOccurrence = {
			start: 1264737600000,	//Thu Jan 28 2010 20:00:00 PST
			end: 1264759200000		//Fri Jan 29 2010 02:00:00 PST
		};

		utils.shiftObjectFromPST(eventSpansOutOfRange);
		utils.shiftObjectFromPST(range);
		utils.shiftObjectFromPST(secondOccurrence);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventSpansOutOfRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrence.start);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrence.end);
	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence spans across the range.
	 */
	it("should test findRepeatsInRange 6", function(){

		//Event repeats 4pm-4am every other day in New York until 1/27/2011 (event is > 24 hours long!)
		var eventSpansAcrossRange = {
			dtstart: 1264474800000,  //Mon 25 Jan 2010 16:00:00 EST || Mon 25 Jan 2010 19:00:00 PST || Tue 26 Jan 2010 03:00:00 GMT
			dtend:   1264582800000,  //Wed 27 Jan 2010 04:00:00 EST || Wed 27 Jan 2010 01:00:00 PST || Wed 27 Jan 2010 09:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264665600000,  //Thu 28 Jan 2010 00:00:00 PST || Thu 28 Jan 2010 03:00:00 EST || Thu 28 Jan 2010 08:00:00 GMT
			end:   1264751999000,  //Thu 28 Jan 2010 23:59:59 PST || Fri 29 Jan 2010 02:59:59 EST || Fri 29 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventSpansAcrossRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		var secondOccurrenceStart = eventSpansAcrossRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventSpansAcrossRange.dtend + (86400000 * 2);
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrenceStart);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrenceEnd);
	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence is not in the range.
	 */
	it("should test findRepeatsInRange 7", function(){

		//Event repeats 8pm-10pm every other day in New York until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 20:00:00 EST || Wed 27 Jan 2010 17:00:00 PST ||Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 22:00:00 EST || Wed 27 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that does not contain any occurrences of the event
		var range = {
			start: 1264838400000,  //Sat 30 Jan 2010 00:00:00 PST || Sat 30 Jan 2010 03:00:00 EST || Sat 30 Jan 2010 08:00:00 GMT
			end:   1264924799000,  //Sat 30 Jan 2010 23:59:59 PST || Sun 31 Jan 2010 02:59:59 EST || Sun 31 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventWithinRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		expect(occurrences.length).toEqual(0);

	});

	//--------------------------------------------------------------------------------
	//Events are in a TZ behind the range
	/*
	 * Test a 24-hour range, and a repeating event whose first occurrence is within the range.
	 */
	it("should test findRepeatsInRange 8", function(){

		//Event repeats 2pm-4pm every other day in Honolulu until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 14:00:00 HST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 16:00:00 HST || Wed 27 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //UNTIL = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that does contain the event
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Tue 26 Jan 2010 21:00:00 HST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1264665599000,  //Wed 27 Jan 2010 23:59:59 PST || Wed 27 Jan 2010 20:59:59 HST || Thu 28 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventWithinRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end the same as the first occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		expect(resultEvent.currentLocalStart).toEqual(eventWithinRange.dtstart);
		expect(resultEvent.currentLocalEnd).toEqual(eventWithinRange.dtend);

	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence is within the range.
	 */
	it("should test findRepeatsInRange 9", function(){

		//Event repeats 2pm-4pm every other day in Honolulu until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 14:00:00 HST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 16:00:00 HST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264752000000,  //Fri 29 Jan 2010 00:00:00 PST || Thu 28 Jan 2010 21:00:00 HST || Fri 29 Jan 2010 08:00:00 GMT
			end:   1264838399000,  //Fri 29 Jan 2010 23:59:59 PST || Fri 29 Jan 2010 20:59:59 HST || Sat 30 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventWithinRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		var secondOccurrenceStart = eventWithinRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventWithinRange.dtend + (86400000 * 2);
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrenceStart);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrenceEnd);
	});

	/*
	 * Test a multi-day range, and a repeating event that occurs multiple times in that range
	 */
	it("should test findRepeatsInRange 10", function(){

		//Event repeats 2pm-4pm every other day in Honolulu until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 14:00:00 HST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 16:00:00 HST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 5-day span that contains 3 occurrences of the event
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Tue 26 Jan 2010 21:00:00 HST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1265011199000,  //Sun 31 Jan 2010 23:59:59 PST || Sun 31 Jan 2010 20:59:59 HST || Mon 01 Feb 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventWithinRange);
		utils.shiftObjectFromPST(range);

		//Expected response is three occurrences, (first, second, and third)
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		var expectedNumOccurrences = 3;
		expect(occurrences.length).toEqual(expectedNumOccurrences);

		var secondOccurrenceStart = eventWithinRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventWithinRange.dtend + (86400000 * 2);
		var thirdOccurrenceStart = secondOccurrenceStart + (86400000 * 2);
		var thirdOccurrenceEnd = secondOccurrenceEnd + (86400000 * 2);
		var expectedStarts = [eventWithinRange.dtstart, secondOccurrenceStart, thirdOccurrenceStart];
		var expectedEnds = [eventWithinRange.dtend, secondOccurrenceEnd, thirdOccurrenceEnd];

		for (var i = 0; i < expectedNumOccurrences; i++) {
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStarts[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnds[i]);
		}

	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence spans into the range.
	 */
	it("should test findRepeatsInRange 11", function(){

		//Event repeats 10am-8am every other day in Honolulu until 1/27/2011
		var eventSpansIntoRange = {
			dtstart: 1264539600000,  //Tue 26 Jan 2010 10:00:00 HST || Tue 26 Jan 2010 13:00:00 PST || Tue 26 Jan 2010 21:00:00 GMT
			dtend:   1264618800000,  //Wed 27 Jan 2010 08:00:00 HST || Wed 27 Jan 2010 11:00:00 PST || Wed 27 Jan 2010 19:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264752000000,  //Fri 29 Jan 2010 00:00:00 PST || Thu 28 Jan 2010 21:00:00 HST || Fri 29 Jan 2010 08:00:00 GMT
			end:   1264838399000,  //Fri 29 Jan 2010 23:59:59 PST || Fri 29 Jan 2010 20:59:59 PST || Sat 30 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventSpansIntoRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventSpansIntoRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		var secondOccurrenceStart = eventSpansIntoRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventSpansIntoRange.dtend + (86400000 * 2);
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrenceStart);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrenceEnd);
	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence spans out of the range.
	 */
	it("should test findRepeatsInRange 12", function(){

		//Event repeats 3pm-1am every other day in Honolulu until 1/27/2011
		var eventSpansOutOfRange = {
			dtstart: 1264557600000,  //Tue 26 Jan 2010 15:00:00 HST || Tue 26 Jan 2010 18:00:00 PST || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   1264593600000,  //Wed 27 Jan 2010 01:00:00 HST || Wed 27 Jan 2010 04:00:00 PST || Wed 27 Jan 2010 12:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264665600000,  //Thu 28 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 21:00:00 HST || Thu 28 Jan 2010 08:00:00 GMT
			end:   1264751999000,  //Thu 28 Jan 2010 23:59:59 PST || Thu 28 Jan 2010 20:59:59 HST || Fri 29 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventSpansOutOfRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventSpansOutOfRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		var secondOccurrenceStart = eventSpansOutOfRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventSpansOutOfRange.dtend + (86400000 * 2);
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrenceStart);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrenceEnd);
	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence spans across the range.
	 */
	it("should test findRepeatsInRange 13", function(){

		//Event repeats 8pm-2am every other day in Honolulu until 1/27/2011 (event is > 24 hours long!)
		var eventSpansAcrossRange = {
			dtstart: 1264489200000,  //Mon 25 Jan 2010 20:00:00 HST || Mon 25 Jan 2010 23:00:00 PST || Tue 26 Jan 2010 07:00:00 GMT
			dtend:   1264597200000,  //Wed 27 Jan 2010 02:00:00 HST || Wed 27 Jan 2010 05:00:00 PST || Wed 27 Jan 2010 13:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: 1264665600000,  //Thu 28 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 21:00:00 HST || Thu 28 Jan 2010 08:00:00 GMT
			end:   1264751999000,  //Thu 28 Jan 2010 23:59:59 PST || Thu 28 Jan 2010 20:59:59 HST || Fri 29 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventSpansAcrossRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventSpansAcrossRange, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		var secondOccurrenceStart = eventSpansAcrossRange.dtstart + (86400000 * 2);
		var secondOccurrenceEnd = eventSpansAcrossRange.dtend + (86400000 * 2);
		expect(resultEvent.currentLocalStart).toEqual(secondOccurrenceStart);
		expect(resultEvent.currentLocalEnd).toEqual(secondOccurrenceEnd);
	});

	/*
	 * Test a 24-hour range, and a repeating event whose second occurrence is not in the range.
	 */
	it("should test findRepeatsInRange 14", function(){

		//Event repeats 2pm-4pm every other day in Honolulu until 1/27/2011
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 14:00:00 HST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 16:00:00 HST || Wed 27 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that does not contain any occurrences of the event
		var range = {
			start: 1264838400000,  //Sat 30 Jan 2010 00:00:00 PST || Fri 29 Jan 2010 21:00:00 HST || Sat 30 Jan 2010 08:00:00 GMT
			end:   1264924799000,  //Sat 30 Jan 2010 23:59:59 PST || Sat 30 Jan 2010 20:59:59 HST || Sun 31 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(eventWithinRange);
		utils.shiftObjectFromPST(range);

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		expect(occurrences.length).toEqual(0);

	});

	//-------------------------------------------------------------------------

	it("should test findNumOccurrencesInRange ", function(){
		var expected = 0;
		var howManyLeft = 0;
		var range;

		var event1 = {
			dtstart: 1267459200000,  //Mon 01 Mar 2010 08:00:00 PST || Mon 01 Mar 2010 11:00:00 EST || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   1267462800000,  //Mon 01 Mar 2010 09:00:00 PST || Mon 01 Mar 2010 12:00:00 EST || Mon 01 Mar 2010 17:00:00 GMT
			tzId: "America/New_York",
			subject: "Every other day until 4/1",
			rrule: {freq: "DAILY", until: 1270105200000, interval: 2} //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
		};

		range = {
			start: new Date(2010, 2, 9, 0, 0, 0, 0).getTime(),  //March 9, 2010,
			end: event1.rrule.until,
			tzId: "America/Los_Angeles"
		};

		expected = 12;
		howManyLeft = mgr.findNumOccurrencesInRange(event1, range, null);
		expect(howManyLeft).toEqual(expected);


		var event2 = {
			dtstart: 1267509600000,  //Mon 01 Mar 2010 22:00:00 PST || Tue 02 Mar 2010 01:00:00 EST || Tue 02 Mar 2010 06:00:00 GMT
			dtend:   1267513200000,  //Mon 01 Mar 2010 23:00:00 PST || Tue 02 Mar 2010 02:00:00 EST || Tue 02 Mar 2010 07:00:00 GMT
			tzId: "America/New_York",
			subject: "Every week on tuesday until 5/1",
			rrule: {freq: "WEEKLY", until: 1272697200000, interval: 1}, //until = Sat 01 May 2010 12:00:00 AM PDT || Sat 01 May 2010 07:00:00 GMT
			exdates: ["20100316", "20100413"]
		};

		range = {
			start: 1268121600000,  //Tue Mar 09 2010 00:00:00 PST
			end: event2.rrule.until,
			tzId: "America/Los_Angeles"
		};
		expected = 5;  //start range in PST is after the 3/9 occurrence in EST, and two exception dates
		howManyLeft = mgr.findNumOccurrencesInRange(event2, range, null);
		expect(howManyLeft).toEqual(expected);

		//----

		var event3 = {
			dtstart: 1267459200000,  //Mon 01 Mar 2010 08:00:00 PST || Mon 01 Mar 2010 05:00:00 HST || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   1267462800000,  //Mon 01 Mar 2010 09:00:00 PST || Mon 01 Mar 2010 06:00:00 HST || Mon 01 Mar 2010 17:00:00 GMT
			tzId: "Pacific/Honolulu",
			subject: "Every other day until 4/1",
			rrule: {freq: "DAILY", until: 1270105200000, interval: 2} //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
		};

		range = {
			start: new Date(2010, 2, 9, 0, 0, 0, 0).getTime(),  //March 9, 2010,
			end: event3.rrule.until,
			tzId: "America/Los_Angeles"
		};

		expected = 12;
		howManyLeft = mgr.findNumOccurrencesInRange(event3, range, null);
		expect(howManyLeft).toEqual(expected);


		var event4 = {
			dtstart: 1267520400000, //Tue 02 Mar 2010 01:00:00 PST || Mon 01 Mar 2010 22:00:00 HST || Tue 02 Mar 2010 09:00:00 GMT
			dtend:   1267524000000, //Tue 02 Mar 2010 02:00:00 PST || Mon 01 Mar 2010 23:00:00 HST || Tue 02 Mar 2010 10:00:00 GMT
			tzId: "Pacific/Honolulu",
			subject: "Every week on monday until 5/1",
			rrule: {freq: "WEEKLY", until: 1272697200000, interval: 1} //until = Sat 01 May 2010 12:00:00 AM PDT || Sat 01 May 2010 07:00:00 GMT
		};

		range = {
			start: new Date(2010, 2, 9, 0, 0, 0, 0).getTime(),  //March 9, 2010,
			end: event4.rrule.until,
			tzId: "America/Los_Angeles"
		};
		expected = 8;
		howManyLeft = mgr.findNumOccurrencesInRange(event4, range, null);
		expect(howManyLeft).toEqual(expected);
	});

	//-----------------------------------------------------

	// TODO: TEST: Write a unit test for all day events vs. timezones
	// TODO: TEST: Write a unit test that crosses a DST boundary, maybe the london vs. us march case, and see how bad our border cases shake out.

	//Weekly repeating event whose day shifts back because of tz difference.
	it("should test getEventsInRange 1", function(){
		var done = false;

		//Range is 5-day span
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1265011199000,  //Sun 31 Jan 2010 23:59:59 PST || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzMgr.getSystemTimezone()
		};

		//repeats WEEKLY on wednesdays at 1am in new york - next occurrence 1/27/2010 1 am NYC -> 1/26/2010 10pm LA - not in range!!!
		var event1 = {
			dtstart: 1263967200000,  //Tue 19 Jan 2010 22:00:00 PST || Wed 20 Jan 2010 01:00:00 EST || Wed 20 Jan 2010 06:00:00 GMT
			dtend:   1263970800000,  //Tue 19 Jan 2010 23:00:00 PST || Wed 20 Jan 2010 02:00:00 EST || Wed 20 Jan 2010 07:00:00 GMT
			tzId: "America/New_York",
			subject: "Appears on the previous date in local timezone",
			rrule: {freq: "WEEKLY", until: 1296172800000} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		utils.shiftObjectFromPST(range);
		utils.shiftObjectFromPST(event1);

		var resultSet = [event1];

		var callback = function(response){
			//Did we get the right number of days back?
			var expectedNumDayResults = 5;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [0, 0, 0, 0, 0];
			var actualNumEventsPerDay = 0;

			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].events.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);
			}

			done = true;
		};

		mgr.getEventsInRange(range, callback, resultSet);
		waitsFor(function () {
			return done;
		});
	});


	//Daily with interval repeating event whose day shifts back because of tz difference.
	// TODO: TEST: Do one for Honolulu where day shifts forward
	it("should test getEventsInRange 2", function(){
		var done = false;

		//Range is 5-day span
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1265011199000,  //Sun 31 Jan 2010 23:59:59 PST || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzMgr.getSystemTimezone()
		};

		//repeats every other day at 1am in new york - next occurrence 1/27/2010 1 am NYC
		var event1 = {
			dtstart: 1263967200000,  //Tue 19 Jan 2010 22:00:00 PST || Wed 20 Jan 2010 01:00:00 EST || Wed 20 Jan 2010 06:00:00 GMT
			dtend:   1263970800000,  //Tue 19 Jan 2010 23:00:00 PST || Wed 20 Jan 2010 02:00:00 EST || Wed 20 Jan 2010 07:00:00 GMT
			tzId: "America/New_York",
			subject: "Appears on the previous date in local timezone",
			rrule: {freq: "DAILY", interval: 2, until: 1296172800000} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		utils.shiftObjectFromPST(range);
		utils.shiftObjectFromPST(event1);

		var resultSet = [event1];

		var callback = function(response){
			//Did we get the right number of days back?
			var expectedNumDayResults = 5;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [1, 0, 1, 0, 1];
			var actualNumEventsPerDay = 0;

			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].events.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);
			}

			//For each event, did we get the right start times?
			var occurrence1 = {
				start:	1264658400000,	//Wed Jan 27 2010 22:00:00 PST'
				end:	1264662000000	//Wed Jan 27 2010 23:00:00 PST'
			};
			var occurrence2 = {
				start:	1264831200000,	//Fri Jan 29 2010 22:00:00 PST'
				end:	1264834800000	//Fri Jan 29 2010 23:00:00 PST'
			};
			var occurrence3 = {
				start:	1265004000000,	//Sun Jan 31 2010 22:00:00 PST'
				end:	1265007600000	//Sun Jan 31 2010 23:00:00 PST'
			};

			utils.shiftObjectFromPST(occurrence1);
			utils.shiftObjectFromPST(occurrence2);
			utils.shiftObjectFromPST(occurrence3);

			var expectedRenderStartTimes = [[occurrence1.start], [], [occurrence2.start], [], [occurrence3.start]];
			var expectedRenderEndTimes =   [[occurrence1.end], [], [occurrence2.end], [], [occurrence3.end]];

			for(dayIndex = 0; dayIndex < expectedNumDayResults; dayIndex++){
				var events = response.days[dayIndex].events;
				for(eventIndex = 0; eventIndex < events.length; eventIndex++){
					var event = events[eventIndex];
					var start = event.renderStartTime;
					var end = event.renderEndTime;
					var expectedStart = expectedRenderStartTimes[dayIndex][eventIndex];
					var expectedEnd = expectedRenderEndTimes[dayIndex][eventIndex];
					expect(start).toEqual(expectedStart);
					expect(end).toEqual(expectedEnd);
				}
			}
			done = true;
		};

		mgr.getEventsInRange(range, callback, resultSet);
		waitsFor(function () {
			return done;
		});
	});

	//Repeating events in other timezones, not date-shifting, not spanning midnight.
	it("should test getEventsInRange 3", function(){
		var done = false;

		//Range is 5-day span
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1265011199000,  //Sun 31 Jan 2010 23:59:59 PST || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzMgr.getSystemTimezone()
		};

		//Event repeats 8pm-10pm every day in New York until 1/27/2011
		//Should produce 5 occurrences
		var dailyRepeatingEvent = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 17:00:00 PST || Wed 27 Jan 2010 20:00:00 EST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 19:00:00 PST || Wed 27 Jan 2010 22:00:00 EST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Event repeats 3am-4am every Saturday in Honolulu until 1/27/2011
		//Should produce 1 occurrence on 1/30/2010
		var weeklyRepeatingEvent = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 PST || Sat 23 Jan 2010 03:00:00 HST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 PST || Sat 23 Jan 2010 04:00:00 HST || Sat 23 Jan 2010 15:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "WEEKLY", until: 1296172800000, interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Single event 6pm-8pm in New York 1/27/2010
		var singleEvent1 = {
			dtstart: 1264644000000,  //Wed 27 Jan 2010 18:00:00 PST || Wed 27 Jan 2010 21:00:00 EST || Thu 28 Jan 2010 02:00:00 GMT
			dtend:   1264651200000,  //Wed 27 Jan 2010 20:00:00 PST || Wed 27 Jan 2010 23:00:00 EST || Thu 28 Jan 2010 05:00:00 GMT
			tzId: "America/New_York"
		};

		//Single event 2pm-4pm  in Honolulu1/28/2010
		var singleEvent2 = {
			dtstart: 1264726800000,  //Thu 28 Jan 2010 17:00:00 PST || Thu 28 Jan 2010 14:00:00 HST || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   1264734000000,  //Thu 28 Jan 2010 19:00:00 PST || Thu 28 Jan 2010 16:00:00 HST Fri 29 Jan 2010 03:00:00 GMT
			tzId: "Pacific/Honolulu"
		};

		utils.shiftObjectFromPST(range);
		utils.shiftObjectFromPST(dailyRepeatingEvent);
		utils.shiftObjectFromPST(weeklyRepeatingEvent);
		utils.shiftObjectFromPST(singleEvent1);
		utils.shiftObjectFromPST(singleEvent2);

		var resultSet = [dailyRepeatingEvent, weeklyRepeatingEvent, singleEvent1, singleEvent2];

		var callback = function(response) {
			//Did we get the right number of days back?
			var expectedNumDayResults = 5;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [2, 2, 1, 2, 1];
			var actualNumEventsPerDay = 0;
			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].events.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);

			}

			//For each event, did we get the right start times?
			var expectedCurrentLocalStartTimes = [
				[
					utils.shiftFromPST(1264640400000),	//Daily 1
					utils.shiftFromPST(1264644000000)	//Single 1
				], [
					utils.shiftFromPST(1264726800000),	//Single 2
					utils.shiftFromPST(1264726800000)	//Daily 2
				], [
					utils.shiftFromPST(1264813200000)	//Daily 3
				], [
					utils.shiftFromPST(1264860000000),	//Weekly
					utils.shiftFromPST(1264899600000)	//Daily 4
				], [
					utils.shiftFromPST(1264986000000)	//Daily 5
				]
			];

			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				var events = response.days[dayIndex].events;
				for(eventIndex = 0; eventIndex < events.length; eventIndex++){
					var event = events[eventIndex];
					expect(event.currentLocalStart).toEqual(expectedCurrentLocalStartTimes[dayIndex][eventIndex]);
				}
			}

	        done = true;
	    };
		mgr.getEventsInRange(range, callback, resultSet);
		waitsFor(function () {
			return done;
		});
	});

	//Given a set of events (regular with some spanning midnight) expect to get back
	//events with appropriate renderStartTime and renderEndTime times
	it("should test getEventsInRange 4", function(){
		var done = false;

		//Range is 5-day span
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1265011199000,  //Sun 31 Jan 2010 23:59:59 PST || Mon 01 Feb 2010 07:59:59 GMT
			tzId:  tzMgr.getSystemTimezone()
		};

		//event spans into range
		var eventSpansIntoRange = {
			dtstart: 1264561200000,  //Tue 26 Jan 2010 19:00:00 PST || Tue 26 Jan 2010 22:00:00 EST || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   1264582800000,  //Wed 27 Jan 2010 01:00:00 PST || Wed 27 Jan 2010 04:00:00 EST || Wed 27 Jan 2010 09:00:00 GMT
			tzId: "America/New_York"
		};

		//Single event 1/29/2010 8pm - 1/30/2010 12pm
		//Spans across midnights within range - expect two segments
		var eventSpansMidnightWithinRange = {
			dtstart: 1264824000000,  //Fri 29 Jan 2010 20:00:00 PST || Fri 29 Jan 2010 23:00:00 EST || Sat 30 Jan 2010 04:00:00 GMT
			dtend:   1264881600000,  //Sat 30 Jan 2010 12:00:00 PST || Sat 30 Jan 2010 15:00:00 EST || Sat 30 Jan 2010 20:00:00 GMT
			tzId: "America/New_York"
		};

		//event spans out of range
		var eventSpansOutOfRange = {
			dtstart: 1264989600000,  //Sun 31 Jan 2010 18:00:00 PST || Sun 31 Jan 2010 15:00:00 HST || Mon 01 Feb 2010 02:00:00 GMT
			dtend:   1265032800000,  //Mon 01 Feb 2010 06:00:00 PST || Mon 01 Feb 2010 03:00:00 HST || Mon 01 Feb 2010 14:00:00 GMT
			tzId: "Pacific/Honolulu"
		};

		//Event repeats 6am-7am every Saturday until 1/27/2011
		//Should produce 1 occurrence on 1/30/2010
		var weeklyRepeatingEvent = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 PST || Sat 23 Jan 2010 03:00:00 HST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 PST || Sat 23 Jan 2010 04:00:00 HST || Sat 23 Jan 2010 15:00:00 GMT
			tzId: "Pacific/Honolulu",
			rrule: {freq: "WEEKLY", until: 1296172800000, interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Single event 5pm-7pm 1/28/2010
		var singleEvent = {
			dtstart: 1264726800000,  //Thu 28 Jan 2010 05:00:00 PM PST || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   1264734000000,  //Thu 28 Jan 2010 07:00:00 PM PST || Fri 29 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		utils.shiftObjectFromPST(range);
		utils.shiftObjectFromPST(eventSpansIntoRange);
		utils.shiftObjectFromPST(eventSpansMidnightWithinRange);
		utils.shiftObjectFromPST(eventSpansOutOfRange);
		utils.shiftObjectFromPST(weeklyRepeatingEvent);
		utils.shiftObjectFromPST(singleEvent);

		var resultSet = [eventSpansIntoRange, eventSpansMidnightWithinRange, eventSpansOutOfRange, weeklyRepeatingEvent, singleEvent];

		var callback = function(response){
			//Did we get the right number of days back?
			var expectedNumDayResults = 5;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [1, 1, 1, 2, 1];
			var actualNumEventsPerDay = 0;
			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].events.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);
			}

			//For each event, did we get the right start times?
			var expectedRenderStartTimes = [
				[
					utils.shiftFromPST(1264579200000)	//Span in 12am
				], [
					utils.shiftFromPST(1264726800000)	//Single
				], [
					utils.shiftFromPST(1264824000000)	//SpanWithin 8pm
				], [
					utils.shiftFromPST(1264838400000),	//----Midnight
					utils.shiftFromPST(1264860000000)	//Weekly
				], [
					utils.shiftFromPST(1264989600000)	//Span out
				]
			];

			var expectedRenderEndTimes =   [
				[
					utils.shiftFromPST(1264582800000)	//Span in 1am
				], [
					utils.shiftFromPST(1264734000000)	//Single
				], [
					utils.shiftFromPST(1264838400000)	//SpanWithin 8pm----
				], [
					utils.shiftFromPST(1264881600000),	//Midnight
					utils.shiftFromPST(1264863600000)	//Weekly
				], [
					utils.shiftFromPST(1265011200000)	//Span out
				]
			];

			for(dayIndex = 0; dayIndex < expectedNumDayResults; dayIndex++){
				var events = response.days[dayIndex].events;
				for(eventIndex = 0; eventIndex < events.length; eventIndex++){
					var event = events[eventIndex];
					expect(event.renderStartTime).toEqual(expectedRenderStartTimes[dayIndex][eventIndex]);
					expect(event.renderEndTime).toEqual(expectedRenderEndTimes[dayIndex][eventIndex]);
				}
			}
			done = true;
		};

		mgr.getEventsInRange(range, callback, resultSet);
		waitsFor(function () {
			return done;
		});
	});


	//Given a set of events (regular with some spanning midnight) expect to get back
	//events with appropriate renderStartTime and renderEndTime times
	it("should test getEventsInRange 5", function(){
		var done = false;

		//Range is 5-day span
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1265011199000,  //Sun 31 Jan 2010 23:59:59 PST || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzMgr.getSystemTimezone()
		};

		//repeats WEEKLY on wednesdays at 1am in new york - next occurrence 1/27/2010 1 am NYC -> 1/26/2010 10pm LA - not in range!!!
		var event1 = {
			dtstart: 1263967200000,  //Tue 19 Jan 2010 22:00:00 PST || Wed 20 Jan 2010 01:00:00 EST || Wed 20 Jan 2010 06:00:00 GMT
			dtend:   1263970800000,  //Tue 19 Jan 2010 23:00:00 PST || Wed 20 Jan 2010 02:00:00 EST || Wed 20 Jan 2010 07:00:00 GMT
			tzId: "America/New_York",
			subject: "Appears on the previous date in local timezone",
			rrule: {freq: "WEEKLY", until: 1296172800000} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//repeats WEEKLY on saturdays at 10:30pm in honolulu - next occurrence 1/30/2010 10:30 pm honolulu -> 1/31/2010 1am LA
		var event2 = {
			dtstart: 1264325400000,  //Sun 24 Jan 2010 01:30:00 PST || Sat 23 Jan 2010 22:30:00 HST || Sun 24 Jan 2010 09:30:00 GMT
			dtend:   1264327200000,  //Sun 24 Jan 2010 02:00:00 PST || Sat 23 Jan 2010 23:00:00 HST || Sun 24 Jan 2010 10:00:00 GMT
			tzId: "Pacific/Honolulu",
			subject: "Appears on the next date in local timezone",
			rrule: {freq: "WEEKLY", until: 1296172800000} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//repeats WEEKLY on sundays at 11pm in honolulu - next occurrence 1/31/2010 11 pm honolulu -> 2/1/2010 1am LA - not in range!!
		var event3 = {
			dtstart: 1264410000000,  //Mon 25 Jan 2010 01:00:00 PST || Sun 24 Jan 2010 23:00:00 HST || Mon 25 Jan 2010 9:00:00 GMT
			dtend:   1264413600000,  //Mon 25 Jan 2010 02:00:00 PST || Mon 25 Jan 2010 00:00:00 HST || Mon 25 Jan 2010 10:00:00 GMT
			tzId: "Pacific/Honolulu",
			subject: "Appears on the next date in local timezone",
			rrule: {freq: "WEEKLY", until: 1296172800000} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//repeats every other day - 22nd, 24th, 26th, 28th, 30th in honolulu -> 23rd, 25th, 27th, 29th, 31st in LA.
		var event4 = {
			dtstart: 1264237200000,  //Sat 23 Jan 2010 01:00:00 PST|| Fri 22 Jan 2010 22:00:00 HST || Sat, 23 Jan 2010 09:00:00 GMT
			dtend:   1264240800000,  //Sat 23 Jan 2010 02:00:00 PST|| Fri 22 Jan 2010 23:00:00 HST || Sat, 23 Jan 2010 10:00:00 GMT
			tzId: "Pacific/Honolulu",
			subject: "Appears on next date in local timezone",
			rrule: {freq: "DAILY", until: 1296172800000, interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};
		//27, 29 in Honolulu
		//28, 30 in Los Angeles

		utils.shiftObjectFromPST(range);
		utils.shiftObjectFromPST(event1);
		utils.shiftObjectFromPST(event2);
		utils.shiftObjectFromPST(event3);
		utils.shiftObjectFromPST(event4);

		var resultSet = [event1, event2, event3, event4];

		var callback = function(response){
			//Did we get the right number of days back?
			var expectedNumDayResults = 5;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [1, 0, 1, 0, 2];
			var actualNumEventsPerDay = 0;

			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].events.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);
			}

			//For each event, did we get the right start times?
			var event2start1 = new Date(2010, 0, 31, 1, 30, 0, 0).getTime();
			var event2end1 = new Date(2010, 0, 31, 2, 0, 0, 0).getTime();

			var event4start1 = new Date(2010, 0, 27, 1, 0, 0, 0).getTime();
			var event4start2 = new Date(2010, 0, 29, 1, 0, 0, 0).getTime();
			var event4start3 = new Date(2010, 0, 31, 1, 0, 0, 0).getTime();
			var event4end1 = new Date(2010, 0, 27, 2, 0, 0, 0).getTime();
			var event4end2 = new Date(2010, 0, 29, 2, 0, 0, 0).getTime();
			var event4end3 = new Date(2010, 0, 31, 2, 0, 0, 0).getTime();
			var expectedRenderStartTimes = [[event4start1], [], [event4start2], [], [event4start3, event2start1]];
			var expectedRenderEndTimes =   [[event4end1], [], [event4end2], [], [event4end3, event2end1]];

			for(dayIndex = 0; dayIndex < expectedNumDayResults; dayIndex++){
				var events = response.days[dayIndex].events;
				for(eventIndex = 0; eventIndex < events.length; eventIndex++){
					var event = events[eventIndex];
					var start = event.renderStartTime;
					var end = event.renderEndTime;
					var expectedStart = expectedRenderStartTimes[dayIndex][eventIndex];
					var expectedEnd = expectedRenderEndTimes[dayIndex][eventIndex];
					expect(start).toEqual(expectedStart);
					expect(end).toEqual(expectedEnd);
				}
			}
			done = true;
		};

		mgr.getEventsInRange(range, callback, resultSet);
		waitsFor(function () {
			return done;
		});
	});

});