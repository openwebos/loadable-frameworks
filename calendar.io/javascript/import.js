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

/*jslint adsafe: false, bitwise: false, browser: false, cap: false, css: false, 
debug: false, devel: true, eqeqeq: true, es5: false, evil: false, forin: false, 
fragment: false, immed: true, indent: 4, laxbreak: false, maxerr: 500, 
nomen: false, newcap: true, on: false, onevar: false, passfail: false, 
plusplus: false, regexp: false, safe: false, sub: true, undef: true, 
white: false, widget: false, windows: false */

/*global _, Assert, Class, DB, Foundations, IO, stringify, StringUtils, Utils */


/*
 *	constants
 *
 *	NOTE:	Due to the way EAS sync works, if a value isn't present then we need to leave it undefined.
 *			thus there are no default values.
*/

var Import = {
	Iterator: Class.create({
		initialize: function (sequence) {
			this.setSequence(sequence);
		},
		previous: function () {
			this.index = this.index > 0 && this.index - 1;
			return this.get();
		},
		next: function () {
			this.index = (this.index < this.length) && this.index + 1;
			return this.get();
		},
		get: function () {
			return (this.index < this.length) && this.sequence && this.sequence[this.index];
		},
		setSequence: function (sequence) {
			this.sequence = sequence;
			this.length = (sequence && sequence.length) || 0;
			this.index = 0;
		},
		getSequence: function (sequence) {
			return this.sequence;
		}
	})
};

IO._VCALENDAR_BEGIN_REGEX					=	/^BEGIN:VCALENDAR/i;
IO._VCALENDAR_END_REGEX						=	/^END:VCALENDAR/i;
IO._VEVENT_BEGIN_REGEX						=	/^BEGIN:VEVENT/i;
IO._VEVENT_END_REGEX						=	/^END:VEVENT/i;
IO._VALARM_BEGIN_REGEX						=	/^BEGIN:VALARM/i;
IO._VALARM_END_REGEX						=	/^END:VALARM/i;
IO._VTIMEZONE_BEGIN_REGEX					=	/^BEGIN:VTIMEZONE/i;
IO._VTIMEZONE_END_REGEX						=	/^END:VTIMEZONE/i;

IO._CALENDAR_ID_PROP_NAME					=	"calendarId";	//not enum

IO._CATEGORIES_REGEX						=	/^CATEGORIES/i;
IO._CATEGORIES_PROP_NAME					=	"categories"; //not enum

IO._CLASSIFICATION_REGEX					=	/^CLASS/i;
IO._CLASSIFICATION_PROP_NAME				=	"classification"; //not enum

IO._SUMMARY_REGEX							=	/^SUMMARY/i;
IO._SUMMARY_PROP_NAME						=	"subject"; //not enum

IO._DTSTART_REGEX							=	/^DTSTART[;:]/i;
IO._DTSTART_PROP_NAME						=	"dtstart"; //format YYYYMMDD optional:'T'HHMMSS optional:Z

IO._DTEND_REGEX								=	/^DTEND[;:]/i; 
IO._DTEND_PROP_NAME							=	"dtend"; //format YYYYMMDD optional:'T'HHMMSS optional:Z

IO._TZID_REGEX								=	/;TZID=/i; 
IO._TZID_PROP_NAME							=	"tzId"; //predefined values (treat as fail if fail parsing)

IO._ALLDAY_PROP_NAME						=	"allDay"; //True / false

IO._ATTENDEE_REGEX							=	/^ATTENDEE/i;
IO._ATTENDEE_PROP_NAME						=	"attendees"; //SUB-OBJECT

IO._LOCATION_REGEX							=	/^LOCATION/i;
IO._LOCATION_PROP_NAME						=	"location"; //not enum

IO._DESCRIPTION_REGEX						=	/^DESCRIPTION/i;
IO._DESCRIPTION_PROP_NAME					=	"note"; //not enum

IO._TRANSP_REGEX							=	/^TRANSP/i;
IO._TRANSP_PROP_NAME						=	"transp";  //OPAQUE / TRANSPARENT

