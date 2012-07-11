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

/*global Import, IO */

Import.importAttendees = (function() {
	function removeAllSubstrFromLine(line, substr) {
		var index = 0;
		while ((index = line.indexOf(substr)) > -1) {
			line = line.substring(0, index) + (index + substr.length === line.length ? "": line.substring(index + substr.length));
			//append rest of string after substr only if there is anything to append
		}
		return line;
	}

	function parseAttendeePartstatField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeCutypeField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeLanguageField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeDirField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeSentbyField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeCNField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeMemberField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeRoleField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeRsvpField(line) {
		var returnValue = null;

		if (/TRUE/i.test(line)) {
			returnValue = true;
		} else if (/FALSE/i.test(line)) {
			returnValue = false;
		} else {
			throw new Error("Attendee parsing: RSVP: wrong value");
		}
		return returnValue;
	}

	function parseAttendeeDelegatedtoField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}

	function parseAttendeeDelegatedfromField(line) {
		return removeAllSubstrFromLine(line, "\"");
	}


	//used for both parsing ATTENDEE line and ORGANIZER line. Optional bool isOrganizer passed in when parsing ORGANIZER
	return function(line, event, isOrganizer)
	{
		if (IO._ATTENDEE_REGEX.test(line) && !isOrganizer) {
			line = IO._valueAfterDelimiter(line, "ATTENDEE");
		} else if (IO._ORGANIZER_REGEX.test(line) && isOrganizer && isOrganizer === true) {
			line = IO._valueAfterDelimiter(line, "ORGANIZER");
		} else {
			throw new Error("Error parsing " + ((isOrganizer && isOrganizer === true) ? "Organizer": "Attendee"));
		}


		var attendeeObject = {},
		currentParam,
		currentValue,
		eqPos,
		i,
		index,
		paramsArray;

		if (isOrganizer && isOrganizer === true) {
			attendeeObject[IO._ORGANIZER_PROP_NAME] = true;
		}

		if (IO._ATTENDEE_MAILTO_REGEX.test(line)) {
			index = line.search(IO._ATTENDEE_MAILTO_REGEX);
			if (index > -1) {
				attendeeObject[IO._ATTENDEE_MAILTO_PROP_NAME] = IO._valueAfterDelimiter(line.substring(index + 1), ":");
			}
			line = line.substring(0, index);
			if (line.length > 0 && line[0] === ";") {
				//snip off leading ;
				line = line.substring(1);
			}
		} else {
			throw new Error("Attendee parsing: MAILTO: clause not found");
		}

		//after stripping off :mailto:<email> from end of ATTENDEE line, parse properties if they exist (ie line.length > 0)
		if (line.length > 0) {
			paramsArray = IO._getValuesAsArray(line, ";");
			for (i = 0; i < paramsArray.length; i++) {
				eqPos = paramsArray[i].search("=");
				currentParam = paramsArray[i].substring(0, eqPos);
				currentValue = paramsArray[i].substring(eqPos + 1);
				if (IO._ATTENDEE_CN_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_CN_PROP_NAME] = parseAttendeeCNField(currentValue);
				}
				else if (IO._ATTENDEE_MEMBER_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_MEMBER_PROP_NAME] = parseAttendeeMemberField(currentValue);
				}
				else if (IO._ATTENDEE_ROLE_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_ROLE_PROP_NAME] = parseAttendeeRoleField(currentValue);
				}
				else if (IO._ATTENDEE_RSVP_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_RSVP_PROP_NAME] = parseAttendeeRsvpField(currentValue);
				}
				else if (IO._ATTENDEE_DELEGATEDTO_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_DELEGATEDTO_PROP_NAME] = parseAttendeeDelegatedtoField(currentValue);
				}
				else if (IO._ATTENDEE_DELEGATEDFROM_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_DELEGATEDFROM_PROP_NAME] = parseAttendeeDelegatedfromField(currentValue);
				}
				else if (IO._ATTENDEE_SENTBY_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_SENTBY_PROP_NAME] = parseAttendeeSentbyField(currentValue);
				}
				else if (IO._ATTENDEE_DIR_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_DIR_PROP_NAME] = parseAttendeeDirField(currentValue);
				}
				else if (IO._ATTENDEE_LANGUAGE_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_LANGUAGE_PROP_NAME] = parseAttendeeLanguageField(currentValue);
				}
				else if (IO._ATTENDEE_CUTYPE_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_CUTYPE_PROP_NAME] = parseAttendeeCutypeField(currentValue);
				}
				else if (IO._ATTENDEE_PARTSTAT_REGEX.test(currentParam)) {
					attendeeObject[IO._ATTENDEE_PARTSTAT_PROP_NAME] = parseAttendeePartstatField(currentValue);
				}
			}
		}

		if (event[IO._ATTENDEE_PROP_NAME] && event[IO._ATTENDEE_PROP_NAME].length > 0) {
			event[IO._ATTENDEE_PROP_NAME].push(attendeeObject);
		} else {
			event[IO._ATTENDEE_PROP_NAME] = [attendeeObject];
		}
	};

} ());
