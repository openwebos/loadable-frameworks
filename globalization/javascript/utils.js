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

/*globals Globalization Foundations palmGetResource console JSON */

var Cache = {};

var Utils = {
	getJsonFile: function (path, locale) {
		var jsonString, json;
		// var start = new Date();
		
		//console.log("Utils.getJsonFile: loading " + path + " in locale " + locale);
		
		if ( Cache[path] !== undefined ) {
			//console.log("Utils.getJsonFile: #1 found in cache");
			json = Cache[path].json;
			Cache[path].timestamp = new Date();		// update last touched time
		} else if ( EnvironmentUtils && EnvironmentUtils.isBrowser() ) {
			//console.log("Utils.getJsonFile: in browser, using caching palmgetresource");
			jsonString = palmGetResource(path, "const json");		// get the object from the shared cache
			try {
				if ( typeof(jsonString) === 'string' ) {
					json = JSON.parse(jsonString);
				} else {
					json = jsonString;
				}
				Cache[path] = {
					path: path,
					json: json,
					locale: locale,
					timestamp: new Date()
				};
			} catch ( e ) {
				//console.error("Globalization.Utils.getJsonFile: Error parsing json for " + path);
			}
		} else {
			//console.log("Utils.getJsonFile: #2 in non-browser, loading via foundations");
			// cache it ourselves
			try {
				jsonString = Foundations.Comms.loadFile(path);

				if (jsonString) {
					json = JSON.parse(jsonString);
				}
			} catch (e) {
				var str = e.toString();
				if (str.search(/^Could not find file/i) === -1 &&
						str.search(/ENOENT/) === -1) {
					console.trace("Could not load or parse file " + path + " due to exception " + e + " Saving error in Cache so we don't try again until later");
				}
				// remember that we could not load the file so that we don't spend a lot of
				// time in the future attempting to load the file. This is accomplished by
				// putting json as undefined into the cache for that path.
				json = undefined;
			}

			Cache[path] = {
				path: path,
				json: json,
				locale: locale,
				timestamp: new Date()
			};
			//console.log("Utils.getJsonFile: Saved in cache.");
		}

		if ( this.oldestStamp === undefined ) {
			this.oldestStamp = Cache[path].timestamp;
		}
		
		//var end = new Date();
		//console.log("getJsonFile: length " + (end.getTime() - start.getTime()));

		return json;
	},

	releaseAllJsonFiles: function(exceptLocale) {
		var now;
		var expireList = [];
		var len;
		var timeout = 60000;
		var oldest;
		// var start = new Date();
		
		now = new Date();
		
		//console.log("Utils.releaseAllJsonFiles: sweep through and release everything except locale " + exceptLocale);
		
		if ( this.oldestStamp !== undefined && (this.oldestStamp.getTime() + timeout) < now.getTime() ) {
			//console.log("Utils.releaseAllJsonFiles: past oldest timeout check");
			
			oldest = now;
			_.each(Cache, function (cacheItem) {
				if ( cacheItem !== undefined ) {
					//console.log("Utils.releaseAllJsonFiles: testing " + cacheItem.path + " locale " + cacheItem.locale);
					if ( cacheItem.locale !== exceptLocale ) {
						//console.log("Utils.releaseAllJsonFiles: testing for timeout");
						// timeout is currently 60 seconds
						if ( (cacheItem.timestamp.getTime() + timeout) < now.getTime() ) {
							//console.log("Utils.releaseAllJsonFiles: #3 older than threshold, expiring file " + cacheItem.path);
							expireList.push(cacheItem.path);
						} else {
							if ( cacheItem.timestamp.getTime() < oldest.getTime() ) {
								oldest = cacheItem.timestamp;
							}
							//console.log("Utils.releaseAllJsonFiles: #4 not older than threshold, keeping file ");
						}
					}
				}
			}, this);

			// unset the oldest stamp if there were no entries left in the cache
			this.oldestStamp = (oldest.getTime() < now.getTime()) ? oldest : undefined;
			
			//console.log("Utils.releaseAllJsonFiles: oldestStamp is now " + this.oldestStamp);
			
			// do the actual expiration in a separate loop so that it doesn't screw up the iteration above
			for ( i = 0; i < expireList.length; i++ ) {
				Cache[expireList[i]] = undefined;
			}
		}
		
		/*
		 
		var end = new Date();
		len = end.getTime() - start.getTime();
		//console.log("releaseAllJsonFiles: length " + len);
		
		if ( this.totalReleaseTime === undefined ) {
			this.totalReleaseTime = 0;
			this.totalReleaseAttempts = 0;
		}
		this.totalReleaseTime += len;
		this.totalReleaseAttempts++;
		
		//console.log("releaseAllJsonFiles: total: " + this.totalReleaseTime + " average: " + (this.totalReleaseTime/this.totalReleaseAttempts));
		*/
	}
};