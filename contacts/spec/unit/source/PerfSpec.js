// LICENSE@@@
//
//      Copyright (c) 2009-2013 LG Electronics, Inc.
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
/*global describe, expect, it, include, MojoTest, console, PerfLogger, palmGetResource, Contact, require */

var webos = require('webos');

webos.include("test/PerfLogger.js");
var fs = require('fs');

describe("Perf Tests", function () {
	var perfLogger = new PerfLogger(),
		cd = JSON.parse(fs.readFileSync("test/contactdata.json", 'utf8'));

	it("should test Contact", function () {

		var c = null;

		perfLogger.milestone("Create large Contact");
		c = new Contact(cd.large_contact);
		perfLogger.milestone();

		perfLogger.milestone("Create normal Contact");
		c = new Contact(cd.normal_contact);
		perfLogger.milestone();

		perfLogger.milestone("Create small Contact");
		c = new Contact(cd.small_contact);
		perfLogger.milestone();

		perfLogger.milestone("Create empty Contact");
		c = new Contact();
		perfLogger.milestone();

		perfLogger.printPairs();

		expect(true).toBeTruthy();
	});
});
