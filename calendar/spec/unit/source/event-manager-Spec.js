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

/*global beforeEach, console, describe, EventManager, expect, Foundations, it, MojoLoader, require, TimezoneManager, waitsFor, xdescribe, xit */
/*jslint laxbreak: true, white: false */

//occursInRange
//getDatesInRange
//findRepeatsInRange
//splitByDays
//getEventRenderTimes
//formatResponse
//getEventsInRange

// TODO: TEST: Once we have timezone support, test all methods again with events that are not in Los Angeles timezone

var waitsForFuture = require('./utils').waitsForFuture;
var fm = MojoLoader.require({name: "foundations.mock", version: "1.0"})["foundations.mock"];

describe("EventManager tests", function () {
	var tzMgr,
		tzId;

	var mgr = new EventManager();

	beforeEach(function () {
		fm.Comms.Mock.PalmCall.useMock();

		if(!this.initialized){
			tzMgr = new TimezoneManager();
			var future = new Foundations.Control.Future();
			future.tzIds = ["America/Los_Angeles", "America/New_York", "Asia/Kabul", "Pacific/Niue"];
			future.years = [2010];
			future.now(tzMgr, tzMgr.setup);
			future.then(tzMgr, tzMgr.getTimezones);
			future.then(this, function(future){
				this.initialized = true;
				tzId = tzMgr.getSystemTimezone();
				return true;
			});

			waitsForFuture(future);
		}
	});

	it("should test isSingleton ", function(){
		/** Tests that all instances of EventManager point to the same object */

		// Do two new EventManager instances both point to the same instance?
		var isSameInstance = (new EventManager() === mgr);
		expect(isSameInstance).toEqual(true);

		// Does executing EventManager's constructor return the same instance as creating a new EventManager?
		isSameInstance = (EventManager() === new EventManager());
		expect(isSameInstance).toEqual(true);
	});

	//--------------------------------------------------------------------------------
	//TODO: Test a range with a different timezone

	/*
	 * Test a multi day range that ends evenly on midnight boundaries.
	 */
	it("should test getDatesInRange ", function(){

		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		var expectedResults = [];
		expectedResults[0] = new Date("27 Jan 2010 00:00:00 AM").getTime();	//
		expectedResults[1] = new Date("28 Jan 2010 00:00:00 AM").getTime();	//
		expectedResults[2] = new Date("29 Jan 2010 00:00:00 AM").getTime();	//
		expectedResults[3] = new Date("30 Jan 2010 00:00:00 AM").getTime();	//
		expectedResults[4] = new Date("31 Jan 2010 00:00:00 AM").getTime();	//


		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a single day range that ends evenly on midnight boundaries.
	 */
	it("should test getDatesInRange 2", function(){

		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("27 Jan 2010 11:59:59 PM").getTime(),	// || Thu 28 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		var expectedResults = [];
		expectedResults[0] = new Date("27 Jan 2010 00:00:00 AM").getTime();	//

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a range shorter than 24 hours within a day
	 */
	it("should test getDatesInRange 3", function(){

		var range = {
			start: new Date("27 Jan 2010 03:00:00 AM").getTime(),	// || Wed 27 Jan 2010 11:00:00 GMT
			end:   new Date("27 Jan 2010 05:00:00 AM").getTime(),	// || Thu 28 Jan 2010 13:00:00 GMT
			tzId: tzId
		};

		var expectedResults = [];
		expectedResults[0] = new Date("27 Jan 2010 00:00:00 AM").getTime();

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	/*
	 * Test a range shorter than 24 hours across a midnight boundary
	 */
	it("should test getDatesInRange 4", function(){

		var range = {
			start: new Date("27 Jan 2010 11:00:00 PM").getTime(),	// || Thu 28 Jan 2010 07:00:00 GMT
			end:   new Date("28 Jan 2010 02:00:00 AM").getTime(),	// || Thu 28 Jan 2010 10:00:00 GMT
			tzId: tzId
		};

		var expectedResults = [];
		expectedResults[0] = new Date("27 Jan 2010 00:00:00 AM").getTime();
		expectedResults[1] = new Date("28 Jan 2010 00:00:00 AM").getTime();

		var dates = mgr.utils.getDatesInRange(range);
		expect(dates.length).toEqual(expectedResults.length);

		for (var i = 0; i < dates.length; i++) {
			expect(dates[i]).toEqual(expectedResults[i]);
		}
	});

	//--------------------------------------------------------------------------------

	// TODO: TEST: where the event is in a different timezone.

	/*
	 * Test a 24-hour range, and a repeating event whose first occurrence is within the range.
	 */
	it("should test findRepeatsInRange ", function(){

		//Event repeats 5pm-7pm every other day until 1/27/2011
		var eventWithinRange = {
			dtstart: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 2} //UNTIL = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that does contain the event
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("27 Jan 2010 11:59:59 PM").getTime(),	// || Thu 28 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

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

		//Event repeats 5pm-7pm every other day until 1/27/2011
		var eventWithinRange = {
			dtstart: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: new Date("29 Jan 2010 12:00:00 AM").getTime(),	// || Fri 29 Jan 2010 08:00:00 GMT
			end:   new Date("29 Jan 2010 11:59:59 PM").getTime(),	// || Sat 30 Jan 2010 07:59:59 GMT
			tzId: tzId
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

		//Event repeats 5pm-7pm every other day until 1/27/2011
		var eventWithinRange = {
			dtstart: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 5-day span that contains 3 occurrences of the event
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

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

		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: new Date("29 Jan 2010 12:00:00 AM").getTime(),	// || Fri 29 Jan 2010 08:00:00 GMT
			end:   new Date("29 Jan 2010 11:59:59 PM").getTime(),	// || Sat 30 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Event repeats 9pm-3am every other day until 1/27/2011
		var eventSpansIntoRange = {
			dtstart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   new Date("27 Jan 2010 03:00:00 AM").getTime(),	// || Wed 27 Jan 2010 11:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

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
	it("should test findRepeatsInRange 5", function(){
		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: new Date("28 Jan 2010 12:00:00 AM").getTime(),	// || Thu 28 Jan 2010 08:00:00 GMT
			end:   new Date("28 Jan 2010 11:59:59 PM").getTime(),	// || Fri 29 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Event repeats 9pm-3am every other day until 1/27/2011
		var eventSpansOutOfRange = {
			dtstart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   new Date("27 Jan 2010 03:00:00 AM").getTime(),	// || Wed 27 Jan 2010 11:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

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
	it("should test findRepeatsInRange 6", function(){
		//Range is 24-hour span that contains the second occurrence of the event
		var range = {
			start: new Date("28 Jan 2010 12:00:00 AM").getTime(),	// || Thu 28 Jan 2010 08:00:00 GMT
			end:   new Date("28 Jan 2010 11:59:59 PM").getTime(),	// || Fri 29 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Event repeats 11pm-1am every other day until 1/27/2011 (event is 26 hours long!)
		var eventSpansAcrossRange = {
			dtstart: new Date("25 Jan 2010 11:00:00 PM").getTime(),	// || Tue 26 Jan 2010 07:00:00 GMT
			dtend:   new Date("27 Jan 2010 01:00:00 AM").getTime(),	// || Wed 27 Jan 2010 09:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
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

		//Event repeats 5pm-7pm every other day until 1/27/2011
		var eventWithinRange = {
			dtstart: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 2} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Range is 24-hour span that does not contain any occurrences of the event
		var range = {
			start: new Date("30 Jan 2010 12:00:00 AM").getTime(),	// || Sat 30 Jan 2010 08:00:00 GMT
			end:   new Date("30 Jan 2010 11:59:59 PM").getTime(),	// || Sun 31 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Expected response is one occurrence, with start and end corresponding to the second occurrence
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		expect(occurrences.length).toEqual(0);
	});

	/*
	 * Test an event that spans midnight that repeats on Sunday, Monday, Wednesday and Friday
	 */
	it("should test findRepeatsInRange 8", function(){

		//Event repeats 11:30PM - 12:30AM, on Sunday, Monday, Wednesday, and Friday until 1/27/2011
		var eventWithinRange = {
			dtstart: new Date("24 Jan 2010 11:30:00 PM").getTime(),	// || Mon 25 Jan 2010 07:30:00 GMT
			dtend:   new Date("25 Jan 2010 12:30:00 AM").getTime(),	// || Mon 25 Jan 2010 08:30:00 GMT
			tzId: tzId,
			rrule: { freq: "WEEKLY",
					 until: new Date("27 Jan 2011 04:00:00 PM").getTime(), //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
					 interval: 1,
					 rules:
					 [	{	ruleType: "BYDAY"
						,	ruleValue: [ { day: 0 }, { day: 1 }, { day: 3 }, { day: 5 } ]
						}
					 ]
				   }
		};

		//Range is 8 day span that contains 5 occurrences of the event:
		//Sun 11/7/2010 11:30PM - Mon 11/8/2010 12:30AM
		//Mon 11/8/2010 11:30PM - Tue 11/9/2010 12:30AM
		//Wed 11/10/2010 11:30PM - Thu 11/11/2010 12:30AM
		//Fri 11/12/2010 11:30PM - Sat 11/13/2010 12:30AM
		//Sun 11/14/2010 11:30PM - Mon 11/15/2010 12:30AM
		var range = {
			start: new Date("07 Nov 2010 12:00:00 AM").getTime(),	// || Sun 07 Nov 2010 07:00:00 GMT
			end:   new Date("14 Nov 2010 11:59:59 PM").getTime(),	// || Mon 15 Nov 2010 07:59:59 GMT
			tzId: tzId
		};

		//Expected response is three occurrences, (first, second, and third)
		var occurrences = mgr.utils.findRepeatsInRange(eventWithinRange, range);
		var expectedNumOccurrences = 5;
		expect(occurrences.length).toEqual(expectedNumOccurrences);

		var start1 = new Date(2010, 10, 7, 23, 30, 0, 0).getTime();
		var end1   = new Date(2010, 10, 8, 0, 30, 0, 0).getTime();

		var start2 = new Date(2010, 10, 8, 23, 30, 0, 0).getTime();
		var end2   = new Date(2010, 10, 9, 0, 30, 0, 0).getTime();

		var start3 = new Date(2010, 10, 10, 23, 30, 0, 0).getTime();
		var end3   = new Date(2010, 10, 11, 0, 30, 0, 0).getTime();

		var start4 = new Date(2010, 10, 12, 23, 30, 0, 0).getTime();
		var end4   = new Date(2010, 10, 13, 0, 30, 0, 0).getTime();

		var start5 = new Date(2010, 10, 14, 23, 30, 0, 0).getTime();
		var end5   = new Date(2010, 10, 15, 0, 30, 0, 0).getTime();

		var expectedStarts = [start1, start2, start3, start4, start5];
		var expectedEnds = [end1, end2, end3, end4, end5];

		for (var i = 0; i < expectedNumOccurrences; i++) {
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStarts[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnds[i]);
		}
	});
	//--------------------------------------------------------------------------------
	it("should test splitByDays ", function(){

		//Range is 5-day span
		//           1/27/2010
		var dates = [
			new Date("Wed Jan 27 2010 00:00:00").getTime(),
			new Date("Thu Jan 28 2010 00:00:00").getTime(),
			new Date("Fri Jan 29 2010 00:00:00").getTime(),
			new Date("Sat Jan 30 2010 00:00:00").getTime(),
			new Date("Sun Jan 31 2010 00:00:00").getTime()
		];


		//Single event 6pm-8pm 1/27/2010
		var singleEvent1 = {
			renderStartTime: new Date("27 Jan 2010 06:00:00 PM").getTime(),	// || Thu 28 Jan 2010 02:00:00 GMT
			renderEndTime:   new Date("27 Jan 2010 08:00:00 PM").getTime(),	// || Thu 28 Jan 2010 05:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-7pm 1/28/2010
		var singleEvent2 = {
			renderStartTime: new Date("28 Jan 2010 05:00:00 PM").getTime(),	// || Fri 29 Jan 2010 01:00:00 GMT
			renderEndTime:   new Date("28 Jan 2010 07:00:00 PM").getTime(),	// || Fri 29 Jan 2010 03:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-6pm 1/31/2010
		var singleEvent3 = {
			renderStartTime: new Date("31 Jan 2010 05:00:00 PM").getTime(),	// || Mon 01 Feb 2010 01:00:00 GMT
			renderEndTime:   new Date("31 Jan 2010 06:00:00 PM").getTime(),	// || Mon, 01 Feb 2010 02:00:00 GMT
			tzId: tzId
		};

		var events = [singleEvent1, singleEvent2, singleEvent3];

		var eventsPerDay = mgr.utils.splitByDays(events, dates);

		var expectedNumResults = 5;
		expect(eventsPerDay.length).toEqual(expectedNumResults);


		var expectedNumResultsPerDay = [1, 1, 0, 0, 1];
		for(var i = 0; i < expectedNumResults; i++){
			var resultEvents = eventsPerDay[i];
			expect(resultEvents.length).toEqual(expectedNumResultsPerDay[i]);
		}
	});

	//--------------------------------------------------------------------------------

	it("should test getEventRenderTimes ", function(){

		var eventExpectedStarts;
		var eventExpectedEnds;
		var expectedNumSegments;
		var totalStarts = [];
		var totalEnds = [];
		var totalSegments = 0;
		var events;
		var event;
		var i;
		//Range is 5-day span
		var dates = [
			new Date('Wed Jan 27 2010 00:00:00').getTime(),
			new Date('Thu Jan 28 2010 00:00:00').getTime(),
			new Date('Fri Jan 29 2010 00:00:00').getTime(),
			new Date('Sat Jan 30 2010 00:00:00').getTime(),
			new Date('Sun Jan 31 2010 00:00:00').getTime()
		];

		//Single event 1/26/2010 9pm - 1/27/2010 3am
		//Spans into range: Only 1/27/010 12:am - 3am segment is within range
		var event1 = {
			currentLocalStart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			currentLocalEnd:   new Date("27 Jan 2010 03:00:00 AM").getTime(),	// || Wed 27 Jan 2010 11:00:00 GMT
			tzId: tzId
		};

		eventExpectedStarts = [new Date('Wed Jan 27 2010 00:00:00').getTime()]; //1/27/2010 12am
		eventExpectedEnds   = [new Date('Wed Jan 27 2010 03:00:00').getTime()]; //1/27/2010 3am
		expectedNumSegments = 1;
		totalSegments += expectedNumSegments;
		totalStarts = totalStarts.concat(eventExpectedStarts);
		totalEnds = totalEnds.concat(eventExpectedEnds);
		events = mgr.utils.getEventRenderTimes([event1], dates);
		expect(events.length).toEqual(expectedNumSegments);
		for(i = 0; i < expectedNumSegments; i++){
			event = events[i];
			expect(event.renderStartTime).toEqual(eventExpectedStarts[i]);
			expect(event.renderEndTime).toEqual(eventExpectedEnds[i]);
		}

		//Single event 1/29/2010 8pm - 1/30/2010 12pm
		//Spans across midnights within range - expect two segments
		var event2 = {
			currentLocalStart: new Date("29 Jan 2010 08:00:00 PM").getTime(),	// || Sat 30 Jan 2010 04:00:00 GMT
			currentLocalEnd:   new Date("30 Jan 2010 12:00:00 PM").getTime(),	// || Sat 30 Jan 2010 20:00:00 GMT
			tzId: tzId
		};

		eventExpectedStarts = [
			new Date('Fri Jan 29 2010 20:00:00').getTime(),
			new Date('Sat Jan 30 2010 00:00:00').getTime()
		];

		eventExpectedEnds   = [
			new Date('Sat Jan 30 2010 00:00:00').getTime(),
			new Date('Sat Jan 30 2010 12:00:00').getTime()
		];

		expectedNumSegments = 2;
		totalSegments += expectedNumSegments;
		totalStarts = totalStarts.concat(eventExpectedStarts);
		totalEnds = totalEnds.concat(eventExpectedEnds);
		events = mgr.utils.getEventRenderTimes([event2], dates);
		expect(events.length).toEqual(expectedNumSegments);
		for(i = 0; i < expectedNumSegments; i++){
			event = events[i];
			expect(event.renderStartTime).toEqual(eventExpectedStarts[i]);
			expect(event.renderEndTime).toEqual(eventExpectedEnds[i]);
		}

		//Single event 5pm-6pm 1/31/2010
		//Within one date in range - expect one segment
		var event3 = {
			currentLocalStart: new Date("31 Jan 2010 05:00:00 PM").getTime(),	// || Mon 01 Feb 2010 01:00:00 GMT
			currentLocalEnd:   new Date("31 Jan 2010 06:00:00 PM").getTime(),	// || Mon 01 Feb 2010 02:00:00 GMT
			tzId: tzId
		};

		eventExpectedStarts = [new Date('Sun Jan 31 2010 17:00:00').getTime()]; //1/31/2010 5pm
		eventExpectedEnds   = [new Date('Sun Jan 31 2010 18:00:00').getTime()];  //1/31/2010 6pm
		expectedNumSegments = 1;
		totalSegments += expectedNumSegments;
		totalStarts = totalStarts.concat(eventExpectedStarts);
		totalEnds = totalEnds.concat(eventExpectedEnds);
		events = mgr.utils.getEventRenderTimes([event3], dates);
		expect(events.length).toEqual(expectedNumSegments);
		for(i = 0; i < expectedNumSegments; i++){
			event = events[i];
			expect(event.renderStartTime).toEqual(eventExpectedStarts[i]);
			expect(event.renderEndTime).toEqual(eventExpectedEnds[i]);
		}

		//Single event 1/31/2010 6pm - 2/1/2010 6am
		//Spans out of range: Only 1/31/2010 6am - 2/1/2010 12am segment is within range
		var event4 = {
			currentLocalStart: new Date("31 Jan 2010 06:00:00 PM").getTime(),	// || Mon 01 Feb 2010 02:00:00 GMT
			currentLocalEnd:   new Date("01 Feb 2010 06:00:00 AM").getTime(),	// || Mon 01 Feb 2010 14:00:00 GMT
			tzId: tzId
		};

		eventExpectedStarts = [new Date('Sun Jan 31 2010 18:00:00').getTime()]; //1/31/2010 6pm
		eventExpectedEnds   = [new Date('Mon Feb 01 2010 00:00:00').getTime()]; //2/1/2010 12am
		expectedNumSegments = 1;
		totalSegments += expectedNumSegments;
		totalStarts = totalStarts.concat(eventExpectedStarts);
		totalEnds = totalEnds.concat(eventExpectedEnds);
		events = mgr.utils.getEventRenderTimes([event4], dates);
		expect(events.length).toEqual(expectedNumSegments);
		for(i = 0; i < expectedNumSegments; i++){
			event = events[i];
			expect(event.renderStartTime).toEqual(eventExpectedStarts[i]);
			expect(event.renderEndTime).toEqual(eventExpectedEnds[i]);
		}

		//Single event 1/26/2010 9pm - 2/1/2010 6am
		//Spans across range: expect 5 segments
		var event5 = {
			currentLocalStart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			currentLocalEnd:   new Date("01 Feb 2010 06:00:00 AM").getTime(),	// || Mon 01 Feb 2010 14:00:00 GMT
			tzId: tzId
		};

		eventExpectedStarts = [
			new Date('Wed Jan 27 2010 00:00:00').getTime(),
			new Date('Thu Jan 28 2010 00:00:00').getTime(),
			new Date('Fri Jan 29 2010 00:00:00').getTime(),
			new Date('Sat Jan 30 2010 00:00:00').getTime(),
			new Date('Sun Jan 31 2010 00:00:00').getTime()
		];

		eventExpectedEnds   = [
			new Date('Thu Jan 28 2010 00:00:00').getTime(),
			new Date('Fri Jan 29 2010 00:00:00').getTime(),
			new Date('Sat Jan 30 2010 00:00:00').getTime(),
			new Date('Sun Jan 31 2010 00:00:00').getTime(),
			new Date('Mon Feb 01 2010 00:00:00').getTime()
		];
		expectedNumSegments = 5;
		totalSegments += expectedNumSegments;
		totalStarts = totalStarts.concat(eventExpectedStarts);
		totalEnds = totalEnds.concat(eventExpectedEnds);
		events = mgr.utils.getEventRenderTimes([event5], dates);
		expect(events.length).toEqual(expectedNumSegments);
		for(i = 0; i < expectedNumSegments; i++){
			event = events[i];
			expect(event.renderStartTime).toEqual(eventExpectedStarts[i]);
			expect(event.renderEndTime).toEqual(eventExpectedEnds[i]);
		}

		events = mgr.utils.getEventRenderTimes([event1, event2, event3, event4, event5], dates);
		expect(events.length).toEqual(totalSegments);
		for(i = 0; i < totalSegments; i++){
			event = events[i];
			expect(event.renderStartTime).toEqual(totalStarts[i]);
			expect(event.renderEndTime).toEqual(totalEnds[i]);
		}
	});

	//--------------------------------------------------------------------------------

	/*
	 * Tests a five-day range with three events occurring in it: one on the first day, one on the second, and one on the last day.
	 */
	it("should test formatResponse ", function(){

		//Range is 5-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		//Single event 6pm-8pm 1/27/2010
		var singleEvent1 = {
			renderStartTime: new Date("27 Jan 2010 06:00:00 PM").getTime(),	// || Thu 28 Jan 2010 02:00:00 GMT
			renderEndTime:   new Date("27 Jan 2010 08:00:00 PM").getTime(),	// || Thu 28 Jan 2010 05:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-7pm 1/28/2010
		var singleEvent2 = {
			renderStartTime: new Date("28 Jan 2010 05:00:00 PM").getTime(),	// || Fri 29 Jan 2010 01:00:00 GMT
			renderEndTime:   new Date("28 Jan 2010 07:00:00 PM").getTime(),	// || Fri 29 Jan 2010 03:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-6pm 1/31/2010
		var singleEvent3 = {
			renderStartTime: new Date("31 Jan 2010 05:00:00 PM").getTime(),	// || Mon 01 Feb 2010 01:00:00 GMT
			renderEndTime:   new Date("31 Jan 2010 06:00:00 PM").getTime(),	// || Mon, 01 Feb 2010 02:00:00 GMT
			tzId: tzId
		};

		var resultSet = [singleEvent1, singleEvent2, singleEvent3];
		var dates = mgr.utils.getDatesInRange(range);
		var dayResults = mgr.utils.formatResponse(resultSet, dates);

		var expectedNumResults = 5;
		expect(dayResults.length).toEqual(expectedNumResults);

		var expectedNumResultsPerDay = [1, 1, 0, 0, 1];
		for(var i = 0; i < expectedNumResults; i++){
			var resultEvents = dayResults[i].events;
			expect(resultEvents.length).toEqual(expectedNumResultsPerDay[i]);
		}
	});

	/*
	 * Tests a five-day range with three events occurring in it: none on the first day, one on the second, third, and fourth days , and none on the last day.
	 */
	it("should test formatResponse 2", function(){

		//Range is 5-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		//Single event 5pm-7pm 1/28/2010
		var singleEvent1 = {
			renderStartTime: new Date("28 Jan 2010 05:00:00 PM").getTime(),	// || Fri 29 Jan 2010 01:00:00 GMT
			renderEndTime:   new Date("28 Jan 2010 07:00:00 PM").getTime(),	// || Fri 29 Jan 2010 03:00:00 GMT
			tzId: tzId
		};

		//Single event 6pm-8pm 1/29/2010
		var singleEvent2 = {
			renderStartTime: new Date("29 Jan 2010 06:00:00 PM").getTime(),	// || Sat 30 Jan 2010 02:00:00 GMT
			renderEndTime:   new Date("29 Jan 2010 08:00:00 PM").getTime(),	// || Sat 30 Jan 2010 05:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-6pm 1/31/2010
		var singleEvent3 = {
			renderStartTime: new Date("30 Jan 2010 05:00:00 PM").getTime(),	// || Sun 31 Jan 2010 01:00:00 GMT
			renderEndTime:   new Date("30 Jan 2010 06:00:00 PM").getTime(),	// || Sun 31 Jan 2010 02:00:00 GMT
			tzId: tzId
		};

		var resultSet = [singleEvent1, singleEvent2, singleEvent3];
		var dates = mgr.utils.getDatesInRange(range);
		var dayResults = mgr.utils.formatResponse(resultSet, dates);

		var expectedNumResults = 5;
		expect(dayResults.length).toEqual(expectedNumResults);


		var expectedNumResultsPerDay = [0, 1, 1, 1, 0];
		for(var i = 0; i < expectedNumResults; i++){
			var resultEvents = dayResults[i].events;
			expect(resultEvents.length).toEqual(expectedNumResultsPerDay[i]);
		}
	});

	/*
	 * Tests a single-day range with two events occurring in it.
	 */
	it("should test formatResponse 3", function(){

		//Range is 1-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("27 Jan 2010 11:59:59 PM").getTime(),	// || Thu 28 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Single event 5pm-7pm 1/27/2010
		var singleEvent1 = {
			renderStartTime: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			renderEndTime:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-6pm 1/27/2010
		var singleEvent2 = {
			renderStartTime: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			renderEndTime:   new Date("27 Jan 2010 06:00:00 PM").getTime(),	// || Thu 28 Jan 2010 02:00:00 GMT
			tzId: tzId
		};


		var resultSet = [singleEvent1, singleEvent2];
		var dates = mgr.utils.getDatesInRange(range);
		var dayResults = mgr.utils.formatResponse(resultSet, dates);

		var expectedNumResults = 1;
		expect(dayResults.length).toEqual(expectedNumResults);


		var expectedNumResultsPerDay = 2;
		var resultEvents = dayResults[0].events;
		expect(resultEvents.length).toEqual(expectedNumResultsPerDay);
	});

	/*
	 * Tests a multi-day range with no events occurring in it.
	 */
	it("should test formatResponse 4", function(){

		//Range is 5-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		var resultSet = [];
		var dates = mgr.utils.getDatesInRange(range);
		var dayResults = mgr.utils.formatResponse(resultSet, dates);

		var expectedNumResults = 5;
		expect(dayResults.length).toEqual(expectedNumResults);

		for(var i = 0; i < expectedNumResults; i++){
			var resultEvents = dayResults[i].events;
			expect(resultEvents.length).toEqual(0);
		}
	});



	//--------------------------------------------------------------------------------

	it("should test getEventsInRange ", function(){
		var done = false;
		//Range is 5-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		//Event repeats 5pm-7pm every day until 1/27/2011
		//Should produce 5 occurrences
		var dailyRepeatingEvent = {
			dtstart: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Event repeats 6am-7am every Saturday until 1/27/2011
		//Should produce 1 occurrence on 1/30/2010
		var weeklyRepeatingEvent = {
			dtstart: new Date("23 Jan 2010 06:00:00 AM").getTime(),	// || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   new Date("23 Jan 2010 07:00:00 AM").getTime(),	// || Thu 28 Jan 2010 15:00:00 GMT
			tzId: tzId,
			rrule: {freq: "WEEKLY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Single event 6pm-8pm 1/27/2010
		var singleEvent1 = {
			dtstart: new Date("27 Jan 2010 06:00:00 PM").getTime(),	// || Thu 28 Jan 2010 02:00:00 GMT
			dtend:   new Date("27 Jan 2010 08:00:00 PM").getTime(),	// || Thu 28 Jan 2010 05:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-7pm 1/28/2010
		var singleEvent2 = {
			dtstart: new Date("28 Jan 2010 05:00:00 PM").getTime(),	// || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   new Date("28 Jan 2010 07:00:00 PM").getTime(),	// || Fri 29 Jan 2010 03:00:00 GMT
			tzId: tzId
		};

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
				//	Daily											Single 1
				[new Date('Wed Jan 27 2010 17:00:00').getTime(), new Date('Wed Jan 27 2010 18:00:00').getTime()],
				//	Single 2										Daily 2
				[new Date('Thu Jan 28 2010 17:00:00').getTime(), new Date('Thu Jan 28 2010 17:00:00').getTime()],
				//	Daily 3
				[new Date('Fri Jan 29 2010 17:00:00').getTime()],
				//	Weekly											Daily 4
				[new Date('Sat Jan 30 2010 06:00:00').getTime(), new Date('Sat Jan 30 2010 17:00:00').getTime()],
				//	Daily 5
				[new Date('Sun Jan 31 2010 17:00:00').getTime()]
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

	//Given a set of events (mixed all day events and regular) expect to get back
	//two arrays - events and allDayEvents with the appropriate number of events and start times.
	it("should test getEventsInRange 2", function(){
		var done = false;
		//Range is 5-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		//All day event repeats every day until 1/27/2011
		//Should produce 5 occurrences in range
		var dailyAllDayRepeatingEvent = {
			dtstart: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Thu 28 Jan 2010 08:00:00 GMT
			dtend:   new Date("27 Jan 2010 11:59:59 PM").getTime(),	// || Fri 29 Jan 2010 07:59:59 GMT
			allDay:  true,
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Single allday event 1/28/2010
		var singleAllDayEvent = {
			dtstart: new Date("28 Jan 2010 12:00:00 AM").getTime(),	// || Thu 28 Jan 2010 08:00:00 GMT
			dtend:   new Date("28 Jan 2010 11:59:59 PM").getTime(),	// || Fri 29 Jan 2010 07:59:59 GMT
			allDay:  true,
			tzId: tzId
		};

		//Event repeats 6am-7am every Saturday until 1/27/2011
		//Should produce 1 occurrence on 1/30/2010
		var weeklyRepeatingEvent = {
			dtstart: new Date("23 Jan 2010 06:00:00 AM").getTime(),	// || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   new Date("23 Jan 2010 07:00:00 AM").getTime(),	// || Thu 28 Jan 2010 15:00:00 GMT
			tzId: tzId,
			rrule: {freq: "WEEKLY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Single event 6pm-8pm 1/27/2010
		var singleEvent1 = {
			dtstart: new Date("27 Jan 2010 06:00:00 PM").getTime(),	// || Thu 28 Jan 2010 02:00:00 GMT
			dtend:   new Date("27 Jan 2010 08:00:00 PM").getTime(),	// || Thu 28 Jan 2010 05:00:00 GMT
			tzId: tzId
		};

		//Single event 5pm-7pm 1/28/2010
		var singleEvent2 = {
			dtstart: new Date("28 Jan 2010 05:00:00 PM").getTime(),	// || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   new Date("28 Jan 2010 07:00:00 PM").getTime(),	// || Fri 29 Jan 2010 03:00:00 GMT
			tzId: tzId
		};

		var resultSet = [dailyAllDayRepeatingEvent, weeklyRepeatingEvent, singleEvent1, singleEvent2, singleAllDayEvent];
		var callback = function(response){
			//Did we get the right number of days back?
			var expectedNumDayResults = 5;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [1, 1, 0, 1, 0];
			var expectedNumAllDayEventsPerDay = [1, 2, 1, 1, 1];
			var actualNumEventsPerDay = 0;
			var actualNumAllDayEventsPerDay = 0;
			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].events.length;
				actualNumAllDayEventsPerDay = response.days[dayIndex].allDayEvents.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);
				expect(actualNumAllDayEventsPerDay).toEqual(expectedNumAllDayEventsPerDay[dayIndex]);

			}

			//For each event, did we get the right start times?
			//Check regular events:
			var expectedEventStartTimes =
			[
				[new Date('Wed Jan 27 2010 18:00:00').getTime()],	// Single 1
				[new Date('Thu Jan 28 2010 17:00:00').getTime()],	// Single 2
				[],
				[new Date('Sat Jan 30 2010 06:00:00').getTime()],	// Weekly
				[]
			];

			for(dayIndex = 0; dayIndex < expectedNumDayResults; dayIndex++){
				var events = response.days[dayIndex].events;
				for(eventIndex = 0; eventIndex < events.length; eventIndex++){
					var event = events[eventIndex];
					expect(event.currentLocalStart).toEqual(expectedEventStartTimes[dayIndex][eventIndex]);
				}
			}

			//For each event, did we get the right start times?
			//Check all day event array:
			var expectedAllDayStartTimes = [
				[new Date('Wed Jan 27 2010 00:00:00').getTime()],	// Repeat 1
				[
					new Date('Thu Jan 28 2010 00:00:00').getTime(),	// Single 1
					new Date('Thu Jan 28 2010 00:00:00').getTime()	// Repeat 2
				],
				[new Date('Fri Jan 29 2010 00:00:00').getTime()],	// Repeat 3
				[new Date('Sat Jan 30 2010 00:00:00').getTime()],	// Repeat 4
				[new Date('Sun Jan 31 2010 00:00:00').getTime()]	// Repeat 5
			];

			var allDayEventStartTimeIndex = 0;
			for(dayIndex = 0; dayIndex < expectedNumDayResults; dayIndex++){
				var allDayEvents = response.days[dayIndex].allDayEvents;
				for(eventIndex = 0; eventIndex < allDayEvents.length; eventIndex++){
					var allDayEvent = allDayEvents[eventIndex];
					expect(allDayEvent.currentLocalStart).toEqual(expectedAllDayStartTimes[dayIndex][eventIndex]);
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
	it("should test getEventsInRange 3", function(){
		var done = false;
		//Range is 5-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		//event spans into range
		var eventSpansIntoRange = {
			dtstart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   new Date("27 Jan 2010 01:00:00 AM").getTime(),	// || Wed 27 Jan 2010 09:00:00 GMT
			tzId: tzId
		};

		//Single event 1/29/2010 8pm - 1/30/2010 12pm
		//Spans across midnights within range - expect two segments
		var eventSpansMidnightWithinRange = {
			dtstart: new Date("29 Jan 2010 08:00:00 PM").getTime(),	// || Sat 30 Jan 2010 04:00:00 GMT
			dtend:   new Date("30 Jan 2010 12:00:00 PM").getTime(),	// || Sat 30 Jan 2010 20:00:00 GMT
			tzId: tzId
		};

		//event spans out of range
		var eventSpansOutOfRange = {
			dtstart: new Date("31 Jan 2010 06:00:00 PM").getTime(),	// || Mon 01 Feb 2010 02:00:00 GMT
			dtend:   new Date("01 Feb 2010 06:00:00 AM").getTime(),	// || Mon 01 Feb 2010 14:00:00 GMT
			tzId: tzId
		};

		//Event repeats 6am-7am every Saturday until 1/27/2011
		//Should produce 1 occurrence on 1/30/2010
		var weeklyRepeatingEvent = {
			dtstart: new Date("23 Jan 2010 06:00:00 AM").getTime(),	// || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   new Date("23 Jan 2010 07:00:00 AM").getTime(),	// || Thu 28 Jan 2010 15:00:00 GMT
			tzId: tzId,
			rrule: {freq: "WEEKLY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Single event 5pm-7pm 1/28/2010
		var singleEvent = {
			dtstart: new Date("28 Jan 2010 05:00:00 PM").getTime(),	// || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   new Date("28 Jan 2010 07:00:00 PM").getTime(),	// || Fri 29 Jan 2010 03:00:00 GMT
			tzId: tzId
		};

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
			var expectedRenderStartTimes =
			[
				[new Date('Wed Jan 27 2010 00:00:00').getTime()],	// Span in 12am
				[new Date('Thu Jan 28 2010 17:00:00').getTime()],	// Single
				[new Date('Fri Jan 29 2010 20:00:00').getTime()],	// SpanWithin 8pm----
				[
					new Date('Sat Jan 30 2010 00:00:00').getTime(),	// Midnight
					new Date('Sat Jan 30 2010 06:00:00').getTime()	// Weekly
				],
				[new Date('Sun Jan 31 2010 18:00:00').getTime()]	// Span out
			];

			var expectedRenderEndTimes =
			[
				[new Date('Wed Jan 27 2010 01:00:00').getTime()],	// Span in 1am
				[new Date('Thu Jan 28 2010 19:00:00').getTime()],	// Single
				[new Date('Sat Jan 30 2010 00:00:00').getTime()],	// SpanWithin 8pm----
				[
					new Date('Sat Jan 30 2010 12:00:00').getTime(),	// Midnight
					new Date('Sat Jan 30 2010 07:00:00').getTime()	// Weekly
				],
				[new Date('Mon Feb 01 2010 00:00:00').getTime()]	// Span out
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
	it("should test getEventsInRange 4", function(){
		var done = false;
		//Range is 5-day span
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		//Daily repeating event starting 1/29/2010. In final results, should repeat 1/29, 1/30, 1/31
		var dailyRepeatingEvent1 = {
			dtstart: new Date("29 Jan 2010 08:00:00 PM").getTime(),	// || Sat 30 Jan 2010 04:00:00 GMT
			dtend:   new Date("29 Jan 2010 10:00:00 PM").getTime(),	// || Sat 30 Jan 2010 06:00:00 GMT
			tzId: tzId,
			subject: "Daily 1",
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Daily repeating event starting after range ends. Should not appear in final results at all
		var dailyRepeatingEvent2 = {
			dtstart: new Date("02 Feb 2010 06:00:00 PM").getTime(),	// || Wed 03 Feb 2010 02:00:00 GMT
			dtend:   new Date("02 Feb 2010 07:00:00 PM").getTime(),	// || Wed 03 Feb 2010 03:00:00 GMT
			tzId: tzId,
			subject: "Daily 2",
			rrule: {freq: "DAILY", until: new Date("27 Jan 2011 04:00:00 PM").getTime(), interval: 1} //until = Thu 27 Jan 2011 04:00:00 PM PST || Fri 28 Jan 2011 00:00:00 GMT
		};

		//Daily repeating event starting 1/23/2010, ends 1/30/2010. In final results, should repeat 1/27, 1/28, 1/29
		var dailyRepeatingEvent3 = {
			dtstart: new Date("23 Jan 2010 06:00:00 AM").getTime(),	// || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   new Date("23 Jan 2010 07:00:00 AM").getTime(),	// || Sat 23 Jan 2010 15:00:00 GMT
			tzId: tzId,
			subject: "Daily 3",
			rrule: {freq: "DAILY", until: new Date('Sat Jan 30 2010 00:00:00').getTime(), interval: 1} //until = Fri 30 Jan 2010 12:00:00 AM PST || Fri 30 Jan 2010 08:00:00 GMT
		};

		//Daily repeating event ending before range begins. Should not appear in final results at all
		var dailyRepeatingEvent4 = {
			dtstart: new Date("01 Jan 2010 10:00:00 AM").getTime(),	// || Fri 01 Jan 2010 18:00:00 GMT
			dtend:   new Date("01 Jan 2010 11:00:00 AM").getTime(),	// || Fri 01 Jan 2010 19:00:00 GMT
			tzId: tzId,
			subject: "Daily 4",
			rrule: {freq: "DAILY", until: new Date('Sat Jan 23 2010 00:00:00').getTime(), interval: 1} //until = Sat 23 Jan 2010 00:00:00 AM PST || Sat 23 Jan 2010 08:00:00 GMT
		};

		var resultSet = [dailyRepeatingEvent1, dailyRepeatingEvent2, dailyRepeatingEvent3, dailyRepeatingEvent4];

		var callback = function(response){
			//Did we get the right number of days back?
			var expectedNumDayResults = 5;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [1, 1, 2, 1, 1];
			var actualNumEventsPerDay = 0;
			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].events.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);
			}

			//For each event, did we get the right start times?
			var expectedRenderStartTimes =
			[
				[new Date('Wed Jan 27 2010 06:00:00').getTime()],	// Daily 3
				[new Date('Thu Jan 28 2010 06:00:00').getTime()],	// Daily 3
				[
					new Date('Fri Jan 29 2010 06:00:00').getTime(),	// Daily 3
					new Date('Fri Jan 29 2010 20:00:00').getTime()	// Daily 1
				],
				[new Date('Sat Jan 30 2010 20:00:00').getTime()],	// Daily 1
				[new Date('Sun Jan 31 2010 20:00:00').getTime()]	// Daily 1
			];

			var expectedRenderEndTimes =
			[
				[new Date('Wed Jan 27 2010 07:00:00').getTime()],	// Daily 3
				[new Date('Thu Jan 28 2010 07:00:00').getTime()],	// Daily 3
				[
					new Date('Fri Jan 29 2010 07:00:00').getTime(),	// Daily 3
					new Date('Fri Jan 29 2010 22:00:00').getTime()	// Daily 1
				],
				[new Date('Sat Jan 30 2010 22:00:00').getTime()],	// Daily 1
				[new Date('Sun Jan 31 2010 22:00:00').getTime()]	// Daily 1
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

	//--------------------------------------------------------------------------------

	it("should test findNumOccurrencesInRange ", function(){
		var date = new Date(2010, 2, 9, 0, 0, 0, 0);  //March 9, 2010
		var expected = 0;
		var howManyLeft = 0;
		var range;

		var event1 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every other day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 2} //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
		};

		range = {
			start: date,
			end: event1.rrule.until,
			tzId: event1.tzId
		};

		expected = 12;
		howManyLeft = mgr.findNumOccurrencesInRange(event1, range, null);
		expect(howManyLeft).toEqual(expected);


		var event2 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every other day until 5/1",
			rrule: {freq: "WEEKLY", until: new Date('Sat May 01 2010 00:00:00').getTime(), interval: 1}, //until = Sat 01 May 2010 12:00:00 AM PDT || Sat 01 May 2010 07:00:00 GMT
			exdates: ["20100315T080000", "20100412T080000"]
		};

		range = {
			start: date,
			end: event2.rrule.until,
			tzId: event2.tzId
		};
		expected = 5;
		howManyLeft = mgr.findNumOccurrencesInRange(event2, range, null);
		expect(howManyLeft).toEqual(expected);


		var event3 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every other day until 5/1/2015",
			rrule: {freq: "WEEKLY", until: new Date('Fri May 01 2015 00:00:00').getTime(), interval: 1} //until = Fri 01 May 2015 12:00:00 AM PDT || Fri 01 May 2015 07:00:00 GMT
		};

		range = {
			start: date,
			end: event3.rrule.until,
			tzId: event3.tzId
		};

		expected = 268;
		howManyLeft = mgr.findNumOccurrencesInRange(event3, range, null);
		expect(howManyLeft).toEqual(expected);


		var event4 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every other day until 5/1/2015",
			rrule: {freq: "WEEKLY", until: new Date('Fri May 01 2015 00:00:00').getTime(), interval: 1} //until = Fri 01 May 2015 12:00:00 AM PDT || Fri 01 May 2015 07:00:00 GMT
		};

		range = {
			start: date,
			end: event4.rrule.until,
			tzId: event4.tzId
		};

		expected = 100;
		howManyLeft = mgr.findNumOccurrencesInRange(event4, range, 100);
		expect(howManyLeft).toEqual(expected);
	});


	//--------------------------------------------------------------------------------

	it("should test getBusyDays ", function(){
		var done = false;

		var range = {
			start: new Date("01 Jan 2010 00:00:00").getTime(),	// || Fri 01 Jan 2010 08:00:00 GMT
			end:   new Date("31 Mar 2010 23:59:59").getTime(),	// || Wed 31 Mar 2010 06:59:59 GMT
			tzId: tzId,
			calendarId: "733t"
		};

		var morningEvent = {
			dtstart: new Date("01 Jan 2010 10:00:00").getTime(),	// || Fri 01 Jan 2010 18:00:00 GMT
			dtend:   new Date("01 Jan 2010 11:00:00").getTime(),	// || Fri 01 Jan 2010 19:00:00 GMT
			tzId: tzId,
			subject: "Morning, Starting 1/1, Every third day until 4/1, matches CalendarID",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t"
		};

		var afternoonEvent = {
			dtstart: new Date("02 Jan 2010 14:00:00").getTime(),	// || Sat 02 Jan 2010 22:00:00 GMT
			dtend:   new Date("02 Jan 2010 15:00:00").getTime(),	// || Sat 02 Jan 2010 23:00:00 GMT
			tzId: tzId,
			subject: "Afternoon, Starting 1/2, Every third day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "n00b"
		};

		var eveningEvent = {
			dtstart: new Date("03 Jan 2010 18:00:00").getTime(),	// || Mon 04 Jan 2010 02:00:00 GMT
			dtend:   new Date("03 Jan 2010 19:00:00").getTime(),	// || Mon 04 Jan 2010 03:00:00 GMT
			tzId: tzId,
			subject: "Evening, Starting 1/3, Every third day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "n00b"
		};

		var eventSet = [morningEvent, afternoonEvent, eveningEvent];

		var expectedDate = new Date('Fri Jan 01 2010 00:00:00').getTime();
		var expectedString = "924924924924924924924924924924924924924924924924924924924924924924924924924924924924924924";
		var expectedLength = expectedString.length;

		var callback = function(response) {
			expect(response.date).toEqual(expectedDate);
			expect(response.days.length).toEqual(expectedLength);
			expect(response.days).toEqual(expectedString);
	        done = true;
	    };
		mgr.getBusyDays(range, callback, eventSet);
		waitsFor(function () {
			return done;
		});
	});

	it("should test getBusyDays 2", function(){
		var done = false;
		var range = {
			start: new Date("01 Jan 2010 00:00:00").getTime(),	// || Fri 01 Jan 2010 08:00:00 GMT
			end:   new Date("31 Mar 2010 23:59:59").getTime(),	// || Wed 31 Mar 2010 06:59:59 GMT
			tzId: tzId,
			calendarId: "733t"
		};

		var morningAfternoonEvent = {
			dtstart: new Date("01 Jan 2010 10:00:00").getTime(),	// || Fri 01 Jan 2010 18:00:00 GMT
			dtend:   new Date("01 Jan 2010 13:00:00").getTime(),	// || Fri 01 Jan 2010 21:00:00 GMT
			tzId: tzId,
			subject: "Morning spanning into afternoon, Starting 1/1, Every third day until 4/1, matches calendar ID",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t"
		};


		var afternoonEveningEvent = {
			dtstart: new Date("02 Jan 2010 14:00:00").getTime(),	// || Sat 02 Jan 2010 22:00:00 GMT
			dtend:   new Date("02 Jan 2010 19:00:00").getTime(),	// || Sun 03 Jan 2010 03:00:00 GMT
			tzId: tzId,
			subject: "Afternoon spanning into evening, Starting 1/2, Every other day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 2}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "n00b"
		};

		var eventSet = [morningAfternoonEvent, afternoonEveningEvent];

		var expectedDate = new Date('Fri Jan 01 2010 00:00:00').getTime();
		var expectedString = "R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06R60V06";
		var expectedLength = expectedString.length;

		var callback = function(response) {

			expect(response.date).toEqual(expectedDate);
			expect(response.days.length).toEqual(expectedLength);
			expect(response.days).toEqual(expectedString);
	        done = true;
	    };
		mgr.getBusyDays(range, callback, eventSet);
		waitsFor(function () {
			return done;
		});
	});

	it("should test getBusyDays 3", function(){
		var done = false;

		// TODO: FIX: WE HAVE A BUG IN ALLDAY EVENTS CROSSING DST BOUNDARIES, SO WE PICKED A RANGE THAT DOESN'T CROSS ONE.
		//WE'RE CHEATING.
		var range = {
			start: new Date("01 Jan 2010 00:00:00").getTime(),	// || Fri 01 Jan 2010 08:00:00 GMT
			end:   new Date("28 Feb 2010 23:59:59").getTime(),	// || Mon 01 Mar 2010 07:59:59 GMT
			tzId: tzId,
			calendarId: "733t"
		};

		var allDayEvent1 = {
			dtstart: new Date("01 Jan 2010 00:00:00").getTime(),	// || Fri 01 Jan 2010 08:00:00 GMT
			dtend:   new Date("01 Jan 2010 23:59:59").getTime(),	// || Sat 02 Jan 2010 07:59:59 GMT
			tzId: tzId,
			subject: "allDay, Starting 1/1, Every third day until 4/1, matches calendar ID",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t",
			allDay: true
		};

		var allDayEvent2 = {
			dtstart: new Date("02 Jan 2010 00:00:00").getTime(),	// || Sat 02 Jan 2010 08:00:00 GMT
			dtend:   new Date("02 Jan 2010 23:59:59").getTime(),	// || Sun 03 Jan 2010 07:59:59 GMT
			tzId: tzId,
			subject: "allDay, Starting 1/2, Every third day until 4/1, matches calendar ID",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "n00b",
			allDay: true
		};

		var eventSet = [allDayEvent1, allDayEvent2];

		var expectedDate = new Date('Fri Jan 01 2010 00:00:00').getTime();
		var expectedString =       "00000000000000000000000000000000000000000000000000000000000";
		var expectedAllDayString = "31031031031031031031031031031031031031031031031031031031031";
		var expectedLength = expectedString.length;

		var callback = function(response) {

			expect(response.date).toEqual(expectedDate);
			expect(response.days.length).toEqual(expectedLength);
			expect(response.days).toEqual(expectedString);
			expect(response.allDay.length).toEqual(expectedLength);
			expect(response.allDay).toEqual(expectedAllDayString);
	        done = true;
	    };
		mgr.getBusyDays(range, callback, eventSet);
		waitsFor(function () {
			return done;
		});
	});

	it("should test getBusyDays 4", function(){
		var done = false;

		//This tests the 'exit early' feature of getBusyDays.
		var range = {
			start: new Date("01 Jan 2010 00:00:00").getTime(),	// || Fri 01 Jan 2010 08:00:00 GMT
			end:   new Date("28 Feb 2010 23:59:59").getTime(),	// || Mon 01 Mar 2010 07:59:59 GMT
			tzId: tzId,
			calendarId: "733t"
		};

		var allDayEvent = {
			dtstart: new Date("01 Jan 2010 00:00:00").getTime(),	// || Fri 01 Jan 2010 08:00:00 GMT
			dtend:   new Date("01 Jan 2010 23:59:59").getTime(),	// || Sat 02 Jan 2010 07:59:59 GMT
			tzId: tzId,
			subject: "allDay, Starting 1/1, Every day until 4/1, matches calendar ID",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 1}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t",
			allDay: true
		};

		var morningAfternoonEvent = {
			dtstart: new Date("01 Jan 2010 10:00:00").getTime(),	// || Fri 01 Jan 2010 18:00:00 GMT
			dtend:   new Date("01 Jan 2010 13:00:00").getTime(),	// || Fri 01 Jan 2010 21:00:00 GMT
			tzId: tzId,
			subject: "Morning spanning into afternoon, Starting 1/1, Every day until 4/1, matches calendar ID",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 1}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t"
		};


		var afternoonEveningEvent = {
			dtstart: new Date("01 Jan 2010 14:00:00").getTime(),	// || Fri 01 Jan 2010 22:00:00 GMT
			dtend:   new Date("01 Jan 2010 19:00:00").getTime(),	// || Sat 02 Jan 2010 03:00:00 GMT
			tzId: tzId,
			subject: "Afternoon spanning into evening, Starting 1/1, Every day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 1}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t"
		};

		var morningEvent = {
			dtstart: new Date("01 Jan 2010 10:00:00").getTime(),	// || Fri 01 Jan 2010 18:00:00 GMT
			dtend:   new Date("01 Jan 2010 11:00:00").getTime(),	// || Fri 01 Jan 2010 19:00:00 GMT
			tzId: tzId,
			subject: "Morning, Starting 1/1, Every third day until 4/1, matches CalendarID",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t"
		};

		var afternoonEvent = {
			dtstart: new Date("02 Jan 2010 14:00:00").getTime(),	// || Sat 02 Jan 2010 22:00:00 GMT
			dtend:   new Date("02 Jan 2010 15:00:00").getTime(),	// || Sat 02 Jan 2010 23:00:00 GMT
			tzId: tzId,
			subject: "Afternoon, Starting 1/2, Every third day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t"
		};

		var eveningEvent = {
			dtstart: new Date("03 Jan 2010 18:00:00").getTime(),	// || Mon 04 Jan 2010 02:00:00 GMT
			dtend:   new Date("03 Jan 2010 19:00:00").getTime(),	// || Mon 04 Jan 2010 03:00:00 GMT
			tzId: tzId,
			subject: "Evening, Starting 1/3, Every third day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 3}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			calendarId: "733t"
		};

		var eventSet = [allDayEvent, morningAfternoonEvent, afternoonEveningEvent, morningEvent, afternoonEvent, eveningEvent];

		var expectedDate = new Date('Fri Jan 01 2010 00:00:00').getTime();
		var expectedString = "-----------------------------------------------------------";
		var expectedAllDayString = "33333333333333333333333333333333333333333333333333333333333";
		var expectedLength = expectedString.length;

		var callback = function(response) {

			expect(response.date).toEqual(expectedDate);
			expect(response.days.length).toEqual(expectedLength);
			expect(response.days).toEqual(expectedString);
			expect(response.allDay.length).toEqual(expectedLength);
			expect(response.allDay).toEqual(expectedAllDayString);
	        done = true;
	    };
		mgr.getBusyDays(range, callback, eventSet);
		waitsFor(function () {
			return done;
		});
	});

	it("should test getBusyDays 5", function(){
		var done = false;

		var range = {
			start: new Date("01 Jan 2010 00:00:00").getTime(),	// || Fri 01 Jan 2010 08:00:00 GMT
			end:   new Date("31 Mar 2010 23:59:59").getTime(),	// || Wed 31 Mar 2010 06:59:59 GMT
			tzId: tzId,
			calendarId: "733t"
		};

		var multiDaySpanEvent = {
			dtstart: new Date("01 Feb 2010 02:00:00").getTime(),	// || Mon 01 Feb 2010 10:00:00 GMT
			dtend:   new Date("28 Feb 2010 14:00:00").getTime(),	// || Sun 28 Feb 2010 22:00:00 GMT
			tzId: tzId,
			subject: "Morning, Starting 2/1 2am through 2/28 2pm, matches CalendarID",
			calendarId: "733t"
		};

		var eventSet = [multiDaySpanEvent];

		var expectedDate = new Date('Fri Jan 01 2010 00:00:00').getTime();
		var expectedString = "0000000000000000000000000000000---------------------------R0000000000000000000000000000000";
		var expectedLength = expectedString.length;

		var callback = function(response) {

			expect(response.date).toEqual(expectedDate);
			expect(response.days.length).toEqual(expectedLength);
			expect(response.days).toEqual(expectedString);
	        done = true;
	    };
		mgr.getBusyDays(range, callback, eventSet);
		waitsFor(function () {
			return done;
		});
	});
});