IO._DTSTAMP_REGEX							=	/^DTSTAMP/i;
IO._DTSTAMP_PROP_NAME						=	"dtstamp"; //format YYYYMMDD optional:'T'HHMMSS optional:Z

IO._CREATED_REGEX							=	/^CREATED/i;
IO._CREATED_PROP_NAME						=	"created"; //format YYYYMMDD optional:'T'HHMMSS optional:Z

IO._GEO_REGEX								=	/^GEO/i;
IO._GEO_PROP_NAME							=	"geo"; //FLOAT;FLOAT (negative allowed)

IO._LAST_MODIFIED_REGEX						=	/^LAST-MODIFIED/i;
IO._LAST_MODIFIED_PROP_NAME					=	"lastModified"; //format YYYYMMDD optional:'T'HHMMSS optional:Z

IO._PRIORITY_REGEX							=	/^PRIORITY/i;
IO._PRIORITY_PROP_NAME						=	"priority"; //0-9

IO._URL_REGEX								=	/^URL/i;
IO._URL_PROP_NAME							=	"url"; //not enum

IO._UID_REGEX								=	/^UID/i;
IO._UID_PROP_NAME							=	"uid"; //not enum

IO._COMMENT_REGEX							=	/^COMMENT/i; 
IO._COMMENT_PROP_NAME						=	"comment"; //not enum

IO._CONTACT_REGEX							=	/^CONTACT/i;
IO._CONTACT_PROP_NAME						=	"contact"; //not enum

IO._RELATEDTO_REGEX							=	/^RELATED-TO/i;
IO._RELATEDTO_PROP_NAME						=	"relatedTo";//not enum

IO._RESOURCES_REGEX							=	/^RESOURCES/i;
IO._RESOURCES_PROP_NAME						=	"resources";//not enum

IO._REQUEST_STATUS_REGEX					=	/^REQUEST-STATUS/i;
IO._REQUEST_STATUS_PROP_NAME				=	"requestStatus";//not enum

IO._EXDATES_REGEX							=	/^EXDATE/i;
IO._EXDATES_PROP_NAME						=	"exdates";//format YYYYMMDD WITH NO TIME!!!!!!!

IO._RDATES_REGEX							=	/^RDATE/i; 
IO._RDATES_PROP_NAME						=	"rdates";// DATE or PERIOD

IO._ATTACH_REGEX							=	/^ATTACH/i;
IO._ATTACH_PROP_NAME						=	"attach";//not enum

IO._RECURRENCE_ID_REGEX						=	/^RECURRENCE-ID/i;
IO._RECURRENCE_ID_PROP_NAME					=	"recurrenceId";//not enum

IO._SEQUENCE_REGEX							=	/^SEQUENCE/i;
IO._SEQUENCE_PROP_NAME						=	"sequence"; //integer 0+

IO._RRULE_REGEX								=	/^RRULE/i;
IO._RRULE_PROP_NAME							=	"rrule"; //SUB-OBJECT

IO._ALARM_PROP_NAME							=	"alarm";

IO._ALARM_ACTION_REGEX						=	/^ACTION/i;
IO._ALARM_ACTION_PROP_NAME					=	"action"; //AUDIO    or    DISPLAY    or   EMAIL

IO._ALARM_TRIGGER_REGEX						=	/^TRIGGER/i;
IO._ALARM_TRIGGER_PROP_NAME					=	"trigger"; //DATE  or PERIOD --????

IO._ALARM_REPEAT_REGEX						=	/^REPEAT/i;
IO._ALARM_REPEAT_PROP_NAME					=	"repeat"; //integer 0+

IO._ALARM_DURATION_REGEX					=	/^DURATION/i;
IO._ALARM_DURATION_PROP_NAME				=	"duration"; //DURATION VALUE (see 3.3.6)

IO._ALARM_ATTACH_REGEX						=	/^ATTACH/i;
IO._ALARM_ATTACH_PROP_NAME					=	"attach"; //not enum

