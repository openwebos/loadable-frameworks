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

/*jslint debug: true, white: true, onevar: true, undef: true, eqeqeq: true, bitwise: true,
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */

/*global console, Globalization: true */

console.log("Loading g11n mock");

Globalization.Locale._getRootPath = function ()
{
	var rootPath = "";
	// console.log("G10N_HOME: " + Globalization.Config.G10N_HOME);
	// if ( Globalization.Config.G10N_HOME.charAt(0) !== '/' ) {
	//	rootPath = '/usr/palm/frameworks/';
	// }

	rootPath += Globalization.Config.G10N_HOME;

	return rootPath;
};
