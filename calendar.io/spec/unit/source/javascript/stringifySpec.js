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

/*global beforeEach, describe, expect, it, JSON, stringify */

describe("Stringify tests", function () {
	beforeEach(function () {
		this.addMatchers({
			isString: function () {
				return typeof this.actual === "string";
			},
			toErr: function () {
				var result = false,
					exception;
				if (typeof this.actual !== 'function') {
					throw new Error('Actual is not a function');
				}
				try {
					this.actual();
				} catch (e) {
					exception = e;
				}
				return exception !== undefined;
			}
		});
	});

	it("should testBasic", function () {
		var root = {
			a: 1,
			b: {
				l: "as\tdf",
				m: 2,
				n: null
			},
			c: "qw\ner",
			d: {
				s: 4
			},
			e: [6, true, "uiop", 9],
			f: {},
			g: [],
			h: "zxcv"
		};
		root.b.o = root.c;
		root.i = root.d;
	
		expect(JSON.stringify(root)).toEqual(stringify(root, false, 0));
		expect(JSON.stringify(root, undefined, 4)).toEqual(stringify(root, false));
		expect(JSON.stringify(root, undefined, 4)).toEqual(stringify(root, false, 4));
		expect(JSON.stringify(root, undefined, 6)).toEqual(stringify(root, false, 6));
	
	
		expect(JSON.stringify(null)).toEqual(stringify(null, false, 0));
		expect(JSON.stringify(null, undefined, 4)).toEqual(stringify(null, false, 4));
	
		expect("'" + JSON.stringify(undefined) + "'").toEqual("'" + stringify(undefined, false, 0) + "'");
		expect("'" + JSON.stringify(undefined, undefined, 4) + "'").toEqual("'" + stringify(undefined, false, 4) + "'");
	
		expect(JSON.stringify(1)).toEqual(stringify(1, false, 0));
		expect(JSON.stringify(1, undefined, 4)).toEqual(stringify(1, false, 4));
	
		expect(JSON.stringify(1.5)).toEqual(stringify(1.5, false, 0));
		expect(JSON.stringify(1.5, undefined, 4)).toEqual(stringify(1.5, false, 4));
	
		expect(JSON.stringify(-1)).toEqual(stringify(-1, false, 0));
		expect(JSON.stringify(-1, undefined, 4)).toEqual(stringify(-1, false, 4));
	
		expect(JSON.stringify("null")).toEqual(stringify("null", false, 0));
		expect(JSON.stringify("null", undefined, 4)).toEqual(stringify("null", false, 4));
	
		expect(JSON.stringify("")).toEqual(stringify("", false, 0));
		expect(JSON.stringify("", undefined, 4)).toEqual(stringify("", false, 4));
	
		expect(JSON.stringify(true)).toEqual(stringify(true, false, 0));
		expect(JSON.stringify(true, undefined, 4)).toEqual(stringify(true, false, 4));
	
		expect(JSON.stringify(false)).toEqual(stringify(false, false, 0));
		expect(JSON.stringify(false, undefined, 4)).toEqual(stringify(false, false, 4));
	
		expect(JSON.stringify([0, 1, 2])).toEqual(stringify([0, 1, 2], false, 0));
		expect(JSON.stringify([0, 1, 2], undefined, 4)).toEqual(stringify([0, 1, 2], false, 4));
	
		expect(JSON.stringify([])).toEqual(stringify([], false, 0));
		expect(JSON.stringify([], undefined, 4)).toEqual(stringify([], false, 4));
	});

	it("should test circular", function () {
		var func1 = function (a) {
				return a;
			},
			root = {
				a: 1,
				b: {
					l: "as\tdf",
					m: 2,
					n: null
				},
				c: "qw\ner",
				d: {
					s: 4,
					t: func1
				},
				e: [6, true, "uiop", 9],
				f: {},
				g: [],
				h: "zxcv"
			};
	
		root.b.o = root.c;
		root.i = root.d;
		root.b.p = root;
		root.e.push(root.e);
		root.b.q = root.e;
		root.e.push(root.b);
		root.h.w = root;
	
		expect(JSON.stringify.bind(this, root)).toErr();
		expect(JSON.stringify.bind(this, root, undefined, 4)).toErr();
		expect(JSON.stringify.bind(this, root, undefined, 6)).toErr();
	
		expect(stringify(root)).isString();
		expect(stringify(root, false, 0)).isString();
		expect(stringify(root, false, 4)).isString();
		expect(stringify(root, false, 6)).isString();
	});

	it("should test functions", function () {
		var func1 = function () {},
			func2 = function (a) {
				return a;
			};
	
		expect(stringify(func1)).isString();
		expect(stringify(func1, false, 0)).isString();
	
		expect(stringify(func2)).isString();
		expect(stringify(func2, false, 0)).isString();
	});
});