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

/*globals Globalization Foundations palmGetResource console */

Globalization.Name = {
	shortName: 'short',
	mediumName: 'medium',
	longName: 'long'
};

/*$ private 
 * Return the auxillary words found at the beginning of the name string 
 * as an array.
 **/
Globalization.Name._findPrefix = function(parts, hash, isAsian)
{
	var prefix, prefixLower, prefixArray, aux = [], i, j;
	
	if (parts.length > 0 && hash) {
		//console.info("_findPrefix: finding prefixes");
		for ( i = parts.length; i > 0; i-- ) {
			prefixArray = parts.slice(0, i);
			prefix = prefixArray.join(isAsian ? '' : ' ');
			prefixLower = prefix.toLowerCase();
			prefixLower = prefixLower.replace(/[,\.]/g, '');  // ignore commas and periods
			
			//console.info("_findPrefix: checking prefix: '" + prefixLower + "'");
			
			if ( prefixLower in hash ) {
				aux = aux.concat(isAsian ? prefix : prefixArray);
				parts = parts.slice(i);
				i = parts.length + 1;
				//console.info("_findPrefix: Found prefix '" + prefix + "' New parts list is " + JSON.stringify(parts));
			}
		}
	}

	return aux;
};

/*$ private
 * Return true if any Latin letters are found in the string. Return
 * false if all the characters are non-Latin.
 */
Globalization.Name._isEuroName = function (name)
{
	var c, i;
	
	for ( i = 0; i < name.length; i++ ) {
		c = name.charAt(i);
		
		if ( !Globalization.Character.isIdeograph(c) && 
			 !Globalization.Character.isPunct(c) &&
			 !Globalization.Character.isWhitespace(c) ) {
			return true;
		}
	}
	
	return false;
};

/*$ private
 * find the last instance of 'and' in the name
 * @param {Array} parts
 * @returns {integer}
 */
Globalization.Name._findLastConjunction = function (parts, locale) {
	var conjunctionIndex = -1, index, part, rb;
	
	rb = Globalization.Locale.bundleFactory.getResourceBundle(locale);
	
	for ( index = 0; index < parts.length; index++ ) {
		part = parts[index];
		if (typeof(part) === 'string') { 
			if ( "and" === part.toLowerCase() || "or" === part.toLowerCase() || "&" === part || "+" === part ) {
				conjunctionIndex = index;
			}
			if ((rb.$L({key: "and1", value: "and"}).toLowerCase() === part.toLowerCase()) || 
				(rb.$L({key: "and2", value: "and"}).toLowerCase() === part.toLowerCase()) || 
				(rb.$L({key: "or1", value: "or"}).toLowerCase() === part.toLowerCase()) || 
				(rb.$L({key: "or2", value: "or"}).toLowerCase() === part.toLowerCase()) || 
				("&" === part) || 
				("+" === part)) {
				conjunctionIndex = index;
				//console.info("_findLastConjunction: found conjunction " + parts[index] + " at index " + index);
			}
		}
	}
	return conjunctionIndex;
};

Globalization.Name._joinArrayOrString = function (part) {
	var i;
	if ( typeof(part) === 'object' ) {
		for ( i = 0; i < part.length; i++ ) {
			part[i] = Globalization.Name._joinArrayOrString(part[i]);
		}
		return part.join(' ');
	}
	return part;
};

Globalization.Name._joinNameArrays = function (name) {
	var prop;
	for ( prop in name ) {
		if ( name[prop] !== undefined ) {
			name[prop] = Globalization.Name._joinArrayOrString(name[prop]);
		}
	}
	return name;
};


