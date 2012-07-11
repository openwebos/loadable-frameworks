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

/*jslint devel: true, onevar: false, undef: true, eqeqeq: true, bitwise: true,
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */

/*global describe, eventRRuleToVCalendarRRule, eventToVCalendar, expect, it, Transform, xit */

// TODO: Correct "until" and "dtstamp" code to handle UTC correctly

var isoRegex = /([\-:]|(\.\d+))/g;

function reformatISOString(utcTimestamp) {
	return new Date(utcTimestamp).toISOString().replace(isoRegex, '');
}

var event2VCalTestData = {
	vCalBasicHeader: "BEGIN:VCALENDAR\r\nVERSION:2.0\r\n",
	vCalBasicFooter: "END:VCALENDAR\r\n",
	vCalHeader: "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\n",
	vCalFooter: "END:VEVENT\r\nEND:VCALENDAR",
	timesNoTz: "DTSTART:20100604T130000\r\nDTEND:20100604T140000\r\n",
	timesNoTzDates: {
		dtstart: new Date("2010-06-04T13:00:00"),
		dtend: new Date("2010-06-04T14:00:00")
	},
	times: 'DTSTART;TZID="America/Los_Angeles":20100604T130000\r\nDTEND;TZID="America/Los_Angeles":20100604T140000\r\n',
	timesDates: {
		dtstart: new Date("2010-06-04T13:00:00"),
		dtend: new Date("2010-06-04T14:00:00")
	},
	organizer: "ORGANIZER:mailto:ejakowatz@yahoo.com\r\n",
	longSummary: "SUMMARY:Here is a long summary\\, because somebody likes really long subjec\r\n t lines in their meeting requests and who am I to tell them 'no\\, you can'\r\n t have a really long subject line'?	 That would just be fascistic!\r\n",
	attendee : 'ATTENDEE;MEMBER="mailto:DEV-GROUP@example.com":mailto:joecool@example.com\r\n',
	attendee2: 'ATTENDEE;DELEGATED-FROM="mailto:immud@example.com":mailto:ildoit@example.c\r\n om\r\n',
	attendeesComplex: [
		'ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=TENTATIVE;DELEGATED-FROM="mailto:ia\r\n mboss@example.com";CN=Henry Cabot:mailto:hcabot@example.com',
		'ATTENDEE;ROLE=NON-PARTICIPANT;PARTSTAT=DELEGATED;DELEGATED-TO="mailto:hcab\r\n ot@example.com";CN=The Big Cheese:mailto:iamboss@example.com',
		'ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Jane Doe:mailto:jdoe@ex\r\n ample.com\r\n'
	].join('\r\n'),

	rrules: [
		"RRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=4;WKST=SU\r\n"
	],
	rruleWithUntil: "RRULE:FREQ=DAILY;UNTIL=" + reformatISOString(Date.UTC(1997, 11, 24, 0, 0, 0)) + "\r\n",
	rruleWithUntilTimestamp: Date.UTC(1997, 11, 24, 0, 0, 0),
	rruleSundays: "RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SU\r\n",
	alarm: "BEGIN:VALARM\r\nTRIGGER:-PT30M\r\nREPEAT:2\r\nDURATION:PT15M\r\nACTION:DISPLAY\r\nDESCRIPTION:Breakfast meeting with executive team at 8:30 AM EST.\r\nEND:VALARM\r\n",
	dtstamps: {
		yahoo: {
			timestamp: Date.UTC(2010, 3, 28, 23, 57, 5),
			iso8601: reformatISOString(Date.UTC(2010, 3, 28, 23, 57, 5))
		},
		yahoo1: {
			timestamp: Date.UTC(2010, 5, 4, 19, 42, 56),
			iso8601: reformatISOString(Date.UTC(2010, 5, 4, 19, 42, 56))
		},
		other: {
			timestamp: Date.UTC(2010, 8, 15, 9, 56, 16),
			iso8601: reformatISOString(Date.UTC(2010, 8, 15, 9, 56, 16))
		}
	},
	until: {
		timestamp: Date.UTC(2010, 9, 23, 2, 0, 0),
		iso8601: reformatISOString(Date.UTC(2010, 9, 23, 2, 0, 0))
	},

	pacificTimezone: [
		'BEGIN:VTIMEZONE',
		'TZID:America/Los_Angeles',
		'BEGIN:DAYLIGHT',
		'DTSTART:19700101',
		'TZOFFSETFROM:-0800',
		'TZOFFSETTO:-0700',
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
		'END:DAYLIGHT',
		'BEGIN:STANDARD',
		'DTSTART:19700101',
		'TZOFFSETFROM:-0700',
		'TZOFFSETTO:-0800',
		'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
		'END:STANDARD',
		'END:VTIMEZONE'
	].join("\r\n"),
	escapedSummaryLine: "SUMMARY:This summary contains \\; \\, \\\" \\n \\\\\\\\\\\\\\\\ \\\\\\\\\\\\ \\\\\\\\ \\\\ which sh\r\n ould be escaped\r\n",
	escapedLocationLine: "LOCATION:This is the place where \\; \\, \\\" \\n \\\\\\\\\\\\\\\\ \\\\\\\\\\\\ \\\\\\\\ \\\\ which\r\n  should be escaped\r\n",
	escapedDescriptionLine: "DESCRIPTION:This line contains \\; \\, \\\" \\n \\\\\\\\\\\\\\\\ \\\\\\\\\\\\ \\\\\\\\ \\\\ which s\r\n hould be escaped\r\n",
	attendeeWithRSVP: 'ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE;CN=Testing teste\r\n r:mailto:ttester@example.com\r\n'
};

