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

/*globals Globalization Foundations palmGetResource console _ */

var PhoneData = {};	// data specific to the phone part of the globalization library

Globalization.Phone._getCharacterCode = function _getCharacterCode(ch, validChars)
{
	if ( ch >= '0' && ch <= '9' ) {
		return ch - '0';
	}
	switch ( ch ) {
	case '+':
		return 10;
	case '*':
		return 11;
	case '#':
		return 12;
	case '^':
		return 13;
	case 'p':		// pause chars
	case 'P':
	case 't':
	case 'T':
	case 'w':
	case 'W':
		return -1;
	case 'x':
	case 'X':		// extension char
		return -1;
	}
	return -2;
};

Globalization.Phone._stripFormatting = function _stripFormatting(str)
{
	var ret = "";
	var i;
	
	for ( i = 0; i < str.length; i++ ) {
		if ( Globalization.Phone._getCharacterCode(str.charAt(i)) >= -1 ) {
			ret += str.charAt(i);
		}
	}
	
	return ret;
};

Globalization.Phone.Handler = Foundations.Class.create({
	initialize: function() {},
	
	processSubscriberNumber: function(number, fields, regionSettings) {
		var last;
		
		last = number.search(/[xwtp]/i);	// last digit of the local number

		if ( last > -1 ) {
			if ( last > 0 ) {
				fields.subscriberNumber = number.substring(0, last);
			}
			// strip x's which are there to indicate a break between the local subscriber number and the extension, but
			// are not themselves a dialable character
			fields.extension = number.substring(last).replace('x', '');
		} else {
			fields.subscriberNumber = number;
		}
		
		if (regionSettings.phoneNumberFormats.fieldLengths && 
				regionSettings.phoneNumberFormats.fieldLengths.maxLocalLength &&
				fields.subscriberNumber &&
				fields.subscriberNumber.length > regionSettings.phoneNumberFormats.fieldLengths.maxLocalLength) {
			fields.invalid = true;
		}
	},
	
	processFieldWithSubscriberNumber: function(fieldName, length, number, currentChar, fields, regionSettings, noExtractTrunk) {
		var ret, end, last;
		
		last = number.search(/[xwtp]/i);	// last digit of the local number
		
		if ( length !== undefined && length > 0 ) {
			// fixed length
			end = length;
			if ( regionSettings.phoneNumberFormats.trunkCode === "0" && number.charAt(0) === "0" ) {
				end += regionSettings.phoneNumberFormats.trunkCode.length;  // also extract the trunk access code
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - length;
		}
		
		if ( fields[fieldName] !== undefined ) {
			// we have a spurious recognition, because this number already contains that field! So, just put
			// everything into the subscriberNumber as the default
			this.processSubscriberNumber(number, fields, regionSettings);
		} else {
			// substring() extracts the part of the string up to but not including the end character,
			// so add one to compensate
			if ( !noExtractTrunk && regionSettings.phoneNumberFormats.trunkCode === "0" && number.charAt(0) === "0" ) {
				fields.trunkAccess = number.charAt(0);
				fields[fieldName] = number.substring(1, end);
			} else {
				fields[fieldName] = number.substring(0, end);
			}
			
			if ( number.length > end ) {
				this.processSubscriberNumber(number.substring(end), fields, regionSettings);
			}
		}
		
		ret = {
			number: ""
		};

		return ret;
	},

	processField: function(fieldName, length, number, currentChar, fields, regionSettings) {
		var ret = {}, end;
		
		if ( length !== undefined && length > 0 ) {
			// fixed length
			end = length;
			if ( regionSettings.phoneNumberFormats.trunkCode === "0" && number.charAt(0) === "0" ) {
				end += regionSettings.phoneNumberFormats.trunkCode.length;  // also extract the trunk access code
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - length;
		}
		
		if ( fields[fieldName] !== undefined ) {
			// we have a spurious recognition, because this number already contains that field! So, just put
			// everything into the subscriberNumber as the default
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			// substring() extracts the part of the string up to but not including the end character,
			// so add one to compensate
			if ( regionSettings.phoneNumberFormats.trunkCode === "0" && number.charAt(0) === "0" ) {
				fields.trunkAccess = number.charAt(0);
				fields[fieldName] = number.substring(1, end);
				ret.skipTrunk = true;
			} else {
				fields[fieldName] = number.substring(0, end);
			}
			
			ret.number = (number.length > end) ? number.substring(end) : "";
		}
		
		return ret;
	},

	trunk: function(number, currentChar, fields, regionSettings) {
		var ret, trunkLength;
		
		if ( fields.trunkAccess !== undefined ) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			number = "";
		} else {
			trunkLength = regionSettings.phoneNumberFormats.trunkCode.length;
			fields.trunkAccess = number.substring(0, trunkLength);
			number = (number.length > trunkLength) ? number.substring(trunkLength) : "";
		}
		
		ret = {
			number: number
		};
		
		return ret;
	},

	plus: function(number, currentChar, fields, regionSettings) {
		var ret = {};
		
		if ( fields.iddPrefix !== undefined ) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			// found the idd prefix, so save it and cause the function to parse the next part
			// of the number with the idd table
			fields.iddPrefix = number.substring(0, 1);
	
			ret = {
				number: number.substring(1),
				push: 'idd'    // shared subtable that parses the country code
			};
		}		
		return ret;
	},
	
	idd: function(number, currentChar, fields, regionSettings) {
		var ret = {};
		
		if ( fields.iddPrefix !== undefined ) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			// found the idd prefix, so save it and cause the function to parse the next part
			// of the number with the idd table
			fields.iddPrefix = number.substring(0, currentChar+1);
	
			ret = {
				number: number.substring(currentChar+1),
				push: 'idd'    // shared subtable that parses the country code
			}
		}
		
		return ret;
	},
	
	country: function(number, currentChar, fields, regionSettings) {
		var ret, countryName, region;
		
		// found the country code of an IDD number, so save it and cause the function to 
		// parse the rest of the number with the regular table for this locale
		fields.countryCode = number.substring(0, currentChar+1);
		countryName = PhoneData.countryCodes[fields.countryCode];
		region = Globalization.Phone._getNormalizedPhoneRegion(countryName);
		
		// console.log("Found country code " + fields.countryCode + ". Switching to country " + countryName + " to parse the rest of the number");
		
		ret = {
			number: number.substring(currentChar+1),
			push: region
		};
		
		return ret;
	},

	cic: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.phoneNumberFormats.fieldLengths.cic, number, currentChar, fields, regionSettings);
	},

	service: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.phoneNumberFormats.fieldLengths.serviceCode, number, currentChar, fields, regionSettings);
	},

	area: function(number, currentChar, fields, regionSettings) {
		var ret, last, end, localLength;
		
		last = number.search(/[xwtp]/i);	// last digit of the local number
		localLength = (last > -1) ? last : number.length;

		if ( regionSettings.phoneNumberFormats.fieldLengths.areaCode > 0 ) {
			// fixed length
			end = regionSettings.phoneNumberFormats.fieldLengths.areaCode;
			if ( regionSettings.phoneNumberFormats.trunkCode === number.charAt(0) ) {
				end += regionSettings.phoneNumberFormats.trunkCode.length;  // also extract the trunk access code
				localLength -= regionSettings.phoneNumberFormats.trunkCode.length;
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - regionSettings.phoneNumberFormats.fieldLengths.areaCode;
		}
		
		// substring() extracts the part of the string up to but not including the end character,
		// so add one to compensate
		if ( regionSettings.phoneNumberFormats.trunkCode === number.charAt(0) ) {
			fields.trunkAccess = number.charAt(0);
			if ( number.length > 1 ) {
				fields.areaCode = number.substring(1, end);
			}
			if ( number.length > end ) {
				this.processSubscriberNumber(number.substring(end), fields, regionSettings);
			}
		} else if ( regionSettings.phoneNumberFormats.fieldLengths.maxLocalLength !== undefined ) {
			if ( fields.trunkAccess !== undefined || fields.mobilePrefix !== undefined ||
					fields.countryCode !== undefined ||
					localLength > regionSettings.phoneNumberFormats.fieldLengths.maxLocalLength ) {
				// too long for a local number by itself, or a different final state already parsed out the trunk
				// or mobile prefix, then consider the rest of this number to be an area code + part of the subscriber number
				fields.areaCode = number.substring(0, end);
				if ( number.length > end ) {
					this.processSubscriberNumber(number.substring(end), fields, regionSettings);
				}
			} else {
				// shorter than the length needed for a local number, so just consider it a local number
				this.processSubscriberNumber(number, fields, regionSettings);
			}
		} else {
			fields.areaCode = number.substring(0, end);
			if ( number.length > end ) {
				this.processSubscriberNumber(number.substring(end), fields, regionSettings);
			}
		}
		
		// extensions are separated from the number by a dash in Germany
		if (regionSettings.phoneNumberFormats.findExtensions !== undefined && fields.subscriberNumber !== undefined) {
			var dash = fields.subscriberNumber.indexOf("-");
			if (dash > -1) {
				fields.subscriberNumber = fields.subscriberNumber.substring(0, dash);
				fields.extension = fields.subscriberNumber.substring(dash+1);
			}
		}

		ret = {
			number: ""
		};

		return ret;
	},
	
	none: function(number, currentChar, fields, regionSettings) {
		var ret;
		
		// this is a last resort function that is called when nothing is recognized.
		// When this happens, just put the whole stripped number into the subscriber number
		if ( regionSettings.phoneNumberFormats && number.charAt(0) === regionSettings.phoneNumberFormats.trunkCode ) {
			fields.trunkAccess = number.charAt(0);
			number = number.substring(1);
			//currentChar--;
		} 
			
		if (number.length > 0) {
			this.processSubscriberNumber(number, fields, regionSettings);
			if ( currentChar > 0 && currentChar < number.length ) {
				// if we were part-way through parsing, and we hit an invalid digit,
				// indicate that the number could not be parsed properly
				fields.invalid = true;
			}
		}
		
		ret = {
			number: ""        // indicate that there is nothing left to parse
		};
		
		return ret;
	},
	
	vsc: function(number, currentChar, fields, regionSettings) {
		var ret, length;

		if ( fields.vsc === undefined ) {
			length = regionSettings.phoneNumberFormats.fieldLengths.vsc || 0;
			if ( length !== undefined && length > 0 ) {
				// fixed length
				end = length;
			} else {
				// variable length
				// the setting is the negative of the length to add, so subtract to make it positive
				end = currentChar + 1 - length;
			}
			
			// found a VSC code (ie. a "star code"), so save it and cause the function to 
			// parse the rest of the number with the same table for this locale
			fields.vsc = number.substring(0, end);
			number = (number.length > end) ? "^" + number.substring(end) : "";
		} else {
			// got it twice??? Okay, this is a bogus number then. Just put everything else into the subscriber number as the default
			this.processSubscriberNumber(number, fields, regionSettings);
			number = "";
		}

		// treat the rest of the number as if it were a completely new number
		ret = {
			number: number
		};

		return ret;
	},
	
	cell: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('mobilePrefix', regionSettings.phoneNumberFormats.fieldLengths.mobilePrefix, number, currentChar, fields, regionSettings);
	},
	
	personal: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.phoneNumberFormats.fieldLengths.personal, number, currentChar, fields, regionSettings);
	},
	
	emergency: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('emergency', regionSettings.phoneNumberFormats.fieldLengths.emergency, number, currentChar, fields, regionSettings, true);
	},
	
	premium: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.phoneNumberFormats.fieldLengths.premium, number, currentChar, fields, regionSettings);
	},
	
	special: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.phoneNumberFormats.fieldLengths.special, number, currentChar, fields, regionSettings);
	},
	
	service2: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.phoneNumberFormats.fieldLengths.service2, number, currentChar, fields, regionSettings);
	},
	
	service3: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.phoneNumberFormats.fieldLengths.service3, number, currentChar, fields, regionSettings);
	},
	
	service4: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.phoneNumberFormats.fieldLengths.service4, number, currentChar, fields, regionSettings);
	},
	
	cic2: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.phoneNumberFormats.fieldLengths.cic2, number, currentChar, fields, regionSettings);
	},
	
	cic3: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.phoneNumberFormats.fieldLengths.cic3, number, currentChar, fields, regionSettings);
	},
	
	start: function(number, currentChar, fields, regionSettings) {
		// don't do anything except transition to the next state
		return {
			number: number
		};
	},
	
	local: function(number, currentChar, fields, regionSettings) {
		// in open dialling plans, we can tell that this number is a local subscriber number because it
		// starts with a digit that indicates as such
		this.processSubscriberNumber(number, fields, regionSettings);
		return {
			number: ""
		};
	}
});

Globalization.Phone.CSHandler = Foundations.Class.create(Globalization.Phone.Handler, {
	special: function(number, currentChar, fields, regionSettings) {
		var ret;
		
		// found a special area code that is both a node and a leaf. In
		// this state, we have found the leaf, so chop off the end 
		// character to make it a leaf.
		if (number.charAt(0) === "0") {
			fields.trunkAccess = number.charAt(0);
			fields.areaCode = number.substring(1, currentChar);
		} else {
			fields.areaCode = number.substring(0, currentChar);
		}
		this.processSubscriberNumber(number.substring(currentChar), fields, regionSettings);
		
		ret = {
			number: ""
		};
		
		return ret;
	}
});

Globalization.Phone.USStateHandler = Foundations.Class.create(Globalization.Phone.Handler, {
	vsc: function (number, currentChar, fields, regionSettings) {
		var ret, length, end;
	
		// found a VSC code (ie. a "star code")
		fields.vsc = number;
	
		ret = {
			number: ""
		};
	
		return ret;
	}
});

Globalization.Phone._handlerFactory = function (region, plan) {
	if (typeof(plan.contextFree) === 'boolean' && plan.contextFree === false) {
		return new Globalization.Phone.CSHandler();
	}
	region = region || "zz";
	switch (region) {
	case 'us':
		return new Globalization.Phone.USStateHandler();
		break;
	default:
		return new Globalization.Phone.Handler();
	}
};

// parsing states in the FSM tables below. First state (none) is -1, "unknown" is -2, etc.
PhoneData.states = [
	"none",
	"unknown",
	"plus",
	"idd",
	"cic",
	"service",
	"cell",
	"area",
	"vsc",
	"country",
	"personal",
	"special",
	"trunk",
	"premium",
	"emergency",
	"service2",
	"service3",
	"service4",
	"cic2",
	"cic3",
	"start",
	"local"
];

// what order should fields of the parsed phone model be formatted?
PhoneData.fieldOrder = [
	"vsc",
	"iddPrefix",
	"countryCode",
	"trunkAccess",
	"cic",
	"emergency",
	"mobilePrefix",
	"serviceCode",
	"areaCode",
	"subscriberNumber",
	"extension"
];

