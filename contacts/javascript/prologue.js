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
/*global MojoLoader, exports, require:true*/

/**
 * @namespace exports
 */

var IMPORTS = MojoLoader.require({
	name: "foundations",
	version: "1.0"
},
{
	name: "underscore",
	version: "1.0"
},
{
	name: "foundations.crypto",
	version: "1.0"
},
{
	name: "foundations.io",
	version: "1.0"
},
{
	name: "globalization",
	version: "1.0"
});

var Crypto = IMPORTS["foundations.crypto"];
var Foundations = IMPORTS.foundations;
var Globalization = IMPORTS.globalization.Globalization;
exports.Globalization = Globalization;
var _ = IMPORTS.underscore._;

var Assert = Foundations.Assert;
var Class = Foundations.Class;
var DB = Foundations.Data.DB;
var TempDB = Foundations.Data.TempDB;
var Future = Foundations.Control.Future;
var ObjectUtils = Foundations.ObjectUtils;
var PalmCall = Foundations.Comms.PalmCall;
var StringUtils = Foundations.StringUtils;

var LIB_ROOT = MojoLoader.root;

var resourceBundleFactory = new Globalization.ResourceBundleFactory(MojoLoader.root);
var RB = resourceBundleFactory.getResourceBundle();

var RECORD_TIMINGS_FOR_SPEED = false;

// check to see if NOV-108635 is fixed yet
if (typeof require === 'undefined') {
    require = IMPORTS.require;
}
