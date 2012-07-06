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

/*$
 * @name locale.js
 * @fileOverview This file has conventions related to localization.
 * 
 *
 */

/*globals _ console Globalization Assert Mojo Foundations EnvironmentUtils */


/*$
 * private
 */
Globalization.Locale._initLocale = function() {
	var loc;
	if ( EnvironmentUtils ) {
		if ( EnvironmentUtils.isBrowser() ) {
			// we are running in the context of an application
			// console.warn("Globalization.Locale._initLocale: using locale of " + PalmSystem.locale + " and region " + PalmSystem.localeRegion);
			loc = this.parseLocaleString(PalmSystem.locale);
			this.language = loc.language;
			this.region = loc.region;
			this.formatRegion = PalmSystem.localeRegion;
			// console.log("phoneRegion is " + PalmSystem.phoneRegion);
			this.phoneRegion = PalmSystem.phoneRegion || this.formatRegion;
		} else if ( EnvironmentUtils.isTriton() || EnvironmentUtils.isNode() ) {
			// we are running in the context of a service
			var MojoService = MojoLoader.require({"name":"mojoservice", "version":"1.0"}).mojoservice;
			if ( MojoService.locale === undefined || MojoService.region === undefined ) {
				console.warn('Globalization.Locale._initLocale: MojoService returned no locale. Defaulting to en_us. Do you have the "globalized":true flag set in your services.json?');
			} else {
				loc = this.parseLocaleString(MojoService.locale);
				this.language = loc.language;
				this.region = loc.region;
				this.formatRegion = MojoService.region;
				this.phoneRegion = MojoService.phoneRegion || MojoService.region;
			}
			// console.warn("Globalization.Locale._initLocale: using service locale of " + loc + " and format region " + this.formatRegion);
		}
	//} else {
		//console.warn("Globalization.Locale._initLocale: EnvironmentUtils is undefined");
	}

	if ( this.language === undefined || this.formatRegion === undefined ) {
		// we don't know where we're running, so just use US English as the default -- should not happen
		console.warn("Globalization.Locale._initLocale: could not find current locale, so using default of en_us.");
		this.language = 'en';
		this.region = this.formatRegion = this.phoneRegion = 'us';
	}
	
	this.current = this.language + "_" + this.region;
	
	console.log("Globalization.Locale._initLocale: Initialization done. Locale is now " + this.current + " formats region is now " + this.formatRegion +
			" and phone region is " + this.phoneRegion);
	this.bundleFactory = new Globalization.ResourceBundleFactory(MojoLoader.root);
};

/**
 * Globalization.Locale.getCurrentLocale() -> String
 *
 * Return the globalization framework's idea of the current locale. This names
 * the language and the region for strings in the system. If you are
 * using the globalization framework from within a mojo service, you will need
 * to make sure that you put the "globalized":true flag set in your services.json
 * 
 * Returns a string naming the locale.
 **/
Globalization.Locale.getCurrentLocale = function() {
	if ( Globalization.Locale.current === undefined ) {
		this._initLocale();
	}
	
	return Globalization.Locale.current;
};

/**
 * Globalization.Locale.getCurrentLanguage() -> String
 *
 * Return the globalization framework's idea of the current language. This is 
 * the language part only of the locale. If you are
 * using the globalization framework from within a mojo service, you will need
 * to make sure that you put the "globalized":true flag set in your services.json
 * 
 * Returns a string naming the language.
 **/
Globalization.Locale.getCurrentLanguage = function() {
	if ( Globalization.Locale.language === undefined ) {
		this._initLocale();
	}
	
	return Globalization.Locale.language;
};

/**
 * Globalization.Locale.getCurrentFormatsRegion() -> String
 *
 * Return the globalization framework's idea of the current formats region. This
 * region is different than the region for the locale. This one controls formatting,
 * whereas the region for the locale only controls the dialect of the language used
 * in the strings. If you are
 * using the globalization framework from within a mojo service, you will need
 * to make sure that you put the "globalized":true flag set in your services.json
 * 
 * Returns a string naming the region.
 **/