// maps country codes to the region code
PhoneData.countryCodes = {
	"1":	"us",		// North America and the Caribbean Islands
	"20":	"eg",		// Egypt
	"210":	"unknown",	// Unknown Country
	"211":	"unknown",	// Unknown Country
	"212":	"ma",		// Morocco, Western Sahara
	"213":	"dz",		// Algeria
	"214":	"unknown",	// Unknown Country
	"215":	"unknown",	// Unknown Country
	"216":	"tn",		// Tunisia
	"217":	"unknown",	// Unknown Country
	"218":	"ly",		// Libya
	"219":	"unknown",	// Unknown Country
	"220":	"gm",		// The Gambia
	"221":	"sn",		// Senegal
	"222":	"mr",		// Mauritania
	"223":	"ml",		// Mali
	"224":	"gn",		// Guinea
	"225":	"ci",		// Côte d'Ivoire
	"226":	"bf",		// Burkina Faso
	"227":	"ne",		// Niger
	"228":	"tg",		// Togo
	"229":	"bj",		// Benin
	"230":	"mu",		// Mauritius
	"231":	"lr",		// Liberia
	"232":	"sl",		// Sierra Leone
	"233":	"gh",		// Ghana
	"234":	"ng",		// Nigeria
	"235":	"td",		// Chad
	"236":	"cf",		// Central African Republic
	"237":	"cm",		// Cameroon
	"238":	"cv",		// Cape Verde
	"239":	"st",		// São Tomé and Príncipe
	"240":	"gq",		// Equatorial Guinea
	"241":	"ga",		// Gabon
	"242":	"cg",		// Republic of Congo
	"243":	"cd",		// Democratic Republic of the Congo
	"244":	"ao",		// Angola
	"245":	"gw",		// Guinea-Bissau
	"246":	"io",		// British Indian Ocean Territory
	"247":	"ac",		// Ascension Island
	"248":	"sc",		// Seychelles
	"249":	"sd",		// Sudan
	"250":	"rw",		// Rwanda
	"251":	"et",		// Ethiopia
	"252":	"so",		// Somalia, Somaliland
	"253":	"dj",		// Djibouti
	"254":	"ke",		// Kenya
	"255":	"tz",		// Tanzania
	"256":	"ug",		// Uganda
	"257":	"bi",		// Burundi
	"258":	"mz",		// Mozambique
	"259":	"unknown",	// Unknown Country
	"260":	"zm",		// Zambia
	"261":	"mg",		// Madagascar
	"262":	"re",		// Réunion, Mayotte
	"263":	"zw",		// Zimbabwe
	"264":	"na",		// Namibia
	"265":	"mw",		// Malawi
	"266":	"ls",		// Lesotho
	"267":	"bw",		// Botswana
	"268":	"sz",		// Swaziland
	"269":	"km",		// Comoros
	"27":	"za",		// South Africa
	"28":	"unknown",	// Unknown Country
	"290":	"sh",		// Saint Helena, Tristan da Cunha
	"291":	"er",		// Eritrea
	"292":	"unknown",	// Unknown Country
	"293":	"unknown",	// Unknown Country
	"294":	"unknown",	// Unknown Country
	"295":	"unknown",	// Unknown Country
	"296":	"unknown",	// Unknown Country
	"297":	"aw",		// Aruba
	"298":	"fo",		// Faroe Islands
	"299":	"gl",		// Greenland
	"30":	"gr",		// Greece
	"31":	"nl",		// Netherlands
	"32":	"be",		// Belgium
	"33":	"fr",		// France
	"34":	"es",		// Spain
	"350":	"gi",		// Gibraltar
	"351":	"pt",		// Portugal
	"352":	"lu",		// Luxembourg
	"353":	"ie",		// Republic of Ireland
	"354":	"is",		// Iceland
	"355":	"al",		// Albania
	"356":	"mt",		// Malta
	"357":	"cy",		// Cyprus
	"358":	"fi",		// Finland, Åland Islands
	"359":	"bg",		// Bulgaria
	"36":	"hu",		// Hungary
	"370":	"lt",		// Lithuania
	"371":	"lv",		// Latvia
	"372":	"ee",		// Estonia
	"373":	"md",		// Moldova
	"374":	"am",		// Armenia, Nagorno-Karabakh
	"375":	"by",		// Belarus
	"376":	"ad",		// Andorra
	"377":	"mc",		// Monaco
	"378":	"sm",		// San Marino
	"379":	"va",		// Vatican City
	"380":	"ua",		// Ukraine
	"381":	"rs",		// Serbia
	"382":	"me",		// Montenegro
	"383":	"unknown",	// Unknown Country
	"384":	"unknown",	// Unknown Country
	"385":	"hr",		// Croatia
	"386":	"si",		// Slovenia
	"387":	"ba",		// Bosnia and Herzegovina
	"388":	"eu",		// European Telephony Numbering Space
	"389":	"mk",		// Republic of Macedonia
	"39":	"it",		// Italy, Vatican City
	"40":	"ro",		// Romania
	"41":	"ch",		// Switzerland
	"420":	"cz",		// Czech Republic
	"421":	"sk",		// Slovakia
	"422":	"unknown",	// Unknown Country
	"423":	"li",		// Liechtenstein
	"424":	"unknown",	// Unknown Country
	"425":	"unknown",	// Unknown Country
	"426":	"unknown",	// Unknown Country
	"427":	"unknown",	// Unknown Country
	"428":	"unknown",	// Unknown Country
	"429":	"unknown",	// Unknown Country
	"43":	"at",		// Austria
	"44":	"gb",		// United Kingdom, Guernsey, Isle of Man, Jersey
	"45":	"dk",		// Denmark
	"46":	"se",		// Sweden
	"47":	"no",		// Norway, Svalbard and Jan Mayen
	"48":	"pl",		// Poland
	"49":	"de",		// Germany
	"500":	"fk",		// Falkland Islands
	"501":	"bz",		// Belize
	"502":	"gt",		// Guatemala
	"503":	"sv",		// El Salvador
	"504":	"hn",		// Honduras
	"505":	"ni",		// Nicaragua
	"506":	"cr",		// Costa Rica
	"507":	"pa",		// Panama
	"508":	"pm",		// St. Pierre and Miquelon
	"509":	"ht",		// Haiti
	"51":	"pe",		// Peru
	"52":	"mx",		// Mexico
	"53":	"cu",		// Cuba
	"54":	"ar",		// Argentina
	"55":	"br",		// Brazil
	"56":	"cl",		// Chile
	"57":	"co",		// Colombia
	"58":	"ve",		// Venezuela
	"590":	"gp",		// Guadeloupe, Saint Barthélemy, Saint Martin
	"591":	"bo",		// Bolivia
	"592":	"gy",		// Guyana
	"593":	"ec",		// Ecuador
	"594":	"gf",		// French Guiana
	"595":	"py",		// Paraguay
	"596":	"mq",		// Martinique
	"597":	"sr",		// Suriname
	"598":	"uy",		// Uruguay
	"599":	"an",		// Netherlands Antilles
	"60":	"my",		// Malaysia
	"61":	"au",		// Australia, Christmas Island, Cocos Islands
	"62":	"id",		// Indonesia
	"63":	"ph",		// Philippines
	"64":	"nz",		// New Zealand
	"65":	"sg",		// Singapore
	"66":	"th",		// Thailand
	"670":	"tl",		// East Timor
	"671":	"unknown",	// Unknown Country
	"672":	"nf",		// Norfolk Island, Australian Antarctic Territory
	"673":	"bn",		// Brunei Darussalam
	"674":	"nr",		// Nauru
	"675":	"pg",		// Papua New Guinea
	"676":	"to",		// Tonga
	"677":	"sb",		// Solomon Islands
	"678":	"vu",		// Vanuatu
	"679":	"fj",		// Fiji
	"680":	"pw",		// Palau
	"681":	"wf",		// Wallis and Futuna
	"682":	"ck",		// Cook Islands
	"683":	"nu",		// Niue
	"684":	"unknown",	// Unknown Country
	"685":	"ws",		// Samoa
	"686":	"ki",		// Kiribati
	"687":	"nc",		// New Caledonia
	"688":	"tv",		// Tuvalu
	"689":	"pf",		// French Polynesia
	"690":	"tk",		// Tokelau
	"691":	"fm",		// Federated States of Micronesia
	"692":	"mh",		// Marshall Islands
	"693":	"unknown",	// Unknown Country
	"694":	"unknown",	// Unknown Country
	"695":	"unknown",	// Unknown Country
	"696":	"unknown",	// Unknown Country
	"697":	"unknown",	// Unknown Country
	"698":	"unknown",	// Unknown Country
	"699":	"unknown",	// Unknown Country
	"7":	"ru",		// Russia, Kazakhstan
	"800":	"xt",		// Universal international freephone number
	"801":	"unknown",	// Unknown Country
	"802":	"unknown",	// Unknown Country
	"803":	"unknown",	// Unknown Country
	"804":	"unknown",	// Unknown Country
	"805":	"unknown",	// Unknown Country
	"806":	"unknown",	// Unknown Country
	"807":	"unknown",	// Unknown Country
	"808":	"xs",		// Shared Cost Service
	"809":	"unknown",	// Unknown Country
	"81":	"jp",		// Japan
	"82":	"kr",		// South Korea
	"83":	"unknown",	// Unknown Country
	"84":	"vn",		// Vietnam
	"850":	"kp",		// North Korea
	"851":	"unknown",	// Unknown Country
	"852":	"hk",		// Hong Kong
	"853":	"mo",		// Macau
	"854":	"unknown",	// Unknown Country
	"855":	"kh",		// Cambodia
	"856":	"la",		// Laos
	"857":	"unknown",	// Unknown Country
	"858":	"unknown",	// Unknown Country
	"859":	"unknown",	// Unknown Country
	"86":	"cn",		// People's Republic of China
	"870":	"xn",		// Inmarsat
	"871":	"unknown",	// Unknown Country
	"872":	"pn",		// Pitcairn
	"873":	"unknown",	// Unknown Country
	"874":	"unknown",	// Unknown Country
	"875":	"unknown",	// Unknown Country
	"876":	"unknown",	// Unknown Country
	"877":	"unknown",	// Unknown Country
	"878":	"xp",		// Universal Personal Telecommunications
	"879":	"unknown",	// Unknown Country
	"880":	"bd",		// Bangladesh
	"881":	"xg",		// Global Mobile Satellite System
	"882":	"xv",		// International Networks (unknown code)
	"883":	"xl",		// International National Rate Service
	"884":	"unknown",	// Unknown Country
	"885":	"unknown",	// Unknown Country
	"886":	"tw",		// Republic of China
	"887":	"unknown",	// Unknown Country
	"888":	"xd",		// OCHA
	"889":	"unknown",	// Unknown Country
	"89":	"unknown",	// Unknown Country
	"90":	"tr",		// Turkey, Turkish Republic of Northern Cyprus
	"91":	"in",		// India
	"92":	"pk",		// Pakistan
	"93":	"af",		// Afghanistan
	"94":	"lk",		// Sri Lanka
	"95":	"mm",		// Burma
	"960":	"mv",		// Maldives
	"961":	"lb",		// Lebanon
	"962":	"jo",		// Jordan
	"963":	"sy",		// Syria
	"964":	"iq",		// Iraq
	"965":	"kw",		// Kuwait
	"966":	"sa",		// Saudi Arabia
	"967":	"ye",		// Yemen
	"968":	"om",		// Oman
	"969":	"unknown",	// Unknown Country
	"970":	"ps",		// Palestinian Authority
	"971":	"ae",		// United Arab Emirates
	"972":	"il",		// Israel, Palestinian Authority
	"973":	"bh",		// Bahrain
	"974":	"qa",		// Qatar
	"975":	"bt",		// Bhutan
	"976":	"mn",		// Mongolia
	"977":	"np",		// Nepal
	"978":	"unknown",	// Unknown Country
	"979":	"xr",		// International premium rate service
	"98":	"ir",		// Iran
	"990":	"unknown",	// Unknown Country
	"991":	"xc",		// ITPCS
	"992":	"tj",		// Tajikistan
	"993":	"tm",		// Turkmenistan
	"994":	"az",		// Azerbaijan, Nagorno-Karabakh
	"995":	"ge",		// Georgia
	"996":	"kg",		// Kyrgyzstan
	"997":	"unknown",	// Unknown Country
	"998":	"uz",		// Uzbekistan
	"999":	"unknown"	// Unknown Country
};

