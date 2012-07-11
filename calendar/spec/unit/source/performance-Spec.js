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

/*global beforeEach, describe, EventManager, expect, it, MojoLoader, waitsFor, xdescribe, xit */
/*jslint laxbreak: true, white: false */

var fm = MojoLoader.require({name: "foundations.mock", version: "1.0"})["foundations.mock"];

describe("Performance tests", function () {
	beforeEach(function () {
		fm.Comms.Mock.PalmCall.useMock();
	});

	it("should test getEventsInRangePERF ", function(){
		var done = false;
		var mgr = new EventManager();

		//Range is 3-month span
		var range = {
			start: 1262332800000,  //Jan 1, 2010 midnight pst
			end:   1270105200000,  //Apr 1, 2010 midnight pst
			tzId: "America/Los_Angeles"
		};

		//Event repeats 5pm-7pm every day
		var dailyRepeatingEvent = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 05:00:00 PM PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 07:00:00 PM PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "DAILY", interval: 1 }
		};

		//Event repeats 6am-7am every Saturday
		var weeklyRepeatingEvent = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "WEEKLY", interval: 1}
		};

		//Event repeats 6am-7am every 23rd
		var monthlyRepeatingEvent = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "MONTHLY", interval: 1}
		};

		//Event repeats 6am-7am every Jan 23rd
		var yearlyRepeatingEvent = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "YEARLY", interval: 1}
		};

		//-------------------------
		//Event repeats 5pm-7pm every day
		var dailyRepeatingEventUntil = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 05:00:00 PM PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 07:00:00 PM PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "DAILY", interval: 1, until: 1265615999000 }//Sun 07 Feb 2010 23:59:59 PST ~ 12 occurrences
		};

		//Event repeats 6am-7am every Saturday
		var weeklyRepeatingEventUntil = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "WEEKLY", interval: 1, until: 1270969199000} //Sat 10 Apr 2010 23:59:59 PDT ~ 12 occurrences
		};

		//Event repeats 6am-7am every 23rd
		var monthlyRepeatingEventUntil = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "MONTHLY", interval: 1, until: 1293177599000} //Thu 23 Dec 2010 23:59:59 PST ~ 12 occurrences
		};

		//Event repeats 6am-7am every Jan 23rd
		var yearlyRepeatingEventUntil = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "YEARLY", interval: 1, until: 1643011199000 } //Sun 23 Jan 2022 23:59:59 PST ~ 12 occurrences
		};

		//-------------------------
		//Event repeats 5pm-7pm every day
		var dailyRepeatingEventCount = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 05:00:00 PM PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 07:00:00 PM PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "DAILY", interval: 1, count: 12}
		};

		//Event repeats 6am-7am every Saturday
		var weeklyRepeatingEventCount = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "WEEKLY", interval: 1, count: 12}
		};

		//Event repeats 6am-7am every 23rd
		var monthlyRepeatingEventCount = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "MONTHLY", interval: 1, count: 12}
		};

		//Event repeats 6am-7am every Jan 23rd
		var yearlyRepeatingEventCount = {
			dtstart: 1264255200000,  //Sat 23 Jan 2010 06:00:00 AM PST || Sat 23 Jan 2010 14:00:00 GMT
			dtend:   1264258800000,  //Sat 23 Jan 2010 07:00:00 AM PST || Thu 28 Jan 2010 15:00:00 GMT
			tzId: "America/Los_Angeles",
			rrule: {freq: "YEARLY", interval: 1, count: 12}
		};


		var resultSet = [dailyRepeatingEvent,   dailyRepeatingEventUntil,   dailyRepeatingEventCount,   dailyRepeatingEvent,   dailyRepeatingEventUntil,   dailyRepeatingEventCount,   dailyRepeatingEvent,   dailyRepeatingEventUntil,   dailyRepeatingEventCount,
						 weeklyRepeatingEvent,	weeklyRepeatingEventUntil,	weeklyRepeatingEventCount,	weeklyRepeatingEvent,  weeklyRepeatingEventUntil,  weeklyRepeatingEventCount,  weeklyRepeatingEvent,  weeklyRepeatingEventUntil,  weeklyRepeatingEventCount,
						 weeklyRepeatingEvent,	weeklyRepeatingEventUntil,	weeklyRepeatingEventCount,	weeklyRepeatingEvent,  weeklyRepeatingEventUntil,  weeklyRepeatingEventCount,  weeklyRepeatingEvent,  weeklyRepeatingEventUntil,  weeklyRepeatingEventCount,
						 monthlyRepeatingEvent, monthlyRepeatingEventUntil, monthlyRepeatingEventCount, monthlyRepeatingEvent, monthlyRepeatingEventUntil, monthlyRepeatingEventCount, monthlyRepeatingEvent, monthlyRepeatingEventUntil, monthlyRepeatingEventCount,
						 yearlyRepeatingEvent,	yearlyRepeatingEventUntil,	yearlyRepeatingEventCount,	yearlyRepeatingEvent,  yearlyRepeatingEventUntil,  yearlyRepeatingEventCount,  yearlyRepeatingEvent,  yearlyRepeatingEventUntil,  yearlyRepeatingEventCount];

		var callback = function(response) {
			done = true;
	    };

		mgr.getEventsInRange(range, callback, resultSet);
		waitsFor(function () {
			return done;
		});
	});
});