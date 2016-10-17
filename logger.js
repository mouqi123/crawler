var log4js = require("log4js");

log4js.configure({
  appenders: [
    { type: 'console' },{
      type: 'file', 
      filename: 'logs/access.log', 
      maxLogSize: 1073741824,
      backups:4,
      category: 'app' 
    }
  ],
  replaceConsole: true
});

module.exports=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');
  return logger;
}