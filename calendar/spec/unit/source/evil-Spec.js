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

/*global describe, expect, it, EventManager, Foundations: false, xdescribe, xit  */
/*jslint laxbreak: true, white: false */

describe("EvilTests", function () {

	//------------------------------------------------------------------------
	// NOTE: WHEN THIS TEST IS INCLUDED IN event-manager-tests.js, IT CAUSES ECLIPSE TO
	// CRASH IF YOU TRY TO COMMENT IT OUT.  SO IT'S BEING QUARANTINED IN ITS OWN FILE.
	// BECAUSE IT'S EVIL.
	//------------------------------------------------------------------------
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
	var mgr = new EventManager();
	var occurs;

	var range = {
		start: 1264579200000,  //Wed 27 Jan 2010 00:00:00 AM PST || Wed 27 Jan 2010 08:00:00 GMT
		end:   1264665599000,  //Wed 27 Jan 2010 11:59:59 PM PST || Thu 28 Jan 2010 07:59:59 GMT
		tzId: "America/Los_Angeles"
	};

	it("should occur wholly within range", function() {
		//Case 1: event within range
		var eventWithinRange = {
			dtstart: 1264640400000,  //Wed 27 Jan 2010 05:00:00 PM PST || Thu 28 Jan 2010 01:00:00 GMT
			dtend:   1264647600000,  //Wed 27 Jan 2010 07:00:00 PM PST || Thu 28 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventWithinRange, range);
		expect(occurs).toBeTruthy();
	});

	it("should occur spanning into range", function () {
		//Case 2: event spans into range
		var eventSpansIntoRange = {
			dtstart: 1264568400000,  //Tue 26 Jan 2010 09:00:00 PM PST || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   1264582800000,  //Wed 27 Jan 2010 01:00:00 AM PST || Wed 27 Jan 2010 09:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventSpansIntoRange, range);
		expect(occurs).toBeTruthy();
	});

	it("should occur spanning out of range", function () {
		//Case 3: event spans out of range
		var eventSpansOutOfRange = {
			dtstart: 1264662000000,  //Wed 27 Jan 2010 11:00:00 PM PST || Thu 28 Jan 2010 07:00:00 GMT
			dtend:   1264672800000,  //Thu 28 Jan 2010 02:00:00 AM PST || Thu 28 Jan 2010 10:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventSpansOutOfRange, range);
		expect(occurs).toBeTruthy();
	});

	it("should occur spanning across range", function () {
		//Case 4: event spans across range
		var eventSpansAcrossRange = {
			dtstart: 1264568400000,  //Tue 26 Jan 2010 09:00:00 PM PST || Wed 27 Jan 2010 05:00:00 GMT
			dtend:   1264672800000,  //Thu 28 Jan 2010 02:00:00 AM PST || Thu 28 Jan 2010 10:00:00 GMT
			tzId: "America/Los_Angeles"
		};
		occurs = mgr.utils.occursInRange(eventSpansAcrossRange, range);
		expect(occurs).toBeTruthy();
	});

	it("should occur not in range", function () {
		//Case 5: event not in range
		var eventNotInRange = {
			dtstart: 1264726800000,  //Thu 28 Jan 2010 05:00:00 PM PST || Fri 29 Jan 2010 01:00:00 GMT
			dtend:   1264734000000,  //Thu 28 Jan 2010 07:00:00 PM PST || Fri 29 Jan 2010 03:00:00 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventNotInRange, range);
		expect(occurs).toBeFalsy();
	});

	it("should occur with same boundaries as range", function () {
		//Case 6: event with same boundaries as range
		var eventWithSameBoundaries = {
			dtstart: 1264579200000,  //Wed 27 Jan 2010 00:00:00 AM PST || Wed 27 Jan 2010 08:00:00 GMT
			dtend:   1264665599000,  //Wed 27 Jan 2010 11:59:59 PM PST || Thu 28 Jan 2010 07:59:59 GMT
			tzId: "America/Los_Angeles"
		};

		occurs = mgr.utils.occursInRange(eventWithSameBoundaries, range);
		expect(occurs).toBeTruthy();
	});
});
