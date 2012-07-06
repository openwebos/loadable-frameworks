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

/*global describe, it, IMPORTS, require: true, JSON, Utils */

var MojoTest = require('./utils');

describe("Stringify Tests", function () {

	it("should test basic", function () {
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

		MojoTest.requireIdentical(JSON.stringify(root), Utils.stringify(root, false, 0));
		MojoTest.requireIdentical(JSON.stringify(root, undefined, 4), Utils.stringify(root, false));
		MojoTest.requireIdentical(JSON.stringify(root, undefined, 4), Utils.stringify(root, false, 4));
		MojoTest.requireIdentical(JSON.stringify(root, undefined, 6), Utils.stringify(root, false, 6));


		MojoTest.requireIdentical(JSON.stringify(null), Utils.stringify(null, false, 0));
		MojoTest.requireIdentical(JSON.stringify(null, undefined, 4), Utils.stringify(null, false, 4));

		MojoTest.requireIdentical("'" + JSON.stringify(undefined) + "'", "'" + Utils.stringify(undefined, false, 0) + "'");
		MojoTest.requireIdentical("'" + JSON.stringify(undefined, undefined, 4) + "'", "'" + Utils.stringify(undefined, false, 4) + "'");

		MojoTest.requireIdentical(JSON.stringify(1), Utils.stringify(1, false, 0));
		MojoTest.requireIdentical(JSON.stringify(1, undefined, 4), Utils.stringify(1, false, 4));

		MojoTest.requireIdentical(JSON.stringify(1.5), Utils.stringify(1.5, false, 0));
		MojoTest.requireIdentical(JSON.stringify(1.5, undefined, 4), Utils.stringify(1.5, false, 4));

		MojoTest.requireIdentical(JSON.stringify(-1), Utils.stringify(-1, false, 0));
		MojoTest.requireIdentical(JSON.stringify(-1, undefined, 4), Utils.stringify(-1, false, 4));

		MojoTest.requireIdentical(JSON.stringify("null"), Utils.stringify("null", false, 0));
		MojoTest.requireIdentical(JSON.stringify("null", undefined, 4), Utils.stringify("null", false, 4));

		MojoTest.requireIdentical(JSON.stringify(""), Utils.stringify("", false, 0));
		MojoTest.requireIdentical(JSON.stringify("", undefined, 4), Utils.stringify("", false, 4));

		MojoTest.requireIdentical(JSON.stringify(true), Utils.stringify(true, false, 0));
		MojoTest.requireIdentical(JSON.stringify(true, undefined, 4), Utils.stringify(true, false, 4));

		MojoTest.requireIdentical(JSON.stringify(false), Utils.stringify(false, false, 0));
		MojoTest.requireIdentical(JSON.stringify(false, undefined, 4), Utils.stringify(false, false, 4));

		MojoTest.requireIdentical(JSON.stringify([0, 1, 2]), Utils.stringify([0, 1, 2], false, 0));
		MojoTest.requireIdentical(JSON.stringify([0, 1, 2], undefined, 4), Utils.stringify([0, 1, 2], false, 4));

		MojoTest.requireIdentical(JSON.stringify([]), Utils.stringify([], false, 0));
		MojoTest.requireIdentical(JSON.stringify([], undefined, 4), Utils.stringify([], false, 4));
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

		MojoTest.requireError(this, JSON.stringify, [root]);
		MojoTest.requireError(this, JSON.stringify, [root, undefined, 4]);
		MojoTest.requireError(this, JSON.stringify, [root, undefined, 6]);

		MojoTest.requireString(Utils.stringify(root));
		MojoTest.requireString(Utils.stringify(root, false, 0));
		MojoTest.requireString(Utils.stringify(root, false, 4));
		MojoTest.requireString(Utils.stringify(root, false, 6));
	});

	it("should test functions", function () {
		var func1 = function () {},
			func2 = function (a) {
				return a;
			};

		MojoTest.requireString(Utils.stringify(func1));
		MojoTest.requireString(Utils.stringify(func1, false, 0));

		MojoTest.requireString(Utils.stringify(func2));
		MojoTest.requireString(Utils.stringify(func2, false, 0));
	});

	it("should test depthCutoff", function () {
		var func1 = function () {},
			func2 = function (a) {
				return a;
			};

		MojoTest.requireString(Utils.stringify(func1));
		MojoTest.requireString(Utils.stringify(func1, false, 0));

		MojoTest.requireString(Utils.stringify(func2));
		MojoTest.requireString(Utils.stringify(func2, false, 0));
	});
});