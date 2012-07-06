/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, require: true, MojoTest, JSON, console, PersonFactory, Person, 
Future, Test, IMAddress, PersonType, Contact, PalmCall, PhoneNumber, ListWidget, DB, _ */

if (typeof require === 'undefined') {
	require = IMPORTS.require;
}
var webos = require('webos');
webos.include("test/loadall.js");

function PersonTests() {
	var fs = require('fs');	
	this.pd = JSON.parse(fs.readFileSync("test/persondata.json"));
}

PersonTests.prototype.before = function (done) {
	if (this.largePerson) {
		done();
		return;
	}
	
	var future = new Future();

	future.now(this, function () {
		this.largePerson = PersonFactory.createPersonDisplay(this.pd.large_person);
		
		future.nest(this.largePerson.save());
	});

	future.then(done);
};

PersonTests.prototype.after = function (done) {
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
	
	future.then(done);
};

PersonTests.prototype.requireEmptyArray = function (value) {
	Test.requireArray(value);
	Test.requireIdentical(value.length, 0);
};


PersonTests.prototype.testPerson = function () {
	var p = PersonFactory.createPersonDisplay(this.pd.large_person);
	Test.requireObject(p);
	p = PersonFactory.createPersonLinkable(this.pd.large_person);
	Test.requireObject(p);
	p = PersonFactory.createPersonDisplayLite(this.pd.large_person);
	Test.requireObject(p);
	p = PersonFactory.create(this.pd.large_person);
	Test.requireObject(p);
	p = PersonFactory.create(this.pd.large_person, PersonType.DISPLAYABLE);
	Test.requireObject(p);
	p = PersonFactory.create(this.pd.large_person, PersonType.LINKABLE);
	Test.requireObject(p);
	p = PersonFactory.create(this.pd.large_person, PersonType.RAWOBJECT);
	Test.requireObject(p);
	return MojoTest.passed;
};

PersonTests.prototype.testDirtyFlag = function () {
	var person = new Person(this.pd.large_person);
	
	Test.requireFalse(person.isDirty(), "Person was dirty after initialization");
	
	person.getPhoneNumbers().getArray()[0].setValue("4352344433");
	
	Test.require(person.isDirty(), "Person was not dirty after modifying object in array");
	
	person.markNotDirty();
	
	Test.requireFalse(person.isDirty(), "Person was dirty after marking it as not dirty after modifying object in array");
	
	person.getReminder().setValue("This is my awesome reminder");
	
	Test.require(person.isDirty(), "Person was not dirty after modifying an object");
	
	person.markNotDirty();
	
	Test.requireFalse(person.isDirty(), "Person was dirty after marking it as not dirty after modifying an object");
	
	return MojoTest.passed;
};

PersonTests.prototype.testSaveRetry = function (done) {
	var person = new Person(this.pd.large_person);
	
	person.save().then(function (future) {
		var result = future.result;
		
		person.setRev(-1);
		person.getReminder().setValue("Catch the db mismatch!!!");
		return person.save(true);
	}).then(function (future) {
		var result = future.result;
		
		done(MojoTest.passed);
	});
};

PersonTests.prototype.testSetContactWithIdAsPrimary = function () {
	var person = new Person(this.pd.large_person),
		currentPrimary,
		expectedPrimary;
	
	currentPrimary = person.getContactIds().getArray()[0];
	expectedPrimary = person.getContactIds().getArray()[1];
	
	Test.require(person.setContactWithIdAsPrimary(expectedPrimary.getValue()));
	Test.require(expectedPrimary.getValue() === person.getContactIds().getArray()[0].getValue());
	
	currentPrimary = person.getContactIds().getArray()[0];
	expectedPrimary = person.getContactIds().getArray()[0];
	
	Test.requireFalse(person.setContactWithIdAsPrimary(currentPrimary.getValue()));
	Test.require(expectedPrimary.getValue() === person.getContactIds().getArray()[0].getValue());
	
	currentPrimary = person.getContactIds().getArray()[0];
	expectedPrimary = person.getContactIds().getArray()[2];
	
	Test.require(person.setContactWithIdAsPrimary(expectedPrimary.getValue()));
	Test.require(expectedPrimary.getValue() === person.getContactIds().getArray()[0].getValue());
	
	return MojoTest.passed;
};

