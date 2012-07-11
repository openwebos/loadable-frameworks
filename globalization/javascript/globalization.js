// @@@LICENSE
//
//      Copyright (c) 2010-2012 Hewlett-Packard Development Company, L.P.
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
// LICENSE@@@

// ********************* IMPORTANT ********************** //
// This file is reserved for framework-wide functionality,
// not including any framework loading logic.
// ******************************************************* //

/*jslint evil: true */
/*globals MojoLoader exports */

/** section: Globalization
 * Globalization
 * The root namespace that contains all of the Globalization APIs.
 **/
var Globalization = {};

exports.Globalization = Globalization;

Globalization.Config = {
	// WebKit may someday be whitelisting paths to be accessible by getResource().
	G10N_HOME: MojoLoader.root,
	G10N_FRAMEWORK_HOME: MojoLoader.root,

	TEMPLATES_HOME: this.G10N_HOME + '/templates',
	CSS_HOME: this.G10N_HOME + '/stylesheets',
	JS_HOME: this.G10N_HOME + '/javascripts',
	FORMATS_HOME: MojoLoader.root + '/formats',

	debuggingEnabled: false,
	initialized: false
};
	
/** section: Globalization.Locale
 * Locale
 * The root namespace that contains all of the localization framework APIs related to locales.
 **/
Globalization.Locale = {};

/** section: Globalization.Format
 * Format
 * The root namespace that contains all of the localization framework APIs related to formatting 
 * objects for display or export.
 **/
Globalization.Format = {};

/** section: Globalization.Phone
 * Phone
 * The root namespace that contains all of the localization framework APIs related to phone numbers.
 **/
Globalization.Phone = {};

/** section: Globalization.Address
 * Address
 * The root namespace that contains all of the localization framework APIs related to addresses.
 **/
Globalization.Address = {};

var Foundations, EnvironmentUtils, _;

(function() {
	var libs;
	libs = MojoLoader.require(
		{ name: "foundations", version: "1.0" },
		{ name: "underscore", version: "1.0" }
	);

	Foundations = libs.foundations;
	EnvironmentUtils = Foundations.EnvironmentUtils;
	_ = libs.underscore._;
})();
