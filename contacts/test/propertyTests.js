/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, include, UnitTest, console, Utils, JSON, PropertyBase, Account, Address, Anniversary, 
Birthday, ContactId, DisplayName, EmailAddress, Gender, IMAddress, Nickname, Note, Organization, 
PhoneNumber, ContactPhoto, PersonPhotos, ReadOnly, SearchTerm, SortKey, SyncSource, Tag, Url, Name, Favorite, Reminder, Ringtone, _, PhoneNumberExtended, PropertyArray */

var webos = IMPORTS.require('webos');
webos.include("test/loadall.js");

function PropertyTests() {
}

PropertyTests.prototype.testDirtyFlag = function () {
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
	
	return UnitTest.passed;
};

PropertyTests.prototype.testDirtyFlagOnPropertyArray = function () {
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
	
	return UnitTest.passed;
};

// @param classConfig	-	the configuration object that is used to create a property object.
//							This object is passed to PropertyBase
// @param testData		-	Object that will be compared to values pulled out of the class instance
// @param classInstance	-	The instianted class object that we want to inspect

PropertyTests.prototype.validateGetters = function (ClassObj, testData, classInstance) {
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
};

PropertyTests.prototype.validateSetterFunctions = function (ClassObj, testData, classInstance) {
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
};

PropertyTests.prototype.validateSetterProperties = function (ClassObj, testData, classInstance) {
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
};

// provide this method with a class and 3 different data objects for that class
PropertyTests.prototype.validateGettersAndSetters = function (ClassObj, obj1, obj2, obj3) {
	var GETTER_ERROR = "getter is not returning value that was set",
		GERRER_PROPERTY_ERROR = "getter property is not returning value that was set",
		validateGetters = Utils.curry(this.validateGetters, ClassObj),
		validateSetterFunctions = Utils.curry(this.validateSetterFunctions, ClassObj),
		validateSetterProperties = Utils.curry(this.validateSetterProperties, ClassObj),
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
};

PropertyTests.prototype.testReinitialize = function () {
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
	
	return UnitTest.passed;
};

// This is a simple shallow search that checks to see if both objects have the the same properties
// objects and functions are ignored.  Cases were object properties exist should have extra tests
PropertyTests.prototype.simplePropertyMatch = function (master, toCheck) {
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
};

PropertyTests.prototype.testEqualsMethod = function () {
	var email1 = new EmailAddress({value: "aslong@awesome.com", type: "type_work"}),
		email2 = new EmailAddress({value: "aslong@awesome.com", type: "type_work"}),
		email3,
		email4;
	
	if (!email1.equals(email2)) {
		return UnitTest.failed;
	}
	
	
	email3 = new EmailAddress({value: "aslong@awesome.com", type: "type_work"});
	email4 = new EmailAddress({value: "aslong2@awesome.com", type: "type_work"});
	
	if (email3.equals(email4)) {
		return UnitTest.failed;
	}
	
	return UnitTest.passed;
};

PropertyTests.prototype.testPhoneNumber = function () {
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
		
	UnitTest.require(this.simplePropertyMatch(phone1, new PhoneNumber(phone1).getDBObject()));
		
	this.validateGettersAndSetters(PhoneNumber, phone1, phone2, phone3);

	return UnitTest.passed;
};

// TODO: Add tests for phone number static methods

