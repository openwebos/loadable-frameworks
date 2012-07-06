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

/*globals Globalization Utils PhoneData */

Globalization.Address._Utils = {
	isAsian: function (address) {
		var i,
			asianChars = 0,
			latinChars = 0;
		
		if (address) {
			for (i = 0; i < address.length; i++) {
				if (Globalization.Character.isIdeograph(address.charAt(i))) {
					asianChars++;
				} else if (Globalization.Character.isLetter(address.charAt(i))) {
					latinChars++;
				}
			}
		}
		return (asianChars >= latinChars) ? "asian" : "latin";
	},
	
	endsWith: function (subject, query) {
		var start = subject.length-query.length,
			i,
			pat;
		//console.log("endsWith: checking " + query + " against " + subject);
		for (i = 0; i < query.length; i++) {
			if (subject.charAt(start+i).toLowerCase() !== query.charAt(i).toLowerCase()) {
				return -1;
			}
		}
		if (start > 0) {
			pat = /\s/;
			if (!pat.test(subject.charAt(start-1))) {
				// make sure if we are not at the beginning of the string, that the match is 
				// not the end of some other word
				return -1;
			}
		}
		return start;
	},
	
	startsWith: function (subject, query) {
		var i;
		// console.log("startsWith: checking " + query + " against " + subject);
		for (i = 0; i < query.length; i++) {
			if (subject.charAt(i).toLowerCase() !== query.charAt(i).toLowerCase()) {
				return -1;
			}
		}
		return 0;
	},
	
	removeEmptyLines: function (arr) {
		var i = 0;
		
		while (i < arr.length) {
			if (!arr[i] || arr[i].length === 0) {
				arr.splice(i,1);
			} else {
				arr[i] = arr[i].trim();
				i++;
			}
		}
	},
	
	matchRegExp: function(address, line, expression, matchGroup, startAt, compare) {
		var lastMatch,
			match,
			ret = {},
			last;
		
		//console.log("searching for regexp " + expression.source + " in line " + line);
		
		match = expression.exec(line);
		if (startAt === 'end') {
			while (match !== null && match.length > 0) {
				//console.log("found matches " + JSON.stringify(match));
				lastMatch = match;
				match = expression.exec();
			}
			match = lastMatch;
		}
		
		if (match && match !== null) {
			//console.log("found matches " + JSON.stringify(match));
			matchGroup = matchGroup || 0;
			if (match[matchGroup] !== undefined) {
				ret.match = match[matchGroup].trim();
				last = (startAt === 'end') ? line.lastIndexOf(match[matchGroup]) : line.indexOf(match[matchGroup]); 
				ret.line = line.slice(0,last);
				if (address.format !== "asian") {
					ret.line += " ";
				}
				ret.line += line.slice(last+match[matchGroup].length);
				ret.line = ret.line.trim();
				//console.log("found match " + ret.match + " from matchgroup " + matchGroup + " and rest of line is " + ret.line);
				return ret;
			}
		//} else {
			//console.log("no match");
		}
		
		return undefined;
	},
	
	matchPattern: function(address, line, pattern, matchGroup, startAt, compare) {
		var start,
			j,
			ret = {};
		
		//console.log("searching in line " + line);
		
		// search an array of possible fixed strings
		//console.log("Using fixed set of strings.");
		for (j = 0; j < pattern.length; j++) {
			start = compare(line, pattern[j]); 
			if (start !== -1) {
				ret.match = line.substring(start, start+pattern[j].length);
				ret.line = line.substring(0,start).trim();
				//console.log("found match " + ret.match + " and rest of line is " + ret.line);
				return ret;
			}
		}
		
		return undefined;
	}
};

/**
 * Globalization.Address.parseAddress -> Object
 * - parseAddress(String, String): parse a physical address
 * - address (String): free-form address to parse
 * - locale (String): locale to use to parse the address. If not specified, 
 * this function will use the current locale
 * 
 * This function parses a physical address written in a free-form string. 
 * It returns an object with a number of properties from the list below 
 * that it may have extracted from that address.
 * 
 * The following is a list of properties that the algorithm will return:
 * 
 * - streetAddress: The street address, including house numbers and all
 * - locality: the locality of this address (usually a city or town) 
 * - region: the region where the locality is located. In the US, this
 * corresponds to states
 * - postalCode: country-specific code for expediting mail. In the US, 
 * this is the zip code 
 * - country: the country of the address 
 * 
 * For any individual property, if the address does not contain that
 * property, it is left out.
 * 
 * When an address cannot be parsed properly, the entire address will be placed
 * into the streetAddress property.
 * 
 * Returns an object with the various properties listed above.
 **/
