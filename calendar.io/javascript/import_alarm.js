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

Import.importAlarm = (function () {
	function parseAlarmActionField(line) {
		return IO._textValueFromLine(line);
	}

	function parseAlarmTriggerValueField(line) {
		if (IO._ALARMTRIGGER_VALUETYPE_DATETIME_REGEX.test(line)) {
			return IO._ALARMTRIGGER_VALUETYPE_DATETIME_VALUE;
		} else if (IO._ALARMTRIGGER_VALUETYPE_DURATION_REGEX.test(line)) {
			return IO._ALARMTRIGGER_VALUETYPE_DURATION_VALUE;
		} else {
			return null;
		}
	}
	
	function parseAlarmTriggerRelatedField(line) {
		if (IO._ALARM_ALARMTRIGGER_RELATED_START_REGEX.test(line)) {
			return IO._ALARM_ALARMTRIGGER_RELATED_START_VALUE;
		} else if (IO._ALARM_ALARMTRIGGER_RELATED_END_REGEX.test(line)) {
			return IO._ALARM_ALARMTRIGGER_RELATED_END_VALUE;
		} else {
			return null;
		}
	}

	function getAlarmAlarmTriggerField(line) {
		var alarmTriggerObject = {},
			index = line.search( /:/ ),
			i,
			value,
			propertiesArray;

		alarmTriggerObject[IO._ALARMTRIGGER_VALUE_PROP_NAME] = line.substring(index + 1);
		line = line.substring(0, index);

		propertiesArray = IO._getValuesAsArray(line, ";");

		for (i = 0; i < propertiesArray.length; ++i) {
			if (IO._ALARMTRIGGER_VALUETYPE_REGEX.test(propertiesArray[i])) {
				value = parseAlarmTriggerValueField(propertiesArray[i]);
				if (value !== null) {
					alarmTriggerObject[IO._ALARMTRIGGER_VALUETYPE_PROP_NAME] = value;
				}
			} else if (IO._ALARM_ALARMTRIGGER_RELATED_REGEX.test(propertiesArray[i])) {
				value = parseAlarmTriggerRelatedField(propertiesArray[i]);
				if (value !== null) {
					alarmTriggerObject[IO._ALARM_ALARMTRIGGER_RELATED_PROP_NAME] = value;
				}
			}
		}

		return alarmTriggerObject;
	}
	
	function parseAlarmRepeatField(line) {
		return IO._textValueFromLine(line);
	}

	function parseAlarmDurationField(line) {
		return IO._textValueFromLine(line);
	}

	function parseAlarmAttachField(line) {
		return IO._textValueFromLine(line);
	}

	function parseAlarmDescriptionField(line) {
		return IO._textValueFromLine(line);
	}

	function parseAlarmSummaryField(line) {
		return IO._textValueFromLine(line);
	}
	
	function parseAlarmAttendeeField(line) {
		return IO._textValueFromLine(line);
	}

	function parseAlarm(linesArray) {
		var alarmObject = {},
			line = null,
			i,
			searchIndex;

		for (i = 0; i < linesArray.length; ++i) {
			line = linesArray[i];

			if (IO._ALARM_ACTION_REGEX.test(line)) {
				alarmObject[IO._ALARM_ACTION_PROP_NAME] = parseAlarmActionField(line);
			} else if (IO._ALARM_TRIGGER_REGEX.test(line)) {
				alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME] = getAlarmAlarmTriggerField(line);
			} else if (IO._ALARM_REPEAT_REGEX.test(line)) {
				alarmObject[IO._ALARM_REPEAT_PROP_NAME] = parseAlarmRepeatField ( line );
			} else if (IO._ALARM_DURATION_REGEX.test(line)) {
				alarmObject[IO._ALARM_DURATION_PROP_NAME] = parseAlarmDurationField ( line );
			} else if (IO._ALARM_ATTACH_REGEX.test(line)) {
				alarmObject[IO._ALARM_ATTACH_PROP_NAME] = parseAlarmAttachField(line);
			} else if (IO._ALARM_DESCRIPTION_REGEX.test(line)) {
				alarmObject[IO._ALARM_DESCRIPTION_PROP_NAME] = parseAlarmDescriptionField(line);
			} else if (IO._ALARM_SUMMARY_REGEX.test(line)) {
				alarmObject[IO._ALARM_SUMMARY_PROP_NAME] = parseAlarmSummaryField(line);
			} else if (IO._ALARM_ATTENDEE_REGEX.test(line)) {
				alarmObject[IO._ALARM_ATTENDEE_PROP_NAME] = parseAlarmAttendeeField(line);
			} else {
				console.log("======== VEVENT VALARM IMPORT  - Skipped Field: \"" + line + "\"");
			}		
		}
		
		if (!(alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME][IO._ALARMTRIGGER_VALUETYPE_PROP_NAME])) { //if alarmObject.alarmTrigger.valueType is not set, set it
			searchIndex = alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME][IO._ALARMTRIGGER_VALUE_PROP_NAME].search(/P/); //if P in value, then the value is in duration format, else datetime format
			if ( searchIndex !== -1 ){
				alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME][IO._ALARMTRIGGER_VALUETYPE_PROP_NAME] = IO._ALARMTRIGGER_VALUETYPE_DURATION_VALUE;
			} else {
				alarmObject[IO._ALARM_ALARMTRIGGER_PROP_NAME][IO._ALARMTRIGGER_VALUETYPE_PROP_NAME] = IO._ALARMTRIGGER_VALUETYPE_DATETIME_VALUE;
			}
		}

		return ((IO._getSubObjects(alarmObject).length > 0) ? alarmObject : null) ; //return alarmObject if it has any properties, else return null
	}

	return function (iterator, event) {
		var vAlarmLines = [],
			alarmObject,
			line;
	
		line = IO._stripWhiteSpaceUpToFirstColon(iterator.next());
	
		while (line.length > 0) { //get all fields from BEGIN:VALARM clause into vAlarmLines array, excluding BEGIN:VALARM, END:VALARM
			if (IO._VALARM_END_REGEX.test(line)) { //if END_VALARM clause found, increment item counter, break out of while loop
				line = "";
			} else {
				if (line && line.length > 0) {
					vAlarmLines.push(line);
				}
				line = IO._stripWhiteSpaceUpToFirstColon(iterator.next());
			}
		}
	
		if (vAlarmLines.length > 0) {
			alarmObject = parseAlarm(vAlarmLines);
	
			if (alarmObject !== null) {
				if (event[IO._ALARM_PROP_NAME] && 
				event[IO._ALARM_PROP_NAME].length > 0) {
					event[IO._ALARM_PROP_NAME].push(alarmObject);	
				} else {
					event[IO._ALARM_PROP_NAME] = [alarmObject];
				}
			}
		}
	};
}());
