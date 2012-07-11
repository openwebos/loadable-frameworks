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

/*global _, afterEach, beforeEach, describe, expect, Future, it, require, MojoLoader, MojoTest, JSON, console, palmGetResource, PersonFactory, Person,
runs, Test, IMAddress, PersonType, Contact, PalmCall, PhoneNumber, DB, waitsFor */

var fm = MojoLoader.require({name:"foundations.mock", version: "1.0"})["foundations.mock"];

describe("Person Tests", function () {
	var fs = require('fs'),
		timeoutInterval = 13000,
		pd = JSON.parse(fs.readFileSync("test/persondata.json")),
		utils = require('./utils'),
		waitsForFuture = utils.waitsForFuture;


	beforeEach(function () {
		fm.Comms.Mock.PalmCall.useMock();
		fm.Data.Mock.DB.useMock();

		if (this.largePerson) {
			return;
		}

		var future = new Future();

		future.now(this, function () {
			this.largePerson = PersonFactory.createPersonDisplay(pd.large_person);

			future.nest(this.largePerson.save());
		});

		waitsForFuture(future, timeoutInterval);
	});

	afterEach(function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(DB.del({
				from: "com.palm.person:1"
			}));
		});

		future.then(this, function () {
			future.nest(DB.del({
				from: "com.palm.contact:1"
			}));
		});

		waitsForFuture(future, timeoutInterval);
	});

	function requireEmptyArray(value) {
		expect(_.isArray(value)).toBeTruthy();
		expect(value.length).toEqual(0);
	}


	it("should test person", function () {
		var p = PersonFactory.createPersonDisplay(pd.large_person);
		expect(typeof p).toEqual('object');
		p = PersonFactory.createPersonLinkable(pd.large_person);
		expect(typeof p).toEqual('object');
		p = PersonFactory.createPersonDisplayLite(pd.large_person);
		expect(typeof p).toEqual('object');
		p = PersonFactory.create(pd.large_person);
		expect(typeof p).toEqual('object');
		p = PersonFactory.create(pd.large_person, PersonType.DISPLAYABLE);
		expect(typeof p).toEqual('object');
		p = PersonFactory.create(pd.large_person, PersonType.LINKABLE);
		expect(typeof p).toEqual('object');
		p = PersonFactory.create(pd.large_person, PersonType.RAWOBJECT);
		expect(typeof p).toEqual('object');
	});

	it("should test dirtyFlag", function () {
		var person = new Person(pd.large_person);

		expect(person.isDirty()).toBeFalsy();

		person.getPhoneNumbers().getArray()[0].setValue("4352344433");

		expect(person.isDirty()).toBeTruthy();

		person.markNotDirty();

		expect(person.isDirty()).toBeFalsy();

		person.getReminder().setValue("This is my awesome reminder");

		expect(person.isDirty()).toBeTruthy();

		person.markNotDirty();

		expect(person.isDirty()).toBeFalsy();
	});

/*
	it("should test saveRetry", function () {
		var person = new Person(pd.large_person),
			done = false,
			result;

		runs(function () {
			person.save().then(function (future) {
				var result = future.result;

				person.setRev(-1);
				person.getReminder().setValue("Catch the db mismatch!!!");
				return person.save(true);
			}).then(function (future) {
				result = future.result;

				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		}, timeoutInterval);

		runs(function () {
			expect(result).toBeTruthy();
		});
	});
*/
	it("should test setContactWithIdAsPrimary", function () {
		var person = new Person(pd.large_person),
			currentPrimary,
			expectedPrimary;

		currentPrimary = person.getContactIds().getArray()[0];
		expectedPrimary = person.getContactIds().getArray()[1];

		expect(person.setContactWithIdAsPrimary(expectedPrimary.getValue())).toBeTruthy();
		expect(expectedPrimary.getValue()).toEqual(person.getContactIds().getArray()[0].getValue());

		currentPrimary = person.getContactIds().getArray()[0];
		expectedPrimary = person.getContactIds().getArray()[0];

		expect(person.setContactWithIdAsPrimary(currentPrimary.getValue())).toBeFalsy();
		expect(expectedPrimary.getValue()).toEqual(person.getContactIds().getArray()[0].getValue());

		currentPrimary = person.getContactIds().getArray()[0];
		expectedPrimary = person.getContactIds().getArray()[2];

		expect(person.setContactWithIdAsPrimary(expectedPrimary.getValue())).toBeTruthy();
		expect(expectedPrimary.getValue()).toEqual(person.getContactIds().getArray()[0].getValue());
	});
