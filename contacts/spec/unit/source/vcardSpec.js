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

/*global _, Address, afterEach, beforeEach, Birthday, console, Contact, DB, describe, EmailAddress,
 expect, Future, IMAddress, include, it, JSON, MojoLoader, Name, Nickname, NULLOBJECT: true,
 Organization, Person, PersonFactory, PhoneNumber, Relation, require, Test, Url, Utils, VCard,
 VCardFileReader, VCardImporter, VCardExporter, xit */

var fs = require('fs');
var waitsForFuture = require('./utils').waitsForFuture;
var fm = MojoLoader.require({name:"foundations.mock", version: "1.0"})["foundations.mock"];

describe("vCard Tests", function () {
	var vCardTests = {},
		pd;

	vCardTests.timeoutInterval = 100000;

	vCardTests.ON_HUDSON = true;
	vCardTests.PERMISSIVE_PATH = vCardTests.ON_HUDSON ? "" : "/home/elovett/";
	vCardTests.JSUNIT_TEST_PATH = vCardTests.ON_HUDSON ? "/usr/palm/frameworks/contacts/test/" : "test/";
	vCardTests.JSUNIT_VCARD_DATA_PATH = vCardTests.JSUNIT_TEST_PATH + "vCardData/";

	function NULLOBJECT (){
		// I am here to represent a NULL/undefined object
		// only use me for testing
		this.awesome = "It sure is";
	}

	NULLOBJECT.prototype.equals = function (otherObject) {
		if (!otherObject) {
			return true;
		}

		return false;
	};

	NULLOBJECT.prototype.toString = function () {
		return "undefined";
	};

	beforeEach(function () {
		fm.Comms.Mock.PalmCall.useMock();
		fm.Data.Mock.DB.useMock();

		if (!pd) {
			pd = JSON.parse(fs.readFileSync("test/persondata.json", "utf8"));
		}

		var future = DB.del({
			from: Contact.kind
		});

		waitsForFuture(future);
	});

	afterEach(function (done) {
		var future = DB.del({
			from: Contact.kind
		});

		future.then(function () {
			future.nest(DB.del({
				from: "com.palm.person:1"
			}));
		});

		waitsForFuture(future);
	});

	// Helper method to display an error message
	vCardTests.displayErrorForTest = function (testName, testingObjectName, returnedValue, shouldHaveBeen) {
		vCardTests.displayError(testName, vCardTests.getMessage(testingObjectName, returnedValue, shouldHaveBeen));
	};

	vCardTests.getMessage = function (testingObjectName, returnedValue, shouldHaveBeen) {
		return "Test case name: \"" + testingObjectName + "\" It returned: ~" + returnedValue + "~ It should have been: ~" + shouldHaveBeen + "~";
	};

	vCardTests.displayError = function (testName, errorMessage) {
		console.log(testName + " ERROR : " + errorMessage);
	};

	////////////////////////// vCard Exporter Tests //////////////////////////

	it("should test writeVCard", function (reportResults) {
		var savedPerson = PersonFactory.createPersonDisplay(pd.large_person),
			future,
			vCardExporter = new VCardExporter({ filePath:vCardTests.PERMISSIVE_PATH + "testWriteVCard.vcf" });

		future = savedPerson.save();

		future.then(this, function () {
			future.nest(vCardExporter.exportOne(savedPerson.getId(), false));
		});

		future.then(this, function () {
			var vCardImporter = new VCardImporter({ filePath:vCardTests.PERMISSIVE_PATH + "testWriteVCard.vcf" });

			future.nest(vCardImporter.readVCard());
		});

		future.then(this, function () {
			//console.log(future.result);
			return true;
		});

		waitsForFuture(future);
	});

	it("should test writeAllPersonsVCard", function (reportResults) {
		var savedPersonLarge = PersonFactory.createPersonDisplay(pd.large_person),
			savedPersonMedium = PersonFactory.createPersonDisplay(pd.medium_person),
			savedPersonSmall = PersonFactory.createPersonDisplay(pd.small_person),
			future,
			vCardExporter = new VCardExporter({ filePath:vCardTests.PERMISSIVE_PATH + "testWriteAllPersonsVCard.vcf" });

		future = savedPersonLarge.save();

		future.then(this, function () {
			future.nest(savedPersonMedium.save());
		});

		future.then(this, function () {
			future.nest(savedPersonSmall.save());
		});

		future.then(this, function () {
			future.nest(vCardExporter.exportAll(false));
		});

		future.then(this, function () {
			var vCardImporter = new VCardImporter({ filePath:vCardTests.PERMISSIVE_PATH + "testWriteAllPersonsVCard.vcf" });

			future.nest(vCardImporter.readVCard());
		});

		future.then(this, function () {
			//console.log(future.result);
			return true;
		});

		waitsForFuture(future);
	});

	it("should test writeAllPersonsOnlyPhoneNumbersVCard", function (reportResults) {
		var savedPersonLarge = PersonFactory.createPersonDisplay(pd.large_person),
			savedPersonMedium = PersonFactory.createPersonDisplay(pd.medium_person),
			savedPersonSmall = PersonFactory.createPersonDisplay(pd.small_person),
			future,
			vCardExporter = new VCardExporter({ filePath:vCardTests.PERMISSIVE_PATH + "testWriteAllPersonsOnlyPhoneNumbersVCard.vcf" });

		future = savedPersonLarge.save();

		future.then(this, function () {
			future.nest(savedPersonMedium.save());
		});

		future.then(this, function () {
			future.nest(savedPersonSmall.save());
		});

		future.then(this, function () {
			future.nest(vCardExporter.exportAll(true));
		});

		future.then(this, function () {
			var vCardImporter = new VCardImporter({ filePath:vCardTests.PERMISSIVE_PATH + "testWriteAllPersonsOnlyPhoneNumbersVCard.vcf" });

			future.nest(vCardImporter.readVCard());
		});

		future.then(this, function () {
			//console.log(future.result);
			return true;
		});

		waitsForFuture(future);
	});

	it("should test sanitizeCustomLabel", function (reportResults) {
		var failed = false,
			returnedValue,
			valueShouldHaveBeen;

		returnedValue = VCardExporter._sanitizeCustomLabel("My house is tan?");
		valueShouldHaveBeen = "Myhouseistan";
		if (returnedValue !== valueShouldHaveBeen) {
			failed = true;
			vCardTests.displayErrorForTest("VCardExporter._sanitizeCustomLabel", "tan house?", returnedValue, valueShouldHaveBeen);
		}

		returnedValue = VCardExporter._sanitizeCustomLabel("This whole string should be good");
		valueShouldHaveBeen = "Thiswholestringshouldbegood";
		if (returnedValue !== valueShouldHaveBeen) {
			failed = true;
			vCardTests.displayErrorForTest("VCardExporter._sanitizeCustomLabel", "whole string", returnedValue, valueShouldHaveBeen);
		}

		returnedValue = VCardExporter._sanitizeCustomLabel("Has some numbers 32 and another2342");
		valueShouldHaveBeen = "Hassomenumbers32andanother2342";
		if (returnedValue !== valueShouldHaveBeen) {
			failed = true;
			vCardTests.displayErrorForTest("VCardExporter._sanitizeCustomLabel", "has numbers", returnedValue, valueShouldHaveBeen);
		}

		returnedValue = VCardExporter._sanitizeCustomLabel("This one has numbers 980234 i34nj*7#@!ected with some s_932ym[}]bols-cool");
		valueShouldHaveBeen = "Thisonehasnumbers980234i34nj7ectedwithsomes932ymbols-cool";
		if (returnedValue !== valueShouldHaveBeen) {
			failed = true;
			vCardTests.displayErrorForTest("VCardExporter._sanitizeCustomLabel", "has symbols numbers and characters", returnedValue, valueShouldHaveBeen);
		}

		expect(failed).toBeFalsy();
	});

	///////////////////////// vCard Importer Tests ///////////////////////////

	/**
	 * Tests the vCardFileReader class is reading files in correctly and readLine is operating as expected
	 *
	 * Passes - When the number of lines returned match the expected # lines in the file.
	 * Fails - When the number of lines doesn't match the expected # lines in the file.
	 *
	 */
	xit("should test vCardFileReader", function (reportResults) {
		var vCardReaderTest = new VCardFileReader({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "vCard3-0.vcf"}),
			line = vCardReaderTest.readLine(),
			linesInFile = 15,
			linesReturned = 0;

		while (line) {
			//console.log("~~~" + line + "~~~");
			line = vCardReaderTest.readLine();
			linesReturned += 1;
		}

		// vCardTests.displayErrorForTest("File Reader", "Count", linesReturned, linesInFile);
		expect(linesReturned).toEqual(linesInFile);
	});

	/**
	 * Tests the vCardImporter can import a vCard and add a contact to the db
	 *
	 * Passes - If the contact is added to the db properly
	 * Fails - If the contact is not added to the db
	 *
	 */
	xit("should test vCardImporterImportOneVCard", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "vCard3-0.vcf", vCardVersion: VCard.VERSIONS.THREE });

		vCardImporter.importVCard().then(this, function () {
			vCardTests.verifyCorrectVCardEntriesSavedToDB(reportResults, _.clone(vCardTests.CONTACTS_FROM_VCARDS.vCard3), "testVCardImporterImportOneVCard");
		});

	});

	/**
	 * Tests the vCardImporter can import a .mig vCard
	 *
	 *
	 */
	xit("should test vCardImporterImportMigVCard", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "contacts.mig", vCardVersion: VCard.VERSIONS.THREE }),
			future = vCardImporter.importVCard();

		waitsForFuture(future);
	});

	/**
	 * Tests the vCardImporter can import a vCard from google and add a contact to the db
	 *
	 * Passes - If the contact is added to the db properly
	 * Fails - If the contact is not added to the db
	 *
	 */
	xit("should test vCardImporterImportOneGoogleVCard", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "googleAll.vcf", vCardVersion: VCard.VERSIONS.THREE });

		vCardImporter.importVCard().then(this, function () {
			vCardTests.verifyCorrectVCardEntriesSavedToDB(reportResults, _.clone(vCardTests.CONTACTS_FROM_VCARDS.googleAll), "testVCardImporterImportOneGoogleVCard");
		});

	});

	// /**
	//  * Tests the vCardImporter can import a vCard from exchange and add a contact to the db
	//  *
	//  * Passes - If the contact is added to the db properly
	//  * Fails - If the contact is not added to the db
	//  *
	//  */
	// xit("should test vCardImporterImportOneExchangeVCard", function (reportResults) {
	//	var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "dangEntourageAll.vcf", vCardVersion: VCard.VERSIONS.THREE });
	//
	//	vCardImporter.importVCard().then(this, function () {
	//		vCardTests.verifyCorrectVCardEntriesSavedToDB(reportResults, _.clone(vCardTests.CONTACTS_FROM_VCARDS.dangEntourageAll, "testVCardImporterImportOneExchangeVCard"));
	//	});
	//
	// };

	/**
	 * Tests the vCardImporter can import a vCard and add a contact to the db
	 *
	 * Passes - If the contact is added to the db properly
	 * Fails - If the contact is not added to the db
	 *
	 */
	xit("should test vCardImporterImportOneVCardThreeContacts", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "3vCardsInOne.vcf", vCardVersion: VCard.VERSIONS.THREE });

		vCardImporter.importVCard().then(this, function () {
			vCardTests.verifyCorrectVCardEntriesSavedToDB(reportResults, _.clone(vCardTests.CONTACTS_FROM_VCARDS.VCards3InOne), "testVCardImporterImportOneVCardThreeContacts");
		});

	});

	/**
	 * Tests the vCardImporter can import a vCard and add a contact to the db and the status callback works
	 *
	 * Passes - If the contact is added to the db properly
	 * Fails - If the contact is not added to the db
	 *
	 */
	xit("should test vCardStatusCallbackWorksSingleContact", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "vCard3-0.vcf", vCardVersion: VCard.VERSIONS.THREE }),
			testPassed,
			statusCallbackFunction,
			vCardTestData = _.clone(vCardTests.CONTACTS_FROM_VCARDS.vCard3);

		vCardTests.contactSaveCounter = 0;
		vCardTests.expectedContactCount = vCardTestData.length;
		vCardTests.stopProcessingAfterContact = -1;

		statusCallbackFunction = vCardTests.statusCallbackFunctionStopOnNthContact;

		vCardImporter.importVCard(statusCallbackFunction).then(this, function () {
			expect(vCardTests.contactSaveCounter === vCardTests.expectedContactCount).toBeTruthy();
			if (vCardTests.contactSaveCounter === vCardTests.expectedContactCount) {
				vCardTests.verifyCorrectVCardEntriesSavedToDB(reportResults, vCardTestData, "testVCardStatusCallbackWorksSingleContact");
			} else {
				console.log("testVCardStatusCallbackWorksSingleContact ERROR: The number of status messages returned (" + vCardTests.contactSaveCounter + ") was not the expected amount(" + vCardTests.expectedContactCount + ")");
			}
		});
	});


	/**
	 * Tests the vCardImporter can import a vCard and add a contact to the db and the status callback works when using a vCard with mutliple contacts
	 *
	 * Passes - If the contact is added to the db properly
	 * Fails - If the contact is not added to the db
	 *
	 */
	xit("should test vCardStatusCallbackWorksMultipleContacts", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "3vCardsInOne.vcf", vCardVersion: VCard.VERSIONS.THREE }),
			testPassed,
			statusCallbackFunction,
			vCardTestData = _.clone(vCardTests.CONTACTS_FROM_VCARDS.VCards3InOne);

		vCardTests.contactSaveCounter = 0;
		vCardTests.expectedContactCount = vCardTestData.length;
		vCardTests.stopProcessingAfterContact = -1;

		statusCallbackFunction = vCardTests.statusCallbackFunctionStopOnNthContact;

		vCardImporter.importVCard(statusCallbackFunction).then(this, function () {
			expect(vCardTests.contactSaveCounter === vCardTests.expectedContactCount).toBeTruthy();
			if (vCardTests.contactSaveCounter === vCardTests.expectedContactCount) {
				vCardTests.verifyCorrectVCardEntriesSavedToDB(reportResults, vCardTestData, "testVCardStatusCallbackWorksMultipleContacts");
			} else {
				console.log("testVCardStatusCallbackWorksMultipleContacts ERROR: The number of status messages returned (" + vCardTests.contactSaveCounter + ") was not the expected amount(" + vCardTests.expectedContactCount + ")");
			}
		});
	});

	/**
	 * Tests the vCardImporter can import a vCard and add a contact to the db and that cancelling from the status callback works
	 *
	 * Passes - If the contact is added to the db properly
	 * Fails - If the contact is not added to the db
	 *
	 */
	xit("should test vCardStatusCallbackCancelAfterSecondContact", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "3vCardsInOne.vcf", vCardVersion: VCard.VERSIONS.THREE }),
			testPassed,
			statusCallbackFunction,
			vCardTestData = _.clone(vCardTests.CONTACTS_FROM_VCARDS.VCards3InOne);

		vCardTests.contactSaveCounter = 0;
		vCardTests.expectedContactCount = vCardTestData.length;
		vCardTests.stopProcessingAfterContact = 2;

		vCardTestData.splice(2, vCardTestData.length - 2);

		statusCallbackFunction = vCardTests.statusCallbackFunctionStopOnNthContact;

		vCardImporter.importVCard(statusCallbackFunction).then(this, function () {
			expect(vCardTests.contactSaveCounter === vCardTests.stopProcessingAfterContact).toBeTruthy();
			if (vCardTests.contactSaveCounter === vCardTests.stopProcessingAfterContact) {
				vCardTests.verifyCorrectVCardEntriesSavedToDB(reportResults, vCardTestData, "testVCardStatusCallbackCancelAfterSecondContact");
			} else {
				console.log("testVCardStatusCallbackCancelAfterSecondContact ERROR: The number of status messages returned (" + vCardTests.contactSaveCounter + ") was not the expected amount(" + vCardTests.expectedContactCount + ")");
			}
		});
	});

	/**
	 * Tests the vCardImporter can read a vCard and return the contacts from that vCard while using a status callback
	 *
	 * Passes - If the contact is returned properly
	 * Fails - If the contact is not returned properly
	 *
	 */
	xit("should test vCardStatusCallbackWorksMultipleContactsNotSavingToDB", function (reportResults) {
		var vCardImporter = new VCardImporter({ filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "3vCardsInOne.vcf", vCardVersion: VCard.VERSIONS.THREE }),
			testPassed,
			statusCallbackFunction,
			vCardTestData = _.clone(vCardTests.CONTACTS_FROM_VCARDS.VCards3InOne);

		vCardTests.contactSaveCounter = 0;
		vCardTests.expectedContactCount = vCardTestData.length;
		vCardTests.stopProcessingAfterContact = -1;

		statusCallbackFunction = vCardTests.statusCallbackFunctionStopOnNthContact;

		vCardImporter.readVCard(statusCallbackFunction).then(this, function (future) {
			expect(vCardTests.contactSaveCounter === vCardTests.expectedContactCount).toBeTruthy();
			if (vCardTests.contactSaveCounter === vCardTests.expectedContactCount) {
				vCardTests.verifyCorrectVCardEntriesReturned(reportResults, future.result, vCardTestData, "testVCardStatusCallbackWorksMultipleContactsNotSavingToDB");
			} else {
				console.log("testVCardStatusCallbackWorksMultipleContactsNotSavingToDB ERROR: The number of status messages returned (" + vCardTests.contactSaveCounter + ") was not the expected amount(" + vCardTests.expectedContactCount + ")");
			}
		});
	});


	// This might look bad but it's not.
	// Only being used in this case like this
	// because I want to be able to reuse this function
	// and have jslint not freak out about undeclared vars
	vCardTests.contactSaveCounter = 0;
	vCardTests.expectedContactCount = 0;
	vCardTests.stopProcessingBeforeContact = -1;

	vCardTests.statusCallbackFunctionStopOnNthContact = function (contactSaveSuccessful) {
		if (contactSaveSuccessful) {
			vCardTests.contactSaveCounter += 1;
			console.log("Saved contact " + vCardTests.contactSaveCounter + " of " + vCardTests.expectedContactCount);
		} else {
			vCardTests.contactSaveCounter += 1;
			console.log("Failed to saved contact " + vCardTests.contactSaveCounter);
		}

		if (vCardTests.stopProcessingAfterContact === vCardTests.contactSaveCounter) {
			console.log("Cancelled processing vCard after the " + vCardTests.contactSaveCounter + "(th|rd|st|nd) contact");
			return false;
		} else {
			return true;
		}
	};

	vCardTests.verifyCorrectVCardEntriesReturned = function (reportResults, vCardContactsToTest, vCardContactsThatShouldExist, testName) {
		var i,
			j,
			contactToTest,
			contactToVerifyAgainst,
			foundMatch = false,
			vCardContactToTest;

		for (j = 0; j < vCardContactsToTest.length; j += 1) {
			vCardContactToTest = vCardContactsToTest[j];

			for (i = 0; i < vCardContactsThatShouldExist.length; i += 1) {
				contactToVerifyAgainst = vCardContactsThatShouldExist[i];
				if (vCardContactToTest.equals(contactToVerifyAgainst)) {
					vCardContactsThatShouldExist.splice(i, 1);
					foundMatch = true;
					break;
				}
			}

			if (!foundMatch) {
				console.log(testName + " ERROR: The following contact was not in the list of returned contacts - " + vCardContactToTest + "\n");
			}

			foundMatch = false;
		}



		expect(vCardContactsThatShouldExist.length).not.toBeGreaterThan(0);
		// console.log(testName + " ERROR: The number of contacts returned did not match the number of contacts in the vCard. There must have been an error reading a vCard or one of the contacts were not equal.");
	};

	vCardTests.verifyCorrectVCardEntriesSavedToDB = function (reportResults, vCardContactsToTest, testName) {
		var future = new Future(),
			testPassed = false;

		future.now(function () {
			future.nest(DB.find({
					from: Contact.kind
				}));

		});

		future.then(function () {
			var result = future.result,
				i,
				j,
				contactDoesntMatch = false,
				dbContact,
				vCardContactToTest,
				foundMatch = false;

			if (result && result.results && result.results.length === vCardContactsToTest.length) {
				for (i = 0; i < result.results.length; i += 1) {
					dbContact = new Contact(result.results[i]);
					for (j = 0; j < vCardContactsToTest.length; j += 1) {
						vCardContactToTest = vCardContactsToTest[j];
						if (vCardContactToTest.equals(dbContact)) {
							vCardContactsToTest.splice(j, 1);
							foundMatch = true;
							break;
						}
					}

					if (!foundMatch) {
						console.log(testName + " ERROR: The following contact was not in the list of returned contacts - " + dbContact + "\n");
					}

					foundMatch = false;
				}

				if (vCardContactsToTest.length > 0) {
					console.log(testName + " ERROR: The number of contacts in the db do not match the number of contacts in the vCard. There must have been an error reading a vCard or one of the contacts were not equal.");
					testPassed = false;
				} else {
					testPassed = true;
				}
			} else {
				if (!result) {
					console.log(testName + " ERROR: The result from getting the contacts in the db was fubar");
				} else if (result.results) {
					console.log(testName + " ERROR: The amount of contacts in the db - " + result.results.length + " did not match up with the expected # of contacts - " + vCardContactsToTest.length);
				} else {
					console.log(testName + " ERROR: result.results was wack");
				}
				testPassed = false;
			}

			future.nest(DB.del({
				from: Contact.kind
			}));
		});

		future.then(function () {
			expect(testPassed).toBeTruthy();
		});

		waitsForFuture(future);
	};

	/**
	 * Tests the vCardImporter extract labels from lines properly
	 *
	 * Passes - If all the correct labels are returned for each line in vCardTests.EXTRACTLABEL_LINES object
	 * Fails - If any of the lines do not return the correct label
	 *
	 */
	it("should test vCardImporterHandleLine", function (reportResults) {
		var vCardImporter = this.handle_line_vCard_test_importer;

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLE_LINE_LINES, "NAME", undefined, "SHOULD_RETURN", function (line, multiLineSingleObjectData) {       return vCardImporter._handleLine(line, multiLineSingleObjectData); }, Utils.curry(vCardTests.displayErrorForTest, "_handleLine"), "VALIDATE_FUNCTION", ["LINE", "MULTILINEOBJECTS"])
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter extract labels from lines properly
	 *
	 * Passes - If all the correct labels are returned for each line in vCardTests.EXTRACTLABEL_LINES object
	 * Fails - If any of the lines do not return the correct label
	 *
	 */
	/*xit("should test vCardImporterHandleLine", function (reportResults) {
		var vCardImporter = this.handle_line_vCard_test_importer;

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLE_LINE_LINES, "NAME", undefined, "SHOULD_RETURN", function (line, multiLineSingleObjectData) { return vCardImporter._handleLine(line, multiLineSingleObjectData) }, Utils.curry(vCardTests.displayErrorForTest, "_handleLine"), "VALIDATE_FUNCTION", ["LINE", "MULTILINEOBJECTS"])
		).toBeTruthy();
	};*/

	/**
	 * Tests the vCardImporter counts vCards properly
	 *
	 * Passes - If the amount of contacts in the vCard is correct
	 * Fails - When the amount of contacts is not correct or the file does not exist
	 *
	 */
	xit("should test vCardImporterCountContacts", function (reportResults) {
		var contactsCount = VCardImporter.countContacts(vCardTests.JSUNIT_VCARD_DATA_PATH + "vCard3-0.vcf"),
			passedTests = true,
			vCardImporterObject;

		if (contactsCount !== 1) {
			passedTests = false;
			console.log("Test with vCard of 1 contact failed to return correct count!");
		}

		contactsCount = VCardImporter.countContacts(vCardTests.JSUNIT_VCARD_DATA_PATH + "3vCardsInOne.vcf");

		if (contactsCount !== 3) {
			passedTests = false;
			console.log("Test with vCard of 3 contacts failed to return correct count!");
		}

		vCardImporterObject = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});
		contactsCount = vCardImporterObject.countContacts();

		if (contactsCount !== 0) {
			passedTests = false;
			console.log("Test with empty vCard failed to return correct count!");
		}

		expect(passedTests).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter extract labels from lines properly
	 *
	 * Passes - If all the correct labels are returned for each line in vCardTests.EXTRACTLABEL_LINES object
	 * Fails - If any of the lines do not return the correct label
	 *
	 */
	it("should test vCardImporterExtractLabel", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.EXTRACTLABEL_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._extractLabel(line); }, Utils.curry(vCardTests.displayErrorForTest, "_extractLabel"))
		).toBeTruthy();
	});


	/**
	 * Tests the vCardImporter extracts the value from lines properly
	 *
	 * Passes - If all the correct values are returned for each line in vCardTests.GETLINEVALUE_LINES object
	 * Fails - If any of the lines do not return the correct value
	 *
	 */
	it("should test vCardImporterGetLineValue", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.GETLINEVALUE_LINES, "NAME", "LINE", "SHOULD_RETURN", vCardImporter._getLineValue, Utils.curry(vCardTests.displayErrorForTest, "_getLineValue"))
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter extracts the contact point type from lines properly
	 *
	 * Passes - If all the correct values are returned for each line in vCardTests.CONTACT_POINT_TYPES_LINES object
	 * Fails - If any of the lines do not return the correct value
	 *
	 */
	it("should test vCardImporterGetLinePrefixType", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.CONTACT_POINT_TYPES_LINES, "NAME", "LINE", "SHOULD_RETURN", vCardImporter._getVCardLinePrefixType, Utils.curry(vCardTests.displayErrorForTest, "_getVCardLinePrefixType"))
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter creates a contact email object properly from a line
	 *
	 * Passes - If all the correct values are set in the email object returned from the handle email function
	 * Fails - If any of the values are incorrect
	 *
	 */
	it("should test vCardImporterHandleEmailLine", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLEEMAIL_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._handleEmail(line); }, Utils.curry(vCardTests.displayErrorForTest, "_handleEmail"), "VALIDATE_FUNCTION")
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter creates a contact PhoneNumber object properly from a line
	 *
	 * Passes - If all the correct values are set in the phonenumber object returned from the handle phonenumber function
	 * Fails - If any of the values are incorrect
	 *
	 */
	it("should test vCardImporterHandlePhoneLine", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLEPHONENUMBER_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._handlePhoneNumber(line); }, Utils.curry(vCardTests.displayErrorForTest, "_handlePhoneNumber"), "VALIDATE_FUNCTION")
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter returning the value to be set for a nickname
	 *
	 * Passes - If the correct string is returned
	 * Fails - If the incorrect string is returned
	 *
	 */
	xit("should test vCardImporterHandleNicknameLine", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLENICKNAME_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._handleNickname(line); }, Utils.curry(vCardTests.displayErrorForTest, "_handleNickname"), "VALIDATE_FUNCTION")
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the url object for a url line in a vcard
	 *
	 * Passes - If the correct url object is returned
	 * Fails - If the incorrect url object is returned
	 *
	 */
	it("should test vCardImporterHandleUrl", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLEURL_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._handleUrl(line); }, Utils.curry(vCardTests.displayErrorForTest, "_handleUrl"), "VALIDATE_FUNCTION")
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the Birthday object for a birthday line in a vcard
	 *
	 * Passes - If the correct birthday object is returned
	 * Fails - If the incorrect birthday object is returned
	 *
	 */
	xit("should test vCardImporterHandleBirthday", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLEBIRTHDAY_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._handleBirthday(line); }, Utils.curry(vCardTests.displayErrorForTest, "_handleBirthday"), "VALIDATE_FUNCTION")
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the Name object for a name line in a vcard
	 *
	 * Passes - If the correct name object is returned
	 * Fails - If the incorrect name object is returned
	 *
	 */
	it("should test vCardImporterHandleName", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLENAME_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._handleName(line); }, Utils.curry(vCardTests.displayErrorForTest, "_handleName"), "VALIDATE_FUNCTION")
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the IMAddress object for a im line in a vcard
	 *
	 * Passes - If the correct imaddress object is returned
	 * Fails - If the incorrect imaddress object is returned
	 *
	 */
	it("should test vCardImporterHandleIMAddress", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLEIM_LINES, "NAME", undefined, "SHOULD_RETURN", function (type, line) { return vCardImporter._handleIM(type, line); }, Utils.curry(vCardTests.displayErrorForTest, "_handleIM"), "VALIDATE_FUNCTION", ["TYPE", "LINE"])
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the Organization object for a company name line in a vcard
	 *
	 * Passes - If the correct organization object is returned
	 * Fails - If the incorrect organization object is returned
	 *
	 */
	it("should test vCardImporterHandleCompanyName", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLE_COMPANY_NAME_LINES, "NAME", undefined, "SHOULD_RETURN", function (line, organization) { return vCardImporter._handleCompanyName(line, organization); }, Utils.curry(vCardTests.displayErrorForTest, "_handleCompanyName"), "VALIDATE_FUNCTION", ["LINE", "ORGANIZATION"])
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the Organization object for a job title line in a vcard
	 *
	 * Passes - If the correct organization object is returned
	 * Fails - If the incorrect organization object is returned
	 *
	 */
	it("should test vCardImporterHandleJobTitle", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLE_JOB_TITLE_LINES, "NAME", undefined, "SHOULD_RETURN", function (line, organization) { return vCardImporter._handleJobTitle(line, organization); }, Utils.curry(vCardTests.displayErrorForTest, "_handleJobTitle"), "VALIDATE_FUNCTION", ["LINE", "ORGANIZATION"])
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the Address object for an address line in a vcard
	 *
	 * Passes - If the correct address object is returned
	 * Fails - If the incorrect address object is returned
	 *
	 */
	xit("should test vCardImporterHandleAddress", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLE_ADDRESS_LINES, "NAME", "LINE", "SHOULD_RETURN", function (line) { return vCardImporter._handleAddress(line); }, Utils.curry(vCardTests.displayErrorForTest, "_handleAddress"), "VALIDATE_FUNCTION")
		).toBeTruthy();
	});

	/**
	 * Tests the vCardImporter to return the Relation object for two relation lines in a vcard
	 *
	 * Passes - If the correct relation object is returned
	 * Fails - If the incorrect relation object is returned
	 *
	 */
	it("should test vCardImporterHandleRelation", function (reportResults) {
		var vCardImporter = new VCardImporter({filePath: vCardTests.JSUNIT_VCARD_DATA_PATH + "emptyvCard.vcf", vCardVersion: VCard.VERSIONS.THREE});

		expect(
			vCardTests.runThisFunctionOnThisObject(vCardTests.HANDLE_RELATION_LINES, "NAME", undefined, "SHOULD_RETURN", function (relationName, relationType) { return vCardImporter._handleRelation(relationName, relationType); }, Utils.curry(vCardTests.displayErrorForTest, "_handleRelation"), "VALIDATE_FUNCTION", ["RELATION_NAME", "RELATION_TYPE"])
		).toBeTruthy();
	});

	//////////////////////////Helper methods

	// Helper method to loop through an object an run a function on each of these objects.
	// Also call an error function when a test fails
	vCardTests.runThisFunctionOnThisObject = function (object, testCaseLabelInObject, valueInObjectToTest, valueToVerifyInObjectToTest, functionToTest, errorFunction, validateFunction, parameterNames) {
		var success = true,
			extractTestObject,
			returnValue,
			parameterObjects,
			i,
			parameterName;

		for (extractTestObject in object) {
			if (object.hasOwnProperty(extractTestObject)) {
				extractTestObject = object[extractTestObject];

				if (parameterNames && _.isArray(parameterNames)) {
					parameterObjects = [];
					for (i = 0; i < parameterNames.length; i += 1) {
						parameterName = parameterNames[i];
						parameterObjects.push(extractTestObject[parameterName]);
					}
					//console.log(JSON.stringify(parameterObjects));

					returnValue = functionToTest.apply(this, parameterObjects);
				} else {
					returnValue = functionToTest(extractTestObject[valueInObjectToTest]);
				}

				if (extractTestObject[validateFunction]) {

					if (!extractTestObject[validateFunction](returnValue)) {
						errorFunction(extractTestObject[testCaseLabelInObject], returnValue, extractTestObject[valueToVerifyInObjectToTest]);
						success = false;
					}
				} else {
					if (returnValue !== extractTestObject[valueToVerifyInObjectToTest]) {
						errorFunction(extractTestObject[testCaseLabelInObject], returnValue, extractTestObject[valueToVerifyInObjectToTest]);
						success = false;
					}
				}
			}
		}

		return success;
	};

	///////////////////////Test Data

	// vCardTests.HANDLE_LINE_LINES = {
	// // Has extra data for testing the multi line stuff in
	// // this.handle_line_vCard_test_importer
	//
	// // Funky bad/weird inputs
	// BLANK: { NAME: "BLANK", LINE: "", MULTILINEOBJECTS: "", SHOULD_RETURN: new NULLOBJECT() },
	//
	// BADLINE_NO_NAME: { NAME: "BADLINE_NO_NAME", LINE: "", MULTILINEOBJECTS: "qwefweff3223f", SHOULD_RETURN: new NULLOBJECT() },
	// BADLINE_NO_TYPE: { NAME: "BADLINE_NO_TYPE", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", MULTILINEOBJECTS: "", SHOULD_RETURN: new NULLOBJECT() },
	// BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", MULTILINEOBJECTS: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new NULLOBJECT() },
	//
	// BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", MULTILINEOBJECTS: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Relation({ value: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", type: Relation.TYPE.OTHER, primary:false  }) },
	//
	// // Valid inputs/Usual values
	// };

	vCardTests.HANDLEPHONENUMBER_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new PhoneNumber({ value: "", primary: false, type: PhoneNumber.TYPE.OTHER }) },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new PhoneNumber({ value: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj",  type: PhoneNumber.TYPE.OTHER, primary:false }) },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new PhoneNumber({ value: "", type: PhoneNumber.TYPE.OTHER, primary:false  }) },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new PhoneNumber({ value: "Imwaefinfwa:woeiafjawf:", type: PhoneNumber.TYPE.OTHER, primary:false  }) },

		// Valid inputs/Usual values
		PHONENUMBER_BAD_PEOPLES_VERSION_H_FAX: { NAME: "PHONENUMBER_BAD_PEOPLES_VERSION_H_FAX", LINE: "tel;type=home;type=fax:408-353-5555", SHOULD_RETURN: new PhoneNumber({ value: "408-353-5555", type: PhoneNumber.TYPE.PERSONAL_FAX, primary:false  }) },
		PHONENUMBER_W_FAX: { NAME: "PHONENUMBER_W_FAX", LINE: "TEL;TYPE=WORK;TYPE=FAX:6666666666", SHOULD_RETURN: new PhoneNumber({ value: "6666666666", type: PhoneNumber.TYPE.WORK_FAX, primary:false }) },

		PHONENUMBER_BAD_PEOPLES_VERSION_CELL: { NAME: "PHONENUMBER_BAD_PEOPLES_VERSION_CELL", LINE: "tel;type=cell:111-555-5555", SHOULD_RETURN: new PhoneNumber({ value: "111-555-5555", type: PhoneNumber.TYPE.MOBILE, primary:false  }) },
		PHONENUMBER_PAGER: { NAME: "PHONENUMBER_PAGER", LINE: "TEL;TYPE=PAGER:7777777777", SHOULD_RETURN: new PhoneNumber({ value: "7777777777", type: PhoneNumber.TYPE.PAGER, primary:false }) },

		PHONENUMBER_BAD_CUSTOM: { NAME: "PHONENUMBER_BAD_CUSTOM", LINE: "tel;type=custom:333-555-5555", SHOULD_RETURN: new PhoneNumber({ value: "333-555-5555", type: PhoneNumber.TYPE.OTHER, primary:false }) },
		PHONENUMBER_NOTYPE: { NAME: "PHONENUMBER_NOTYPE", LINE: "TEL:8888888888", SHOULD_RETURN: new PhoneNumber({ value: "8888888888", type: PhoneNumber.TYPE.OTHER, primary:false }) }
	};

	vCardTests.HANDLEEMAIL_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new EmailAddress({ value: "", primary: false, type: EmailAddress.TYPE.OTHER }) },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new EmailAddress({ value: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj",  type: EmailAddress.TYPE.OTHER, primary:false }) },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new EmailAddress({ value: "", type: EmailAddress.TYPE.OTHER, primary:false  }) },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new EmailAddress({ value: "Imwaefinfwa:woeiafjawf:", type: EmailAddress.TYPE.OTHER, primary:false  }) },

		// Valid inputs/Usual values
		EMAIL_BAD_PEOPLES_VERSION_W: { NAME: "EMAIL_BAD_PEOPLES_VERSION_W", LINE: "email;type=internet;type=pref;type=work:testEmailW@email.com", SHOULD_RETURN: new EmailAddress({ value: "testEmailW@email.com", type: EmailAddress.TYPE.WORK, primary:false  }) },
		EMAIL_W: { NAME: "EMAIL_W", LINE: "EMAIL;TYPE=INTERNET;TYPE=WORK:testEmailW@email.com", SHOULD_RETURN: new EmailAddress({ value: "testEmailW@email.com", type: EmailAddress.TYPE.WORK, primary:false }) },

		EMAIL_BAD_PEOPLES_VERSION_H: { NAME: "EMAIL_BAD_PEOPLES_VERSION_H", LINE: "email;type=internet;type=home:testEmailH@email.com", SHOULD_RETURN: new EmailAddress({ value: "testEmailH@email.com", type: EmailAddress.TYPE.HOME, primary:false  }) },
		EMAIL_H: { NAME: "EMAIL_H", LINE: "EMAIL;TYPE=INTERNET;TYPE=HOME:testEmailH@email.com", SHOULD_RETURN: new EmailAddress({ value: "testEmailH@email.com", type: EmailAddress.TYPE.HOME, primary:false }) }
	};

	vCardTests.HANDLENICKNAME_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new Nickname( { value: "" } ) },

		// Valid inputs/Usual values
		NICKNAME: { NAME: "NICKNAME", LINE: "NICKNAME:Testy McVCard", SHOULD_RETURN: new Nickname( { value: "Testy McVCard" }) },
		NICKNAME_BAD: { NAME: "NICKNAME_BAD", LINE: "nickname:The nicker", SHOULD_RETURN: new Nickname( { value: "The nicker" }) }
	};

	vCardTests.HANDLEURL_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new Url({ value: "", primary: false, type: Url.TYPE.OTHER }) },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Url({ value: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj",  type: Url.TYPE.OTHER, primary:false }) },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new Url({ value: "", type: Url.TYPE.OTHER, primary:false  }) },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Url({ value: "Imwaefinfwa:woeiafjawf:", type: Url.TYPE.OTHER, primary:false  }) },

		// Valid inputs/Usual values

		URL_BAD_PEOPLES_VERSION_W: { NAME: "URL_BAD_PEOPLES_VERSION_W", LINE: "url;type=work:www.mycompany.com", SHOULD_RETURN: new Url({ value: "www.mycompany.com", type: Url.TYPE.WORK, primary:false  }) },
		URL_W: { NAME: "URL_W", LINE: "URL;TYPE=WORK:www.mywork.com", SHOULD_RETURN: new Url({ value: "www.mywork.com", type: Url.TYPE.WORK, primary:false }) },

		URL_BAD_PEOPLES_VERSION_H: { NAME: "URL_BAD_PEOPLES_VERSION_H", LINE: "url;type=home:www.awesome.com", SHOULD_RETURN: new Url({ value: "www.awesome.com", type: Url.TYPE.HOME, primary:false  }) },
		URL_H: { NAME: "URL_H", LINE: "URL;TYPE=HOME:www.myhouse.com", SHOULD_RETURN: new Url({ value: "www.myhouse.com", type: Url.TYPE.HOME, primary:false }) },

		URL_REALLY_FUNKY: { NAME: "URL_REALLY_FUNKY", LINE: "URL;TYPE=HOME:\\\\www.myhouse.com", SHOULD_RETURN: new Url({ value: "\\\\www.myhouse.com", type: Url.TYPE.HOME, primary:false }) }
	};

	vCardTests.HANDLEBIRTHDAY_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new NULLOBJECT() },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new NULLOBJECT() },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new NULLOBJECT() },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new NULLOBJECT() },

		// Valid inputs/Usual values

		BIRTHDAY_BAD_PEOPLES_VERSION: { NAME: "BIRTHDAY_BAD_PEOPLES_VERSION", LINE: "bday:2009-03-29", SHOULD_RETURN: new Birthday("2009-03-29") },
		BIRTHDAY: { NAME: "BIRTHDAY", LINE: "BDAY:1987-06-10", SHOULD_RETURN: new Birthday("1987-06-10") },

		BIRTHDAY_NO_SEPERATORS: { NAME: "BIRTHDAY", LINE: "BDAY:20100414", SHOULD_RETURN: new Birthday("2010-04-14") },
		BIRTHDAY_GOOGLE_NO_YEAR: { NAME: "BIRTHDAY_GOOGLE_NO_YEAR", LINE: "BDAY:1970-06-10", SHOULD_RETURN: new Birthday("1970-06-10") }
	};

	vCardTests.HANDLENAME_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new Name({ givenName: "", middleName: "", familyName: "", honorificPrefix: "", honorificSuffix: "" }) },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Name({ givenName: "", middleName: "", familyName: "", honorificPrefix: "", honorificSuffix: "" }) },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new Name({ givenName: "", middleName: "", familyName: "", honorificPrefix: "", honorificSuffix: "" }) },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Name({ givenName: "", middleName: "", familyName: "", honorificPrefix: "", honorificSuffix: "" }) },

		// Valid inputs/Usual values

		NAME_BAD_PEOPLES_VERSION: { NAME: "NAME_BAD_PEOPLES_VERSION", LINE: "n:Fax;Test;;Mr.;Jr.", SHOULD_RETURN: new Name({ givenName: "Test", middleName: "", familyName: "Fax", honorificPrefix: "Mr.", honorificSuffix: "Jr." }) },
		NAME: { NAME: "NAME", LINE: "N:vCard;Test;;;", SHOULD_RETURN: new Name({ givenName: "Test", middleName: "", familyName: "vCard", honorificPrefix: "", honorificSuffix: "" }) },

		NAME_FULL: { NAME: "NAME_FULL", LINE: "N:Powers;Austin;Danger;Dr.;Jr.", SHOULD_RETURN: new Name({ givenName: "Austin", middleName: "Danger", familyName: "Powers", honorificPrefix: "Dr.", honorificSuffix: "Jr." }) },

		NAME_LAST: { NAME: "NAME_LAST", LINE: "N:vCard;;;;", SHOULD_RETURN: new Name({ givenName: "", middleName: "", familyName: "vCard", honorificPrefix: "", honorificSuffix: "" }) },
		NAME_MIDDLE: { NAME: "NAME_MIDDLE", LINE: "N:;;Middle Name;;", SHOULD_RETURN: new Name({ givenName: "", middleName: "Middle Name", familyName: "", honorificPrefix: "", honorificSuffix: "" }) },
		NAME_FIRST: { NAME: "NAME_FIRST", LINE: "N:;First Name;;;", SHOULD_RETURN: new Name({ givenName: "First Name", middleName: "", familyName: "", honorificPrefix: "", honorificSuffix: "" }) },
		NAME_PREFIX: { NAME: "NAME_PREFIX", LINE: "N:;;;Mr.;", SHOULD_RETURN: new Name({ givenName: "", middleName: "", familyName: "", honorificPrefix: "Mr.", honorificSuffix: "" }) },
		NAME_SUFFIX: { NAME: "NAME_SUFFIX", LINE: "N:;;;;Sr.", SHOULD_RETURN: new Name({ givenName: "", middleName: "", familyName: "", honorificPrefix: "", honorificSuffix: "Sr." }) }
	};

	vCardTests.HANDLEIM_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new NULLOBJECT(), TYPE: null },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new NULLOBJECT(), TYPE: null },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new NULLOBJECT(), TYPE: null },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new NULLOBJECT(), TYPE: null },

		// Valid inputs/Usual values
		IM_MSN_BAD: { NAME: "IM_MSN_BAD", LINE: "X-MSN;type=home;type=pref:myIM", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:VCard.IM_SERVICES.MSN.SERVICE_NAME, primary:false, value:"myIM" }), TYPE: VCard.IM_SERVICES.MSN.VCARD_VALUE },

		IM_GTALK: { NAME: "IM_GTALK", LINE: "X-GTALK:gIM@gtak.com", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.GTALK, primary:false, value:"gIM@gtak.com" }), TYPE: VCard.IM_SERVICES.GTALK.VCARD_VALUE },
		IM_YAHOO: { NAME: "IM_YAHOO", LINE: "X-YAHOO:someyah", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.YAHOO, primary:false, value:"someyah" }), TYPE: VCard.IM_SERVICES.YAHOO.VCARD_VALUE },
		IM_ICQ: { NAME: "IM_ICQ", LINE: "X-ICQ:whoUsesISeeQ", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.ICQ, primary:false, value:"whoUsesISeeQ" }), TYPE: VCard.IM_SERVICES.ICQ.VCARD_VALUE },
		IM_SKYPE: { NAME: "IM_SKYPE", LINE: "X-SKYPE:weeSkyweePe", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.SKYPE, primary:false, value:"weeSkyweePe" }), TYPE: VCard.IM_SERVICES.SKYPE.VCARD_VALUE },
		IM_QQ: { NAME: "IM_QQ", LINE: "X-QQ:idontknowthisonequeque", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.QQ, primary:false, value:"idontknowthisonequeque" }), TYPE: VCard.IM_SERVICES.QQ.VCARD_VALUE },
		IM_MSN: { NAME: "IM_MSN", LINE: "X-MSN:ahhmgoodoldsn", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.MSN, primary:false, value:"ahhmgoodoldsn" }), TYPE: VCard.IM_SERVICES.MSN.VCARD_VALUE },
		IM_JABBER: { NAME: "IM_JABBER", LINE: "X-JABBER:jibberajabbar", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.JABBER, primary:false, value:"jibberajabbar" }), TYPE: VCard.IM_SERVICES.JABBER.VCARD_VALUE },
		IM_AOL: { NAME: "IM_AOL", LINE: "X-AIM:aol", SHOULD_RETURN: new IMAddress({ type: IMAddress.TYPE.OTHER, serviceName:IMAddress.TYPE.AIM, primary:false, value:"aol" }), TYPE: VCard.IM_SERVICES.AIM.VCARD_VALUE }
	};

	vCardTests.HANDLE_COMPANY_NAME_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new Organization({ name: "", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		BLANK_PASSED_ORGANIZATION: { NAME: "BLANK_PASSED_ORGANIZATION", LINE: "", SHOULD_RETURN: new Organization({ name: "", department: "", title: "TADA", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "", title: "TADA", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Organization({ name: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		BADLINE_NO_SEPERATOR_PASSED_ORGANIZATION: { NAME: "BADLINE_NO_SEPERATOR_PASSED_ORGANIZATION", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Organization({ name: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", department: "", title: "TADA", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "", title: "TADA", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new Organization({ name: "", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR_PASSED_ORGANIZATION: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR_PASSED_ORGANIZATION", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new Organization({ name: "", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Organization({ name: "Imwaefinfwa:woeiafjawf:", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		HAS_COLON_AFTER_SEPERATOR_PASSED_ORGANIZATION: { NAME: "HAS_COLON_AFTER_SEPERATOR_PASSED_ORGANIZATION", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Organization({ name: "Imwaefinfwa:woeiafjawf:", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		// Valid inputs/Usual values

		GOOGLE: { NAME: "GOOGLE", LINE: "ORG:His Company", SHOULD_RETURN: new Organization({ name: "His Company", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		GOOGLE_PASSED_ORGANIZATION: { NAME: "GOOGLE_PASSED_ORGANIZATION", LINE: "ORG:His Company", SHOULD_RETURN: new Organization({ name: "His Company", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		OUTLOOK: { NAME: "OUTLOOK", LINE: "org:My comp rocks;furry", SHOULD_RETURN: new Organization({ name: "My comp rocks", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		OUTLOOK_PASSED_ORGANIZATION: { NAME: "OUTLOOK_PASSED_ORGANIZATION", LINE: "org:My comp rocks;furry", SHOULD_RETURN: new Organization({ name: "My comp rocks", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) }
	};

	vCardTests.HANDLE_JOB_TITLE_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new Organization({ name: "", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		BLANK_PASSED_ORGANIZATION: { NAME: "BLANK_PASSED_ORGANIZATION", LINE: "", SHOULD_RETURN: new Organization({ name: "", department: "TADA", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "TADA", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Organization({ name: "", department: "", title: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		BADLINE_NO_SEPERATOR_PASSED_ORGANIZATION: { NAME: "BADLINE_NO_SEPERATOR_PASSED_ORGANIZATION", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Organization({ name: "Sweetness", department: "", title: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "Sweetness", department: "", title: "TADA", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new Organization({ name: "", department: "", title: "", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR_PASSED_ORGANIZATION: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR_PASSED_ORGANIZATION", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new Organization({ name: "Chicken Shack", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "Chicken Shack", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Organization({ name: "", department: "", title: "Imwaefinfwa:woeiafjawf:", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		HAS_COLON_AFTER_SEPERATOR_PASSED_ORGANIZATION: { NAME: "HAS_COLON_AFTER_SEPERATOR_PASSED_ORGANIZATION", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Organization({ name: "", department: "", title: "Imwaefinfwa:woeiafjawf:", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		// Valid inputs/Usual values
		GOOGLE: { NAME: "GOOGLE", LINE: "TITLE:His title", SHOULD_RETURN: new Organization({ name: "", department: "", title: "His title", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		GOOGLE_PASSED_ORGANIZATION: { NAME: "GOOGLE_PASSED_ORGANIZATION", LINE: "TITLE:His title", SHOULD_RETURN: new Organization({ name: "His Company", department: "", title: "His title", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "His Company", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) },

		OUTLOOK: { NAME: "OUTLOOK", LINE: "title:sweet position", SHOULD_RETURN: new Organization({ name: "", department: "", title: "sweet position", type: "", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: null },
		OUTLOOK_PASSED_ORGANIZATION: { NAME: "OUTLOOK_PASSED_ORGANIZATION", LINE: "title:sweet position", SHOULD_RETURN: new Organization({ name: "My comp rocks", department: "", title: "sweet position", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}), ORGANIZATION: new Organization({ name: "My comp rocks", department: "", title: "", type: "BLALA", startDate: "", endDate: "", location: new Address({ streetAddress: "", locality: "", region: "", postalCode: "", country: "" }), description: ""}) }
	};

	vCardTests.HANDLE_ADDRESS_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: new Address({ streetAddress: "", locality: "", postalCode: "", region: "", country: "", value: "", type: Address.TYPE.OTHER, primary: false}) },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Address({ streetAddress: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", locality: "", postalCode: "", region: "", country: "", value: "", type: Address.TYPE.OTHER, primary: false}) },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new Address({ streetAddress: "", locality: "", postalCode: "", region: "", country: "", value: "", type: Address.TYPE.OTHER, primary: false}) },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Address({ streetAddress: "Imwaefinfwa:woeiafjawf:", locality: "", postalCode: "", region: "", country: "", value: "", type: Address.TYPE.OTHER, primary: false}) },

		// Valid inputs/Usual values
		ADDRESS_HOME_FULL: { NAME: "ADDRESS_HOME_FULL", LINE: "ADR;DOM;HOME:P.O. Box 101;Suite 101;123 Main Street;Any Town;CA;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "P.O. Box 101, 123 Main Street, Suite 101", locality: "Any Town", postalCode: "91921-1234", region: "CA", country: "USA", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_WORK_FULL: { NAME: "ADDRESS_HOME_FULL", LINE: "ADR;DOM;WORK:P.O. Box 101;Suite 101;123 Main Street;Any Town;CA;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "P.O. Box 101, 123 Main Street, Suite 101", locality: "Any Town", postalCode: "91921-1234", region: "CA", country: "USA", value: "", type: Address.TYPE.WORK, primary: false}) },
		ADDRESS_OTHER_FULL: { NAME: "ADDRESS_OTHER_FULL", LINE: "ADR:P.O. Box 101;Suite 101;123 Main Street;Any Town;CA;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "P.O. Box 101, 123 Main Street, Suite 101", locality: "Any Town", postalCode: "91921-1234", region: "CA", country: "USA", value: "", type: Address.TYPE.OTHER, primary: false}) },
		ADDRESS_NO_POBOX: { NAME: "ADDRESS_NO_POBOX", LINE: "ADR;DOM;HOME:;Suite 101;123 Main Street;Any Town;CA;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "123 Main Street, Suite 101", locality: "Any Town", postalCode: "91921-1234", region: "CA", country: "USA", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_NO_STREET_POBOX: { NAME: "ADDRESS_NO_STREET_POBOX", LINE: "ADR;DOM;HOME:;Suite 101;;Any Town;CA;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "Suite 101", locality: "Any Town", postalCode: "91921-1234", region: "CA", country: "USA", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_NO_STREET_POBOX_EXTENDED: { NAME: "ADDRESS_NO_STREET_POBOX_EXTENDED", LINE: "ADR;DOM;HOME:;;;Any Town;CA;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "", locality: "Any Town", postalCode: "91921-1234", region: "CA", country: "USA", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_TYPICAL_GOOGLE: { NAME: "ADDRESS_TYPICAL_GOOGLE", LINE: "ADR;TYPE=HOME:;This is my house address;;;;;", SHOULD_RETURN: new Address({ streetAddress: "This is my house address", locality: "", postalCode: "", region: "", country: "", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_TYPICAL_ESCAPED_NEWLINE_COMMA_GOOGLE: { NAME: "ADDRESS_TYPICAL_ESCAPED_NEWLINE_COMMA_GOOGLE", LINE: "ADR;TYPE=HOME:;This is my\\nhouse address\\,blaaa street\\, CA\\n95128;;;;;", SHOULD_RETURN: new Address({ streetAddress: "This is my\nhouse address,blaaa street, CA\n95128", locality: "", postalCode: "", region: "", country: "", value: "", type: Address.TYPE.HOME, primary: false}) },

		ADDRESS_NO_CITY: { NAME: "ADDRESS_NO_CITY", LINE: "ADR;DOM;HOME:P.O. Box 101;Suite 101;123 Main Street;;CA;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "P.O. Box 101, 123 Main Street, Suite 101", locality: "", postalCode: "91921-1234", region: "CA", country: "USA", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_NO_STATE: { NAME: "ADDRESS_NO_STATE", LINE: "ADR;DOM;HOME:P.O. Box 101;Suite 101;123 Main Street;Any Town;;91921-1234;USA", SHOULD_RETURN: new Address({ streetAddress: "P.O. Box 101, 123 Main Street, Suite 101", locality: "Any Town", postalCode: "91921-1234", region: "", country: "USA", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_NO_ZIP: { NAME: "ADDRESS_NO_ZIP", LINE: "ADR;DOM;HOME:P.O. Box 101;Suite 101;123 Main Street;Any Town;CA;;USA", SHOULD_RETURN: new Address({ streetAddress: "P.O. Box 101, 123 Main Street, Suite 101", locality: "Any Town", postalCode: "", region: "CA", country: "USA", value: "", type: Address.TYPE.HOME, primary: false}) },
		ADDRESS_NO_COUNTRY: { NAME: "ADDRESS_NO_COUNTRY", LINE: "ADR;DOM;HOME:P.O. Box 101;Suite 101;123 Main Street;Any Town;CA;91921-1234;", SHOULD_RETURN: new Address({ streetAddress: "P.O. Box 101, 123 Main Street, Suite 101", locality: "Any Town", postalCode: "91921-1234", region: "CA", country: "", value: "", type: Address.TYPE.HOME, primary: false}) }
	};

	vCardTests.HANDLE_RELATION_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", RELATION_NAME: "", RELATION_TYPE: "", SHOULD_RETURN: new NULLOBJECT() },

		BADLINE_NO_NAME: { NAME: "BADLINE_NO_NAME", RELATION_NAME: "", RELATION_TYPE: "qwefweff3223f", SHOULD_RETURN: new NULLOBJECT() },
		BADLINE_NO_TYPE: { NAME: "BADLINE_NO_TYPE", RELATION_NAME: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", RELATION_TYPE: "", SHOULD_RETURN: new NULLOBJECT() },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", RELATION_NAME: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", RELATION_TYPE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: new NULLOBJECT() },

		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", RELATION_NAME: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", RELATION_TYPE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: new Relation({ value: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", type: Relation.TYPE.OTHER, primary:false  }) },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", RELATION_NAME: "asfaewli:Imwaefinfwa:woeiafjawf:", RELATION_TYPE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: new Relation({ value: "Imwaefinfwa:woeiafjawf:", type: Relation.TYPE.OTHER, primary:false  }) },

		// Valid inputs/Usual values
		RELATION_FRIEND: { NAME: "RELATION_FRIEND", RELATION_NAME: "item23.X-ABRELATEDNAMES;type=pref:my freind", RELATION_TYPE: "item23.X-ABLabel:_$!<Friend>!$_", SHOULD_RETURN: new Relation({ value: "my freind", type: Relation.TYPE.FRIEND, primary:false }) },
		RELATION_ASSISTANT: { NAME: "RELATION_ASSISTANT", RELATION_NAME: "item24.X-ABRELATEDNAMES:my asssistant", RELATION_TYPE: "item24.X-ABLabel:_$!<Assistant>!$_", SHOULD_RETURN: new Relation({ value: "my asssistant", type: Relation.TYPE.ASSISTANT, primary:false }) },
		RELATION_FATHER: { NAME: "RELATION_FATHER", RELATION_NAME: "item25.X-ABRELATEDNAMES:my daddy", RELATION_TYPE: "item25.X-ABLabel:_$!<Father>!$_", SHOULD_RETURN: new Relation({ value: "my daddy", type: Relation.TYPE.FATHER, primary:false }) },
		RELATION_MOTHER: { NAME: "RELATION_MOTHER", RELATION_NAME: "item26.X-ABRELATEDNAMES:my mommy", RELATION_TYPE: "item26.X-ABLabel:_$!<Mother>!$_", SHOULD_RETURN: new Relation({ value: "my mommy", type: Relation.TYPE.MOTHER, primary:false }) },
		RELATION_PARENT: { NAME: "RELATION_PARENT", RELATION_NAME: "item27.X-ABRELATEDNAMES:my puurental unit", RELATION_TYPE: "item27.X-ABLabel:_$!<Parent>!$_", SHOULD_RETURN: new Relation({ value: "my puurental unit", type: Relation.TYPE.PARENT, primary:false }) },
		RELATION_BROTHER: { NAME: "RELATION_BROTHER", RELATION_NAME: "item28.X-ABRELATEDNAMES:my bro", RELATION_TYPE: "item28.X-ABLabel:_$!<Brother>!$_", SHOULD_RETURN: new Relation({ value: "my bro", type: Relation.TYPE.BROTHER, primary:false }) },
		RELATION_SISTER: { NAME: "RELATION_SISTER", RELATION_NAME: "item29.X-ABRELATEDNAMES:mis sis", RELATION_TYPE: "item29.X-ABLabel:_$!<Sister>!$_", SHOULD_RETURN: new Relation({ value: "mis sis", type: Relation.TYPE.SISTER, primary:false }) },
		RELATION_CHILD: { NAME: "RELATION_CHILD", RELATION_NAME: "item30.X-ABRELATEDNAMES:I have a kid?", RELATION_TYPE: "item30.X-ABLabel:_$!<Child>!$_", SHOULD_RETURN: new Relation({ value: "I have a kid?", type: Relation.TYPE.CHILD, primary:false }) },
		RELATION_SPOUSE: { NAME: "RELATION_SPOUSE", RELATION_NAME: "item31.X-ABRELATEDNAMES:I like her", RELATION_TYPE: "item31.X-ABLabel:_$!<Spouse>!$_", SHOULD_RETURN: new Relation({ value: "I like her", type: Relation.TYPE.SPOUSE, primary:false }) },
		RELATION_PARTNER: { NAME: "RELATION_PARTNER", RELATION_NAME: "item32.X-ABRELATEDNAMES:I like them", RELATION_TYPE: "item32.X-ABLabel:_$!<Partner>!$_", SHOULD_RETURN: new Relation({ value: "I like them", type: Relation.TYPE.PARTNER, primary:false }) },
		RELATION_MANAGER: { NAME: "RELATION_MANAGER", RELATION_NAME: "item33.X-ABRELATEDNAMES:my boss?", RELATION_TYPE: "item33.X-ABLabel:_$!<Manager>!$_", SHOULD_RETURN: new Relation({ value: "my boss?", type: Relation.TYPE.MANAGER, primary:false }) },
		RELATION_OTHER: { NAME: "RELATION_OTHER", RELATION_NAME: "item34.X-ABRELATEDNAMES:who is this", RELATION_TYPE: "item34.X-ABLabel:_$!<Other>!$_", SHOULD_RETURN: new Relation({ value: "who is this", type: Relation.TYPE.OTHER, primary:false }) },
		RELATION_CUSTOM: { NAME: "RELATION_CUSTOM", RELATION_NAME: "item35.X-ABRELATEDNAMES:a special person", RELATION_TYPE: "item35.X-ABLabel:costum", SHOULD_RETURN: new Relation({ value: "a special person", type: Relation.TYPE.OTHER, primary:false }) }
	};

	(function () {var testCaseObject,
			handleLineTypeTests = [vCardTests.HANDLEEMAIL_LINES, vCardTests.HANDLEPHONENUMBER_LINES, vCardTests.HANDLENICKNAME_LINES, vCardTests.HANDLEURL_LINES, vCardTests.HANDLEBIRTHDAY_LINES, vCardTests.HANDLENAME_LINES,
									vCardTests.HANDLEIM_LINES, vCardTests.HANDLE_COMPANY_NAME_LINES, vCardTests.HANDLE_JOB_TITLE_LINES, vCardTests.HANDLE_ADDRESS_LINES, vCardTests.HANDLE_RELATION_LINES],
			testSuiteObject,
			testSuiteObjectShortened,
			setupCounter = 0;

			function shouldReturnEquals(otherObject) {
				return this.SHOULD_RETURN.equals(otherObject);
			}

		for (setupCounter = 0; setupCounter < handleLineTypeTests.length; setupCounter += 1) {
			testSuiteObject = handleLineTypeTests[setupCounter];
			for (testCaseObject in testSuiteObject) {
				if (testSuiteObject.hasOwnProperty(testCaseObject)) {
					testSuiteObjectShortened = testSuiteObject[testCaseObject];
					testSuiteObjectShortened.VALIDATE_FUNCTION = shouldReturnEquals;
				}
			}
		}
	}());

	vCardTests.CONTACT_POINT_TYPES_LINES = {
		// Funky bad/weird inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: undefined },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: undefined },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: undefined },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: "asfaewli".toUpperCase() },

		// Valid inputs/Usual values
		NICKNAME_TYPE: { NAME: "NICKNAME_TYPE", LINE: "NICKNAME:Testy McVCard", SHOULD_RETURN: VCard.MARKERS.NICKNAME },
		NICKNAME_TYPE_EXCHANGE: { NAME: "NICKNAME_TYPE_EXCHANGE", LINE: "nickname:The nicker", SHOULD_RETURN: VCard.MARKERS.NICKNAME },

		NAME_TYPE: { NAME: "NAME_TYPE", LINE: "N:vCard;AddressBook;;;", SHOULD_RETURN: VCard.MARKERS.NAME },
		NAME_TYPE_EXCHANGE: { NAME: "NAME_TYPE_EXCHANGE", LINE: "n:Fax;Test;;Mr.;Jr.", SHOULD_RETURN: VCard.MARKERS.NAME },

		COMPANY_TYPE: { NAME: "COMPANY_TYPE", LINE: "ORG:My Company Rocks!!!;", SHOULD_RETURN: VCard.MARKERS.COMPANY },
		COMPANY_TYPE_EXCHANGE: { NAME: "COMPANY_TYPE_EXCHANGE", LINE: "org:My comp rocks;furry", SHOULD_RETURN: VCard.MARKERS.COMPANY },

		JOBTITLE_TYPE: { NAME: "JOBTITLE_TYPE", LINE: "TITLE:His title", SHOULD_RETURN: VCard.MARKERS.JOBTITLE },
		JOBTITLE_TYPE_EXCHANGE: { NAME: "JOBTITLE_TYPE_EXCHANGE", LINE: "title:sweet position", SHOULD_RETURN: VCard.MARKERS.JOBTITLE },

		PHONE_TYPE: { NAME: "PHONE_TYPE", LINE: "TEL;type=CELL:222-222-2222", SHOULD_RETURN: VCard.MARKERS.PHONE },
		PHONE_TYPE_EXCHANGE: { NAME: "PHONE_TYPE_EXCHANGE", LINE: "tel;type=home:408-555-5555", SHOULD_RETURN: VCard.MARKERS.PHONE },

		EMAIL_TYPE: { NAME: "EMAIL_TYPE", LINE: "EMAIL;type=INTERNET;type=WORK;type=pref:myW@email.com", SHOULD_RETURN: VCard.MARKERS.EMAIL },
		EMAIL_TYPE_EXCHANGE: { NAME: "EMAIL_TYPE_EXCHANGE", LINE: "email;type=internet;type=pref;type=work:testEmailW@email.com", SHOULD_RETURN: VCard.MARKERS.EMAIL },

		ADDRESS_TYPE: { NAME: "ADDRESS_TYPE", LINE: "ADR;TYPE=HOME:;This is my house address;;;;;", SHOULD_RETURN: VCard.MARKERS.ADDRESS },
		ADDRESS_TYPE_EXCHANGE: { NAME: "ADDRESS_TYPE_EXCHANGE", LINE: "adr;type=work;type=pref:;;123 I work here;San Jose;CA;95128;USA", SHOULD_RETURN: VCard.MARKERS.ADDRESS },

		BIRTHDAY_TYPE: { NAME: "BIRTHDAY_TYPE", LINE: "BDAY:1987-06-10", SHOULD_RETURN: VCard.MARKERS.BIRTHDAY },
		BIRTHDAY_TYPE_EXCHANGE: { NAME: "BIRTHDAY_TYPE_EXCHANGE", LINE: "bday:2009-03-29", SHOULD_RETURN: VCard.MARKERS.BIRTHDAY },

		URL_TYPE: { NAME: "URL_TYPE", LINE: "URL;TYPE=HOME:www.myhouse.com", SHOULD_RETURN: VCard.MARKERS.URL },
		URL_TYPE_EXCHANGE: { NAME: "URL_TYPE_EXCHANGE", LINE: "url;type=home:www.awesome.com", SHOULD_RETURN: VCard.MARKERS.URL },

		RELATED_TYPE: { NAME: "RELATED_TYPE", LINE: "item23.X-ABRELATEDNAMES;type=pref:my freind", SHOULD_RETURN: VCard.MARKERS.RELATED },
		RELATED_SPOUSE_EXCHANGE: { NAME: "RELATED_SPOUSE_EXCHANGE", LINE: "X-spouse:Shes cool", SHOULD_RETURN: VCard.MARKERS.SPOUSE_ONE_LINE },
		RELATED_CHILD_EXCHANGE: { NAME: "RELATED_CHILD_EXCHANGE", LINE: "X-child:kid 1", SHOULD_RETURN: VCard.MARKERS.CHILD_ONE_LINE },

		GTALK_TYPE: { NAME: "GTALK_TYPE", LINE: "X-GTALK:gIM@gtak.com", SHOULD_RETURN: VCard.MARKERS.GTALK },
		AIM_TYPE: { NAME: "AIM_TYPE", LINE: "X-AIM:aol", SHOULD_RETURN: VCard.MARKERS.AIM },
		MSN_TYPE: { NAME: "MSN_TYPE", LINE: "X-MSN:ahhmgoodoldsn", SHOULD_RETURN: VCard.MARKERS.MSN },
		MSN_EXCHANGE: { NAME: "MSN_EXCHANGE", LINE: "X-MSN;type=home:myIM2", SHOULD_RETURN: VCard.MARKERS.MSN },
		YAHOO_TYPE: { NAME: "YAHOO_TYPE", LINE: "X-YAHOO:someyah", SHOULD_RETURN: VCard.MARKERS.YAHOO },
		JABBER_TYPE: { NAME: "JABBER_TYPE", LINE: "X-JABBER:jibberajabbar", SHOULD_RETURN: VCard.MARKERS.JABBER },
		QQ_TYPE: { NAME: "QQ_TYPE", LINE: "X-QQ:idontknowthisonequeque", SHOULD_RETURN: VCard.MARKERS.QQ },
		ICQ_TYPE: { NAME: "ICQ_TYPE", LINE: "X-ICQ:whoUsesISeeQ", SHOULD_RETURN: VCard.MARKERS.ICQ },
		SKYPE_TYPE: { NAME: "SKYPE_TYPE", LINE: "X-SKYPE:weeSkyweePe", SHOULD_RETURN: VCard.MARKERS.SKYPE }
	};

	vCardTests.GETLINEVALUE_LINES = {
		// Funky bad/weird inputs
		// Isn't that weird that weird is spelled with the e before i when the rule is i before e. And I don't see any c in weird.
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: "" },
		BADLINE_NO_SEPERATOR: { NAME: "BADLINE_NO_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj", SHOULD_RETURN: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj" },
		BADLINE_EMPTY_AFTER_VALUE_SEPERATOR: { NAME: "BADLINE_EMPTY_AFTER_VALUE_SEPERATOR", LINE: "aefljkawefoijfaeleawunanabk wefagbeLIJREOIUWEj :", SHOULD_RETURN: "" },
		HAS_COLON_AFTER_SEPERATOR: { NAME: "HAS_COLON_AFTER_SEPERATOR", LINE: "asfaewli:Imwaefinfwa:woeiafjawf:", SHOULD_RETURN: "Imwaefinfwa:woeiafjawf:" },

		// Valid inputs/Usual values
		SIMPLE_TYPE: { NAME: "SIMPLE_TYPE", LINE: "tel;type=custom:333-555-5555", SHOULD_RETURN: "333-555-5555" },
		COMPLEX_TYPE: { NAME: "COMPLEX_TYPE", LINE: "TEL;TYPE=WORK;TYPE=FAX:6666666666", SHOULD_RETURN: "6666666666" }
	};

	vCardTests.EXTRACTLABEL_LINES = {
		// Funky bad inputs
		BLANK: { NAME: "BLANK", LINE: "", SHOULD_RETURN: VCard.TYPEMARKERS.OTHER },
		BADLINE: { NAME: "BADLINE", LINE: "aflwejowefiweofjiweofiwajofw", SHOULD_RETURN: VCard.TYPEMARKERS.OTHER },
		BADLINE_W_TYPE: { NAME: "BADLINE_W_TYPE", LINE: "asdfwefiojwefoiHOMEsfeoije", SHOULD_RETURN: VCard.TYPEMARKERS.HOME },
		BADLINE_W_TYPE_AFTER_COLON: { NAME: "BADLINE_W_TYPE_AFTER_COLON", LINE: "wefawaflkj:HOME", SHOULD_RETURN: VCard.TYPEMARKERS.OTHER },

		// Valid inputs
		FAX_HOME_BAD_PEOPLES_VERSION: { NAME: "FAX_HOME_BAD_PEOPLES_VERSION", LINE: "tel;type=home;type=fax:408-353-5555", SHOULD_RETURN: VCard.TYPEMARKERS.FAX_HOME },
		FAX_HOME_GOOD_PEOPLES_VERSION: { NAME: "FAX_HOME_GOOD_PEOPLES_VERSION", LINE: "TEL;TYPE=HOME;TYPE=FAX:5555555555", SHOULD_RETURN: VCard.TYPEMARKERS.FAX_HOME },
		FAX_HOME_ADDRESSBOOK_PEOPLES_VERSION: { NAME: "FAX_HOME_ADDRESSBOOK_PEOPLES_VERSION", LINE: "TEL;type=HOME;type=FAX:555-555-5555", SHOULD_RETURN: VCard.TYPEMARKERS.FAX_HOME },

		FAX_WORK_BAD_PEOPLES_VERSION: { NAME: "FAX_WORK_BAD_PEOPLES_VERSION", LINE: "tel;type=work;type=fax:408-353-5555", SHOULD_RETURN: VCard.TYPEMARKERS.FAX_WORK },
		FAX_WORK_GOOD_PEOPLES_VERSION: { NAME: "FAX_WORK_GOOD_PEOPLES_VERSION", LINE: "TEL;TYPE=WORK;TYPE=FAX:6666666666", SHOULD_RETURN: VCard.TYPEMARKERS.FAX_WORK },
		FAX_WORK_ADDRESSBOOK_PEOPLES_VERSION: { NAME: "FAX_WORK_ADDRESSBOOK_PEOPLES_VERSION", LINE: "TEL;type=WORK;type=FAX:666-666-6666", SHOULD_RETURN: VCard.TYPEMARKERS.FAX_WORK },

		EMAIL_HOME_BAD_PEOPLES_VERSION: { NAME: "EMAIL_HOME_BAD_PEOPLES_VERSION", LINE: "email;type=internet;type=home:testEmailH@email.com", SHOULD_RETURN: VCard.TYPEMARKERS.HOME },
		EMAIL_HOME_GOOD_PEOPLES_VERSION: { NAME: "EMAIL_HOME_GOOD_PEOPLES_VERSION", LINE: "EMAIL;TYPE=INTERNET;TYPE=HOME:testEmailH@email.com", SHOULD_RETURN: VCard.TYPEMARKERS.HOME },
		EMAIL_WORK_BAD_PEOPLES_VERSION: { NAME: "EMAIL_WORK_BAD_PEOPLES_VERSION", LINE: "email;type=internet;type=pref;type=work:testEmailW@email.com", SHOULD_RETURN: VCard.TYPEMARKERS.WORK },
		EMAIL_WORK_GOOD_PEOPLES_VERSION: { NAME: "EMAIL_WORK_GOOD_PEOPLES_VERSION", LINE: "EMAIL;TYPE=INTERNET;TYPE=WORK:testEmailW@email.com", SHOULD_RETURN: VCard.TYPEMARKERS.WORK },

		PHONE_PAGER_BAD_PEOPLES_VERSION: { NAME: "PHONE_PAGER_BAD_PEOPLES_VERSION", LINE: "tel;type=pager:555-555-5555", SHOULD_RETURN: VCard.TYPEMARKERS.PAGER },
		PHONE_PAGER_GOOD_PEOPLES_VERSION: { NAME: "PHONE_PAGER_GOOD_PEOPLES_VERSION", LINE: "TEL;TYPE=PAGER:7777777777", SHOULD_RETURN: VCard.TYPEMARKERS.PAGER },

		PHONE_CELL_BAD_PEOPLES_VERSION: { NAME: "PHONE_CELL_BAD_PEOPLES_VERSION", LINE: "tel;type=cell:111-555-5555", SHOULD_RETURN: VCard.TYPEMARKERS.CELL },
		PHONE_CELL_GOOD_PEOPLES_VERSION: { NAME: "PHONE_CELL_GOOD_PEOPLES_VERSION", LINE: "TEL;TYPE=CELL:2222222222", SHOULD_RETURN: VCard.TYPEMARKERS.CELL },

		PHONE_MAIN_BAD_PEOPLES_VERSION: { NAME: "PHONE_MAIN_BAD_PEOPLES_VERSION", LINE: "tel;type=main:444-444-4444", SHOULD_RETURN: VCard.TYPEMARKERS.MAIN },
		PHONE_MAIN_GOOD_PEOPLES_VERSION: { NAME: "PHONE_MAIN_GOOD_PEOPLES_VERSION", LINE: "TEL;TYPE=MAIN:4444444444", SHOULD_RETURN: VCard.TYPEMARKERS.MAIN },
		PHONE_MAIN_ADDRESSBOOK_PEOPLES_VERSION: { NAME: "PHONE_MAIN_GOOD_PEOPLES_VERSION", LINE: "TEL;type=MAIN:444-444-4444", SHOULD_RETURN: VCard.TYPEMARKERS.MAIN },

		PHONE_OTHER_BAD_PEOPLES_VERSION: { NAME: "PHONE_OTHER_BAD_PEOPLES_VERSION", LINE: "tel;type=custom:222-555-5555", SHOULD_RETURN: VCard.TYPEMARKERS.OTHER },
		PHONE_OTHER_GOOD_PEOPLES_VERSION: { NAME: "PHONE_OTHER_GOOD_PEOPLES_VERSION", LINE: "TEL;TYPE=OTHER:4444444444", SHOULD_RETURN: VCard.TYPEMARKERS.OTHER }
	};

	vCardTests.CONTACTS_FROM_VCARDS = {
		vCard3: [ new Contact({ "accounts":[],"addresses":[{"country":"United States of America","locality":"Baytown","postalCode":"30314","primary":false,"region":"LA","streetAddress":"100 Waters Edge","type":"type_work","value":""},{"country":"United States of America","locality":"Baytown","postalCode":"30314","primary":false,"region":"LA","streetAddress":"42 Plantation St.","type":"type_home","value":""}],"anniversary":"","birthday":"","displayName":"","emails":[{"primary":false,"type":"type_other","value":"forrestgump@example.com"}],"gender":"","ims":[],"name":{"familyName":"Gump","givenName":"Forrest","honorificPrefix":"","honorificSuffix":"","middleName":""},"nickname":"","note":"","organizations":[{"department":"","description":"","endDate":"","location":{},"name":"Bubba Gump Shrimp Co.","startDate":"","title":"Shrimp Man","type":""}],"phoneNumbers":[{"primary":false,"type":"type_work","value":"(111) 555-1212"},{"primary":false,"type":"type_home","value":"(404) 555-1212"}],"photos":[],"readOnly":false,"relations":[],"syncSource":{"extended":{},"name":null},"tags":[],"urls":[] }) ],
		vCard21: [ new Contact({ "accounts":[],"addresses":[],"anniversary":"","birthday":"","displayName":"","emails":[],"gender":"","ims":[],"name":{"familyName":"kapukod","givenName":"Hétszin","honorificPrefix":"","honorificSuffix":"","middleName":""},"nickname":"","note":"","organizations":[{"department":"","description":"","endDate":"","location":{},"name":"Bubba Gump Shrimp Co.","startDate":"","title":"Shrimp Man","type":""}],"phoneNumbers":[{"primary":false,"type":PhoneNumber.TYPE.MOBILE,"value":"2536"}],"photos":[],"readOnly":false,"relations":[],"syncSource":{"extended":{},"name":null},"tags":[],"urls":[]}) ],
		VCards3InOne: [ new Contact({ "accounts":[],"addresses":[{"country":"United States of America","locality":"Baytown","postalCode":"30314","primary":false,"region":"LA","streetAddress":"100 Waters Edge","type":"type_work","value":""},{"country":"United States of America","locality":"Baytown","postalCode":"30314","primary":false,"region":"LA","streetAddress":"42 Plantation St.","type":"type_home","value":""}],"anniversary":"","birthday":"","displayName":"","emails":[{"primary":false,"type":"type_other","value":"forrestgump@example.com"}],"gender":"","ims":[],"name":{"familyName":"Gump","givenName":"Forrest","honorificPrefix":"","honorificSuffix":"","middleName":""},"nickname":"","note":"","organizations":[{"department":"","description":"","endDate":"","location":{},"name":"Bubba Gump Shrimp Co.","startDate":"","title":"Shrimp Man","type":""}],"phoneNumbers":[{"primary":false,"type":"type_work","value":"(111) 555-1212"},{"primary":false,"type":"type_home","value":"(404) 555-1212"}],"photos":[],"readOnly":false,"relations":[],"syncSource":{"extended":{},"name":null},"tags":[],"urls":[] }), new Contact({ "accounts":[],"addresses":[],"anniversary":"","birthday":"","displayName":"","emails":[],"gender":"","ims":[],"name":{"familyName":"kapukod","givenName":"Hétszin","honorificPrefix":"","honorificSuffix":"","middleName":""},"nickname":"","note":"","organizations":[{"department":"","description":"","endDate":"","location":{},"name":"Bubba Gump Shrimp Co.","startDate":"","title":"Shrimp Man","type":""}],"phoneNumbers":[{"primary":false,"type":PhoneNumber.TYPE.MOBILE,"value":"2536"}],"photos":[],"readOnly":false,"relations":[],"syncSource":{"extended":{},"name":null},"tags":[],"urls":[] }), new Contact({ "accounts":[],"addresses":[{"country":"United States of America","locality":"Baytown","postalCode":"30314","primary":false,"region":"LA","streetAddress":"42 Plantation St.","type":"type_home","value":""}],"anniversary":"","birthday":"","displayName":"","emails":[{"primary":false,"type":"type_other","value":"forrestgump@example.com"}],"gender":"","ims":[],"name":{"familyName":"Gump","givenName":"Forrest","honorificPrefix":"","honorificSuffix":"","middleName":""},"nickname":"","note":"","organizations":[{"department":"","description":"","endDate":"","location":{},"name":"Bubba Gump Shrimp Co.","startDate":"","title":"Shrimp Man","type":""}],"phoneNumbers":[{"primary":false,"type":"type_work","value":"(111) 555-1212"},{"primary":false,"type":"type_pager","value":"(404) 555-1212"}],"photos":[],"readOnly":false,"relations":[],"syncSource":{"extended":{},"name":null},"tags":[],"urls":[] }) ],
		googleAll: [ new Contact({"accounts":[],"addresses":[{"country":"","locality":"","postalCode":"","primary":false,"region":"","streetAddress":"This is my house address","type":"type_home","value":""},{"country":"","locality":"","postalCode":"","primary":false,"region":"","streetAddress":"This is my work address","type":"type_work","value":""},{"country":"","locality":"","postalCode":"","primary":false,"region":"","streetAddress":"This is my other address","type":"type_other","value":""}],"anniversary":"","displayName":"","emails":[{"primary":false,"type":"type_home","value":"testEmailH@email.com"},{"primary":false,"type":"type_work","value":"testEmailW@email.com"},{"primary":false,"type":"type_other","value":"testEmailO@email.com"}],"gender":"","ims":[{"primary":false,"serviceName":"service_gtalk","type":"type_other","value":"gIM@gtak.com"},{"primary":false,"serviceName":"service_aim","type":"type_other","value":"aol"},{"primary":false,"serviceName":"service_yahoo","type":"type_other","value":"someyah"},{"primary":false,"serviceName":"service_icq","type":"type_other","value":"whoUsesISeeQ"},{"primary":false,"serviceName":"service_skype","type":"type_other","value":"weeSkyweePe"},{"primary":false,"serviceName":"service_qq","type":"type_other","value":"idontknowthisonequeque"},{"primary":false,"serviceName":"service_msn","type":"type_other","value":"ahhmgoodoldsn"},{"primary":false,"serviceName":"service_jabber","type":"type_other","value":"jibberajabbar"}],"name":{"familyName":"vCard","givenName":"Test","honorificPrefix":"","honorificSuffix":"","middleName":""},"nickname":{},"note":"","organizations":[{"department":"","description":"","endDate":"","location":{"country":"","locality":"","postalCode":"","primary":false,"region":"","streetAddress":"","type":"type_other","value":""},"name":"His Company","startDate":"","title":"His title","type":""}],"phoneNumbers":[{"primary":false,"type":"type_personal_fax","value":"5555555555"},{"primary":false,"type":"type_work_fax","value":"6666666666"},{"primary":false,"type":"type_pager","value":"7777777777"},{"primary":false,"type":"type_other","value":"8888888888"},{"primary":false,"type":"type_home","value":"9999999999"},{"primary":false,"type":"type_mobile","value":"2222222222"},{"primary":false,"type":"type_work","value":"3333333333"}],"photos":[],"readOnly":false,"relations":[{"primary":false,"type":"type_spouse","value":"mySouse"},{"primary":false,"type":"type_child","value":"mychild"},{"primary":false,"type":"type_mother","value":"mymother"},{"primary":false,"type":"type_father","value":"myfather"},{"primary":false,"type":"type_parent","value":"myparent"},{"primary":false,"type":"type_brother","value":"mybrother"},{"primary":false,"type":"type_sister","value":"mysister"},{"primary":false,"type":"type_friend","value":"myfriend"},{"primary":false,"type":"type_relative","value":"myrelative"},{"primary":false,"type":"type_partner","value":"myDP"},{"primary":false,"type":"type_manager","value":"myManager"},{"primary":false,"type":"type_assistant","value":"myassistant"},{"primary":false,"type":"type_partner","value":"myPartner"},{"primary":false,"type":"type_other","value":"myRefference"}],"syncSource":{"extended":{},"name":null},"tags":[],"urls":[{"primary":false,"type":"type_home","value":"www.myhouse.com"},{"primary":false,"type":"type_work","value":"www.mywork.com"},{"primary":false,"type":"type_other","value":"www.myhousepage.com"},{"primary":false,"type":"type_other","value":"www.mybl.com"}]})],
		dangEntourageAll: []
	};

});