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

/*globals Globalization console PhoneData */

/**
 * Globalization.Format.getPhoneFormatExamples(locale) -> Array
 * - region (String): ISO code for the region for which to return the example formats
 *
 * Return an array of phone number formatting styles and examples
 * of each. Each element of the array has a key and a value. The key 
 * is the name of the style used with [[Mojo.Format.formatPhoneNumber]],
 * and the value is an example number formatted in that style. 
 * The intention is that these
 * examples can be shown in a preference UI to allow the user to
 * choose the formatting style they prefer.
 * 
 * The style name string will already be localized for the format region.
 **/
Globalization.Format.getPhoneFormatExamples = function getPhoneFormatExamples(formatsRegion) {
	var region, regionSettings, styles, entry;
	
	formatsRegion = formatsRegion || Globalization.Locale.getCurrentPhoneRegion();
	region = Globalization.Phone._getNormalizedPhoneRegion(formatsRegion);
	regionSettings = Globalization.Phone._loadFormatsFile(region);

	styles = [];
	
	if ( regionSettings.phoneNumberFormats.styles ) {
		for ( style in regionSettings.phoneNumberFormats.styles ) {
			if ( regionSettings.phoneNumberFormats.styles[style].example ) {
				styles.push({ key: style, value: regionSettings.phoneNumberFormats.styles[style].example });
			}
		}
	}
	
	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);
	
	return styles;
};

/**
 * Globalization.Format.getPhoneFormatRegions() -> Array
 *
 * Return an array of regions supported by this phone formatter. Each
 * item in the array has an ISO "countryCode" and a "countryName" property.
 * 
 * The countryName property is in English, not localized.
 **/
Globalization.Format.getPhoneFormatRegions = function getPhoneFormatRegions() {
	return [
        {countryCode: "us", countryName: "US, Canada, Caribbean"},
		{countryCode: "it", countryName: "Italy"},
		{countryCode: "fr", countryName: "France"},
		{countryCode: "gb", countryName: "United Kingdom"},
		{countryCode: "ie", countryName: "Ireland"},
		{countryCode: "de", countryName: "Germany"},
		{countryCode: "nl", countryName: "Netherlands"},
		{countryCode: "be", countryName: "Belgium"},
		{countryCode: "lu", countryName: "Luxembourg"},
		{countryCode: "es", countryName: "Spain"},
		{countryCode: "mx", countryName: "Mexico"},
		{countryCode: "cn", countryName: "China"},
		{countryCode: "au", countryName: "Australia"},
		{countryCode: "sg", countryName: "Singapore"},
		{countryCode: "nz", countryName: "New Zealand"},
		{countryCode: "hk", countryName: "Hong Kong"}
	];
};

Globalization.Phone._substituteDigits = function _substituteDigits(part, formats, mustUseAll) {
	var format;
	var formatted = "";
	var partIndex = 0;
	
	// console.info("Globalization.Phone._substituteDigits: typeof(formats) is " + typeof(formats));
	
	if ( !part ) {
		return formatted;
	}
	
	if ( typeof(formats) === "object" ) {
		if ( part.length > formats.length ) {
			// too big, so just use last resort rule.
			throw "part " + part + " is too big. We do not have a format template to format it.";
		}
		// use the format in this array that corresponds to the digit length of this
		// part of the phone number
		format = formats[part.length-1];
		// console.info("Globalization.Phone._substituteDigits: formats is an Array: " + JSON.stringify(formats));
	} else {
		format = formats;
	}
	// console.info("Globalization.Phone._substituteDigits: part is " + part + " format is " + format);
	
	for ( var i = 0; i < format.length; i++ ) {
		if ( format.charAt(i) == "X" ) {
			formatted += part.charAt(partIndex);
			partIndex++;
		} else {
			formatted += format.charAt(i);
		}
	}
	
	if ( mustUseAll && partIndex < part.length-1 ) {
		// didn't use the whole thing in this format? Hmm... go to last resort rule
		throw "too many digits in " + part + " for format " + format;
	}
	
	return formatted;
};

