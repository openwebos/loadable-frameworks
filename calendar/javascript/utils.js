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

/*
TODO: DOC: Make sure doc comments comply with selected standard
REVIEWED: Erik Jaesler 2012-01-12
*/

/*global Class: false, exports: false, PalmCall: false, Config, console*/
/*jslint laxbreak: true, white: false */

function Utils() {

}

Utils.prototype = {

	//Number of days in each month of a leap year
	leapYearDaysInMonth:    [31,  29,  31,  30,  31,  30,  31,  31,  30,  31,  30,  31],

	//Number of days since January 1 at the end of each month of a leap year
	leapYearDaysCumulative: [31,  60,  91, 121, 152, 182, 213, 244, 274, 305, 335, 366],

	//Number of days in each month of a regular year
	regularYearDaysInMonth:    [31,  28,  31,  30,  31,  30,  31,  31,  30,  31,  30,  31],

	//Number of days since January 1 at the end of each month of a regular year
	regularYearDaysCumulative: [31,  59,  90, 120, 151, 181, 212, 243, 273, 304, 334, 365],

	//Number of days until December 31 at the start of each month of a leap year
	leapYearDaysCumulativeReverse:    [366, 335, 306, 275, 245, 214, 184, 153, 122,  92,  61,  31],

	//Number of days until December 31 at the start of each month of a regular year
	regularYearDaysCumulativeReverse: [365, 334, 306, 275, 245, 214, 184, 153, 122,  92,  61,  31],

	importDateJS : function (DateClass) {

		var DateJS	= Date.prototype
		,	member
		,	local	= DateClass.prototype;

		// Copy DateJS modified Date's members to the supplied DateClass:
		for (member in Date) {
			if (!(member in DateClass)) {
				DateClass [member] = Date [member];
			}
		}

		// Copy DateJS modified Date's protoype members to the supplied DateClass:
		for (member in DateJS) {
			if (!(member in local)) {
				local [member] = DateJS [member];
			}
		}
	},


	//Returns true if the year is a leap year
	isLeapYear: function (year) {
		if (year % 4) {
			return false;
		}
		if (year % 400 === 0) {
			return true;
		}
		if (year % 100 === 0) {
			return false;
		}
		return true;
	},

	//finds # of days between January 1 and the given date, in the year of the given date.
	//Timezone agnostic
	howManyDaysSinceJanuaryFirst: function (date) {
		var howManyDays = 0;
		var day = date.getDate();
		var year = date.getFullYear();
		var previousMonth = date.getMonth() - 1;

		//add the days for all previous months
		if(previousMonth >= 0) {
			if (this.isLeapYear(year)) {
				howManyDays = this.leapYearDaysCumulative[previousMonth];
			}
			else {
				howManyDays = this.regularYearDaysCumulative[previousMonth];
			}
		}

		//add the days for the current month
		howManyDays += (day-1);

		return howManyDays;
	},

	//finds # of days between the given date and December 31, in the year of the given date.
	//Timezone agnostic
	howManyDaysTillDecember31: function (date) {
		var howManyDays = 0;
		var day = date.getDate();
		var year = date.getFullYear();
		var month = date.getMonth();
		var nextMonth = date.getMonth()+1;
		var daysInMonthArray = this.regularYearDaysInMonth;

		//add the days for all months after the current month
		if(nextMonth < 12) {
			if(this.isLeapYear(year)){
				daysInMonthArray = this.leapYearDaysInMonth;
				howManyDays = this.leapYearDaysCumulativeReverse[nextMonth];
			}
			else {
				howManyDays = this.regularYearDaysCumulativeReverse[nextMonth];
			}
		}

		//add the days left in the current month
		howManyDays += (daysInMonthArray[month] - day);

		return howManyDays;
	},

	//finds # of days between two given dates.
	//Require: dates are within the same year
	//Require: startRange < endRange
	//Timezone agnostic
	howManyDaysBetweenShortRange: function (startDate, endDate) {
		var howManyDays = 0;
		var daysInMonthArray = this.regularYearDaysInMonth;
		var cumulativeArray = this.regularYearDaysCumulative;
		var startMonth = startDate.getMonth();
		var startDay = startDate.getDate();
		var year = startDate.getFullYear();

		var endMonth = endDate.getMonth();
		var endDay = endDate.getDate();
		var monthDiff = endMonth - startMonth;

		//if we are within the same month
		if(monthDiff === 0) {
			return (endDay - startDay);
		} else {
			if(this.isLeapYear(year)) {
				daysInMonthArray = this.leapYearDaysInMonth;
				cumulativeArray = this.leapYearDaysCumulative;
			}

			//add days left in the start month
			howManyDays += (daysInMonthArray[startMonth] - startDay);

			//add days past in the end month
			howManyDays += endDay;

			//add days in months in between
			if (monthDiff > 1) {
				howManyDays += (cumulativeArray[endMonth - 1] - cumulativeArray[startMonth]);
			}
		}

		return howManyDays;
	},

	//finds # of days between two given dates.
	//Require: startRange < endRange
	//Timezone agnostic
	howManyDaysBetween: function (startDate, endDate){
		var howManyDays = 0;
		var startYear = startDate.getFullYear();
		var endYear = endDate.getFullYear();
		if(startYear == endYear){
			howManyDays = this.howManyDaysBetweenShortRange(startDate, endDate);
		} else {
			howManyDays += this.howManyDaysTillDecember31(startDate);
			howManyDays += this.howManyDaysSinceJanuaryFirst(endDate) +1;

			for(var year = startYear+1; year < endYear; year++){
				if (this.isLeapYear(year)) {
					howManyDays += 366;
				}
				else {
					howManyDays += 365;
				}
			}
		}
		return howManyDays;
	},

	//finds # of whole months between two given dates.
	//Require: startDate < endDate
	//Timezone agnostic
	howManyMonthsBetween: function (startDate, endDate){
		var howManyMonths = 0;

		var startMonth = startDate.getMonth();
		var startYear = startDate.getFullYear();

		var endMonth = endDate.getMonth();
		var endYear = endDate.getFullYear();

		if(startYear == endYear) {
			return endMonth - startMonth;
		} else {
			howManyMonths += (12 - startMonth);
			howManyMonths += endMonth;
			howManyMonths += (endYear - startYear - 1) * 12;
		}
		return howManyMonths;
	},

	//finds # of whole weeks (7 day periods) between two given dates.
	//Require: startRange < endRange
	//Timezone agnostic
	howManyWeeksBetween: function (startDate, endDate) {
		var days = this.howManyDaysBetween(startDate, endDate);
		return Math.floor(days / 7);
	},

	//Dissects the period specified by startDate and endDate into the
	//number of years, months, days, hours, and minutes between the two.
	//Returns an object formatted: {years, months, days, hours, minutes}.
	getTimePeriodParts: function(startDate, endDate, isAllDay){

		var period = {years: 0, months: 0, days: 0, hours: 0, minutes: 0};

		var monthsBetween = this.howManyMonthsBetween(startDate, endDate);
		if (startDate.getDate() > endDate.getDate()) {
			monthsBetween--;
		}
		period.years = Math.floor(monthsBetween / 12);
		period.months = monthsBetween % 12;

		if (endDate.getDate() >= startDate.getDate()) {
			period.days = endDate.getDate() - startDate.getDate();
		}
		else {
			var jumpDate = startDate.getDate();
			var jumpMonth = endDate.getMonth() - 1;
			var jumpYear = endDate.getFullYear();
			if (jumpMonth < 0) {
				jumpMonth = 11;
				jumpYear--;
			}
			var tempDate = new Date(jumpYear, jumpMonth, jumpDate);
			period.days = this.howManyDaysBetween(tempDate, endDate);
		}

		if (endDate.getHours() >= startDate.getHours()) {
			period.hours = endDate.getHours() - startDate.getHours();
		}
		else {
			period.hours = endDate.getHours() + 24 - startDate.getHours();
			period.days--;
		}

		if (endDate.getMinutes() >= startDate.getMinutes()) {
			period.minutes = endDate.getMinutes() - startDate.getMinutes();
		}
		else {
			period.minutes = endDate.getMinutes() + 60 - startDate.getMinutes();
			period.hours--;
		}

		if(isAllDay){
			period.days++;
			period.hours = 0;
			period.minutes = 0;
		}

		return period;
	}

};

