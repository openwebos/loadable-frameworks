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
/*global exports, Class, _, Person, PersonDisplay, PersonDisplayLite, PersonLinkableMethods,
PersonLinkable, PersonType */

/**
 * @name PersonFactory
 * @namespace
 */
var PersonFactory = {

	/**
	 * Create a PersonDisplayLite - inexpensively extends a raw person object
	 * @name PersonFactory.createPersonDisplayLite
	 * @param {Object} rawPersonObject
	 */
	createPersonDisplayLite: function (rawPersonObject, sortOrder) {
		return PersonDisplayLite.create(rawPersonObject, sortOrder);
	},

	createPersonDisplay: function (rawPersonObject) {
		return new PersonDisplay(rawPersonObject);
	},

	createPersonLinkable: function (rawPersonObject) {
		return new PersonLinkable(rawPersonObject);
	},

	create: function (rawPersonObject, personType, sortOrder) {
		switch (personType) {
		case PersonType.DISPLAYABLE:
			return PersonFactory.createPersonDisplay(rawPersonObject);
		case PersonType.DISPLAYLITE:
			return PersonDisplayLite.create(rawPersonObject, sortOrder);
		case PersonType.LINKABLE:
			return PersonFactory.createPersonLinkable(rawPersonObject);
		case PersonType.RAWOBJECT:
			return rawPersonObject;
		default:
			return PersonFactory.createPersonDisplay(rawPersonObject);
		}
	}
};

/**
 * Exported from {@link PersonFactory}
 * @extends PersonFactory
 */
exports.PersonFactory = PersonFactory;
