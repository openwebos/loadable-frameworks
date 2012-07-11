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
// REVIEWED: Erik Jaesler 2012-01-12

/*jslint laxbreak: true, white: false, browser: true */

/*global console, MojoLoader */

console.log("Loading timezone-manager mock");

var fm = MojoLoader.require({name: "foundations.mock", version: "1.0"})["foundations.mock"];

var timeMachine = new Date();
var tzOffset = timeMachine.getTimezoneOffset();

var getSystemTimeResult = {
	"utc": Math.floor(timeMachine.getTime() / 1000),
	"localtime": {
		"year": timeMachine.getFullYear(),
		"month": timeMachine.getMonth(),
		"day": timeMachine.getDate(),
		"hour": timeMachine.getHours(),
		"minutes": timeMachine.getMinutes(),
		"second": timeMachine.getSeconds()
	},
    "offset": tzOffset ? -480 : 0,
    "timezone": tzOffset ? "America\/Los_Angeles" : "UTC",
    "TZ": tzOffset ? "PST" : "UTC",
    "timeZoneFile": "\/var\/luna\/preferences\/localtime",
    "NITZValid": true
};

fm.PalmCallCollection.addItem("palm://com.palm.systemservice", {
	method: "time/getSystemTime",
	rules: [{
		result: getSystemTimeResult
	}]
});

fm.PalmCallCollection.addItem("palm://com.palm.systemservice/", {
	method: "time/getSystemTime",
	rules: [{
		result: getSystemTimeResult
	}]
});

/*
	NOTE: In the distant year of 2021, this table will need to be updated with
	further entries.  Assuming everything still works the way it does at this
	time, you'll need to novaterm into a device or emulator and run luna-send
	with palm://com.palm.systemservice/timezone/getTimeZoneRules and an array
	of timezone/year pairs, e.g.: {"tz":"America/Chicago", "years":[2026,...]}.
	The full invocation for an additional two years for Chicago:

	`luna-send -n 1 -a com.palm.configurator palm://com.palm.systemservice/timezone/getTimeZoneRules '[{"tz":"America/Chicago","years":[2026,2027]}]'`

	Add years to the "years" array as desired, and additional timezone/year
	pairs for each of the timezones used below.  Append the results to the
	maps below and you should be good to go.
 */

