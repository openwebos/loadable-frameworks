/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, include, Test, JSON, ContactFactory, ContactType, Future, MojoTest, Contact, DB, ContactPhoto, Assert, require */

var webos = IMPORTS.require('webos');
webos.include("test/loadall.js");
var fs = require('fs');

function ContactTests() {
	this.cd = JSON.parse(fs.readFileSync("test/contactdata.json", 'utf8'));
}

ContactTests.prototype.after = function (done) {
	var future = new Future();
	
	future.now(this, function () {
		future.nest(DB.del({
			from: "com.palm.contact:1"
		}));
	});
	
	future.then(done);
};

ContactTests.prototype.testContact = function () {
	var c = ContactFactory.createContactDisplay(this.cd.large_contact);
	Test.requireObject(c);
	c = ContactFactory.createContactLinkable(this.cd.large_contact);
	Test.requireObject(c);
	c = ContactFactory.create(undefined, this.cd.large_contact);
	Test.requireObject(c);
	c = ContactFactory.create(ContactType.DISPLAYABLE, this.cd.large_contact);
	Test.requireObject(c);
	c = ContactFactory.create(ContactType.LINKABLE, this.cd.large_contact);
	Test.requireObject(c);
	c = ContactFactory.create(ContactType.EDITABLE, this.cd.large_contact);
	Test.requireObject(c);
	c = ContactFactory.create(ContactType.RAWOBJECT, this.cd.large_contact);
	Test.requireObject(c);
	return MojoTest.passed;
};

ContactTests.prototype.testDirtyFlag = function () {
	var contact = new Contact(this.cd.large_contact);
	
	// TODO: currently failing from im address serviceName calling setType in its setter
	Test.requireFalse(contact.isDirty(), "Contact was dirty after initialization");
	
	contact.getPhoneNumbers().getArray()[0].setValue("4352344433");
	
	Test.require(contact.isDirty(), "Contact was not dirty after modifying object in array");
	
	contact.markNotDirty();
	
	Test.requireFalse(contact.isDirty(), "Contact was dirty after marking it as not dirty after modifying object in array");
	
	contact.getNote().setValue("This is my awesome note");
	
	Test.require(contact.isDirty(), "Contact was not dirty after modifying an object");
	
	contact.markNotDirty();
	
	Test.requireFalse(contact.isDirty(), "Contact was dirty after marking it as not dirty after modifying an object");
	
	return MojoTest.passed;
};

ContactTests.prototype.testGetIdOfADBObject = function (done) {
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
		
		//console.log("DBObject of photo - " + JSON.stringify(photo.getDBObject()));
		
		Assert.require(photo.getDBObject()._id, "Test GetIdOfADBObject did not have an id on the photo object");
		
		done(MojoTest.passed);
	});
	
};
