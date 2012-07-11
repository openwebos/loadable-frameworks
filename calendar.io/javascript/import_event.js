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

/*global Import, IO, stringify, Utils */

Import.importEvent = (function () {
	function parseCategoriesField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseClassificationField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseSummaryField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseDtstartField( line, event )
	{
		//optional TZID exists
		if (IO._TZID_REGEX.test( line )){
			line = IO._valueAfterDelimiter(line, "TZID="); //only stuff after TZID=
			event[ IO._TZID_PROP_NAME ]= Utils.strip(IO._valueBeforeDelimiter(line, ":"), "\\s\"") ; // DTSTART;TZID=America/Los_Angeles:    , after TZID=, before :
		}

		//now to extract the time (this also addresses VALUE=DATE:, VALUE=TIME:, VALUE=DATE-TIME:)
		if (/:/i.test ( line )){
			line = IO._valueAfterDelimiter(line,":"); //only stuff after ':' (which must be date/time)
			// Don't attempt timezone conversion here; we'll do it later
			event[ IO._DTSTART_PROP_NAME ] = Utils.dateFromIso8601(line, true).getTime();

			//Add allday property
			if (! (/T/.test(line)) ) {
				event[ IO._ALLDAY_PROP_NAME ] = true;
			}
			else {
				event[ IO._ALLDAY_PROP_NAME ] = false;
			}

			if (/Z$/.test(line)) {
				// This is in Zulu (i.e., UTC) time
				event[ IO._TZID_PROP_NAME ] = "UTC";
			}
		}else{
			throw new Error( "could not parse DTSTART field. no time/date info found");	
		}
	}

	function parseDtendField( line, event )
	{
		//optional TZID exists
		if (IO._TZID_REGEX.test( line )){
			line = IO._valueAfterDelimiter(line, "TZID="); //only stuff after TZID=
			event[ IO._TZID_PROP_NAME ]= Utils.strip(IO._valueBeforeDelimiter(line, ":"), "\\s\"") ; // DTSTART;TZID=America/Los_Angeles:    , after TZID=, before :
		}

		//now to extract the time (this also addresses VALUE=DATE:, VALUE=TIME:, VALUE=DATE-TIME:)
		if (/:/i.test ( line )){
			line = IO._valueAfterDelimiter(line,":"); //only stuff after ':' (which must be date/time)
			// Don't attempt timezone conversion here; we'll do it later
			event[ IO._DTEND_PROP_NAME ] = Utils.dateFromIso8601(line, true).getTime();
		}else{
			throw new Error( "could not parse DTEND field. no time/date info found");	
		}
	}

	function parseLocationField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseDescriptionField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseTranspField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseDtstampField( line )
	{
		var dtstamp = IO._textValueFromLine(line, "=");
		// Don't attempt timezone conversion here; we'll do it later
		dtstamp = dtstamp && Utils.dateFromIso8601(dtstamp, true);
		dtstamp = dtstamp && dtstamp.getTime();
		return dtstamp;

		// return( IO._textValueFromLine( line ) );
	}

	function parseCreatedField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseGeoField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseLastModifiedField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parsePriorityField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseUrlField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseUidField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseCommentField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseContactField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseRelatedToField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseResourcesField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseRequestStatusField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function pushTestValueFromLineToArray(line, event, field) {
		var values;

		values = IO._valueFromLine( line ).split( ',' );
		if ( !event[field] ) {
			event[field] = values;
		} else {
			event[field] = event[field].concat(values);
		}
	}

	function parseExdatesField( line, event )
	{
		pushTestValueFromLineToArray(line, event, IO._EXDATES_PROP_NAME);
		console.log("======== VEVENT exdates parsed: " + stringify(event.exdates));
	}

	function parseRdatesField( line, event )
	{
		pushTestValueFromLineToArray(line, event, IO._RDATES_PROP_NAME);
	}

	function parseAttachField( line, event )
	{
		pushTestValueFromLineToArray(line, event, IO._ATTACH_PROP_NAME);
	}

	function parseRecurrenceIdField( line )
	{
		return( IO._textValueFromLine( line ) );
	}

	function parseSequenceField( line )
	{
		return( IO._textValueFromLine( line ) );
	}


	return function (iterator, calendarId, options) {
		var line,
			event = {};

		event[IO._CALENDAR_ID_PROP_NAME] = calendarId;

		while (iterator.next())
		{
			console.log("\n---->>>> Processing line " + iterator.index + ": " + iterator.get());
			line = IO._stripWhiteSpaceUpToFirstColon( iterator.get() );

			if ( IO._CATEGORIES_REGEX.test( line ) )
			{
				event[ IO._CATEGORIES_PROP_NAME ] = parseCategoriesField( line );
			}
			else if ( IO._CLASSIFICATION_REGEX.test( line ) )
			{
				event[ IO._CLASSIFICATION_PROP_NAME ] = parseClassificationField( line );
			}
			else if ( IO._SUMMARY_REGEX.test( line ) )
			{
				event[ IO._SUMMARY_PROP_NAME ] = parseSummaryField( line );
			}
			else if ( IO._DTSTART_REGEX.test( line ) ) 
			{
				parseDtstartField( line, event ); //needs direct event object access
			}
			else if ( IO._DTEND_REGEX.test( line ) )
			{
				parseDtendField( line, event ); //needs direct event object access
			}
			else if ( IO._LOCATION_REGEX.test( line ) )
			{
				event[ IO._LOCATION_PROP_NAME ] = parseLocationField( line );
			}
			else if ( IO._DESCRIPTION_REGEX.test( line ) )
			{
				event[ IO._DESCRIPTION_PROP_NAME ] = parseDescriptionField( line );
			}
			else if ( IO._TRANSP_REGEX.test( line ) )
			{
				event[ IO._TRANSP_PROP_NAME ] = parseTranspField( line );
			}
			else if ( IO._DTSTAMP_REGEX.test( line ) )
			{
				event[ IO._DTSTAMP_PROP_NAME ] = parseDtstampField( line );
			}
			else if ( IO._CREATED_REGEX.test( line ) )
			{
				event[ IO._CREATED_PROP_NAME ] = parseCreatedField( line );
			}
			else if ( IO._GEO_REGEX.test( line ) )
			{
				event[ IO._GEO_PROP_NAME ] = parseGeoField( line );
			}
			else if ( IO._LAST_MODIFIED_REGEX.test( line ) )
			{
				event[ IO._LAST_MODIFIED_PROP_NAME ] = parseLastModifiedField( line );
			}
			else if ( IO._PRIORITY_REGEX.test( line ) )
			{
				event[ IO._PRIORITY_PROP_NAME ] = parsePriorityField( line );
			}
			else if ( IO._URL_REGEX.test( line ) )
			{
				event[ IO._URL_PROP_NAME ] = parseUrlField( line );
			}
			else if ( IO._UID_REGEX.test( line ) && !options.excludeUid )
			{
				event[ IO._UID_PROP_NAME ] = parseUidField( line );
			}
			else if ( IO._COMMENT_REGEX.test( line ) )
			{
				event[ IO._COMMENT_PROP_NAME ] = parseCommentField( line );
			}
			else if ( IO._CONTACT_REGEX.test( line ) )
			{
				event[ IO._CONTACT_PROP_NAME ] = parseContactField( line );
			}
			else if ( IO._RELATEDTO_REGEX.test( line ) )
			{
				event[ IO._RELATEDTO_PROP_NAME ] = parseRelatedToField( line );
			}
			else if ( IO._RESOURCES_REGEX.test( line ) )
			{
				event[ IO._RESOURCES_PROP_NAME ] = parseResourcesField( line );
			}
			else if ( IO._REQUEST_STATUS_REGEX.test( line ) )
			{
				event[ IO._REQUEST_STATUS_PROP_NAME ] = parseRequestStatusField( line );
			}
			else if ( IO._EXDATES_REGEX.test( line ) )
			{
				parseExdatesField( line, event ); //needs direct event object access
			}
			else if ( IO._RDATES_REGEX.test( line ) )
			{
				parseRdatesField( line, event ); //needs direct event object access
			}
			else if ( IO._ATTACH_REGEX.test( line ) )
			{
				parseAttachField( line, event ); //needs direct event object access
			}
			else if ( IO._RECURRENCE_ID_REGEX.test( line ) )
			{
				event[ IO._RECURRENCE_ID_PROP_NAME ] = parseRecurrenceIdField( line );
			}
			else if ( IO._SEQUENCE_REGEX.test( line ) )
			{
				event[ IO._SEQUENCE_PROP_NAME ] = parseSequenceField( line );
			}
			else if ( IO._RRULE_REGEX.test( line ) )
			{
				event[ IO._RRULE_PROP_NAME ] = Import.importRrule( line );
			}
			else if ( IO._ATTENDEE_REGEX.test( line ) )
			{
				Import.importAttendees( line, event ); //needs direct event object access
			}
			else if ( IO._ORGANIZER_REGEX.test( line ) )
			{
				Import.importAttendees( line, event, true ); //needs direct event object access
			}
			else if ( IO._VALARM_BEGIN_REGEX.test( line ) )
			{
				Import.importAlarm(iterator, event);
			}
			else if (IO._VTIMEZONE_BEGIN_REGEX.test(line)) {
				Import.importTimezone(iterator, options);
			}
			else if (IO._VEVENT_END_REGEX.test( line )) {
				// We're done
				break;
			}
			else {
				if (options.includeUnknownFields) {
					event[IO._valueBeforeDelimiter(line, ':').toLowerCase()] = IO._valueAfterDelimiter(line, ':');
				}
				console.log( "======== VEVENT IMPORT - Unknown Field: \"" + line + "\"" );
			}
		}

		return event;
	};
}());
