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
/*global console, _, Class, PropertyBase*/

/**
 * @class
 * @augments PropertyBase
 * @param {object} obj the raw database object
 * @example
 * var source = new SyncSource({
 *	name: "google",
 *	extended: {}
 * });
 *
 * var sourceString = source.getName();
 * var sourceStringAgain = key.x_name; // This is for use in widgets. Code should always call the getter rather than accessing the property.
 */
var SyncSource = PropertyBase.create({
	/**
	* @lends SyncSource#
	* @property {string} x_name
	* @property {object} x_extended
	*/
	data: [
		{
			dbFieldName: "name",
			defaultValue: null,
			/**
			* @name SyncSource#setName
			* @function
			* @param {string} name
			*/
			setterName: "setName",
			/**
			* @name SyncSource#getName
			* @function
			* @returns {string}
			*/
			getterName: "getName"
		}, {
			dbFieldName: "extended",
			defaultValue: {},
			/**
			* @name SyncSource#setExtended
			* @function
			* @param {object} extended
			*/
			setterName: "setExtended",
			/**
			* @name SyncSource#getExtended
			* @function
			* @returns {object}
			*/
			getterName: "getExtended"
		}
	]
});

SyncSource.prototype.equals = function (obj) {
	if (obj instanceof SyncSource) {
		return (this.getName() === obj.getName());
	}
	return false;
};