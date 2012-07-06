/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, include, MojoTest, JSON, console, PersonFactory, Person, Future, Test, DB, ContactType, FavoriteBackup, Foundations, Crypto, ContactLinkable, Assert, _, PhoneNumberExtended, ContactPointTypes, EmailAddressExtended, IMAddressExtended, require */

var webos = IMPORTS.require('webos');
webos.include("test/loadall.js");
var fs = IMPORTS.require('fs');

function FavoriteTests() {
	this.pd = JSON.parse(fs.readFileSync("test/persondata.json", 'utf8'));
	this.savedPerson = null;
	this.savedPerson2 = null;
	this.favoriteBackup = null;
	this.wipeFavorites = true;
	this.wipeSavedPerson = true;
}

FavoriteTests.timeoutInterval = 100000;

FavoriteTests.applicationIds = {
	phone: "com.palm.phone",
	messaging: "com.palm.messaging",
	PartyA: "com.3rdparty.shaweet",
	PartyB: "com.myparty.favoritesRock"
};

/**
 * If this.savedPerson is not set we are going to add it to the database.
 * 
 */
FavoriteTests.prototype.before = function (done) {
	if (this.savedPerson && this.savedPerson2) {
		done();
		return;
	}
	
	var future = new Future();

	if (!this.savedPerson && !this.savedPerson2) {
		future.now(this, function () {
			this.savedPerson = PersonFactory.createPersonDisplay(this.pd.large_person);
		
			future.nest(this.savedPerson.save());
			//console.log("Saved person!");
		});
		
		future.then(this, function () {
			this.savedPerson2 = PersonFactory.createPersonDisplay(this.pd.large_person);
			this.savedPerson2.getContactIds().clear();
			this.savedPerson2.getContactIds().add("aof44");
			this.savedPerson2.getContactIds().add("ionu323");
		
			future.nest(this.savedPerson2.save());
		});
		
	} else if (!this.savedPerson) {
		future.now(this, function () {
			this.savedPerson = PersonFactory.createPersonDisplay(this.pd.large_person);
		
			future.nest(this.savedPerson.save());
			//console.log("Saved person!");
		});
	} else if (!this.savedPerson2) {
		future.now(this, function () {
			this.savedPerson2 = PersonFactory.createPersonDisplay(this.pd.large_person);
			this.savedPerson2.getContactIds().clear();
			this.savedPerson2.getContactIds().add("aof44");
			this.savedPerson2.getContactIds().add("ionu323");

			future.nest(this.savedPerson2.save());
			//console.log("Saved person!");
		});
	}
	

	future.then(done);
};

/**
 * If this.savedPerson currently exists we want to remove it from the database.
 * 
 */
FavoriteTests.prototype.after = function (done) {
	var doingAsync = false,
		future = new Future();
	
	future.now(this, function () {
		if (this.savedPerson && this.savedPerson2 && this.wipeSavedPerson) {
			doingAsync = true;
			future.nest(this.savedPerson.deletePerson());
			
			//console.log("Killed person!");
		} else {
			future.result = true;
		}
	});
		
	if (this.wipeFavorites) {
		doingAsync = true;
		
		future.then(this, function () {
			future.nest(DB.del({
				"from": FavoriteBackup.kind
			}));
			this.wipeFavorites = false;
		});
	}	

	
	
	
	if (doingAsync) {
		future.then(function () {
			if (this.savedPerson || this.savedPerson2) {
				this.savedPerson = null;
				this.savedPerson2 = null;
			}
			
			future.result = true;
		});
		future.then(done);
	} else {
		done();
		return;
	}
	

};

/**
 * Convience method to make it cleaner to verify a person in the db has the 
 * favorite value set to what we are expecting. It reports the results of
 * the test from within this method.
 * 
 */
