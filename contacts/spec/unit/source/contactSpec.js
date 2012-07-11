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
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500, white: false */

/*global afterEach, beforeEach, console, describe, it, expect, IMPORTS, include, Test, JSON, ContactFactory, ContactType, Future, MojoLoader, MojoTest, Contact, DB, ContactPhoto, Assert, require, waitsFor, xit */

var fs = require('fs');
var fm = MojoLoader.require({name:"foundations.mock", version: "1.0"})["foundations.mock"];

var waitsForFuture = require('./utils.js').waitsForFuture;

describe("ContactTests", function () {
	var cd = JSON.parse(fs.readFileSync("test/contactdata.json"));

	beforeEach(function () {
		// console.log("contactSpec.js beforeEach() called");
		fm.Comms.Mock.PalmCall.useMock();
		fm.Data.Mock.DB.useMock();
	});

	afterEach(function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(DB.del({
				from: "com.palm.contact:1"
			}));
		});

		waitsForFuture(future);
	});

	it("should test contact", function () {
		var c = ContactFactory.createContactDisplay(cd.large_contact);
		expect(typeof c).toEqual("object");
		c = ContactFactory.createContactLinkable(cd.large_contact);
		expect(typeof c).toEqual("object");
		c = ContactFactory.create(undefined, cd.large_contact);
		expect(typeof c).toEqual("object");
		c = ContactFactory.create(ContactType.DISPLAYABLE, cd.large_contact);
		expect(typeof c).toEqual("object");
		c = ContactFactory.create(ContactType.LINKABLE, cd.large_contact);
		expect(typeof c).toEqual("object");
		c = ContactFactory.create(ContactType.EDITABLE, cd.large_contact);
		expect(typeof c).toEqual("object");
		c = ContactFactory.create(ContactType.RAWOBJECT, cd.large_contact);
		expect(typeof c).toEqual("object");
	});

	it("should test dirtyFlag", function () {
		var contact = new Contact(cd.large_contact);

		// TODO: currently failing from im address serviceName calling setType in its setter
		expect(contact.isDirty()).toBeFalsy();	// "Contact was dirty after initialization"

		contact.getPhoneNumbers().getArray()[0].setValue("4352344433");

		expect(contact.isDirty()).toBeTruthy(); // Contact was not dirty after modifying object in array

		contact.markNotDirty();

		expect(contact.isDirty()).toBeFalsy();	// Contact was dirty after marking it as not dirty after modifying object in array

		contact.getNote().setValue("This is my awesome note");

		expect(contact.isDirty()).toBeTruthy(); // Contact was not dirty after modifying an object

		contact.markNotDirty();

		expect(contact.isDirty()).toBeFalsy();	// Contact was dirty after marking it as not dirty after modifying an object
	});

	xit("should test getIdOfADBObject", function () {
		var contact,
			contact2,
			future = new Future();

		future.now(function () {
			contact = new Contact();
			contact.getPhotos().add({value: "blaa", type: ContactPhoto.TYPE.BIG});
			return contact.save();
		});

		future.then(function () {
			var result = future.result;
			return DB.get([contact.getId()]);
		});

		future.then(function () {
			var result = future.result,
				photo;

			contact2 = new Contact(result.results[0]);

			//console.log("Result from dbquery - " + JSON.stringify(result));

			//console.log("DBObject of contact - " + JSON.stringify(contact2.getDBObject()));

			photo = contact2.getPhotos().getArray()[0];
			photo.setValue("DAAAAHH");

			console.log("DBObject of photo - " + JSON.stringify(photo.getDBObject()));

			expect(photo.getDBObject()._id).toBeTruthy();	// Test GetIdOfADBObject did not have an id on the photo object

			return true;
		});

		waitsForFuture(future);
	});
});