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

/*global describe, expect, it, Utils, xdescribe, xit */

//These are all in formatting-utils.js
/*global Calendar: false */

/*jslint laxbreak: true, white: false */

describe("Formatting Utils tests", function () {
	var utils = new Utils(),
		date;

	it("should not be a leap year", function() {
	    //%100 exception
		expect(utils.isLeapYear(1900)).toBeFalsy();
		//plain non-leap
		expect(utils.isLeapYear(1997)).toBeFalsy();
	});

	it("should be a leap year", function () {
		//%400 exception
		expect(utils.isLeapYear(2000)).toBeTruthy();
		//plain leap year
		expect(utils.isLeapYear(2008)).toBeTruthy();
	});

	it("should date within January", function () {
		//date within January
		date = new Date(2009, 0, 15);  //January 15, 2009
		expect(utils.howManyDaysSinceJanuaryFirst(date)).toEqual(14);
	});

	it("should date across multiple months, leap year", function () {
		//date across multiple months, leap year
		date = new Date(2008, 2, 31); //March 31, 2008
		expect(utils.howManyDaysSinceJanuaryFirst(date)).toEqual(90);
	});

	it("should date across multiple months, non-leap year", function () {
		//date across multiple months, non-leap year
		date = new Date(2009, 2, 31); //March 31, 2009
		expect(utils.howManyDaysSinceJanuaryFirst(date)).toEqual(89);
	});

	it("should date within December", function () {
		//
		date = new Date(2008, 11, 15); //December 15, 2008
		expect(utils.howManyDaysTillDecember31(date)).toEqual(16);
	});

	it("should date across multiple months, leap year", function () {
		date = new Date(2008, 1, 15); //February 15, 2008
		expect(utils.howManyDaysTillDecember31(date)).toEqual(320);
	});

	it("should date across multiple months, non-leap year", function () {
		date = new Date(2009, 1, 15); //February 15, 2009
		expect(utils.howManyDaysTillDecember31(date)).toEqual(319);
	});

	var startDate,
		endDate;

	it("should be 39 days between short range, leap year", function () {
		startDate = new Date(2008, 1, 15); //February 15, 2008
		endDate = new Date(2008, 2, 25);   //March 25, 2008
		expect(utils.howManyDaysBetweenShortRange(startDate, endDate)).toEqual(39);
	});

	it("should be 38 days between short range, non-leap year", function () {
		startDate = new Date(2009, 1, 15); //February 15, 2009
		endDate = new Date(2009, 2, 25);   //March 25, 2009
		expect(utils.howManyDaysBetweenShortRange(startDate, endDate)).toEqual(38);
	});

	var result,
		expectedResult;

	it("should be 404 days between, across one year boundary, leap year", function () {
		startDate = new Date(2008, 1, 15); //February 15, 2008
		endDate = new Date(2009, 2, 25);   //March 25, 2009
		expect(utils.howManyDaysBetween(startDate, endDate)).toEqual(404);
	});

	it("should be 403 many days between, across one year boundary, non-leap year", function () {
		startDate = new Date(2009, 1, 15); //February 15, 2009
		endDate = new Date(2010, 2, 25);   //March 25, 2010
		expect(utils.howManyDaysBetween(startDate, endDate)).toEqual(403);
	});

	it("should be 769 days between, across multi-year boundary, leap year", function () {
		startDate = new Date(2011, 1, 15); //February 15, 2011
		endDate = new Date(2013, 2, 25);   //March 25, 2013
		expect(utils.howManyDaysBetween(startDate, endDate)).toEqual(769);
	});

	it("should test how many days between, across multi-year boundary, non-leap year", function () {
		startDate = new Date(2009, 1, 15); //February 15, 2009
		endDate = new Date(2011, 2, 25);   //March 25, 2013
		expect(result).toEqual(expectedResult);
	});

	it("should be 2 months between, within year boundary", function () {
		startDate = new Date(2008, 1, 15); //February 15, 2008
		endDate = new Date(2008, 3, 25); //April 25, 2008
		expect(utils.howManyMonthsBetween(startDate, endDate)).toEqual(2);
	});

	it("should be 13 months between, across one year boundary", function () {
		startDate = new Date(2009, 1, 15); //February 15, 2009
		endDate = new Date(2010, 2, 25); //April 25, 2010
		expect(utils.howManyMonthsBetween(startDate, endDate)).toEqual(13);
	});

	it("should be 39 months between, across multi-year boundary", function () {
		startDate = new Date(2009, 1, 15); //February 15, 2009
		endDate = new Date(2012, 4, 25); //May 25, 2012
		expect(utils.howManyMonthsBetween(startDate, endDate)).toEqual(39);
	});

	it("should be 0 weeks between, within same week", function () {
		startDate = new Date(2009, 10, 2); //November 2, 2009
		endDate = new Date(2009, 10, 5);  //November 5, 2009
		expect(utils.howManyWeeksBetween(startDate, endDate)).toEqual(0);
	});

	it("should be one week apart", function () {
		startDate = new Date(2009, 10, 2); //November 2, 2009
		endDate = new Date(2009, 10, 9);  //November 9, 2009
		expect(utils.howManyWeeksBetween(startDate, endDate)).toEqual(1);
	});

	it("should be multiple weeks apart", function () {
		startDate = new Date(2009, 10, 2); //November 2, 2009
		endDate = new Date(2010, 1, 16);  //November 5, 2009
		expect(utils.howManyWeeksBetween(startDate, endDate)).toEqual(15);
	});

	it("should get time period parts forward; 3 days", function() {
		var startDate = new Date(2008, 0, 1);
		var endDate = new Date(2008, 0, 4);
		var result = utils.getTimePeriodParts(startDate, endDate, false);  //3 days
		expect(result.years).toEqual(0);
		expect(result.months).toEqual(0);
		expect(result.days).toEqual(3);
		expect(result.hours).toEqual(0);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts forward; 1 month, 3 days", function() {
		startDate = new Date(2008, 0, 1);
		endDate = new Date(2008, 1, 4);
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 month, 3 days
		expect(result.years).toEqual(0);
		expect(result.months).toEqual(1);
		expect(result.days).toEqual(3);
		expect(result.hours).toEqual(0);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts forward; 1 year, 1 month, 3 days", function() {
		startDate = new Date(2008, 0, 1);
		endDate = new Date(2009, 1, 4);
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 year, 1 month, 3 days
		expect(result.years).toEqual(1);
		expect(result.months).toEqual(1);
		expect(result.days).toEqual(3);
		expect(result.hours).toEqual(0);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts forward; 1 year, 1 month, 3 days, 2 hours", function() {
		startDate = new Date(2008, 0, 1, 10, 0, 0, 0);
		endDate = new Date(2009, 1, 4, 12, 0, 0, 0);
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 year, 1 month, 3 days, 2 hours
		expect(result.years).toEqual(1);
		expect(result.months).toEqual(1);
		expect(result.days).toEqual(3);
		expect(result.hours).toEqual(2);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts forward; 1 year, 1 month, 3 days, 2 hours, 30 minutes", function() {
		startDate = new Date(2008, 0, 1, 10, 0, 0, 0);
		endDate = new Date(2009, 1, 4, 12, 30, 0, 0);
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 year, 1 month, 3 days, 2 hours, 30 minutes
		expect(result.years).toEqual(1);
		expect(result.months).toEqual(1);
		expect(result.days).toEqual(3);
		expect(result.hours).toEqual(2);
		expect(result.minutes).toEqual(30);
	});

	it("should get time period parts backward; 7 days", function() {
		var startDate = new Date(2008, 11, 28);  //December 28, 2008
		var endDate = new Date(2009, 0, 4);	     //January 4, 2009
		var result = utils.getTimePeriodParts(startDate, endDate, false);  //7 days
		expect(result.years).toEqual(0);
		expect(result.months).toEqual(0);
		expect(result.days).toEqual(7);
		expect(result.hours).toEqual(0);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts backward; 1 month, 7 days", function() {
		startDate = new Date(2008, 11, 28);  //December 28, 2008
		endDate = new Date(2009, 1, 4);		 //February 4, 2009
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 month, 7 days
		expect(result.years).toEqual(0);
		expect(result.months).toEqual(1);
		expect(result.days).toEqual(7);
		expect(result.hours).toEqual(0);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts backward; 1 year, 2 month, 3 days", function() {
		startDate = new Date(2008, 11, 1);  //December 1, 2008
		endDate = new Date(2010, 1, 4);	    //February 4, 2010
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 year, 2 month, 3 days
		expect(result.years).toEqual(1);
		expect(result.months).toEqual(2);
		expect(result.days).toEqual(3);
		expect(result.hours).toEqual(0);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts backward; 1 year, 1 month, 2 days, 16 hours", function() {
		startDate = new Date(2008, 0, 1, 10, 0, 0, 0);   //January 1, 2008 10:00
		endDate = new Date(2009, 1, 4, 2, 0, 0, 0);	     //February 4, 2009 02:00
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 year, 1 month, 2 days, 16 hours
		expect(result.years).toEqual(1);
		expect(result.months).toEqual(1);
		expect(result.days).toEqual(2);
		expect(result.hours).toEqual(16);
		expect(result.minutes).toEqual(0);
	});

	it("should get time period parts backward; 1 year, 1 month, 2 days, 16 hours, 45 minutes", function() {
		startDate = new Date(2008, 0, 1, 10, 30, 0, 0);  //January 1, 2008 10:30
		endDate = new Date(2009, 1, 4, 2, 15, 0, 0);	 //February 4, 2009 02:15
		result = utils.getTimePeriodParts(startDate, endDate, false);  //1 year, 1 month, 2 days, 15 hours, 45 minutes
		expect(result.years).toEqual(1);
		expect(result.months).toEqual(1);
		expect(result.days).toEqual(2);
		expect(result.hours).toEqual(15);
		expect(result.minutes).toEqual(45);
	});
});