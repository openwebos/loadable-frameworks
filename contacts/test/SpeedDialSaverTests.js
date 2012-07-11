/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, include, MojoTest, SpeedDialSaver, console, PersonFactory, Test, PersonType, require */

var webos = IMPORTS.require('webos');
webos.include("test/loadall.js");
var fs = require('fs');

function SpeedDialSaverTests() {
	this.pd = JSON.parse(fs.readFileSync("test/persondata.json", 'utf8'));
}

SpeedDialSaverTests.prototype.before = function (done) {
	this.largePerson = PersonFactory.createPersonDisplay(this.pd.large_person);
	this.mediumPerson = PersonFactory.createPersonLinkable(this.pd.medium_person);
	done();
};

SpeedDialSaverTests.prototype.testSpeedDialSaver1 = function () {
	this.largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("K"); //set it to K and save
	var speedDialSaver = new SpeedDialSaver(this.largePerson);
	this.largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("S"); //set it to S and restore
	speedDialSaver.restoreSpeedDials(this.largePerson);
	Test.requireIdentical("K", this.largePerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for K
	
	return MojoTest.passed;
};

SpeedDialSaverTests.prototype.testSpeedDialSaver2 = function () {
	this.largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("K");
	this.largePerson.getPhoneNumbers().getArray()[1].setSpeedDial("L"); //set them to K and L and save
	var speedDialSaver = new SpeedDialSaver(this.largePerson);
	this.largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("S");
	this.largePerson.getPhoneNumbers().getArray()[1].setSpeedDial("T");
	this.largePerson.getPhoneNumbers().getArray()[2].setSpeedDial("U"); //set them to S/T/U and restore
	speedDialSaver.restoreSpeedDials(this.largePerson);
	Test.requireIdentical("K", this.largePerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for K
	Test.requireIdentical("L", this.largePerson.getPhoneNumbers().getArray()[1].getSpeedDial()); //check for L
	Test.requireIdentical("U", this.largePerson.getPhoneNumbers().getArray()[2].getSpeedDial()); //check for U
	
	return MojoTest.passed;
};

SpeedDialSaverTests.prototype.testSpeedDialSaver3 = function () {
	this.largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("K");
	this.mediumPerson.getPhoneNumbers().getArray()[0].setSpeedDial("L");
	var speedDialSaver = new SpeedDialSaver([this.largePerson, this.mediumPerson]);
	this.largePerson.getPhoneNumbers().getArray()[0].setSpeedDial("S");
	this.largePerson.getPhoneNumbers().getArray()[1].setSpeedDial("T");
	this.largePerson.getPhoneNumbers().getArray()[2].setSpeedDial("U");
	this.mediumPerson.getPhoneNumbers().getArray()[0].setSpeedDial("V");
	speedDialSaver.restoreSpeedDials(this.largePerson);
	speedDialSaver.restoreSpeedDials(this.mediumPerson);
	Test.requireIdentical("L", this.largePerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for L
	Test.requireIdentical("T", this.largePerson.getPhoneNumbers().getArray()[1].getSpeedDial()); //check for T
	Test.requireIdentical("U", this.largePerson.getPhoneNumbers().getArray()[2].getSpeedDial()); //check for U
	Test.requireIdentical("L", this.mediumPerson.getPhoneNumbers().getArray()[0].getSpeedDial()); //check for L
	
	return MojoTest.passed;
};

