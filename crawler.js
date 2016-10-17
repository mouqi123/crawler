var logger = require('./logger')('app');
var gData = require('./globalData');
var app = require('./app');
var fs = require('fs');
var url = require('url');

function baseURL(s) {
	var len = s.length;
	if (s[len-1] == '/') return s;
	else {
		var i = s.lastIndexOf("/");
		return s.substring(0, i+1);
	}
}

function crawl (data, context) {

	var base = baseURL(context);
	var regURL = /a href=\"(.*?)\"[\s+|>]/g;
	var result;

	//regSite is a filter, it can filter outside href.
	var regSite =new RegExp(gData.config.serverReg, "i");

	while ((result = regURL.exec(data)) != null){
		var hostcontext = result[1].trim();

		if (hostcontext + '/' == base || hostcontext == "" || hostcontext =="/") continue;
		if (hostcontext[0] == '#' || hostcontext[0] =="." || hostcontext.indexOf("mailto") == 0 || hostcontext.indexOf("javascript") == 0) continue;

		if (hostcontext.indexOf("http") != 0) {
			if (hostcontext[0] == '/')
				hostcontext = hostcontext.substring(1);
			hostcontext = base + hostcontext;
		}
		if (!regSite.test(hostcontext) ) continue;
		if (gData.urlList.indexOf(hostcontext) != -1) continue;
		else gData.urlList.push(hostcontext); 

		//logger.info("Matched " + result[1] + " ,and url is " + hostcontext);
	}

	logger.info("counter is : "+ gData.counter + ", and urlList' length is "+ gData.urlList.length);

	if (gData.counter == gData.urlList.length) return ;
	else {
		var urln = url.parse(gData.urlList[gData.counter++]);
		setTimeout(delayExe, 5);
		
		function delayExe() {
			app.start(urln);
		} 
	}
}


module.exports.crawl = crawl;