var bigTzTable = {
	"America/Chicago": {
		"1986": { "tz": "America\/Chicago", "year": 1986, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 514972800, "dstEnd": 530694000 },
		"1987": { "tz": "America\/Chicago", "year": 1987, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 544608000, "dstEnd": 562143600 },
		"2006": { "tz": "America\/Chicago", "year": 2006, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1143964800, "dstEnd": 1162105200 },
		"2007": { "tz": "America\/Chicago", "year": 2007, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1173600000, "dstEnd": 1194159600 },
		"2008": { "tz": "America\/Chicago", "year": 2008, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1205049600, "dstEnd": 1225609200 },
		"2009": { "tz": "America\/Chicago", "year": 2009, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1236499200, "dstEnd": 1257058800 },
		"2010": { "tz": "America\/Chicago", "year": 2010, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1268553600, "dstEnd": 1289113200 },
		"2011": { "tz": "America\/Chicago", "year": 2011, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1300003200, "dstEnd": 1320562800 },
		"2012": { "tz": "America\/Chicago", "year": 2012, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1331452800, "dstEnd": 1352012400 },
		"2013": { "tz": "America\/Chicago", "year": 2013, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1362902400, "dstEnd": 1383462000 },
		"2014": { "tz": "America\/Chicago", "year": 2014, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1394352000, "dstEnd": 1414911600 },
		"2015": { "tz": "America\/Chicago", "year": 2015, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1425801600, "dstEnd": 1446361200 },
		"2016": { "tz": "America\/Chicago", "year": 2016, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1457856000, "dstEnd": 1478415600 },
		"2017": { "tz": "America\/Chicago", "year": 2017, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1489305600, "dstEnd": 1509865200 },
		"2018": { "tz": "America\/Chicago", "year": 2018, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1520755200, "dstEnd": 1541314800 },
		"2019": { "tz": "America\/Chicago", "year": 2019, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1552204800, "dstEnd": 1572764400 },
		"2020": { "tz": "America\/Chicago", "year": 2020, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1583654400, "dstEnd": 1604214000 },
		"2021": { "tz": "America\/Chicago", "year": 2021, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1615708800, "dstEnd": 1636268400 },
		"2022": { "tz": "America\/Chicago", "year": 2022, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1647158400, "dstEnd": 1667718000 },
		"2023": { "tz": "America\/Chicago", "year": 2023, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1678608000, "dstEnd": 1699167600 },
		"2024": { "tz": "America\/Chicago", "year": 2024, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1710057600, "dstEnd": 1730617200 },
		"2025": { "tz": "America\/Chicago", "year": 2025, "hasDstChange": true, "utcOffset": -21600, "dstOffset": -18000, "dstStart": 1741507200, "dstEnd": 1762066800 }
	},
	"America/Los_Angeles": {
		"2006": { "tz": "America\/Los_Angeles", "year": 2006, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1143972000, "dstEnd": 1162112400 },
		"2007": { "tz": "America\/Los_Angeles", "year": 2007, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1173607200, "dstEnd": 1194166800 },
		"2008": { "tz": "America\/Los_Angeles", "year": 2008, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1205056800, "dstEnd": 1225616400 },
		"2009": { "tz": "America\/Los_Angeles", "year": 2009, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1236506400, "dstEnd": 1257066000 },
		"2010": { "tz": "America\/Los_Angeles", "year": 2010, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1268560800, "dstEnd": 1289120400 },
		"2011": { "tz": "America\/Los_Angeles", "year": 2011, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1300010400, "dstEnd": 1320570000 },
		"2012": { "tz": "America\/Los_Angeles", "year": 2012, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1331460000, "dstEnd": 1352019600 },
		"2013": { "tz": "America\/Los_Angeles", "year": 2013, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1362909600, "dstEnd": 1383469200 },
		"2014": { "tz": "America\/Los_Angeles", "year": 2014, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1394359200, "dstEnd": 1414918800 },
		"2015": { "tz": "America\/Los_Angeles", "year": 2015, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1425808800, "dstEnd": 1446368400 },
		"2016": { "tz": "America\/Los_Angeles", "year": 2016, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1457863200, "dstEnd": 1478422800 },
		"2017": { "tz": "America\/Los_Angeles", "year": 2017, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1489312800, "dstEnd": 1509872400 },
		"2018": { "tz": "America\/Los_Angeles", "year": 2018, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1520762400, "dstEnd": 1541322000 },
		"2019": { "tz": "America\/Los_Angeles", "year": 2019, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1552212000, "dstEnd": 1572771600 },
		"2020": { "tz": "America\/Los_Angeles", "year": 2020, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1583661600, "dstEnd": 1604221200 },
		"2021": { "tz": "America\/Los_Angeles", "year": 2021, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1615716000, "dstEnd": 1636275600 },
		"2022": { "tz": "America\/Los_Angeles", "year": 2022, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1647165600, "dstEnd": 1667725200 },
		"2023": { "tz": "America\/Los_Angeles", "year": 2023, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1678615200, "dstEnd": 1699174800 },
		"2024": { "tz": "America\/Los_Angeles", "year": 2024, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1710064800, "dstEnd": 1730624400 },
		"2025": { "tz": "America\/Los_Angeles", "year": 2025, "hasDstChange": true, "utcOffset": -28800, "dstOffset": -25200, "dstStart": 1741514400, "dstEnd": 1762074000 }
	},
	"America/New_York": {
		"1986": { "tz": "America\/New_York", "year": 1986, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 514969200, "dstEnd": 530690400 },
		"1987": { "tz": "America\/New_York", "year": 1987, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 544604400, "dstEnd": 562140000 },
		"2006": { "tz": "America\/New_York", "year": 2006, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1143961200, "dstEnd": 1162101600 },
		"2007": { "tz": "America\/New_York", "year": 2007, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1173596400, "dstEnd": 1194156000 },
		"2008": { "tz": "America\/New_York", "year": 2008, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1205046000, "dstEnd": 1225605600 },
		"2009": { "tz": "America\/New_York", "year": 2009, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1236495600, "dstEnd": 1257055200 },
		"2010": { "tz": "America\/New_York", "year": 2010, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1268550000, "dstEnd": 1289109600 },
		"2011": { "tz": "America\/New_York", "year": 2011, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1299999600, "dstEnd": 1320559200 },
		"2012": { "tz": "America\/New_York", "year": 2012, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1331449200, "dstEnd": 1352008800 },
		"2013": { "tz": "America\/New_York", "year": 2013, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1362898800, "dstEnd": 1383458400 },
		"2014": { "tz": "America\/New_York", "year": 2014, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1394348400, "dstEnd": 1414908000 },
		"2015": { "tz": "America\/New_York", "year": 2015, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1425798000, "dstEnd": 1446357600 },
		"2016": { "tz": "America\/New_York", "year": 2016, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1457852400, "dstEnd": 1478412000 },
		"2017": { "tz": "America\/New_York", "year": 2017, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1489302000, "dstEnd": 1509861600 },
		"2018": { "tz": "America\/New_York", "year": 2018, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1520751600, "dstEnd": 1541311200 },
		"2019": { "tz": "America\/New_York", "year": 2019, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1552201200, "dstEnd": 1572760800 },
		"2020": { "tz": "America\/New_York", "year": 2020, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1583650800, "dstEnd": 1604210400 },
		"2021": { "tz": "America\/New_York", "year": 2021, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1615705200, "dstEnd": 1636264800 },
		"2022": { "tz": "America\/New_York", "year": 2022, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1647154800, "dstEnd": 1667714400 },
		"2023": { "tz": "America\/New_York", "year": 2023, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1678604400, "dstEnd": 1699164000 },
		"2024": { "tz": "America\/New_York", "year": 2024, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1710054000, "dstEnd": 1730613600 },
		"2025": { "tz": "America\/New_York", "year": 2025, "hasDstChange": true, "utcOffset": -18000, "dstOffset": -14400, "dstStart": 1741503600, "dstEnd": 1762063200 }
	},
	"Asia/Kabul": {
		"2006": { "tz": "Asia\/Kabul", "year": 2006, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2007": { "tz": "Asia\/Kabul", "year": 2007, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2008": { "tz": "Asia\/Kabul", "year": 2008, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2009": { "tz": "Asia\/Kabul", "year": 2009, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2010": { "tz": "Asia\/Kabul", "year": 2010, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2011": { "tz": "Asia\/Kabul", "year": 2011, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2012": { "tz": "Asia\/Kabul", "year": 2012, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2013": { "tz": "Asia\/Kabul", "year": 2013, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2014": { "tz": "Asia\/Kabul", "year": 2014, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2015": { "tz": "Asia\/Kabul", "year": 2015, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2016": { "tz": "Asia\/Kabul", "year": 2016, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2017": { "tz": "Asia\/Kabul", "year": 2017, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2018": { "tz": "Asia\/Kabul", "year": 2018, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2019": { "tz": "Asia\/Kabul", "year": 2019, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2020": { "tz": "Asia\/Kabul", "year": 2020, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2021": { "tz": "Asia\/Kabul", "year": 2021, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2022": { "tz": "Asia\/Kabul", "year": 2022, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2023": { "tz": "Asia\/Kabul", "year": 2023, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2024": { "tz": "Asia\/Kabul", "year": 2024, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2025": { "tz": "Asia\/Kabul", "year": 2025, "hasDstChange": false, "utcOffset": 16200, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 }
	},
	"Europe/London": {
		"2006": { "tz": "Europe\/London", "year": 2006, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1143334800, "dstEnd": 1162083600 },
		"2007": { "tz": "Europe\/London", "year": 2007, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1174784400, "dstEnd": 1193533200 },
		"2008": { "tz": "Europe\/London", "year": 2008, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1206838800, "dstEnd": 1224982800 },
		"2009": { "tz": "Europe\/London", "year": 2009, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1238288400, "dstEnd": 1256432400 },
		"2010": { "tz": "Europe\/London", "year": 2010, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1269738000, "dstEnd": 1288486800 },
		"2011": { "tz": "Europe\/London", "year": 2011, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1301187600, "dstEnd": 1319936400 },
		"2012": { "tz": "Europe\/London", "year": 2012, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1332637200, "dstEnd": 1351386000 },
		"2013": { "tz": "Europe\/London", "year": 2013, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1364691600, "dstEnd": 1382835600 },
		"2014": { "tz": "Europe\/London", "year": 2014, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1396141200, "dstEnd": 1414285200 },
		"2015": { "tz": "Europe\/London", "year": 2015, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1427590800, "dstEnd": 1445734800 },
		"2016": { "tz": "Europe\/London", "year": 2016, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1459040400, "dstEnd": 1477789200 },
		"2017": { "tz": "Europe\/London", "year": 2017, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1490490000, "dstEnd": 1509238800 },
		"2018": { "tz": "Europe\/London", "year": 2018, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1521939600, "dstEnd": 1540688400 },
		"2019": { "tz": "Europe\/London", "year": 2019, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1553994000, "dstEnd": 1572138000 },
		"2020": { "tz": "Europe\/London", "year": 2020, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1585443600, "dstEnd": 1603587600 },
		"2021": { "tz": "Europe\/London", "year": 2021, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1616893200, "dstEnd": 1635642000 },
		"2022": { "tz": "Europe\/London", "year": 2022, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1648342800, "dstEnd": 1667091600 },
		"2023": { "tz": "Europe\/London", "year": 2023, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1679792400, "dstEnd": 1698541200 },
		"2024": { "tz": "Europe\/London", "year": 2024, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1711846800, "dstEnd": 1729990800 },
		"2025": { "tz": "Europe\/London", "year": 2025, "hasDstChange": true, "utcOffset": 0, "dstOffset": 3600, "dstStart": 1743296400, "dstEnd": 1761440400 }
	},
	"Pacific/Honolulu": {
		"2006": { "tz": "Pacific\/Honolulu", "year": 2006, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2007": { "tz": "Pacific\/Honolulu", "year": 2007, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2008": { "tz": "Pacific\/Honolulu", "year": 2008, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2009": { "tz": "Pacific\/Honolulu", "year": 2009, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2010": { "tz": "Pacific\/Honolulu", "year": 2010, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2011": { "tz": "Pacific\/Honolulu", "year": 2011, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2012": { "tz": "Pacific\/Honolulu", "year": 2012, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2013": { "tz": "Pacific\/Honolulu", "year": 2013, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2014": { "tz": "Pacific\/Honolulu", "year": 2014, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2015": { "tz": "Pacific\/Honolulu", "year": 2015, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2016": { "tz": "Pacific\/Honolulu", "year": 2016, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2017": { "tz": "Pacific\/Honolulu", "year": 2017, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2018": { "tz": "Pacific\/Honolulu", "year": 2018, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2019": { "tz": "Pacific\/Honolulu", "year": 2019, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2020": { "tz": "Pacific\/Honolulu", "year": 2020, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2021": { "tz": "Pacific\/Honolulu", "year": 2021, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2022": { "tz": "Pacific\/Honolulu", "year": 2022, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2023": { "tz": "Pacific\/Honolulu", "year": 2023, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2024": { "tz": "Pacific\/Honolulu", "year": 2024, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2025": { "tz": "Pacific\/Honolulu", "year": 2025, "hasDstChange": false, "utcOffset": -36000, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 }
	},
	"Pacific/Niue": {
		"2006": { "tz": "Pacific\/Niue", "year": 2006, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2007": { "tz": "Pacific\/Niue", "year": 2007, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2008": { "tz": "Pacific\/Niue", "year": 2008, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2009": { "tz": "Pacific\/Niue", "year": 2009, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2010": { "tz": "Pacific\/Niue", "year": 2010, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2011": { "tz": "Pacific\/Niue", "year": 2011, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2012": { "tz": "Pacific\/Niue", "year": 2012, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2013": { "tz": "Pacific\/Niue", "year": 2013, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2014": { "tz": "Pacific\/Niue", "year": 2014, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2015": { "tz": "Pacific\/Niue", "year": 2015, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2016": { "tz": "Pacific\/Niue", "year": 2016, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2017": { "tz": "Pacific\/Niue", "year": 2017, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2018": { "tz": "Pacific\/Niue", "year": 2018, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2019": { "tz": "Pacific\/Niue", "year": 2019, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2020": { "tz": "Pacific\/Niue", "year": 2020, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2021": { "tz": "Pacific\/Niue", "year": 2021, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2022": { "tz": "Pacific\/Niue", "year": 2022, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2023": { "tz": "Pacific\/Niue", "year": 2023, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2024": { "tz": "Pacific\/Niue", "year": 2024, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2025": { "tz": "Pacific\/Niue", "year": 2025, "hasDstChange": false, "utcOffset": -39600, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 }
	},
	"UTC": {
		"2006": { "tz": "UTC", "year": 2006, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2007": { "tz": "UTC", "year": 2007, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2008": { "tz": "UTC", "year": 2008, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2009": { "tz": "UTC", "year": 2009, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2010": { "tz": "UTC", "year": 2010, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2011": { "tz": "UTC", "year": 2011, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2012": { "tz": "UTC", "year": 2012, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2013": { "tz": "UTC", "year": 2013, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2014": { "tz": "UTC", "year": 2014, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2015": { "tz": "UTC", "year": 2015, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2016": { "tz": "UTC", "year": 2016, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2017": { "tz": "UTC", "year": 2017, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2018": { "tz": "UTC", "year": 2018, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2019": { "tz": "UTC", "year": 2019, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2020": { "tz": "UTC", "year": 2020, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2021": { "tz": "UTC", "year": 2021, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2022": { "tz": "UTC", "year": 2022, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2023": { "tz": "UTC", "year": 2023, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2024": { "tz": "UTC", "year": 2024, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 },
		"2025": { "tz": "UTC", "year": 2025, "hasDstChange": false, "utcOffset": 0, "dstOffset": -1, "dstStart": -1, "dstEnd": -1 }
	}
};
function bigTzTest(context, data) {
	// Each request for timezone information is formatted as {"tz": "Continent/City", "years": [array, of, four, digit, years]}.  Example:
	//		{"tz":"America/New_York","years":[2010,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016]}
	if (typeof data === "string") {
		data = JSON.parse(data);
	}

	var i, j,
		dataLen = data.length,
		tz,
		tzInfo,
		tzInfoLen,
		year,
		years,
		yearsLen,
		yearInfo,
		result = {
			returnValue: true,
			results: []
		};

	for (i = 0; i < dataLen; ++i) {
		tz = data[i].tz;
		tzInfo = bigTzTable[tz];
		tzInfoLen = tzInfo.length;
		years = data[i].years;
		yearsLen = years.length;
		for (j = 0; j < yearsLen; ++j) {
			year = years[j];
			result.results.push(tzInfo[year]);
		}
	}

	// this._result = result;
	this.parsedResult = result;
	return true;
}

var bigTzRule = new fm.PalmCallRule(bigTzTest);

fm.PalmCallCollection.addItem("palm://com.palm.systemservice/timezone/", {
	method: "getTimeZoneRules",
	rules: [{
		test: bigTzTest
	}]
});
