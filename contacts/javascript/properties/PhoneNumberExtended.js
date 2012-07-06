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
/*global console, _, Class, PhoneNumber, PropertyBase, FavoritablePhoneNumber*/


/**
* @class
* @augments PhoneNumber
* @param {object} obj the raw database object
* @example
* var phone = new PhoneNumber({
*	value: "5555555555",
*	type: "mobile",
*	primary: false
* });
*
* var phoneString = phone.getValue();
* var phoneStringAgain = phone.x_value; // This is for use in widgets. Code should always call the getter rather than accessing the property.
* var normalizedValue = phone.getNormalizedValue();
*/
var PhoneNumberExtended = PropertyBase.create({
	/**
	* @lends PhoneNumberExtended#
	* @property {string} x_normalizedValue
	* @property {string} x_speedDial
	*/
	superClass: FavoritablePhoneNumber,
	data: [
		{	// Override value so we can implement a beforeSet method that sets a boolean to
			// indicate that the normalizedValue needs to be generated.  If this 'true', we
			// will set the normalizedValue when getNormalizedValue() is called or getDBObject()
			dbFieldName: "value",
			defaultValue: "",
			/**
			* @name PhoneNumberExtended#setValue
			* @function
			* @param {string} value
			*/
			setterName: "setValue",
			/**
			* @name PhoneNumberExtended#getValue
			* @function
			* @returns {string}
			*/
			getterName: "getValue",
			beforeSet: function (value) {
				this.doGenerateNormalizedValue = true;
				return value;
			}
		},
		{
			dbFieldName: "normalizedValue",
			defaultValue: "",
			/**
			* @name PhoneNumberExtended#setNormalizedValue
			* @function
			* @param {string} value
			*/
			setterName: "setNormalizedValue",
			/**
			* @name PhoneNumberExtended#getNormalizedValue
			* @function
			* @returns {string}
			*/
			getterName: "getNormalizedValue",
			beforeGet: function (origNormalizedValue) {
				var normalizedValue = origNormalizedValue,
					value = this.getValue();

				// only generate the normalizedValue if the value has been set
				if (!value || this.doGenerateNormalizedValue) {
					normalizedValue = PhoneNumber.normalizePhoneNumber(value);
					this.setNormalizedValue(normalizedValue);
					this.doGenerateNormalizedValue = false;
				}
				return normalizedValue;
			}
		}, {
			dbFieldName: "speedDial",
			defaultValue: "",
			/**
			* @name PhoneNumberExtended#setSpeedDial
			* @function
			* @param {string} type
			*/
			setterName: "setSpeedDial",
			/**
			* @name PhoneNumberExtended#getSpeedDial
			* @function
			* @returns {string}
			*/
			getterName: "getSpeedDial"
		}
	]
});

PhoneNumberExtended.prototype._extendedGetDBObject = function (dbObject) {
	// make sure that the normalizedValue is up to date since we delay calculating it until it is read
	dbObject.normalizedValue = this.getNormalizedValue();
	return dbObject;
};