describe("Event to vCalendar tests", function () {
it("should test basic", function() {
	var event = {
			dtstart: event2VCalTestData.timesNoTzDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesNoTzDates.dtend.getTime()
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.timesNoTz + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test basic with TZ", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles"
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test null field", function() {
	var event = {
			dtstart: event2VCalTestData.timesNoTzDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesNoTzDates.dtend.getTime(),
			rrule: null
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.timesNoTz + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test undefined field", function() {
	var event = {
			dtstart: event2VCalTestData.timesNoTzDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesNoTzDates.dtend.getTime(),
			alarm: undefined
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.timesNoTz + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test organizer", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			"attendees": [
				{
					"organizer": true,
					"_id": "206W",
					"email": "ejakowatz@yahoo.com"
				}
			]
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.organizer + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test subject line folding", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			subject: "Here is a long summary, because somebody likes really long subject lines in their meeting requests and who am I to tell them 'no, you can't have a really long subject line'?	 That would just be fascistic!"
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.longSummary + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test single attendee", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			attendees: [
				{
					member: "mailto:DEV-GROUP@example.com",
					email: "joecool@example.com"
				}
			]
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.attendee + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test multiple attendees", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			attendees: [
				{
					member: "mailto:DEV-GROUP@example.com",
					email: "joecool@example.com"
				},
				{
					delegatedFrom: "mailto:immud@example.com",
					email: "ildoit@example.com"
				}
			]
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.attendee + event2VCalTestData.attendee2 + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test multiple complex attendees", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			attendees: [
				{
					role: "REQ-PARTICIPANT",
					participationStatus: "TENTATIVE",
					delegatedFrom: "mailto:iamboss@example.com",
					commonName: "Henry Cabot",
					email: "hcabot@example.com"
				},
				{
					role: "NON-PARTICIPANT",
					participationStatus: "DELEGATED",
					delegatedTo: "mailto:hcabot@example.com",
					commonName: "The Big Cheese",
					email: "iamboss@example.com"
				},
				{
					role: "REQ-PARTICIPANT",
					participationStatus: "ACCEPTED",
					commonName: "Jane Doe",
					email: "jdoe@example.com"
				}
			]
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.attendeesComplex + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test organizer with attendees", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			"attendees": [
				{
					"organizer": true,
					"_id": "206W",
					"email": "ejakowatz@yahoo.com"
				},
				{
					role: "REQ-PARTICIPANT",
					participationStatus: "TENTATIVE",
					delegatedFrom: "mailto:iamboss@example.com",
					commonName: "Henry Cabot",
					email: "hcabot@example.com"
				},
				{
					role: "NON-PARTICIPANT",
					participationStatus: "DELEGATED",
					delegatedTo: "mailto:hcabot@example.com",
					commonName: "The Big Cheese",
					email: "iamboss@example.com"
				},
				{
					role: "REQ-PARTICIPANT",
					participationStatus: "ACCEPTED",
					commonName: "Jane Doe",
					email: "jdoe@example.com"
				}
			]
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.organizer + event2VCalTestData.attendeesComplex + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test rrule 1", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			rrule: {
				freq: "MONTHLY",
				interval: 1,
				rules: [
					{
						ruleType: "BYDAY",
						ruleValue: [
							{ day: 1 },
							{ day: 2 },
							{ day: 3 },
							{ day: 4 },
							{ day: 5 }
						]
					},
					{
						ruleType: "BYSETPOS",
						ruleValue: [
							{ ord: 4 }
						]
					}
				],
				wkst: 0
			}
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.rrules[0] + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test rrule with until", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			rrule: {
				freq: "DAILY",
				until: event2VCalTestData.rruleWithUntilTimestamp
			}
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.rruleWithUntil + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test rrule sundays", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			rrule: {
				freq: "WEEKLY",
				interval: 1,
				rules: [
					{
						ruleType: "BYDAY",
						ruleValue: [
							{ day: 0 }
						]
					}
				]
			}
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.rruleSundays + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test Yahoo event 1", function() {
	var event = {
			"version": "2.0",
			"prodid": "Zimbra-Calendar-Provider",
			"uid": "788a5fc9-7c1f-4df5-98ab-1764f8b44c36",
			"subject": "A new event",
			"attendees": [
				{
					"organizer": true,
					"_id": "20Bi",
					"email": "ejakowatz@yahoo.com"
				}
			],
			"dtstart": event2VCalTestData.timesDates.dtstart.getTime(),
			"dtend": event2VCalTestData.timesDates.dtend.getTime(),
			"status": "CONFIRMED",
			"classification": "PUBLIC",
			"x-microsoft-cdo-intendedstatus": "BUSY",
			"transp": "OPAQUE",
			"x-microsoft-disallow-counter": "TRUE",
			"dtstamp": event2VCalTestData.dtstamps.yahoo1.timestamp,
			"sequence": "0",
			"allDay": false,
			"_rev": 4909,
			"_kind": "com.palm.calendarevent.yahoo:1",
			"tzId": "America/Los_Angeles",
			"calendarId": "20BX",
			"_id": "20Be",
			"accountId": "2+Qv"
		},
		vCal = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:Zimbra-Calendar-Provider\r\nBEGIN:VEVENT\r\nUID:788a5fc9-7c1f-4df5-98ab-1764f8b44c36\r\nSUMMARY:A new event\r\nORGANIZER:mailto:ejakowatz@yahoo.com\r\nDTSTART;TZID="America/Los_Angeles":20100604T130000\r\nDTEND;TZID="America/Los_Angeles":20100604T140000\r\nSTATUS:CONFIRMED\r\nCLASS:PUBLIC\r\nX-MICROSOFT-CDO-INTENDEDSTATUS:BUSY\r\nTRANSP:OPAQUE\r\nX-MICROSOFT-DISALLOW-COUNTER:TRUE\r\nDTSTAMP:' + event2VCalTestData.dtstamps.yahoo1.iso8601 + '\r\nSEQUENCE:0\r\nEND:VEVENT\r\nEND:VCALENDAR';
		// TODO: the REAL real deal, once timezones are integrated
		// vCal = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:Zimbra-Calendar-Provider\r\nBEGIN:VTIMEZONE\r\nTZID:America/Los_Angeles\r\nBEGIN:STANDARD\r\nDTSTART:19710101T020000\r\nTZOFFSETTO:-0800\r\nTZOFFSETFROM:-0700\r\nRRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=11;BYDAY=1SU\r\nTZNAME:PST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19710101T020000\r\nTZOFFSETTO:-0700\r\nTZOFFSETFROM:-0800\r\nRRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=3;BYDAY=2SU\r\nTZNAME:PDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE\r\nBEGIN:VEVENT\r\nUID:788a5fc9-7c1f-4df5-98ab-1764f8b44c36\r\nSUMMARY:A new event\r\nORGANIZER:mailto:ejakowatz@yahoo.com\r\nDTSTART;TZID="America/Los_Angeles":20100604T130000\r\nDTEND;TZID="America/Los_Angeles":20100604T140000\r\nSTATUS:CONFIRMED\r\nCLASS:PUBLIC\r\nX-MICROSOFT-CDO-INTENDEDSTATUS:BUSY\r\nTRANSP:OPAQUE\r\nX-MICROSOFT-DISALLOW-COUNTER:TRUE\r\nDTSTAMP:20100604T194256Z\r\nSEQUENCE:0\r\nEND:VEVENT\r\nEND:VCALENDAR';

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test Yahoo event 2", function() {
	var event = {
			"prodid": "Zimbra-Calendar-Provider",
			"uid": "4BndpjRWiMBe1m2kLfv2W2p.amyX3WmTs8vZog--@calendar.yahoo.com",
			"subject": "Meet with President Obama",
			"categories": "Appointment",
			"x-yahoo-calendar-id": "1",
			"dtstart": new Date("2010-02-23T11:00:00").getTime(),
			"dtend": new Date("2010-02-23T12:00:00").getTime(),
			"status": "CONFIRMED",
			"classification": "PRIVATE",
			"x-microsoft-cdo-intendedstatus": "BUSY",
			"transp": "OPAQUE",
			"x-microsoft-disallow-counter": "TRUE",
			"dtstamp": event2VCalTestData.dtstamps.yahoo.timestamp,
			"sequence": "0",

			"tzId": "America/Los_Angeles",
			"version": "2.0",

			"_rev": 4912,
			"accountId": "2+Qv",
			"_kind": "com.palm.calendarevent.yahoo:1",
			"calendarId": "20BX",
			"allDay": false,
			"_id": "20Bf"
		},
		vCal = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:Zimbra-Calendar-Provider\r\nBEGIN:VEVENT\r\nUID:4BndpjRWiMBe1m2kLfv2W2p.amyX3WmTs8vZog--@calendar.yahoo.com\r\nSUMMARY:Meet with President Obama\r\nCATEGORIES:Appointment\r\nX-YAHOO-CALENDAR-ID:1\r\nDTSTART;TZID="America/Los_Angeles":20100223T110000\r\nDTEND;TZID="America/Los_Angeles":20100223T120000\r\nSTATUS:CONFIRMED\r\nCLASS:PRIVATE\r\nX-MICROSOFT-CDO-INTENDEDSTATUS:BUSY\r\nTRANSP:OPAQUE\r\nX-MICROSOFT-DISALLOW-COUNTER:TRUE\r\nDTSTAMP:' + event2VCalTestData.dtstamps.yahoo.iso8601 + '\r\nSEQUENCE:0\r\nEND:VEVENT\r\nEND:VCALENDAR';
		// TODO: the real deal, once timezones are integrated
		// vCal = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:Zimbra-Calendar-Provider\r\nBEGIN:VTIMEZONE\r\nTZID:America/Los_Angeles\r\nBEGIN:STANDARD\r\nDTSTART:19710101T020000\r\nTZOFFSETTO:-0800\r\nTZOFFSETFROM:-0700\r\nRRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=11;BYDAY=1SU\r\nTZNAME:PST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19710101T020000\r\nTZOFFSETTO:-0700\r\nTZOFFSETFROM:-0800\r\nRRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=3;BYDAY=2SU\r\nTZNAME:PDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE\r\nBEGIN:VEVENT\r\nUID:4BndpjRWiMBe1m2kLfv2W2p.amyX3WmTs8vZog--@calendar.yahoo.com\r\nSUMMARY:Meet with President Obama\r\nCATEGORIES:Appointment\r\nX-YAHOO-CALENDAR-ID:1\r\nDTSTART;TZID="America/Los_Angeles":20100223T110000\r\nDTEND;TZID="America/Los_Angeles":20100223T120000\r\nSTATUS:CONFIRMED\r\nCLASS:PRIVATE\r\nX-MICROSOFT-CDO-INTENDEDSTATUS:BUSY\r\nTRANSP:OPAQUE\r\nX-MICROSOFT-DISALLOW-COUNTER:TRUE\r\nDTSTAMP:20100528T235705Z\r\nSEQUENCE:0\r\nEND:VEVENT\r\nEND:VCALENDAR';

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test Yahoo event 3", function() {
	var event = {
			"uid": "MeyWUDRWiMDXUBPGZa9wjLDc6ZM9H4JCTgNLWA--@calendar.yahoo.com",
			"subject": "A Yahoo thing",
			"location": "Yahoo Central",
			"categories": "Appointment",
			"x-yahoo-calendar-id": "2",
			"dtstart": new Date("2010-05-28T16:00:00").getTime(),
			"dtend": new Date("2010-05-28T17:00:00").getTime(),
			"status": "CONFIRMED",
			"classification": "PRIVATE",
			"x-microsoft-cdo-intendedstatus": "BUSY",
			"transp": "OPAQUE",
			"x-microsoft-disallow-counter": "TRUE",
			"dtstamp": event2VCalTestData.dtstamps.yahoo.timestamp,
			"sequence": "0",

			"tzId": "America/Los_Angeles",
			"version": "2.0",
			"prodid": "Zimbra-Calendar-Provider",

			"_rev": 4914,
			"accountId": "2+Qv",
			"_kind": "com.palm.calendarevent.yahoo:1",
			"calendarId": "20BX",
			"allDay": false,
			"_id": "20Bg"
		},
		vCal = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:Zimbra-Calendar-Provider\r\nBEGIN:VEVENT\r\nUID:MeyWUDRWiMDXUBPGZa9wjLDc6ZM9H4JCTgNLWA--@calendar.yahoo.com\r\nSUMMARY:A Yahoo thing\r\nLOCATION:Yahoo Central\r\nCATEGORIES:Appointment\r\nX-YAHOO-CALENDAR-ID:2\r\nDTSTART;TZID="America/Los_Angeles":20100528T160000\r\nDTEND;TZID="America/Los_Angeles":20100528T170000\r\nSTATUS:CONFIRMED\r\nCLASS:PRIVATE\r\nX-MICROSOFT-CDO-INTENDEDSTATUS:BUSY\r\nTRANSP:OPAQUE\r\nX-MICROSOFT-DISALLOW-COUNTER:TRUE\r\nDTSTAMP:' + event2VCalTestData.dtstamps.yahoo.iso8601 + '\r\nSEQUENCE:0\r\nEND:VEVENT\r\nEND:VCALENDAR';
		// TODO: the real deal, once timezones are integrated
		// vCal = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:Zimbra-Calendar-Provider\r\nBEGIN:VTIMEZONE\r\nTZID:America/Los_Angeles\r\nBEGIN:STANDARD\r\nDTSTART:19710101T020000\r\nTZOFFSETTO:-0800\r\nTZOFFSETFROM:-0700\r\nRRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=11;BYDAY=1SU\r\nTZNAME:PST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19710101T020000\r\nTZOFFSETTO:-0700\r\nTZOFFSETFROM:-0800\r\nRRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=3;BYDAY=2SU\r\nTZNAME:PDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE\r\nBEGIN:VEVENT\r\nUID:MeyWUDRWiMDXUBPGZa9wjLDc6ZM9H4JCTgNLWA--@calendar.yahoo.com\r\nSUMMARY:A Yahoo thing\r\nLOCATION:Yahoo Central\r\nCATEGORIES:Appointment\r\nX-YAHOO-CALENDAR-ID:2\r\nDTSTART;TZID="America/Los_Angeles":20100528T160000\r\nDTEND;TZID="America/Los_Angeles":20100528T170000\r\nSTATUS:CONFIRMED\r\nCLASS:PRIVATE\r\nX-MICROSOFT-CDO-INTENDEDSTATUS:BUSY\r\nTRANSP:OPAQUE\r\nX-MICROSOFT-DISALLOW-COUNTER:TRUE\r\nDTSTAMP:20100528T235705Z\r\nSEQUENCE:0\r\nEND:VEVENT\r\nEND:VCALENDAR';

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test alarm", function() {
	var event = {
			alarm: [
				{
					alarmTrigger: {
						valueType: "DURATION",
						value: "-PT30M"
					},
					repeat: 2,
					duration: "PT15M",
					action: "DISPLAY",
					description: "Breakfast meeting with executive team at 8:30 AM EST."
				}
			]
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.alarm + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test all day", function() {
	var event = {
			"dtend": new Date("2010-08-16").getTime(),
			"dtstart": new Date("2010-08-16").getTime(),
			"allDay": true
		},
		vCal = event2VCalTestData.vCalHeader + "DTEND;VALUE=DATE:20100816\r\nDTSTART;VALUE=DATE:20100816\r\n" + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test multiple events", function() {
	var events = [{
				dtstart: event2VCalTestData.timesNoTzDates.dtstart.getTime(),
				dtend: event2VCalTestData.timesNoTzDates.dtend.getTime()
			},{
				dtstart: event2VCalTestData.timesNoTzDates.dtstart.getTime(),
				dtend: event2VCalTestData.timesNoTzDates.dtend.getTime()
			}
		],
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.timesNoTz + "END:VEVENT\r\nBEGIN:VEVENT\r\n" + event2VCalTestData.timesNoTz + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(events)).toEqual(vCal);
});