(function(){
	/** Closure to hold private singular Utils instance. */

	// Create the singular private Utils instance:
	var singleton = new Utils();

	// Override the Utils constructor to always returns its singular instance:
	Utils = function Utils(){
		return singleton;
	};

	Utils.log = function () {
		var argsArr = Array.prototype.slice.call(arguments, 0);
		Utils._logBase("log", argsArr);
	};

	Utils.warn = function () {
		var argsArr = Array.prototype.slice.call(arguments, 0);
		Utils._logBase("warn", argsArr);
	};

	Utils.error = function () {
		var argsArr = Array.prototype.slice.call(arguments, 0);
		Utils._logBase("error", argsArr);
	};

	Utils.debug = function() {
		if (Config && (Config.logs === "debug" || Config.logs === "verbose")) {
			var argsArr = Array.prototype.slice.call(arguments, 0);
			Utils._logBase("log", argsArr);
		}
	};

	Utils._logBase = function (method, argsArr) {
		var data = argsArr.reduce(function (accumulatedMessage, curArg) {
			if (typeof curArg === "string") {
				return accumulatedMessage + curArg;
			} else {
				return accumulatedMessage + JSON.stringify(curArg);
			}
		}, "");

		if (Config && Config.logs === "verbose") {
			// I want ALL my logs!
			data = data.split("\n");
			var i, pos, datum;
			for (i = 0; i < data.length; ++i) {
				datum = data[i];
				if (datum.length < 500) {
					console[method](datum);
				} else {
					// Do our own wrapping
					for (pos = 0; pos < datum.length; pos += 500) {
						console[method](datum.slice(pos, pos + 500));
					}
				}
			}
		} else {
			console[method](data);
		}
	};
})();
