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

/*jslint bitwise: true, devel: true, eqeqeq: true, immed: true, maxerr: 500, newcap: true,
nomen: false, onevar: true, plusplus: false, regexp: true, undef: true, white: false */

/*global _, ObjectUtils, stringify, Config */

var Utils = {
	/*jslint regexp: false */
	stripwsRegex: /^[\s]*([^\s].*[^\s])?[\s]*$/,
	lstripwsRegex: /^[\s]*([^\s].*)?$/,
	rstripwsRegex: /^(.*[^\s])?[\s]*$/,
	/*jslint regexp: true */

	strip: function (str, charset) {
		var regex = charset ?
			new RegExp("^[" + charset + "]*([^" + charset + "].*[^" + charset + "])?[" + charset + "]*$") :
			Utils.stripwsRegex;
		return str.replace(regex, "$1");
	},

	lstrip: function (str, charset) {
		var regex = charset ?
			new RegExp("^[" + charset + "]*([^" + charset + "].*)?$") :
			Utils.lstripwsRegex;
		return str.replace(regex, "$1");
	},

	rstrip: function (str, charset) {
		var regex = charset ?
			new RegExp("^(.*[^" + charset + "])?[" + charset + "]*$") :
			Utils.rstripwsRegex;
		return str.replace(regex, "$1");
	},

	numDigits: function (num) {
		if (num < 0) {
			num = -num;
		}
		return num === 0 ? 1 : Math.floor(1+(Math.log(num)/Math.log(10)));
	},

	formatWithLeadingZeros: function (num, places) {
		var digits = Utils.numDigits(num);
		if (places === undefined) {
			places = 2;
		}
		digits = places - digits > 0 ? places - digits : 0;
		return ('0000000000'.slice(0, digits)) + num;
	},

	/*$
	 *	Converts a Date or timestamp (in milliseconds since 1/1/1970) to an ISO-
	 *	8601 compliant string.
	 *
	 *	The 'options' parameter can be a boolean, indicating that only the date
	 *	should be used to build the string (if 'true') or the date and time (if
	 *	'false').  'options' can also be an object, with any of the following
	 *	fields:
	 *
	 *		justDate:	use only the date (if 'true') or date and time (if 'false')
	 *		noPunct:	Don't use '-' and ':' to separate date and time elements,
	 *					respectively.
	 *		noMS:		Do not include the milliseconds.
	 *		noTzOffset:	Do not include the timezone offset.
	 *		useZulu:	Append 'Z' for timezone instead of offset.
	 *
	 * @params {Date|Number} date Date to convert to ISO-8601 formatted string
	 * @params {Object} options Formatting options
	 *
	 * @returns {String} ISO-8601 formatted string
	 */
	dateToIso8601: function (date, options) {
		options = options || {};

		if (typeof (options) === "boolean") {
			options = {justDate: options};
		}

		if (!_.isDate(date)) {
			date = new Date(date);
		}

		function dash() { return options.noPunct ? '' : '-'; }
		function colon() { return options.noPunct ? '' : ':'; }

		function getFullYear()		{ return options.useZulu ? date.getUTCFullYear()		: date.getFullYear(); }
		function getMonth()			{ return options.useZulu ? date.getUTCMonth()			: date.getMonth(); }
		function getDate()			{ return options.useZulu ? date.getUTCDate()			: date.getDate(); }
		function getHours()			{ return options.useZulu ? date.getUTCHours()			: date.getHours(); }
		function getMinutes()		{ return options.useZulu ? date.getUTCMinutes()			: date.getMinutes(); }
		function getSeconds()		{ return options.useZulu ? date.getUTCSeconds()			: date.getSeconds(); }
		function getMilliseconds()	{ return options.useZulu ? date.getUTCMilliseconds()	: date.getMilliseconds(); }

		function formatDate() {
			return getFullYear() + dash() +
				Utils.formatWithLeadingZeros(getMonth() + 1) + dash() +
				Utils.formatWithLeadingZeros(getDate());
		}
		function formatTime() {
			if (options.justDate) {
				return '';
			}

			function formatMilliseconds() {
				if (options.noMS) {
					return '';
				}
				return '.' + Utils.formatWithLeadingZeros(getMilliseconds(), 3);
			}

			function formatTimeZone() {
				if (options.useZulu) {
					return 'Z';
				}

				if (options.noTzOffset) {
					return '';
				}

				var tzOffset = date.getTimezoneOffset(),
					negativeOffset = tzOffset >= 0,		// This is the opposite of what one would expect
					hours,
					minutes,
					formatted;

				tzOffset = Math.abs(tzOffset);
				hours = tzOffset / 60;
				minutes = tzOffset % 60;

				formatted = (negativeOffset ? "-" : "+") + Utils.formatWithLeadingZeros(hours) + Utils.formatWithLeadingZeros(minutes);

				return formatted;
			}

			return 'T' + Utils.formatWithLeadingZeros(getHours()) + colon() +
							Utils.formatWithLeadingZeros(getMinutes()) + colon() +
							Utils.formatWithLeadingZeros(getSeconds()) +
							formatMilliseconds() +
							formatTimeZone();
		}

		return formatDate() + formatTime();
	},

	/*$
	 * Converts an ISO-8601 compliant string into a Date object.
	 *
	 * The general formats supported are:
	 *		YYYYMMDDTHHMMSS
	 *		YYYY-MM-DDTHH:MM:SS
	 *
	 * All fields are to be zero-padded.  Time is indicated using a 24 hour clock.
	 * The time portion may be omitted to specify only a date.  The reverse is
	 * NOT true.  As there is no such thing as a truly "date-only" Date object,
	 * date-only strings will be converted into Date objects with the
	 * time set to 00:00:00.
	 *
	 * A timezone may be specified or UTC (Zulu) indicated.  For example:
	 *		20100112T23:10:00-0700
	 *		20100112T23:10:00Z
	 *
	 * The optional 'options' parameter can be an object with any of the
	 * following fields:
	 *
	 *		ignoreTimezone:	If true, date/times will be converted into Dates as
	 *						though no timezone were specified.  If falsy, date/
	 *						times will be converted taking into account the
	 *						timezone specifier, if present. The default is to
	 *						account for the timezone specifier, if present.
	 *
	 * The 'options' parameter can also be a boolean; in this case, 'options'
	 * behaves like the 'ignoreTimezone' field of the full 'options' object.
	 *
	 * NOTE: This function only supports calendar dates and times.  It does not
	 * support week dates, ordinal dates, durations, time intervals, repeating
	 * intervals or truncated representations.
	 *
	 * @params {String} isoDate A date as an ISO-8601 formatted string
	 * @params {Object|Boolean} options Conversion options
	 *
	 * @returns {Date} A new Date object set to the specified date/time
	 *
	 * @see http://en.wikipedia.org/wiki/ISO_8601#Calendar_dates
	 * @see http://en.wikipedia.org/wiki/ISO_8601#Times
	 * @see parseIso8601Duration
	 */
	dateFromIso8601: function (isoDate, options) {
		Utils.debug(">>> dateFromIso8601(): isoDate: " + stringify(isoDate));

		options = options || {};

		if (typeof (options) === "boolean") {
			options = {ignoreTimezone: options};
		}
		Utils.debug(">>> dateFromIso8601(): options: " + stringify(options));

		var date,
			dateRegex = new RegExp("([\\d]{4})-?([\\d]{2})-?([\\d]{2})(?:T([\\d]{2}):?([\\d]{2}):?([\\d]{2})(?:\\.([\\d]{3}))?(Z|(?:-[\\d]{1,2}:[\\d]{2}))?)?"),
			year,
			month,
			day,
			hours,
			minutes,
			seconds,
			milliseconds,
			timezone,
			hoursShift,
			minutesShift,
			out;

		out = dateRegex.exec(isoDate);
		Utils.debug(">>> dateFromIso8601(): regex results: " + stringify(out));

		if (out && out.length) {
			year = out[1];
			month = out[2];
			day = out[3];
			hours = out[4];
			minutes = out[5];
			seconds = out[6];
			milliseconds = out[7];
			timezone = !options.ignoreTimezone && out[8];	// Only grab it if we're going to use it

			if (timezone && (timezone === "Z" || timezone === "z")) {
				date = new Date();
				date.setUTCFullYear(year);
				date.setUTCMonth(month - 1);
				date.setUTCDate(day);
				if (hours && minutes && seconds) {
					date.setUTCHours(hours);
					date.setUTCMinutes(minutes);
					date.setUTCSeconds(seconds);
					date.setUTCMilliseconds(milliseconds || 0);
				}
			} else {
				if (hours && minutes && seconds) {
					date = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds || 0);
					if (timezone) {
						timezone = parseInt(timezone, 10);
						hoursShift = Math.round(timezone / 100);
						minutesShift = Math.round(timezone % 100);
						date.setHours(date.getHours() + hoursShift);
						date.setMinutes(date.getMinutes() + minutesShift);
					}
				} else {
					date = new Date(year, month - 1, day);
				}
			}
			Utils.debug(">>> dateFromIso8601(): date: " + date);
		}

		return date;
	},

	/*$
	 * Parses an ISO-8601 formatted duration string into an object.  The object
	 * will contain each of the following fields if they are present in the
	 * duration string:
	 *
	 *		years
	 *		months
	 *		days
	 *		hours
	 *		minutes
	 *		seconds
	 *
	 * If the duration is so specified, the object may contain <code>weeks</code>
	 * instead.
	 *
	 * The general format is: PnYnMnDTnHnMnS or PnW (for weeks), where 'n' is
	 * a number.  Fields for which the value is zero may be omitted.
	 *
	 * NOTE: Although the standard permits the "smallest" field present to be
	 * specified using a floating-point number (e.g., P0.5Y for half a year),
	 * this function only supports the floating-point convention for the seconds
	 * field.
	 *
	 * Example durations:
	 *
	 *		P1M			One month
	 *		PT1M		One minute
	 *		PT1H10M		One hour, ten minutes
	 *		PT36H		36 hours (1.5 days)
	 *		P1DT12H		1.5 days (36 hours)
	 *		-PT1H		Negative one hour
	 *
	 *
	 * @param {String} duration ISO-8601 formatted duration
	 * @returns {Object} Object containing duration fields
	 *
	 * @see http://en.wikipedia.org/wiki/ISO_8601#Durations
	 */
	parseIso8601Duration: function (duration) {
		// This gives us (for a valid ISO 8601 duration) the following array:
		// [<full match>][<+/->][<year>][<month>][<day>][<hours>][<minutes>][<seconds>][<weeks>]
		var durationRegex = new RegExp("([-+]?)P(?:(?:(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9\\.]+)S)?)?)|(?:([0-9]+)W)"),
			offsets = {
				sign: 1,
				years: 2,
				months: 3,
				days: 4,
				hours: 5,
				minutes: 6,
				seconds: 7,
				weeks: 8
			},
			result = durationRegex.exec(duration);

		Utils.debug("parseIso8601Duration(): result: " + stringify(result));

		// TODO: Translate longer periods (years, months, weeks) into additional days?
		return result && {
			sign:		result[offsets.sign] || undefined,
			years:		Number(result[offsets.years])	|| undefined,
			months:		Number(result[offsets.months])	|| undefined,
			days:		Number(result[offsets.days])	|| undefined,
			hours:		Number(result[offsets.hours])	|| undefined,
			minutes:	Number(result[offsets.minutes])	|| undefined,
			seconds:	Number(result[offsets.seconds])	|| undefined
		};
	},
	
	log: function () {
		var argsArr = Array.prototype.slice.call(arguments, 0);
		Utils._logBase("log", argsArr);
	},

	warn: function () {
		var argsArr = Array.prototype.slice.call(arguments, 0);
		Utils._logBase("warn", argsArr);
	},

	error: function () {
		var argsArr = Array.prototype.slice.call(arguments, 0);
		Utils._logBase("error", argsArr);
	},

	debug: function() {
		if (Config && Config.logs === "debug") {
			var argsArr = Array.prototype.slice.call(arguments, 0);
			Utils._logBase("log", argsArr);
		}
	},
	
	_logBase: function (method, argsArr) {
		var data = argsArr.reduce(function (accumulatedMessage, curArg) {
			if (typeof curArg === "string") {
				return accumulatedMessage + curArg;
			} else {
				return accumulatedMessage + JSON.stringify(curArg);
			}
		}, ""),
		i, 
		pos, 
		datum;
			
		if (Config && Config.logs === "verbose") {
			// I want ALL my logs!
			data = data.split("\n");
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
	}
};