it("should test filter unwanted fields", function() {
	var event = {
		"x-microsoft-disallow-counter": "TRUE",
		"saving": true,
		"uid": "~~HFFQwHBfW8wbs5-20100914T175300-palm.com",
		"classification": "PUBLIC",
		"sequence": "1",
		"_rev": 27698,
		"transp": "OPAQUE",
		"height": "48px",
		"renderEndTime": 1284688800000,
		"rrule": {
			"freq": "DAILY",
			"interval": "1",
			"until": event2VCalTestData.until.timestamp
		},
		"duration": "PT1H",
		"dtend": new Date("2010-09-14T20:00:00").getTime(),
		"overlap_count": 1,
		"recurrenceId": "20100915T010000Z",
		"accountId": "++HF6MbYnJO7ZesM",
		"note": "",
		"isRecurringForever": false,
		"saved": false,
		"top": 814,
		"exdates": [
			"20100915T010000Z",
			"20100917T010000Z"
		],
		"calendarColor": "cal-color-green",
		"currentLocalEnd": 1284688800000,
		"width": "292px",
		"etag": "\"4213-4213\"",
		"location": "",
		"version": "2.0",
		"subject": "Over and over",
		"textFieldWidth": "244px",
		"status": "CONFIRMED",
		"renderStartTime": 1284685200000,
		"dtstamp": event2VCalTestData.dtstamps.other.timestamp,
		"end_decimal": 1900,
		"_kind": "com.palm.calendarevent.yahoo:1",
		"topCompress": 696,
		"origDragTop": 864,
		"calendarId": "++HFFQjAaKNoX136",
		"start_decimal": 1800,
		"dtstart": new Date("2010-09-14T19:00:00").getTime(),
		"prodid": "Zimbra-Calendar-Provider",
		"allDay": false,
		"overlap_index": 0,
		"tzId": "America/Los_Angeles",
		"alarm": [
			{
				"action": "DISPLAY",
				"trigger": "-PT15M",
				"_id": "6c33",
				"alarmTrigger": {
					"valueType": "DURATION",
					"value": "-PT15M"
				},
				"description": "Reminder"
			}
		],
		"currentLocalStart": 1284685200000,
		"onlyRepeatChanged": true,
		"animatible": true,
		"x-microsoft-cdo-intendedstatus": "BUSY",
		"dirty": true,
		"_id": "++HFFQwHBfW8wbs5",
		"left": "28px",
		"_del": false
	},

	vCal = [
	'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:Zimbra-Calendar-Provider',
		'BEGIN:VEVENT',
			'X-MICROSOFT-DISALLOW-COUNTER:TRUE',
			'UID:~~HFFQwHBfW8wbs5-20100914T175300-palm.com',
			'CLASS:PUBLIC',
			'SEQUENCE:1',
			'TRANSP:OPAQUE',
			'RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=' + event2VCalTestData.until.iso8601,
			'DURATION:PT1H',
			'DTEND;TZID="America/Los_Angeles":20100914T200000',
			'RECURRENCE-ID:20100915T010000Z',
			'EXDATE:20100915T010000Z,20100917T010000Z',
			'SUMMARY:Over and over',
			'STATUS:CONFIRMED',
			'DTSTAMP:' + event2VCalTestData.dtstamps.other.iso8601,
			'DTSTART;TZID="America/Los_Angeles":20100914T190000',
			'BEGIN:VALARM',
				'ACTION:DISPLAY',
				'TRIGGER:-PT15M',
				'TRIGGER:-PT15M',
				'DESCRIPTION:Reminder',
			'END:VALARM',
			'X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY',
		'END:VEVENT',
	'END:VCALENDAR'
	].join("\r\n");

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test rrule convert", function() {
	var event = {
		"rrule": {
			"freq": "DAILY",
			"interval": "1",
			"until": event2VCalTestData.until.timestamp
		}
	},

	vCal = [
		'RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=' + event2VCalTestData.until.iso8601
	].join("\r\n");

	expect(eventRRuleToVCalendarRRule(event)).toEqual(vCal);
});

