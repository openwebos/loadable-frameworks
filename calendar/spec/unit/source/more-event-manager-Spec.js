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

/*global beforeEach, describe, EventManager, expect, Foundations: false, it, MojoLoader, TimezoneManager, waitsFor, xdescribe, xit */
/*jslint laxbreak: true, white: false */

var fm = MojoLoader.require({name: "foundations.mock", version: "1.0"})["foundations.mock"];

describe("More EventManager tests", function () {
	var tzId;

	beforeEach(function () {
		if(!this.initialized){
			fm.Comms.Mock.PalmCall.useMock();

			var mgr = new TimezoneManager();
			var future = new Foundations.Control.Future();
			future.tzIds = ["America/Los_Angeles", "America/New_York", "Asia/Kabul", "Pacific/Niue"];
			future.years = [2010];
			future.now(mgr, mgr.setup);
			future.then(mgr, mgr.getTimezones);
			future.then(this, function(future){
				this.initialized = true;
				tzId = mgr.getSystemTimezone();
				return true;
			});
		}
	});

	function timezoneInitialized() {
		return this.initialized;
	}

	var mgr = new EventManager();
	it("should test findNextOccurrence 1", function(){
		waitsFor(timezoneInitialized);
		var date = new Date(2010, 2, 9, 0, 0, 0, 0);  //March 9, 2010
		var nextStart;
		var expectedStart;

		//Case: Daily, interval
		var event1 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every other day until 4/1",
			rrule: {freq: "DAILY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 2} //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
		};

		nextStart = mgr.findNextOccurrence(event1, date.getTime());
		expectedStart = new Date(2010, 2, 9, 8, 0, 0, 0).getTime();
		expect(nextStart).toEqual(expectedStart);

		//Case: Weekly, exceptions
		var event2 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every week until 5/1",
			rrule: {freq: "WEEKLY", until: new Date('Sat May 01 2010 00:00:00').getTime(), interval: 1}, //until = Sat 01 May 2010 12:00:00 AM PDT || Sat 01 May 2010 07:00:00 GMT
			exdates: ["20100315T080000", "20100412T080000"]
		};

		nextStart = mgr.findNextOccurrence(event2, date.getTime());
		expectedStart = new Date(2010, 2, 22, 8, 0, 0, 0).getTime();
		expect(nextStart).toEqual(expectedStart);


		//Case: Weekly, exceptions, interval
		var event3 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every fourth week until 5/1/2015",
			rrule: {freq: "WEEKLY", until: new Date('Fri May 01 2015 00:00:00').getTime(), interval: 4}, //until = Fri 01 May 2015 12:00:00 AM PDT || Fri 01 May 2015 07:00:00 GMT
			exdates: ["20100329T080000", "20100426T080000"]
		};

		nextStart = mgr.findNextOccurrence(event3, date.getTime());
		expectedStart = new Date(2010, 4, 24, 8, 0, 0, 0).getTime();
		expect(nextStart).toEqual(expectedStart);


		//Case: Monthly, interval
		var event4 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every third month until 5/1/2015",
			rrule: {freq: "MONTHLY", until: new Date('Fri May 01 2015 00:00:00').getTime(), interval: 3} //until = Fri 01 May 2015 12:00:00 AM PDT || Fri 01 May 2015 07:00:00 GMT
		};

		nextStart = mgr.findNextOccurrence(event4, date.getTime());
		expectedStart = new Date(2010, 5, 1, 8, 0, 0, 0).getTime();
		expect(nextStart).toEqual(expectedStart);

		//Case: Repeat ended before date
		var event5 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every other day until 3/7/2010",
			rrule: {freq: "DAILY", until: new Date('Sun Mar 07 2010 00:00:00').getTime(), interval: 2} //until = Fri 07 Mar 2010 12:00:00 AM PDT || Fri 07 Mar 2010 07:00:00 GMT
		};

		nextStart = mgr.findNextOccurrence(event5, date.getTime());
		expectedStart = false;
		expect(nextStart).toEqual(expectedStart);

		//Case: Repeat ended after date, but no more occurrences
		var event6 = {
			dtstart: new Date("01 Mar 2010 08:00:00 AM").getTime(),	// || Mon 01 Mar 2010 16:00:00 GMT
			dtend:   new Date("01 Mar 2010 09:00:00 AM").getTime(),	// || Mon 01 Mar 2010 17:00:00 GMT
			tzId: tzId,
			subject: "Every other week until 3/7/2010",
			rrule: {freq: "WEEKLY", until: new Date('Thu Apr 01 2010 00:00:00').getTime(), interval: 2}, //until = Thu 01 Apr 2010 12:00:00 AM PDT || Thu 01 Apr 2010 07:00:00 GMT
			exdates: ["20100315T080000", "20100329T080000"]
		};

		nextStart = mgr.findNextOccurrence(event6, date.getTime());
		expectedStart = false;
		expect(nextStart).toEqual(expectedStart);
	});


	it("should test findNextOccurrence 2", function(){
		waitsFor(timezoneInitialized);
		var date = new Date(2011, 2, 1, 15, 37, 33, 0);  //March 1 2011
		var nextStart;
		var expectedStart;
		var event = {
			"subject":"Yearly weekdays in fourth week of March",
			"dtstart": new Date('Fri Mar 04 2011 14:00:00').getTime(),
			"dtend": new Date('Fri Mar 04 2011 14:30:00').getTime(),
			"tzId": tzId,
			"rrule":
			{	"freq":"YEARLY",
				"interval":1,
				"rules":
				[	{"ruleType":"BYMONTH","ruleValue":[{"ord":3}]},
					{"ruleType":"BYDAY","ruleValue":
						[	{"day":1,"ord":4},
							{"day":2,"ord":4},
							{"day":3,"ord":4},
							{"day":4,"ord":4},
							{"day":5,"ord":4}
						]
					}
				]
			}
		};

		nextStart = mgr.findNextOccurrence(event, date.getTime());
		expectedStart = new Date(2011, 2, 22, 14, 0, 0, 0).getTime();
		expect(nextStart).toEqual(expectedStart);
	});

	//Need unit test timeout info from Mark Bessey before we add this
	//MoreEventManagerTests.prototype.testFindNextOccurrence3 = function(){
	//	var mgr = new Calendar.EventManager();
	//	var date = new Date(2009, 10, 18, 0, 0, 0, 0);  //November 18, 2009
	//	var nextStart;
	//	var expectedStart;
	//	var event = {
	//		"subject":"Never actually repeats",
	//		"dtstart": new Date('Fri Mar 04 2011 14:00:00').getTime(),   //March 4, 2011, 14:00:00 PST
	//		"dtend": new Date('Fri Mar 04 2011 14:30:00').getTime(),     //March 4, 2011, 14:30:00 PST
	//		"tzId": tzId,
	//		"rrule":
	//		{	"freq":"YEARLY",
	//			"interval":1,
	//			"rules":
	//			//15th day of March that is also a weekday in the fourth week of March. This can never happen.
	//			[	{"ruleType":"BYMONTH","ruleValue":[{"ord":3}]},
	//				{"ruleType":"BYMONTHDAY","ruleValue":[{"ord":15}]},
	//				{"ruleType":"BYDAY","ruleValue":
	//					[	{"day":1,"ord":4},
	//						{"day":2,"ord":4},
	//						{"day":3,"ord":4},
	//						{"day":4,"ord":4},
	//						{"day":5,"ord":4}
	//					]
	//				}
	//			]
	//		}
	//	};
	//
	//	nextStart = mgr.findNextOccurrence(event, date.getTime());
	//	expectedStart = false;
	//	UnitTest.require(nextStart == expectedStart, "findNextOccurrence returned the wrong startTime 1: "+ nextStart);
	//
	//	return UnitTest.passed;
	//};

	it("should test occursInRange_AllDay ", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		//multi day range
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("29 Jan 2010 11:59:59 PM").getTime(),	// || Sat 30 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Case 1: event within range, non-midnight related hours
		var eventWithinRange = {
			dtstart: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			allDay:  true,
			tzId: tzId
		};

		occurs = mgr.utils.occursInRange(eventWithinRange, range);
		expect(occurs).toEqual(true);

		//Case 2: event spans into range
		var eventSpansIntoRange = {
			dtstart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   new Date("27 Jan 2010 01:00:00 AM").getTime(),	// || Wed 27 Jan 2010 09:00:00 GMT
			allDay:  true,
			tzId: tzId
		};

		occurs = mgr.utils.occursInRange(eventSpansIntoRange, range);
		expect(occurs).toEqual(true);

		//Case 3: event spans out of range
		var eventSpansOutOfRange = {
			dtstart: new Date("29 Jan 2010 06:00:00 PM").getTime(),	// || Sat 30 Jan 2010 02:00:00 GMT
			dtend:   new Date("30 Jan 2010 10:00:00 AM").getTime(),	// || Sat 30 Jan 2010 18:00:00 GMT
			allDay:  true,
			tzId: tzId
		};

		occurs = mgr.utils.occursInRange(eventSpansOutOfRange, range);
		expect(occurs).toEqual(true);

		//Case 4: event spans across range
		var eventSpansAcrossRange = {
			dtstart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   new Date("30 Jan 2010 10:00:00 AM").getTime(),	// || Sat 30 Jan 2010 18:00:00 GMT
			allDay:  true,
			tzId: tzId
		};
		occurs = mgr.utils.occursInRange(eventSpansAcrossRange, range);
		expect(occurs).toEqual(true);

		//Case 5: event not in range
		var eventNotInRange = {
			dtstart: new Date("30 Jan 2010 10:00:00 AM").getTime(),	// || Sat 30 Jan 2010 18:00:00 GMT
			dtend:   new Date("30 Jan 2010 02:00:00 PM").getTime(),	// || Sat 30 Jan 2010 22:00:00 GMT
			allDay:  true,
			tzId: tzId
		};

		occurs = mgr.utils.occursInRange(eventNotInRange, range);
		expect(occurs).toEqual(false);
	});


	it("should test getEventsInRange_AllDay ", function(){
		waitsFor(timezoneInitialized);
		var done = false;

		//multi day range
		var range = {
			start: new Date("25 Jan 2010 00:00:00 AM").getTime(),	// || Mon 25 Jan 2010 08:00:00 GMT
			end:   new Date("31 Jan 2010 11:59:59 PM").getTime(),	// || Mon 01 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		//Case 1: event within range, non-midnight related hours
		var event1 = {
			dtstart: new Date("27 Jan 2010 05:00:00 PM").getTime(),	// || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   new Date("27 Jan 2010 07:00:00 PM").getTime(),	// || Thu 28 Jan 2010 03:00:00 GMT
			allDay:  true,
			tzId: tzId,
			subject: "1.27"
		};

		//Case 2: event spans into range
		var event2 = {
			dtstart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   new Date("27 Jan 2010 01:00:00 AM").getTime(),	// || Wed 27 Jan 2010 09:00:00 GMT
			allDay:  true,
			tzId: tzId,
			subject: "1.26 - 1.27"
		};

		//Case 3: event spans out of range
		var event3 = {
			dtstart: new Date("29 Jan 2010 06:00:00 PM").getTime(),	// || Sat 30 Jan 2010 02:00:00 GMT
			dtend:   new Date("30 Jan 2010 10:00:00 AM").getTime(),	// || Sat 30 Jan 2010 18:00:00 GMT
			allDay:  true,
			tzId: tzId,
			subject: "1.29 - 1.30"
		};

		//Case 4: event spans across range
		var event4 = {
			dtstart: new Date("26 Jan 2010 09:00:00 PM").getTime(),	// || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   new Date("30 Jan 2010 10:00:00 AM").getTime(),	// || Sat 30 Jan 2010 18:00:00 GMT
			allDay:  true,
			tzId: tzId,
			subject: "1.26, 1.27, 1.28, 1.29, 1.30"
		};

		//Case 5: event not in range
		var event5 = {
			dtstart: new Date("30 Jan 2010 10:00:00 AM").getTime(),	// || Sat 30 Jan 2010 18:00:00 GMT
			dtend:   new Date("30 Jan 2010 02:00:00 PM").getTime(),	// || Sat 30 Jan 2010 22:00:00 GMT
			allDay:  true,
			tzId: tzId,
			subject: "1.30"
		};

		var resultSet = [event1, event2, event3, event4, event5];

		var callback = function(response) {
			//Did we get the right number of days back?
			var expectedNumDayResults = 7;
			var actualNumDayResults = response.days.length;
			expect(actualNumDayResults).toEqual(expectedNumDayResults);

			var dayIndex;
			var eventIndex;

			//For each day, did we get the right number of events?
			var expectedNumEventsPerDay = [0, 2, 3, 1, 2, 3, 0];
			var actualNumEventsPerDay = 0;
			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				actualNumEventsPerDay = response.days[dayIndex].allDayEvents.length;
				expect(actualNumEventsPerDay).toEqual(expectedNumEventsPerDay[dayIndex]);

			}

			//For each event, did we get the right start times?
			var expectedRenderStartTimes = [[], [new Date('Tue Jan 26 2010 00:00:00').getTime(), new Date('Tue Jan 26 2010 00:00:00').getTime()], [new Date('Wed Jan 27 2010 00:00:00').getTime(), new Date('Wed Jan 27 2010 00:00:00').getTime(), new Date('Wed Jan 27 2010 00:00:00').getTime()], [new Date('Thu Jan 28 2010 00:00:00').getTime()], [new Date('Fri Jan 29 2010 00:00:00').getTime(), new Date('Fri Jan 29 2010 00:00:00').getTime()], [new Date('Sat Jan 30 2010 00:00:00').getTime(), new Date('Sat Jan 30 2010 00:00:00').getTime(), new Date('Sat Jan 30 2010 00:00:00').getTime()], []];
			var expectedRenderEndTimes =   [[], [new Date('Tue Jan 26 2010 23:59:59').getTime(), new Date('Tue Jan 26 2010 23:59:59').getTime()], [new Date('Wed Jan 27 2010 23:59:59').getTime(), new Date('Wed Jan 27 2010 23:59:59').getTime(), new Date('Wed Jan 27 2010 23:59:59').getTime()], [new Date('Thu Jan 28 2010 23:59:59').getTime()], [new Date('Fri Jan 29 2010 23:59:59').getTime(), new Date('Fri Jan 29 2010 23:59:59').getTime()], [new Date('Sat Jan 30 2010 23:59:59').getTime(), new Date('Sat Jan 30 2010 23:59:59').getTime(), new Date('Sat Jan 30 2010 23:59:59').getTime()], []];

			for(dayIndex = 0; dayIndex < actualNumDayResults; dayIndex++){
				var events = response.days[dayIndex].allDayEvents;
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


	it("should test findRepeatsInRange_AllDay ", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		//multi day range
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("29 Jan 2010 11:59:59 PM").getTime(),	// || Sat 30 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Case 1: event within range, expected repeat hours, repeats every other day Jan 24, 26, 28, 30
		var event = {
			dtstart: new Date("24 Jan 2010 00:00:00").getTime(),	// || Sun 24 Jan 2010 08:00:00 GMT
			dtend:   new Date("24 Jan 2010 23:59:59").getTime(),	// || Mon 25 Jan 2010 07:59:59 GMT
			allDay:  true,
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date('Sun Jan 31 2010 00:00:00').getTime(), interval: 2} //UNTIL = Sun 31 Jan 2011 00:00:00 PST || Sun 31 Jan 2011 08:00:00 GMT
		};

		var occurrences = mgr.utils.findRepeatsInRange(event, range);
		expect(occurrences.length).toEqual(1);

		var resultEvent = occurrences[0];
		var occurrenceStart = new Date(2010, 0, 28, 0, 0, 0, 0).getTime();
		var occurrenceEnd = new Date(2010, 0, 28, 23, 59, 59, 0).getTime();
		expect(resultEvent.currentLocalStart).toEqual(occurrenceStart);
		expect(resultEvent.currentLocalEnd).toEqual(occurrenceEnd);
	});

	it("should test findRepeatsInRange_AllDay 2", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		//multi day range
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("29 Jan 2010 11:59:59 PM").getTime(),	// || Sat 30 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Case 2: event within range, non-midnight related hours, repeats every day Jan 24, 25, 26, 27, 28 - repeat stops within range
		var event = {
			dtstart: new Date("24 Jan 2010 03:00:00").getTime(),	// || Sun 24 Jan 2010 11:00:00 GMT
			dtend:   new Date("24 Jan 2010 05:00:00").getTime(),	// || Sun 24 Jan 2010 13:00:00 GMT
			allDay:  true,
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date('Thu Jan 28 2010 23:59:59').getTime(), interval: 1} //UNTIL = Thu 28 Jan 2010 23:59:59 PST || Fri 29 Jan 2010 07:59:59 GMT
		};

		var occurrences = mgr.utils.findRepeatsInRange(event, range);
		expect(occurrences.length).toEqual(2);

		var expectedStart = [new Date(2010, 0, 27, 3, 0, 0, 0).getTime(), new Date(2010, 0, 28, 3, 0, 0, 0).getTime()];
		var expectedEnd = [new Date(2010, 0, 27, 5, 0, 0, 0).getTime(), new Date(2010, 0, 28, 5, 0, 0, 0).getTime()];
		for(var i = 0; i < occurrences.length; i++){
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStart[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnd[i]);

		}
	});

	it("should test findRepeatsInRange_AllDay 3", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		//multi day range
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("29 Jan 2010 11:59:59 PM").getTime(),	// || Sat 30 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Case 3: event within range, even midnight hours, repeats every day Jan 29, 30 - repeat stops out of range
		var event = {
			dtstart: new Date("29 Jan 2010 00:00:00").getTime(),	// || Fri 29 Jan 2010 08:00:00 GMT
			dtend:   new Date("30 Jan 2010 00:00:00").getTime(),	// || Sat 30 Jan 2010 08:00:00 GMT
			allDay:  true,
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date('Mon Feb 01 2010 00:00:00').getTime(), interval: 1} //UNTIL = Mon 1 Feb 2010 00:00:00 PST || Mon 1 Feb 2010 08:00:00 GMT
		};

		var occurrences = mgr.utils.findRepeatsInRange(event, range);
		expect(occurrences.length).toEqual(1);

		var expectedStart = [new Date(2010, 0, 29, 0, 0, 0, 0).getTime()];
		var expectedEnd = [new Date(2010, 0, 29, 23, 59, 59, 0).getTime()];
		for(var i = 0; i < occurrences.length; i++){
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStart[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnd[i]);

		}
	});

	it("should test findRepeatsInRange_AllDay 4", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		//multi day range
		var range = {
			start: new Date("27 Jan 2010 00:00:00 AM").getTime(),	// || Wed 27 Jan 2010 08:00:00 GMT
			end:   new Date("29 Jan 2010 11:59:59 PM").getTime(),	// || Sat 30 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		//Case 4: event within range, repeats every 4th day, unrelated hours, spans midnight Jan 24-25, 28-29 - repeat starts before and stops out of range
		var event = {
			dtstart: new Date("24 Jan 2010 10:00:00").getTime(),	// || Sun 24 Jan 2010 18:00:00 GMT
			dtend:   new Date("25 Jan 2010 02:00:00").getTime(),	// || Mon 25 Jan 2010 10:00:00 GMT
			allDay:  true,
			tzId: tzId,
			rrule: {freq: "DAILY", until: new Date('Sun Jan 31 2010 00:00:00').getTime(), interval: 4} //UNTIL = Sun 31 Jan 2010 00:00:00 PST || Sun 31 Jan 2010 08:00:00 GMT
		};

		var occurrences = mgr.utils.findRepeatsInRange(event, range);
		expect(occurrences.length).toEqual(1);

		var expectedStart = [new Date(2010, 0, 28, 10, 0, 0, 0).getTime()];
		var expectedEnd = [new Date(2010, 0, 29, 2, 0, 0, 0).getTime()];
		for(var i = 0; i < occurrences.length; i++){
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStart[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnd[i]);
		}
	});

	it("should test findRepeatsInRange_AllDay 5", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		var tzmgr = new TimezoneManager();

		//reset the timezone to empty, and set some fake timezone info
		tzmgr.timezones = {};
		tzmgr.timezones["2010"] = {};
		tzmgr.timezones["2010"]["America/Los_Angeles"] = {
			"tz": "America/Los_Angeles",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -28800,
			"dstOffset": -25200,
			"dstStart": 1268560800,
			"dstEnd": 1289120400
		};
		tzmgr.timezones["2010"]["America/New_York"] = {
			"tz": "America/New_York",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -18000,
			"dstOffset": -14400,
			"dstStart": 1268550000,
			"dstEnd": 1289109600
		};

		//multi day range
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 AM PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1264838399000,  //Fri 29 Jan 2010 11:59:59 PM PST || Sat 30 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		//Case 5: another tz, event hours midnight to 11:59 -should span two days
		var event = {
			dtstart: 1264309200000,  //Sun 24 Jan 2010 00:00:00 EST || Sun 24 Jan 2010 05:00:00 GMT
			dtend:   1264395599000,  //Sun 24 Jan 2010 23:59:59 EST || Mon 25 Jan 2010 04:59:59 GMT
			allDay:  true,
			tzId: "America/New_York",
			rrule: {freq: "DAILY", until: 1270022400000, interval: 2} //UNTIL = March 31, 2010
		};


		var occurrences = mgr.utils.findRepeatsInRange(event, range);
		expect(occurrences.length).toEqual(2);

		var expectedStart = [
			1264654800000,		//Wed Jan 27 2010 21:00:00 PST
			1264827600000		//Fri Jan 29 2010 21:00:00 PST
		];
		var expectedEnd = [
			1264741199000,		//Thu Jan 28 2010 20:59:59 PST
			1264913999000		//Sat Jan 30 2010 20:59:59 PST
		];
		for(var i = 0; i < occurrences.length; i++){
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStart[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnd[i]);

		}
	});


	it("should test findRepeatsInRange_AllDay 6", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		var tzmgr = new TimezoneManager();

		//reset the timezone to empty, and set some fake timezone info
		tzmgr.timezones = {};
		tzmgr.timezones["2010"] = {};
		tzmgr.timezones["2010"]["America/Los_Angeles"] = {
			"tz": "America/Los_Angeles",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -28800,
			"dstOffset": -25200,
			"dstStart": 1268560800,
			"dstEnd": 1289120400
		};
		tzmgr.timezones["2010"]["America/Honolulu"] = {
			"tz": "America/Honolulu",
			"year": 2010,
			"hasDstChange": false,
			"utcOffset": -36000,
			"dstOffset": -1,
			"dstStart": -1,
			"dstEnd": -1
		};

		//multi day range
		var range = {
			start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 AM PST || Wed 27 Jan 2010 08:00:00 GMT
			end:   1264838399000,  //Fri 29 Jan 2010 11:59:59 PM PST || Sat 30 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		//Case 5: another tz, event hours midnight to 11:59 -should span two days
		var event = {
			dtstart: 1264330800000,  //Sun 24 Jan 2010 00:00:00 HST || Sun 24 Jan 2010 11:00:00 GMT
			dtend:   1264417200000,  //Mon 25 Jan 2010 00:00:00 HST || Mon 25 Jan 2010 11:00:00 GMT
			allDay:  true,
			tzId: "America/Honolulu",
			rrule: {freq: "DAILY", until: 1270022400000, interval: 2} //UNTIL = March 31, 2010
		};


		var occurrences = mgr.utils.findRepeatsInRange(event, range);
		expect(occurrences.length).toEqual(2);

		var expectedStart = [
			1264503600000,			//Tue Jan 26 2010 03:00:00 PST
			1264676400000			//Thu Jan 28 2010 03:00:00 PST
		];
		var expectedEnd = [
			1264590000000,			//Wed Jan 27 2010 03:00:00 PST
			1264762800000			//Fri Jan 29 2010 03:00:00 PST
		];
		for(var i = 0; i < occurrences.length; i++){
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStart[i]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnd[i]);

		}
	});

	//Tests an allday event that spans multiple days and that repeats.  Added bonus:
	//the repeat cycle is shorter than the duration.
	it("should test findRepeatsInRange_AllDay 7", function(){
		waitsFor(timezoneInitialized);
		var occurs;

		//multi day range
		var range = {
			start: new Date(2010, 7, 29, 0, 0, 0, 0).getTime(),   //Sun 29 Aug 2010 00:00:00 AM PST
			end:   new Date(2010, 8, 4, 23, 59, 59, 0).getTime(), //Sat 04 Sep 2010 11:59:59 PM PST
			tzId: tzId
		};

		//Repeats every Friday, but since it's 8 days long, that means every Friday, there should be 2 occurrences!
		var event = {
			allDay: true,
			dtstart:new Date("27 Aug 2010 12:00:00 AM").getTime(),	//
			dtend:  new Date("03 Sep 2010 11:59:59 PM").getTime(),	//
			subject: "Spans 8 days, repeats weekly",
			tzId: tzId,
			rrule: {
				freq: "WEEKLY",
				interval: 1,
				rules:  [{
						ruleType: "BYDAY",
						ruleValue: [{ day: 5 }]
						}]
			}
		};

		var occurrences = mgr.utils.findRepeatsInRange(event, range);
		expect(occurrences.length).toEqual(2);

		var start1 = [new Date(2010, 7, 27, 0, 0, 0, 0).getTime()];
		var end1 =   [new Date(2010, 8, 3, 23, 59, 59, 0).getTime()];
		var start2 = [new Date(2010, 8, 3, 0, 0, 0, 0).getTime()];
		var end2 =   [new Date(2010, 8, 10, 23, 59, 59, 0).getTime()];
		var expectedStart = [start1, start2];
		var expectedEnd =   [end1, end2];
		for(var i = 0; i < occurrences.length; i++){
			var resultEvent = occurrences[i];
			expect(resultEvent.currentLocalStart).toEqual(expectedStart[i][0]);
			expect(resultEvent.currentLocalEnd).toEqual(expectedEnd[i][0]);

		}
	});
});