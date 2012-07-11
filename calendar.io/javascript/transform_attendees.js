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
nomen: false, onevar: true, plusplus: true, regexp: true, undef: true, white: false */

/*global stringify, Transform */

var attendeeTransform = {
	/* Handled generically */
	calendarUserType: "CUTYPE",
	commonName: "CN",
	delegatedFrom: "DELEGATED-FROM",
	delegatedTo: "DELEGATED-TO",
	dir: true,
	member: true,
	participationStatus: "PARTSTAT",
	role: true,
	sentBy: "SENT-BY",
	language: true,

	rsvp: function (attendee) {
	    // "type": "boolean"
		return "RSVP=" + (attendee.rsvp ? "TRUE" : "FALSE");
	},
	organizer: function (attendee) {
		// Unused in transform
	},
	email: function (attendee) {
		// Unused in transform
	},
	_id: function () {
		// Unused in tranform
	}
};

Transform.transformAttendees = function (event, options) {
	var out = [];
	event.attendees.forEach(function (attendee) {
		var params = Transform.transform(attendee, attendeeTransform, {
				separator: '=',
				joiner: ';',
				quotable: ':'
			}, options),
			result,
			type = attendee.organizer ? "ORGANIZER" : "ATTENDEE";

		result = type + 
				(params ? ';' : '') + params + 
				(attendee.email ? (':mailto:' + attendee.email) : '');

		out.push(result);
	});

	if (out.length) {
		if(options && options.logging) {
			console.log("transformAttendees(): returning: " + stringify(out));
		}
		return out;
	}

	return '';
};