/*
 * This is how names are parsed for Spanish names:
 *    1
 *    F
 *
 *    1 2
 *    F L
 *
 *    1 2 3
 *    F L L
 *
 *    1 2 3 4
 *    F M L L 
 *
 *    1 2 3 4 5
 *    F M M L L
 * 
 * Unless there's one of { 'and', 'or', '&', '+' }, in which case it's:
 *     1
 *     F
 * 
 *     1 2
 *     F L
 * 
 *     1 2 3
 *     F A F
 *     A L L
 *     F L L
 * 
 *     1 2 3 4
 *     F A F L
 *     F F A F
 * 
 *     1 2 3 4 5
 *     F A F L L
 *     F F A F L
 *     F F F A F
 */
Globalization.Name.parseSpanishName = function (structuredName, parts) {
	var conjunctionIndex, i;
	
	if (parts.length === 1) {
		if ( structuredName.prefix || typeof(parts[0]) === 'object' ) {
			structuredName.familyName = parts[0];
		} else {
			structuredName.givenName = parts[0];
		}
	} else if (parts.length === 2) {
		//we do FL
		structuredName.givenName = parts[0];
		structuredName.familyName = parts[1];
	} else if (parts.length === 3) {
		conjunctionIndex = Globalization.Name._findLastConjunction(parts, "es");
		//if there's an 'and' in the middle spot, put everything in the first name
		if (conjunctionIndex === 1) {
			structuredName.givenName = parts;
		} else {
			//else, do FLL
			structuredName.givenName = parts[0];
			structuredName.familyName = parts.slice(1);
		}
	} else if (parts.length > 3) {
		//there are at least 4 parts to this name
		
		conjunctionIndex = Globalization.Name._findLastConjunction(parts, "es");
		if (conjunctionIndex > 0) {
			// if there's a conjunction that's not the first token, put everything up to and 
			// including the token after it into the first name, the last 2 tokens into
			// the family name (if they exist) and everything else in to the middle name
			// 0 1 2 3 4 5
			// F A F
			// F A F L
			// F F A F
			// F A F L L
			// F F A F L
			// F F F A F
			// F A F M L L
			// F F A F L L
			// F F F A F L
			// F F F F A F
			structuredName.givenName = parts.splice(0,conjunctionIndex+2);
			if ( parts.length > 1 ) {
				structuredName.familyName = parts.splice(parts.length-2, 2);
				if ( parts.length > 0 ) {
					structuredName.middleName = parts;
				}
			} else if ( parts.length === 1 ) {
				structuredName.familyName = parts[0];
			}
		} else {
			structuredName.givenName = parts.splice(0,1);
			structuredName.familyName = parts.splice(parts.length-2, 2);
			structuredName.middleName = parts;
		}
	}
};

/*
 * This is how names are parsed for names by default (the English case):
 * 
 * F stands for a first name
 * M is a middle name
 * L is a last name
 * numbers are position
 * 
 *     1
 *     F
 * 
 *     1 2
 *     F L
 * 
 *     1 2 3
 *     F M L
 * 
 *     1 2 3 4
 *     F M M L 
 * 
 *     1 2 3 4 5
 *     F M M M L
 * 
 * Unless there's one of { 'and', 'or', '&', '+' }, in which case it's:
 *     1
 *     F
 * 
 *     1 2
 *     F L
 * 
 *     1 2 3
 *     F A F
 * 
 *     1 2 3 4
 *     F A F L
 *     F F A F
 * 
 *     1 2 3 4 5
 *     F A F M L
 *     F F A F L
 *     F F F A F
 */

/*$ private
 * Helper function for Globalization.Name.parsePersonalName
 * @param {Object} structuredName - this function modifies this object directly
 * @param {Array} parts
 **/
