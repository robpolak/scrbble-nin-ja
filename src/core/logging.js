var Logger = require('bunyan');
var path = require('path');
var logPath = path.join(__dirname,'..','..','/logs/').toString();
var log = new Logger.createLogger(
  {
    name: 'logger',
    streams: [
      {
        level: 'trace',
        stream: process.stdout
      }
      /*{
       level: 'debug',
       path: logPath + '/debug.log'  // log ERROR and above to a file
       },
       {
       level: 'error',
       path: logPath + '/error.log'  // log ERROR and above to a file
       }*/
    ]
  });

if(!global._log){
  global._log = [];
}
if(!global._traceLog){
  global._traceLog = [];
}

module.exports = function() {

  function getLogger() {
    return log;
  }
  function requestLogger(request, response, next) {
    var obj = {
      req_id: request.req_id,
      url: request.url,
      body: request.body || {},
      method: request.method,
      clientIp : request.clientIp,
      headers: request.headers || {},
      params : request.params || {},
      query: request.query || {},
      time: new Date()
    };

    //log.trace(obj, 'REQUEST');
    next();
  }
  function responseLogger(request, response, statusCode, responseObject) {
    var obj = {
      req_id: request.req_id,
      status: statusCode,
      time: new Date()
    };
    //log.trace(obj, 'RESPONSE');
  }

  function logTrace(str,obj) {
    var aLog = {string:str,object:obj,time: new Date()};
    if(global._traceLog.length > 5000){
      global._traceLog.shift();
    }
    global._traceLog.push(aLog);
    log.trace(obj, str);
  }

  function logError(str,obj) {
    //todo : write this to memory .. global._log.push(str, obj);
    var err = {string:str,object:obj, time: new Date()};
    if(global._log.length > 5000){
      global._log.shift();
    }
    global._log.push(err);
    log.error(obj||{}, str);
  }


  return{
    getLogger: getLogger,
    requestLogger:requestLogger,
    responseLogger:responseLogger,
    logTrace: logTrace,
    logError: logError
  }
}();