PropertyTests.prototype.testEmailAddress = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(email1, new EmailAddress(email1).getDBObject()));
	
	this.validateGettersAndSetters(EmailAddress, email1, email2, email3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testIMAddress = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(im1, new IMAddress(im1).getDBObject()));
	
	this.validateGettersAndSetters(IMAddress, im1, im2, im3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testFavorite = function () {
	var favorite = true, 
		notFavorite = false,
		makeValidMethodHappy = true; 
		
	UnitTest.require(favorite === new Favorite(favorite).getDBObject());
		
	this.validateGettersAndSetters(Favorite, favorite, notFavorite, makeValidMethodHappy);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testBirthday = function () {
	var birthday1 = "1984-04-04", 
		birthday2 = "1983-03-03", 
		birthday3 = "1982-02-02";
		
	UnitTest.require(birthday1 === new Birthday(birthday1).getDBObject());
		
	this.validateGettersAndSetters(Birthday, birthday1, birthday2, birthday3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testSyncSource = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(source1, new SyncSource(source1).getDBObject()));
	
	this.validateGettersAndSetters(SyncSource, source1, source2, source3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testDisplayName = function () {
	var name1 = "Donald Duck", 
		name2 = "John Smith", 
		name3 = "Frank Abagnale";
	
	UnitTest.require(name1 === new DisplayName(name1).getDBObject());
	
	this.validateGettersAndSetters(DisplayName, name1, name2, name3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testNickname = function () {
	var name1 = "The situation", 
		name2 = "JWOW", 
		name3 = "Snooki";
		
	UnitTest.require(name1 === new Nickname(name1).getDBObject());
		
	this.validateGettersAndSetters(Nickname, name1, name2, name3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testAnniversary = function () {
	var anniversary1 = "2007-02-23", 
		anniversary2 = "2004-02-02", 
		anniversary3 = "1987-11-22";
	
	UnitTest.require(anniversary1 === new Anniversary(anniversary1).getDBObject());
	
	this.validateGettersAndSetters(Anniversary, anniversary1, anniversary2, anniversary3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testGender = function () {
	var gender1 = "male", 
		gender2 = "female", 
		gender3 = "undisclosed";
	
	UnitTest.require(gender1 === new Gender(gender1).getDBObject());
	
	this.validateGettersAndSetters(Gender, gender1, gender2, gender3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testNote = function () {
	var note1 = "How much wood could a woodchuck chuck if a woodchuck could chuck wood?", 
		note2 = "Why do we park in driveways and drive on parkways?", 
		note3 = "This guy owes me money.";
	
	UnitTest.require(note1 === new Note(note1).getDBObject());
	
	this.validateGettersAndSetters(Note, note1, note2, note3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testReminder = function () {
	var reminder1 = "Don't forget the eggs!!!!!!!", 
		reminder2 = "Buy him cake", 
		reminder3 = "This guy owes me money.";
	
	UnitTest.require(reminder1 === new Reminder(reminder1).getDBObject());
	
	this.validateGettersAndSetters(Reminder, reminder1, reminder2, reminder3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testRingtone = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(ringtone1, new Ringtone(ringtone1).getDBObject()));
	
	this.validateGettersAndSetters(Ringtone, ringtone1, ringtone2, ringtone3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testUrl = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(url1, new Url(url1).getDBObject()));
	
	this.validateGettersAndSetters(Url, url1, url2, url3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testContactPhoto = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(photo1, new ContactPhoto(photo1).getDBObject()));
	
	this.validateGettersAndSetters(ContactPhoto, photo1, photo2, photo3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testPersonPhotos = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(photo1, wrappedPhoto1.getDBObject()));
	
	UnitTest.requireIdentical(wrappedPhoto1.getListPhotoSourcePath(), photo1.bigPhotoPath);
	UnitTest.requireIdentical(wrappedPhoto2.getListPhotoSourcePath(), photo2.squarePhotoPath);
	
	this.validateGettersAndSetters(PersonPhotos, photo1, photo2, photo3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testAddress = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(address1, new Address(address1).getDBObject()));
	
	this.validateGettersAndSetters(Address, address1, address2, address3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testOrganization = function () {
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
	validateGetters = Utils.curry(this.validateGetters, Address),
	validateSetterFunctions = Utils.curry(this.validateSetterFunctions, Address),
	validateSetterProperties = Utils.curry(this.validateSetterProperties, Address),
	decoratedOrg1,
	decoratedOrg2,
	decoratedOrg3,
	organization1 = getOrg1(),
	organization2 = getOrg2(),
	organization3 = getOrg3();
	this.validateGettersAndSetters(Organization, organization1, organization2, organization3);
	

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
	
	return UnitTest.passed;
};

PropertyTests.prototype.testAccount = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(account1, new Account(account1).getDBObject()));
	
	this.validateGettersAndSetters(Account, account1, account2, account3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testTag = function () {
	var tag1 = "GFY", 
		tag2 = "TopLive", 
		tag3 = "SuperTopLiveBBQSauce";
	
	UnitTest.require(tag1 === new Tag(tag1).getDBObject());
	
	this.validateGettersAndSetters(Tag, tag1, tag2, tag3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testContactId = function () {
	var contactId1 = "1ds", 
		contactId2 = "3s+d", 
		contactId3 = "s2g";
	
	UnitTest.require(contactId1 === new ContactId(contactId1).getDBObject());
	
	this.validateGettersAndSetters(ContactId, contactId1, contactId2, contactId3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testSortKey = function () {
	var key1 = "123456", 
		key2 = "abcdefghijklmnopqrstuvwxyz", 
		key3 = "987654321abcdefghijk";
	
	UnitTest.require(key1 === new SortKey(key1).getDBObject());
	
	this.validateGettersAndSetters(SortKey, key1, key2, key3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testSearchTerm = function () {
	var term1 = "one", 
		term2 = "two", 
		term3 = "three";
		
	UnitTest.require(term1 === new SearchTerm(term1).getDBObject());
	
	this.validateGettersAndSetters(SearchTerm, term1, term2, term3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testReadOnly = function () {
	var test1 = true, 
		test2 = false, 
		test3 = true;
	
	UnitTest.require(test1 === new ReadOnly(test1).getDBObject());
	
	this.validateGettersAndSetters(ReadOnly, test1, test2, test3);
	
	return UnitTest.passed;
};

PropertyTests.prototype.testName = function () {
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
	
	UnitTest.require(this.simplePropertyMatch(name1, new Name(name1).getDBObject()));
	
	UnitTest.requireIdentical("McLovin Fogel", new Name(name3).getFullName());
	
	this.validateGettersAndSetters(Name, name1, name2, name3);
	
	return UnitTest.passed;
};