/*
	it("should test saveAndDelete", function () {
		var p = new Person({
				_kind: "com.palm.person:1",
				names: [{
					familyName: "tom"
				}]
			}),
			future = p.save(),
			success = false,
			done = false,
			result;

		runs(function () {
			future.then(this, function () {
				result = future.result;
				if (result) {
					future.nest(p.deletePerson());
					success = true;
				} else {
					console.log(JSON.stringify(result));
					future.result = false;
				}
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		}, timeoutInterval);

		runs(function () {
			expect(result).toBeTruthy();
			expect(success).toBeTruthy();
			// console.log(JSON.stringify(result));
		});
	});

	it("should test getDisplayablePersonAndContactsById", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.getDisplayablePersonAndContactsById(this.largePerson.getId()));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});

		});

		waitsFor(function () {
			return done;
		}, timeoutInterval);

		runs(function () {
			expect(result).toBeTruthy();
			expect(typeof result).toEqual("object");
		});
	});

	it("should test findByContactIdsStringPrimaryFound", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByContactIds(this.largePerson.generateLauncherCallbackId().split(Person.DELIMITER)));
			});

			future.then(this, function () {
				var result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		}, timeoutInterval);

		runs(function () {
			expect(result).toBeTruthy();
			expect(result.getId()).toEqual(this.largePerson.getId());
		});
	});

	it("should test findByContactIdsStringDifferentPrimary", function () {
		var future = new Future(),
			result,
			done = false;

		this.largePerson.getContactIds().clear();

		this.largePerson.getContactIds().add("notGonnaMatchPrimary");
		this.largePerson.getContactIds().add(pd.large_person.contactIds.slice(1));

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByContactIds(Person.getContactIdsFromLauncherCallbackId(this.largePerson.generateLauncherCallbackId())));
			});

			future.then(this, function () {
				var result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		}, timeoutInterval);

		runs(function () {
			expect(result).toBeTruthy();
			expect(result.getId()).toEqual(this.largePerson.getId());
		});
	});

	it("should test findByContactIdsStringNotFound", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByContactIds(["aewfoiwef"]));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			expect(result).toBeFalsy();
		});
	});

	//
	// Person.findByXXX tests
	//

	//TODO: add tests for findByXXX's that test personType

	it("should test findByEmailSingle", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByEmail(pd.large_person.emails[0].value));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(result).toBeTruthy();
			expect(typeof result).toEqual("object");
			expect(result.getEmails().getArray()[0].getValue()).toEqual(pd.large_person.emails[0].value);
			expect(result.getEmails().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.emails[0].normalizedValue);

			future.nest(Person.findByEmail("doesntexist@nowhere.com")).then(function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			expect(result).toBeFalsy();
		});
	});

	it("should test findByEmailSingleIncludeItem", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByEmail(pd.large_person.emails[0].value, {
					includeMatchingItem: true
				}));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(result).toBeTruthy();
			expect(typeof result).toEqual("object");
			expect(typeof result.person).toEqual("object");
			expect(result.person.getEmails().getArray()[0].getValue()).toEqual(pd.large_person.emails[0].value);
			expect(result.person.getEmails().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.emails[0].normalizedValue);
			expect(typeof result.item).toEqual("object");
			expect(result.item.getValue()).toEqual(pd.large_person.emails[0].value);
			expect(result.item.getDBObject().normalizedValue).toEqual(pd.large_person.emails[0].normalizedValue);

			future.nest(Person.findByEmail("doesntexist@nowhere.com", {
				includeMatchingItem: true
			})).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			expect(result).toBeFalsy();
		});
	});

	it("should test findByEmailAll", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByEmail(pd.large_person.emails[0].value, {
					returnAllMatches: true
				}));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(_.isArray(result)).toBeTruthy();
			expect(typeof result[0]).toEqual("object");
			expect(result[0].getEmails().getArray()[0].getValue()).toEqual(pd.large_person.emails[0].value);
			expect(result[0].getEmails().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.emails[0].normalizedValue);

			future.nest(Person.findByEmail("doesntexist@nowhere.com", {
				returnAllMatches: true
			})).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			requireEmptyArray(result);
		});
	});

	it("should test findByIMNoServiceSingle", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByIM(pd.large_person.ims[0].value));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(result).toBeTruthy();
			expect(typeof result).toEqual("object");
			expect(result.getIms().getArray()[0].getValue()).toEqual(pd.large_person.ims[0].value);
			expect(result.getIms().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.ims[0].normalizedValue);

			future.nest(Person.findByIM("doesntexistonaim")).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			expect(result).toBeFalsy();
		});
	});

	it("should test findByIMNoServiceSingleIncludeItem", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByIM(pd.large_person.ims[0].value, undefined, {
					includeMatchingItem: true
				}));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(result).toBeTruthy();
			expect(typeof result).toEqual("object");
			expect(typeof result.person).toEqual("object");
			expect(result.person.getIms().getArray()[0].getValue()).toEqual(pd.large_person.ims[0].value);
			expect(result.person.getIms().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.ims[0].normalizedValue);
			expect(typeof result.item).toEqual("object");
			expect(result.item.getValue()).toEqual(pd.large_person.ims[0].value);
			expect(result.item.getDBObject().normalizedValue).toEqual(pd.large_person.ims[0].normalizedValue);

			future.nest(Person.findByIM("doesntexistonaim", undefined, {
				includeMatchingItem: true
			})).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			expect(result).toBeFalsy();
		});
	});

	it("should test findByIMNoServiceAll", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByIM(pd.large_person.ims[0].value, "", {
					returnAllMatches: true
				}));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(_.isArray(result)).toBeTruthy();
			expect(typeof result[0]).toEqual("object");
			expect(result[0].getIms().getArray()[0].getValue()).toEqual(pd.large_person.ims[0].value);
			expect(result[0].getIms().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.ims[0].normalizedValue);

			future.nest(Person.findByIM("doesntexistonaim", "", {
				returnAllMatches: true
			})).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			requireEmptyArray(result);
		});
	});

	it("should test findByIMWithServiceSingle", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByIM(pd.large_person.ims[0].value, IMAddress.TYPE.GTALK));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(result).toBeTruthy();
			expect(typeof result).toEqual("object");
			expect(result.getIms().getArray()[0].getValue()).toEqual(pd.large_person.ims[0].value);
			expect(result.getIms().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.ims[0].normalizedValue);

			future.nest(Person.findByIM(pd.large_person.ims[0].value, IMAddress.TYPE.AIM)).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(future.result).toBeFalsy();

			future.nest(Person.findByIM("doesntexistonaim", IMAddress.TYPE.AIM)).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			expect(future.result).toBeFalsy();
		});
	});

	it("should test findByIMWithServiceAll", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByIM(pd.large_person.ims[0].value, IMAddress.TYPE.GTALK, {
					returnAllMatches: true
				}));
			});

			future.then(this, function () {
				var result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(_.isArray(result)).toBeTruthy();
			expect(typeof result[0]).toEqual("object");
			expect(result[0].getIms().getArray()[0].getValue()).toEqual(pd.large_person.ims[0].value);
			expect(result[0].getIms().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.ims[0].normalizedValue);

			future.nest(Person.findByIM(pd.large_person.ims[0].value, IMAddress.TYPE.AIM, {
				returnAllMatches: true
			})).then(this, function () {
				var result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			requireEmptyArray(future.result);

			future.nest(Person.findByIM("doesntexistonaim", IMAddress.TYPE.AIM, {
				returnAllMatches: true
			})).then(this, function () {
				var result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			requireEmptyArray(future.result);
		});
	});

	it("should test findByPhoneSingle", function () {
		var future = new Future(),
			result,
			done = false;

		runs(function () {
			future.now(this, function () {
				future.nest(Person.findByPhone(pd.large_person.phoneNumbers[0].value));
			});

			future.then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(result).toBeTruthy();
			expect(typeof result).toEqual("object");
			//TODO: why is it necessary to include both stripped and non-stripped versions?
			expect(result.getPhoneNumbers().getArray()[0].getValue() === pd.large_person.phoneNumbers[0].value ||
						result.getPhoneNumbers().getArray()[0].getValue() === PhoneNumber.strip(pd.large_person.phoneNumbers[0].value)).toBeTruthy();
			expect(result.getPhoneNumbers().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.phoneNumbers[0].normalizedValue);

			future.nest(Person.findByPhone("(999) 999-9999")).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			done = false;
			expect(future.result).toBeFalsy();

			future.nest(Person.findByPhone("asdf")).then(this, function () {
				result = future.result;
				return (done = true);
			});
		});

		waitsFor(function () {
			return done;
		});

		runs(function () {
			expect(future.result).toBeFalsy();
		});
	});

	it("should test findByPhoneSingleIncludeItem", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(Person.findByPhone(pd.large_person.phoneNumbers[0].value, {
				includeMatchingItem: true
			}));
		});

		future.then(this, function () {
			var result = future.result;

			expect(result);
			expect(typeof result).toEqual("object");
			expect(typeof result.person).toEqual("object");
			//TODO: why is it necessary to include both stripped and non-stripped versions?
			expect(result.person.getPhoneNumbers().getArray()[0].getValue() === pd.large_person.phoneNumbers[0].value ||
						result.person.getPhoneNumbers().getArray()[0].getValue() === PhoneNumber.strip(pd.large_person.phoneNumbers[0].value));
			expect(result.person.getPhoneNumbers().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.phoneNumbers[0].normalizedValue);
			expect(result.item.getValue() === pd.large_person.phoneNumbers[0].value ||
						result.item.getValue() === PhoneNumber.strip(pd.large_person.phoneNumbers[0].value));
			expect(result.item.getDBObject().normalizedValue).toEqual(pd.large_person.phoneNumbers[0].normalizedValue);

			future.nest(Person.findByPhone("(999) 999-9999", {
				includeMatchingItem: true
			}));
		});

		future.then(this, function () {
			expect(future.result).toBeFalsy();

			future.nest(Person.findByPhone("asdf", {
				includeMatchingItem: true
			}));
		});

		future.then(this, function () {
			expect(future.result).toBeFalsy();

			reportResults(MojoTest.passed);
		});
	});

	it("should test findByPhoneAll", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(Person.findByPhone(pd.large_person.phoneNumbers[0].value, {
				returnAllMatches: true
			}));
		});

		future.then(this, function () {
			var result = future.result;

			expect(_.isArray(result));
			expect(typeof result[0]).toEqual("object");
			expect(result[0].getPhoneNumbers().getArray()[0].getValue() === pd.large_person.phoneNumbers[0].value ||
						result[0].getPhoneNumbers().getArray()[0].getValue() === PhoneNumber.strip(pd.large_person.phoneNumbers[0].value));
			expect(result[0].getPhoneNumbers().getArray()[0].getDBObject().normalizedValue).toEqual(pd.large_person.phoneNumbers[0].normalizedValue);

			future.nest(Person.findByPhone("789-7890", {
				returnAllMatches: true
			}));
		});

		future.then(this, function () {
			var result = future.result;

			expect(_.isArray(result));
			expect(typeof result[0]).toEqual("object");
			expect(result[0].getPhoneNumbers().getArray()[1].getValue()).toEqual(pd.large_person.phoneNumbers[1].value);
			expect(result[0].getPhoneNumbers().getArray()[1].getValue() === pd.large_person.phoneNumbers[1].value ||
						result[0].getPhoneNumbers().getArray()[1].getValue() === PhoneNumber.strip(pd.large_person.phoneNumbers[1].value));
			expect(result[0].getPhoneNumbers().getArray()[1].getDBObject().normalizedValue).toEqual(pd.large_person.phoneNumbers[1].normalizedValue);

			future.nest(Person.findByPhone("999.789.7890", {
				returnAllMatches: true
			}));
		});

		future.then(this, function () {
			requireEmptyArray(future.result);

			future.nest(Person.findByPhone("(999) 999-9999", {
				returnAllMatches: true
			}));
		});

		future.then(this, function () {
			requireEmptyArray(future.result);

			future.nest(Person.findByPhone("asdf", {
				returnAllMatches: true
			}));
		});

		future.then(this, function () {
			requireEmptyArray(future.result);

			reportResults(MojoTest.passed);
		});
	});
*/
	function orderContactIdsTestHelper(person, otherPeople, newContact, expectedResult) {
		var sortedContactIds;
		sortedContactIds = Person.orderContactIds(person, otherPeople, newContact);
		expect(_.isEqual(sortedContactIds, expectedResult)).toBeTruthy();
	}

	it("should test orderContactIds", function () {
		var tempPerson,
			tempPersonToMerge,
			otherPeopleToMerge,
			newContactToMerge,
			expectedResult;

		// Testing that a merged person's contact will be place between the orignial person's
		// contacts
		tempPerson = new Person();
		tempPerson.setContacts([
			new Contact({ _id: "1", _kind: "com.palm.contact.linkedin:1" }),
			new Contact({ _id: "2", _kind: "com.palm.contact.eas:1" })
		]);

		tempPersonToMerge = new Person();
		tempPersonToMerge.setContacts([
			new Contact({ _id: "3", _kind: "com.palm.contact.facebook:1" })
		]);

		otherPeopleToMerge = [];
		otherPeopleToMerge.push(tempPersonToMerge);
		expectedResult = ["1", "3", "2"];
		orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);

		// Testing that the primary of the original contact is retained during a merge
		tempPerson = new Person();
		tempPerson.setContacts([
			new Contact({ _id: "1", _kind: "com.palm.contact.eas:1" }),
			new Contact({ _id: "2", _kind: "com.palm.contact.linkedin:1" })
		]);

		tempPersonToMerge = new Person();
		tempPersonToMerge.setContacts([
			new Contact({ _id: "3", _kind: "com.palm.contact.facebook:1" })
		]);

		otherPeopleToMerge = [];
		otherPeopleToMerge.push(tempPersonToMerge);
		expectedResult = ["1", "2", "3"];
		orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);

		// A new contact with a higher priority will move to the top of the original persons
		// contacts while a merge does not split up the original person's contact order
		tempPerson = new Person();
		tempPerson.setContacts([
			new Contact({ _id: "1", _kind: "com.palm.contact.eas:1" }),
			new Contact({ _id: "2", _kind: "com.palm.contact.linkedin:1" })
		]);

		tempPersonToMerge = new Person();
		tempPersonToMerge.setContacts([
			new Contact({ _id: "3", _kind: "com.palm.contact.facebook:1" })
		]);

		newContactToMerge = new Contact({ _id: "4", _kind: "com.palm.contact.linkedin:1" });
		otherPeopleToMerge = [];
		otherPeopleToMerge.push(tempPersonToMerge);
		expectedResult = ["4", "3", "1", "2"];
		orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
		newContactToMerge = undefined;

		// A new contact comes in but there are no additional people it causes to merge with
		// the original person
		tempPerson = new Person();
		tempPerson.setContacts([
			new Contact({ _id: "1", _kind: "com.palm.contact.eas:1" }),
			new Contact({ _id: "2", _kind: "com.palm.contact.awesome3rdparty:1" })
		]);

		newContactToMerge = new Contact({ _id: "4", _kind: "com.palm.contact.linkedin:1" });
		otherPeopleToMerge = undefined;
		expectedResult = ["4", "1", "2"];
		orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
		newContactToMerge = undefined;

		// A new contact comes in but there are no additional people it causes to merge with
		// the original person. Original person only has 1 contact
		tempPerson = new Person();
		tempPerson.setContacts([
			new Contact({ _id: "2", _kind: "com.palm.contact.awesome3rdparty:1" })
		]);

		newContactToMerge = new Contact({ _id: "4", _kind: "com.palm.contact.linkedin:1" });
		otherPeopleToMerge = undefined;
		expectedResult = ["4", "2"];
		orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
		newContactToMerge = undefined;
	});