Globalization.Name._parseNameDefaultLocale = function (structuredName, parts, locale) {
	var conjunctionIndex, i, familyName;

	if (parts.length === 1) {
		if ( structuredName.prefix || typeof(parts[0]) === 'object' ) {
			// already has a prefix, so assume it goes with the family name like "Dr. Roberts" or
			// it is a name with auxillaries, which is almost always a family name
			structuredName.familyName = parts[0];
		} else {
			structuredName.givenName = parts[0];
		}
	} else if (parts.length === 2) {
		//we do FL
		structuredName.givenName = parts[0];
		structuredName.familyName = parts[1];
	} else if (parts.length >= 3) {
		//find the first instance of 'and' in the name
		conjunctionIndex = Globalization.Name._findLastConjunction(parts, locale);

		if (conjunctionIndex > 0) {
			// if there's a conjunction that's not the first token, put everything up to and 
			// including the token after it into the first name, the last token into
			// the family name (if it exists) and everything else in to the middle name
			// 0 1 2 3 4 5
			// F A F M M L
			// F F A F M L
			// F F F A F L
			// F F F F A F
			structuredName.givenName = parts.slice(0,conjunctionIndex+2);
			if ( conjunctionIndex + 1 < parts.length - 1 ) {
				structuredName.familyName = parts.splice(parts.length-1, 1);
				if ( conjunctionIndex + 2 < parts.length - 1 ) {
					structuredName.middleName = parts.slice(conjunctionIndex + 2, parts.length - conjunctionIndex - 3);
				}
			}
		} else {
			structuredName.givenName = parts[0];
			structuredName.middleName = parts.slice(1, parts.length-1);
			structuredName.familyName = parts[parts.length-1];
		}
	}
};

/*$ private
 * Helper function for Globalization.Name.parsePersonalName
 * @param {Object} structuredName - this function modifies this object directly
 * @param {Array} parts
 **/
Globalization.Name._parseAsianName = function(structuredName, parts, nameInfo)
{
	var familyNameArray = Globalization.Name._findPrefix(parts, nameInfo.knownFamilyNames, true);
	
	if ( familyNameArray && familyNameArray.length > 0 ) {
		structuredName.familyName = familyNameArray.join('');
		if (structuredName.familyName.length < parts.length) {
			structuredName.givenName = parts.slice(structuredName.familyName.length).join('');
		}
	} else if ( structuredName.suffix || structuredName.prefix ) {
		structuredName.familyName = parts.join('');
	} else {
		structuredName.givenName = parts.join('');
	}
};

/*$ private
 * Helper function for Globalization.Name.parsePersonalName to 
 * adjoin auxillary words to their head words
 * @param {Array} parts name words split into an array
 * @param {Array} nameInfo for the current locale
 **/
Globalization.Name._adjoinAuxillaries = function(structuredName, parts, nameInfo)
{
	var start, i, prefixArray, prefix, prefixLower;
	
	//console.info("_adjoinAuxillaries: finding and adjoining aux words in " + parts.join(' '));
	
	if ( nameInfo.auxillaries && (parts.length > 2 || structuredName.prefix) ) {
		for ( start = 0; start < parts.length-1; start++ ) {
			for ( i = parts.length; i > start; i-- ) {
				prefixArray = parts.slice(start, i);
				prefix = prefixArray.join(' ');
				prefixLower = prefix.toLowerCase();
				prefixLower = prefixLower.replace(/[,\.]/g, '');  // ignore commas and periods
				
				//console.info("_adjoinAuxillaries: checking aux prefix: '" + prefixLower + "' which is " + start + " to " + i);
				
				if ( prefixLower in nameInfo.auxillaries ) {
					//console.info("Found! Old parts list is " + JSON.stringify(parts));
					parts.splice(start, i+1-start, prefixArray.concat(parts[i]));
					//console.info("_adjoinAuxillaries: Found! New parts list is " + JSON.stringify(parts));
					i = start;
				}
			}
		}
	}
	
	//console.info("_adjoinAuxillaries: done. Result is " + JSON.stringify(parts));

	return parts;
};

