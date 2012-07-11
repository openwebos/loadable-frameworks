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

/*jslint bitwise: true, eqeqeq: true, immed: true, maxerr: 500, newcap: true, 
nomen: false, onevar: true, plusplus: true, regexp: true, undef: true, white: false */
/*global Transform, _ */

var vStandardDaylightTransform = {
	tzOffsetFrom: true,
	tzOffsetTo: true,
	tzName: true,

	dtstart: function(sd, options) {
		return "DTSTART:" + sd.dtstart;
	},
	
	rrule: function(sd, options) {
		return Transform.transformRRule(sd);
	},
	
	rdate: function(sd, options) {
		// TODO: implement rdate handling in timezone transform
	}
};

Transform.transformStandardDaylight = function(sd, type, options) {
	return Transform.transform(sd, vStandardDaylightTransform, {
		header: [
			"BEGIN:" + type
		],
		footer: [
			"END:" + type
		],
		separator: ':',
		noJoin: true
	}, options);
};

var vTimezoneTransform = {
	tzId: false, // tzId already included in header

	standard: function(timezone, options) {
		return Transform.transformStandardDaylight(timezone.standard, "STANDARD", options);
	},
	
	daylight: function(timezone, options) {
		return Transform.transformStandardDaylight(timezone.daylight, "DAYLIGHT", options);
	}
};

Transform.transformTimezones = function(vCalendar, options) {
	var timezones;

	timezones = _.map(vCalendar.timezones, function (timezone) {
		return Transform.transform(timezone, vTimezoneTransform, {
			header: [
				"BEGIN:VTIMEZONE",
				"TZID:" + timezone.tzId // this must go before other timezone fields
			],
			footer: [
				"END:VTIMEZONE"
			],
			separator: ':',
			noJoin: true
		}, options);
	});

	return timezones;
};