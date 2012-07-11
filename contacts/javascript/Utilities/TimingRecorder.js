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

/* Copyright 2009 Palm, Inc.  All rights reserved. */
/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true,
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global _, console, process */

var TimingRecorder = function (turnOffTimings, process) {
	this.timings = {};
	this.turnOffTimings = turnOffTimings;
	this.process = process;
};

TimingRecorder.prototype.startTimingForJob = function (jobName) {
	if (!this.turnOffTimings || !this.process) {
		return;
	}

	var time = this.process.uptime();

	if (!this.timings[jobName]) {
		this.timings[jobName] = [];
	}

	this.timings[jobName].push({
		startTime: time
	});
};

TimingRecorder.prototype.stopTimingForJob = function (jobName) {
	var time,
		tempJobTimings;

	if (!this.turnOffTimings || !this.process) {
		return;
	}

	time = this.process.uptime();

	tempJobTimings = this.timings[jobName];

	if (!tempJobTimings) {
		console.log("Job '" + jobName + "' did not have a startTiming call!!!!!");
	}

	tempJobTimings[tempJobTimings.length - 1].endTime = time;
};

TimingRecorder.prototype.printTimings = function () {
	var tempTimingsForJob,
		jobAverage,
		that = this;

	if (!this.turnOffTimings) {
		return;
	}

	Object.keys(this.timings).forEach(function (key) {
		jobAverage = 0;
		console.log("Timings for job '" + key + "'");

		tempTimingsForJob = that.timings[key];
		console.log(tempTimingsForJob.length + " recordings where made");

		tempTimingsForJob.forEach(function (timing, index) {
			console.log((index + 1) + ": " + ((timing.endTime - timing.startTime) / 1000) + "s");
			jobAverage += (timing.endTime - timing.startTime);
		});

		console.log("For a total time spent of: " + jobAverage / 1000 + "s");

		jobAverage = jobAverage / tempTimingsForJob.length;

		console.log("For an average time spent of: " + jobAverage / 1000 + "s");
	});
};
