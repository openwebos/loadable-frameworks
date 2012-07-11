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
 * var defaultPropertyHash = new DefaultPropertyHash({"value": "faw789a943fkjaf", "type": "PhoneNumber"});
 *
 * var defaultPropertyHashValue = defaultPropertyHash.getValue();
 * var defaultPropertyHashValueAgain = defaultPropertyHash.x_value; // This is for use in widgets. Code should always call the getter rather than accessing the property.
 */
var DefaultPropertyHash = PropertyBase.create({
	/**
	* @lends DefaultPropertyHash#
	* @property string x_value
	*/
	data: [
		{
			dbFieldName: "value",
			defaultValue: null,
			/**
			* Only call this method when you pre-md5ied the value. If you want
			* to set the value without having to md5 it, call DefaultPropertyHash#setPlainValue
			* @name DefaultPropertyHash#setValue
			* @function
			* @param string value
			*/
			setterName: "setValue",
			/**
			* @name DefaultPropertyHash#getValue
			* @function
			* @returns string
			*/
			getterName: "getValue"
		}, {
			dbFieldName: "type",
			defaultValue: null,
			/**
			* @name DefaultPropertyHash#setType
			* @function
			* @param string type
			*/
			setterName: "setType",
			/**
			* @name DefaultPropertyHash#getType
			* @function
			* @returns string
			*/
			getterName: "getType"
		}, {
			dbFieldName: "favoriteData",
			defaultValue: null,

			setterName: "setFavoriteData",

			getterName: "getFavoriteData"
		}
	]
});

/**
* @param {DefaultPropertyHash} value
* @returns boolean
*/
DefaultPropertyHash.prototype.equals = function (value) {
	if (value instanceof DefaultPropertyHash) {
		return this.getValue() === value.getValue() && this.getType() === value.getType();
	}
	return false;
};

/**
* Sets the value of the DefaultPropertyHash. DefaultPropertyHashes have values that are md5s.
* This method allows you to set the value without having to calculate the md5 for it. You
* should always call this method and not md5 it before hand.
* @param {string} value - the value for this DefaultPropertyHash.
*/
DefaultPropertyHash.prototype.setPlainValue = function (value) {
	this.setValue(value ? Crypto.MD5.b64_md5(value) : null);
};

DefaultPropertyHash.prototype.isPlainValueEqual = function (value) {
	return value ? (Crypto.MD5.b64_md5(value) === this.getValue()) : (value === this.getValue());
};