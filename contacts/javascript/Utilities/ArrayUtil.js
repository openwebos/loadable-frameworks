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
/*global */

var ArrayUtil = {
	pushAll: function (dst, src) {
		var i;
		for (i = 0; i < src.length; i += 1) {
			dst.push(src[i]);
		}
		return dst;
	},

	// Remove the first occurance of toRemove from
	// the src array.
	removeValue: function (src, toRemove) {
		var i,
			found = false;
		for (i = 0; i < src.length; i += 1) {
			if (src[i] === toRemove) {
				src.splice(i, 1);
				found = true;
				return found;
			}
		}

		return found;
	},

	copyOfArray: function (src) {
		var toReturn = [],
			i;

		if (src) {

			for (i = 0; i < src.length; i += 1) {
				toReturn[i] = src[i];
			}
		}

		return toReturn;
	}
};
