// LICENSE@@@
//
//      Copyright (c) 2009-2012 Hewlett-Packard Development Company, L.P.
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
// @@@LICENSE

/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true,
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global PropertyBase*/

/**
 * @class Ringtone
 * @augments PropertyBase
 * @param {string} obj the raw database object
 * @example
 * var ringtone = new Ringtone({ name: "Awesome Ringtone", location: "/usr/ringtones/awesomeRingtone.mp3" });
 *
 * var ringtoneNameString = ringtone.getName();
 * var ringtoneNameStringAgain = ringtone.x_name; // This is for use in widgets. Code should always call the getter rather than accessing the property.
 *
 * var ringtoneLocationString = ringtone.getLocation();
 *
 */
var Ringtone = PropertyBase.create({
	/**
	* @lends Ringtone#
	* @property {string} x_name
	* @property {string} x_location
	*/
	data: [
		{
			dbFieldName: "name",
			defaultValue: "",
			/**
			* @name Ringtone#setName
			* @function
			* @param {string} value
			*/
			setterName: "setName",
			/**
			* @name Ringtone#getName
			* @function
			* @returns {string}
			*/
			getterName: "getName"
		}, {
			dbFieldName: "location",
			defaultValue: "",
			/**
			* @name Ringtone#setLocation
			* @function
			* @param {string} value
			*/
			setterName: "setLocation",
			/**
			* @name Ringtone#getLocation
			* @function
			* @returns {string}
			*/
			getterName: "getLocation"
		}
	]
});