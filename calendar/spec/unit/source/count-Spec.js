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

/*global beforeEach, Config, console, describe, EventManager, expect, Foundations: false, it, MojoLoader, require, TimezoneManager, waitsFor, xdescribe, xit */
/*jslint laxbreak: true, white: false */

var waitsForFuture = require('./utils').waitsForFuture;
var fm = MojoLoader.require({name: "foundations.mock", version: "1.0"})["foundations.mock"];

describe("Counted repeat tests", function () {
	var tzMgr;

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
				return true;
			});

			waitsForFuture(future);
		}
	});


	var mgr = new EventManager();
	it("should test findRepeatsInRangeCountVersion ", function(){
		var tzId = tzMgr.getSystemTimezone();
		var event = {
			dtstart: new Date("24 Jan 2010 10:00:00").getTime(),	// || Sun 24 Jan 2010 18:00:00 GMT
			dtend:   new Date("24 Jan 2010 12:00:00").getTime(),	// || Sun 24 Jan 2010 20:00:00 GMT
			allDay:  false,
			tzId: tzId,
			rrule: {freq: "DAILY", count: 12, interval: 2}
		};

		var range0 = {
			start: new Date("16 Nov 2010 00:00:00").getTime(),	// || Tue 16 Nov 2010 08:00:00 GMT
			end:   new Date("19 Nov 2010 23:59:59").getTime(),	// || Sat 20 Nov 2010 07:59:59 GMT
			tzId: tzId
		};

		var range1 = {
			start: new Date("24 Jan 2010 00:00:00").getTime(),	// || Sun 24 Jan 2010 08:00:00 GMT
			end:   new Date("25 Jan 2010 23:59:59").getTime(),	// || Tue 26 Jan 2010 07:59:59 GMT
			tzId: tzId
		};

		var range2 = {
			start: new Date("02 Feb 2010 00:00:00").getTime(),	// || Tue 02 Feb 2010 08:00:00 GMT
			end:   new Date("03 Feb 2010 23:59:59").getTime(),	// || Thu 04 Feb 2010 07:59:59 GMT
			tzId: tzId
		};

		var range3 = {
			start: new Date("12 Feb 2010 00:00:00").getTime(),	// || Fri 12 Feb 2010 08:00:00 GMT
			end:   new Date("16 Feb 2010 00:00:00").getTime(),	// || Tue 16 Feb 2010 08:00:00 GMT
			tzId: tzId
		};

		var range4 = {
			start: new Date("15 Feb 2010 00:00:00").getTime(),	// || Mon 15 Feb 2010 08:00:00 GMT
			end:   new Date("01 Mar 2010 00:00:00").getTime(),	// || Mon 01 Mar 2010 08:00:00 GMT
			tzId: tzId
		};

		var range5 = {
			start: new Date("20 Feb 2010 00:00:00").getTime(),	// || Sat 20 Feb 2010 08:00:00 GMT
			end:   new Date("23 Feb 2010 00:00:00").getTime(),	// || Tue 23 Feb 2010 08:00:00 GMT
			tzId: tzId
		};
		var first =		new Date(2010, 0, 24, 10, 0, 0, 0).getTime();
		var second =	new Date(2010, 0, 26, 10, 0, 0, 0).getTime();
		var third =		new Date(2010, 0, 28, 10, 0, 0, 0).getTime();
		var fourth =	new Date(2010, 0, 30, 10, 0, 0, 0).getTime();
		var fifth =		new Date(2010, 1, 1,  10, 0, 0, 0).getTime();
		var sixth =		new Date(2010, 1, 3,  10, 0, 0, 0).getTime();
		var seventh =	new Date(2010, 1, 5,  10, 0, 0, 0).getTime();
		var eighth =	new Date(2010, 1, 7,  10, 0, 0, 0).getTime();
		var ninth =		new Date(2010, 1, 9,  10, 0, 0, 0).getTime();
		var tenth =		new Date(2010, 1, 11, 10, 0, 0, 0).getTime();
		var eleventh =	new Date(2010, 1, 13, 10, 0, 0, 0).getTime();
		var twelfth =	new Date(2010, 1, 15, 10, 0, 0, 0).getTime();
		var startTimes = [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth, eleventh, twelfth];

		var occurrence;
		var twoWeeks = (86400000 * 14);
		//base * interval * (count + numExdates + bonusPadding);
		var estimateEndDays = 1 * event.rrule.interval * (event.rrule.count + 3);
		var estimateEnd = new Date(event.dtstart).addDays(estimateEndDays).getTime();

		var occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range0);
		var countInfo = event.countInfo;
		var i;

		//First test: range far beyond the end - we should get an estimate end and that's all
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).not.toEqual(undefined);
		expect(countInfo.estimateEnd ).toBeGreaterThan(twelfth);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.until).toEqual(undefined);
		expect(countInfo.occurrences).toEqual(undefined);


		//Second test: search within range, we should calculate the first occurrence, and return the first occurrence
		event.countInfo = undefined;
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range1);
		countInfo = event.countInfo;
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(1);
		expect(countInfo.occurrences[0]).toEqual(first);
		expect(occurrences.length).toEqual(1);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(first);


		//Third test: search within range, we should calculate up through the sixth occurrence, and return the sixth occurrence
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range2);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(6);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(1);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(sixth);


		//Fourth test: search within range, we should calculate up through the last occurrence, and return the last two occurrences
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range3);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(12);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(2);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(eleventh);
		occurrence = occurrences[1];
		expect(occurrence.currentLocalStart).toEqual(twelfth);


		//Fifth test: search end of range and beyond, we should calculate up through the last occurrence, and return the last occurrence, and nothing more
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range4);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(12);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(1);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(twelfth);


		//Sixth test: search range beyond where repeats but within estimateEnd,
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range5);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(12);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(0);
	});

	it("should test compareResults ", function(reportResults){

		var done = false;

		//Range is 3-month span
		var range = {
			start: 1262332800000,  //Jan 1, 2010 midnight pst
			end:   1270105200000,  //Apr 1, 2010 midnight pst
			tzId: "America/Los_Angeles"
		};

		//Event repeats 6am-7am every Saturday
		var weeklyRepeatingEvent_NoEnd = {
			_id: "NOEND",
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "WEEKLY", interval: 1}
		};

		//Event repeats 6am-7am every Saturday
		var weeklyRepeatingEvent_Until = {
			_id: "UNTIL",
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "WEEKLY", interval: 1, until: 1270969199000} //Sat 10 Apr 2010 23:59:59 PDT ~ 12 occurrences
		};

		//Event repeats 6am-7am every Saturday
		var weeklyRepeatingEvent_Count = {
			_id: "COUNT",
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "WEEKLY", interval: 1, count: 12}
		};

		var resultSet = [weeklyRepeatingEvent_NoEnd, weeklyRepeatingEvent_Until, weeklyRepeatingEvent_Count];

		var callback = function(response) {
			var days = response.days;
			var daysLength = days.length;
			for(var i = 0; i < daysLength; i++){
				var dayEvents = days[i].events;
				var eventsLength = dayEvents.length;
				if(eventsLength){
					expect(eventsLength).toEqual(3);
					expect(dayEvents[0].currentLocalStart).toEqual(dayEvents[1].currentLocalStart);
					expect(dayEvents[0].currentLocalStart).toEqual(dayEvents[2].currentLocalStart);
				}
			}
			done = true;
	    };
		mgr.getEventsInRange(range, callback, resultSet);
		waitsFor(function () {
			return done;
		});
	});

	it("should test findRepeatsInRangeCountVersionLeapYear ", function(){
		var tzId = tzMgr.getSystemTimezone();
		var event = {
			dtstart: new Date("29 Feb 2008 10:00:00").getTime(),	// || 29 Feb 2008 18:00:00 GMT
			dtend:   new Date("29 Feb 2008 11:00:00").getTime(),	// || 29 Feb 2008 19:00:00 GMT
			allDay:  false,
			tzId: tzId,
			rrule: {freq: "YEARLY", count: 3, interval: 1} //Last one: 2016
		};

		var range0 = {
			start: new Date("29 Feb 2060 12:00:00").getTime(),	// || 29 Feb 2060 08:00:00 GMT
			end:   new Date("29 Feb 2060 23:59:59").getTime(),	// || 01 Mar 2060 07:59:59 GMT
			tzId: tzId
		};

		var range1 = {
			start: new Date("29 Feb 2008 00:00:00").getTime(),	// || 29 Feb 2008 08:00:00 GMT
			end:   new Date("29 Feb 2008 23:59:59").getTime(),	// || 01 Mar 2008 07:59:59 GMT
			tzId: tzId
		};

		var range2 = {
			start: new Date("29 Feb 2016 00:00:00").getTime(),	// || 29 Feb 2016 08:00:00 GMT
			end:   new Date("29 Feb 2016 23:59:59").getTime(),	// || 01 Mar 2016 07:59:59 GMT
			tzId: tzId
		};

		var range3 = {
			start: new Date("29 Feb 2020 00:00:00").getTime(),	// || 29 Feb 2020 08:00:00 GMT
			end:   new Date("29 Feb 2020 23:59:59").getTime(),	// || 01 Mar 2020 07:59:59 GMT
			tzId: tzId
		};

		var first =		new Date(2008, 1, 29, 10, 0, 0, 0).getTime();
		var second =	new Date(2012, 1, 29, 10, 0, 0, 0).getTime();
		var third =		new Date(2016, 1, 29, 10, 0, 0, 0).getTime();
		var startTimes = [first, second, third];

		var occurrence;
		//base * interval * (count + numExdates + bonusPadding);
		var estimateEndDays = 366 * 4 * event.rrule.interval * (event.rrule.count + 3);
		var estimateEnd = new Date(event.dtstart).addDays(estimateEndDays).getTime();
		var occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range0);
		var countInfo = event.countInfo;
		var i;

		//First test: range far beyond the end - we should get an estimate end and that's all
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toBeGreaterThan(third);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.until).toEqual(undefined);
		expect(countInfo.occurrences).toEqual(undefined);


		//Second test: search within range, we should calculate the first occurrence, and return the first occurrence
		event.countInfo = undefined;
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range1);
		countInfo = event.countInfo;
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(1);
		expect(countInfo.occurrences[0]).toEqual(first);
		expect(occurrences.length).toEqual(1);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(first);


		//Third test: search within range, we should calculate up through the third occurrence, and return the third occurrence
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range2);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(3);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(1);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(third);


		//Fourth test: search end of range and beyond, we should calculate up through the last occurrence, and return the last occurrence, and nothing more
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range3);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(3);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(0);
	});

	it("should test findRepeatsInRangeCountVersion 31st", function(){
		var tzId = tzMgr.getSystemTimezone();
		var event = {
			dtstart: 1301590800000,  //31 Mar 2011 10:00:00 PST || 31 Mar 2011 17:00:00 GMT
			dtend:   1301594400000,  //31 Mar 2011 11:00:00 PST || 31 Mar 2011 18:00:00 GMT
			allDay:  false,
			tzId: tzId,
			rrule: {freq: "MONTHLY", count: 3, interval: 1} //Last one: July 31, 2011
		};

		var range0 = {
			start: 1343804400000,  //01 Aug 2012 12:00:00 PST || 01 Aug 2012 07:00:00 GMT
			end:   1343890799000,  //01 Aug 2012 23:59:59 PST || 02 Aug 2012 06:59:59 GMT
			tzId: tzId
		};

		var range1 = {
			start: 1301554800000,  //31 Mar 2011 00:00:00 PST || 31 Mar 2011 07:00:00 GMT
			end:   1301641199000,  //31 Mar 2011 23:59:59 PST || 01 Apr 2011 06:59:59 GMT
			tzId: tzId
		};

		var range2 = {
			start: 1312095600000,  //31 Jul 2011 00:00:00 PST || 31 Jul 2011 07:00:00 GMT
			end:   1312181999000,  //31 Jul 2011 23:59:59 PST || 01 Aug 2011 06:59:59 GMT
			tzId: tzId
		};

		var range3 = {
			start: 1582963200000,  //29 Feb 2020 00:00:00 PST || 29 Feb 2020 08:00:00 GMT
			end:   1583049599000,  //29 Feb 2020 23:59:59 PST || 01 Mar 2020 07:59:59 GMT
			tzId: tzId
		};

		var first =		1301590800000;	// 2011/2/31 10:00:00.0 PST
		var second =	1306861200000;	// 2011/4/31 10:00:00.0 PST
		var third =		1312131600000;	// 2011/6/31 10:00:00.0 PDT
		var startTimes = [first, second, third];

		var occurrence;
		//base * interval * (count + numExdates + bonusPadding);
		var estimateEndDays = 31 * 2 * event.rrule.interval * (event.rrule.count + 3);
		var estimateEnd = new Date(event.dtstart).addDays(estimateEndDays).getTime();
		var occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range0);
		var countInfo = event.countInfo;
		var i;

		//First test: range far beyond the end - we should get an estimate end and that's all
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toBeGreaterThan(third);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.until).toEqual(undefined);
		expect(countInfo.occurrences).toEqual(undefined);


		//Second test: search within range, we should calculate the first occurrence, and return the first occurrence
		event.countInfo = undefined;
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range1);
		countInfo = event.countInfo;
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(1);
		expect(countInfo.occurrences[0]).toEqual(first);
		expect(occurrences.length).toEqual(1);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(first);

		//Third test: search within range, we should calculate up through the third occurrence, and return the third occurrence
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range2);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(3);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(1);
		occurrence = occurrences[0];
		expect(occurrence.currentLocalStart).toEqual(third);


		//Fourth test: search end of range and beyond, we should calculate up through the last occurrence, and return the last occurrence, and nothing more
		occurrences = mgr.utils.findRepeatsInRangeCountVersion(event, range3);
		expect(countInfo).not.toEqual(undefined);
		expect(countInfo.estimateEnd).toEqual(estimateEnd);
		expect(countInfo.occurrences).toBeTruthy();
		expect(countInfo.occurrences.length).toEqual(3);
		for(i = 0; i < countInfo.occurrences.length; i++){
			expect(countInfo.occurrences[i]).toEqual(startTimes[i]);
		}
		expect(occurrences.length).toEqual(0);
	});
});