FavoriteTests.prototype.getPersonAndVerifyFavoriteValueIs = function (future, favoriteValue, reportResults) {
	var result = future.result,
		newFuture = new Future(),
		personFromDB = null;
		
	if (result) {
		newFuture.nest(Person.getDisplayablePersonAndContactsById(this.savedPerson.getId()));
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
};

FavoriteTests.prototype.getPersonAndVerifyFavoriteDataContainsForApp = function (future, favoriteData, applicationId) {
	var result = future.result,
		newFuture = new Future(),
		personFromDB = null;
		
	newFuture.now(this, function () {
		if (result) {
			newFuture.nest(Person.getDisplayablePersonAndContactsById(this.savedPerson.getId()));
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
};


FavoriteTests.prototype.verifyCorrectFavoriteBackup = function (future, id, reportResults) {
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
};

/**
  * Verifies that given a person, the correct favorite backup records exist in the favoriteBackup table.
  */
FavoriteTests.prototype.verifyCorrectFavoriteBackupsMadeForPerson = function (future, person, reportResults) {
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
};

FavoriteTests.prototype.verifyCorrectFavoriteBackupsRemovedForPerson = function (future, person, reportResults) {
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
};


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
FavoriteTests.prototype.xtestMakeFavoriteNoParams = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
	});
};

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
FavoriteTests.prototype.xtestMakeFavoriteWithPersonIdParam = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite({ personId: this.savedPerson.getId()}));
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
	});
};

/**
 * Tests the functionality that a person can be set as a favorite and apply that
 * change directly to the database
 *
 * Passes - Marking the person as a favorite in the db is successful
 * Fails - If the save is unsuccessful. 
 *         If trying to get the saved person from the db fails.
 *         If the person saved in the db is not marked as a favorite, after we mark it as a favorite
 */ 
FavoriteTests.prototype.xtestMakeFavoriteWithPersonIdParamNoExist = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person._favoritePerson({personId: this.savedPerson.getId()}, "aslfkjweoif"));
		//future.nest(this.savedPerson.makeFavorite({}));
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
	});
};

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
FavoriteTests.prototype.xtestMakeFavoriteWithPersonIdParamNotObject = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite(true));
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, true, reportResults);
	});
};

FavoriteTests.prototype.testSetDefaultWithSetDefaultMethodNoParams = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.setFavoriteDefault());
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultWithSetDefaultMethodEmptyDefaultData = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.setFavoriteDefault({ defaultData: {} }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultWithSetDefaultMethodDefaultDataUnsupportedContactPointType = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.Address } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultPhoneNumberWithSetDefaultMethodDefaultDataNoListIndex = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultPhoneNumberWithSetDefaultMethodDefaultDataNoValue = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultPhoneNumberWithPersonSetDefaultMethodNoPersonId = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(Person.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "34908742" } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultPhoneNumberWithSetDefaultMethodNonExistentPerson = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(Person.setFavoriteDefault({ personId: "funyuns", defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "3249087" } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.xtestSetDefaultPhoneNumberWithSetDefaultMethodNonExistentPerson = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(Person.setFavoriteDefault({ personId: "funyuns", defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "3249087" } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultPhoneNumberWithSetDefaultMethodNotFavoritedPerson = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(this.savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "dlsfjwqeo" } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.testSetDefaultPhoneNumberWithSetDefaultMethodValueNotInContactPoints = function (reportResults) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.setFavoriteDefault({ defaultData: { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, value: "dlsfjwqeo" } }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

FavoriteTests.prototype.xtestSetDefaultPhoneNumberWithSetDefaultMethod = function (reportResults) {
	var future = new Future(),
		favoriteData = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
		applicationId = FavoriteTests.applicationIds.phone;
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue,
			result = future.result;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData:  favoriteData }, applicationId));
	});
	
	future.then(this, function () {
		future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData, applicationId));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			reportResults(MojoTest.passed);
		} else {
			reportResults(MojoTest.failed);
		}
	});
};

FavoriteTests.prototype.xtestSet2DefaultPhoneNumbersWithSetDefaultMethodAndDifferentAppIds = function (reportResults) {
	var future = new Future(),
		favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
		favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } },
		applicationId1 = FavoriteTests.applicationIds.phone,
		applicationId2 = FavoriteTests.applicationIds.messaging;
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData1.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");
		
		phoneNumberValue = phoneNumberArray[1].getValue();
		
		favoriteData2.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
	});
	
	future.then(this, function () {
		future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
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
};

FavoriteTests.prototype.xtestSet2DefaultPhoneNumbersWithSetDefaultMethodAndSameAppIdsSameValue = function (reportResults) {
	var future = new Future(),
		favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
		favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } },
		applicationId1 = FavoriteTests.applicationIds.phone,
		applicationId2 = FavoriteTests.applicationIds.phone;
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData1.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
		} else {
			reportResults(MojoTest.failed);
		}
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData2.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
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
};

