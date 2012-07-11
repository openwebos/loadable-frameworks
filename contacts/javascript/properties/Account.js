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
 * @class
 * @augments PropertyBase
 * @param {object} obj the raw database object
 * @example
 * var account = new Account({
 *	domain: "gmail",
 *	userName: "austinPowers",
 *	userid: "12345"
 * });
 *
 * var accountDomain = account.getDomain();
 * var accountDomainAgain = account.x_domain; // This is for use in widgets. Code should always call the getter rather than accessing the property.
 */
var Account = PropertyBase.create({
	/**
	* @lends Account#
	* @property {string} x_domain
	* @property {string} x_userName
	* @property {string} x_userid
	*/
	data: [
		{
			dbFieldName: "domain",
			defaultValue: "",
			/**
			* @name Account#setDomain
			* @function
			* @param {string} domain
			*/
			setterName: "setDomain",
			/**
			* @name Account#getDomain
			* @function
			* @returns {string}
			*/
			getterName: "getDomain"
		},
		{
			dbFieldName: "userName",
			defaultValue: "",
			/**
			* @name Account#setUserName
			* @function
			* @param {string} userName
			*/
			setterName: "setUserName",
			/**
			* @name Account#getUserName
			* @function
			* @returns {string}
			*/
			getterName: "getUserName"
		},
		{
			dbFieldName: "userid",
			defaultValue: "",
			/**
			* @name Account#setUserId
			* @function
			* @param {string} userid
			*/
			setterName: "setUserId",
			/**
			* @name Account#getUserId
			* @function
			* @returns {string}
			*/
			getterName: "getUserId"
		}
	]
});