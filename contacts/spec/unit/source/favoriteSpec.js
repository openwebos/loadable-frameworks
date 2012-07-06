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

/*global afterEach, beforeEach, console, describe, expect, it, JSON, MojoLoader, MojoTest,
 PersonFactory, Person, require, runs, Future, Test, DB, ContactType, FavoriteBackup,
 Foundations, Crypto, ContactLinkable, Assert, _, PhoneNumberExtended, ContactPointTypes,
 EmailAddressExtended, IMAddressExtended, waitsFor, xdescribe, xit */

var fs = require('fs');
var utils = require('./utils');
var waitsForFuture = utils.waitsForFuture;
var fm = MojoLoader.require({name:"foundations.mock", version: "1.0"})["foundations.mock"];

xdescribe("Favorite Tests", function () {
	var pd = JSON.parse(fs.readFileSync("test/persondata.json", 'utf8')),
		savedPerson = null,
		savedPerson2 = null,
		favoriteBackup = null,
		wipeFavorites = true,
		wipeSavedPerson = true,
		applicationIds = {
			phone: "com.palm.phone",
			messaging: "com.palm.messaging",
			PartyA: "com.3rdparty.shaweet",
			PartyB: "com.myparty.favoritesRock"
		},
		timeoutInterval = 100000;
	console.log("pd: " + JSON.stringify(Object.keys(pd)));



	/**
	 * If savedPerson is not set we are going to add it to the database.
	 *
	 */
	beforeEach(function () {
		fm.Comms.Mock.PalmCall.useMock();
		fm.Data.Mock.DB.useMock();

		if (savedPerson && savedPerson2) {
			return;
		}

		var future = new Future();

		if (!savedPerson && !savedPerson2) {
			future.now(this, function () {
				savedPerson = PersonFactory.createPersonDisplay(pd.large_person);

				future.nest(savedPerson.save());
				//console.log("Saved person!");
			});

			future.then(this, function () {
				savedPerson2 = PersonFactory.createPersonDisplay(pd.large_person);
				savedPerson2.getContactIds().clear();
				savedPerson2.getContactIds().add("aof44");
				savedPerson2.getContactIds().add("ionu323");

				future.nest(savedPerson2.save());
			});

		} else if (!savedPerson) {
			future.now(this, function () {
				savedPerson = PersonFactory.createPersonDisplay(pd.large_person);

				future.nest(savedPerson.save());
				//console.log("Saved person!");
			});
		} else if (!savedPerson2) {
			future.now(this, function () {
				savedPerson2 = PersonFactory.createPersonDisplay(pd.large_person);
				savedPerson2.getContactIds().clear();
				savedPerson2.getContactIds().add("aof44");
				savedPerson2.getContactIds().add("ionu323");

				future.nest(savedPerson2.save());
				//console.log("Saved person!");
			});
		}

		waitsForFuture(future);
	});

	/**
	 * If savedPerson currently exists we want to remove it from the database.
	 *
	 */
	afterEach(function () {
		var doingAsync = false,
			future = new Future();

		future.now(this, function () {
			if (savedPerson && savedPerson2 && wipeSavedPerson) {
				doingAsync = true;
				future.nest(savedPerson.deletePerson());

				//console.log("Killed person!");
			} else {
				future.result = true;
			}
		});

		if (wipeFavorites) {
			doingAsync = true;

			future.then(this, function () {
				future.nest(DB.del({
					"from": FavoriteBackup.kind
				}));
				wipeFavorites = false;
			});
		}




		if (doingAsync) {
			future.then(function () {
				if (savedPerson || savedPerson2) {
					savedPerson = null;
					savedPerson2 = null;
				}

				future.result = true;
			});
			waitsForFuture(future);
		} else {
			return;
		}
	});


	/**
	 * Convience method to make it cleaner to verify a person in the db has the
	 * favorite value set to what we are expecting. It reports the results of
	 * the test from within this method.
	 *
	 */
	function getPersonAndVerifyFavoriteValueIs(future, favoriteValue, reportResults) {
		var result = future.result,
			newFuture = new Future(),
			personFromDB = null;

		if (result) {
			newFuture.nest(Person.getDisplayablePersonAndContactsById(savedPerson.getId()));
		} else {
			console.log(JSON.stringify(result));
			reportResults(MojoTest.failed);
		}

		newFuture.then(this, function () {
			var result = newFuture.result;
			if (result) {
				personFromDB = result;
				if (personFromDB.isFavorite() === favoriteValue) {
					reportResults(MojoTest.passed);
				} else {
					reportResults(MojoTest.failed);
				}
			} else {
				console.log(JSON.stringify(result));
				reportResults(MojoTest.failed);
			}
		});
	}

	function getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData, applicationId) {
		var result = future.result,
			newFuture = new Future(),
			personFromDB = null;

		newFuture.now(this, function () {
			if (result) {
				newFuture.nest(Person.getDisplayablePersonAndContactsById(savedPerson.getId()));
			} else {
				console.log(JSON.stringify(result));
				newFuture.result = false;
			}
		});

		newFuture.then(this, function () {
			var result = newFuture.result,
				defaults,
				i,
				normalizedValue,
				dbFavoriteData,
				appsFavoriteData;

			if (result) {
				personFromDB = result;
				if (personFromDB.isFavorite() === true) {
					defaults = personFromDB._getDefaultContactPointsForTypeAndAppId(undefined, applicationId);
					//console.log("Before the if - " + defaults);
					if (defaults && defaults.length !== 1) {
						//console.log("HERE are the defaults -" + defaults);
					}

					if (defaults && defaults.length === 1) {
						normalizedValue = Person._getNormalizedValueForContactPointType(favoriteData.contactPointType, favoriteData.value);
						dbFavoriteData = defaults[0].getFavoriteData();
						appsFavoriteData = dbFavoriteData[applicationId];
						//console.log("!!!!!!!!!!!Making comparison");
						//console.log("normalized value " + normalizedValue + " - " + defaults[0].getNormalizedValue());
						//console.log("list index " + appsFavoriteData.listIndex + " - " + favoriteData.listIndex);
						//console.log("aux data " + (appsFavoriteData.auxData ? JSON.stringify(appsFavoriteData.auxData) : appsFavoriteData.auxData) + " - " + (favoriteData.auxData ? JSON.stringify(favoriteData.auxData) : favoriteData.auxData));
						if (normalizedValue === defaults[0].getNormalizedValue() && appsFavoriteData.listIndex === favoriteData.listIndex && _.isEqual(appsFavoriteData.auxData, favoriteData.auxData)) {
							newFuture.result = true;
							return;
						} else {
							newFuture.result = false;
							return;
						}
					} else {
						newFuture.result = false;
						return;
					}

				} else {
					newFuture.result = false;
					return;
				}
			} else {
				console.log(JSON.stringify(result));
				newFuture.result = false;
				return;
			}
		});

		return newFuture;
	}


	function verifyCorrectFavoriteBackup(future, id, reportResults) {
		var result = future.result;

		if (result) {
			if (result.getContactBackupHashContactId() === id) {
				result.deleteFavoriteBackup();
				reportResults(MojoTest.passed);
				return;
			}
		}

		console.log(JSON.stringify(result));
		reportResults(MojoTest.failed);
	}

	/**
	  * Verifies that given a person, the correct favorite backup records exist in the favoriteBackup table.
	  */
	function verifyCorrectFavoriteBackupsMadeForPerson(future, person, reportResults) {
		var result = future.result,
			newFuture = new Future(),
			contactIds,
			defaults = {},
			failedTest = false,
			tempFavoriteBackup,
			i,
			j,
			k,
			l,
			m,
			test2Future,
			foundDefaults = false,
			tempDefault,
			tempDefaults,
			hashedDefaults,
			tempHash,
			splitDefault = false;

		if (!result) {
			console.log(JSON.stringify(result));
			reportResults(MojoTest.failed);
		}

		newFuture.now(this, function () {
			newFuture.nest(Person.getDisplayablePersonAndContactsById(person.getId()));
		});

		newFuture.then(this, function () {
			person = newFuture.result;
			contactIds = person.getContactIds().getArray();

			Foundations.Control.mapReduce({
				map: function (data) {
					return FavoriteBackup.getBackupForContactWithId(data.getValue());
				},
				reduce: function (result, mapReduceFuture) {
					if (result.length > contactIds.length) {
						console.log("Too many favorite backups exist for this person. More backups than contacts.");
						failedTest = true;
					}

					if (!failedTest) {
						for (i = 0; i < result.length; i += 1) {
							if (!result[i].result) {
								console.log("One of the expected backup records did not exist in the favoritebackup table");
								failedTest = true;
							} else {

								// Loop through all the contacts on the person
								for (j = 0; j < contactIds.length; j += 1) {
									tempFavoriteBackup = result[i].result;

									// Add all the supported types for favorites to the defaults array
									for (m = 0; m < Person.supportedFavoriteTypes.length; m += 1) {
										defaults[Person.supportedFavoriteTypes[m]] = person._getDefaultContactPointsForTypeAndAppId(Person.supportedFavoriteTypes[m]);
									}

									// If the favoritebackup that we are dealing with now matches our current contactId, do something with it.
									if (contactIds[j].getValue() === tempFavoriteBackup.getContactBackupHashContactId()) {

										// Get all the hashed defaults for this favoritebackup
										hashedDefaults = tempFavoriteBackup.getDefaultPropertyHashes().getArray();

										tempDefaults = _.flatten(_.values(defaults));

										//console.log(hashedDefaults);
										//console.log(tempDefaults);

										// Loop through all of the defaults
										for (m = 0; m < tempDefaults.length; m += 1) {
											tempDefault = tempDefaults[m];

											// Loop through each of the hashed favorite backups
											for (l = 0; l < hashedDefaults.length; l += 1) {
												tempHash = hashedDefaults[l];

												//console.log(tempHash.getValue());
												//console.log(Crypto.MD5.b64_md5(tempDefault.getNormalizedValue()));
												//console.log("Check 1:" + tempHash.isPlainValueEqual(tempDefault.getNormalizedValue()));
												//console.log("+" + FavoriteTests.getTypeForInstanceOf(tempDefault) + "+");
												//console.log("+" + tempHash.getType() + "+");
												//console.log("Check 2:" + (FavoriteTests.getTypeForInstanceOf(tempDefault) === tempHash.getType()));
												// Check to see if the value and the types are the same, i.e. this is a backup for this defaulted data
												if (tempHash.isPlainValueEqual(tempDefault.getNormalizedValue()) && (ContactPointTypes.getFavoritableTypeForInstanceOf(tempDefault) === tempHash.getType())) {
													// We know that the tempHash is matched up with the tempDefault default. Check to make sure the data is the same
													//console.log(tempHash.getFavoriteData());
													//console.log(tempDefault.getFavoriteData());
													//console.log("Check 3:" + _.isEqual(tempHash.getFavoriteData(), tempDefault.getFavoriteData()));
													if (_.isEqual(tempHash.getFavoriteData(), tempDefault.getFavoriteData())) {
														tempDefaults.splice(m, 1);
														hashedDefaults.splice(l, 1);
														splitDefault = true;
														break;
													} else {
														failedTest = true;
														console.log("Favorite data for object - " + tempHash + " - did not match - " + tempDefault);
													}
												}
											}
										}

										//console.log("*@#(*&@$# " + hashedDefaults + " -- " + hashedDefaults.length);
										//console.log("32@#$@)#@($* " + tempDefaults + " -- " + tempDefaults.length);

										// Now that we went through all of the defaults, check to make sure that they have all been represented by a backup. And that there are no
										// more hashedDefaults left.
										if (tempDefaults.length === 0 && hashedDefaults.length === 0) {
											contactIds.splice(j, 1);
											j = 0;
										} else {
											failedTest = true;
											console.log("All of the defaults for this contactId - " + contactIds[j] + " - have not been represented in the default backups");
											break;
										}
									}
								}
							}
						}
					}

					test2Future = new Future();
					// Check to make sure that we have gone through all of the contactIds and there are none left that have not been fully represented
					// in the backup table. Or check to make sure the test has been marked as failed.
					if (contactIds.length > 0 || failedTest) {
						test2Future.result = false;
					} else {
						test2Future.result = true;
					}

					return test2Future;
				}

			}, contactIds).then(function (doneMapReduceFuture) {

				if (doneMapReduceFuture && doneMapReduceFuture.result) {
					reportResults(MojoTest.passed);
					return;
				} else {
					//console.log(JSON.stringify(result));
					reportResults(MojoTest.failed);
				}
			});
		});
	}

	function verifyCorrectFavoriteBackupsRemovedForPerson(future, person, reportResults) {
		var result = future.result,
			newFuture = new Future(),
			contactIds = person.getContactIds().getArray(),
			failedTest = false,
			test2Future,
			defaults = {},
			tempDefaults;

		if (!result) {
			console.log(JSON.stringify(result));
			reportResults(MojoTest.failed);
		}

		Foundations.Control.mapReduce({
			map: function (data) {
				return FavoriteBackup.getBackupForContactWithId(data.getValue());
			},
			reduce: function (result, mapReduceFuture) {
				var i,
					m;
				for (i = 0; i < result.length; i += 1) {
					if (result[i].result) {
						console.log("An unexpected backup record existed for this person. Not all backups were removed properly!");
						failedTest = true;
					}
				}

				test2Future = new Future();
				if (failedTest) {
					test2Future.result = false;
				} else {
					for (m = 0; m < Person.supportedFavoriteTypes.length; m += 1) {
						defaults[Person.supportedFavoriteTypes[m]] = person._getDefaultContactPointsForTypeAndAppId(Person.supportedFavoriteTypes[m]);
					}

					tempDefaults = _.flatten(_.values(defaults));

					if (tempDefaults.length === 0) {
						test2Future.result = true;
					} else {
						test2Future.result = false;
					}
				}

				return test2Future;
			}

		}, contactIds).then(function (doneMapReduceFuture) {

			if (doneMapReduceFuture && doneMapReduceFuture.result) {
				reportResults(MojoTest.passed);
				return;
			} else {
				reportResults(MojoTest.failed);
			}
		});
	}


	function manuallyLink2People(person1, person2) {
		person1.getContactIds().add(person2.getContactIds().getArray());
	}

	/**
	 * Tests the functionality that a person can be set as a favorite and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is not marked as a favorite, after we mark it as a favorite
	 *
	 */
	it("should test makeFavoriteNoParams", function (reportResults) {
		runs(function () {
			var future = new Future();

			future.now(this, function () {
				future.nest(savedPerson.makeFavorite());
			});

			future.then(this, function () {
				getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
			});
		});
	});

	/**
	 * Tests the functionality that a person can be set as a favorite and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is not marked as a favorite, after we mark it as a favorite
	 *
	 */
	it("should test makeFavoriteWithPersonIdParam", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite({ personId: savedPerson.getId()}));
		});

		future.then(this, function () {
			getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
		});
	});

	/**
	 * Tests the functionality that a person can be set as a favorite and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is not marked as a favorite, after we mark it as a favorite
	 */
	it("should test makeFavoriteWithPersonIdParamNoExist", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(Person._favoritePerson({personId: savedPerson.getId()}, "aslfkjweoif"));
			//future.nest(savedPerson.makeFavorite({}));
		});

		future.then(this, function () {
			getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
		});
	});

	/**
	 * Tests the functionality that a person can be set as a favorite and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is not marked as a favorite, after we mark it as a favorite
	 *
	 */
	it("should test makeFavoriteWithPersonIdParamNotObject", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite(true));
		});

		future.then(this, function () {
			getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
		});
	});

	xit("should test setDefaultWithSetDefaultMethodNoParams", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.setFavoriteDefault());
		});

		future.then(this, function () {
			// console.log("exception: " + future.getException());
			expect(future.getException()).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	xit("should test setDefaultWithSetDefaultMethodEmptyDefaultData", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.setFavoriteDefault({ defaultData: {} }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	xit("should test setDefaultWithSetDefaultMethodDefaultDataUnsupportedContactPointType", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.Address } }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	xit("should test setDefaultPhoneNumberWithSetDefaultMethodDefaultDataNoListIndex", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber } }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	xit("should test setDefaultPhoneNumberWithSetDefaultMethodDefaultDataNoValue", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 } }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	xit("should test setDefaultPhoneNumberWithPersonSetDefaultMethodNoPersonId", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(Person.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "34908742" } }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future, timeoutInterval);
	});

	xit("should test setDefaultPhoneNumberWithSetDefaultMethodNonExistentPerson", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(Person.setFavoriteDefault({ personId: "funyuns", defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "3249087" } }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	xit("should test setDefaultPhoneNumberWithSetDefaultMethodNotFavoritedPerson", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "dlsfjwqeo" } }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	xit("should test setDefaultPhoneNumberWithSetDefaultMethodValueNotInContactPoints", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "dlsfjwqeo" } }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return future.result;
		});

		waitsForFuture(future);
	});

	it("should test setDefaultPhoneNumberWithSetDefaultMethod", function (reportResults) {
		var future = new Future(),
			favoriteData = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
			applicationId = applicationIds.phone;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue,
				result = future.result;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData:  favoriteData }, applicationId));
		});

		future.then(this, function () {
			future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData, applicationId));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				reportResults(MojoTest.passed);
			} else {
				reportResults(MojoTest.failed);
			}
		});
	});

	it("should test set2DefaultPhoneNumbersWithSetDefaultMethodAndDifferentAppIds", function (reportResults) {
		var future = new Future(),
			favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
			favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } },
			applicationId1 = applicationIds.phone,
			applicationId2 = applicationIds.messaging;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData1.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");

			phoneNumberValue = phoneNumberArray[1].getValue();

			favoriteData2.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
		});

		future.then(this, function () {
			future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				reportResults(MojoTest.passed);
			} else {
				reportResults(MojoTest.failed);
			}
		});
	});

	it("should test set2DefaultPhoneNumbersWithSetDefaultMethodAndSameAppIdsSameValue", function (reportResults) {
		var future = new Future(),
			favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
			favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } },
			applicationId1 = applicationIds.phone,
			applicationId2 = applicationIds.phone;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData1.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData2.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				reportResults(MojoTest.passed);
			} else {
				reportResults(MojoTest.failed);
			}
		});
	});

	it("should test set2DefaultPhoneNumbersWithSetDefaultMethodAndSameAppIdsSameValueRemoveAuxData", function (reportResults) {
		var future = new Future(),
			favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, auxData: { messagingStatus: "cool" } },
			favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2},
			applicationId1 = applicationIds.phone,
			applicationId2 = applicationIds.phone;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData1.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData2.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				reportResults(MojoTest.passed);
			} else {
				reportResults(MojoTest.failed);
			}
		});
	});

	it("should test set2DefaultDifferentTypesWithSetDefaultMethodAndSameAppIds", function (reportResults) {
		var future = new Future(),
			favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, auxData: { messagingStatus: "cool" } },
			favoriteData2 = { contactPointType: ContactPointTypes.IMAddress, listIndex: 2},
			applicationId1 = applicationIds.messaging,
			applicationId2 = applicationIds.messaging;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData1.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var imArray = savedPerson.getIms().getArray(),
				imValue;

			Assert.require(imArray.length, "Ahhhh - someone changed the ims on contactdata.json's large person. We need at least one phone number on him for this test");

			imValue = imArray[0].getValue();

			favoriteData2.value = imValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				reportResults(MojoTest.passed);
			} else {
				reportResults(MojoTest.failed);
			}
		});
	});

	it("should test set2DefaultPhoneNumbersWithSetDefaultMethodAndSameAppIdsDifferentValue", function (reportResults) {
		var future = new Future(),
			favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
			favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } },
			applicationId1 = applicationIds.phone,
			applicationId2 = applicationIds.phone;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");

			phoneNumberValue = phoneNumberArray[0].getValue();

			favoriteData1.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");

			phoneNumberValue = phoneNumberArray[1].getValue();

			favoriteData2.value = phoneNumberValue;

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				future.nest(getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
			} else {
				reportResults(MojoTest.failed);
			}
		});

		future.then(this, function () {
			var result = future.result;

			if (result) {
				reportResults(MojoTest.passed);
			} else {
				reportResults(MojoTest.failed);
			}
		});
	});

	/**
	 * Tests the functionality that a person can be set unfavorited and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as not a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is marked a favorite, after we mark it as not a favorite
	 *
	 */
	it("should test unFavoriteNoParams", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.unfavorite());
		});

		future.then(this, function () {
			getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
		});
	});

	/**
	 * Tests the functionality that a person can be set unfavorited and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as not a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is marked a favorite, after we mark it as not a favorite
	 *
	 */
	it("should test unFavoriteWithPersonId", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.unfavorite({ personId: savedPerson.getId() }));
		});

		future.then(this, function () {
			getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
		});
	});

	/**
	 * Tests the functionality that a person can be set unfavorited and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as not a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is marked a favorite, after we mark it as not a favorite
	 *
	 */
	it("should test unFavoriteWithEmptyObjectParameter", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.unfavorite({}));
		});

		future.then(this, function () {
			getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
		});
	});

	/**
	 * Tests the functionality that a person can be set unfavorited and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as not a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is marked a favorite, after we mark it as not a favorite
	 *
	 */
	xit("should test unFavoriteWithPersonNoExistInDBParameter", function () {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(Person.unfavoritePerson({ personId: "doritos" }));
		});

		future.then(this, function () {
			expect(future.exception).toBeTruthy();
			return true;
		});

		waitsForFuture(future);
	});

	/**
	 * Tests the functionality that a person can be set unfavorited and apply that
	 * change directly to the database
	 *
	 * Passes - Marking the person as not a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is marked a favorite, after we mark it as not a favorite
	 *
	 */
	it("should test unFavoriteWithParameterNotObject", function (reportResults) {
		var future = new Future();

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			future.nest(savedPerson.unfavorite(false));
		});

		future.then(this, function () {
			getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
		});
	});

	/**
	 * Tests the functionality that a FavoriteBackup is fetchable by the id of the contact record that was
	 * backed up.
	 *
	 * Passes - Marking the person as not a favorite in the db is successful
	 * Fails - If the save is unsuccessful.
	 *         If trying to get the saved person from the db fails.
	 *         If the person saved in the db is marked as a favorite, after we mark it as not a favorite
	 *
	 */
	it("should test getBackupContactWithId", function (reportResults) {
		var future = new Future(),
			contactId = "34fZ",
			contactIdHash = ContactLinkable.getLinkHash(contactId);

		wipeFavorites = true;

		future.now(this, function () {
			favoriteBackup = new FavoriteBackup({
				contactBackupHash: contactIdHash,
				defaultPropertyHashes: [{
					value: "32afewoi3232f2o",
					type: ContactPointTypes.PhoneNumber,
					favoriteData: { "com.palm.app.phone": { listIndex: 0 }}
				}]
			});
			future.nest(favoriteBackup.save());
		});

		future.then(this, function () {
			future.nest(FavoriteBackup.getBackupForContactWithId(contactId));
		});

		future.then(this, function () {
			this.verifyCorrectFavoriteBackup(future, contactId, reportResults);
		});
	});



	/**
	 * Tests to ensure the correct backup entries are being added for this person when it is newly favorited.
	 *
	 * Passes - When all the correct favorite backup entries are in the db and their defaults are correct
	 * Fails - If there are not enough entries in the db.
	 *         The wrong values are set for the default communication modes
	 *
	 */
	it("should test favoriteBackupEntriesAddedToFavorite", function (reportResults) {
		var future = new Future();

		wipeFavorites = true;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			this.verifyCorrectFavoriteBackupsMadeForPerson(future, savedPerson, reportResults);
		});
	});

	/**
	 * Tests to ensure the correct backup entries are updated and that the correct defaults are set.
	 *
	 * Passes - When all the correct favorite backup entries are in the db and their defaults are correct
	 * Fails - If there are not enough entries in the db.
	 *         The wrong values are set for the default communication modes
	 *
	 */
	it("should test favoriteBackupEntriesUpdatedFromFavorite", function (reportResults) {
		var future = new Future();

		wipeFavorites = true;
		wipeSavedPerson = true;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite());
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");

			phoneNumberValue = phoneNumberArray[1].getValue();

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, applicationIds.phone));
		});

		future.then(this, function () {
			this.verifyCorrectFavoriteBackupsMadeForPerson(future, savedPerson, reportResults);
		});
	});

	/**
	 * Tests to ensure the correct backup entries are removed from the db
	 *
	 * Passes - When there are no favorite backup records for the person's linked contacts
	 * Fails - If all the favorite backups that should have been deleted are not.
	 *
	 */
	it("should test favoriteBackupEntriesRemovedFromFavorite", function (reportResults) {
		var future = new Future();

		wipeFavorites = true;
		wipeSavedPerson = true;

		future.now(this, function () {
			future.nest(savedPerson.makeFavorite(true));
		});

		future.then(this, function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");

			phoneNumberValue = phoneNumberArray[1].getValue();

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, applicationIds.phone));
		});

		future.then(this, function () {
			future.nest(Person._unfavoritePerson({personId: savedPerson.getId()}));
		});

		future.then(this, function () {
			this.verifyCorrectFavoriteBackupsRemovedForPerson(future, savedPerson, reportResults);
		});
	});

	/**
	 * Tests to ensure the correct backup entries are restored from db
	 *
	 * Passes - When there are no favorite backup records for the person's linked contacts
	 * Fails - If all the favorite backups that should have been deleted are not.
	 *
	 */
	it("should test favoriteBackupEntriesRestoredFromDB", function () {
		var future = new Future();

		future.now(function () {
			future.nest(savedPerson.makeFavorite(true));
		});

		future.then(function () {
			var phoneNumberArray = savedPerson.getPhoneNumbers().getArray(),
				phoneNumberValue;

			expect(phoneNumberArray.length).toBeGreaterThan(1);	// "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test"

			phoneNumberValue = phoneNumberArray[1].getValue();

			future.nest(Person._setFavoriteDefault({ personId: savedPerson.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, applicationIds.phone));
		});

		future.then(function () {
			future.nest(savedPerson2.makeFavorite(true));
		});

		future.then(function () {
			var phoneNumberArray = savedPerson2.getPhoneNumbers().getArray(),
				phoneNumberValue;

			expect(phoneNumberArray.length).toBeGreaterThan(1);	// "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test"

			phoneNumberValue = phoneNumberArray[0].getValue();

			future.nest(Person._setFavoriteDefault({ personId: savedPerson2.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, applicationIds.phone));
		});

		future.then(function () {
			future.nest(Person.getDisplayablePersonAndContactsById(savedPerson.getId()));
		});

		future.then(function () {
			var result = future.result;

			savedPerson = result;

			future.nest(Person.getDisplayablePersonAndContactsById(savedPerson2.getId()));
		});

		future.then(function () {
			var result = future.result,
				contacts = [];

			savedPerson2 = result;

			manuallyLink2People(savedPerson, savedPerson2);

			contacts.concat(savedPerson.getContacts());
			contacts.concat(savedPerson2.getContacts());

			future.nest(savedPerson.fixupFromObjects(contacts, ContactType.EDITABLE, [savedPerson2]));
		});

		waitsForFuture(future);
	});

	// TODO: Add test for update of favorite default and some of the backup entries are missing
});