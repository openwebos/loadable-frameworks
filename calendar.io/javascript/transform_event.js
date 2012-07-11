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

/*global _, Class, stringify, Transform, ObjectUtils, Utils, IO */

Transform.transformEvent = (function () {

	function formatDateTimeField(event, millis) {
		var tz = '',
			value = '',
			date;

		if (event.allDay) {
			value = ";VALUE=DATE";
			date = Transform.formatDateOnly(millis);
		} else {
			tz = event.tzId ? (';TZID="' + event.tzId + '"') : '';
			date = Transform.formatDate(millis);
		}

		return tz + value + ':' + date;
	}
	
	function formatDtDate(event, dateField) {
		return formatDateTimeField(event, event[dateField]);
	}

	var vEventTransform = {
		/*	Handled generically: */
		categories: true,
		classification: "CLASS",
		comment: true,
		contact: true,
		created: true,
		geo: true,
		priority: true,
		relatedTo: "RELATED-TO",
		requestStatus: true,
		sequence: true,
		transp: true,
		url: true,
		
		tzId: function (event) {
			// "type": "string",
			// "optional": "true",
			// "description": "timezone string, such as America/Los_Angeles. Formerly timeZoneID"
			// TODO: implement
		},
		dtstart: function (event) {
			// "type": "long",
			// "description": "start date and time of the event. Formerly startTimestamp"
			return "DTSTART" + formatDtDate(event, 'dtstart');
		},
		dtend: function (event) {
			// "type": "long",
			// "description": "end date and time of the event. Formerly endTimestamp"
			return "DTEND" + formatDtDate(event, 'dtend');
		},
		rrule: function (event, options) {
			return Transform.transformRRule(event, options);
		},
		recurrenceId: function (event, options) {
			// RFC 5545 requires the recurrenceId to be in the same date-time format as dtstart
			// So if dtstart is a local time, RECURRENCE-ID must be as well.
			
			// TODO: FIX: hack so this code is only used for meeting invitations.
			// Currently, calendar app/sync doesn't handle non-UTC recurrence ids very well.
			// However, Exchange seems to require it to strictly follow the RFC.
			if (options.icsMode) {
				try {
					// TODO: FIX: like everything else, this needs to be relative to the event timezone, not the device timezone.
					var localTime = Utils.dateFromIso8601(event.recurrenceId);

					return "RECURRENCE-ID" + formatDateTimeField(event, localTime.getTime());
				} catch (e) {
					Utils.error("Error parsing recurrenceId");
				}
			}
			
			return "RECURRENCE-ID:" + event.recurrenceId;
		},
		alarm: function (event, options) {
			// "type": [{
			//	"$ref": "Alarm"
			// }],
			// "optional": "true",
			// "description": "alarm object, same name, used to be string type.	 also incorporates yahoo-specific valarm field"
			return Transform.transformAlarm(event, options);
		},
		rdates: function (event) {
			// "type": "array",
			// "optional": "true"
			// TODO: implement
		},
		exdates: function (event) {
			// "type": "array",
			// "optional": "true"
			if (event.exdates && event.exdates.length) {
				return "EXDATE:" + event.exdates.join(",");
			}
		},
		attendees: function (event, options) {
			// "type": ["$ref": "Attendee"]
			// "optional": "true"
			return Transform.transformAttendees(event, options);
		},
		dtstamp: function (event) {
			// "type": "string",
			// "optional": "true"
			return "DTSTAMP:" + Transform.formatDate(event.dtstamp, true);
		},
		lastModified: function (event) {
			// "type": "int",
			// "optional": "true"
			return "LAST-MODIFIED" + (event.tzId ? (';TZID="' + event.tzId + '"') : '') + ':' + Transform.formatDate(event.lastModified, !event.tzId);
		},
		resources: function (event) {
			// "type": "string",
			// "optional": "true"
			return "RESOURCES:" + event.resources;
		},
		attach: function (event) {
			// "type": "array",
			// "optional": "true"
			// TODO: implement
		},
		
		uid: function (event) {
			return "UID:" + event.uid;
		},
		
		note: function (event) {
			return "DESCRIPTION:" + IO._escapeLine(event.note);
		},
		
		subject: function (event) {
			return "SUMMARY:" + IO._escapeLine(event.subject);
		},
		
		location: function (event) {
			return "LOCATION:" + IO._escapeLine(event.location);
		},

		// Filter out vCalendar object fields
		version: false,
		prodid: false,

		// Filter out fields specific to local store
		_del: false,
		_id: false,
		_kind: false,
		_rev: false,
		accountId: false,
		allDay: false,
		calendarId: false,
		etag: false,
		parentDtstart: false,
		parentId: false,
		remoteId: false,

		// Filter out Calendar's little crufty bits
		alldayReserveddtstart: false,
        alldayReservedEndTimestamp: false,
        alldayReservedStartTimestamp: false,
		animatible: false,
		calendarColor: false,
		currentLocalEnd: false,
		currentLocalStart: false,
		dirty: false,
		end_decimal: false,
		height: false,
		isRecurringForever: false,
		left: false,
		onlyRepeatChanged: false,
		origDragTop: false,
		overlap_count: false,
		overlap_index: false,
		renderEndTime: false,
		renderStartTime: false,
		saved: false,
		saving: false,
		start_decimal: false,
		textFieldWidth: false,
		top: false,
		topCompress: false,
		width: false
	/* TODO: Not implementing???
		floating: function (event) {
			// "type": "boolean",
			// "optional": "true"
			// TODO: implement - no?
		},
		allDay: function (event) {
			// "type": "boolean"
			// TODO: implement - no?
		}
	*/
	};

	return function (vCalendar, options) {
		var events;

		events = _.map(vCalendar.events, function (event) {
			return Transform.transform(event, vEventTransform, {
				header: [
					"BEGIN:VEVENT"
				],
				footer: [
					"END:VEVENT"
				],
				separator: ':',
				noJoin: true
			}, options);
		});

		return events;
	};
}());

var eventToVCalendar = IO.eventToVCalendar = function (events, timezones, method, options) {
	var vCalendarTransform = {
			events: function (vCalendar) {
				return Transform.transformEvent(vCalendar, options);
			},
			
			timezones: function (vCalendar) {
				return Transform.transformTimezones(vCalendar, options);
			}
		},
		header = [
			"BEGIN:VCALENDAR",
			"VERSION:2.0"
		],
		vCalendar = {
			events: Array.isArray(events) ? events : [events],
			timezones: timezones
		};

	_.detect(vCalendar.events, function (event) {
		if (event.prodid) {
			header.push("PRODID:" + event.prodid);
			return true;
		}
		return false;
	});
	
	if(method) {
		header.push("METHOD:" + method);
	}

	return Transform.transform(vCalendar, vCalendarTransform, {
		header: header,
		footer: [
			"END:VCALENDAR"
		],
		separator: ':',
		foldlines: true
	}, options);
};

var eventRRuleToVCalendarRRule = IO.eventRRuleToVCalendarRRule = function (event, options) {
	return Transform.transformRRule(event, options);
};
