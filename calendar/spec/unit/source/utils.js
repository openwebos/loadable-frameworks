// @@@LICENSE
//
//      Copyright (c) 2010-2012 Hewlett-Packard Development Company, L.P.
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
// LICENSE@@@
// REVIEWED: Erik Jaesler 2012-01-12

/*jslint devel: true, onevar: false, undef: true, eqeqeq: true, bitwise: true,
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */

/*global exports, waitsFor */

function waitsForFuture(future, optionalTimeout) {
	var done = false;
	future.then(function () {
		done = true;
		future.result = future.result;
	});
	waitsFor(function () {
		// if (done) { console.log("Waited future done: " + future.status()); }
		if (future.exception) { console.log("Future exception: " + future.exception); }
		return done;
	}, optionalTimeout);
}

var MINUTES_TO_MILLISECONDS_FACTOR = 60*1000;
var baseOffsetPST = new Date().getTimezoneOffset() - 480;
var tzOffsetPST = (baseOffsetPST) * MINUTES_TO_MILLISECONDS_FACTOR;

function shiftObjectFromPST(dateLikeObject) {
	if (dateLikeObject.dtstart) { dateLikeObject.dtstart += tzOffsetPST; }
	if (dateLikeObject.dtend) { dateLikeObject.dtend += tzOffsetPST; }
	if (dateLikeObject.start) { dateLikeObject.start += tzOffsetPST; }
	if (dateLikeObject.end) { dateLikeObject.end += tzOffsetPST; }
	if (dateLikeObject.rrule && dateLikeObject.rrule.until) { dateLikeObject.rrule.until += tzOffsetPST; }
}

function shiftFromPST(timestamp) {
	return timestamp + tzOffsetPST;
}


var isoRegex = /([\-:]|(\.\d+))/g;

function reformatISOString(utcTimestamp) {
	var str = new Date(utcTimestamp).toISOString();
	// console.log("ISO str: " + str);
	return str.replace(isoRegex, '');
}

function shiftISO8601FromPST(iso8601) {
	// We only shift to UTC; anything else is going to be wrong.
	var useZulu = iso8601 && iso8601[iso8601.length - 1] === 'Z';
	if (tzOffsetPST) {
		iso8601 = useZulu ? iso8601.substr(0, 15) : iso8601;
		var date = Date.parseExact(iso8601, 'yyyyMMddTHHmmss');
		date.addMilliseconds(tzOffsetPST);
		iso8601 = reformatISOString(date);
	}
	return iso8601;
}

exports.waitsForFuture = waitsForFuture;
exports.shiftObjectFromPST = shiftObjectFromPST;
exports.shiftFromPST = shiftFromPST;
exports.shiftISO8601FromPST = shiftISO8601FromPST;