it("should test timezone", function() {
	var events = [],
		timezones = [{
			tzId: "America/Los_Angeles",
			daylight: {
				dtstart: "19700101",
				tzOffsetFrom: "-0800",
				tzOffsetTo: "-0700",
				rrule: {
					freq: "YEARLY",
					rules: [
						{ruleType: "BYMONTH", ruleValue: [{ord: 3}]},
						{ruleType: "BYDAY", ruleValue: [{ord: 2, day: 0}]}
					]
				}
			},
			standard: {
				dtstart: "19700101",
				tzOffsetFrom: "-0700",
				tzOffsetTo: "-0800",
				rrule: {
					freq: "YEARLY",
					rules: [
						{ruleType: "BYMONTH", ruleValue: [{ord: 11}]},
						{ruleType: "BYDAY", ruleValue: [{ord: 1, day: 0}]}
					]
				}
			}
		}],

		vCal = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			event2VCalTestData.pacificTimezone,
			'END:VCALENDAR'
		].join("\r\n");

	expect(eventToVCalendar(events, timezones)).toEqual(vCal);
});

it("should test method", function() {
	var event = {
		dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
		dtend: event2VCalTestData.timesDates.dtend.getTime(),
		tzId: "America/Los_Angeles"
	},
	
	vCal = event2VCalTestData.vCalBasicHeader + "METHOD:REQUEST\r\n" + "BEGIN:VEVENT\r\n" + event2VCalTestData.times + event2VCalTestData.vCalFooter;
	
	expect(eventToVCalendar(event, [], "REQUEST")).toEqual(vCal);
});