// maps an MCC code to an international direct dialling country code 
PhoneData.mccToIdd = {
	"412": "93",	// Afghanistan
	"276": "355",	// Albania
	"603": "213",	// Algeria
	"544": "1",		// American Samoa (US)
	"213": "376",	// Andorra
	"631": "244",	// Angola
	"365": "1",		// Anguilla
	"344": "1",		// Antigua and Barbuda
	"722": "54",	// Argentine Republic
	"283": "374",	// Armenia
	"363": "297",	// Aruba (Netherlands)
	"505": "61",	// Australia
	"232": "43",	// Austria
	"400": "994",	// Azerbaijani Republic
	"364": "1",		// Bahamas
	"426": "973",	// Bahrain
	"470": "880",	// Bangladesh
	"342": "1",		// Barbados
	"257": "375",	// Belarus
	"206": "32",	// Belgium
	"702": "501",	// Belize
	"616": "229",	// Benin
	"350": "1",		// Bermuda (UK)
	"402": "975",	// Bhutan
	"736": "591",	// Bolivia
	"218": "387",	// Bosnia and Herzegovina
	"652": "267",	// Botswana
	"724": "55",	// Brazil
	"348": "1",		// British Virgin Islands (UK)
	"528": "673",	// Brunei Darussalam
	"284": "359",	// Bulgaria
	"613": "226",	// Burkina Faso
	"642": "257",	// Burundi
	"456": "855",	// Cambodia
	"624": "237",	// Cameroon
	"302": "1",		// Canada
	"625": "238",	// Cape Verde
	"346": "1",		// Cayman Islands (UK)
	"623": "236",	// Central African Republic
	"622": "235",	// Chad
	"730": "56",	// Chile
	"460": "86",	// China
	"732": "57",	// Colombia
	"654": "269",	// Comoros
	"629": "242",	// Republic of the Congo
	"548": "682",	// Cook Islands (NZ)
	"712": "506",	// Costa Rica
	"612": "225",	// Côte d'Ivoire
	"219": "385",	// Croatia
	"368": "53",	// Cuba
	"280": "357",	// Cyprus
	"230": "420",	// Czech Republic
	"630": "243",	// Democratic Republic of the Congo
	"238": "45",	// Denmark
	"638": "253",	// Djibouti
	"366": "1",		// Dominica
	"370": "1",		// Dominican Republic
	"514": "670",	// East Timor
	"740": "593",	// Ecuador
	"602": "20",	// Egypt
	"706": "503",	// El Salvador
	"627": "240",	// Equatorial Guinea
	"657": "291",	// Eritrea
	"248": "372",	// Estonia
	"636": "251",	// Ethiopia
	"750": "500",	// Falkland Islands (Malvinas)
	"288": "298",	// Faroe Islands (Denmark)
	"542": "679",	// Fiji
	"244": "358",	// Finland
	"208": "33",	// France
	"742": "594",	// French Guiana (France)
	"547": "689",	// French Polynesia (France)
	"628": "241",	// Gabonese Republic
	"607": "220",	// Gambia
	"282": "995",	// Georgia
	"262": "49",	// Germany
	"620": "233",	// Ghana
	"266": "350",	// Gibraltar (UK)
	"202": "30",	// Greece
	"290": "299",	// Greenland (Denmark)
	"352": "1",		// Grenada
	"340": "590",	// Guadeloupe (France)
	"535": "1",		// Guam (US)
	"704": "502",	// Guatemala
	"611": "224",	// Guinea
	"632": "245",	// Guinea-Bissau
	"738": "592",	// Guyana
	"372": "509",	// Haiti
	"708": "504",	// Honduras
	"454": "852",	// Hong Kong (PRC)
	"216": "36",	// Hungary
	"274": "354",	// Iceland
	"404": "91",	// India
	"405": "91",	// India
	"510": "62",	// Indonesia
	"432": "98",	// Iran
	"418": "964",	// Iraq
	"272": "353",	// Ireland
	"425": "972",	// Israel
	"222": "39",	// Italy
	"338": "1",		// Jamaica
	"441": "81",	// Japan
	"440": "81",	// Japan
	"416": "962",	// Jordan
	"401": "7",		// Kazakhstan
	"639": "254",	// Kenya
	"545": "686",	// Kiribati
	"467": "850",	// Korea, North
	"450": "82",	// Korea, South
	"419": "965",	// Kuwait
	"437": "996",	// Kyrgyz Republic
	"457": "856",	// Laos
	"247": "371",	// Latvia
	"415": "961",	// Lebanon
	"651": "266",	// Lesotho
	"618": "231",	// Liberia
	"606": "218",	// Libya
	"295": "423",	// Liechtenstein
	"246": "370",	// Lithuania
	"270": "352",	// Luxembourg
	"455": "853",	// Macau (PRC)
	"294": "389",	// Republic of Macedonia
	"646": "261",	// Madagascar
	"650": "265",	// Malawi
	"502": "60",	// Malaysia
	"472": "960",	// Maldives
	"610": "223",	// Mali
	"278": "356",	// Malta
	"551": "692",	// Marshall Islands
	"340": "596",	// Martinique (France)
	"609": "222",	// Mauritania
	"617": "230",	// Mauritius
	"334": "52",	// Mexico
	"550": "691",	// Federated States of Micronesia
	"259": "373",	// Moldova
	"212": "377",	// Monaco
	"428": "976",	// Mongolia
	"297": "382",	// Montenegro (Republic of)
	"354": "1",		// Montserrat (UK)
	"604": "212",	// Morocco
	"643": "258",	// Mozambique
	"414": "95",	// Myanmar
	"649": "264",	// Namibia
	"536": "674",	// Nauru
	"429": "977",	// Nepal
	"204": "31",	// Netherlands
	"362": "599",	// Netherlands Antilles (Netherlands)
	"546": "687",	// New Caledonia (France)
	"530": "64",	// New Zealand
	"710": "505",	// Nicaragua
	"614": "227",	// Niger
	"621": "234",	// Nigeria
	"534": "1",		// Northern Mariana Islands (US)
	"242": "47",	// Norway
	"422": "968",	// Oman
	"410": "92",	// Pakistan
	"552": "680",	// Palau
	"423": "970",	// Palestine
	"714": "507",	// Panama
	"537": "675",	// Papua New Guinea
	"744": "595",	// Paraguay
	"716": "51",	// Perú
	"515": "63",	// Philippines
	"260": "48",	// Poland
	"268": "351",	// Portugal
	"330": "1",		// Puerto Rico (US)
	"427": "974",	// Qatar
	"647": "262",	// Réunion (France)
	"226": "40",	// Romania
	"250": "7",		// Russian Federation
	"635": "250",	// Rwandese Republic
	"356": "1",		// Saint Kitts and Nevis
	"358": "1",		// Saint Lucia
	"308": "508",	// Saint Pierre and Miquelon (France)
	"360": "1",		// Saint Vincent and the Grenadines
	"549": "685",	// Samoa
	"292": "378",	// San Marino
	"626": "239",	// São Tomé and Príncipe
	"420": "966",	// Saudi Arabia
	"608": "221",	// Senegal
	"220": "381",	// Serbia (Republic of)
	"633": "248",	// Seychelles
	"619": "232",	// Sierra Leone
	"525": "65",	// Singapore
	"231": "421",	// Slovakia
	"293": "386",	// Slovenia
	"540": "677",	// Solomon Islands
	"637": "252",	// Somalia
	"655": "27",	// South Africa
	"214": "34",	// Spain
	"413": "94",	// Sri Lanka
	"634": "249",	// Sudan
	"746": "597",	// Suriname
	"653": "268",	// Swaziland
	"240": "46",	// Sweden
	"228": "41",	// Switzerland
	"417": "963",	// Syria
	"466": "886",	// Taiwan
	"436": "992",	// Tajikistan
	"640": "255",	// Tanzania
	"520": "66",	// Thailand
	"615": "228",	// Togolese Republic
	"539": "676",	// Tonga
	"374": "1",		// Trinidad and Tobago
	"605": "216",	// Tunisia
	"286": "90",	// Turkey
	"438": "993",	// Turkmenistan
	"376": "1",		// Turks and Caicos Islands (UK)
	"641": "256",	// Uganda
	"255": "380",	// Ukraine
	"424": "971",	// United Arab Emirates
	"430": "971",	// United Arab Emirates (Abu Dhabi)
	"431": "971",	// United Arab Emirates (Dubai)
	"235": "44",	// United Kingdom
	"234": "44",	// United Kingdom
	"310": "1",		// United States of America
	"311": "1",		// United States of America
	"312": "1",		// United States of America
	"313": "1",		// United States of America
	"314": "1",		// United States of America
	"315": "1",		// United States of America
	"316": "1",		// United States of America
	"332": "1",		// United States Virgin Islands (US)
	"748": "598",	// Uruguay
	"434": "998",	// Uzbekistan
	"541": "678",	// Vanuatu
	"225": "379",	// Vatican City State
	"734": "58",	// Venezuela
	"452": "84",	// Viet Nam
	"543": "681",	// Wallis and Futuna (France)
	"421": "967",	// Yemen
	"645": "260",	// Zambia
	"648": "263"	// Zimbabwe
};

// maps from an MCC to a 2 letter country code
PhoneData.mccToCountry = {
	"412": "af",	// Afghanistan
	"276": "al",	// Albania
	"603": "dz",	// Algeria
	"544": "as",	// American Samoa (US)
	"213": "ad",	// Andorra
	"631": "ao",	// Angola
	"365": "ai",	// Anguilla
	"344": "ag",	// Antigua and Barbuda
	"722": "ar",	// Argentine Republic
	"283": "am",	// Armenia
	"363": "aw",	// Aruba (Netherlands)
	"505": "au",	// Australia
	"232": "at",	// Austria
	"400": "az",	// Azerbaijani Republic
	"364": "bs",	// Bahamas
	"426": "bh",	// Bahrain
	"470": "bd",	// Bangladesh
	"342": "bb",	// Barbados
	"257": "by",	// Belarus
	"206": "be",	// Belgium
	"702": "bz",	// Belize
	"616": "bj",	// Benin
	"350": "bm",	// Bermuda (UK)
	"402": "bt",	// Bhutan
	"736": "bo",	// Bolivia
	"218": "ba",	// Bosnia and Herzegovina
	"652": "bw",	// Botswana
	"724": "br",	// Brazil
	"348": "vg",	// British Virgin Islands (UK)
	"528": "bn",	// Brunei Darussalam
	"284": "bg",	// Bulgaria
	"613": "bf",	// Burkina Faso
	"642": "bi",	// Burundi
	"456": "kh",	// Cambodia
	"624": "cm",	// Cameroon
	"302": "ca",	// Canada
	"625": "cv",	// Cape Verde
	"346": "ky",	// Cayman Islands (UK)
	"623": "cf",	// Central African Republic
	"622": "td",	// Chad
	"730": "cl",	// Chile
	"460": "cn",	// China
	"732": "co",	// Colombia
	"654": "km",	// Comoros
	"629": "cg",	// Republic of the Congo
	"548": "ck",	// Cook Islands (NZ)
	"712": "cr",	// Costa Rica
	"612": "ci",	// Côte d'Ivoire
	"219": "hr",	// Croatia
	"368": "cu",	// Cuba
	"280": "cy",	// Cyprus
	"230": "cz",	// Czech Republic
	"630": "cd",	// Democratic Republic of the Congo
	"238": "dk",	// Denmark
	"638": "dj",	// Djibouti
	"366": "dm",	// Dominica
	"370": "do",	// Dominican Republic
	"514": "tl",	// East Timor
	"740": "ec",	// Ecuador
	"602": "eg",	// Egypt
	"706": "sv",	// El Salvador
	"627": "gq",	// Equatorial Guinea
	"657": "er",	// Eritrea
	"248": "ee",	// Estonia
	"636": "et",	// Ethiopia
	"750": "fk",	// Falkland Islands (Malvinas)
	"288": "fo",	// Faroe Islands (Denmark)
	"542": "fj",	// Fiji
	"244": "fi",	// Finland
	"208": "fr",	// France
	"742": "gf",	// French Guiana (France)
	"547": "pf",	// French Polynesia (France)
	"628": "ga",	// Gabonese Republic
	"607": "gm",	// Gambia
	"282": "ge",	// Georgia
	"262": "de",	// Germany
	"620": "gh",	// Ghana
	"266": "gi",	// Gibraltar (UK)
	"202": "gr",	// Greece
	"290": "gl",	// Greenland (Denmark)
	"352": "gd",	// Grenada
	"340": "gp",	// Guadeloupe (France)
	"535": "gu",	// Guam (US)
	"704": "gt",	// Guatemala
	"611": "gn",	// Guinea
	"632": "gw",	// Guinea-Bissau
	"738": "gy",	// Guyana
	"372": "ht",	// Haiti
	"708": "hn",	// Honduras
	"454": "hk",	// Hong Kong (PRC)
	"216": "hu",	// Hungary
	"274": "is",	// Iceland
	"404": "in",	// India
	"405": "in",	// India
	"510": "id",	// Indonesia
	"432": "ir",	// Iran
	"418": "iq",	// Iraq
	"272": "ie",	// Ireland
	"425": "il",	// Israel
	"222": "it",	// Italy
	"338": "jm",	// Jamaica
	"441": "jp",	// Japan
	"440": "jp",	// Japan
	"416": "jo",	// Jordan
	"401": "kz",	// Kazakhstan
	"639": "ke",	// Kenya
	"545": "ki",	// Kiribati
	"467": "kp",	// Korea, North
	"450": "kr",	// Korea, South
	"419": "kw",	// Kuwait
	"437": "kg",	// Kyrgyz Republic
	"457": "la",	// Laos
	"247": "lv",	// Latvia
	"415": "lb",	// Lebanon
	"651": "ls",	// Lesotho
	"618": "lr",	// Liberia
	"606": "ly",	// Libya
	"295": "li",	// Liechtenstein
	"246": "lt",	// Lithuania
	"270": "lu",	// Luxembourg
	"455": "mo",	// Macau (PRC)
	"294": "mk",	// Republic of Macedonia
	"646": "mg",	// Madagascar
	"650": "mw",	// Malawi
	"502": "my",	// Malaysia
	"472": "mv",	// Maldives
	"610": "ml",	// Mali
	"278": "mt",	// Malta
	"551": "mh",	// Marshall Islands
	"340": "mq",	// Martinique (France)
	"609": "mr",	// Mauritania
	"617": "mu",	// Mauritius
	"334": "mx",	// Mexico
	"550": "fm",	// Federated States of Micronesia
	"259": "md",	// Moldova
	"212": "mc",	// Monaco
	"428": "mn",	// Mongolia
	"297": "me",	// Montenegro (Republic of)
	"354": "ms",	// Montserrat (UK)
	"604": "ma",	// Morocco
	"643": "mz",	// Mozambique
	"414": "mm",	// Myanmar
	"649": "na",	// Namibia
	"536": "nr",	// Nauru
	"429": "np",	// Nepal
	"204": "nl",	// Netherlands
	"362": "an",	// Netherlands Antilles (Netherlands)
	"546": "nc",	// New Caledonia (France)
	"530": "nz",	// New Zealand
	"710": "ni",	// Nicaragua
	"614": "ne",	// Niger
	"621": "ng",	// Nigeria
	"534": "mp",	// Northern Mariana Islands (US)
	"242": "no",	// Norway
	"422": "om",	// Oman
	"410": "pk",	// Pakistan
	"552": "pw",	// Palau
	"423": "ps",	// Palestine
	"714": "pa",	// Panama
	"537": "pg",	// Papua New Guinea
	"744": "py",	// Paraguay
	"716": "pe",	// Perú
	"515": "ph",	// Philippines
	"260": "pl",	// Poland
	"268": "pt",	// Portugal
	"330": "pr",	// Puerto Rico (US)
	"427": "qa",	// Qatar
	"647": "re",	// Réunion (France)
	"226": "ro",	// Romania
	"250": "ru",	// Russian Federation
	"635": "rw",	// Rwandese Republic
	"356": "kn",	// Saint Kitts and Nevis
	"358": "lc",	// Saint Lucia
	"308": "pm",	// Saint Pierre and Miquelon (France)
	"360": "vc",	// Saint Vincent and the Grenadines
	"549": "ws",	// Samoa
	"292": "sm",	// San Marino
	"626": "st",	// São Tomé and Príncipe
	"420": "sa",	// Saudi Arabia
	"608": "sn",	// Senegal
	"220": "rs",	// Serbia (Republic of)
	"633": "sc",	// Seychelles
	"619": "sl",	// Sierra Leone
	"525": "sg",	// Singapore
	"231": "sk",	// Slovakia
	"293": "si",	// Slovenia
	"540": "sb",	// Solomon Islands
	"637": "so",	// Somalia
	"655": "za",	// South Africa
	"214": "es",	// Spain
	"413": "lk",	// Sri Lanka
	"634": "sd",	// Sudan
	"746": "sr",	// Suriname
	"653": "sz",	// Swaziland
	"240": "se",	// Sweden
	"228": "ch",	// Switzerland
	"417": "sy",	// Syria
	"466": "tw",	// Taiwan
	"436": "tj",	// Tajikistan
	"640": "tz",	// Tanzania
	"520": "th",	// Thailand
	"615": "tg",	// Togolese Republic
	"539": "to",	// Tonga
	"374": "tt",	// Trinidad and Tobago
	"605": "tn",	// Tunisia
	"286": "tr",	// Turkey
	"438": "tm",	// Turkmenistan
	"376": "tc",	// Turks and Caicos Islands (UK)
	"641": "ug",	// Uganda
	"255": "ua",	// Ukraine
	"424": "ae",	// United Arab Emirates
	"430": "ae",	// United Arab Emirates (Abu Dhabi)
	"431": "ae",	// United Arab Emirates (Dubai)
	"235": "gb",	// United Kingdom
	"234": "gb",	// United Kingdom
	"310": "us",	// United States of America
	"311": "us",	// United States of America
	"312": "us",	// United States of America
	"313": "us",	// United States of America
	"314": "us",	// United States of America
	"315": "us",	// United States of America
	"316": "us",	// United States of America
	"332": "vi",	// United States Virgin Islands (US)
	"748": "uy",	// Uruguay
	"434": "uz",	// Uzbekistan
	"541": "vu",	// Vanuatu
	"225": "va",	// Vatican City State
	"734": "ve",	// Venezuela
	"452": "vn",	// Viet Nam
	"543": "wf",	// Wallis and Futuna (France)
	"421": "ye",	// Yemen
	"645": "zm",	// Zambia
	"648": "zw"		// Zimbabwe
};