Globalization.Locale.getCurrentFormatsRegion = function() {
	if ( Globalization.Locale.formatRegion === undefined ) {
		this._initLocale();
	}
	
	return Globalization.Locale.formatRegion;
};

/**
 * Globalization.Locale.getCurrentPhoneRegion() -> String
 *
 * Return the globalization framework's idea of the current region to be used for
 * parsing and formatting phone numbers. If a phone number has no explicit country 
 * code, the rules for this region are the ones that are used for parsing and
 * formatting. If a number does have an explicit country code, then the rules of
 * that country are used. 
 * 
 * If you are
 * using the globalization framework from within a Triton service, you will need
 * to make sure that the Triton start-up code sets the locale object by not
 * opting out of it in your start-up.
 * 
 * Returns a string naming the region.
 **/
Globalization.Locale.getCurrentPhoneRegion = function() {
	if ( Globalization.Locale.phoneRegion === undefined ) {
		this._initLocale();
	}
	
	return Globalization.Locale.phoneRegion;
};

/**
 * Globalization.Locale.setCurrentLocale(locale) -> void
 * - locale (String): a string naming the locale to set. This is a required parameter
 *
 * Set the globalization framework's idea of the current locale. The
 * locale is specified by a string with the following form:
 * 
 * 2 letter ISO 639 language code + "_" + 2 letter ISO 3166 country code
 * 
 * Because webOS uses lower-casing in all of its file system paths and
 * because the locale is sometimes used as a part of the path name, the
 * country code is lower-cased automatically even though ISO 3166 specifies
 * that the code should be upper-case to easily distinguish it from the 
 * language codes.
 * 
 * If the locale is not specified correctly or is missing, nothing happens.
 **/
Globalization.Locale.setCurrentLocale = function(locale) {
	var parsed;
	
	if ( !locale || locale.length < 1 ) {
		return;
	}
	
	locale = locale.toLocaleLowerCase();
	parsed = this.parseLocaleString(locale);
	
	if ( parsed && parsed.language && parsed.region ) {
		Globalization.Locale.current = locale;
		Globalization.Locale.language = parsed.language;
		Globalization.Locale.region = parsed.region;
	}
	this.bundleFactory = new Globalization.ResourceBundleFactory(MojoLoader.root);
};

/**
 * Globalization.Locale.setCurrentFormatRegion(region) -> void
 * - region (String): a string naming the region to set. This is a required parameter
 *
 * Set the globalization framework's idea of the current format region. The
 * region is specified by a string with the following form:
 * 
 * 2 letter ISO 3166 country code
 * 
 * Because webOS uses lower-casing in all of its file system paths and
 * because the locale is sometimes used as a part of the path name, the
 * country code is lower-cased automatically even though ISO 3166 specifies
 * that the code should be upper-case to easily distinguish it from the 
 * language codes.
 * 
 * If the region is not specified correctly or is missing, nothing happens.
 **/
Globalization.Locale.setCurrentFormatRegion = function(region) {
	var parsed;
	
	if ( !region || region.length < 2 ) {
		return;
	}
	
	Globalization.Locale.formatRegion = region.toLocaleLowerCase();
	if (!Globalization.Locale.phoneRegion) {
		Globalization.Locale.phoneRegion = Globalization.Locale.formatRegion;
	}
};

/*$
 * This method loads and merges the localized string tables present in the 
 * application's or framework's resource locale hierarchy and returns the parsed results.
 *
 * @param {String} fileName - name of JSON file. defaults to "strings.json" if falsy.
 * @param {String} locale - name of locale. (required)
 * @param {String} pathToResourcesDir - defaults to the framework's resources directory.
 */
Globalization.Locale.readStringTable = function(fileName, locale, pathToResourcesDir) {
	var loc = this.parseLocaleString(locale);
	return Globalization.Locale._doReadTable(fileName, loc, pathToResourcesDir);
};

