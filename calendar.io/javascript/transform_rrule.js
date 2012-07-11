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

/*global ObjectUtils, Transform, _ */

/*
	"type": {
		"$ref": "RecurrenceRule"
	},
	"optional": "true",
	"description": "rrule object, same name as old schema, used to be string type"
	"id":"RecurrenceRule",
	"type":"object",
	"properties":{
		"freq":{
			"type":"string"
		},
		"wkst":{
			"type":"int",
			"optional":"true"
		},

		"until":{
			"type":"long",
			"optional":"true"
		},
		"count":{
			"type":"int",
			"optional":"true"
		},
		"interval":{
			"type":"int",
			"optional":"true"
		},
		"rules":{
			"type":["$ref":"rule"],
			"optional":"true"
		}
	}
*/

var RruleTransform = function RruleTransform(allDay) {
	this.allDay = allDay;
};

RruleTransform.prototype = {
	/* Handled generically */
	freq: true,
	count: true,
	interval: true,
	
	until: function (rrule) {
		if (this.allDay) {
			return "UNTIL=" + Transform.formatDateOnly(rrule.until, true);
		}
		return "UNTIL=" + Transform.formatDate(rrule.until, true);
	},

	wkst: [
		"SU", "MO", "TU", "WE", "TH", "FR", "SA"
	],

	rules: function (rrule) {
		var out = [],
			ruleValue;
		rrule.rules.forEach(function ruleIterator(rule) {
			// Unsupported, but stored as a string:
			//	BYSECOND byseclist
			//	BYMINUTE byminlist
			//	BYHOUR byhrlist
			if (ObjectUtils.type(rule) === "string") {
				out.push(rule);
			} else {
				ruleValue = [];

				rule.ruleValue.forEach(function ruleValueIterator(value) {
					ruleValue.push(
						(value.ord ? value.ord : '') +
						(_.isNumber(value.day) ? RruleTransform.prototype.wkst[value.day] : '')
					);
				});

				out.push(rule.ruleType + "=" + ruleValue.join(','));
			}
		});

		return out;
	}
};

Transform.transformRRule = function (event, options) {
	var params = Transform.transform(event.rrule, new RruleTransform(event.allDay), {
		separator: '=',
		joiner: ';'
	}, options);

	return "RRULE:" + params;
};