Globalization.Address.parseAddress = function(freeformAddress, locale) {
	var addressInfo,
		address,
		i, 
		countryName,
		translated,
		countries,
		localizedCountries,
		start, 
		region,
		parsedLocale,
		fieldNumber,
		match,
		fields,
		field,
		startAt,
		infoFields,
		pattern,
		matchFunction,
		compare,
		ret = {};
	
	if (!freeformAddress) {
		return undefined;
	}
	
	if (locale) {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		region = parsedLocale.region;
	} else {
		region = Globalization.Locale.getCurrentFormatsRegion(); // can't do anything unless we know the locale
	}
	
	// initialize from an already parsed object
	if (typeof(freeformAddress) === 'object') {
		ret.streetAddress = freeformAddress.streetAddress;
		ret.locality = freeformAddress.locality;
		ret.region = freeformAddress.region;
		ret.postalCode = freeformAddress.postalCode;
		ret.country = freeformAddress.country;
		if (freeformAddress.countryCode) {
			ret.countryCode = freeformAddress.countryCode;
		}
		if (freeformAddress.format) {
			ret.format = freeformAddress.format;
		}
		ret.locale = { region: region };
		return ret;
	}
	
	countries = Utils.getJsonFile(Globalization.Locale._getFormatsPath() + "/name2reg.json", "unknown");
	
	// console.log("Loading in resources for locale " + region);
	localizedCountries = Globalization.Locale.bundleFactory.getResourceBundle(locale);
	
	addressInfo = Globalization.Locale._loadFormatsInfo(region);
	if (addressInfo) {
		addressInfo = addressInfo.address;
	}
	
	// console.log("Loading in locale " + locale.toString() + " and addressInfo is " + JSON.stringify(addressInfo));
	
	// clean it up first
	address = freeformAddress.replace(/[ \t\r]+/g, " ").trim();
	address = address.replace(/[\s\n]+$/, "");
	address = address.replace(/^[\s\n]+/, "");
	// console.log("\n\n-------------\nAddress is '" + address + "'");
	
	// for locales that support both latin and asian character addresses, 
	// decide if we are parsing an asian or latin script address
	if (addressInfo && addressInfo.multiformat) {
		ret.format = Globalization.Address._Utils.isAsian(address);
		startAt = addressInfo.startAt[ret.format];
		// console.log("multiformat locale: format is now " + ret.format);
	} else {
		startAt = (addressInfo && addressInfo.startAt) || "end";
	}
	compare = (startAt === "end") ? Globalization.Address._Utils.endsWith : Globalization.Address._Utils.startsWith;
	
	// first break the free form string down into possible fields. These may
	// or may not be fields, but if there is a field separator char there, it
	// will probably help us
	for (countryName in countries) {
		if (countryName) {
			translated = localizedCountries.$L(countryName);
			start = compare(address, translated);
			if (start === -1) {
				start = compare(address, countryName);
			}
			if (start !== -1) {
				ret.country = address.substring(start, start+translated.length);
				ret.countryCode = countries[countryName];
				address = address.substring(0,start) + address.substring(start+translated.length);
				address = address.trim();
				if (ret.countryCode !== region) {
					// console.log("Address: found country name " + ret.country + ". Switching to region " + ret.countryCode + " to parse the rest of the address:" + address);
	
					addressInfo = Globalization.Locale._loadFormatsInfo(ret.countryCode);
					if (addressInfo) {
						addressInfo = addressInfo.address;
					}
					// console.log("Loading in locale " + ret.countryCode + " and addressInfo is " + JSON.stringify(addressInfo));
					
					if (addressInfo && addressInfo.multiformat) {
						ret.format = Globalization.Address._Utils.isAsian(address);
						// console.log("multiformat locale: format is now " + ret.format);
					}
				//} else {
					// console.log("Same locale. Continuing parsing in " + ret.countryCode);
				}
				break;
			}
		}
	}
	
	if (!ret.countryCode) {
		ret.countryCode = region;
	}
	
	if (!addressInfo) {
		addressInfo = PhoneData.unknown.address;
		// console.log("Loading in locale unknown and addressInfo is " + JSON.stringify(addressInfo));
	}
	
	fields = address.split(/[,，\n]/img);
	// console.log("fields is: " + JSON.stringify(fields));
	
	if (addressInfo.multiformat) {
		startAt = addressInfo.startAt[ret.format];
		infoFields = addressInfo.fields[ret.format];
	} else {
		startAt = addressInfo.startAt;
		infoFields = addressInfo.fields;
	}
	compare = (startAt === "end") ? Globalization.Address._Utils.endsWith : Globalization.Address._Utils.startsWith;
	
	// console.log("infoFields is " + infoFields + " and fields is " + fields);
	
	for (i = 0; i < infoFields.length && fields.length > 0; i++) {
		field = infoFields[i];
		Globalization.Address._Utils.removeEmptyLines(fields);
		// console.log("Searching for field " + field.name);
		if (field.pattern) {
			if (typeof(field.pattern) === 'string') {
				pattern = new RegExp(field.pattern, "img");
				matchFunction = Globalization.Address._Utils.matchRegExp;
			} else {
				pattern = field.pattern;
				matchFunction = Globalization.Address._Utils.matchPattern;
			}
				
			switch (field.line) {
			case 'startAtFirst':
				for (fieldNumber = 0; fieldNumber < fields.length; fieldNumber++) {
					match = matchFunction(ret, fields[fieldNumber], pattern, field.matchGroup, startAt, compare);
					if (match) {
						break;
					}
				}
				break;
			case 'startAtLast':
				for (fieldNumber = fields.length-1; fieldNumber >= 0; fieldNumber--) {
					match = matchFunction(ret, fields[fieldNumber], pattern, field.matchGroup, startAt, compare);
					if (match) {
						break;
					}
				}
				break;
			case 'first':
				fieldNumber = 0;
				match = matchFunction(ret, fields[fieldNumber], pattern, field.matchGroup, startAt, compare);
				break;
			case 'last':
			default:
				fieldNumber = fields.length - 1;
				match = matchFunction(ret, fields[fieldNumber], pattern, field.matchGroup, startAt, compare);
				break;
			}
			if (match) {
				// console.log("found match: " + JSON.stringify(match));
				fields[fieldNumber] = match.line;
				ret[field.name] = match.match;
			}
		} else {
			// if nothing is given, default to taking the whole field
			ret[field.name] = fields.splice(fieldNumber,1)[0].trim();
			// console.log("typeof(ret[fieldName]) is " + typeof(ret[fieldName]) + " and value is " + JSON.stringify(ret[fieldName]));
		}
	}
		
	// all the left overs go in the street address field
	Globalization.Address._Utils.removeEmptyLines(fields);
	if (fields.length > 0) {
		// console.log("fields is " + JSON.stringify(fields) + " and splicing to get streetAddress");
		var joinString = (ret.format && ret.format === "asian") ? "" : ", ";
		ret.streetAddress = fields.join(joinString).trim();
	}
	
	// console.log("final result is " + JSON.stringify(ret));

	return ret;
};