Globalization.Format._formatPhoneNumberWithParams = function _formatPhoneNumberWithParams(phoneNumberModel, params) {
	var region, 
		formatsRegion, 
		regionSettings, 
		format, 
		temp, 
		templates, 
		fieldName, 
		countryCode, 
		isWhole, 
		style,
		field,
		formatted = "",
		styleNumber,
		iter, 
		i;
	
	// console.log("Globalization.Format.formatPhoneNumber: formatting " + JSON.stringify(phoneNumberModel));
	
	try {
		isWhole = true;
		
		if ( params ) {
			if ( params.mcc ) {
				countryCode = Globalization.Phone.getMobileCountryCode(params.mcc);
				formatsRegion = PhoneData.mccToCountry[params.mcc];
			} else if ( params.locale ) {
				parsedLocale = Globalization.Locale.parseLocaleString(params.locale);
				formatsRegion = parsedLocale.region;
			}
			
			if ( params.partial && params.partial === true ) {
				isWhole = false;
			}
			
			if ( params.style ) {
				if ( typeof(params.style) === 'number' ) {
					styleNumber = params.style;
				} else {
					style = params.style;
				}
			}
		}
		
		if ( !formatsRegion ) {
			formatsRegion = Globalization.Locale.getCurrentPhoneRegion(); 	// can't do anything unless we know the locale
		}
	
		region = Globalization.Phone._getNormalizedPhoneRegion(formatsRegion);
		// console.log("Globalization.Format.formatPhoneNumber: formatsRegion is " + formatsRegion + " region is " + region);
		
		regionSettings = Globalization.Phone._loadFormatsFile(region);
		
		// to support old-style numbered styles
		if ( styleNumber && regionSettings.phoneNumberFormats.styles ) {
			// console.log("using old style number " + styleNumber + ". Converting to a style name");
			if ( regionSettings.phoneNumberFormats.styles.service ) {
				styleNumber += 4;
			} else {
				styleNumber += 3;
			}
			i = 0;
			for ( iter in regionSettings.phoneNumberFormats.styles ) {
				if ( i === styleNumber ) {
					style = iter;
					break;
				}
				i++;
			}
		}
	
		// figure out what style to use for this type of number
		if ( phoneNumberModel.countryCode !== undefined  ) {
			if ( phoneNumberModel.mobilePrefix !== undefined ) {
				// dialing a mobile phone from outside the country
				style = "internationalmobile";
			} else {
				// dialing some other type of line from outside the country
				style = "international";
			}
		} else if ( phoneNumberModel.mobilePrefix !== undefined  ) {
			style = "mobile";
		} else if ( phoneNumberModel.serviceCode !== undefined && regionSettings.phoneNumberFormats.styles.service ) {
			// iff there is a special format for service numbers, then use it
			style = "service";
		}
		
		if ( !style || regionSettings.phoneNumberFormats.styles[style] === undefined ) {
			style = "default";
		}
		
		// console.log("Style ends up being " + style + " and using subtype " + (isWhole ? "whole" : "partial"));
		
		format = (isWhole ? regionSettings.phoneNumberFormats.styles[style].whole : regionSettings.phoneNumberFormats.styles[style].partial) || regionSettings.phoneNumberFormats.styles[style];

		for ( var field in PhoneData.fieldOrder ) {
			if ( typeof field === 'string' && typeof PhoneData.fieldOrder[field] === 'string' ) {
				fieldName = PhoneData.fieldOrder[field];
				// console.info("formatPhoneNumber: formatting field " + fieldName + " value: " + phoneNumberModel[fieldName]);
				if ( phoneNumberModel[fieldName] !== undefined ) {
					if ( format[fieldName] !== undefined ) {
						templates = format[fieldName];
						if ( fieldName === "trunkAccess" ) {
							if ( phoneNumberModel.areaCode === undefined && phoneNumberModel.serviceCode === undefined && phoneNumberModel.mobilePrefix === undefined ) {
								templates = "X";
							}
						}
						// console.info("formatPhoneNumber: formatting field " + fieldName);
						temp = Globalization.Phone._substituteDigits(phoneNumberModel[fieldName], templates, (fieldName == "subscriberNumber"));
						// console.info("formatPhoneNumber: formatted is: " + temp);
						formatted += temp;
		
						if ( fieldName === "countryCode" ) {
							// switch to the new country to format the rest of the number
							countryCode = phoneNumberModel.countryCode.replace(/[wWpPtT\+#\*]/g, '');	// fix for NOV-108200
							region = PhoneData.countryCodes[countryCode];
							regionSettings = Globalization.Phone._loadFormatsFile(region);
							if ( phoneNumberModel.mobilePrefix !== undefined ) {
								format = regionSettings.phoneNumberFormats.styles.internationalmobile;
							} else {
								format = regionSettings.phoneNumberFormats.styles.international;
							}
		
							// console.info("formatPhoneNumber: switching to region " + region + " and style " + style + " to format the rest of the number ");
						}
					} else {
						console.warn("Globalization.Format._formatPhoneNumberWithParams: cannot find format template for field " + fieldName + ", region " + region + ", style " + style);
						// use default of "minimal formatting" so we don't miss parts because of bugs in the format templates
						formatted += phoneNumberModel[fieldName];
					}
				}
			}
		}
	} catch ( e ) {
		if ( typeof(e) === 'string' ) { 
			//console.warn("caught exception: " + e + ". Using last resort rule.");
			// if there was some exception, use this last resort rule
			formatted = "";
	
			for ( var field2 in PhoneData.fieldOrder ) {
				if ( typeof field2 === 'string' && typeof PhoneData.fieldOrder[field2] === 'string' && phoneNumberModel[PhoneData.fieldOrder[field2]] !== undefined ) {
					// just concatenate without any formatting
					formatted += phoneNumberModel[PhoneData.fieldOrder[field2]];
					if ( PhoneData.fieldOrder[field2] === 'countryCode' ) {
						formatted += ' ';		// fix for NOV-107894
					}
				}
			}
		} else {
			throw e;
		}
	}
	// console.info("formatPhoneNumber: final result is " + formatted );

	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);
	
	return formatted;
};

/**
 * Globalization.Format.formatPhoneNumber(phoneNumberModel, locale, style) -> String
 * - phoneNumberModel (Object): model containing the phone number fields, as
 *   returned by [[Globalization.Phone.parsePhoneNumber]]
 * - params (Object): an object containing zero or more of the following parameters (optional)
 *   - locale (String): locale to use to format this number, or undefined to use the
 *     default locale (optional)
 *   - style (String): the name of style to use to format this number, or undefined to use the
 *     default style (optional)
 *   - mcc (String): the MCC of the country to use if the number is a local number and
 *     the country code is not known (optional)
 *   - partial (Boolean): whether or not this phone number represents a partial number. The
 *     default is false, which means the number represents a whole number (optional)
 *
 * Format the parts of a phone number appropriately for the given region. Some
 * regions have more than one style of formatting, and the style parameter
 * selects which style the user prefers. The style names can be found by calling 
 * Globalization.Format.getPhoneFormatExamples().
 * 
 * If the MCC is given, numbers will be formatted in the style of the country
 * specified by the MCC. If it is not given, but the locale is, the style of
 * the country in the locale will be used. If neither the locale or MCC are not given,
 * then the country of the formats region for the current device is used. 
 *
 * The partial parameter specifies whether or not the phone number model contains
 * a partial phone number or if the caller thinks it is a whole phone number. The
 * reason is that for certain phone numbers, they should be formatted differently
 * depending on whether or not it represents a whole number. Specifically, SMS
 * short codes are formatted differently. Example: a subscriber number of "48773" in 
 * the US would get formatted as:
 * 
 *   - partial: 487-73  (perhaps the user is on the way to typing a whole number such as 487-7379)
 *   - whole:   48773   (SMS short code)
 * 
 * Any piece of the UI where the user types in numbers, such as the keypad in the phone app, should
 * pass in partial: true to this formatting routine. All other places, such as the call log in
 * the phone app, should pass in partial: false, or leave the partial flag out of the parameters
 * entirely. 
 * 
 * Returns the formatted phone number as a string.
 **/
Globalization.Format.formatPhoneNumber = function formatPhoneNumber(phoneNumberModel, locale, style, mcc) {
	var params;
	
	if ( typeof(phoneNumberModel) !== 'object' ) {
		// can't do anything with this...
		return "";
	}
	
	if ( typeof(locale) === 'object' ) {
		params = locale;
	} else {
		// support old style parameters by converting them to new-style ones
		params = {};
		
		if ( locale ) {
			params.locale = locale;
		}
		if ( mcc ) {
			params.mcc = mcc;
		}
		if ( style ) {
			params.style = style;
		}
	}
	
	return Globalization.Format._formatPhoneNumberWithParams(phoneNumberModel, params);
};
