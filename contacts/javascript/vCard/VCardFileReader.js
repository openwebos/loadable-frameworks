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
/*global exports, _, Class, Assert, JSON, Utils, DB, PalmCall, ContactBackupHash, PropertyArray, DefaultPropertyHash, Contact, ContactLinkable, Foundations */

// This is here because file IO stuff is kinda in an unknown state right now
var VCardFileReader = Class.create({
	/** @lends vCardFileReader#*/

	/**
	 *
	 * @constructs
	 * @param {Object}
	 * @example
	 * var favoriteBackup = new FavoriteBackup({
	 *                     contactBackupHash: 3XC8|local,
	 *                     defaultPropertyHashes: [{
	 *                          value: FEF89&wef,jfew9823,
	 *                          type: "PhoneNumber" }]
	 *                });
	 *
	 * var favoriteBackupContactHash = favoriteBackup.getContactBackupHash();
	 * var favoriteBackupDefaultPhoneNumber = favoriteBackup.getDefaultPhoneNumber();
	 */
	initialize: function (obj) {
		if (!obj || !obj.filePath) {
			throw new Error("Must create VCardFileReader with an object containing filePath");
		}

		this.fileName = obj.filePath;

		this.fileHandler = { currentLine: 0,
							lines: (Foundations.Comms.loadFile(this.fileName)).split("\n"),
							readLine: function () {
								if (this.currentLine < this.lines.length) {
									this.currentLine += 1;
									return this.lines[this.currentLine - 1];
								} else {
									return null;
								}
							},
							restartFile: function () {
								this.currentLine = 0;
							}
						};

		this.peekedLine = "";
	},

	/**
	 * Gets the contactId for this favorite backup from the contactBackupHash
	 * @returns {string} The id of the contact for this favorite backup
	 */
	readLine: function () {
		var toReturn;

		if (this.peekedLine) {
			toReturn = this.peekedLine;
			this.peekedLine = undefined;
		} else {
			toReturn = this.fileHandler.readLine();
		}

		return toReturn;
	},

	/**
	  * Performs a readLine but causes the next call to readline
	  * to return the peeked line. Multiple calls to peek will only
	  * return the last peeked line. This ensures that multiple peeks
	  * will not cause readLine to miss a line due to calls to peek.
	  * @returns {string} the next line from the file
	  */
	peek: function () {
		if (!this.peekedLine) {
			this.peekedLine = this.fileHandler.readLine();
		}

		return this.peekedLine;
	}
});