/*
	function helperVerifyPersonAttachingContactsWorked(person, contacts, reportResults) {
		var helperFuture = new Future();

		helperFuture.now(this, function () {
			helperFuture.nest(Person.getLinkablePersonAndContactsById(person.getId()));
		});

		helperFuture.then(this, function () {
			var result = helperFuture.result,
				fetchedPerson,
				linkedContacts,
				localContact,
				fetchedContact,
				i,
				j;

			if (result) {
				fetchedPerson = result;
				linkedContacts = fetchedPerson.getContacts();
				for (i = 0; i < linkedContacts.length; i += 1) {
					fetchedContact = linkedContacts[i];
					for (j = 0; j < contacts.length; j += 1) {
						localContact = contacts[j];
						// Make sure that we are on a level playing field
						localContact = new Contact(localContact.getDBObject());
						if (localContact.equals(fetchedContact)) {
							contacts.splice(j, 1);
						}
					}
				}

				if (contacts.length > 0) {
					console.log("There were extra contacts that should not have been there");
					reportResults(MojoTest.failed);
				} else {
					if (person.equals(fetchedPerson)) {
						reportResults(MojoTest.passed);
					} else {
						reportResults(MojoTest.passed);
					}

				}

			} else {
				console.log("There was an error trying to retrieve the Person and contacts to verify personAttachingTheseContacts test");
				reportResults(MojoTest.failed);
			}
		});
	}

	// Be sure the linker is running when this test starts
	it("should test savePersonAttachingTheseContacts", function (reportResults) {
		var future = new Future(),
			testPerson = new Person(),
			testContact1 = new Contact(),
			testContact2 = new Contact();

		future.now(this, function () {
			future.nest(testPerson._savePersonAttachingTheseContacts([testContact1]));
		});

		future.then(this, function () {
			var result = future.result;
			if (result) {
				helperVerifyPersonAttachingContactsWorked(testPerson, [testContact1], reportResults);
			} else {
				console.log("testSaveAttachingTheseContacts Failed: There was an error trying to save the person and contacts");
				console.log(JSON.stringify(result));
				reportResults(MojoTest.failed);
			}
		});
	});
*/

});