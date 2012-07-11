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

var alarmTransform = {
	/* Handled generically: */
	action: true,
	repeat: true,
	duration: true,
	attach: true,
	description: true,
	summary: true,
	attendee: true,

	alarmTrigger: function (alarm) {
		var trigger = "TRIGGER";
		
		if (alarm.alarmTrigger.related === "START") {
			trigger += ";RELATED=START";
		} else if (alarm.alarmTrigger.related === "END") {
			trigger += ";RELATED=END";
		}		
		
		if (alarm.alarmTrigger.valueType === "DATETIME") {			
			trigger += ";VALUE=DATE-TIME";
		} else if (alarm.alarmTrigger.valueType !== "DURATION") {
			console.log("transformAlarm().alarmTrigger(): unknown alarm trigger value type: " + stringify(alarm.alarmTrigger.valueType));
			return "";			
		}
		
		trigger +=  ":" + alarm.alarmTrigger.value;
		
		return trigger;
	},
	_id: function () {}
};

Transform.transformAlarm = function (event, options) {
	var alarms = [];

	event.alarm.forEach(function (alarm) {
		// "none" is a placeholder value used by the Calendar app, but is
		// not valid in this context, so we skip the alarm
		if (alarm.alarmTrigger.value !== 'none') {
			var result = Transform.transform(alarm, alarmTransform, {
				header: [
					"BEGIN:VALARM"
				],
				footer: [
					"END:VALARM"
				],
				separator: ':',
				noJoin: true
			}, options);
			alarms.push(result);
		}
	});

	return alarms;
};
