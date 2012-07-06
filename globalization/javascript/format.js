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

/*globals Globalization */

/**
 * Globalization.Format
 * Holds functionality related to formatting strings.
 *
 **/


/*$ @private */

/*$
 * Return a Template object that substitutes the strings into a specified string template 
 * @param {String} template Base static string to substitute into
 * @param {Regexp} pattern (optional) overrides the normal #{foo} substitution format
 */
Globalization.Format.Template = function(template, pattern) {
	this.template = template;
	this.pattern = pattern || Globalization.Format.Template.Pattern;
};

Globalization.Format.Template.prototype = {
	/*$
	 * Substitutes the strings into a specified string template 
	 * @param {Object} data Object to pull variable values from
	 *
	 *  var source = '\\#{zero} #{zero} #{woot.blah}...';
	 *  var falses = {zero:0, woot:{blah: "Zeta"}};
	 *  var template = new Globalization.Format.Template(source);
	 *  evaluate should return ---> '#{zero} 0 Zeta...'
	 *
	 */
	evaluate: function(data) {
		var parts = [];
		var template = this.template;
		
		var pattern = this.pattern;
		var nextKey;
		
		if(!data || !template) {
			return '';
		}
		
		function identify(str) {
			return (str === undefined || str === null) ? '' : str;
		}
		
		function nextValue(prev, wrappedKey, key) {
			var currentNode = data;
			var propChain, nextProp;
			
			prev = identify(prev);
			
			if(prev == '\\') {
				return wrappedKey;
			}
			
			propChain = key.split('.');
			nextProp = propChain.shift();

			while(currentNode && nextProp) {
				currentNode = currentNode[nextProp];
				nextProp = propChain.shift();
				if(!nextProp) {
					//other falsey values should appear to maintain consistency.
					return (prev + identify(currentNode)) || prev || '';
				}
			}
			return prev || '';
		}
		
		
		while(template.length) {
			nextKey = template.match(pattern);
			if(nextKey) {
				parts.push(template.slice(0, nextKey.index));
				parts.push(nextValue(nextKey[1], nextKey[2], nextKey[3]));
				template = template.slice(nextKey.index + nextKey[0].length);
			} else {
				parts.push(template);
				template = '';
			}
		}

		return parts.join('');
	}
};

Globalization.Format.Template.Pattern = /(.?)(#\{(.*?)\})/;
