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
/*global exports Class, Contact, ContactLinkable, ContactDisplay, ContactType */

var ContactFactory = Class.create({
	initialize: function () {
	}
});

//this is deprecated, but alias it for now so nothing breaks.
//TODO: remove this eventually.
ContactFactory.ContactType = ContactType;

ContactFactory.createContactDisplay = function (rawContactObject) {
	return new ContactDisplay(rawContactObject);
};

ContactFactory.createContactLinkable = function (rawContactObject) {
	return new ContactLinkable(rawContactObject);
};

ContactFactory.createContactEditable = function (rawContactObject) {
	return new Contact(rawContactObject);
};

ContactFactory.create = function (contactType, rawContactObject) {
	switch (contactType) {
	case ContactType.DISPLAYABLE:
		return ContactFactory.createContactDisplay(rawContactObject);
	case ContactType.LINKABLE:
		return ContactFactory.createContactLinkable(rawContactObject);
	case ContactType.EDITABLE:
		return ContactFactory.createContactEditable(rawContactObject);
	case ContactType.RAWOBJECT:
		return rawContactObject;
	default:
		return ContactFactory.createContactDisplay(rawContactObject);
	}
};

exports.ContactFactory = ContactFactory;