FavoriteTests.prototype.xtestSet2DefaultPhoneNumbersWithSetDefaultMethodAndSameAppIdsSameValueRemoveAuxData = function (reportResults) {
	var future = new Future(),
		favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, auxData: { messagingStatus: "cool" } },
		favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2},
		applicationId1 = FavoriteTests.applicationIds.phone,
		applicationId2 = FavoriteTests.applicationIds.phone;
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData1.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
		} else {
			reportResults(MojoTest.failed);
		}
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData2.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
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
};

FavoriteTests.prototype.xtestSet2DefaultDifferentTypesWithSetDefaultMethodAndSameAppIds = function (reportResults) {
	var future = new Future(),
		favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0, auxData: { messagingStatus: "cool" } },
		favoriteData2 = { contactPointType: ContactPointTypes.IMAddress, listIndex: 2},
		applicationId1 = FavoriteTests.applicationIds.messaging,
		applicationId2 = FavoriteTests.applicationIds.messaging;
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData1.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
		} else {
			reportResults(MojoTest.failed);
		}
	});
	
	future.then(this, function () {
		var imArray = this.savedPerson.getIms().getArray(),
			imValue;
		
		Assert.require(imArray.length, "Ahhhh - someone changed the ims on contactdata.json's large person. We need at least one phone number on him for this test");
		
		imValue = imArray[0].getValue();
		
		favoriteData2.value = imValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
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
};

FavoriteTests.prototype.xtestSet2DefaultPhoneNumbersWithSetDefaultMethodAndSameAppIdsDifferentValue = function (reportResults) {
	var future = new Future(),
		favoriteData1 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 0 },
		favoriteData2 = { contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } },
		applicationId1 = FavoriteTests.applicationIds.phone,
		applicationId2 = FavoriteTests.applicationIds.phone;
	
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least one phone number on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		favoriteData1.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData1 }, applicationId1));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData1, applicationId1));
		} else {
			reportResults(MojoTest.failed);
		}
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");
		
		phoneNumberValue = phoneNumberArray[1].getValue();
		
		favoriteData2.value = phoneNumberValue;
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: favoriteData2 }, applicationId2));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		if (result) {
			future.nest(this.getPersonAndVerifyFavoriteDataContainsForApp(future, favoriteData2, applicationId2));
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
};

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
FavoriteTests.prototype.xtestUnFavoriteNoParams = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.unfavorite());
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
	});
};

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
FavoriteTests.prototype.xtestUnFavoriteWithPersonId = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.unfavorite({ personId: this.savedPerson.getId() }));
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
	});
};

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
FavoriteTests.prototype.xtestUnFavoriteWithEmptyObjectParameter = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.unfavorite({}));
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
	});
};

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
FavoriteTests.prototype.testUnFavoriteWithPersonNoExistInDBParameter = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(Person.unfavoritePerson({ personId: "doritos" }));
	});
	
	future.then(this, function () {
		try {
			var result = future.result;
		} catch (e) {
			reportResults(MojoTest.passed);
			return;
		}
		
		reportResults(MojoTest.failed);
	});
};

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
FavoriteTests.prototype.xtestUnFavoriteWithParameterNotObject = function (reportResults) {
	var future = new Future();
		
	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson.unfavorite(false));
	});
	
	future.then(this, function () {
		this.getPersonAndVerifyFavoriteValueIs(future, false, reportResults);
	});
};

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
FavoriteTests.prototype.xtestGetBackupContactWithId = function (reportResults) {
	var future = new Future(),
		contactId = "34fZ",
		contactIdHash = ContactLinkable.getLinkHash(contactId);
	
	this.wipeFavorites = true;
	
	future.now(this, function () {
		this.favoriteBackup = new FavoriteBackup({
			contactBackupHash: contactIdHash,
			defaultPropertyHashes: [{
				value: "32afewoi3232f2o",
				type: ContactPointTypes.PhoneNumber,
				favoriteData: { "com.palm.app.phone": { listIndex: 0 }}
			}]
		});
		future.nest(this.favoriteBackup.save());
	});
	
	future.then(this, function () {
		future.nest(FavoriteBackup.getBackupForContactWithId(contactId));
	});
	
	future.then(this, function () {
		this.verifyCorrectFavoriteBackup(future, contactId, reportResults);
	});
};



/**
 * Tests to ensure the correct backup entries are being added for this person when it is newly favorited.
 *
 * Passes - When all the correct favorite backup entries are in the db and their defaults are correct
 * Fails - If there are not enough entries in the db.
 *         The wrong values are set for the default communication modes
 * 
 */