// maps from area codes within dialling plans to ISO country code
PhoneData.AreaToCountryCode = {
	"1": {
		"default": "us",
		"204": "ca", // Canada
		"226": "ca", // Canada
		"242": "bs", // Bahamas
		"246": "bb", // Barbados
		"250": "ca", // Canada
		"264": "ai", // Anguilla
		"268": "ag", // Antigua
		"268": "ag", // Barbuda
		"284": "vg", // Virgin Islands, British
		"289": "ca", // Canada
		"306": "ca", // Canada
		"340": "vi", // Virgin Islands, U.S.
		"343": "ca", // Canada
		"345": "ky", // Cayman Islands
		"403": "ca", // Canada
		"416": "ca", // Canada
		"418": "ca", // Canada
		"438": "ca", // Canada
		"441": "bm", // Bermuda
		"450": "ca", // Canada
		"473": "gd", // Grenada
		"506": "ca", // Canada
		"514": "ca", // Canada
		"519": "ca", // Canada
		"579": "ca", // Canada
		"581": "ca", // Canada
		"587": "ca", // Canada
		"587": "ca", // Canada
		"604": "ca", // Canada
		"613": "ca", // Canada
		"647": "ca", // Canada
		"649": "tc", // Turks and Caicos Islands
		"664": "ms", // Montserrat
		"670": "mp", // Northern Mariana Islands, East Timor
		"671": "gu", // Guam
		"684": "as", // American Samoa 
		"705": "ca", // Canada
		"709": "ca", // Canada
		"721": "an", // Sint Maarten (Dutch Side) Delayed Introduction
		"758": "lc", // St. Lucia
		"767": "dm", // Dominica
		"778": "ca", // Canada
		"778": "ca", // Canada
		"780": "ca", // Canada
		"784": "vc", // St. Vincent and the Grenadines
		"787": "pr", // Puerto Rico 
		"807": "ca", // Canada
		"809": "do", // Dominican Republic 
		"819": "ca", // Canada
		"829": "do", // Dominican Republic
		"849": "do", // Dominican Republic
		"867": "ca", // Canada
		"868": "tt", // Trinidad and Tobago
		"869": "kn", // St. Kitts and Nevis
		"876": "jm", // Jamaica
		"902": "ca", // Canada
		"905": "ca", // Canada
		"939": "pr"  // Puerto Rico
	},
	"33": {
		"default": "fr",
		"262": "re",	// Réunion and Mayotte
		"508": "pm",	// Saint Pierre and Miquelon Islands
		"590": "gp",	// Guadaloupe Island, Saint Barthélemy, Saint Martin
		"594": "gf",	// French Guiana
		"596": "mq" 	// Martinique Island
	},
	"39": {
		"default": "it",
		"549": "sm"		// San Marino
	}
};

PhoneData.regionDialingCodes = {
//  region code: [ iddPrefix, trunkCode ]
	"ad": ["00", undefined], 	// Andorra
	"au": ["0011", "0"], 		// Australia
	"aw": ["00", undefined], 	// Aruba
	"az": ["00", "8"], 			// Azerbaijani Republic
	"bf": ["00", undefined], 	// Burkina Faso
	"bh": ["00", undefined], 	// Bahrain
	"bi": ["00", undefined], 	// Burundi
	"bj": ["00", undefined], 	// Benin
	"bo": ["00", undefined], 	// Bolivia
	"br": ["0015", "0"], 		// Brazil
	"bt": ["00", undefined], 	// Bhutan
	"bw": ["00", undefined], 	// Botswana
	"by": ["810", "8"], 		// Belarus
	"cd": ["00", undefined], 	// Democratic Republic of the Congo
	"cg": ["00", undefined], 	// Republic of the Congo
	"ci": ["00", undefined], 	// Côte d'Ivoire
	"ck": ["00", "00"], 		// Cook Islands (NZ)
	"cl": ["00", undefined], 	// Chile
	"cm": ["00", undefined], 	// Cameroon
	"co": ["00", undefined], 	// Colombia
	"cr": ["00", undefined], 	// Costa Rica
	"cu": ["119", "0"], 		// Cuba
	"cv": ["00", undefined], 	// Central African Republic
	"cv": ["0", undefined], 	// Cape Verde
	"cy": ["00", undefined], 	// Cyprus
	"cz": ["00", undefined], 	// Czech Republic
	"dj": ["00", undefined], 	// Djibouti
	"dk": ["00", undefined], 	// Denmark
	"dz": ["00", "7"], 			// Algeria
	"ec": ["00", undefined], 	// El Salvador
	"ee": ["00", undefined], 	// Estonia
	"er": ["00", "00"], 		// Eritrea
	"es": ["00", undefined], 	// Spain
	"fj": ["00", undefined], 	// Fiji
	"fm": ["011", "1"], 		// Federated States of Micronesia
	"fo": ["00", undefined], 	// Faroe Islands (Denmark)
	"fr": ["00", undefined], 	// France
	"ga": ["00", undefined], 	// Gabonese Republic
	"ge": ["810", "8"], 		// Georgia
	"gf": ["00", undefined], 	// French Guiana (France)
	"gh": ["00", undefined], 	// Ghana
	"gi": ["00", undefined], 	// Gibraltar (UK)
	"gl": ["00", undefined], 	// Greenland (Denmark)
	"gm": ["00", undefined], 	// Gambia
	"gp": ["00", undefined], 	// Guadeloupe (France)
	"gq": ["00", undefined], 	// Equatorial Guinea
	"gr": ["00", undefined], 	// Greece
	"gt": ["00", undefined], 	// Guatemala
	"gw": ["00", undefined], 	// Guinea-Bissau
	"gy": ["001", "0"], 		// Guyana
	"hk": ["001", undefined], 	// Hong Kong (PRC)
	"hu": ["00", "06"], 		// Hungary
	"id": ["001", "0"], 		// Indonesia
	"it": ["00", undefined], 	// Italy
	"it": ["00", undefined], 	// Vatican City State
	"jp": ["010", "0"], 		// Japan
	"kh": ["001", "0"], 		// Cambodia
	"km": ["00", undefined], 	// Comoros
	"kr": ["00700", undefined], // South Korea
	"li": ["00", undefined], 	// Liechtenstein
	"lr": ["00", "22"], 		// Liberia
	"lt": ["00", "8"], 			// Lithuania
	"lu": ["00", undefined], 	// Luxembourg
	"lv": ["00", undefined], 	// Latvia
	"ma": ["00", undefined], 	// Morocco
	"mh": ["011", "1"], 		// Marshall Islands
	"mm": ["00", undefined], 	// Myanmar
	"mn": ["001", "0"], 		// Mongolia
	"mt": ["00", "21"], 		// Malta
	"mu": ["020", "0"], 		// Mauritius
	"mw": ["00", undefined], 	// Malawi
	"mx": ["00", "01"], 		// Mexico
	"nc": ["00", undefined], 	// New Caledonia (France)
	"ng": ["009", "0"], 		// Nigeria
	"no": ["00", undefined],	// Norway
	"pf": ["00", undefined], 	// French Polynesia (France)
	"pg": ["5", "0"], 			// Papua New Guinea
	"pt": ["00", undefined],	// Portugal
	"pw": ["11", "0"], 			// Palau
	"py": ["2", "0"], 			// Paraguay
	"rs": ["99", "0"], 			// Serbia and Montenegro
	"ru": ["810", "8"], 		// Kazakhstan
	"ru": ["810", "8"], 		// Russian Federation
	"sg": ["001", undefined], 	// Singapore
	"so": ["00", undefined], 	// Somalia
	"sr": ["00", undefined], 	// Suriname
	"td": ["15", undefined], 	// Chad
	"th": ["001", "0"], 		// Thailand
	"tj": ["810", "8"], 		// Tajikistan
	"tl": ["00", undefined], 	// East Timor
	"tm": ["810", "8"], 		// Turkmenistan
	"to": ["00", undefined], 	// Tonga
	"tw": ["002", undefined], 	// Taiwan
	"tz": ["000", "0"], 		// Tanzania
	"ua": ["810", "8"], 		// Ukraine
	"ug": ["000", "0"],			// Uganda
	"us": ["011", "1"], 		// United States of America
	"uz": ["810", "8"], 		// Uzbekistan
	"ve": ["00", undefined], 	// Venezuela
	"wf": ["19", undefined], 	// Wallis and Futuna (France)
	"ws": ["0", "0"] 			// Samoa
};

// handles cases when we don't have parsing and formatting configuration for one of the above countries
PhoneData.unknown = {
	address: {	
		"formats": {
			"default": "#{streetAddress}\n#{locality} #{region} #{postalCode}\n#{country}",
			"nocountry": "#{streetAddress}\n#{locality} #{region} #{postalCode}"
		},
		
		"startAt": "end",
		"fields": [
			{
				"name": "postalCode",
				"line": "startAtLast",
				"pattern": "[0-9]+$"
			},
			{
				"name": "locality",
				"line": "last",
				"pattern": "[\\wÀÁÂÄÇÈÉÊËÌÍÎÏÒÓÔÙÚÛàáâçèéêëìíîïòóôùúû\\.\\-']+$"
			}
		]
	},
	handler: new Globalization.Phone.Handler(),
	phoneNumberFormats: {
	// settings that control parsing
		region: "unknown",
		skipTrunk: false,
		trunkCode: "0",
		iddCode: "00",
		dialingPlan: "closed",
		commonFormatChars: " ()-./",
		fieldLengths: {
			areaCode: 0,
			cic: 0,
			mobilePrefix: 0,
			serviceCode: 0
		},
		"styles": {
			"international": {
				"iddPrefix":        ["X", "XX "],
				"countryCode":      ["X ", "XX ", "XXX "],
				"trunkAccess":      ["X", "XX "],
				"subscriberNumber": ["X", "XX", "XXX", "XXXX", "XXXXX", "XXXXXX", "XXXXXXX", "XXXXXXXX", "XXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXXX"]
			},
			"mobile": {
				"iddPrefix":        ["X", "XX "],
				"countryCode":      ["X ", "XX ", "XXX "],
				"trunkAccess":      ["X", "XX "],
				"subscriberNumber": ["X", "XX", "XXX", "XXXX", "XXXXX", "XXXXXX", "XXXXXXX", "XXXXXXXX", "XXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXXX"]
			},
			"internationalmobile": {
				"iddPrefix":        ["X", "XX "],
				"countryCode":      ["X ", "XX ", "XXX "],
				"trunkAccess":      ["X", "XX "],
				"subscriberNumber": ["X", "XX", "XXX", "XXXX", "XXXXX", "XXXXXX", "XXXXXXX", "XXXXXXXX", "XXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXXX"]
			},
			"default": {
				"iddPrefix":        ["X", "XX "],
				"countryCode":      ["X ", "XX ", "XXX "],
				"trunkAccess":      ["X", "XX "],
				"subscriberNumber": ["X", "XX", "XXX", "XXXX", "XXXXX", "XXXXXX", "XXXXXXX", "XXXXXXXX", "XXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXXX"]
			}
		}
	},
	// Copyright (c) 2010, Palm Inc. All Rights Reserved.
	// WARNING: the following is generated by AreaCodeTableMaker. DO NOT HAND EDIT.
	stateTable: [
	    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1],
	    [2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1],
	    [-4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] 
	]
};

Globalization.Phone._getNormalizedPhoneRegion = function _getNormalizedPhoneRegion(locale)
{
	var region;

	if ( !locale ) {
		return "us";
	}
	
	region = locale.toLocaleLowerCase().slice(-2);
	
	// Map all NANP regions to the right region, so that they get parsed using the 
	// correct state table
	switch (region) {
		case "us": // usa
		case "ca": // canada
		case "ag": // antigua and barbuda
		case "bs": // bahamas
		case "bb": // barbados
		case "dm": // dominica
		case "do": // dominican republic
		case "gd": // grenada
		case "jm": // jamaica
		case "kn": // st. kitts and nevis
		case "lc": // st. lucia
		case "vc": // st. vincent and the grenadines
		case "tt": // trinidad and tobago
		case "ai": // anguilla
		case "bm": // bermuda
		case "vg": // british virgin islands
		case "ky": // cayman islands
		case "ms": // montserrat
		case "tc": // turks and caicos
		case "as": // American Samoa 
		case "vi": // Virgin Islands, U.S.
		case "pr": // Puerto Rico
		case "mp": // Northern Mariana Islands
		case "tl": // East Timor
		case "gu": // Guam
			region = "us";
			break;
		
		case "it": // italy
		case "sm": // san marino
		case "va": // vatican city
			region = "it";
			break;
			
		case "fr": // france
		case "gf": // french guiana
		case "mq": // martinique
		case "gp": // guadeloupe, 
		case "bl": // saint barthélemy
		case "mf": // saint martin
		case "re": // réunion, mayotte
			region = "fr";
			break;
			
		default:
			break;
	}
	return region;
};

Globalization.Phone._getStatesFileName = function _getStatesFileName(region)
{
	return Globalization.Locale._getFormatsPath() + region + ".states.json";
};

Globalization.Phone._getGeoFileName = function _getGeoFileName(region)
{
	return Globalization.Locale._getFormatsPath() + region + ".area.json";
};

Globalization.Phone._loadFormatsFile = function _loadFormatsFile(region)
{
	var json = Globalization.Locale._loadFormatsInfo(region);
	
	if ( !json || !json.phoneNumberFormats ) {
		json = PhoneData.unknown;
	}
	
	return json;
};

Globalization.Phone._loadStatesFile = function _loadStatesFile(region)
{
	var stateTable;
	
	try {
		stateTable = Utils.getJsonFile(Globalization.Phone._getStatesFileName(region), region);
	} catch (e3) {
		// could not read the states json -- this is okay because it may not exists for this region
		//console.log("Globalization.Phone._loadStatesFile: could not load " + Globalization.Phone._getStatesFileName(region));
	}

	if ( !stateTable ) {
		stateTable = PhoneData.unknown.stateTable;
	}
	
	return stateTable;
};