/**
 * Globalization.Name.formatAddress -> String
 * - formatAddress(Object, String, String): format an address for display
 * - parsedAddress (Object): an address that has been parsed with [[Globalization.Address.parseAddress]]
 * - locale (String): locale to use to format the address. If not specified, 
 * this function will use the current locale
 * 
 * This function formats a physical address for display. Whitespace is trimmed
 * from the beginning and end of final resulting string, and multiple consecutive
 * whitespace characters in the middle of the string are compressed down to 1 
 * space character.
 * 
 * Returns a string with the formatted address.
 **/
Globalization.Address.formatAddress = function (parsedAddress, locale) {
	var formatInfo, format, region, styleName, style,
		ret, template,
		parsedLocale,
		addressType,
		countries,
		country,
		localizedCountries,
		countryName;

	if (!parsedAddress) {
		return "";
	}

	if (locale) {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		region = parsedLocale.region;
	} else {
		region = Globalization.Locale.getCurrentFormatsRegion(); // can't do anything unless we know the locale
	}
	
	// console.log("Creating formatter for region: " + region);
	styleName = 'default';

	// console.log("formatting address: " + JSON.stringify(parsedAddress));
	if (parsedAddress.countryCode && parsedAddress.countryCode !== region) {
		// we are formatting an address that is sent from this country to another country,
		// so only the country should be in this locale, and the rest should be in the other
		// locale
		// console.log("formatting for another locale. Loading in its settings: " + parsedAddress.countryCode);
		formatInfo = Globalization.Locale._loadFormatsInfo(parsedAddress.countryCode);
	} else {
		if (parsedAddress.country && !parsedAddress.countryCode) {
			country = parsedAddress.country.toLowerCase();
			countries = Utils.getJsonFile(Globalization.Locale._getFormatsPath() + "/name2reg.json", "unknown");
			localizedCountries = Globalization.Locale.bundleFactory.getResourceBundle(locale);
			for (countryName in countries) {
				if (countryName) {
					if (country === localizedCountries.$L(countryName)) {
						region = countries[countryName];
						// console.log("Converted " + parsedAddress.country + " to region code " + region);
						break;
					}
				}
			}
		}
		formatInfo = Globalization.Locale._loadFormatsInfo(region);
	}
	if (formatInfo && formatInfo.address) {
		formatInfo = formatInfo.address;
	} else {
		formatInfo = PhoneData.unknown.address;
	}
	
	// console.log("styleName is " + styleName);
	
	style = formatInfo && formatInfo.formats && formatInfo.formats[styleName];
	
	// use generic default -- should not happen, but just in case...
	style = style || formatInfo.formats["default"] || "#{streetAddress}\n#{locality} #{region} #{postalCode}\n#{country}";
	
	// console.log("style ends up being " + JSON.stringify(style));
	addressType = parsedAddress.format || Globalization.Address._Utils.isAsian(parsedAddress.streetAddress) || "latin";
	format = addressType && style[addressType] ? style[addressType] : style;
	// console.log("Using format: " + format);
	template = new Globalization.Format.Template(format);
	ret = template.evaluate(parsedAddress);
	ret = ret.replace(/[ \t]+/g, ' ');
	return ret.replace(/\n+/g, '\n').trim();
};
