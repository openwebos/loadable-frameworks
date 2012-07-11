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

/*global describe, expect, it, xit, include, console, Utils, JSON, PropertyBase, Account, Address, Anniversary,
Birthday, ContactId, DisplayName, EmailAddress, Gender, IMAddress, Nickname, Note, Organization,
PhoneNumber, ContactPhoto, PersonPhotos, ReadOnly, SearchTerm, SortKey, SyncSource, Tag, Url, Name, Favorite, Reminder, Ringtone, _, PhoneNumberExtended, PropertyArray, require */

var utils = require('./utils');
var UnitTest = utils;

describe("Property Tests", function () {

	it("should test dirtyFlag", function () {
		var testEmail = new EmailAddress(),
			testEmail2 = new EmailAddress({
				value: "dontEmailMe@loveemail.com",
				type: "blaaa",
				primary: true
			}),
			testPhoneNumber = new PhoneNumberExtended();

		UnitTest.requireFalse(testEmail.isDirty(), "Email is dirty after initialization");
		UnitTest.requireFalse(testEmail2.isDirty(), "Email 2 is dirty after initialization with raw object");
		UnitTest.requireFalse(testPhoneNumber.isDirty(), "PhoneNumberExtended is dirty after initialization");

		testEmail.setValue("test@email.com");
		testPhoneNumber.setValue("408-408-4081");

		UnitTest.require(testEmail.isDirty(), "Email is not dirty after setting value");
		UnitTest.require(testPhoneNumber.isDirty(), "PhoneNumberExtended is not dirty after setting value");

		testEmail.markNotDirty();
		testPhoneNumber.markNotDirty();

		UnitTest.requireFalse(testEmail.isDirty(), "Email is dirty after marking it not dirty");
		UnitTest.requireFalse(testPhoneNumber.isDirty(), "PhoneNumberExtended is dirty after marking it not dirty");
	});

	xit("should test dirtyFlagOnPropertyArray", function () {
		var testPropertyArray = new PropertyArray(EmailAddress, {}),
			testEmail = new EmailAddress();

		UnitTest.requireFalse(testPropertyArray.containsDirtyEntry(), "PropertyArray is dirty after initialization");

		testEmail.setValue("test@email.com");

		UnitTest.require(testEmail.isDirty(), "Email is not dirty after setting value");
		UnitTest.require(testPropertyArray.containsDirtyEntry(), "PropertyArray is not dirty after setting value on an element");

		testEmail.markNotDirty();

		UnitTest.requireFalse(testPropertyArray.containsDirtyEntry(), "PropertyArray is dirty after marking the dirty element in it not dirty");

		testEmail.setValue("test@email.com");
		testPropertyArray.markElementsNotDirty();

		UnitTest.requireFalse(testPropertyArray.containsDirtyEntry(), "PropertyArray is dirty after marking the elements in it not dirty");
	});

	// @param classConfig	-	the configuration object that is used to create a property object.
	//							This object is passed to PropertyBase
	// @param testData		-	Object that will be compared to values pulled out of the class instance
	// @param classInstance	-	The instianted class object that we want to inspect

	var local = {
		validateGetters: function (ClassObj, testData, classInstance) {
		UnitTest.requireDefined(testData, "validateGetters requires testData");
		UnitTest.requireDefined(classInstance, "validateGetters requires classInstance");
		UnitTest.requireDefined(ClassObj, "validateGetters requires ClassObj");
		var classConfig = ClassObj.__CLASS_CONFIG,
			i,
			d,
			field,
			getterFunction = null,
			getterFunctionName = null,
			getterPropertyName = null,
			getterValue = null,
			testDataValue = null,
			GETTER_ERROR = "getter is not returning value that was set",
			GERRER_PROPERTY_ERROR = "getter property is not returning value that was set";

		for (i = 0; i < classConfig.length; i = i + 1) {
			// make sure the getter exists
			field = classConfig[i];

			UnitTest.require(field.getterName, "getterName not specified in class config");

			UnitTest.require(field.dbFieldName, "dbFieldName not specified in class config");

			getterFunction = classInstance[field.getterName];

			UnitTest.requireFunction(getterFunction, "getter function not found on class instance: " + field.getterName);

			// confirm that this getter works
			if (ClassObj.isPrimitiveType()) {
				testDataValue = testData;
			} else {
				testDataValue = testData[field.dbFieldName];
			}

			UnitTest.requireDefined(testDataValue, "test data does not contain a database field that is defined on the class config: " + field.dbFieldName);

			getterValue = getterFunction.apply(classInstance, []);
			//getterValue = classInstance[field.getterName]();

			// only check primitive types, more complex objects will require additional testing
			if (typeof getterValue !== "object" || !getterValue) {
				UnitTest.require(getterValue === testDataValue, GETTER_ERROR + " getterValue: " + getterValue + " testDataValue: " + testDataValue);

				// test the property getter
				UnitTest.requireDefined(classInstance[field.propertyName], "class instance does not contain the getter property: " + field.propertyName);

				UnitTest.require(classInstance[field.propertyName] === testDataValue, GERRER_PROPERTY_ERROR);

			} else {
				//console.log("Encountered a field with an object value.  This should be tested separately from this general getter/setter test - value: " + getterValue);
			}
		}
	},

	validateSetterFunctions: function (ClassObj, testData, classInstance) {
		UnitTest.requireDefined(testData, "validateSetters requires testData");
		UnitTest.requireDefined(classInstance, "validateSetters requires classInstance");
		UnitTest.requireDefined(ClassObj, "validateGetters requires ClassObj");

		var classConfig = ClassObj.__CLASS_CONFIG,
			i,
			d,
			field,
			setterFunction = null,
			testDataValue = null;

		for (i = 0; i < classConfig.length; i = i + 1) {
			// make sure the setter exists
			field = classConfig[i];

			UnitTest.require(field.setterName, "setterName not specified in class config");

			setterFunction = classInstance[field.setterName];

			UnitTest.requireFunction(setterFunction, "setter function not found on class instance: " + field.setterName);

			// test data and confirm that this setter works
			if (ClassObj.isPrimitiveType()) {
				testDataValue = testData;
			} else {
				testDataValue = testData[field.dbFieldName];
			}

			if (field.classObject && _.isFunction(field.classObject)) {
				testDataValue = new field.classObject(testDataValue);
			}

			UnitTest.requireDefined(testDataValue, "test data does not contain a database field that is defined on the class config");
			setterFunction.apply(classInstance, [testDataValue]);
		}
	},

	validateSetterProperties: function (ClassObj, testData, classInstance) {
		UnitTest.requireDefined(testData, "validateSetters requires testData");
		UnitTest.requireDefined(classInstance, "validateSetters requires classInstance");
		UnitTest.requireDefined(ClassObj, "validateGetters requires ClassObj");

		var classConfig = ClassObj.__CLASS_CONFIG,
			i,
			d,
			field,
			setterFunction = null,
			setterPropertyName = null,
			testDataValue = null;

		for (i = 0; i < classConfig.length; i = i + 1) {
			// make sure the setter exists
			field = classConfig[i];

			// test the property setter
			if (ClassObj.isPrimitiveType()) {
				testDataValue = testData;
			} else {
				testDataValue = testData[field.dbFieldName];
			}

			if (field.classObject && _.isFunction(field.classObject)) {
				testDataValue = new field.classObject(testDataValue);
			}

			UnitTest.requireDefined(classInstance[field.propertyName], "class instance does not contain the setter property: " + setterPropertyName);

			classInstance[field.propertyName] = testDataValue;
		}
	},

	// provide this method with a class and 3 different data objects for that class
	validateGettersAndSetters: function (ClassObj, obj1, obj2, obj3) {
		var GETTER_ERROR = "getter is not returning value that was set",
			GERRER_PROPERTY_ERROR = "getter property is not returning value that was set",
			validateGetters = Utils.curry(local.validateGetters, ClassObj),
			validateSetterFunctions = Utils.curry(local.validateSetterFunctions, ClassObj),
			validateSetterProperties = Utils.curry(local.validateSetterProperties, ClassObj),
			instance1 = new ClassObj(obj1),
			instance2 = new ClassObj(),	// create an empty object
			instance3 = new ClassObj(obj1);


		//
		//	Start with a populated Object
		//

		// Validate from setting up the Object via constructor
		//console.log("validateGetters - obj1, instance1:");
		validateGetters(obj1, instance1);

		// Validate setter functions
		//console.log("validateSetterFunctions - obj2, instance1:");
		validateSetterFunctions(obj2, instance1);
		//console.log("validateGetters - obj2, instance1:");
		validateGetters(obj2, instance1);


		// Validate setter via properties
		//console.log("validateSetterFunctions - obj3, instance1:");
		validateSetterProperties(obj3, instance1);
		//console.log("validateGetters - obj3, instance1:");
		validateGetters(obj3, instance1);

		//
		//	Start with an empty Object
		//


		// Validate empty object
		//console.log("validateSetterFunctions - obj1, instance2:");
		validateSetterFunctions(obj1, instance2);
		//console.log("validateGetters - obj1, instance2:");
		validateGetters(obj1, instance2);

		//console.log("validateSetterProperties - obj2, instance2:");
		validateSetterFunctions(obj2, instance2);
		//console.log("validateGetters - obj2, instance2:");
		validateGetters(obj2, instance2);
	}
};

	it("should test reinitialize", function () {
		var photo1 = {
				bigPhotoPath: "file://path/to/some/photo.png",
				squarePhotoPath: "file://path/to/some/photo2.png",
				listPhotoPath: "file://path/to/some/photo3.png",
				listPhotoSource: "type_big",
				bigPhotoId: "123",
				squarePhotoId: "124",
				contactId: "125",
				accountId: "126"
			},
			photo2 = {
				bigPhotoPath: "file://path/to/another/photo.png",
				bigPhotoId: "133",
				squarePhotoId: "134",
				contactId: "135",
				accountId: "136"
			},
			wrappedPhoto1 = new PersonPhotos(photo1);

		wrappedPhoto1.reinitialize(photo2);

		UnitTest.requireIdentical("", wrappedPhoto1.getSquarePhotoPath());
		UnitTest.requireIdentical("", wrappedPhoto1.getListPhotoPath());
		UnitTest.requireIdentical("", wrappedPhoto1.getListPhotoSource());
		UnitTest.requireIdentical(photo2.bigPhotoPath, wrappedPhoto1.getBigPhotoPath());
		UnitTest.requireIdentical(photo2.bigPhotoId, wrappedPhoto1.getBigPhotoId());
		UnitTest.requireIdentical(photo2.squarePhotoId, wrappedPhoto1.getSquarePhotoId());
	});

	// This is a simple shallow search that checks to see if both objects have the the same properties
	// objects and functions are ignored.  Cases were object properties exist should have extra tests
	function simplePropertyMatch(master, toCheck) {
		var key;
		for (key in master) {
			if (master.hasOwnProperty(key) && typeof master[key] !== "object" && typeof master[key] !== "function") {
				if (undefined === toCheck[key] || master[key] !== toCheck[key]) {
					return false;
				}
			}
		}

		// reverse the search
		for (key in toCheck) {
			if (toCheck.hasOwnProperty(key) && typeof toCheck[key] !== "object" && typeof toCheck[key] !== "function") {
				if (undefined === master[key] || toCheck[key] !== master[key]) {
					return false;
				}
			}
		}
		return true;
	}

	it("should test equalsMethod", function () {
		var email1 = new EmailAddress({value: "aslong@awesome.com", type: "type_work"}),
			email2 = new EmailAddress({value: "aslong@awesome.com", type: "type_work"}),
			email3,
			email4;

		expect(email1.equals(email2)).toBeTruthy();


		email3 = new EmailAddress({value: "aslong@awesome.com", type: "type_work"});
		email4 = new EmailAddress({value: "aslong2@awesome.com", type: "type_work"});

		expect(email3.equals(email4)).toBeFalsy();
	});

	it("should test phoneNumber", function () {
		// Test using multiple phone numbers to help detect closure bugs that could be the result
		// of a static closure containing a value that changes for each instance of a class.

		var phone1 = {
				value: "1111111111",
				type: "home",
				primary: false
			},
			phone2 = {
				value: "2222222222",
				type: "mobile",
				primary: true
			},
			phone3 = {
				value: "3333333333",
				type: "work",
				primary: true
			};

		UnitTest.require(simplePropertyMatch(phone1, new PhoneNumber(phone1).getDBObject()));

		local.validateGettersAndSetters(PhoneNumber, phone1, phone2, phone3);
	});

	// TODO: Add tests for phone number static methods

	it("should test emailAddress", function () {
		var email1 = {
				value: "therealjohndoe543@gmail.com",
				type: null,
				primary: false
			},
			email2 = {
				value: "willtestforfood@yahoo.com",
				type: null,
				primary: true
			},
			email3 = {
				value: "testinghard@gmail.com",
				type: null,
				primary: true
			};

		UnitTest.require(simplePropertyMatch(email1, new EmailAddress(email1).getDBObject()));

		local.validateGettersAndSetters(EmailAddress, email1, email2, email3);
	});

	xit("should test iMAddress", function () {
		var im1 = {
				value: "therealjohndoe543@gmail.com",
				type: "type_gtalk",
				primary: false
			},
			im2 = {
				value: "willtestforfood@yahoo.com",
				type: "type_yahoo",
				primary: true
			},
			im3 = {
				value: "testinghard@gmail.com",
				type: "type_gtalk",
				primary: true
			};

		UnitTest.require(simplePropertyMatch(im1, new IMAddress(im1).getDBObject()));

		local.validateGettersAndSetters(IMAddress, im1, im2, im3);
	});

	it("should test favorite", function () {
		var favorite = true,
			notFavorite = false,
			makeValidMethodHappy = true;

		UnitTest.require(favorite === new Favorite(favorite).getDBObject());

		local.validateGettersAndSetters(Favorite, favorite, notFavorite, makeValidMethodHappy);
	});

	it("should test birthday", function () {
		var birthday1 = "1984-04-04",
			birthday2 = "1983-03-03",
			birthday3 = "1982-02-02";

		UnitTest.require(birthday1 === new Birthday(birthday1).getDBObject());

		local.validateGettersAndSetters(Birthday, birthday1, birthday2, birthday3);
	});

	it("should test syncSource", function () {
		var source1 = {
				name: "gmail",
				extended: ""
			},
			source2 = {
				name: "yahoo",
				extended: ""
			},
			source3 = {
				name: "eas",
				extended: ""
			};

		UnitTest.require(simplePropertyMatch(source1, new SyncSource(source1).getDBObject()));

		local.validateGettersAndSetters(SyncSource, source1, source2, source3);
	});

	it("should test displayName", function () {
		var name1 = "Donald Duck",
			name2 = "John Smith",
			name3 = "Frank Abagnale";

		UnitTest.require(name1 === new DisplayName(name1).getDBObject());

		local.validateGettersAndSetters(DisplayName, name1, name2, name3);
	});

	it("should test nickname", function () {
		var name1 = "The situation",
			name2 = "JWOW",
			name3 = "Snooki";

		UnitTest.require(name1 === new Nickname(name1).getDBObject());

		local.validateGettersAndSetters(Nickname, name1, name2, name3);
	});

	it("should test anniversary", function () {
		var anniversary1 = "2007-02-23",
			anniversary2 = "2004-02-02",
			anniversary3 = "1987-11-22";

		UnitTest.require(anniversary1 === new Anniversary(anniversary1).getDBObject());

		local.validateGettersAndSetters(Anniversary, anniversary1, anniversary2, anniversary3);
	});

	it("should test gender", function () {
		var gender1 = "male",
			gender2 = "female",
			gender3 = "undisclosed";

		UnitTest.require(gender1 === new Gender(gender1).getDBObject());

		local.validateGettersAndSetters(Gender, gender1, gender2, gender3);
	});

	it("should test note", function () {
		var note1 = "How much wood could a woodchuck chuck if a woodchuck could chuck wood?",
			note2 = "Why do we park in driveways and drive on parkways?",
			note3 = "This guy owes me money.";

		UnitTest.require(note1 === new Note(note1).getDBObject());

		local.validateGettersAndSetters(Note, note1, note2, note3);
	});

	it("should test reminder", function () {
		var reminder1 = "Don't forget the eggs!!!!!!!",
			reminder2 = "Buy him cake",
			reminder3 = "This guy owes me money.";

		UnitTest.require(reminder1 === new Reminder(reminder1).getDBObject());

		local.validateGettersAndSetters(Reminder, reminder1, reminder2, reminder3);
	});

	it("should test ringtone", function () {
		var ringtone1 = {
				name: "Don't forget the eggs!!!!!!!",
				location: "/blaa/ringtone.mp3"
			},
			ringtone2 = {
				name: "Buy him cake",
				location: "/drr/otherRingtone.mp3"
			},
			ringtone3 = {
				name: "This guy owes me money.",
				location: "/ahh/andAnotherRingtone.flac"
			};

		UnitTest.require(simplePropertyMatch(ringtone1, new Ringtone(ringtone1).getDBObject()));

		local.validateGettersAndSetters(Ringtone, ringtone1, ringtone2, ringtone3);
	});

	it("should test url", function () {
		var url1 = {
				value: "http://www.palm.com",
				type: "",
				primary: false
			},
			url2 = {
				value: "www.google.com",
				type: "",
				primary: false
			},
			url3 = {
				value: "yahoo.com",
				type: "",
				primary: false
			};

		UnitTest.require(simplePropertyMatch(url1, new Url(url1).getDBObject()));

		local.validateGettersAndSetters(Url, url1, url2, url3);
	});

	it("should test contactPhoto", function () {
		var photo1 = {
				value: "http://path.com/to/some/photo.png",
				type: "type_big",
				primary: false,
				localPath: "/path/to/some/photo.png"
			},
			photo2 = {
				value: "http://another.com/path/to/photo.jpg",
				type: "type_square",
				primary: false,
				localPath: "/another/to/some/photo.png"
			},
			photo3 = {
				value: "http://www.palm.com/remotePhoto.gif",
				type: "type_square",
				primary: false,
				localPath: "/path/to/some/photo/3.png"
			};

		UnitTest.require(simplePropertyMatch(photo1, new ContactPhoto(photo1).getDBObject()));

		local.validateGettersAndSetters(ContactPhoto, photo1, photo2, photo3);
	});

	it("should test personPhotos", function () {
		var photo1 = {
				bigPhotoPath: "file://path/to/some/photo.png",
				squarePhotoPath: "file://path/to/some/photo2.png",
				listPhotoPath: "file://path/to/some/photo3.png",
				listPhotoSource: "type_big",
				bigPhotoId: "123",
				squarePhotoId: "124",
				contactId: "125",
				accountId: "126"
			},
			photo2 = {
				bigPhotoPath: "file://path/to/another/photo.png",
				squarePhotoPath: "file://path/to/another/photo2.png",
				listPhotoPath: "file://path/to/another/photo3.png",
				listPhotoSource: "type_square",
				bigPhotoId: "133",
				squarePhotoId: "134",
				contactId: "135",
				accountId: "136"
			},
			photo3 = {
				bigPhotoPath: "file://path/to/third/photo.png",
				squarePhotoPath: "file://path/to/third/photo2.png",
				listPhotoPath: "file://path/to/third/photo3.png",
				listPhotoSource: "type_big",
				bigPhotoId: "143",
				squarePhotoId: "144",
				contactId: "145",
				accountId: "146"
			},
			wrappedPhoto1 = new PersonPhotos(photo1),
			wrappedPhoto2 = new PersonPhotos(photo2);

		UnitTest.require(simplePropertyMatch(photo1, wrappedPhoto1.getDBObject()));

		UnitTest.requireIdentical(wrappedPhoto1.getListPhotoSourcePath(), photo1.bigPhotoPath);
		UnitTest.requireIdentical(wrappedPhoto2.getListPhotoSourcePath(), photo2.squarePhotoPath);

		local.validateGettersAndSetters(PersonPhotos, photo1, photo2, photo3);
	});

	it("should test address", function () {
		var address1 = {
				streetAddress: "950 West Maude Ave",
				locality: "Sunnyvale",
				region: "CA",
				postalCode: "94085",
				country: "USA",
				value: "",
				type: "",
				primary: false
			},
			address2 = {
				streetAddress: "123 L33t Str33t",
				locality: "Funnyville",
				region: "CA",
				postalCode: "94040",
				country: "USA",
				value: "",
				type: "",
				primary: false
			},
			address3 = {
				streetAddress: "10 Something Drive",
				locality: "New York",
				region: "NY",
				postalCode: "11201",
				country: "USA",
				value: "",
				type: "",
				primary: false
			};

		UnitTest.require(simplePropertyMatch(address1, new Address(address1).getDBObject()));

		local.validateGettersAndSetters(Address, address1, address2, address3);
	});

	it("should test organization", function () {
		var getOrg1 = function () {
			return {
				name: "Shamwow Software Inc.",
				department: "Sofware Engineering",
				title: "Super Senior Software Engineer with Sugar on Top",
				type: "Mobile",
				startDate: "1945-01-01",
				endDate: "2005-02-01",
				location: {
					streetAddress: "123 L33t Str33t",
					locality: "Funnyville",
					region: "CA",
					postalCode: "94040",
					country: "USA",
					value: "",
					type: "",
					primary: false
				},
				description: "Writes code and stuff"
			};
		}, getOrg2 = function () {
			return {
				name: "Idea Farm",
				department: "Insanity ",
				title: "VP Weird Marketing",
				type: "Fake",
				startDate: "2008-01-02",
				endDate: "2010-10-15",
				location: {
					streetAddress: "Somewhere on El Camino",
					locality: "Mountain View",
					region: "CA",
					postalCode: "94040",
					country: "USA",
					value: "",
					type: "",
					primary: false
				},
				description: "Honestly what does this guy do"
			};
		}, getOrg3 = function () {
			return {
				name: "Yum yum tasty kitty food co.",
				department: "Taste Experience",
				title: "Captain Obvious",
				type: "Food",
				startDate: "2002-02-25",
				endDate: "2009-06-22",
				location: {
					streetAddress: "11 Some street",
					locality: "Cupertino",
					region: "CA",
					postalCode: "94040",
					country: "USA",
					value: "",
					type: "",
					primary: false
				},
				description: "Eats cat food and enjoys"
			};
		},
		validateGetters = Utils.curry(local.validateGetters, Address),
		validateSetterFunctions = Utils.curry(local.validateSetterFunctions, Address),
		validateSetterProperties = Utils.curry(local.validateSetterProperties, Address),
		decoratedOrg1,
		decoratedOrg2,
		decoratedOrg3,
		organization1 = getOrg1(),
		organization2 = getOrg2(),
		organization3 = getOrg3();
		local.validateGettersAndSetters(Organization, organization1, organization2, organization3);


		organization1 = getOrg1();
		organization2 = getOrg2();
		organization3 = getOrg3();
		decoratedOrg1 = new Organization(getOrg1());
		decoratedOrg2 = new Organization(getOrg2());
		decoratedOrg3 = new Organization(getOrg3());
		// verify that the sub object for location works
		// validate that the location object was constructed properly
		validateGetters(organization1.location, decoratedOrg1.getLocation());
		// call all of the setter methods

		validateSetterFunctions(organization2.location, decoratedOrg1.getLocation());
		// verify that all of the setter methods worked
		validateGetters(organization2.location, decoratedOrg1.getLocation());
		// call all of the setter properties
		validateSetterProperties(organization3.location, decoratedOrg1.getLocation());
		// verify that all of the setter properties worked
		validateGetters(organization3.location, decoratedOrg1.getLocation());
	});

	it("should test account", function () {
		var account1 = {
				domain: "gmail",
				userName: "therealjohndoe543@gmail.com",
				userid: "12345"
			},
			account2 = {
				domain: "yahoo",
				userName: "therealjohndoe543@yahoo.com",
				userid: "L33T"
			},
			account3 = {
				domain: "eas",
				userName: "fake.person@palm.com",
				userid: "12345"
			};

		UnitTest.require(simplePropertyMatch(account1, new Account(account1).getDBObject()));

		local.validateGettersAndSetters(Account, account1, account2, account3);
	});

	it("should test tag", function () {
		var tag1 = "GFY",
			tag2 = "TopLive",
			tag3 = "SuperTopLiveBBQSauce";

		UnitTest.require(tag1 === new Tag(tag1).getDBObject());

		local.validateGettersAndSetters(Tag, tag1, tag2, tag3);
	});

	it("should test contactId", function () {
		var contactId1 = "1ds",
			contactId2 = "3s+d",
			contactId3 = "s2g";

		UnitTest.require(contactId1 === new ContactId(contactId1).getDBObject());

		local.validateGettersAndSetters(ContactId, contactId1, contactId2, contactId3);
	});

	it("should test sortKey", function () {
		var key1 = "123456",
			key2 = "abcdefghijklmnopqrstuvwxyz",
			key3 = "987654321abcdefghijk";

		UnitTest.require(key1 === new SortKey(key1).getDBObject());

		local.validateGettersAndSetters(SortKey, key1, key2, key3);
	});

	it("should test searchTerm", function () {
		var term1 = "one",
			term2 = "two",
			term3 = "three";

		UnitTest.require(term1 === new SearchTerm(term1).getDBObject());

		local.validateGettersAndSetters(SearchTerm, term1, term2, term3);
	});

	it("should test readOnly", function () {
		var test1 = true,
			test2 = false,
			test3 = true;

		UnitTest.require(test1 === new ReadOnly(test1).getDBObject());

		local.validateGettersAndSetters(ReadOnly, test1, test2, test3);
	});

	it("should test name", function () {
		var name1 = {
				givenName: "Austin",
				middleName: "Danger",
				familyName: "Powers",
				honorificPrefix: "Sir",
				honorificSuffix: "Jr"
			},
			name2 = {
				givenName: "John",
				middleName: "David",
				familyName: "Smith",
				honorificPrefix: "",
				honorificSuffix: "Jr"
			},
			name3 = {
				givenName: "  McLovin  ",
				middleName: "",
				familyName: " \t\n Fogel\r \t",
				honorificPrefix: "",
				honorificSuffix: ""
			};

		UnitTest.require(simplePropertyMatch(name1, new Name(name1).getDBObject()));

		UnitTest.requireIdentical("McLovin Fogel", new Name(name3).getFullName());

		local.validateGettersAndSetters(Name, name1, name2, name3);
	});
});