IO._ALARM_DESCRIPTION_REGEX					=	/^DESCRIPTION/i;
IO._ALARM_DESCRIPTION_PROP_NAME				=	"description"; //not enum

IO._ALARM_SUMMARY_REGEX						=	/^SUMMARY/i;
IO._ALARM_SUMMARY_PROP_NAME					=	"summary"; //not enum

IO._ALARM_ATTENDEE_REGEX					=	/ATTENDEE/i;
IO._ALARM_ATTENDEE_PROP_NAME				=	"attendee";

IO._ALARM_ALARMTRIGGER_RELATED_REGEX		=	/RELATED/i;
IO._ALARM_ALARMTRIGGER_RELATED_PROP_NAME	=	"related";

IO._ALARM_ALARMTRIGGER_RELATED_START_REGEX		=	/START/i;
IO._ALARM_ALARMTRIGGER_RELATED_START_VALUE		=	"START";

IO._ALARM_ALARMTRIGGER_RELATED_END_REGEX		=	/END/i;
IO._ALARM_ALARMTRIGGER_RELATED_END_VALUE		=	"END";


IO._ALARM_ALARMTRIGGER_PROP_NAME			=	"alarmTrigger"; 

IO._ALARMTRIGGER_VALUE_PROP_NAME			=	"value";

IO._ALARMTRIGGER_VALUETYPE_REGEX			=	/^VALUE/i;
IO._ALARMTRIGGER_VALUETYPE_PROP_NAME		=	"valueType"; /* 
				/ "BINARY"
				/ "BOOLEAN"
				/ "CAL-ADDRESS"
				/ "DATE"
				/ "DATE-TIME"
				/ "DURATION"
				/ "FLOAT"
				/ "INTEGER"
				/ "PERIOD"
				/ "RECUR"
				/ "TEXT"
				/ "TIME"
				/ "URI"
				/ "UTC-OFFSET"
*/

IO._ALARMTRIGGER_VALUETYPE_DATETIME_REGEX	=	/DATE-TIME/i;
IO._ALARMTRIGGER_VALUETYPE_DATETIME_VALUE	=	"DATETIME";

IO._ALARMTRIGGER_VALUETYPE_DURATION_REGEX	=	/DURATION/i;
IO._ALARMTRIGGER_VALUETYPE_DURATION_VALUE	=	"DURATION";

IO._ATTENDEE_CN_REGEX						=	/^CN/i;
IO._ATTENDEE_CN_PROP_NAME					=	"commonName"; //not enum

IO._ATTENDEE_MEMBER_REGEX					=	/^MEMBER/i;
IO._ATTENDEE_MEMBER_PROP_NAME				=	"member"; //not enum

IO._ATTENDEE_ROLE_REGEX						=	/^ROLE/i;
IO._ATTENDEE_ROLE_PROP_NAME					=	"role"; /*
"CHAIR"             ; Indicates chair of the
"REQ-PARTICIPANT"   ; Indicates a participant whose
"OPT-PARTICIPANT"   ; Indicates a participant whose
"NON-PARTICIPANT" 
*/

IO._ATTENDEE_RSVP_REGEX						=	/^RSVP/i;
IO._ATTENDEE_RSVP_PROP_NAME					=	"rsvp"; // TRUE or FALSE

IO._ATTENDEE_DELEGATEDTO_REGEX				=	/^DELEGATED-TO/i;
IO._ATTENDEE_DELEGATEDTO_PROP_NAME			=	"delegatedTo"; //not enum

IO._ATTENDEE_DELEGATEDFROM_REGEX			=	/^DELEGATED-FROM/i;
IO._ATTENDEE_DELEGATEDFROM_PROP_NAME		=	"delegatedFrom"; //not enum

IO._ATTENDEE_SENTBY_REGEX					=	/^SENT-BY/i;
IO._ATTENDEE_SENTBY_PROP_NAME				=	"sentBy"; //not enum