/**
 * Globalization.Name.parsePersonalName -> Object
 * - parsePersonalName(String, String): a person's name
 * - name (String): name of a person to parse
 * - locale (String): locale to use to parse the name. If not specified, 
 * this function will use the current locale
 * 
 * This function parses a personal name written in a free-form string. 
 * It returns an object with a number of properties from the list below 
 * that it may have extracted from that name. Because some properties
 * (eg. "middleName")
 * may contain multiple names, each property may be a single string with
 * spaces and punctuation in the middle of it. 
 * 
 * If any names cannot be assigned to 
 * one of these properties, they will be be inserted into the "givenName" property.
 * 
 * The following is a list of name properties that the algorithm will return:
 * 
 * - **prefix**: Any titles, such as "President" or "Dr.", or honorifics, 
 * such as "Don" in Spanish or "Mister" in English that preceed the name
 * - **givenName**: the given name(s) of the person, which is often unique
 * to that person within a family or group
 * - **familyName**: the family name(s) of a person that is shared with other
 * family members
 * - **middleName**: auxilliary given name(s)
 * - **suffix**: any suffixes that are attached to a name, such as "Jr."
 * or "M.D." in English, or honorifics like "-san" in Japanese. 
 * 
 * For any individual property, if there are multiple names for that property,
 * they will be returned as a single string with the original punctuation 
 * preserved. For example, if the name
 * is "John Jacob Jingleheimer Schmidt", there are two middle names and they 
 * will be returned as the string: "Jacob Jingleheimer"
 * 
 * Suffixes may be optionally appended to names using a comma. If commas
 * appear in the original name, they will be preserved in the output of
 * the suffix property so that they can be reassembled again later by
 * [[formatPersonalName]] properly.
 * 
 * For any titles or honorifics that are considered a whole, the name is
 * returned as a single string. For example, if the name to
 * parse is "The Right Honourable James Clawitter", the honorific would
 * be returned as a prefix with the whole string "The Right Honourable".
 * 
 * When a compound name is found in the name string, the conjunction is
 * placed in the givenName property. 
 * 
 * Example: "John and Mary Smith"
 * output: 
 * {
 *    givenName: "John and Mary",
 *    familyName: "Smith"
 * }
 * 
 * This can be considered to be two names: "John Smith and Mary Smith". Without 
 * conjunctions, the words "and Mary" would have been considered
 * middle names of the person "John Smith".
 * 
 * There are a few special cases where the name is parsed differently from
 * what the rules of the given locale would imply. If the name is composed 
 * entirely of Asian characters, it is parsed as an Asian name, even in 
 * non-Asian locales. If the locale is an Asian locale, and the name is 
 * composed entirely of Roman alphabet characters, the name is parsed as a 
 * generic Western name (using US/English rules). This way, Asian and western
 * names can be mixed in the same list, and they will all be parsed 
 * reasonably correctly.
 * 
 * When a name cannot be parsed properly, the entire name will be placed
 * into the givenName property.
 * 
 * Returns an object with the various properties listed above.
 **/
