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
/*global beforeEach, describe, expect, it, include, SpeedDialSaver, console, PersonFactory, PersonType, require */

var fs = require('fs');
var Test = require('./utils');

describe("Speed Dial Saver Tests", function () {
	var pd = JSON.parse(fs.readFileSync("test/persondata.json", "utf8")),
		largePerson,
		mediumPerson;

	beforeEach(function () {
		largePerson = PersonFactory.createPersonDisplay(pd.large_person);
		mediumPerson = PersonFactory.createPersonLinkable(pd.medium_person);
	});

	it("should test speedDialSaver 1", function () {
		largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("K"); //set it to K and save
		var speedDialSaver = new SpeedDialSaver(largePerson);
		largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("S"); //set it to S and restore
		speedDialSaver.restoreSpeedDials(largePerson);
		Test.requireIdentical("K", largePerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for K
	});

	it("should test speedDialSaver 2", function () {
		largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("K");
		largePerson.getPhoneNumbers().getArray()[1].setSpeedDial("L"); //set them to K and L and save
		var speedDialSaver = new SpeedDialSaver(largePerson);
		largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("S");
		largePerson.getPhoneNumbers().getArray()[1].setSpeedDial("T");
		largePerson.getPhoneNumbers().getArray()[2].setSpeedDial("U"); //set them to S/T/U and restore
		speedDialSaver.restoreSpeedDials(largePerson);
		Test.requireIdentical("K", largePerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for K
		Test.requireIdentical("L", largePerson.getPhoneNumbers().getArray()[1].getSpeedDial()); //check for L
		Test.requireIdentical("U", largePerson.getPhoneNumbers().getArray()[2].getSpeedDial()); //check for U
	});

	it("should test speedDialSaver 3", function () {
		largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("K");
		mediumPerson.getPhoneNumbers().getArray()[0].setSpeedDial("L");
		var speedDialSaver = new SpeedDialSaver([largePerson, mediumPerson]);
		largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("S");
		largePerson.getPhoneNumbers().getArray()[1].setSpeedDial("T");
		largePerson.getPhoneNumbers().getArray()[2].setSpeedDial("U");
		mediumPerson.getPhoneNumbers().getArray()[0].setSpeedDial("V");
		speedDialSaver.restoreSpeedDials(largePerson);
		speedDialSaver.restoreSpeedDials(mediumPerson);
		Test.requireIdentical("L", largePerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for L
		Test.requireIdentical("T", largePerson.getPhoneNumbers().getArray()[1].getSpeedDial()); //check for T
		Test.requireIdentical("U", largePerson.getPhoneNumbers().getArray()[2].getSpeedDial()); //check for U
		Test.requireIdentical("L", mediumPerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for L
	});
});
