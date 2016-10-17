var url = require('url');
var u = url.parse("https://www.bfsu.edu.cn/asdf?asfdsdf#123");
var s = u.href;
console.log(s);
var i = s.lastIndexOf("/");
s = s.substring(0, i);
//console.log(s);
//console.log("javascript:".indexOf("javascript"));

var a = "http://www.baidu.com";
var b = "http://www.baidu.com/123";
var c = "http://www.baidu.com/";

var m =url.parse(b);
console.log(m.href);
function isRootContext(s) {
	s = s.substring(10);
	var i = s.length;
	var x = s.indexOf("/");
	if (x == i-1 || x == -1) return true;
	else return false;
}

console.log(isRootContext(a));
console.log(isRootContext(b));
console.log(isRootContext(c));