Globalization.Phone._loadGeoFile = function _loadGeoFile(region)
{
	var geoTable;
	
	try {
		geoTable = Utils.getJsonFile(Globalization.Phone._getGeoFileName(region), region);
	} catch (e3) {
		// could not read the area json -- this is okay because it may not exists for this region
		//console.log("Globalization.Phone._loadGeoFile: could not load " + Globalization.Phone._getGeoFileName(region));
	}

	return geoTable;
};

Globalization.Phone._preLoadLocaleData = function _preLoadLocaleData(region) {
	Globalization.Phone._loadStatesFile(region);
	Globalization.Phone._loadGeoFile(region);
};

// return the number as a string with the fields reserialized in the correct order
Globalization.Phone._join = function _join(phoneNumber) {
	var field, fieldName, formatted = "";
	
	if (phoneNumber) {
		try {
			for (var field in PhoneData.fieldOrder) {
				if (typeof field === 'string' && typeof PhoneData.fieldOrder[field] === 'string') {
					fieldName = PhoneData.fieldOrder[field];
					if (phoneNumber[fieldName] !== undefined) {
						formatted += phoneNumber[fieldName];
					}
				}
			}
		} catch (e) {
			console.warn("caught exception: " + e);
			throw e;
		}
	}

	return formatted;
};

Globalization.Phone._parsePhone = function _parsePhone(number, region)
{
	var i, ch;
	var state = 0;    // begin state
	var newState;
	var regionSettings;
	var stateTable;
	var handlerMethod;
	var fields = {locale: { region: region }};  // for normalize to use
	var result;
	var temp,
		dot;
	
	// use ^ to indicate the beginning of the number, because certain things only match at the beginning
	number = "^" + number.replace(/\^/g, '');
	
	//console.log("Globalization.Phone._parsePhone: region is: " + region + " parsing number: " + number);
	
	stateTable = Globalization.Phone._loadStatesFile(region);
	formats = Globalization.Phone._loadFormatsFile(region);
	
	regionSettings = {
		stateTable: stateTable,
		phoneNumberFormats: formats.phoneNumberFormats,
		handler: Globalization.Phone._handlerFactory(region, formats.phoneNumberFormats) 
	};
	
	number = Globalization.Phone._stripFormatting(number);
	dot = 14;	// special transition which matches all characters. See AreaCodeTableMaker.java
	
	i = 0;
	while ( i < number.length ) {
		ch = Globalization.Phone._getCharacterCode(number.charAt(i));
		//console.info("parsing char " + number.charAt(i) + " code: " + ch + " current state is " + state);
		if (ch >= 0) {
			newState = stateTable[state][ch];

			if ( newState === -1 && stateTable[state][dot] !== -1) {
				// check if this character can match the dot instead
				newState = stateTable[state][dot];
				//console.log("char " + ch + " doesn't have a transition. Using dot to transition to state " + newState);
			}
			
			if (newState < 0) {
			 	// reached a final state for this table. Call the handler to handle
				// this final state. First convert the state to a positive array index
				// in order to look up the name of the handler function name in the array
				newState = -newState - 1;
				handlerMethod = PhoneData.states[newState];
				//console.info("reached final state " + newState + " handler method is " + handlerMethod);
				
				if ( number.charAt(0) === '^' ) {
					result = regionSettings.handler[handlerMethod](number.slice(1), i-1, fields, regionSettings);
				} else {
					result = regionSettings.handler[handlerMethod](number, i, fields, regionSettings);
				}
				
				// reparse whatever is left
				number = result.number;
				i = 0;
				
				//console.log("reparsing with new number: " +  number);
				state = 0; // start at the beginning again

				// if the handler requested a special sub-table, use it for this round of parsing,
				// otherwise, set it back to the regular table to continue parsing
				if (result.push !== undefined) {
					//console.log("pushing to table " + result.push);
					region = result.push;
					temp = Globalization.Phone._loadStatesFile(region);
					if ( temp ) {
						stateTable = temp;
					}
					temp = Globalization.Phone._loadFormatsFile(region);
					if ( temp ) {
						formats = temp;
					}
					
					regionSettings = {
						stateTable: stateTable,
						phoneNumberFormats: formats.phoneNumberFormats,
						handler: Globalization.Phone._handlerFactory(region, formats.phoneNumberFormats) 
					};

					//console.log("push complete, now continuing parse.");
				} else if ( result.skipTrunk !== undefined ) {
					ch = Globalization.Phone._getCharacterCode(regionSettings.phoneNumberFormats.trunkCode);
					state = stateTable[state][ch];
				}
			} else {
				// console.info("recognized digit " + ch + " continuing...");
				// recognized digit, so continue parsing
				state = newState;
				i++;
			}
		} else if ( ch === -1 ) {
			// non-transition character, continue parsing in the same state
			i++;
		} else {
			// should not happen
			// console.info("skipping character " + ch);
			// not a digit, plus, pound, or star, so this is probably a formatting char. Skip it.
			i++;
		}
	}
	
	if ( state > 0 && i > 0 ) {
		// we reached the end of the phone number, but did not finish recognizing anything. 
		// Default to last resort and put everything that is left into the subscriber number
		//console.log("Reached end of number before parsing was complete. Using handler for method none.")
		if ( number.charAt(0) === '^' ) {
			result = regionSettings.handler.none(number.slice(1), i-1, fields, regionSettings);
		} else {
			result = regionSettings.handler.none(number, i, fields, regionSettings);
		}
	}
	
	//console.log("final result is: " + JSON.stringify(fields));
	
	// clean up
	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);
	
	return fields;
};


/**
 * Globalization.Phone.parsePhoneNumber(number, locale, mcc) -> Object
 * - number (String): A formatted phone number to be parsed
 * - locale (String): The locale with which to parse the number. (required)
 * - mcc (String): The MCC associated with this number, if known (optional)
 *
 * Parse a phone number for its constituent parts, and return them as fields in
 * a JavaScript object.
 *
 * This function is locale-sensitive, and will assume any number passed to it is
 * appropriate for the given locale. If the MCC is given, this method will assume
 * that numbers without an explicit country code have been dialled within the country
 * given by the MCC. This affects how things like area codes are parsed. If the MCC
 * is not given, this method will use the given locale to determine the country
 * code. If the locale is not explicitly given either, then this function uses the 
 * current UI format region as the default.
 *
 * The input number may contain any formatting characters for the given locale. Each 
 * field that is returned in the json object is a simple string of digits with
 * all formatting and whitespace characters removed.
 *
 * The number is decomposed into its parts, regardless if the number
 * contains formatting characters. If a particular part cannot be extracted from given 
 * number, the field will not be returned in the json object. If no fields can be
 * extracted from the number at all, then all digits found in the string will be 
 * returned in the subscriberNumber field. If the number parameter contains no 
 * digits, an empty json object is returned.
 *
 * The output json has the following fields:
 *
 *  - **vsc** - if this number starts with a VSC (Vertical Service Code, or "star code"), 
 *    this field will contain the star and the code together
 *  - **iddPrefix** - the prefix for international direct dialing. This can either
 *    be in the form of a plus character or the IDD access code for the given locale
 *  - **countryCode** - if this number is an international direct dial number, this 
 *    is the country code
 *  - **cic** - for "dial-around" services (access to other carriers), this is the
 *    prefix used as the carrier identification code
 *  - **emergency** - an emergency services number
 *  - **mobilePrefix** - prefix that introduces a mobile phone number
 *  - **trunkAccess** - trunk access code (long-distance access)
 *  - **serviceCode** - like a geographic area code, but it is a required prefix for
 *    various services
 *  - **areaCode** - geographic area codes
 *  - **subscriberNumber** - the unique number of the person or company that pays
 *    for this phone line
 *  - **extension** - in some countries, extensions are dialed directly without 
 *    going through an operator or a voice prompt system. If the number includes an
 *    extension, it is given in this field.
 *  - **invalid** - this property is added and set to true if the parser found
 *    that the number is invalid in the numbering plan for the country. This method
 *    will make its best effort at parsing, but any digits after the error will
 *    go into the subscriberNumber field
 * 
 * The following rules determine how the number is parsed:
 * 
 *  - If the number starts with a character that is alphabetic instead of numeric, do
 *    not parse the number at all. There is a good chance that it is not really a phone number.
 *    In this case, an empty json object will be returned.
 *  - If the phone number uses the plus notation or explicitly uses the international direct
 *    dialing prefix for the given locale, then the country code is identified in 
 *    the number. The rules of given locale are used to parse the IDD prefix, and then the rules
 *    of the country in the prefix are used to parse the rest of the number.
 *  - If a country code is provided as an argument to the function call, use that country's
 *    parsing rules for the number. This is intended for apps like contacts that know what the 
 *    country is of the person that owns the phone number and can pass that on as a hint.
 *  - If the appropriate locale cannot be easily determined, default to using the rules 
 *    for the current user's region.
 * 
 * Example: parsing the number "+49 02101345345-78" will give the following json
 * 
 *     {
 *       iddPrefix: "+",
 *       countryCode: "49",
 *       areaCode: "02101",
 *       subscriberNumber: "345345",
 *       extension: "78",
 *     }
 * 
 * Not that in this example, because international direct dialing is explicitly used 
 * in the number, the part of this number after the IDD prefix and country code will be 
 * parsed exactly the same way in all locales with German rules (country code 49).
 * 
 * Regions currently supported are:
 * 
 *  - NANP (North American Numbering Plan) countries - USA, Canada, Bermuda, various Caribbean nations
 *  - UK
 *  - Republic of Ireland
 *  - Germany
 *  - France
 *  - Spain
 *  - Italy
 *  - Mexico
 *  - India
 *  - People's Republic of China
 *  - Netherlands
 *  - Belgium
 *  - Luxembourg
 *  - Singapore
 *  - New Zealand
 *  - Australia
 *
 * Returns an object with the parsed fields of the phone number.
 **/
Globalization.Phone.parsePhoneNumber = function parsePhoneNumber(number, locale, mcc) {
	var region, formatRegion, parsedLocale;

	if (!number || number.length === 0 || typeof number !== "string") {
		// TODO: wrap in something that returns a default value?
		return {};
	}
	
	try {
		if ( mcc ) {
			formatRegion = PhoneData.mccToCountry[mcc] || 'us';
		} else if ( locale ) {
			parsedLocale = Globalization.Locale.parseLocaleString(locale);
			formatRegion = parsedLocale.region;
		} else {
			formatRegion = Globalization.Locale.getCurrentPhoneRegion(); 	// can't do anything unless we know the locale
		}
	
		region = Globalization.Phone._getNormalizedPhoneRegion(formatRegion);
		
		return Globalization.Phone._parsePhone(number, region);
	} catch ( e ) {
		console.error("Globalization.Phone.parsePhoneNumber: caught exception while parsing phone number " + number + ". Returning default of subscriber number only.");
		console.error(e);
		return {
			invalid: true,
			subscriberNumber: Globalization.Phone._stripFormatting(number)
		};
	}
};

/*
 * Reverse lookup of a country dialling code for a region identifier.
 */
Globalization.Phone._getCountryCodeForRegion = function _getCountryCodeForRegion(region)
{
	var name;
	
	for ( var cc in PhoneData.countryCodes ) {
		if ( typeof(cc) === 'string' ) {
			name = PhoneData.countryCodes[cc];
			if ( name === region ) {
				return cc;
			}
		}
	}
	
	return "0";
};

/**
 * Globalization.Phone.getCountryCodeForPhoneNumber(number) -> Object
 * - number (String): A parsed phone number (output from parsePhoneNumber()) or a phone number string (required)
 * 
 * Returns a string that describes the ISO-3166-2 country code of the given phone
 * number. If the phone number is a local phone number and does not contain
 * any country information, this routine will return the default country from the
 * locale.
 */
Globalization.Phone.getCountryCodeForPhoneNumber = function getCountryCodeForPhoneNumber(number, locale) {
	var parsed, formatRegion, idd, countryCode;

	if ( number === undefined || number.length < 1 ) {
		return undefined;
	}

	if ( locale ) {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		formatRegion = parsedLocale.region;
	} else {
		formatRegion = Globalization.Locale.getCurrentPhoneRegion(); 	// can't do anything unless we know the locale
	}
	
	if ( typeof(number) === 'object' ) {
		parsed = number;
	} else {
		parsed = Globalization.Phone.parsePhoneNumber(number, formatRegion);
	}
	
	idd = parsed.countryCode ? parsed.countryCode : Globalization.Phone._getCountryCodeForRegion(formatRegion);
	
	if ( PhoneData.AreaToCountryCode[idd] ) {
		if ( parsed.areaCode ) {
			countryCode = PhoneData.AreaToCountryCode[idd][parsed.areaCode] || PhoneData.AreaToCountryCode[idd]["default"];
		} else if ( idd === "33" && parsed.serviceCode ) {
			// french departments are in the service code, not the area code
			countryCode = PhoneData.AreaToCountryCode[idd][parsed.serviceCode] || PhoneData.AreaToCountryCode[idd]["default"];
		}
	} 
	
	countryCode = countryCode || PhoneData.countryCodes[idd];
	
	return countryCode;
};

// used for locales where the area code is very general, and you need to add in
// the initial digits of the subscriber number in order to get the area
Globalization.Phone._parseAreaAndSubscriber = function _parseAreaAndSubscriber(number, stateTable) {
	var ch,
		i,
		end, 
		handlerMethod,
		state = 0,
		newState,
		prefix = "",
		dot = 14;	// special transition which matches all characters. See AreaCodeTableMaker.java
	
	i = 0;
	if ( !number || !stateTable ) {
		// can't parse anything
		return undefined;
	}
	
	//console.log("Globalization.Phone._parseAreaAndSubscriber: parsing number " + number);
	
	while ( i < number.length ) {
		ch = Globalization.Phone._getCharacterCode(number.charAt(i));
		//console.info("parsing char " + number.charAt(i) + " code: " + ch);
		if (ch >= 0) {
			newState = stateTable[state][ch];
			
			if ( newState === -1 && stateTable[state][dot] !== -1) {
				// check if this character can match the dot instead
				newState = stateTable[state][dot];
				//console.log("char " + ch + " doesn't have a transition. Using dot to transition to state " + newState);
				prefix += '.';
			} else {
				prefix += ch;
			}
			
			if (newState < 0) {
				// reached a final state. First convert the state to a positive array index
				// in order to look up the name of the handler function name in the array
				state = newState;
				newState = -newState - 1;
				handlerMethod = PhoneData.states[newState];
				//console.info("reached final state " + newState + " handler method is " + handlerMethod + " and i is " + i);

				return (handlerMethod === "area") ? prefix : undefined;
			} else {
				//console.info("recognized digit " + ch + " continuing...");
				// recognized digit, so continue parsing
				state = newState;
				i++;
			}
		} else if ( ch === -1 ) {
			// non-transition character, continue parsing in the same state
			i++;
		} else {
			// should not happen
			// console.info("skipping character " + ch);
			// not a digit, plus, pound, or star, so this is probably a formatting char. Skip it.
			i++;
		}
	}
	
	return undefined;
};

