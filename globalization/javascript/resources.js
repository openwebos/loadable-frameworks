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

/*jslint evil: true, forin: true */
/*$
 * @name resources.js
 * @fileOverview This file has conventions related to resources.
*/

/*globals Globalization */

Globalization.ResourceBundleFactory = Foundations.Class.create({
	initialize: function(root) {
		if ( !root ) {
			this.root = MojoLoader.root;
		} else {
			this.root = root;
		}
		
		this._cache = {};
	},
	
	getResourceBundle: function(locale) {
		if ( !locale ) {
			locale = Globalization.Locale.getCurrentLocale();	// locale is required
		}
		var rb = this._cache[locale];
		if ( rb === undefined ) {
			rb = new Globalization.ResourceBundle(locale, this.root);
			this._cache[locale] = rb;
		}
		return rb;
	}
});

Globalization.ResourceBundle = Foundations.Class.create({
	initialize: function(localeString, root) {
		var defaultLocale = Globalization.Locale.getCurrentLocale();
		var parsedDefaultLocale = Globalization.Locale.parseLocaleString(defaultLocale);
		this.root = root;
		if (root.charAt(root.length - 1) != '/') {
			this.resourcePath = root + "/resources";
		} else {
			this.resourcePath = root + "resources";
		}
		this.locale = Globalization.Locale.parseLocaleString(localeString);
		
		this.localizedResourcePath = this.resourcePath + "/" + localeString;
		this.templatePath = this.localizedResourcePath + "/views/";

		if ( this.locale.language ) {
			this.languageResourcePath = this.resourcePath + "/" + this.locale.language;
		} else {
			this.languageResourcePath = this.resourcePath + "/" + parsedDefaultLocale.language;
		}
		this.languageTemplatePath = this.languageResourcePath + "/views/";
	
		if ( this.locale.region ) {
			this.regionResourcePath = this.languageResourcePath + "/" + this.locale.region;
		} else {
			this.regionResourcePath = this.languageResourcePath + "/" + parsedDefaultLocale.region;
		}
		this.regionTemplatePath = this.regionResourcePath + "/views/";
		
		if ( this.locale.carrier ) {
			this.carrierResourcePath = this.regionResourcePath + "/" + this.locale.carrier;
			this.carrierTemplatePath = this.carrierResourcePath + "/views/";
		}
		
		this.strings = Globalization.Locale._doReadTable("strings.json", this.locale, this.resourcePath);
	},
	
	getLocalizedResource: function(path) {
		var file = undefined;
		if ( path.charAt(0) != '/' ) {
			path = '/' + path;
		}
		
		// console.log("getLocalizedResource: path is " + path);
		
		if ( this.carrierResourcePath ) {
			try {
				file = Foundations.Comms.loadFile(this.carrierResourcePath + path);
			} catch (e) {
				file = undefined;
			}
		}
		if ( !file ) {
			try {
				file = Foundations.Comms.loadFile(this.regionResourcePath + path);
			} catch (e) {
				file = undefined;
			}
		}
		if ( !file ) {
			try {
				file = Foundations.Comms.loadFile(this.languageResourcePath + path);
			} catch (f) {
				file = undefined;
			}
		}
		if ( !file ) {
			try {
				file = Foundations.Comms.loadFile(this.localizedResourcePath + path);
			} catch (g) {
				file = undefined;
			}
		}	
		if ( !file ) {
			try {
				// try defaulting to en_us
				file = Foundations.Comms.loadFile(this.resourcePath + "/en" + path);
			} catch (h) {
				file = undefined;
			}
		}	
		if ( !file ) {
			try {
				// still not there? try the unlocalized version
				file = Foundations.Comms.loadFile(this.root + path);
			} catch (i) {
				// if it is still not there after all this, give up and return undefined
				file = undefined;
			}
		}
		
		return file;
	},
	
	$L: function(stringToLocalize) {
		var key;
		var value;

		if (typeof stringToLocalize === 'string') {
			key = stringToLocalize;
			value = stringToLocalize;
		} else {
			key = stringToLocalize.key;
			value = stringToLocalize.value;
		}

		return (this.strings && this.strings[key]) || value;
	}
});


