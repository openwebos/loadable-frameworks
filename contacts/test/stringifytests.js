/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global IMPORTS, require: true, MojoTest, JSON, Utils */

if (typeof require === 'undefined') {
	require = IMPORTS.require;
}
var webos = require('webos');
webos.include("test/loadall.js");

function StringifyTests() {
}

StringifyTests.prototype.testBasic = function () {
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
	
	
	return MojoTest.passed;
};

StringifyTests.prototype.testCircular = function () {
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
	
	return MojoTest.passed;
};

StringifyTests.prototype.testFunctions = function () {
	var func1 = function () {},
		func2 = function (a) {
			return a;
		};
	
	MojoTest.requireString(Utils.stringify(func1));
	MojoTest.requireString(Utils.stringify(func1, false, 0));
	
	MojoTest.requireString(Utils.stringify(func2));
	MojoTest.requireString(Utils.stringify(func2, false, 0));
	
	return MojoTest.passed;
};

StringifyTests.prototype.testDepthCutoff = function () {
	var func1 = function () {},
		func2 = function (a) {
			return a;
		};
	
	MojoTest.requireString(Utils.stringify(func1));
	MojoTest.requireString(Utils.stringify(func1, false, 0));
	
	MojoTest.requireString(Utils.stringify(func2));
	MojoTest.requireString(Utils.stringify(func2, false, 0));
	
	return MojoTest.passed;
};