Globalization.Phone._matchPrefix = function _matchPrefix(prefix, table) {
	var i, matchedDot, matchesWithDots = [];
	
	// console.log("_matchPrefix: matching " + prefix + " against table");
	if ( table[prefix] ) {
		return table[prefix];
	}
	for ( entry in table ) {
		if ( entry && typeof(entry) === 'string' ) {
			i = 0;
			matchedDot = false;
			while ( i < entry.length && (entry.charAt(i) === prefix.charAt(i) || entry.charAt(i) === '.') ) {
				if ( entry.charAt(i) === '.' ) {
					matchedDot = true;
				}
				i++;
			}
			if ( i >= entry.length ) {
				if ( matchedDot ) {
					matchesWithDots.push(entry);
				} else {
					return table[entry];
				}
			}
		}
	}
	
	// match entries with dots last, so sort the matches so that the entry with the 
	// most dots sorts last. The entry that ends up at the beginning of the list is
	// the best match because it has the fewest dots
	if ( matchesWithDots.length > 0 ) {
		matchesWithDots.sort(function (left, right) {
			return (right < left) ? -1 : ((left < right) ? 1 : 0);
		});
		return table[matchesWithDots[0]];
	}
	
	return undefined;
};

/**
 * Globalization.Phone.getGeoForPhoneNumber(number) -> Object
 * - number (String): A parsed phone number (output from parsePhoneNumber()) (required)
 * - locale (String): Locale to use if the phone number is a local number (optional)
 * - mcc (String): the Mobile Country Code, if known, or undefined if not (optional)
 * 
 * Returns a JavaScript object that describes the location of the given phone
 * number. The object has 2 properties, each of which has an sn (short name) 
 * and an ln (long name) string. Additionally, the country code, if given,
 * includes the 2 letter ISO code for the recognized country.
 * 
 *    {
 *         "country": {
 *             "sn": "North America",
 *             "ln": "North America and the Caribbean Islands",
 *             "code": "us"
 *         },
 *         "area": {
 *             "sn": "California",
 *             "ln": "Central California: San Jose, Los Gatos, Milpitas, Sunnyvale, Cupertino, Gilroy"
 *         }
 *    }
 *
 * The location name is subject to the following rules:
 * 
 * If the areaCode property is undefined or empty, or if the number specifies a 
 * country code for which we do not have information, then the area property may be 
 * missing from the returned object. In this case, only the country object will be returned.
 * 
 * If there is no area code, but there is a mobile prefix, service code, or emergency 
 * code, then a fixed string indicating the type of number will be returned.
 * 
 * The country object is filled out according to the countryCode property of the phone
 * number. 
 * 
 * If the phone number does not have an explicit country code, the MCC will be used if
 * it is available. The country code can be gleaned directly from the MCC. If the MCC 
 * of the carrier to which the phone is currently connected is available, it should be 
 * passed in so that local phone numbers will look correct.
 * 
 * If the MCC is also not available, this method will fall back on the passed-in 
 * locale parameter if it is available. 
 * 
 * If the locale parameter is also not available, this method relies on the default 
 * phone region of the device.
 * 
 * If the country's dialling plan mandates a fixed length for phone numbers, and a 
 * particular number exceeds that length, then the area code will not be given on the
 * assumption that the number has problems in the first place and we cannot guess
 * correctly.
 * 
 * The area property varies in specificity according
 * to the locale. In North America, the area is no finer than large parts of states
 * or provinces. In Germany and the UK, the area can be as fine as small towns.
 * 
 * The strings returned from this function are already localized to the 
 * given locale, and thus are ready for display to the user.
 * 
 * If the number passed in is invalid, an empty object is returned.
 **/