IO._ATTENDEE_DIR_REGEX						=	/^DIR/i;
IO._ATTENDEE_DIR_PROP_NAME					=	"dir"; //not enum

IO._ATTENDEE_LANGUAGE_REGEX					=	/^LANGUAGE/i;
IO._ATTENDEE_LANGUAGE_PROP_NAME				=	"language"; //not enum - not going to check

IO._ATTENDEE_CUTYPE_REGEX					=	/^CUTYPE/i;
IO._ATTENDEE_CUTYPE_PROP_NAME				=	"calendarUserType"; /*
 * ("INDIVIDUAL"   ; An individual
                         / "GROUP"        ; A group of individuals
                         / "RESOURCE"     ; A physical resource
                         / "ROOM"         ; A room resource
                         / "UNKNOWN"      ; Otherwise not known

 */

IO._ATTENDEE_PARTSTAT_REGEX					=	/^PARTSTAT/i;
IO._ATTENDEE_PARTSTAT_PROP_NAME				=	"participationStatus"; /*
       partstat-event   = ("NEEDS-ACTION"    ; Event needs action
                        / "ACCEPTED"         ; Event accepted
                        / "DECLINED"         ; Event declined
                        / "TENTATIVE"        ; Event tentatively
                                             ; accepted
                        / "DELEGATED"        ; Event delegated
*/

IO._ORGANIZER_REGEX							=	/^ORGANIZER/i;
IO._ORGANIZER_PROP_NAME						=	"organizer";

IO._ATTENDEE_MAILTO_REGEX					=	/:MAILTO:/i;
IO._ATTENDEE_MAILTO_PROP_NAME				=	"email";

IO._RRULE_RULES_PROP_NAME					=	"rules";

IO._RRULE_RULES_RULETYPE_PROP_NAME			=	"ruleType";
IO._RRULE_RULES_RULEVALUE_PROP_NAME			=	"ruleValue";

IO._RRULEFREQ_REGEX							=	/^FREQ/i;
IO._RRULEFREQ_PROP_NAME						=	"freq";

IO._RRULEINTERVAL_REGEX						=	/^INTERVAL/i;
IO._RRULEINTERVAL_PROP_NAME					=	"interval";

IO._RRULECOUNT_REGEX						=	/^COUNT/i;
IO._RRULECOUNT_PROP_NAME					=	"count";

IO._RRULEUNTIL_REGEX						=	/^UNTIL/i;
IO._RRULEUNTIL_PROP_NAME					=	"until";

IO._RRULEWKST_REGEX							=	/^WKST/i;
IO._RRULEWKST_PROP_NAME						=	"wkst";

IO._RRULEBYDAY_REGEX						=	/^BYDAY/i;
IO._RRULEBYDAY_PROP_NAME					=	"BYDAY";

IO._RRULEBYMINUTE_REGEX						=	/^BYMINUTE/i;
IO._RRULEBYMINUTE_PROP_NAME					=	"BYMINUTE";

IO._RRULEBYSECOND_REGEX						=	/^BYSECOND/i;
IO._RRULEBYSECOND_PROP_NAME					=	"BYSECOND";

IO._RRULEBYHOUR_REGEX						=	/^BYHOUR/i;
IO._RRULEBYHOUR_PROP_NAME					=	"BYHOUR";

IO._RRULEBYMONTHDAY_REGEX					=	/^BYMONTHDAY/i;
IO._RRULEBYMONTHDAY_PROP_NAME				=	"BYMONTHDAY";

IO._RRULEBYYEARDAY_REGEX					=	/^BYYEARDAY/i;
IO._RRULEBYYEARDAY_PROP_NAME				=	"BYYEARDAY";

IO._RRULEBYWEEKNO_REGEX						=	/^BYWEEKNO/i;
IO._RRULEBYWEEKNO_PROP_NAME					=	"BYWEEKNO";

IO._RRULEBYMONTH_REGEX						=	/^BYMONTH=/i;
IO._RRULEBYMONTH_PROP_NAME					=	"BYMONTH";