/*$
 * Use for the globalization loadable framework's own string resources.
 **/
Globalization.bundleFactory = new Globalization.ResourceBundleFactory(Globalization.Config.G10N_HOME);

Globalization.Locale._doReadTable = function(fileName, locale, pathToResourcesDir) {
	var table = Globalization.Locale._readMergingStringTables(fileName, pathToResourcesDir, locale);
	if (!table && locale.locale) {
		table = Globalization.Locale._stringTableLoader(fileName, locale.locale, pathToResourcesDir);
	}
	return table || {};
};

/*$ @private
 *	Loads the specified string table file in unlocalized, by language, and by 
 *	region versions and merges them into a single table with duplicate entries 
 *	being overlaid, region taking precedence over language and language taking 
 *	precedence over unlocalized.
 *
 *	@param {String} fileName - The name of the string table file
 *	@param {String} pathToResourcesDir - Base directory to look for 'fileName' in
 *	@param {String} language - The language to overlay on unlocalized strings
 *	@param {String} region - The region to overlay on language and unlocalized strings
 */
Globalization.Locale._readMergingStringTables = function(fileName, pathToResourcesDir, locale){
	var unlocalizedStrings, languageStrings = {}, regionStrings = {}, carrierStrings = {};
	
	unlocalizedStrings = Globalization.Locale._stringTableLoader(fileName, '', pathToResourcesDir);
	if (locale.language) {
		languageStrings = Globalization.Locale._stringTableLoader(fileName, locale.language, pathToResourcesDir);
		if (locale.region) {
			regionStrings = Globalization.Locale._stringTableLoader(fileName, locale.language + '/' + locale.region, pathToResourcesDir);
			if (locale.carrier) {
				carrierStrings = Globalization.Locale._stringTableLoader(fileName, locale.language + '/' + locale.region + '/' + locale.carrier, pathToResourcesDir);
			}
		}
	}
	
	return Globalization.Locale.mergeObjectStringTables([unlocalizedStrings, languageStrings, regionStrings, carrierStrings]);
};

/*$ @private */
Globalization.Locale._stringTableLoader = function(fileName, locale, pathToStringTable) {
	var stringTable;
	var stringsAsJson;
	var temp;
	var nativeJsonFailed = true;
	
	if (locale) {
		pathToStringTable += "/" + locale;
	}
	fileName = fileName || "strings.json";

	pathToStringTable += "/" + fileName;

	// console.info('_stringTableLoader: loading resources from ' + pathToStringTable);

	try {
		stringsAsJson = Foundations.Comms.loadFile(pathToStringTable);
	} catch (e) {
		// console.log(e);
		return {};
	}

	if (stringsAsJson) {
		try {
			stringTable = JSON.parse(stringsAsJson);
			nativeJsonFailed = false;
		} catch (e2) {
		}
		if (nativeJsonFailed) {
			// What are we doing here?
			// 1. Replacing all property access syntax with a placeholder ('#')
			// 2. Removing all property names and string values (simplifies step 3)
			// 3. Testing that the remaining characters are valid JSON tokens
			// Hardly an exhaustive validator, but it does more sharply limit 
			// what we will just blindly eval() here.
			temp = stringsAsJson.replace(/\\./g, '#').replace(/"[^"\\\n\r]*"/g, '');
			if ((/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(temp)) {
				stringTable = eval('(' + stringsAsJson + ')');
			}
		}
	}
	return stringTable;
};

/*$ @private
 *	Merges an array of object-based string "tables" into a single object, with
 *	duplicate entries overlaid from higher precedence tables.
 *
 *	@param {Array} tables - An array of objects whose properties represent entries
 *                          in a string table, sorted in order of precedence from
 *                          lowest to highest.
 */
Globalization.Locale.mergeObjectStringTables = function(tables) {
	var mergedTable = tables.shift() || {};
	var i;
	var property;
	for (i = 0; i < tables.length; ++i) {
		for (property in tables[i]) {
			mergedTable[property] = tables[i][property];
		}
	}
	return mergedTable;
};