PersonTests.prototype.testSaveAndDelete = function (reportResults) {
	var p = new Person({
			_kind: "com.palm.person:1",
			names: [{
				familyName: "tom"
			}]
		}),
		future = p.save(),
		success = false;
	
	future.then(this, function () {
		var result = future.result;
		if (result) {
			future.nest(p.deletePerson());
			success = true;
		} else {
			console.log(JSON.stringify(result));
			future.result = false;
		}
	});
	
	future.then(this, function () {
		var result = future.result;
		if (result && success) {
			reportResults(MojoTest.passed);
		} else {
			console.log(JSON.stringify(result));
			reportResults(MojoTest.failed);
		}
	});
};

PersonTests.prototype.testGetDisplayablePersonAndContactsById = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.getDisplayablePersonAndContactsById(this.largePerson.getId()));
	});
	
	future.then(this, function () {
		var result = future.result;
		if (result && typeof result === "object") {
			reportResults(MojoTest.passed);
		} else {
			reportResults(MojoTest.failed);
		}
	});
};

PersonTests.prototype.testFindByContactIdsStringPrimaryFound = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByContactIds(this.largePerson.generateLauncherCallbackId().split(Person.DELIMITER)));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result && result.getId() === this.largePerson.getId()) {
			reportResults(MojoTest.passed);
		} else {
			reportResults(MojoTest.failed);
		}
	});
};

PersonTests.prototype.testFindByContactIdsStringDifferentPrimary = function (reportResults) {
	var future = new Future();
	
	this.largePerson.getContactIds().clear();
	
	this.largePerson.getContactIds().add("notGonnaMatchPrimary");
	this.largePerson.getContactIds().add(this.pd.large_person.contactIds.slice(1));
	
	future.now(this, function () {
		future.nest(Person.findByContactIds(Person.getContactIdsFromLauncherCallbackId(this.largePerson.generateLauncherCallbackId())));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result && result.getId() === this.largePerson.getId()) {
			reportResults(MojoTest.passed);
		} else {
			reportResults(MojoTest.failed);
		}
	});
};

PersonTests.prototype.testFindByContactIdsStringNotFound = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByContactIds(["aewfoiwef"]));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(!result, "testFindByContactIdsStringNotFound: getting result from findByContactIds was truthy");

		reportResults(MojoTest.passed);
	});
};

/*
 * Person.findByXXX tests
 */

//TODO: add tests for findByXXX's that test personType