IO._RRULEBYSETPOS_REGEX						=	/^BYSETPOS=/i;
IO._RRULEBYSETPOS_PROP_NAME					=	"BYSETPOS";

// unescape the content as stated in RFC 5545
// the backslashes should not be unescaped as they need to remain escaped
// in order to properly display in the interface 
IO._UNESCAPE_REGEX							=	/(\\;)|(\\,)|(\\N)|(\\n)|(\\")/g;
IO._UNESCAPE_MAP							=	{"\\;" : ";", "\\," : ",", "\\N" : "\n", "\\n" : "\n", "\\\"" : "\""};

// escape the content as stated in RFC 5545
IO._ESCAPE_REGEX							=	/(;)|(,)|(\n)|(")/g;
IO._ESCAPE_MAP								=	{";" : "\\;", "," : "\\,", "\n" : "\\n", "\"" : "\\\""};

IO._ESCAPE_BSLASH_REGEX						=	/(\\)/g;
IO._ESCAPE_BSLASH_MAP						=	{"\\":"\\\\"};

IO._days = {
		"SU" : 0,
		"MO" : 1,
		"TU" : 2,
		"WE" : 3,
		"TH" : 4,
		"FR" : 5,
		"SA" : 6
};

IO._getValuesAsArray = function(line, delimiter){
	var returnArray = [];
	var delimiterRegex = new RegExp (delimiter);
	
	while (line.length > 0){
		if (delimiterRegex.test(line)){
			returnArray.push(IO._valueBeforeDelimiter(line, delimiter));
			line = IO._valueAfterDelimiter(line, delimiter);
		}
		else{
			returnArray.push(line);
			line = "";
		}
	}	
	return returnArray;
};

IO._getSubObjects = function( obj ){
   var keys = [];
/*jslint forin: true */
   for(var key in obj){
      keys.push(key);
   }
/*jslint forin: false */
   return keys;
};

function prepVCal(vcalendar) {
	vcalendar = vcalendar.replace(/\r\n[ \t\v\r\n]/g, '');
	vcalendar = _.compact(vcalendar.split("\r\n"));
	return vcalendar;
}

IO.vCalendarToEvent = function (vCal, options, calendarID, TZManager) {
	var events = IO.parseVCalendarToEvent(vCal, options, calendarID);
	return IO.normalizeToLocalTimezone(events, TZManager);
};

IO.parseVCalendarToEvent = function (item, options, calendarId) {
	options = options || {};
	var calendar = {
			events: []
		},
		event,
		line,
		iterator = new Import.Iterator();

	if (typeof (item) === "string") {
		item = prepVCal(item);
	}

	//event[ IO._POSITION_PROP_NAME ] = IO._POSITION_DEFAULT_VALUE;
	Utils.debug("\n\n--->>> Processing item: " + stringify(item));

	for (iterator.setSequence(item); iterator.get(); iterator.next())
	{
		Utils.debug("\n---->>>> Processing line " + iterator.index + ": " + iterator.get());
		line = IO._stripWhiteSpaceUpToFirstColon( iterator.get() );

		if (IO._VTIMEZONE_BEGIN_REGEX.test(line)) {
			Import.importTimezone(iterator, options);
		}
		else if (IO._VEVENT_BEGIN_REGEX.test(line)) {
			event = Import.importEvent(iterator, calendarId, options);
			if (event) {
				calendar.events.push(event);
			}
		}
		else if (	!IO._VALARM_BEGIN_REGEX.test( line ) &&
					!IO._VALARM_END_REGEX.test( line ) &&
					!IO._VCALENDAR_BEGIN_REGEX.test(line) &&
					!IO._VCALENDAR_END_REGEX.test(line) )
		{
			if (options.includeUnknownFields) {
				calendar[IO._valueBeforeDelimiter(line, ':').toLowerCase()] = IO._valueAfterDelimiter(line, ':');
			}
			console.log( "======== VCALENDAR IMPORT - Unknown Field: \"" + line + "\"" );
		}
	}

	//
	// Post-processing
	//

	// All properties on the vCalendar object need to be present on each event
	// specified in that object
	IO._propagateCalendarProperties(calendar);

	// If there is no end time, but a duration is specified, we synthesize a
	// dtend based on dtstart and the duration
	IO._maybeSynthesizeDtendForEvents(calendar);

	// Most properties of original events need to be propagated down to their
	// exceptions
	IO._propagateEventPropertiesToExceptions(calendar);

	//If the alarm array is not set we must set a default value of none to it
	//otherwise we get an object from the database with an empty string for the alarmTrigger
	IO._maybeSetDefaultAlarms(calendar);
	return calendar.events;
};

IO._fetchTimezones = function (events, TZManager) {
	var timezones = [],
		years = [];

	events.forEach(function (event) {
		var dtendYear = undefined,
			dtstartYear,
			dtend,
			dtstart,
			until;

		timezones.push(event.tzId || TZManager.timezone);

		if (event.dtEnd) {
			dtend = new Date( event.dtend );
			dtendYear = dtend.getUTCFullYear();
		} else {
			dtstart = new Date( event.dtstart );
			dtendYear = dtstartYear = dtstart.getUTCFullYear();
		}
	
		years.push(dtendYear);
	
		if (event.rrule && event.rrule.until) {
			Utils.debug("IO._fetchTimezones(): rrule: " + stringify(event.rrule));
			until = new Date( event.rrule.until );
			years.push( until.getUTCFullYear() );
		}
		
		if ((dtendYear !== dtstartYear) && dtstartYear) {
			years.push(dtstartYear);
		}			
	});

	Utils.debug("IO._fetchTimezones(): years: " + stringify(years));

	return TZManager.loadTimezones(timezones, years);
};

IO.normalizeToLocalTimezone = function (events, TZManager) {
	var future = IO._fetchTimezones(events, TZManager);

	future.then(function (future) {
		future.getResult();

		events.forEach(function (event) {
			Utils.debug("normalizeToLocalTimezone(): "); // + stringify(event));
			var newDtend;

			if (event.dtstart) {
				Utils.debug("----CONVERTING TZ from " + event.tzId + " to " + TZManager.timezone);
				var oldDtstart = event.dtstart;
				event.dtstart = TZManager.convertTime(event.dtstart, event.tzId, TZManager.timezone);
				Utils.debug("    " + oldDtstart + " -> " + event.dtstart);
			}

			if (event.dtend) {
				newDtend = TZManager.convertTime(event.dtend, event.tzId, TZManager.timezone);
				Utils.debug("----DTEND EXISTED " + event.dtend + "->" + newDtend);
				event.dtend = newDtend; 
			} else if (event.dtstart && !event.recurrenceId) {
				// dtend does not exist; if this is not an exception to another
				// event, synthesize one at the end of the day
				var	dt = new Date(event.dtstart);
				dt.setHours(23);
				dt.setMinutes(59);
				dt.setSeconds(59);
				newDtend = TZManager.convertTime(dt.getTime(), event.tzId, TZManager.timezone);
				Utils.debug("----DTEND DID NOT EXIST " + dt.getTime() + " -> " + newDtend);
				event.dtend = newDtend;
			}

			if (event.rrule && event.rrule.until) {
				event.rrule.until = TZManager.convertTime( 
					event.rrule.until, 
					event.tzId,
					TZManager.timezone
				);
			}

			IO._normalizeToLocalTimezoneArray( event, IO._EXDATES_PROP_NAME, TZManager );
			IO._normalizeToLocalTimezoneArray( event, IO._RDATES_PROP_NAME, TZManager );
		});

		future.result = events;
	});

	return future;
};

/*
 * normalize an array of timestamps for the local timezone
 */

IO._normalizeToLocalTimezoneArray = function( event, field, TZManager )
{
	if (event[field]) {
		var i,
			oldDate,
			newDate,
			value,
			lastChar;

		Utils.debug("----CONVERTING " + field + " TZ from " + event.tzId + " to " + TZManager.timezone + "; " + stringify(event[field]));

		for( i = 0; i < event[field].length; i++ ) {
			Utils.debug("    item " + i + ": " + stringify(event[field][i]));
			value = event[field][i];
			lastChar = value[value.length - 1];
			if (lastChar !== "Z" || lastChar !== "z") {
				oldDate = Utils.dateFromIso8601(value);	// new Date( event[field][i] );
				newDate = new Date( TZManager.convertTime(oldDate.getTime(), event.tzId, TZManager.timezone) );
				value = Utils.dateToIso8601( newDate, { noPunct: true, noMS: true, noTzOffset: true } );
				event[field][i] = value;
				Utils.debug("    " + oldDate.getTime() + " (" + oldDate.toDateString() + ") -> " + newDate.getTime() + " (" + newDate.toDateString() + ") value = " + value);
			}
		}
	}
};

/*
 * unescape a text line per http://tools.ietf.org/html/rfc2445#section-4.3.11
 */

IO._unescapeLine = function( line )
{
	return( StringUtils.escapeCommon( line, IO._UNESCAPE_REGEX, IO._UNESCAPE_MAP ) );
};

/*
 * escape a text line per http://tools.ietf.org/html/rfc2445#section-4.3.11
 */

IO._escapeLine = function(line)
{
	var escString = StringUtils.escapeCommon(line, IO._ESCAPE_BSLASH_REGEX, IO._ESCAPE_BSLASH_MAP);
	return (StringUtils.escapeCommon(escString, IO._ESCAPE_REGEX, IO._ESCAPE_MAP));
};

/*
 * get the value from a VEVENT line
 */

IO._valueFromLine = function( line )
{
	var	index = line.indexOf( ':' );

	Assert.require( index !== -1, "could not extract value from line. line = \"" + line + "\"" );

	return( line.substr( index + 1 ) );
};

/*
 * get a text value from a line
 */

IO._textValueFromLine = function( line )
{
	return( IO._unescapeLine( IO._valueFromLine( line ) ) );
};

/*
 * strip white space from a string.
 */

IO._stripWhiteSpace = function( string )
{
	return( string.replace( /\s/g, '' ) );
};

/*
 * strip white space from a string upto the first colon
 */

IO._stripWhiteSpaceUpToFirstColon = function( string )
{
	var	index;
	var	beforeColon;
	var	afterColon;

	index = string.indexOf( ':' );
	Assert.require( index !== -1, "could not strip whitespace up to first colon becuase no colon was found. string = \"" + string + "\"" );

	beforeColon = string.substr( 0, index );
	afterColon = string.substr( index + 1 );
	
	return( IO._stripWhiteSpace( beforeColon ) + ':' + afterColon );
};

IO._valueAfterDelimiter = function ( line, delimiter )
{
	var	index = line.indexOf( delimiter );

	Assert.require( index !== -1, "could not extract value from line. line = \"" + line + "\"" );

	return( line.substr( index + delimiter.length ) );	
};

IO._valueBeforeDelimiter = function ( line, delimiter )
{
	var	index = line.indexOf( delimiter );

	Assert.require( index !== -1, "could not extract value from line. line = \"" + line + "\"" );

	return( line.substr( 0, index ) );	
};

IO._propagateCalendarProperties = function (calendar) {
	calendar.events.forEach(function (event) {
		for (var key in calendar) {
			// console.log("Calendar propagate: attempting with " + key);
			if (key !== "events") {
				// console.log("     success: " + this[key]);
				event[key] = calendar[key];
			}
		}
	});
};

IO._propagateEventPropertiesToExceptions = function (calendar) {
	// Build a hash of the event UIDs
	var eventHash = {},
		uid,
		eventGroup;

	calendar.events.forEach(function (event) {
		// console.log("event.uid: " + event.uid);
		eventGroup = eventHash[event.uid] || {exceptions: []};
		if (event.recurrenceId) {
			// console.log("    event has recurrenceId");
			eventGroup.exceptions.push(event);
		} else {
			// console.log("    event is a parent event");
			// If we have more than one event with a given UID that *isn't* an
			// exception, this will get overwritten, which may cause trouble
			eventGroup.parentEvent = event;
		}
		eventHash[event.uid] = eventGroup;
	});

	// console.log("eventHash: " + stringify(eventHash));

	function propagateToOneEvent(event) {
		for (var key in this) {
			// console.log("Event propagate: attempting with " + key);
			if (!event.hasOwnProperty(key) && key !== "rrule" && key !== "exdates" && key !== "rdates") {
				// console.log("     success: " + this[key]);
				event[key] = this[key];
			}
		}
	}

	/*jslint forin: true */
	for (uid in eventHash) {
		eventGroup = eventHash[uid];
		// If we have a group of exceptions but no parent event, then we can't
		// propagate the parent's properties.  This may cause trouble
		if (eventGroup.exceptions.length && eventGroup.parentEvent) {
			eventGroup.exceptions.forEach(propagateToOneEvent, eventGroup.parentEvent);
		}
	}
	/*jslint forin: false */
};

IO._maybeSynthesizeDtendForEvents = function (calendar) {
	calendar.events.forEach(function (event) {
		// If this isn't an allDay event, or an exception to another event, and
		// we've got a valid dtstart and a duration but no dtend, synthesize a 
		// dtend by adding the duration to dtstart
		if (!event.allDay && !event.dtend && event.dtstart && event.duration) {
			var duration = Utils.parseIso8601Duration(event.duration),
				date = new Date(event.dtstart),
				mod = duration.sign === '-' ? -1 : 1;

			date.setFullYear(date.getFullYear()	+ ((duration.years || 0) * mod));
			date.setMonth(date.getMonth()		+ ((duration.months - 1 || 0) * mod));
			date.setDate(date.getDate()			+ ((duration.days || 0) * mod));
			date.setHours(date.getHours()		+ ((duration.hours || 0) * mod));
			date.setMinutes(date.getMinutes()	+ ((duration.minutes || 0) * mod));
			date.setSeconds(date.getSeconds()	+ ((duration.seconds || 0) * mod));

			event.dtend = date.getTime();
		}
	});
};

IO._maybeSetDefaultAlarms = function (calendar) {
	var alarms,
		alarmTriggerObject,
		alarmObject = {};
	calendar.events.forEach(function (event) {
		// If this isn't an allDay event, or an exception to another event
		// check if it has an alarm set to it, otherwise set a default alarm
		// to a value of 'none'
		alarms = [];
		if (!event.allDay) {
			if (!event.alarm) {
				alarms.push(alarmObject);
				event.alarm = alarms;
			}
			event.alarm.forEach(function(alarmObject){
				if (!alarmObject[IO._ALARM_ACTION_PROP_NAME]) {
					alarmObject[IO._ALARM_ACTION_PROP_NAME] = 'DISPLAY';
				}
				
				if (!alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME]) {
					alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME] = {};
				}
				alarmTriggerObject = alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME];
				
				if (!alarmTriggerObject[IO._ALARMTRIGGER_VALUETYPE_PROP_NAME]) {
					alarmTriggerObject[IO._ALARMTRIGGER_VALUETYPE_PROP_NAME] = 'DURATION';
				}
				if (!alarmTriggerObject[IO._ALARMTRIGGER_VALUE_PROP_NAME]) {
					alarmTriggerObject[IO._ALARMTRIGGER_VALUE_PROP_NAME] = 'none';
				}
			});
		}
	});
};

Import.importTimezone = function (iterator) {
	var line;
	// TODO: Is there something we want to do with this information?
	do {
		// Just skip the timezone information for now
		line = IO._stripWhiteSpaceUpToFirstColon( iterator.next() );
	} while (!IO._VTIMEZONE_END_REGEX.test(line) && iterator.get());
};
