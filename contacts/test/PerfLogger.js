/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global console, JSON, Class*/

var PerfLogger = Class.create({
	initialize: function () {
		if (!PerfLogger.isEnabled) {
			return;
		}
			
		this.isEnabled = true;
		this.milestones = [];
	},
	
	milestone: function (message, printNow) {
		if (!PerfLogger.isEnabled || !this.isEnabled) {
			return;
		}
		
		this.start = (this.start || Date.now());
		
		var last = this.milestones[this.milestones.length - 1],
			newest = {
				title: message,
				time: Date.now()
			};
		if (last) {
			newest.elapsed = newest.time - last.time;
			if (printNow) {
				this.log("*** PERF: Time Since " + last.title + " is " + newest.elapsed);
			}
		} else {
			if (printNow) {
				this.log("*** PERF: Starting Perf: " + message);
			}
		}
		this.milestones.push(newest);
		
	},
	
	printCulumlative: function () {
		if (!PerfLogger.isEnabled || !this.isEnabled) {
			return;
		}
		
		var total = (Date.now() - this.start),
			i,
			last = null,
			output = "***PERF Summary:\n",
			m,
			percent;
		for (i = 0; i < this.milestones.length; i = i + 1) {
			m = this.milestones[i];
			percent = Math.round(m.elapsed * 10000 / total) / 100;
			if (last) {
				output = output + m.elapsed + "ms / " + percent + "% from " + last.title + " TO " + m.title + "\n";
			}
			last = m;
		}
		this.log(output);
//		this.log("*** PERF *** Here are your milestones in JSON");
//		this.log(JSON.stringify(this.milestones));
//		this.log("*** PERF ***");
	},
	
	printPairs: function () {
		if (!PerfLogger.isEnabled || !this.isEnabled) {
			return;
		}
			
		var output = "***PERF Summary:\n",
			i,
			index = 0,
			current = 0,
			next = 0;
		for (i = 0; i < this.milestones.length; i = i + 1) {
			index = i * 2;	
			if (index < this.milestones.length - 1) {
				current = this.milestones[index];
				next = this.milestones[(index + 1)];
				output = output + (next.time - current.time) + "ms - " + current.title + "\n";
			}
		}
		this.log(output);
	},
	
	purge: function () {
		if (this.milestones) {
			this.milestones.clear();
		}
	},
	
	terminate: function () {
		this.isEnabled = false;
	},
	
	log: function (str) {
		console.log(str);
	}
});

PerfLogger.isEnabled = true;
