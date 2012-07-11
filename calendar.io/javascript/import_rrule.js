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
nomen: false, onevar: true, regexp: true, undef: true, white: false */

/*global Import, IO, Utils */

Import.importRrule = (function() {
	function parseRruleFreqField(line) {
		return (IO._valueAfterDelimiter(line, "="));
	}

	function parseRruleIntervalField(line) {
		return (IO._valueAfterDelimiter(line, "="));
	}

	function parseRruleCountField(line) {
		return (IO._valueAfterDelimiter(line, "="));
	}

	function parseRruleUntilField(line) {
		var until = IO._valueAfterDelimiter(line, "=");
		// Don't attempt timezone conversion here; we'll do it later
		until = until && Utils.dateFromIso8601(until, true);
		until = until && until.getTime();
		return until;
	}

	function parseRruleWkstField(line) {
		var value = null;
		value = IO._valueAfterDelimiter(line, "=");

		return IO._days[value];
	}

	function parseRruleBydayField(day) {
		var ordDay = {};

		function extractDayIndex(dayStr) {
			var dayCode = dayStr.substring(dayStr.length - 2).toUpperCase(),
				day = IO._days[dayCode];
			if (! (dayCode in IO._days)) {
				throw new Error("wrong day in RRULE BYDAY ORDDAY");
			}
			return day;
		}

		if (/^-?\d+[A-Z]{2}$/i.test(day)) {
			//number exists
			ordDay.day = extractDayIndex(day);
			ordDay.ord = day.substring(0, day.length - 2);
		} else if (/^[A-Z]{2}$/i.test(day)) {
			//not numbered
			ordDay.day = extractDayIndex(day);
		} else {
			return undefined;
		}
		return ordDay;
	}

	function parseRruleGenericByField(day, options) {
		var ordDay;
		if (options.regex.test(day)) {
			ordDay = {ord: day};
			if (!options.validator(ordDay)) {
				throw new Error("wrong " + options.byTypeLabel + " in RRULES BY" + options.byTypeLabel.toUpperCase());
			}
		}
		return ordDay;
	}

	function parseRruleByField(rruleObject, line, options) {
		if (!rruleObject[IO._RRULE_RULES_PROP_NAME]) {
			rruleObject[IO._RRULE_RULES_PROP_NAME] = [];
			//init up rrule object's rules array to empty
		}

		var value = IO._valueAfterDelimiter(line, "="),
			daysArray = IO._getValuesAsArray(value, ","),

			ruleValueArray = [],
			rule = {},
			i,
			ordDay,
			parser = options.customParser || parseRruleGenericByField;

		for (i = 0; i < daysArray.length; ++i) {
			try {
				ordDay = parser(daysArray[i], options);
			} catch (e) {
				e.message += ", item number " + i + ", 0-based";
				throw e;
			}
			if (ordDay) {
				ruleValueArray.push(ordDay);
			} else {
				throw new Error("could not parse " + options.byTypeLabel + ", item number " + i + ", 0-based");
			}
		}

		rule[IO._RRULE_RULES_RULETYPE_PROP_NAME] = options.rulePropName;
		rule[IO._RRULE_RULES_RULEVALUE_PROP_NAME] = ruleValueArray;

		rruleObject[IO._RRULE_RULES_PROP_NAME].push(rule);
	}

	var byFieldOptions = {
		"byDay": {
			rulePropName: IO._RRULEBYDAY_PROP_NAME,
			byTypeLabel: "day",
			customParser: parseRruleBydayField
		},
		"byMinute": {
			rulePropName: IO._RRULEBYMINUTE_PROP_NAME,
			regex: /^\d{1,2}$/,
			validator: function (ordDay) { return ordDay.ord <= 59 && ordDay.ord >= 0; },
			byTypeLabel: "minute"
		},
		"bySecond": {
			rulePropName: IO._RRULEBYSECOND_PROP_NAME,
			regex: /^\d{1,2}$/,
			validator: function (ordDay) { return ordDay.ord <= 60 && ordDay.ord >= 0; },
			byTypeLabel: "second"
		},
		"byHour": {
			rulePropName: IO._RRULEBYHOUR_PROP_NAME,
			regex: /^\d{1,2}$/,
			validator: function (ordDay) { return ordDay.ord <= 23 && ordDay.ord >= 0; },
			byTypeLabel: "hour"
		},
		"byMonthday": {
			rulePropName: IO._RRULEBYMONTHDAY_PROP_NAME,
			regex: /^-?\d{1,2}$/,
			// 1-2 digit number exists (valid values -1 to -31, 1 to 31)	 SEE p.40 of rfc5545 for constraints
			validator: function (ordDay) { return (ordDay.ord <= 31 && ordDay.ord >= 1) || (ordDay.ord <= -1 && ordDay.ord >= -31); },
			byTypeLabel: "monthday"
		},
		"byYearday": {
			rulePropName: IO._RRULEBYYEARDAY_PROP_NAME,
			regex: /^-?\d{1,3}$/,
			// 1-2 digit number exists (valid values -1 to -366, 1 to 366)  SEE p.40 of rfc5545 for constraints
			validator: function (ordDay) { return (ordDay.ord <= 366 && ordDay.ord >= 1) || (ordDay.ord <= -1 && ordDay.ord >= -366); },
			byTypeLabel: "yearday"
		},
		"byWeekno": {
			rulePropName: IO._RRULEBYWEEKNO_PROP_NAME,
			regex: /^-?\d{1,2}$/,
			// 1-2 digit number exists (valid values -1 to -53, 1 to 53)	 SEE p.40 of rfc5545 for constraints
			validator: function (ordDay) { return (ordDay.ord <= 53 && ordDay.ord >= 1) || (ordDay.ord <= -1 && ordDay.ord >= -53); },
			byTypeLabel: "weekno"
		},
		"byMonth": {
			rulePropName: IO._RRULEBYMONTH_PROP_NAME,
			regex: /^\d{1,2}$/,
			// 1-2 digit number exists (valid values 1 to 12)  SEE p.40 of rfc5545 for constraints
			validator: function (ordDay) { return (ordDay.ord <= 12 && ordDay.ord >= 1); },
			byTypeLabel: "month"
		},
		"bySetpos": {
			rulePropName: IO._RRULEBYSETPOS_PROP_NAME,
			regex: /^-?\d{1,}$/,
			// 1-2 digit number exists (valid values -n to n)  SEE p.40 of rfc5545 for constraints
			validator: function (ordDay) { return ordDay.ord; },
			byTypeLabel: "setpos"
		}
	};

	return function(line) {
		var rruleObject = {},
			value,
			// rules,
			property = "";

		line = IO._textValueFromLine(line);
		//remove :

		//tokenize by ;
		while (line.length > 0) {
			if (/;/.test(line)) {
				property = IO._valueBeforeDelimiter(line, ";");
				line = IO._valueAfterDelimiter(line, ";");
			} else {
				property = line;
				line = "";
			}

			if (IO._RRULEFREQ_REGEX.test(property)) {
				rruleObject[IO._RRULEFREQ_PROP_NAME] = parseRruleFreqField(property);
			} else if (IO._RRULEINTERVAL_REGEX.test(property)) {
				value = parseRruleIntervalField(property);
				rruleObject[IO._RRULEINTERVAL_PROP_NAME] = value > 0 ? value: undefined;
			} else if (IO._RRULECOUNT_REGEX.test(property)) {
			//exclusive of UNTIL //TASK:foce exclusivity
				rruleObject[IO._RRULECOUNT_PROP_NAME] = parseRruleCountField(property);
			} else if (IO._RRULEUNTIL_REGEX.test(property)) {
			//exclusive of COUNT //TASK:foce exclusivity
				rruleObject[IO._RRULEUNTIL_PROP_NAME] = parseRruleUntilField(property);
			} else if (IO._RRULEWKST_REGEX.test(property)) {
			//exclusive of COUNT //TASK:foce exclusivity
				value = parseRruleWkstField(property);
				if (value === undefined) {
					throw new Error("could not parse RRULE WKST field.");
				} else {
					rruleObject[IO._RRULEWKST_PROP_NAME] = value;
				}

			} else if (IO._RRULEBYDAY_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.byDay);
			} else if (IO._RRULEBYMINUTE_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.byMinute);
			} else if (IO._RRULEBYSECOND_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.bySecond);
			} else if (IO._RRULEBYHOUR_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.byHour);
			} else if (IO._RRULEBYMONTHDAY_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.byMonthday);
			} else if (IO._RRULEBYYEARDAY_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.byYearday);
			} else if (IO._RRULEBYWEEKNO_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.byWeekno);
			} else if (IO._RRULEBYMONTH_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.byMonth);
			} else if (IO._RRULEBYSETPOS_REGEX.test(property)) {
				parseRruleByField(rruleObject, property, byFieldOptions.bySetpos);
			}
		}

		return (rruleObject);
	};

}());
