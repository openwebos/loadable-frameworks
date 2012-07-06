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
/*global PropertyBase, Assert, Crypto*/

/**
 * @class
 * @augments PropertyBase
 * @param string obj the raw database object
 * @example
 * var speedDialHash = new SpeedDialHash({"hashedPhoneNumber": "faw789a943fkjaf", "key": "k"});
 *
 * var speedDialHashKey = speedDialHash.getKey();
 * var SpeedDialHashKeyAgain = speedDialHash.x_key; // This is for use in widgets. Code should always call the getter rather than accessing the property.
 */
var SpeedDialHash = PropertyBase.create({
	/**
	* @lends SpeedDialHash#
	* @property string x_value
	*/
	data: [
		{
			dbFieldName: "hashedPhoneNumber",
			defaultValue: null,
			/**
			* Only call this method when you pre-md5ied the value. If you want
			* to set the value without having to md5 it, call SpeedDialHash#setPlainValue
			* @name SpeedDialHash#setValue
			* @function
			* @param string value
			*/
			setterName: "setHashedPhoneNumber",
			/**
			* @name SpeedDialHash#getValue
			* @function
			* @returns string
			*/
			getterName: "getHashedPhoneNumber"
		}, {
			dbFieldName: "key",
			defaultValue: null,
			/**
			* @name DefaultPropertyHash#setKey
			* @function
			* @param string key
			*/
			setterName: "setKey",
			/**
			* @name DefaultPropertyHash#getKey
			* @function
			* @returns string
			*/
			getterName: "getKey"
		}
	]
});

/**
* @param {SpeedDialHash} value
* @returns boolean
*/
SpeedDialHash.prototype.equals = function (value) {
	if (value instanceof SpeedDialHash) {
		return this.getHashedPhoneNumber() === value.getHashedPhoneNumber() && this.getKey() === value.getKey();
	}
	return false;
};

/**
* Sets the hashedPhoneNumber of the SpeedDialHash. SpeedDialHash have values that are md5s.
* This method allows you to set the value without having to calculate the md5 for it. You
* should always call this method and not md5 it before hand.
* @param {string} value - the value for this SpeedDialHash.
*/
SpeedDialHash.prototype.setPlainValue = function (value) {
	this.setHashedPhoneNumber(value ? Crypto.MD5.b64_md5(value) : null);
};

SpeedDialHash.prototype.isPlainValueEqual = function (value) {
	return value ? (Crypto.MD5.b64_md5(value) === this.getHashedPhoneNumber()) : (value === this.getHashedPhoneNumber());
};