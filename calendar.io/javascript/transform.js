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

/*global _, ObjectUtils, stringify, Utils */

var Transform = {
	formatDate: function (timestamp, useZulu) {
		var date = Utils.dateToIso8601(timestamp, {
			noPunct: true, 
			noMS: true, 
			noTzOffset: true, 
			useZulu: useZulu
		});
		return date;
	},

	formatDateOnly: function (timestamp, useZulu) {
		var date = Utils.dateToIso8601(timestamp, {
			noPunct: true, 
			noMS: true, 
			noTzOffset: true, 
			useZulu: useZulu,
			justDate: true
		});
		return date;
	},

	foldLines: function (lines) {
		var folds,
			f,
			parts,
			iter,
			i;

		for (i = 0; i < lines.length; ++i) {
			if (lines[i].length > 75) {
				// Individual lines must be no more than 75 octets, not including
				// the terminating '\r\n'.  Use 74 here, so we have room to insert
				// a single space (in addition to '\r\n') to make the line "folded".
				folds = Math.floor(lines[i].length / 74);
				Utils.debug("foldLines(): " + folds + " folds in line: '" + lines[i] + "'");
				for (f = 0, parts = [], iter = 0; f < folds; ++f, iter += 74) {
					parts.push(lines[i].slice(iter, iter + 74));
				}
				if (iter) {
					parts.push(lines[i].slice(iter));
				}
				if (parts.length) {
					lines[i] = parts.join('\r\n ');
					Utils.debug("foldLines(): folded line:\n" + lines[i]);
				}
			}
		}
	},

	handleGenericField: function (event, field, transformFieldName, transformParams, options) {
		transformParams = transformParams || {};
		options = options || {};
	
		Utils.debug("eventToVCalendar.transform(): got a generic field: '" + field + "'");

		var separator = transformParams.separator || '',
			quotable = transformParams.quotable;
		
		if (options.includeUnknownFields === false && transformFieldName === undefined) {
			return undefined;
		}
		
		function quoteStringContaining(str, selector) {
			if (selector && str.indexOf(selector) !== -1) {
				return '"' + str + '"';
			}
			return str;
		}

		return (transformFieldName || field.toUpperCase()) + separator + quoteStringContaining(event[field], quotable);
	},

	transform: function (event, transformer, transformParams, options) {
		transformParams = transformParams || {};
		options = options || {};
		
		var parts = (transformParams.header && transformParams.header.slice(0)) || [],
			fields = _.keys(event),
			fieldResult;

		Utils.debug("\n\n\n----->>>>> Transforming event: " + stringify(event));
		
		fields.forEach(function (field) {
			Utils.debug("------>>>>>> field: " + field + " (" + event[field] + ")");
				
			if (event[field] === undefined || event[field] === null || event[field] === '') {
				Utils.debug("------->>>>>>> field is empty; skipping");
				return;
			}

			switch (ObjectUtils.type(transformer[field])) {
				case "function":
					fieldResult = transformer[field](event, options);
					break;
				case "array":
				case "object":
					fieldResult = field.toUpperCase() + transformParams.separator + transformer[field][event[field]];
					break;
				case "boolean":
					if (!transformer[field]) {
						// Filter this field out
						Utils.debug("------>>>>>> Filtering out field: " + field + " (" + event[field] + ")");
						
						return;
					}
					fieldResult = Transform.handleGenericField(event, field, field.toUpperCase(), transformParams, options);
					break;
				case "string":
					fieldResult = Transform.handleGenericField(event, field, transformer[field], transformParams, options);
					break;
				default:
					fieldResult = Transform.handleGenericField(event, field, undefined, transformParams, options);
					break;
			}

			if (fieldResult) {
				parts.push(fieldResult);
			}
		}, transformer);

		if (transformParams.footer) {
			parts = parts.concat(transformParams.footer);
		}

		parts = _.flatten(parts);
		
		Utils.debug("tranform(): parts after flatten: " + stringify(parts));
		
		if (transformParams.foldlines) {
			Transform.foldLines(parts);
		}

		if (transformParams.noJoin) {
			return parts;
		}
		return parts.join(transformParams.joiner || '\r\n');
	}
};
