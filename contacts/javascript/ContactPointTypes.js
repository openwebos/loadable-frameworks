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
/*global exports PhoneNumberExtended, EmailAddressExtended, IMAddressExtended*/

var ContactPointTypes = exports.ContactPointTypes = {
	PhoneNumber: "contact_point_type_phoneNumber",
	EmailAddress: "contact_point_type_emailAddress",
	IMAddress: "contact_point_type_imAddress",
	Address: "contact_point_type_address",
	Url: "contact_point_type_url"
};

ContactPointTypes.getFavoritableTypeForInstanceOf = function (object) {
	if (object instanceof PhoneNumberExtended) {
		return ContactPointTypes.PhoneNumber;
	} else if (object instanceof EmailAddressExtended) {
		return ContactPointTypes.EmailAddress;
	} else if (object instanceof IMAddressExtended) {
		return ContactPointTypes.IMAddress;
	} else {
		return "Not_A_Favoriteable_Type";
	}
};