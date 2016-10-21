var http = require("http");
var fs = require('fs');
var https = require("https");
var crawler = require('./crawler');
var logger = require('./logger')('app');
var gData = require('./globalData');
var url = require('url');
var async = require('async');

var config = JSON.parse(fs.readFileSync('./conf/server.json'));

gData.config = config;

var urlObj = url.parse(config.rootServer);

gData.rootServer = urlObj.href;
logger.info('starting crawl ', urlObj.href);

function httpRequest(href) {
	var req = http.get(href, res =>{
		res.setEncoding('utf8');
		var data;
		res.on('data', d => {
			data+=d;
		});
		res.on('end', () => {
			//logger.info('starting processing --------', href);
			crawler.crawl(data, href);
			//logger.info(href, ' processing have already succeeded');
		})
	});

	req.on('error', e => {
		logger.error('problem with request: ', e.message);
		var urln = url.parse(gData.urlList[gData.counter++]);
		start(urln);
	})
}

function httpsRequest(href) {
	var req = https.get(href, res =>{
		res.setEncoding('utf8');
		var data;
		res.on('data', d => {
			data+=d;
		});
		res.on('end', () => {
			//logger.info('starting processing ', href);
			crawler.crawl(data, href);
			//logger.info(href, ' processing have already succeeded');
		})
	})
	req.on('error', e => {
		logger.error('problem with request: ', e.message);
		var urln = url.parse(gData.urlList[gData.counter++]);
		start(urln);
	})
}

module.exports.httpRequest = httpRequest;
module.exports.httpsRequest = httpsRequest;

function start(urlObject) {
	if (urlObject.protocol == 'http:') {
		//httpRequest(urlObject.href);
		async.retry({times:15,interval: function(retryCount) {
			return 50*Math.pow(2, retryCount);
		}}, function(){
			httpRequest(urlObject.href);
		}, function (err, result) {
			logger.error(err.message);
			logger.error(urlObject.href + " request is failed, now try the next url");
			var urln = url.parse(gData.urlList[gData.counter++]);
			httpRequest(urln.href);
		});
	} else if (urlObject.protocol == 'https:') {
		//httpsRequest(urlObject.href);
		async.retry({times:15,interval:function(retryCount) {
			return 50*Math.pow(2, retryCount);
		}}, function(){
			httpsRequest(urlObject.href);
		}, function (err, result) {
			logger.error(err.message);
			logger.error(urlObject.href + " request is failed, now try the next url");
			var urln = url.parse(gData.urlList[gData.counter++]);
			httpsRequest(urln.href);
		});
	}
}

module.exports.start = start;

start(urlObj);