it("should test include unknown fields", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			fhqwhgads: "huh"
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + "FHQWHGADS:huh\r\n" + event2VCalTestData.vCalFooter;
	
	expect(eventToVCalendar(event, undefined, undefined, {includeUnknownFields: true})).toEqual(vCal);
});

it("should test dont include unknown fields", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			fhqwhgads: "huh"
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.vCalFooter;
	
	expect(eventToVCalendar(event, undefined, undefined, {includeUnknownFields: false})).toEqual(vCal);
});

it("should test escaped subject", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			subject: "This summary contains ; , \" \n \\\\\\\\ \\\\\\ \\\\ \\ which should be escaped"
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.escapedSummaryLine + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test escaped location", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			location: "This is the place where ; , \" \n \\\\\\\\ \\\\\\ \\\\ \\ which should be escaped"
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.escapedLocationLine + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test escaped description", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			note: "This line contains ; , \" \n \\\\\\\\ \\\\\\ \\\\ \\ which should be escaped"
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.escapedDescriptionLine + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

it("should test attendee with RSVP", function() {
	var event = {
			dtstart: event2VCalTestData.timesDates.dtstart.getTime(),
			dtend: event2VCalTestData.timesDates.dtend.getTime(),
			tzId: "America/Los_Angeles",
			attendees: [
				{
					email: "ttester@example.com",
					role: "REQ-PARTICIPANT",
					participationStatus: "ACCEPTED",
					rsvp: true,
					commonName: "Testing tester"					
				}
			]
		},
		vCal = event2VCalTestData.vCalHeader + event2VCalTestData.times + event2VCalTestData.attendeeWithRSVP + event2VCalTestData.vCalFooter;

	expect(eventToVCalendar(event)).toEqual(vCal);
});

});