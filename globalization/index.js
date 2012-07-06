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

/*jslint evil: true */
/*globals require __dirname */ 
var MojoLoader = require('mojoloader');

(function() {
	var data, manifest;
	var fs = require('fs');
	var file;

	data = fs.readFileSync(__dirname + '/manifest.json', 'utf8');
	manifest = JSON.parse(data);
	for (var i = 0; i < manifest.files.javascript.length; i++) {
		file = __dirname + '/javascript/' + manifest.files.javascript[i];
		data = fs.readFileSync(file, 'utf8');
		/*
		 * We eval everything so that it all executes in this context. This
		 * allows the library to depend on and manipulate parts of itself.
		 */
		eval(data);
	}
})();