Globalization.Name.parsePersonalName = function (name, locale)
{
	var language, parsedLocale, langInfo, nameInfo, parts = [], 
		i, structuredName = {}, prefixArray, prefix, prefixLower,
		suffixArray, suffix, suffixLower, newparts, start,
		countryCode, asianName, hpSuffix, conjunctionIndex;
	
	if ( !locale ) {
		language = Globalization.Locale.getCurrentLanguage();
	} else {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		language = parsedLocale.language;
	}
	
	// first break the name into parts, and extract all the parts
	// that are not really part of the name
	
	langInfo = Globalization.Locale._loadLanguageInfo(language);
	if ( !langInfo || !langInfo.name ) {
		// default to English if there is no info on the particular language
		// this should never happen because you can't pick a language in the 
		// language picker that we don't already support
		langInfo = Globalization.Locale._loadLanguageInfo('en');
	}
	nameInfo = langInfo.name;
	
	// console.log("parsePersonalName: parsing name '" + name + "'");
	
	// for DFISH-12905, pick off the part that the LDAP server automatically adds to our names in HP emails
	i = name.search(/\s*[,\(\[\{<]/);
	if (i !== -1) {
		hpSuffix = name.substring(i);
		hpSuffix = hpSuffix.replace(/\s+/g, ' ');	// compress multiple whitespaces
		suffixArray = hpSuffix.split(" ");
		conjunctionIndex = Globalization.Name._findLastConjunction(suffixArray, language);
		if (conjunctionIndex > -1) {
			// it's got conjunctions in it, so this is not really a suffix
			hpSuffix = undefined;
		} else {
			name = name.substring(0,i);
		}
	}

	if ( !nameInfo.isAsianLocale || Globalization.Name._isEuroName(name) ) {
		name = name.replace(/\s+/g, ' ');	// compress multiple whitespaces
		parts = name.trim().split(' ');
		asianName = false;
	} else {
		// all-asian names
		name = name.replace(/\s+/g, '');	// eliminate all whitespaces
		parts = name.trim().split('');
		asianName = true;
	}

	// next, we are left with only name parts. Parse these
	// according to the locale. Search for the various lengths of
	// prefix in the name in the various tables. The tables are 
	// much longer than the name prefixes, so there are less 
	// iterations if we do it this way.
	
	//console.info("parsePersonalName: parsing name '" + name + "'");
	
	// check for prefixes
	if (parts.length > 1) {
		//console.info("parsePersonalName: finding prefixes");
		for ( i = parts.length; i > 0; i-- ) {
			prefixArray = parts.slice(0, i);
			prefix = prefixArray.join(asianName ? '' : ' ');
			prefixLower = prefix.toLowerCase();
			prefixLower = prefixLower.replace(/[,\.]/g, '');  // ignore commas and periods
			
			//console.info("checking prefix: '" + prefixLower + "'");
			
			if ( (nameInfo.titles && nameInfo.titles.indexOf(prefixLower) > -1) || (nameInfo.honorifics && nameInfo.honorifics.indexOf(prefixLower) > -1) ) {
				if ( structuredName.prefix  ) {
					if ( !asianName ) {
						structuredName.prefix += ' ';
					} 
					structuredName.prefix += prefix;
				} else {
					structuredName.prefix = prefix;
				}
				parts = parts.slice(i);
				i = parts.length;
				//console.info("Found prefix '" + prefix + "' New parts list is " + JSON.stringify(parts));
			}
		}
	}
	
	// check for suffixes
	if (parts.length > 1) {
		//console.info("parsePersonalName: finding suffixes");
		for ( i = parts.length; i > 0; i-- ) {
			suffixArray = parts.slice(-i);
			suffix = suffixArray.join(asianName ? '' : ' ');
			suffixLower = suffix.toLowerCase();
			suffixLower = suffixLower.replace(/[,\.]/g, '');  // ignore commas and periods
			
			//console.info("checking suffix: '" + suffixLower + "'");
			
			if ( nameInfo.suffixes && nameInfo.suffixes.indexOf(suffixLower) > -1 ) {
				if ( structuredName.suffix ) {
					if ( !asianName ) {
						structuredName.suffix = ' ' + structuredName.suffix;
					}
					structuredName.suffix = suffix + structuredName.suffix;
				} else {
					structuredName.suffix = suffix;
				}
				parts = parts.slice(0, parts.length-i);
				//console.info("Found suffix '" + suffix + "' New parts list is " + JSON.stringify(parts));
				i = parts.length;
			}
		}
	}
	
	if (hpSuffix) {
		structuredName.suffix = (structuredName.suffix && structuredName.suffix + hpSuffix) || hpSuffix;
	}

	// adjoin auxillary words to their headwords
	if (parts.length > 1 && !asianName ) {
		parts = Globalization.Name._adjoinAuxillaries(structuredName, parts, nameInfo);
		//console.info("parsePersonalName: parts is now " + JSON.stringify(parts));
	}
	
	if ( asianName ) {
		Globalization.Name._parseAsianName(structuredName, parts, nameInfo);
	} else if (language === "es") {
		// in spain and mexico, we parse names differently than in the rest of the world because of the double family names
		Globalization.Name.parseSpanishName(structuredName, parts);
	} else {
		Globalization.Name._parseNameDefaultLocale(structuredName, parts, language);
	}
	
	Globalization.Name._joinNameArrays(structuredName);
	
	// clean up
	Utils.releaseAllJsonFiles(Globalization.Locale.formatRegion);

	return structuredName;
};

/*$ shallow copy */
Globalization.Name._shallowCopy = function (from, to)
{
	var prop;
	for ( prop in from ) {
		if ( prop !== undefined && from[prop] ) {
			to[prop] = from[prop];
		}
	}
};

/**
 * Globalization.Name.formatPersonalName -> String
 * - formatPersonalName(Object, String, String): format a person's name for display
 * - nameModel (Object): a person's name that has been parsed with [[parsePersonalName]]
 * - style (String): the format style to use with this name. Default is 'short'
 * - locale (String): locale to use to format the name. If not specified, 
 * this function will use the current locale
 * 
 * This function formats a personal name for display.
 * 
 * The style parameter should be passed as one of the following contants:
 * 
 * - **Globalization.Name.shortName**: Format the shortest unique name. For most locales, this is the first
 * given name and the family name.
 * - **Globalization.Name.mediumName**: Format the most common parts of the name. For most locales, this
 * is the short name plus a middle name
 * - **Globalization.Name.longName**: Format all parts of the name that are available
 * 
 * Returns a string with the name.
 **/
Globalization.Name.formatPersonalName = function (nameModel, style, locale)
{
	var language, parsedLocale, langInfo, format, template, name, isAsian,
		modifiedModel = {}, useFirstFamilyName;
	
	try {
		Globalization.Name._shallowCopy(nameModel, modifiedModel);
		
		if ( !locale ) {
			language = Globalization.Locale.getCurrentLanguage();
		} else {
			parsedLocale = Globalization.Locale.parseLocaleString(locale);
			language = parsedLocale.language;
		}
		
		if ( !style ) {
			// use this as the default style
			style = Globalization.Name.mediumName;
		}
		
		langInfo = Globalization.Locale._loadLanguageInfo(language);
		
		if ( !langInfo || !langInfo.name ) {
			langInfo = Globalization.Locale._loadLanguageInfo('en');
		}
		
		if ( langInfo ) {
			format = langInfo.name.formats[style];
		}
		
		// handle Asian names in the non-Asian locales
		if ((nameModel.givenName && Globalization.Name._isEuroName(nameModel.givenName)) ||
			 (nameModel.middleName && Globalization.Name._isEuroName(nameModel.middleName)) ||
			 (nameModel.familyName && Globalization.Name._isEuroName(nameModel.familyName))) {
			// euro name
			isAsian = false;
			// use generic default -- should not happen, but just in case...
			if ( language === "es" && style !== Globalization.Name.longName ) {
				useFirstFamilyName = true;	// in spain, they have 2 family names, the maternal and paternal
			}
			if ( langInfo.name.isAsianLocale || !format ) {
				switch ( style ) {
				case Globalization.Name.shortName:
					format = "#{givenName} #{familyName}";
					break;
				default:
				case Globalization.Name.mediumName:
					format = "#{givenName} #{middleName} #{familyName}";
					break;
				case Globalization.Name.longName:
					format = "#{prefix} #{givenName} #{middleName} #{familyName}#{suffix}";
					useFirstFamilyName = false;
					break;
				}
			}
			
			// handle the case where there is no space if there is punctuation in the suffix like ", Phd". 
			// Otherwise, put a space in to transform "PhD" to " PhD"
			if ( modifiedModel.suffix && !Globalization.Character.isPunct(modifiedModel.suffix.charAt(0)) ) {
				modifiedModel.suffix = ' ' + modifiedModel.suffix; 
			}
			
			if ( useFirstFamilyName && nameModel.familyName ) {
				var familyNameParts = nameModel.familyName.trim().split(' ');
				if (familyNameParts.length > 1) {
					familyNameParts = Globalization.Name._adjoinAuxillaries(nameModel, familyNameParts, langInfo.name);
				}	//in spain and mexico, we parse names differently than in the rest of the world

				modifiedModel.familyName = familyNameParts[0];
			}
			
			Globalization.Name._joinNameArrays(modifiedModel);
		} else {
			// asian name
			isAsian = true;
			if ( !langInfo.name.isAsianLocale || !format ) {
				switch ( style ) {
				case Globalization.Name.shortName:
					format = "#{familyName}#{givenName}";
					break;
				default:
				case Globalization.Name.mediumName:
					format = "#{prefix}#{familyName}#{givenName}#{middleName}";
					break;
				case Globalization.Name.longName:
					format = "#{prefix}#{familyName}#{givenName}#{middleName}#{suffix}";
					break;
				}
			}
		}
		
		template = new Globalization.Format.Template(format);
		
		name = template.evaluate(modifiedModel);
		
	} catch (e) {
		console.error("Could not format name: " + e);
		template = new Globalization.Format.Template("#{givenName} #{middleName} #{familyName}");
		name = template.evaluate(modifiedModel);
	} finally {
		// clean up
		Utils.releaseAllJsonFiles(Globalization.Locale.formatRegion);
	}
	return name.replace(/\s+/g, ' ').trim();
};

 
 /**
  * Globalization.Name.getSortName -> String
  * - getSortName(String, String): Return the part of a family name that should be used for sorting in the given locale
  * - familyName (String): the family name part of a person's name
  * - locale (String): locale to use to decide the part to use
  * 
  * This function returns the portion of a person's family name that should be
  * used for sorting. In English, we almost always sort by the first letter of
  * the last name.
  * 
  * Example: "van der Heyden" would be sorted under "V", so this function would
  * return the original string back "van der Heyden".
  * 
  * In other cultures, it is common to sort by the head word of a family name 
  * that uses auxillaries like "van der". So, using the example above, this
  * function would return "Heyden" in Dutch. The same strategy goes for German
  * and other Germanic languages as well.
  * 
  * The locale will default to the current system locale if it is not given
  * in the arguments.
  * 
  * Returns a string with the part of the name used for sorting.
  **/
Globalization.Name.getSortName = function (name, locale)
{
	var language, parsedLocale, headword, auxillaries, langInfo, auxString, nameInfo, parts, i, isEuro;
	
	if (!name) {
		return name;
	}
	
	if ( !locale ) {
		language = Globalization.Locale.getCurrentLanguage();
	} else {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		language = parsedLocale.language;
	}

	// first break the name into parts
	langInfo = Globalization.Locale._loadLanguageInfo(language);
	if ( !langInfo ) {
		// default to English if there is no info on the particular language
		// this should never happen because you can't pick a language in the 
		// language picker that we don't already support
		langInfo = Globalization.Locale._loadLanguageInfo('en');
	}
	nameInfo = langInfo.name;

	if (nameInfo) {
		isEuro = Globalization.Name._isEuroName(name);
		if (isEuro && nameInfo.sortByHeadWord) {
			name = name.replace(/\s+/g, ' ');	// compress multiple whitespaces
			parts = name.trim().split(' ');
			
			auxillaries = Globalization.Name._findPrefix(parts, nameInfo.auxillaries, false);
			if ( auxillaries && auxillaries.length > 0 ) {
				auxString = auxillaries.join(' ');
				name = name.substring(auxString.length+1) + ', ' + auxString;
			}
		} else if (!isEuro && nameInfo.knownFamilyNames) {
			parts = name.split('');
			var familyNameArray = Globalization.Name._findPrefix(parts, nameInfo.knownFamilyNames, true);
			name = "";
			for (i = 0; i < familyNameArray.length; i++) {
				name += (nameInfo.knownFamilyNames[familyNameArray[i]] || "");
			}
		}
	}

	// clean up
	Utils.releaseAllJsonFiles(Globalization.Locale.formatRegion);

	return name;
};