/**
 * Globalization.Locale.getAlphabeticIndexChars() -> Array
 * - locale (String): the locale for which the alphabetic index chars are being sought.
 * This is a required parameter
 *
 * Return an array of strings containing all of the alphabetic characters that are
 * used as index characters for the current locale. The characters are 
 * returned in the order they should appear in the index. An index character 
 * is a character under which multiple items in a list can be categorized. In
 * most languages, accented versions of a character are considered a 
 * variant of the base character, so list items are grouped together under
 * the same base character. In other locales, accented characters are
 * considered separate characters than the base without the accent, and
 * list items starting with the accented character should be grouped under
 * a separate header. The symbol "#" is appended to the end of the list
 * as the placeholder character representing all strings that do not
 * start with any of the alphabetic index chars.
 * 
 * Returns an array of strings containing all the index characters in order
 *
 */
Globalization.Locale.getAlphabeticIndexChars = function(locale) {
	var indexchars, rb;
	var i, arr = [];
	
	if ( !locale ) {
		locale = Globalization.Locale.getCurrentLocale();  // can't do anything without the locale
	}
	
	rb = Globalization.bundleFactory.getResourceBundle(locale);
	
	indexchars = rb.$L({key: "indexChars", value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#"});
	
	for ( i = 0; i < indexchars.length; i++ ) {
		arr.push(indexchars[i]);
	}
	
	return arr;
};

/*$
 * private
 */
Globalization.Locale._stringTransform = function(str, table) {
	var retString = "";
	var c;
	
	for ( var i = 0; i < str.length; i++ ) {
		c = table[str.charAt(i)];
		retString += (c || str.charAt(i));
	}
	
	return retString;
};

Globalization.Locale._getRootPath = function()
{
	var rootPath = "";
	
	if ( Globalization.Config.G10N_HOME.charAt(0) !== '/' ) {
		rootPath = '/usr/palm/frameworks/';
	}
	
	rootPath += Globalization.Config.G10N_HOME;
	
	return rootPath;
};

Globalization.Locale._getFormatsPath = function()
{
	return Globalization.Locale._getRootPath() + "formats/";
};

Globalization.Locale._getLangInfoPath = function()
{
	return Globalization.Locale._getRootPath() + "langinfo/";
};

Globalization.Locale._getLangInfoFileName = function (language)
{
	return Globalization.Locale._getLangInfoPath() + language + ".json";
}

Globalization.Locale._getFormatsFileName = function (region)
{
	return Globalization.Locale._getFormatsPath() + region + ".json";
};

/*$
 * private
 */
Globalization.Locale._loadLanguageInfo = function(language) {
	var json;
	
	try {
		json = Utils.getJsonFile(Globalization.Locale._getLangInfoFileName(language), language);
	} catch (e3) {
		console.log("Globalization.Locale._loadLanguageInfo: could not load " + Globalization.Locale._getLangInfoFileName(language) + " exception " + e3);
	}

	return json || {};
};

/*$
 * private
 */
Globalization.Locale._loadFormatsInfo = function(region) {
	var json;
	
	try {
		json = Utils.getJsonFile(Globalization.Locale._getFormatsFileName(region), region);
	} catch (e3) {
		console.log("Globalization.Locale._loadFormatsInfo: could not load " + Globalization.Locale._getFormatsFileName(region) + " exception " + e3);
	}

	return json || {};
};

/**
 * Preloads the data for the given locale into the cache so that subsequent
 * accesses to it are fast. If the locale is not given, then the data for 
 * the current device locale is loaded, which is never expired from the 
 * cache, which makes it quick for all apps to load.
 **/
Globalization.Locale.preLoadLocaleData = function (locale) {
	var language, region, loc;
	if ( locale ) {
		loc = this.parseLocaleString(locale);
		language = loc.language;
		region = loc.formatRegion;
	} else {
		language = Globalization.Locale.getCurrentLanguage();
		region = Globalization.Locale.setCurrentFormatRegion();
	}
		
	Globalization.Locale._loadLanguageInfo(language);
	Globalization.Locale._loadFormatsInfo(region);
	Globalization.Phone._preLoadLocaleData(region);
};

/**
 * Globalization.Locale.toUpperCase(str, locale) -> String
 * 
 * See description of [[Globalization.Character.toUpperCase]] for details.
 **/
Globalization.Locale.toUpperCase = function(str, locale) {
	return Globalization.Character.toUpperCase(str, locale);
};

/**
 * Globalization.Locale.getBaseString(str, locale) -> String
 * - str (String): string to be de-accented
 * - locale (String): the string is de-accented using the rules of the given 
 * locale. If the locale is not specified, this function uses the current locale
 *
 * Converts every character in a string to its corresponding base character
 * according to the rules of the given locale. If the locale is not given, 
 * the current locale is used. The base character is defined to be
 * a version of the same character in the list of alphabetic index chars
 * as returned by [[getAlphabeticIndexChars]] that usually does not have
 * any accents or diacriticals unless the language considers the character
 * with the accent to be a distinct character from the unaccented version.  
 *  
 * Returns a string containing the same content as the original parameter, but with
 * all characters replaced with their base characters
 **/
Globalization.Locale.getBaseString = function(str, locale) {
	if ( !str ) {
		return undefined;
	}

	if ( !locale ) {
		locale = Globalization.Locale.getCurrentLocale();	// can't do anything without the locale
	}

	var loc = this.parseLocaleString(locale);
	
	var langinfo = Globalization.Locale._loadLanguageInfo(loc.language);
	
	if ( !langinfo || this._objectIsEmpty(langinfo) ) {
		// default to the English behaviour
		langinfo = Globalization.Locale._loadLanguageInfo('en');
	}
	
	if ( langinfo && langinfo.baseChars !== undefined ) {
		return Globalization.Locale._stringTransform(str, langinfo.baseChars);
	}
	
	Utils.releaseAllJsonFiles(Globalization.Locale.language);
	
	return str;
};

/**
 * Globalization.Locale.parseLocaleString(locale) -> Object
 * - locale (String): locale string to parse 
 *
 * This function deconstructs the parts of a string that names a locale
 * and returns them. If any part is not present, that property will not
 * exist in the returned object. 
 * 
 * Locale strings are in one of the following forms:
 * 
 * language
 * language_region
 * language_region_carrier
 * 
 * Returns a javascript object containing the same the parts of the locale
 * string.
 **/
Globalization.Locale.parseLocaleString = function(locale) {
	var ret = {};
	if ( locale && locale.length > 0 ) {
		ret.language = locale.slice(0, 2);
		ret.locale = ret.language;
	} else {
		return ret;
	}
	
	if ( locale.length >= 5 ) {
		ret.region = locale.slice(3, 5);
		ret.locale = ret.locale + "_" + ret.region;
	}

	if ( locale.length >= 7 ) {
		ret.carrier = locale.substring(6);
		ret.locale = ret.locale + "_" + ret.carrier;
	}
	
	return ret;
};

/*$ @private
 *	Merges two sorted arrays, with order-equivalent values in 'overlay' replacing
 *	those in 'base' in the merged array.  Returns the merged array.
 *
 *	@param {Array} base - A sorted array of values
 *	@param {Array} overlay - A sorted array of values to be merged with 'base'
 *	@param {Function} compare - A function for comparing values in the arrays
 *                              with the form taken by Array.sort().
 */
Globalization.Locale.mergeArrays = function(base, overlay, compare) {
	Assert.requireFunction(compare, "Globalization.Locale.mergeArrays requires a valid compare function");
	
	// Short circuits
	if (!base) {
		return overlay || [];
	}
	if (!overlay) {
		return base || [];
	}
	if (!base.length) {
		return overlay;
	}
	if (!overlay.length) {
		return base;
	}

	var result = [];
	var bi = 0;
	var oi = 0;
	var diff;

	while (bi < base.length && oi < overlay.length) {
		diff = compare(base[bi], overlay[oi]);
		if (diff < 0) {
			result.push(base[bi]);
			++bi;
		} else if (diff > 0) {
			result.push(overlay[oi]);
			++oi;
		} else {
			result.push(overlay[oi]);
			++bi;
			++oi;
		}
	}

	// Push any remaining elements in base
	for (;bi < base.length; ++bi) {
		result.push(base[bi]);
	}
	// Push any remaining elements in overlay
	for (;oi < overlay.length; ++oi) {
		result.push(overlay[oi]);
	}

	return result;
};

/*$ @private
 *	Merges an array of array-based string "tables" into a single array, with
 *	duplicate entries overlaid from higher precedence tables.
 *
 *	@param {Function} compareFunc - A function for comparing values in the arrays,
 *                                  with the form taken by Array.sort().
 *	@param {Array} tables - An array of arrays whose values represent entries in
 *                          a string table, sorted in order of precedence from
 *                          lowest to highest.  If a value in 'tables' is a
 *                          non-array object, it will be skipped.
 */
Globalization.Locale.mergeArrayStringTables = function(compareFunc, tables) {
	var i, t;
	var mergedTable = tables.shift() || [];
	
	for(i = 0; i < tables.length; i++) {
		t = tables[i];
		if (_.isArray(t)) {
			t.sort(compareFunc);
			mergedTable = Globalization.Locale.mergeArrays(mergedTable, t, compareFunc);
		}
	}

	return mergedTable;
};

/*$ private */
Globalization.Locale._objectIsEmpty = function(object) {
	var property;
	for (property in object) {
		if (true) {			// To make JSLint happy
			return false;
		}
	}
	return true;
};

/**
 * Globalization.Locale.searchAccentInsensitive(regexString, str) -> Object
 * - query (String): fixed string to search for
 * - str (String): string to search within
 *
 * Searches the given string with the given regular expression and 
 * returns an array of matches. The characters in the query
 * are matched case- and accent-insensitively. The array of matches have 
 * elements that are of the form:
 * 
 * {
 *     start: X,
 *     end: Y
 * }
 * 
 * Where X is a number indicating the starting index in the original string
 * of the match, and Y is the last character of the current match+1.
 *
 * Returns an array of matches.
 **/
Globalization.Locale.searchAccentInsensitive = function(query, str) {
	var q = 0, s = 0, qchar, schar, deaccentedq, deaccenteds, start = -1, matches = [];
	
	if ( !query || !str ) {
		return undefined;
	}
	
	//console.log("Globalization.Locale.searchAccentInsensitive: searching " + str + " for " + query);
	
	while ( s < str.length ) {
		qchar = query.charAt(q);
		deaccentedq = Globalization.Character.toUpperCase(Globalization.Locale.getBaseString(qchar));
		
		schar = str.charAt(s);
		deaccenteds = Globalization.Character.toUpperCase(Globalization.Locale.getBaseString(schar));
	
		//console.log("Globalization.Locale.searchAccentInsensitive: qchar is " + qchar + "->" + deaccentedq + " and schar is " + schar + "->" + deaccenteds);
		
		if ( Globalization.Character.toUpperCase(query.slice(q,q+deaccenteds.length)) === deaccenteds ) {
			if ( start < 0 ) {
				start = s;
			}
			q += deaccenteds.length;
			s += schar.length;
		} else if ( Globalization.Character.toUpperCase(str.slice(s,s+deaccentedq.length)) === deaccentedq ) {
			if ( start < 0 ) {
				start = s;
			}
			q += qchar.length;
			s += deaccentedq.length;
		} else if ( deaccenteds === deaccentedq ) {
			if ( start < 0 ) {
				start = s;
			}
			s += deaccenteds.length;
			q += deaccentedq.length;
		} else {
			q = 0;
			start = -1;
			s += schar.length;
		}
		
		if ( start > -1 && q >= query.length ) {
			//console.log("Globalization.Locale.searchAccentInsensitive: match found: " + str.slice(start,s));
			matches.push({start: start, end: s});
			start = -1;
			q = 0;
		}
	}
	
	return matches;
}