FavoriteTests.prototype.xtestFavoriteBackupEntriesAddedToFavorite = function (reportResults) {
	var future = new Future();

	this.wipeFavorites = true;

	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		this.verifyCorrectFavoriteBackupsMadeForPerson(future, this.savedPerson, reportResults);
	});
};

/**
 * Tests to ensure the correct backup entries are updated and that the correct defaults are set.
 *
 * Passes - When all the correct favorite backup entries are in the db and their defaults are correct
 * Fails - If there are not enough entries in the db.
 *         The wrong values are set for the default communication modes
 * 
 */
FavoriteTests.prototype.xtestFavoriteBackupEntriesUpdatedFromFavorite = function (reportResults) {
	var future = new Future();

	this.wipeFavorites = true;
	this.wipeSavedPerson = true;

	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite());
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");
		
		phoneNumberValue = phoneNumberArray[1].getValue();
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, FavoriteTests.applicationIds.phone));
	});
	
	future.then(this, function () {
		this.verifyCorrectFavoriteBackupsMadeForPerson(future, this.savedPerson, reportResults);
	});
};

/**
 * Tests to ensure the correct backup entries are removed from the db
 *
 * Passes - When there are no favorite backup records for the person's linked contacts
 * Fails - If all the favorite backups that should have been deleted are not.
 * 
 */
FavoriteTests.prototype.xtestFavoriteBackupEntriesRemovedFromFavorite = function (reportResults) {
	var future = new Future();

	this.wipeFavorites = true;
	this.wipeSavedPerson = true;

	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite(true));
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");
		
		phoneNumberValue = phoneNumberArray[1].getValue();
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, FavoriteTests.applicationIds.phone));
	});
	
	future.then(this, function () {
		future.nest(Person._unfavoritePerson({personId: this.savedPerson.getId()}));
	});
	
	future.then(this, function () {
		this.verifyCorrectFavoriteBackupsRemovedForPerson(future, this.savedPerson, reportResults);
	});
};

/**
 * Tests to ensure the correct backup entries are restored from db
 *
 * Passes - When there are no favorite backup records for the person's linked contacts
 * Fails - If all the favorite backups that should have been deleted are not.
 * 
 */
FavoriteTests.prototype.testFavoriteBackupEntriesRestoredFromDB = function (reportResults) {
	var future = new Future();

	future.now(this, function () {
		future.nest(this.savedPerson.makeFavorite(true));
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");
		
		phoneNumberValue = phoneNumberArray[1].getValue();
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, FavoriteTests.applicationIds.phone));
	});
	
	future.then(this, function () {
		future.nest(this.savedPerson2.makeFavorite(true));
	});
	
	future.then(this, function () {
		var phoneNumberArray = this.savedPerson2.getPhoneNumbers().getArray(),
			phoneNumberValue;
		
		Assert.require(phoneNumberArray.length > 1, "Ahhhh - someone changed the phoneNumbers on contactdata.json's large person. We need at least two phone numbers on him for this test");
		
		phoneNumberValue = phoneNumberArray[0].getValue();
		
		future.nest(Person._setFavoriteDefault({ personId: this.savedPerson2.getId(),  defaultData: { value: phoneNumberValue, contactPointType: ContactPointTypes.PhoneNumber, listIndex: 2, auxData: { messagingStatus: "cool" } } }, FavoriteTests.applicationIds.phone));
	});
	
	future.then(this, function () {
		future.nest(Person.getDisplayablePersonAndContactsById(this.savedPerson.getId()));
	});
	
	future.then(this, function () {
		var result = future.result;
		
		this.savedPerson = result;
		
		future.nest(Person.getDisplayablePersonAndContactsById(this.savedPerson2.getId()));
	});
	
	future.then(this, function () {
		var result = future.result,
			contacts = [];
		
		this.savedPerson2 = result;
		
		FavoriteTests.manuallyLink2People(this.savedPerson, this.savedPerson2);
		
		contacts.concat(this.savedPerson.getContacts());
		contacts.concat(this.savedPerson2.getContacts());
		
		future.nest(this.savedPerson.fixupFromObjects(contacts, ContactType.EDITABLE, [this.savedPerson2]));
	});
	
	future.then(this, function () {
		reportResults(MojoTest.passed);
	});
};

FavoriteTests.manuallyLink2People = function (person1, person2) {
	person1.getContactIds().add(person2.getContactIds().getArray());
};

// TODO: Add test for update of favorite default and some of the backup entries are missing