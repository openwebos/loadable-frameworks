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

/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global palmGetResource, include, console */
//TODO: remove evil:true from jslint comment

var exports = {},
	loadall,
	Globalization,
	UnitTest;

if (!loadall) {
	
	var libs;
	libs = MojoLoader.require(
		{name: "globalization", version: "1.0"},
		{name: "unittest", version: "1.0"}
		);

	Globalization = libs.globalization.Globalization;
	UnitTest = libs.unittest.UnitTest;
	
	console.log("*** done loading globalization library!");
}

var objectEquals = function (left, right) {
	var p;
	for(p in left) {
		if ( p !== undefined && left[p] !== undefined ) {
			if ( right[p] === undefined ) {
				console.error("objectEquals: right is missing property " + p + " which has the value " + left[p] + " on the left");
				console.error("left is : " + JSON.stringify(left));
				console.error("right is: " + JSON.stringify(right));
				return false;
			}
			if ( typeof(left[p]) == 'object' ) {
				if ( this.objectEquals(left[p], right[p]) === false ) {
					return false;
				}
			} else if(left[p] !== right[p]){
				console.error("objectEquals: difference in property " + p);
				console.error("left is : " + JSON.stringify(left));
				console.error("right is: " + JSON.stringify(right));
				return false;
			}
		}
	}
	for(p in right){
		if ( p !== undefined && right[p] !== undefined ) {
			if ( left[p] === undefined ) {
				console.error("objectEquals: left is missing property " + p + " which has the value " + right[p] + " on the right");
				console.error("left is : " + JSON.stringify(left));
				console.error("right is: " + JSON.stringify(right));
				return false;
			}
			if ( typeof(right[p]) == 'object' ) {
				if ( this.objectEquals(left[p], right[p]) === false ) {
					return false;
				}
			} else if(left[p] !== right[p]){
				console.error("objectEquals: difference in property " + p);
				console.error("left is : " + JSON.stringify(left));
				console.error("right is: " + JSON.stringify(right));
				return false;
			}
		}
	}
	return true;
};
