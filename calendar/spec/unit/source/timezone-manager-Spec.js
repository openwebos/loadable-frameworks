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

/*global afterEach, beforeEach, console, describe, expect, Foundations: false, getAppAssistant: false, it, MojoLoader, require, TimezoneManager, waitsFor, xdescribe, xit */
/*jslint laxbreak: true, white: false, browser: true */

//makeTimezoneYearPair
//hasTimezoneInfo
//findTzYearPairsNotInCache
//addTimezones
//getTimezones
//loadTimezones

var utils = require("./utils");
var fm = MojoLoader.require({name: "foundations.mock", version: "1.0"})["foundations.mock"];

describe("TimezoneManager tests", function () {
	var mgr = new TimezoneManager(),
		timezoneName;

	// TODO: get current timezone name from system service
	beforeEach(function () {
		fm.Comms.Mock.PalmCall.useMock();
		timezoneName = "America/Los_Angeles";

		utils.waitsForFuture(mgr.setup());
	});


	it("should test isSingleton ", function(){
		/** Tests that all instances of TimezoneManager point to the same object */

		// Do two new TimezoneManager instances both point to the same instance?
		var isSameInstance = (new TimezoneManager() === mgr);
		expect(isSameInstance).toEqual(true);

		// Does executing TimezoneManager's constructor return the same instance as creating a new TimezoneManager?
		isSameInstance = (TimezoneManager() === new TimezoneManager());
		expect(isSameInstance).toEqual(true);
	});

	it("should test makeTimezoneYearPair", function(){
		var tzId = "America/Los_Angeles";
		var pair;

		//case 1: test with no years, so it will give us the default years
		var years1 = [];
		var currentYear = new Date().getFullYear();
		var expectedYears1 = [currentYear-5, currentYear-4, currentYear-3, currentYear-2, currentYear-1,
							currentYear, currentYear+1, currentYear+2, currentYear+3, currentYear+4, currentYear+5];

		pair = mgr.makeTimezoneYearPair(tzId, years1);
		expect(pair.tz).toEqual(tzId);
		expect(pair.years.join()).toEqual(expectedYears1.join());

		//case 2: test with years outside the default range, so it will give us the default years and the requested years
		var years2 = [1986, 1987];
		var expectedYears2 = years2.concat(expectedYears1);

		pair = mgr.makeTimezoneYearPair(tzId, years2);
		expect(pair.tz).toEqual(tzId);
		expect(pair.years.join()).toEqual(expectedYears2.join());

		//This will be a duplicate (for the next ten years)
		//case 3: test with years inside the default range, so it will give us the default years and the requested years, which will be a duplicate
		var years3 = [2015];
		var expectedYears3 = years3.concat(expectedYears1);

		pair = mgr.makeTimezoneYearPair(tzId, years3);
		expect(pair.tz).toEqual(tzId);
		expect(pair.years.join()).toEqual(expectedYears3.join());
	});

	//----------------------------------------------------------------------------------

	it("should test hasTimezoneInfo", function(){
		var hasInfo = false;

		//reset the timezone to empty, and set some fake timezone info
		mgr.timezones = {};
		mgr.timezones["2010"] = {};
		mgr.timezones["2010"]["America/Los_Angeles"] = {
			"tz": "America/Los_Angeles",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -28800,
			"dstOffset": -25200,
			"dstStart": 1268560800,
			"dstEnd": 1289120400
		};
		mgr.timezones["2010"]["America/New_York"] = {
			"tz": "America/New_York",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -18000,
			"dstOffset": -14400,
			"dstStart": 1268550000,
			"dstEnd": 1289109600
		};

		//case 1: test one we have
		hasInfo = mgr.hasTimezoneInfo("America/Los_Angeles", 2010);
		expect(hasInfo).toEqual(true);

		//case 2: test a year we don't have
		hasInfo = mgr.hasTimezoneInfo("America/Los_Angeles", 2011);
		expect(hasInfo).toEqual(false);

		//case 3: test a timezone we don't have in a year we do have
		hasInfo = mgr.hasTimezoneInfo("America/Denver", 2010);
		expect(hasInfo).toEqual(false);

		//case 4: test a timezone we have in a year we don't have
		hasInfo = mgr.hasTimezoneInfo("America/New_York", 2011);
		expect(hasInfo).toEqual(false);
	});

	//----------------------------------------------------------------------------------

	it("should test findTzYearPairsNotInCache", function(){
		//reset the timezone to empty, and set some fake timezone info
		mgr.timezones = {};
		mgr.timezones["2010"] = {};
		mgr.timezones["2010"]["America/New_York"] = {
			"tz": "America/New_York",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -18000,
			"dstOffset": -14400,
			"dstStart": 1268550000,
			"dstEnd": 1289109600
		};

		var currentYear = new Date().getFullYear();
		var defaultYears = mgr.defaultYears;
		var expectedYears;
		var pair;

		//case 1: we have everything we asked for, we get nothing back
		var tzIds = ["America/New_York"];
		var years = [2010];
		var missingPairs = mgr.findTzYearPairsNotInCache(tzIds, years);
		expect(missingPairs.length).toEqual(0);

		//case 2: we're missing a year - it will add all the default years too
		tzIds = ["America/New_York"];
		years = [2009, 2010];
		expectedYears = [2009].concat(defaultYears); //2010 should be left out
		missingPairs = mgr.findTzYearPairsNotInCache(tzIds, years);
		expect(missingPairs.length).toEqual(1);
		pair = missingPairs[0];
		expect(pair.tz).toEqual("America/New_York");
		expect(pair.years.join()).toEqual(expectedYears.join());

		//case 3: we're missing a timezone - it will add all the default years too
		tzIds = ["America/Chicago", "America/New_York"];
		years = [2010];
		expectedYears = years.concat(defaultYears);
		missingPairs = mgr.findTzYearPairsNotInCache(tzIds, years);
		expect(missingPairs.length).toEqual(1);
		pair = missingPairs[0];
		expect(pair.tz).toEqual("America/Chicago");
		expect(pair.years.join()).toEqual(expectedYears.join());
	});

	//----------------------------------------------------------------------------------

	it("should test addTimezones", function(){
		mgr.timezones = {};
		var future = new Foundations.Control.Future();
		future.result = {
			"returnValue": true,
			"results": [{
				"tz": "America/Los_Angeles",
				"year": 2010,
				"hasDstChange": true,
				"utcOffset": -28800,
				"dstOffset": -25200,
				"dstStart": 1268560800,
				"dstEnd": 1289120400
			}, {
				"tz": "America/New_York",
				"year": 2010,
				"hasDstChange": true,
				"utcOffset": -18000,
				"dstOffset": -14400,
				"dstStart": 1268550000,
				"dstEnd": 1289109600
			}]
		};

		mgr.addTimezones(future);
		expect(mgr.hasTimezoneInfo("America/Los_Angeles", 2010)).toBeTruthy();
		expect(mgr.hasTimezoneInfo("America/New_York", 2010)).toBeTruthy();
	});

	//----------------------------------------------------------------------------------

	//Case 1: No args, should return false
	it("should test getTimezones 1", function(){
		//reset the timezone to empty
		mgr.timezones = {};

		var future = new Foundations.Control.Future();

		future.now(mgr, mgr.getTimezones);
		future.then(this, function(future){
			var result = future.result;
			var returnValue = future.result.returnValue;
			expect(returnValue).toEqual(true);
			return true;
		});
		utils.waitsForFuture(future);
	});

	//Case 2: No missing pairs, nothing to do, should return true, and mgr should be unchanged
	it("should test getTimezones 2", function(){
		//reset the timezone to empty, and set some fake timezone info
		mgr.timezones = {};
		mgr.timezones["2010"] = {};
		mgr.timezones["2010"]["America/New_York"] = {
			"tz": "America/New_York",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -18000,
			"dstOffset": -14400,
			"dstStart": 1268550000,
			"dstEnd": 1289109600
		};
		var mgrTzStringBefore = JSON.stringify(mgr.timezones);

		//set args on the future
		var future = new Foundations.Control.Future();
		future.tzIds = ["America/New_York"];
		future.years = [2010];

		future.now(mgr, mgr.getTimezones);
		future.then(this, function(future){
			var result = future.result;
			var returnValue = future.result.returnValue;
			expect(returnValue).toEqual(true);

			var mgrTzStringAfter = JSON.stringify(mgr.timezones);
			expect(mgrTzStringBefore).toEqual(mgrTzStringAfter);

			return true;
		});
		utils.waitsForFuture(future);
	});

	//Case 3: Missing pairs, will require a service call. Should return true, and mgr should be changed
	it("should test getTimezones 3", function(){
		//reset the timezone to empty
		mgr.timezones = {};

		var currentYear = new Date().getFullYear();
		var defaultYears = mgr.defaultYears;

		//set args on the future
		var future = new Foundations.Control.Future();
		future.tzIds = ["America/Los_Angeles"];
		future.years = [2010];

		future.now(mgr, mgr.getTimezones);
		future.then(this, function(future){
			var result = future.result;
			var returnValue = future.result.returnValue;
			expect(returnValue).toEqual(true);

			expect(mgr.hasTimezoneInfo("America/Los_Angeles", 2010)).toBeTruthy();
			for(var i = 0; i < defaultYears.length; i++){
				expect(mgr.hasTimezoneInfo("America/Los_Angeles", defaultYears[i])).toBeTruthy();
			}

			return true;
		});
		utils.waitsForFuture(future);
	});

	//Case 4: Some missing pairs, some present, will require a service call. Should return true, and mgr should be changed
	it("should test getTimezones 4", function(){
		//reset the timezone to empty, and set some fake timezone info
		mgr.timezones = {};
		mgr.timezones["2010"] = {};
		mgr.timezones["2010"]["America/New_York"] = {
			"tz": "America/New_York",
			"year": 2010,
			"hasDstChange": true,
			"utcOffset": -18000,
			"dstOffset": -14400,
			"dstStart": 1268550000,
			"dstEnd": 1289109600
		};

		var currentYear = new Date().getFullYear();
		var defaultYears = mgr.defaultYears;
		var done = false;

		//set args on the future
		var future = new Foundations.Control.Future();
		future.tzIds = ["America/Los_Angeles"];
		future.years = [2010];

		future.now(mgr, mgr.getTimezones);
		future.then(this, function(future){
			var result = future.result;
			var returnValue = future.result.returnValue;
			expect(returnValue).toEqual(true);

			expect(mgr.hasTimezoneInfo("America/New_York", 2010)).toBeTruthy();
			expect(mgr.hasTimezoneInfo("America/Los_Angeles", 2010)).toBeTruthy();
			for(var i = 0; i < defaultYears.length; i++){
				expect(mgr.hasTimezoneInfo("America/Los_Angeles", defaultYears[i])).toBeTruthy();
				if(defaultYears[i] != 2010){
					expect(!mgr.hasTimezoneInfo("America/New_York", defaultYears[i])).toBeTruthy();
				}
			}

			return true;
		});

		utils.waitsForFuture(future);
	});

	//----------------------------------------------------------------------------------

	//Case 1: No parameters, it finds the default timezone and default years
	it("should test loadTimezones 1", function(){
		var done = false;
		//reset the timezone to empty
		mgr.timezones = {};

	    var timeoutFired = function() {

			var tzId = mgr.getSystemTimezone();
			var defaultYears = mgr.defaultYears;

			for(var i = 0; i < defaultYears.length; i++){
				expect(mgr.hasTimezoneInfo(tzId, defaultYears[i])).toBeTruthy();
			}
	        done = true;
	    };

		mgr.loadTimezones();
	    setTimeout(timeoutFired, 300);
		waitsFor(function () {
			return done;
		});
	});

	//Case 2: No year parameters, it finds the requested timezone and default years
	it("should test loadTimezones 2", function(){
		//reset the timezone to empty
		mgr.timezones = {};
		var tzIds = ["America/Chicago", "America/New_York"],
			done = false;

	    var timeoutFired = function() {

			var defaultYears = mgr.defaultYears;

			for(var i = 0; i < defaultYears.length; i++){
				expect(mgr.hasTimezoneInfo(tzIds[0], defaultYears[i])).toBeTruthy();
				expect(mgr.hasTimezoneInfo(tzIds[1], defaultYears[i])).toBeTruthy();
			}
	        done = true;
	    };

		mgr.loadTimezones(tzIds);
	    setTimeout(timeoutFired, 300);
		waitsFor(function () {
			return done;
		});
	});

	//Case 3: Year and timezone parameters, it finds the requested timezones and the requested years and the default years
	it("should test loadTimezones 3", function(){
		//reset the timezone to empty
		mgr.timezones = {};
		var tzIds = ["America/Chicago", "America/New_York"];
		var years = [1986, 1987];
		var done = false;
		var timeoutFired = function() {
			var defaultYears = mgr.defaultYears;
			var allYears = years.concat(defaultYears);
			for(var i = 0; i < allYears.length; i++){
				expect(mgr.hasTimezoneInfo(tzIds[0], allYears[i])).toBeTruthy();
				expect(mgr.hasTimezoneInfo(tzIds[1], allYears[i])).toBeTruthy();
			}
		    done = true;
	    };

		mgr.loadTimezones(tzIds, years);
		setTimeout(timeoutFired, 300);
		waitsFor(function () {
			return done;
		});
	});

	//----------------------------------------------------------------------------------

	it("should test getOffset ", function(){
		mgr.timezones = {};
		mgr.gotLocalTz = false;

		//{ "tz": "America/New_York", "year": 2010, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1268550000, "dstEnd": 1289109600 }
		//{ "tz": "Asia/Kabul", "year": 2010, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 }
		var future = new Foundations.Control.Future();
		future.tzIds = ["America/New_York", "Asia/Kabul"];
		future.years = [2010];
		future.now(mgr, mgr.getTimezones);
		future.then(function(future){
			var dstResult;
			var notDstResult;

			//Drop milliseconds
			var dstTime = new Date(2010, 4, 17, 12, 0, 0, 0).getTime() / 1000; //May 17, 2010
			var notDstTime = new Date(2010, 1, 17, 12, 0, 0, 0).getTime() / 1000; //February 17, 2010

			dstResult = mgr.getOffset(2010, "America/New_York", dstTime);
			notDstResult = mgr.getOffset(2010, "America/New_York", notDstTime);
			expect(dstResult).toEqual(-14400);
			expect(notDstResult).toEqual(-18000);

			dstResult = mgr.getOffset(2010, "Asia/Kabul", dstTime);
			notDstResult = mgr.getOffset(2010, "Asia/Kabul", notDstTime);
			expect(dstResult).toEqual(16200);
			expect(notDstResult).toEqual(16200);
			expect(notDstResult).toEqual(dstResult);
			return true;
		});
		utils.waitsForFuture(future);
	});

	//----------------------------------------------------------------------------------

	it("should test convertTime ", function(){
		mgr.timezones = {};
		mgr.gotLocalTz = false;

		//{ "tz": "America/Los_Angeles","year": 2010,"hasDstChange": true,"utcOffset": -28800,"dstOffset": -25200,"dstStart": 1268560800,"dstEnd": 1289120400}
		//{ "tz": "America/New_York", "year": 2010, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1268550000, "dstEnd": 1289109600 }
		//{ "tz": "Asia/Kabul", "year": 2010, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 }
		//{ "tz": "Europe/London","year": 2010,"hasDstChange": true,"utcOffset": 0,"dstOffset": 3600,"dstStart": 1269738000,"dstEnd": 1288486800}
		//{ "tz": "Pacific\/Honolulu","year": 2010,"hasDstChange": false,"utcOffset": -36000,"dstOffset": -1,"dstStart": -1,"dstEnd": -1}
		var future = new Foundations.Control.Future();
		future.tzIds = ["America/Los_Angeles", "America/New_York", "Asia/Kabul", "Europe/London", "Pacific/Honolulu"];
		future.years = [2010];
		future.now(mgr, mgr.getTimezones);
		future.then(function(future){
			var bothInDstTime	= 1274122800000; //May 17, 2010 12:00:00 PDT || May 17, 2010 20:00:00 BST(british summer time)
			var bothNotDstTime	= 1266436800000; //Feb 17, 2010 12:00:00 PST || Feb 17, 2010 20:00:00 GMT
			var oneInDstTime	= 1268852400000; //Mar 17, 2010 12:00:00 PDT || Mar 17, 2010 19:00:00 GMT
			var convertedTime;
			var expectedTime;
			convertedTime = mgr.convertTime(bothInDstTime, "America/Los_Angeles", "Europe/London");
			expectedTime = bothInDstTime + 28800000; //8 hours
			expect(convertedTime).toEqual(expectedTime);

			convertedTime = mgr.convertTime(bothNotDstTime, "America/Los_Angeles", "Europe/London");
			expectedTime = bothNotDstTime + 28800000; //8 hours
			expect(convertedTime).toEqual(expectedTime);

			convertedTime = mgr.convertTime(oneInDstTime, "America/Los_Angeles", "Europe/London");
			expectedTime = oneInDstTime + 25200000; //7 hours
			expect(convertedTime).toEqual(expectedTime);

			convertedTime = mgr.convertTime(bothInDstTime, "America/New_York", "Europe/London");
			expectedTime = bothInDstTime + 18000000; //5 hours
			expect(convertedTime).toEqual(expectedTime);


			convertedTime = mgr.convertTime(bothNotDstTime, "Pacific/Honolulu", "Asia/Kabul");
			expectedTime = bothNotDstTime + 52200000; //14.5 hours
			expect(convertedTime).toEqual(expectedTime);
			return true;
		});

		utils.waitsForFuture(future);
	});
});
