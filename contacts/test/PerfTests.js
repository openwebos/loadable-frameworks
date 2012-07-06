/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, include, MojoTest, console, PerfLogger, Contact, require */

var webos = IMPORTS.require('webos');
webos.include("test/loadall.js");
webos.include("test/PerfLogger.js");
var fs = require('fs');

function PerfTests() {
	this.perfLogger = new PerfLogger();
	this.cd = JSON.parse(fs.readFileSync("test/contactdata.json", 'utf8'));
}


PerfTests.prototype.testContact = function () {
	
	var c = null;
	
	this.perfLogger.milestone("Create large Contact");
	c = new Contact(this.cd.large_contact);
	this.perfLogger.milestone();
	
	this.perfLogger.milestone("Create normal Contact");
	c = new Contact(this.cd.normal_contact);
	this.perfLogger.milestone();

	this.perfLogger.milestone("Create small Contact");
	c = new Contact(this.cd.small_contact);
	this.perfLogger.milestone();
	
	this.perfLogger.milestone("Create empty Contact");
	c = new Contact();
	this.perfLogger.milestone();
	
	this.perfLogger.printPairs();
	
	return MojoTest.passed;
};