PersonTests.prototype.testFindByEmailSingle = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByEmail(this.pd.large_person.emails[0].value));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(result);
		Test.requireIdentical(typeof result, "object");
		Test.requireIdentical(result.getEmails().getArray()[0].getValue(), this.pd.large_person.emails[0].value);
		Test.requireIdentical(result.getEmails().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.emails[0].normalizedValue);
		
		future.nest(Person.findByEmail("doesntexist@nowhere.com"));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByEmailSingleIncludeItem = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByEmail(this.pd.large_person.emails[0].value, {
			includeMatchingItem: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(result);
		Test.requireIdentical(typeof result, "object");
		Test.requireIdentical(typeof result.person, "object");
		Test.requireIdentical(result.person.getEmails().getArray()[0].getValue(), this.pd.large_person.emails[0].value);
		Test.requireIdentical(result.person.getEmails().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.emails[0].normalizedValue);
		Test.requireIdentical(typeof result.item, "object");
		Test.requireIdentical(result.item.getValue(), this.pd.large_person.emails[0].value);
		Test.requireIdentical(result.item.getDBObject().normalizedValue, this.pd.large_person.emails[0].normalizedValue);
		
		future.nest(Person.findByEmail("doesntexist@nowhere.com", {
			includeMatchingItem: true
		}));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByEmailAll = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByEmail(this.pd.large_person.emails[0].value, {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.requireArray(result);
		Test.requireIdentical(typeof result[0], "object");
		Test.requireIdentical(result[0].getEmails().getArray()[0].getValue(), this.pd.large_person.emails[0].value);
		Test.requireIdentical(result[0].getEmails().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.emails[0].normalizedValue);
		
		future.nest(Person.findByEmail("doesntexist@nowhere.com", {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		this.requireEmptyArray(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByIMNoServiceSingle = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByIM(this.pd.large_person.ims[0].value));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(result);
		Test.requireIdentical(typeof result, "object");
		Test.requireIdentical(result.getIms().getArray()[0].getValue(), this.pd.large_person.ims[0].value);
		Test.requireIdentical(result.getIms().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.ims[0].normalizedValue);
		
		future.nest(Person.findByIM("doesntexistonaim"));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByIMNoServiceSingleIncludeItem = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByIM(this.pd.large_person.ims[0].value, undefined, {
			includeMatchingItem: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(result);
		Test.requireIdentical(typeof result, "object");
		Test.requireIdentical(typeof result.person, "object");
		Test.requireIdentical(result.person.getIms().getArray()[0].getValue(), this.pd.large_person.ims[0].value);
		Test.requireIdentical(result.person.getIms().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.ims[0].normalizedValue);
		Test.requireIdentical(typeof result.item, "object");
		Test.requireIdentical(result.item.getValue(), this.pd.large_person.ims[0].value);
		Test.requireIdentical(result.item.getDBObject().normalizedValue, this.pd.large_person.ims[0].normalizedValue);
		
		future.nest(Person.findByIM("doesntexistonaim", undefined, {
			includeMatchingItem: true
		}));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByIMNoServiceAll = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByIM(this.pd.large_person.ims[0].value, "", {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.requireArray(result);
		Test.requireIdentical(typeof result[0], "object");
		Test.requireIdentical(result[0].getIms().getArray()[0].getValue(), this.pd.large_person.ims[0].value);
		Test.requireIdentical(result[0].getIms().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.ims[0].normalizedValue);
		
		future.nest(Person.findByIM("doesntexistonaim", "", {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		this.requireEmptyArray(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByIMWithServiceSingle = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByIM(this.pd.large_person.ims[0].value, IMAddress.TYPE.GTALK));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(result);
		Test.requireIdentical(typeof result, "object");
		Test.requireIdentical(result.getIms().getArray()[0].getValue(), this.pd.large_person.ims[0].value);
		Test.requireIdentical(result.getIms().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.ims[0].normalizedValue);
		
		future.nest(Person.findByIM(this.pd.large_person.ims[0].value, IMAddress.TYPE.AIM));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		future.nest(Person.findByIM("doesntexistonaim", IMAddress.TYPE.AIM));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByIMWithServiceAll = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByIM(this.pd.large_person.ims[0].value, IMAddress.TYPE.GTALK, {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.requireArray(result);
		Test.requireIdentical(typeof result[0], "object");
		Test.requireIdentical(result[0].getIms().getArray()[0].getValue(), this.pd.large_person.ims[0].value);
		Test.requireIdentical(result[0].getIms().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.ims[0].normalizedValue);
		
		future.nest(Person.findByIM(this.pd.large_person.ims[0].value, IMAddress.TYPE.AIM, {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		this.requireEmptyArray(future.result);
		
		future.nest(Person.findByIM("doesntexistonaim", IMAddress.TYPE.AIM, {
			returnAllMatches: true
		}));
	});

	future.then(this, function () {
		this.requireEmptyArray(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByPhoneSingle = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByPhone(this.pd.large_person.phoneNumbers[0].value));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(result);
		Test.requireIdentical(typeof result, "object");
		//TODO: why is it necessary to include both stripped and non-stripped versions?
		Test.require(result.getPhoneNumbers().getArray()[0].getValue() === this.pd.large_person.phoneNumbers[0].value || 
					result.getPhoneNumbers().getArray()[0].getValue() === PhoneNumber.strip(this.pd.large_person.phoneNumbers[0].value));
		Test.requireIdentical(result.getPhoneNumbers().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.phoneNumbers[0].normalizedValue);
		
		future.nest(Person.findByPhone("(999) 999-9999"));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		future.nest(Person.findByPhone("asdf"));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByPhoneSingleIncludeItem = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByPhone(this.pd.large_person.phoneNumbers[0].value, {
			includeMatchingItem: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.require(result);
		Test.requireIdentical(typeof result, "object");
		Test.requireIdentical(typeof result.person, "object");
		//TODO: why is it necessary to include both stripped and non-stripped versions?
		Test.require(result.person.getPhoneNumbers().getArray()[0].getValue() === this.pd.large_person.phoneNumbers[0].value || 
					result.person.getPhoneNumbers().getArray()[0].getValue() === PhoneNumber.strip(this.pd.large_person.phoneNumbers[0].value));
		Test.requireIdentical(result.person.getPhoneNumbers().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.phoneNumbers[0].normalizedValue);
		Test.require(result.item.getValue() === this.pd.large_person.phoneNumbers[0].value || 
					result.item.getValue() === PhoneNumber.strip(this.pd.large_person.phoneNumbers[0].value));
		Test.requireIdentical(result.item.getDBObject().normalizedValue, this.pd.large_person.phoneNumbers[0].normalizedValue);
		
		future.nest(Person.findByPhone("(999) 999-9999", {
			includeMatchingItem: true
		}));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		future.nest(Person.findByPhone("asdf", {
			includeMatchingItem: true
		}));
	});
	
	future.then(this, function () {
		Test.requireFalse(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testFindByPhoneAll = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.findByPhone(this.pd.large_person.phoneNumbers[0].value, {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.requireArray(result);
		Test.requireIdentical(typeof result[0], "object");
		Test.require(result[0].getPhoneNumbers().getArray()[0].getValue() === this.pd.large_person.phoneNumbers[0].value || 
					result[0].getPhoneNumbers().getArray()[0].getValue() === PhoneNumber.strip(this.pd.large_person.phoneNumbers[0].value));
		Test.requireIdentical(result[0].getPhoneNumbers().getArray()[0].getDBObject().normalizedValue, this.pd.large_person.phoneNumbers[0].normalizedValue);
		
		future.nest(Person.findByPhone("789-7890", {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		Test.requireArray(result);
		Test.requireIdentical(typeof result[0], "object");
		Test.requireIdentical(result[0].getPhoneNumbers().getArray()[1].getValue(), this.pd.large_person.phoneNumbers[1].value);
		Test.require(result[0].getPhoneNumbers().getArray()[1].getValue() === this.pd.large_person.phoneNumbers[1].value || 
					result[0].getPhoneNumbers().getArray()[1].getValue() === PhoneNumber.strip(this.pd.large_person.phoneNumbers[1].value));
		Test.requireIdentical(result[0].getPhoneNumbers().getArray()[1].getDBObject().normalizedValue, this.pd.large_person.phoneNumbers[1].normalizedValue);
		
		future.nest(Person.findByPhone("999.789.7890", {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		this.requireEmptyArray(future.result);
		
		future.nest(Person.findByPhone("(999) 999-9999", {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		this.requireEmptyArray(future.result);
		
		future.nest(Person.findByPhone("asdf", {
			returnAllMatches: true
		}));
	});
	
	future.then(this, function () {
		this.requireEmptyArray(future.result);
		
		reportResults(MojoTest.passed);
	});
};

PersonTests.prototype.testOrderContactIds = function () {
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
	this.orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
	
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
	this.orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
	
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
	this.orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
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
	this.orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
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
	this.orderContactIdsTestHelper(tempPerson, otherPeopleToMerge, newContactToMerge, expectedResult);
	newContactToMerge = undefined;
	
	return MojoTest.passed;
};

PersonTests.prototype.orderContactIdsTestHelper = function (person, otherPeople, newContact, expectedResult) {
	var sortedContactIds;
	sortedContactIds = Person.orderContactIds(person, otherPeople, newContact);
	Test.require(_.isEqual(sortedContactIds, expectedResult), sortedContactIds + " !== " + expectedResult);
};

PersonTests.timeoutInterval = 13000;


// Be sure the linker is running when this test starts
PersonTests.prototype.testSavePersonAttachingTheseContacts = function (reportResults) {
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
			this.helperVerifyPersonAttachingContactsWorked(testPerson, [testContact1], reportResults);
		} else {
			console.log("testSaveAttachingTheseContacts Failed: There was an error trying to save the person and contacts");
			console.log(JSON.stringify(result));
			reportResults(MojoTest.failed);
		}
	});
};

PersonTests.prototype.helperVerifyPersonAttachingContactsWorked = function (person, contacts, reportResults) {
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
};
