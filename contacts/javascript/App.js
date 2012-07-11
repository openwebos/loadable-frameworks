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
/*global exports, Assert, Person, Contact, PalmCall*/

var App = exports.App = {
	/**
	 * Launches the contacts app via the applicationManager to the PseudoDetailScene
	 * @param {Object} launchParams
	 *						{
	 *							person: {Person || raw person object},		// when displaying a person that is already stored in the DB
	 *							contact: {Contact || raw contact object}	// used for adding new contact data
	 *						}
	 */
	launchContactsAppToPseudoDetailScene: function (launchParams) {
		Assert.require(launchParams && (launchParams.person || launchParams.contact), "launchContactsAppToPseudoDetailScene requires a person or contact object to be passed");
		Assert.require(!(launchParams.person && launchParams.contact), "launchContactsAppToPseudoDetailScene You must specify a person OR a contact. Not both.");

		launchParams.launchType = "pseudo-card";

		if (launchParams.person && launchParams.person instanceof Person) {
			launchParams.person = launchParams.person.getDBObject();
		}

		if (launchParams.contact && launchParams.contact instanceof Contact) {
			launchParams.contact = launchParams.contact.getDBObject();
		}

		return PalmCall.call("palm://com.palm.applicationManager/", "open", {
			id: "com.palm.app.contacts",
			params: launchParams
		});
	}
};