Globalization.Phone.getGeoForPhoneNumber = function getGeoForPhoneNumber(number, locale, mcc) {
	var ret = {}, region, countryCode, rb, formatRegion, parsedLocale, areaInfo, temp, areaCode, idd, geoTable, formats,
		tempNumber, prefix, statesTable;
	
	if ( number === undefined || typeof(number) !== 'object' ) {
		return ret;
	}

	// console.log("getGeoForPhoneNumber: looking for geo for number " + JSON.stringify(number));
	if ( mcc ) {
		countryCode = Globalization.Phone.getMobileCountryCode(mcc);
		formatRegion = PhoneData.mccToCountry[mcc];
	} else if ( locale ) {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		formatRegion = parsedLocale.region;
	} else {
		formatRegion = Globalization.Locale.getCurrentPhoneRegion(); 	// can't do anything unless we know the locale
	}

	idd = Globalization.Phone._loadGeoFile('idd');
	
	if ( number.countryCode !== undefined && idd ) {
		countryCode = number.countryCode.replace(/[wWpPtT\+#\*]/g, '');	// fix for NOV-108200
		temp = idd[countryCode];
		region = PhoneData.countryCodes[countryCode];
		ret.country = {
			sn: temp.sn,
			ln: temp.ln,
			code: Globalization.Phone._getNormalizedPhoneRegion(region)
		};
	} else {
		region = Globalization.Phone._getNormalizedPhoneRegion(formatRegion);
	}

	// localize before we send it back.
	rb = Globalization.bundleFactory.getResourceBundle(locale);
	
	prefix = number.areaCode || number.serviceCode;
	
	if ( prefix !== undefined ) {
		formats = Globalization.Phone._loadFormatsFile(region);
		
		if ( formats && formats.phoneNumberFormats && formats.phoneNumberFormats.extendedAreaCodes ) {
			// for countries where the area code is very general and large, and you need a few initial
			// digits of the subscriber number in order find the actual area
			tempNumber = prefix + number.subscriberNumber;
			tempNumber = tempNumber.replace(/[wWpPtT\+#\*]/g, '');	// fix for NOV-108200
			geoTable = Globalization.Phone._loadGeoFile(region + ".geo");
			statesTable = Globalization.Phone._loadStatesFile(region + ".geo");
			
			if ( geoTable && statesTable ) {
				prefix = Globalization.Phone._parseAreaAndSubscriber(tempNumber, statesTable);
				//console.log("tempNumber is " + tempNumber + " got prefix " + prefix);
			}

			if ( !prefix ) {
				// not a recognized prefix, so now try the general table
				geoTable = Globalization.Phone._loadGeoFile(region);
				prefix = number.areaCode || number.serviceCode;
				//console.log("second try with area code found prefix " + prefix);
			}
				
			if ( (!formats.phoneNumberFormats.fieldLengths || 
				  formats.phoneNumberFormats.fieldLengths.maxLocalLength === undefined ||
				  !number.subscriberNumber ||
				  number.subscriberNumber.length <= formats.phoneNumberFormats.fieldLengths.maxLocalLength) ) {
				areaInfo = Globalization.Phone._matchPrefix(prefix, geoTable);
				if ( areaInfo && areaInfo.sn && areaInfo.ln ) {
					//console.log("Found areaInfo " + JSON.stringify(areaInfo));
					ret.area = {
						sn: areaInfo.sn,
						ln: areaInfo.ln
					};
				}
			}
		} else if ( !formats || 
					!formats.phoneNumberFormats || 
					!formats.phoneNumberFormats.fieldLengths || 
					formats.phoneNumberFormats.fieldLengths.maxLocalLength === undefined || 
					!number.subscriberNumber ||
					number.subscriberNumber.length <= formats.phoneNumberFormats.fieldLengths.maxLocalLength ) {
			geoTable = Globalization.Phone._loadGeoFile(region);
					
			// console.error("getGeoForPhoneNumber: area code is: " + prefix);
			
			if ( geoTable !== undefined ) {
				areaCode = prefix.replace(/[wWpPtT\+#\*]/g, '');	// fix for NOV-108200
				areaInfo = Globalization.Phone._matchPrefix(areaCode, geoTable);
				// console.error("getGeoForPhoneNumber: area info is: " + JSON.stringify(areaInfo));
				if ( areaInfo && areaInfo.sn && areaInfo.ln ) {
					ret.area = {
						sn: areaInfo.sn,
						ln: areaInfo.ln
					};
				} else if ( number.serviceCode !== undefined ) {
					ret.area = {
						sn: rb.$L("Service Number"),
						ln: rb.$L("Service Number")
					};
				} else {
					// unknown area or service code, so put the country
					countryCode = Globalization.Phone._getCountryCodeForRegion(region);
					if ( countryCode !== "0" && idd ) {
						temp = idd[countryCode];
						if ( temp && temp.sn ) {
							ret.country = {
								sn: temp.sn,
								ln: temp.ln,
								code: region
							};
						}
					}
				}
			}
		} else {
			countryCode = Globalization.Phone._getCountryCodeForRegion(region);
			if ( countryCode !== "0" && idd ) {
				temp = idd[countryCode];
				if ( temp && temp.sn ) {
					ret.country = {
						sn: temp.sn,
						ln: temp.ln,
						code: region
					};
				}
			}
		}
	} else if ( number.mobilePrefix !== undefined ) {
		ret.area = {
			sn: rb.$L("Mobile Number"),
			ln: rb.$L("Mobile Number")
		};
	} else if ( number.emergency !== undefined ) {
		ret.area = {
			sn: rb.$L("Emergency Services Number"),
			ln: rb.$L("Emergency Services Number")
		};
	}		
	
	if ( ret.country === undefined ) {
		// no explicit country, so put the default
		countryCode = Globalization.Phone._getCountryCodeForRegion(region);
		if ( countryCode !== "0" && idd ) {
			temp = idd[countryCode];
			if ( temp && temp.sn ) {
				ret.country = {
					sn: temp.sn,
					ln: temp.ln,
					code: region
				};
			}
		}
	}
	
	if ( rb ) {
		if ( ret.area ) {
			if ( ret.area.sn ) {
				ret.area.sn = rb.$L(ret.area.sn);
			}
			if ( ret.area.ln ) {
				ret.area.ln = rb.$L(ret.area.ln);
			}
		}
		if ( ret.country ) {
			if ( ret.country.sn ) {
				ret.country.sn = rb.$L(ret.country.sn);
			}
			if ( ret.country.ln ) {
				ret.country.ln = rb.$L(ret.country.ln);
			}
		}
	}
	
	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);
	
	return ret;
};


/*
 * Exclusive or -- return true, iff one is defined and the other isn't
 */
Globalization.Phone._xor = function _xor(left, right) {
	if ( (left === undefined && right === undefined ) || (left !== undefined && right !== undefined) ) {
		return false;
	} else {
		return true;
	}
};

/**
 * Globalization.Phone.comparePhoneNumbers -> Number
 * - comparePhoneNumbers (Object, Object): takes 2 models containing the phone number 
 * fields, as returned by [[Globalization.Phone.parsePhoneNumber]], or strings 
 * containing phone numbers which will be parsed
 * - left (Object): first phone number to compare
 * - right (Object): second phone number to compare
 * - locale (String): locale in which to parse and compare these two numbers
 * 
 * This routine will compare the two phone numbers in an locale-sensitive
 * manner to see if they possibly reference the same phone number. In many places,
 * there are multiple ways to reach the same phone number. In North America for 
 * example, you might have a number with the trunk access code of "1" and another
 * without, and they reference the exact same phone number. This is considered a
 * strong match. For a different pair of numbers, one may be a local number and
 * the other a full phone number with area code, which may reference the same 
 * phone number if the local number happens to be located in that area code. 
 * However, you cannot say for sure if it is in that area code, so it will 
 * be considered a somewhat weaker match. 
 * 
 * Similarly, in other countries, there are sometimes different ways of 
 * reaching the same destination, and the way that numbers
 * match depends on the locale. (Hence the requirement for the locale parameter.)
 * If the locale is specified as "null" then the current locale of the device
 * is used. 
 *
 * The various phone number fields are handled differently for matches. There
 * are various fields that do not need to match at all. For example, you may
 * type equally enter "00" or "+" into your phone to start international direct
 * dialling, so the iddPrefix field does not need to match at all. 
 * 
 * Typically, fields that require matches need to match exactly if both sides have a value 
 * for that field. If both sides specify a value and those values differ, that is
 * a strong non-match. If one side does not have a value and the other does, that 
 * causes a partial match, because the number with the missing field may possibly
 * have an implied value that matches the other number. For example, the numbers
 * "650-555-1234" and "555-1234" have a partial match as the local number "555-1234"
 * might possibly have the same 650 area code as the first number, and might possibly
 * not. If both side do not specify a value for a particular field, that field is 
 * considered matching. 
 * 
 * The values of following fields are ignored when performing matches:
 *   
 *  - **vsc**
 *  - **iddPrefix**
 *  - **cic**
 *  - **trunkAccess**
 *  
 * The values of the following fields matter if they do not match:
 *  
 *  - **countryCode** - A difference causes a moderately strong problem except for 
 *  certain countries where there is a way to access the same subscriber via IDD 
 *  and via intranetwork dialling
 *  - **mobilePrefix** - A difference causes a possible non-match
 *  - **serviceCode** - A difference causes a possible non-match
 *  - **areaCode** - A difference causes a possible non-match
 *  - **subscriberNumber** - A difference causes a very strong non-match
 *  - **extension** - A difference causes a minor non-match
 *  
 * Returns non-negative integer describing the percentage quality of the match. 100 means 
 * a very strong match (100%), and lower numbers are less and less strong, down to 0 
 * meaning not at all a match.
 **/
Globalization.Phone.comparePhoneNumbers = function comparePhoneNumbers(leftNumber, rightNumber, locale) {
	var region, countryCode, formatRegion, parsedLocale, left, right;
	var match = 100;
	var tempCountry;
	var FRdepartments = {"590":1, "594":1, "596":1, "262":1};
	var ITcountries = {"378":1, "379":1};
	var leftPrefix, rightPrefix;
	
	if ( !locale ) {
		formatRegion = Globalization.Locale.getCurrentPhoneRegion(); 	// can't do anything unless we know the locale
	} else {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		formatRegion = parsedLocale.region;
	}

	region = Globalization.Phone._getNormalizedPhoneRegion(formatRegion);
	countryCode = Globalization.Phone._getCountryCodeForRegion(region);

	if ( typeof leftNumber === 'string' ) {
		left = Globalization.Phone.parsePhoneNumber(leftNumber, locale);
	} else {
		left = leftNumber;
	}

	if ( typeof rightNumber === 'string' ) {
		right = Globalization.Phone.parsePhoneNumber(rightNumber, locale);
	} else {
		right = rightNumber;
	}

	// subscriber number must be present and must match
	if ( !left.subscriberNumber || !right.subscriberNumber || left.subscriberNumber !== right.subscriberNumber ) {
		return 0;
	}
	
	// extension must match if it is present
	if ( Globalization.Phone._xor(left.extension, right.extension) || left.extension !== right.extension ) {
		return 0;
	}
	
	if ( Globalization.Phone._xor(left.countryCode, right.countryCode) ) {
		// if one doesn't have a country code, give it some demerit points, but if the
		// one that has the country code has something other than the current country
		// add even more. Ignore the special cases where you can dial the same number internationally or via 
		// the local numbering system
		switch ( region ) {
		case 'fr': 
			if ( left.countryCode in FRdepartments || right.countryCode in FRdepartments ) {
				if ( left.areaCode !== right.areaCode || left.mobilePrefix !== right.mobilePrefix ) {
					match -= 100;
				}
			} else {
				match -= 16;
			}
			break;
		case 'it':
			if ( region === 'it' && (left.countryCode in ITcountries || right.countryCode in ITcountries) ) { 
				if ( left.areaCode !== right.areaCode ) {
					match -= 100;
				}
			} else {
				match -= 16;
			}
			break;
		default:
			match -= 16;
			if ( (left.countryCode !== undefined && left.countryCode !== countryCode) || 
				 (right.countryCode !== undefined && right.countryCode !== countryCode ) ) {
				match -= 16;
			}
		}
	} else if ( left.countryCode !== right.countryCode ) {
		// ignore the special cases where you can dial the same number internationally or via 
		// the local numbering system
		if ( right.countryCode === '33' || left.countryCode === '33' ) {
			// france
			if ( left.countryCode in FRdepartments || right.countryCode in FRdepartments ) {
				if ( left.areaCode !== right.areaCode || left.mobilePrefix !== right.mobilePrefix ) {
					match -= 100;
				}
			} else {
				match -= 100;
			}
		} else if ( left.countryCode === '39' || right.countryCode === '39' ) {
			// italy
			if ( left.countryCode in ITcountries || right.countryCode in ITcountries ) { 
				if ( left.areaCode !== right.areaCode ) {
					match -= 100;
				}
			} else {
				match -= 100;
			}
		} else {
			match -= 100;
		}
	}

	if ( Globalization.Phone._xor(left.serviceCode, right.serviceCode) ) {
		match -= 20;
	} else if ( left.serviceCode !== right.serviceCode ) {
		match -= 100;
	}

	if ( Globalization.Phone._xor(left.mobilePrefix, right.mobilePrefix) ) {
		match -= 20;
	} else if ( left.mobilePrefix !== right.mobilePrefix ) {
		match -= 100;
	}

	if ( Globalization.Phone._xor(left.areaCode, right.areaCode) ) {
		// one has an area code, the other doesn't, so dock some points. It could be a match if the local
		// number in the one number has the same implied area code as the explicit area code in the other number.
		match -= 12;
	} else if ( left.areaCode !== right.areaCode ) {
		match -= 100;
	}

	leftPrefix = Globalization.Phone._getPrefix(left);
	rightPrefix = Globalization.Phone._getPrefix(right);
	
	if ( leftPrefix && rightPrefix && leftPrefix !== rightPrefix ) {
		match -= 100;
	}
	
	// make sure we are between 0 and 100
	if ( match < 0 ) {
		match = 0;	
	} else if ( match > 100 ) {
		match = 100;
	}

	return match;
};

/**
 * Globalization.Phone.getMobileCountryCode -> String
 * - getMobileCountryCode(String): converts a mobile country code (MCC) to an international
 * direct dialling country code
 * - mcc (String): the MCC code to look up
 * 
 * Returns the international direct dialling country code that corresponds to the
 * given mobile carrier code number, or "undefined" if the mcc passed in is not
 * defined.
 **/
Globalization.Phone.getMobileCountryCode = function getMobileCountryCode(mcc) {
	if ( mcc === undefined ) {
		return undefined;
	}
	
	return PhoneData.mccToIdd[mcc] || "1";
};

/**
 * Globalization.Phone.getCountryCodeForMCC -> String
 * - getCountryCodeForMCC(String): converts a mobile country code (MCC) to a 2-letter 
 * ISO 3166 country identifier
 * - mcc (String): the MCC code to look up
 * 
 * Returns the 2-letter ISO 3166 country identifier that corresponds to the
 * given mobile carrier code number, or "undefined" if the mcc passed in is not
 * defined. The country identifier names the country under which the settings for
 * the numbering plan are specified, not the actual country where the MCC is 
 * located. For example, in Canada and the Caribbean the numbering plan is the same
 * as for the US, so the country code of "us" is returned for MCCs in those countries.
 * All settings in the globalization library are accessed as "us" for Canadian and
 * Caribbean carriers.
 **/
Globalization.Phone.getCountryCodeForMCC = function getCountryCodeForMCC(mcc) {
	if ( mcc === undefined ) {
		return undefined;
	}
	
	return Globalization.Phone._getNormalizedPhoneRegion(PhoneData.mccToCountry[mcc] || 'us');	
};

/*$
 * private
 */
Globalization.Phone._hasPrefix = function _hasPrefix(phone)
{
	return (phone && (phone.areaCode || phone.serviceCode || phone.mobilePrefix));
};

/*$
 * private
 */
Globalization.Phone._getPrefix = function _getPrefix(phone)
{
	if ( phone ) {
		return phone.areaCode || phone.serviceCode || phone.mobilePrefix || "";
	}
	return "";
};

/**
 * Globalization.Phone.normalize -> String
 * - normalize(String, Object, String): takes a phone number and 
 * normalizes to a standard canonical form for the purpose of matching with
 * other phone numbers
 * - phoneNumber (String/Object): phone number to normalize. If it is a string, 
 * it can by any phone number and may contain any formatting characters. If it is
 * an object, it is assumed to be the output from [[parsePhoneNumber]]
 * - options (Object): an object containing options and hints to help in normalizing. 
 * - locale (String): locale to use to parse the phone number if passed as a 
 * string. If not specified, the current locale is used.
 * 
 * This function normalizes a phone number to a canonical format and returns a
 * string with that phone number. If parts are missing, this 
 * function attempts to fill in those parts.
 * 
 * If a string is passed in, the function first 
 * parses the phone number using the given locale. If an object is passed in, it is
 * assumed to be a parsed phone number that was the output from 
 * [[Globalization.Phone.parsePhoneNumber]].
 * 
 * The options object contains a set of properties that can possibly help normalize
 * this number by providing "extra" information to the algorithm. The options
 * parameter may be null or an empty object if no hints can be determined before
 * this call is made. If any particular hint is not
 * available, it does not need to be present in the options object.
 * 
 * The following is a list of hints that the algorithm will look for in the options
 * object:
 * 
 * - **mcc**: the mobile carrier code of the current network upon which this 
 * phone is operating. This is translated into an IDD country code. This is 
 * useful if the number being normalized comes from CNAP (callerid) and the
 * MCC is known.
 * - **defaultAreaCode**: the area code of the phone number of the current
 * device, if available. Local numbers in a person's contact list are most 
 * probably in this same area code.
 * - **country**: the name or 2 letter ISO 3166 code of the country if it is
 * known from some other means such as parsing the physical address of the
 * person associated with the phone number, or the from the domain name 
 * of the person's email address
 * - **networkType**: specifies whether the phone is currently connected to a
 * CDMA network or a UMTS network. Valid values are the strings "cdma" and "umts".
 * If one of those two strings are not specified, or if this property is left off
 * completely, this method will assume UMTS.
 * 
 * The following are a list of options that control the behaviour of the normalization:
 * 
 * - **assistedDialing**: if this is set to true, the number will be normalized
 * so that it can dialled directly on the type of network this phone is 
 * currently connected to. This allows customers to dial numbers or use numbers 
 * in their contact list that are specific to their "home" region when they are 
 * roaming and those numbers would not otherwise work with the current roaming 
 * carrier as they are. The home region is 
 * specified as the phoneRegion system preference that is settable in the 
 * regional settings app. With assisted dialling, this method will add or 
 * remove international direct dialling prefixes and country codes, as well as
 * national trunk access codes, as required by the current roaming carrier and the
 * home region in order to dial the number properly. If it is not possible to 
 * construct a full international dialling sequence from the options and hints given,
 * this function will not modify the phone number, and will return "undefined".
 * If assisted dialling is false or not specified, then this method will attempt
 * to add all the information it can to the number so that it is as fully
 * specified as possible. This allows two numbers to be compared more easily when
 * those two numbers were otherwise only partially specified.
 * - **sms**: set this option to true for the following conditions: 
 *   - assisted dialing is turned on
 *   - the phone number represents the destination of an SMS message
 *   - the phone is UMTS 
 *   - the phone is SIM-locked to its carrier 
 * This enables special international direct dialling codes to route the SMS message to
 * the correct carrier. If assisted dialling is not turned on, this option has no
 * affect.
 * - **manualDialing**: set this option to true if the user is entering this number on
 * the keypad directly, and false when the number comes from a stored location like a 
 * contact entry or a call log entry. When true, this option causes the normalizer to 
 * not perform any normalization on numbers that look like local numbers in the home 
 * country. If false, all numbers go through normalization. This option only has an effect
 * when the assistedDialing option is true as well, otherwise it is ignored. 
 * 
 * If both a set of options and a locale are given, and they offer conflicting
 * information, the options will take precedence. The idea is that the locale
 * tells you the region setting that the user has chosen (probably in 
 * firstuse), whereas the the hints are more current information such as
 * where the phone is currently operating (the MCC). 
 * 
 * This function performs the following types of normalizations with assisted
 * dialling turned on:
 * 
 * 1. If the current location of the phone matches the home country, this is a
 * domestic call. 
 *   - Remove any iddPrefix and countryCode fields, as they are not needed
 *   - Add in a trunkAccess field that may be necessary to call a domestic numbers 
 *     in the home country
 * 2. If the current location of the phone does not match the home country,
 * attempt to form a whole international number.
 *   - Add in the area code if it is missing from the phone number and the area code
 *     of the current phone is available in the hints
 *   - Add the country dialling code for the home country if it is missing from the 
 *     phone number
 *   - Add or replace the iddPrefix with the correct one for the current country. The
 *     phone number will have been parsed with the settings for the home country, so
 *     the iddPrefix may be incorrect for the
 *     current country. The iddPrefix for the current country can be "+" if the phone 
 *     is connected to a UMTS network, and either a "+" or a country-dependent 
 *     sequences of digits for CDMA networks.
 *  
 * This function performs the following types of normalization with assisted
 * dialling turned off:
 *  
 *  1. Normalize the international direct dialing prefix to be a plus or the
 *  international direct dialling access code for the current country, depending
 *  on the network type.
 *  2. If a number is a local number (ie. it is missing its area code), 
 *  use a default area code from the hints if available. CDMA phones always know their area 
 *  code, and GSM/UMTS phones know their area code in many instances, but not always 
 *  (ie. not on Vodaphone or Telcel phones). If the default area code is not available, 
 *  do not add it.
 *  3. In assisted dialling mode, if a number is missing its country code, 
 *  use the current MCC number if
 *  it is available to figure out the current country code, and prepend that 
 *  to the number. If it is not available, leave it off. Also, use that 
 *  country's settings to parse the number instead of the current format 
 *  locale.
 *  4. For North American numbers with an area code but no trunk access 
 *  code, add in the trunk access code.
 *  5. For other countries, if the country code is added in step 3, remove the 
 *  trunk access code when required by that country's conventions for 
 *  international calls. If the country requires a trunk access code for 
 *  international calls and it doesn't exist, add one.
 *  
 * This method modifies the given phoneNumber object, and also returns a string 
 * containing the normalized phone number that can be compared directly against
 * other normalized numbers.
 **/
Globalization.Phone.normalize = function normalize(phoneNumber, options, locale) {
	var parsedLocale, 
		norm, 
		currentFormats,
		homeRegion,
		currentRegion,
		destinationRegion, 
		country, 
		currentPlan, 
		formatted = "", 
		fieldName,
		homePlan,
		destinationFormats,
		destinationPlan,
		tempRegion,
		temp;
	
	if ( !phoneNumber ) {
		return ""; // can't normalize nothing!
	}
	
	if ( locale ) {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		currentRegion = parsedLocale.region;
	}

	if ( options ) {
		if (options.homeLocale) {
			parsedLocale = Globalization.Locale.parseLocaleString(options.homeLocale);
			homeRegion = parsedLocale.region;
		}
		if ( options.locale ) {
			parsedLocale = Globalization.Locale.parseLocaleString(options.locale);
			currentRegion = parsedLocale.region;
		}
		
		if (options.mcc) {
			currentRegion = PhoneData.mccToCountry[options.mcc] || "unknown";
		}
	}
	if (!currentRegion) {
		currentRegion = homeRegion;
	}

	homeRegion = homeRegion || Globalization.Locale.getCurrentPhoneRegion();
	currentRegion = Globalization.Phone._getNormalizedPhoneRegion(currentRegion);

	if ( typeof phoneNumber === 'string' ) {
		norm = Globalization.Phone._parsePhone(phoneNumber, currentRegion);
	} else {
		norm = phoneNumber;
	}
	
	destinationRegion = (phoneNumber.countryCode && PhoneData.countryCodes[phoneNumber.countryCode]) || (norm.locale && norm.locale.region) || (options && options.country) || currentRegion;

	// console.log("normalize: homeRegion is " + homeRegion + " and currentRegion is: " + currentRegion + " and destinationRegion is: " + destinationRegion);
	
	currentFormats = Globalization.Phone._loadFormatsFile(currentRegion);
	currentPlan = currentFormats.phoneNumberFormats;

	if (currentRegion === destinationRegion) {
		destinationFormats = currentFormats;
		destinationPlan = currentPlan;
	} else {
		destinationFormats = Globalization.Phone._loadFormatsFile(destinationRegion);
		destinationPlan = destinationFormats.phoneNumberFormats;
	}
	
	// console.log("normalize: parsed phone number is: " + JSON.stringify(norm));
	
	if (options &&
			options.assistedDialing &&
			destinationPlan.fieldLengths &&
			typeof(destinationPlan.fieldLengths.maxLocalLength) !== 'undefined' &&
			!norm.trunkAccess && 
			!norm.iddPrefix &&
			norm.subscriberNumber && 
			norm.subscriberNumber.length > destinationPlan.fieldLengths.maxLocalLength) {
		// not a valid number, so attempt to reparse with a + in the front to see if we get a valid international number
		// console.log("Attempting to reparse with +" + this._join());
		temp = Globalization.Phone._parsePhone("+" + Globalization.Phone._join(norm), currentRegion);
		tempRegion = (temp.countryCode && PhoneData.countryCodes[temp.countryCode]) || currentRegion;
		if (tempRegion && tempRegion !== "unknown" && tempRegion !== "sg") {
			// only use it if it is a recognized country code
			norm = temp;
			destinationRegion = tempRegion;
			destinationFormats = Globalization.Phone._loadFormatsFile(destinationRegion);
			destinationPlan = destinationFormats.phoneNumberFormats;
		}
	} else if (options && options.assistedDialing && norm.invalid && currentRegion !== norm.locale.region) {
		// if this number is not valid for the locale it was parsed with, try again with the current locale
		// console.log("norm is invalid. Attempting to reparse with the current locale");
		temp = Globalization.Phone._parsePhone(this._join(), currentRegion);
		if (temp && !temp.invalid) {
			norm = temp;
		}
	}

	if (!norm.invalid && options && options.assistedDialing) {
		// don't normalize things that don't have subscriber numbers
		if (norm.subscriberNumber && 
				(!options.manualDialing ||
				 norm.iddPrefix ||
				 norm.countryCode ||
				 norm.trunkAccess)) {
			// console.log("normalize: assisted dialling normalization");
			if ( currentRegion !== destinationRegion ) {
				// we are currently roaming internationally
				if (!Globalization.Phone._hasPrefix(norm) &&
						options.defaultAreaCode && 
						destinationRegion === homeRegion &&
						(!destinationPlan.fieldLengths.minLocalLength || 
							norm.subscriberNumber.length >= destinationPlan.fieldLengths.minLocalLength)) {
					// area code is required when dialling from international, but only add it if we are dialing
					// to our home area. Otherwise, the default area code is not valid!
					norm.areaCode = options.defaultAreaCode;
					if (!destinationPlan.skipTrunk) {
						// some phone systems require the trunk access code, even when dialling from international
						norm.trunkAccess = destinationPlan.trunkCode;
					}
				}
				
				if (norm.trunkAccess && destinationPlan.skipTrunk) {
					// on some phone systems, the trunk access code is dropped when dialling from international
					delete norm.trunkAccess;
				}
				
				// make sure to get the country code for the destination region, not the current region!
				if (options.sms) {
					if (homeRegion === "us" && currentRegion !== "us") {
						if (destinationRegion !== "us") {
							norm.iddPrefix = "011"; // non-standard code to make it go through the US first
							norm.countryCode = norm.countryCode || Globalization.Phone._getCountryCodeForRegion(destinationRegion);
						} else if (options.networkType === "cdma") {
							delete norm.iddPrefix;
							delete norm.countryCode;
							if (norm.areaCode) {
								norm.trunkAccess = "1";
							}
						} else if (norm.areaCode) {
							norm.iddPrefix = "+";
							norm.countryCode = "1";
							delete norm.trunkAccess;
						}
					} else {
						norm.iddPrefix = (options.networkType === "cdma") ? currentPlan.iddCode : "+";
						norm.countryCode = norm.countryCode || Globalization.Phone._getCountryCodeForRegion(destinationRegion);
					}
				} else if (Globalization.Phone._hasPrefix(norm) && !norm.countryCode) {
					norm.countryCode = Globalization.Phone._getCountryCodeForRegion(destinationRegion);
				}
				
				if (norm.countryCode && !options.sms) {
					// for CDMA, make sure to get the international dialling access code for the current region, not the destination region
					if (options.networkType && options.networkType === "cdma") {
						norm.iddPrefix = (currentPlan.region === "unknown" && PhoneData.regionDialingCodes[currentRegion]) ? 
								PhoneData.regionDialingCodes[currentRegion][0] : 
								currentPlan.iddCode;
					} else {
						// all umts carriers support plus dialing
						norm.iddPrefix = "+";
					}
				}
			} else {
				// console.log("normalize: dialing within the country");
				if (options.defaultAreaCode) {
					if (destinationPlan.dialingPlan === "open") {
						if (!norm.trunkAccess && Globalization.Phone._hasPrefix(norm) && destinationPlan.trunkCode) {
							// call is not local to this area code, so you have to dial the trunk code and the area code
							norm.trunkAccess = destinationPlan.trunkCode;
						}
					} else {
						// In closed plans, you always have to dial the area code, even if the call is local.
						if (!Globalization.Phone._hasPrefix(norm)) {
							if (destinationRegion === homeRegion) {
								norm.areaCode = options.defaultAreaCode;
								if (destinationPlan.trunkRequired && destinationPlan.trunkCode) {
									norm.trunkAccess = norm.trunkAccess || destinationPlan.trunkCode;
								}
							}
						} else {
							if (destinationPlan.trunkRequired && destinationPlan.trunkCode) {
								norm.trunkAccess = norm.trunkAccess || destinationPlan.trunkCode;
							}
						}
					}
				}
				
				if (options.sms &&
						homeRegion === "us" && 
						currentRegion !== "us") {
					norm.iddPrefix = "011"; // make it go through the US first
					if (destinationPlan.skipTrunk && norm.trunkAccess) {
						delete norm.trunkAccess;
					}
				} else if (norm.iddPrefix || norm.countryCode) {
					// we are in our destination country, so strip the international dialling prefixes
					delete norm.iddPrefix;
					delete norm.countryCode;
					
					if ((destinationPlan.dialingPlan === 'open' || destinationPlan.trunkRequired) && destinationPlan.trunkCode) {
						norm.trunkAccess = destinationPlan.trunkCode;
					}
				}
			}
			
			norm.locale = { region: currentRegion };
		}
	} else if (!norm.invalid) {
		if ( !Globalization.Phone._hasPrefix(norm) && options && options.defaultAreaCode && destinationRegion === homeRegion ) {
			norm.areaCode = options.defaultAreaCode;
		}
		
		if ( !norm.countryCode && Globalization.Phone._hasPrefix(norm) ) {
			norm.countryCode = Globalization.Phone._getCountryCodeForRegion(destinationRegion);
		}

		if ( norm.countryCode ) {
			if ( options && options.networkType && options.networkType === "cdma" ) {
				norm.iddPrefix = (currentPlan.region === "unknown" && PhoneData.regionDialingCodes[currentRegion]) ? 
					PhoneData.regionDialingCodes[currentRegion][0] : 
					currentPlan.iddCode;
			} else {
				// all umts carriers support plus dialing
				norm.iddPrefix = "+";
			}
	
			//console.info("normalize: currentRegion is " + currentRegion);
			
			if ( currentPlan.skipTrunk && norm.trunkAccess ) {
				delete norm.trunkAccess;
			} else if ( !currentPlan.skipTrunk && !norm.trunkAccess && currentPlan.trunkCode ) {
				norm.trunkAccess = currentPlan.trunkCode;
			}
		}
	}
	
	// console.info("normalize: after normalization, the parsed phone number is: " + JSON.stringify(norm));
	
	formatted = Globalization.Phone._join(norm);
	
	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);
	
	return formatted;
};

/**
 * Globalization.Phone.parseImsi -> Object
 * - parseImsi(String): takes an IMSI number as a string, parses out the
 * parts and returns them
 * 
 * This function takes an IMSI number as a string, and returns its parts.
 * The parts are:
 * 
 * - **mcc**: the Mobile Country Code
 * - **mnc**: the Mobile Network Code (identifies the carrier)
 * - **msin**: the Mobile Service Identification Number (usually the person's subscriber number)
 * 
 * Returns an object containing the the parsed imsi, or undefined if the imsi
 * could not be parsed. 
 **/
Globalization.Phone.parseImsi = function parseImsi(imsi) {
	var ch, 
		i,
		stateTable, 
		end, 
		handlerMethod,
		state = 0,
		newState,
		fields = {};
	
	// console.log("Globalization.Phone.parseImsi: parsing imsi " + imsi);
	
	if ( !imsi ) {
		return undefined;
	}
	
	i = 0;
	stateTable = Globalization.Phone._loadStatesFile('mnc');
	if ( !stateTable ) {
		// can't parse anything
		return undefined;
	}
	
	while ( i < imsi.length ) {
		ch = Globalization.Phone._getCharacterCode(imsi.charAt(i));
		// console.info("parsing char " + imsi.charAt(i) + " code: " + ch);
		if (ch >= 0) {
			newState = stateTable[state][ch];
			
			if (newState < 0) {
				// reached a final state. First convert the state to a positive array index
				// in order to look up the name of the handler function name in the array
				state = newState;
				newState = -newState - 1;
				handlerMethod = PhoneData.states[newState];
				// console.info("reached final state " + newState + " handler method is " + handlerMethod + " and i is " + i);

				// deal with syntactic ambiguity by using the "special" end state instead of "area"
				if ( handlerMethod === "area" ) {
					end = i+1;
				} else if ( handlerMethod === "special" ) {
					end = i;
				} else {
					// unrecognized imsi, so just assume the mnc is 3 digits
					end = 6;
				}
				
				fields.mcc = imsi.substring(0,3);
				fields.mnc = imsi.substring(3,end);
				fields.msin = imsi.substring(end);

				break;
			} else {
				// console.info("recognized digit " + optionalch + " continuing...");
				// recognized digit, so continue parsing
				state = newState;
				i++;
			}
		} else if ( ch === -1 ) {
			// non-transition character, continue parsing in the same state
			i++;
		} else {
			// should not happen
			// console.info("skipping character " + ch);
			// not a digit, plus, pound, or star, so this is probably a formatting char. Skip it.
			i++;
		}
	}
	
	if ( state > 0 ) {
		if ( i >= imsi.length && i >= 6 ) {
			// we reached the end of the imsi, but did not finish recognizing anything. 
			// Default to last resort and assume 3 digit mnc
			fields.mcc = imsi.substring(0,3);
			fields.mnc = imsi.substring(3,6);
			fields.msin = imsi.substring(6);
		} else {
			// unknown or not enough characters for a real imsi 
			fields = undefined;
		}
	}
	
	// console.info("Globalization.Phone.parseImsi: final result is: " + JSON.stringify(fields));
	
	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);
	
	return fields;
};

/**
 * Globalization.Phone.getMinLocalPhoneNumberLength -> Number
 * - getMinLocalPhoneNumberLength(String): returns the minimum length of
 * a local phone number in the given region
 * - locale (optional): the region (country) of the given locale is the region for 
 * which the minimum length is sought. Pass undefined to cause this method to use 
 * the current device locale
 * - mcc (optional): the mobile carrier code for the carrier to which the phone is
 * currently connected, if known. Pass undefined if not known, and the method will
 * defaul to the locale. 
 * 
 * If the region is one for which the globalization loadable framework currently has
 * no knowledge of, then a default minimum length of 6 is returned. This is valid 
 * for many countries, but not all of them.
 * 
 * Returns a number representing the length of the shortest possible local phone number.
 **/
Globalization.Phone.getMinLocalPhoneNumberLength = function getMinLocalPhoneNumberLength(locale, mcc) {
	var region, formatRegion, parsedLocale, formats, ret;

	if ( mcc ) {
		formatRegion = PhoneData.mccToCountry[mcc] || 'us';
	} else if ( locale ) {
		parsedLocale = Globalization.Locale.parseLocaleString(locale);
		formatRegion = parsedLocale.region;
	} else {
		formatRegion = Globalization.Locale.getCurrentPhoneRegion(); 	// can't do anything unless we know the locale
	}

	region = Globalization.Phone._getNormalizedPhoneRegion(formatRegion);
	formats = Globalization.Phone._loadFormatsFile(region);
	ret = formats.phoneNumberFormats.fieldLengths.minLocalLength;
	
	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);
	
	return ret;
};

/**
 * Globalization.Phone.reformat -> String
 * - reformat(String, Object): returns the given phone number reformatted to the 
 * standard format if possible
 * - phoneNumber (String): a string that probably contains a phone number
 * - params (Object, optional): parameters for use in parsing and reformatting
 * 
 * This function returns the same phone number as it was passed, but reformatted to
 * the standard format if possible. If it is not possible, the original string is
 * returned.
 * 
 * The function first does a character count of the string to determine if there are
 * enough digits for a phone number, and whether or not there are too many non-dialable
 * characters. If it looks like it is just some text rather than a phone number, the 
 * original string is returned instead.
 * 
 * Another reason it may not be possible to reformat is if the digits in the phone
 * number itself form an invalid number in the numbering plan. If so, this function 
 * will not attempt to reformat it incorrectly and just return the original string.
 * 
 * The params object is passed to the Globalization.Format.formatPhoneNumber() 
 * function, so it should contain the same properties as the one expected
 * by that function. Please see the documentation for formatPhoneNumber for more
 * details on the expected properties.
 * 
 * Returns a string containing the given phone number reformatted to the 
 * standard format if possible, or the original string if not.
 **/
Globalization.Phone.reformat = function reformat(phoneNumber, params)
{
	var ret = "",
		i,
		ch,
		dialableCount = 0,
		formatCount = 0,
		otherCount = 0,
		countryCode,
		formatsRegion,
		parsedLocale,
		region,
		regionSettings,
		formatChars;
	
	// console.log("Globalization.Phone.reformat: reformatting number: " + phoneNumber);
	
	if ( params ) {
		if ( params.mcc ) {
			countryCode = Globalization.Phone.getMobileCountryCode(params.mcc);
			formatsRegion = PhoneData.mccToCountry[params.mcc];
		} else if ( params.locale ) {
			parsedLocale = Globalization.Locale.parseLocaleString(params.locale);
			formatsRegion = parsedLocale.region;
		}
	}
	
	if ( !formatsRegion ) {
		formatsRegion = Globalization.Locale.getCurrentPhoneRegion(); 	// can't do anything unless we know the locale
	}

	region = Globalization.Phone._getNormalizedPhoneRegion(formatsRegion);
	// console.log("Globalization.Phone.reformat: formatsRegion is " + formatsRegion + " region is " + region);
	
	regionSettings = Globalization.Phone._loadFormatsFile(region);
	formatChars = (regionSettings && regionSettings.phoneNumberFormats && regionSettings.phoneNumberFormats.commonFormatChars) || " ()-/.";
	
	for ( i = 0; i < phoneNumber.length; i++ ) {
		ch = phoneNumber.charAt(i);
		if ( Globalization.Phone._getCharacterCode(ch) > -1 ) {
			dialableCount++;
		} else if ( formatChars.indexOf(ch) > -1 ) {
			formatCount++;
		} else {
			otherCount++;
		}
	}

	// console.log("Globalization.Phone.reformat: dialable: " + dialableCount + " format: " + formatCount + " other: " + otherCount);
	
	if ( regionSettings.phoneNumberFormats && 
		 regionSettings.phoneNumberFormats.fieldLengths && 
		 regionSettings.phoneNumberFormats.fieldLengths.minLocalLength && 
		 dialableCount < regionSettings.phoneNumberFormats.fieldLengths.minLocalLength &&
		 otherCount > 0 ) {
		// not enough digits for a local number, and there are other chars in there? well, probably not a real phone number then
		return phoneNumber;
	} 
	
	if ( dialableCount < otherCount ) {
		// if the ratio of other chars to dialable digits is too high, assume it is not a real phone number
		return phoneNumber;
	}

	Utils.releaseAllJsonFiles(Globalization.Locale.phoneRegion);

	var temp = Globalization.Phone.parsePhoneNumber(phoneNumber, (params && params.locale), (params && params.mcc));
	
	if ( temp.invalid ) {
		// could not be parsed properly, so return the original
		// onsole.log("Globalization.Phone.reformat: parse returned invalid number. Returning original");
		return phoneNumber;
	}
	
	return Globalization.Format.formatPhoneNumber(temp, params);
}