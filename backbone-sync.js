//The MIT License (MIT)
//Copyright (c) 2013 Krivega Dmitriy http://krivega.com
//require https://github.com/Krivega/websocket

define([
  'jquery',
  'underscore',
  'backbone',
  'websocket'
], function($, _, Backbone,WSConstructor){
  
   var WS = new WSConstructor();
   Backbone.sync = function (method, model, options) {
    var params = _.extend({}, options);

    if (params.url) {
      params.url = _.result(params, 'url');
    } else {
      params.url = _.result(model, 'url') || urlError();
    }

    var cmd = params.url.split('/'),
         url = (cmd[0] !== '') ? cmd[0] : cmd[1]; // if leading slash, ignore

    if (!params.data && model) {
      params.data = params.attrs || model.toJSON(options) || {};
      if (params.data.length === 0) {
        params.data = {};
      }
    }
    if($.type(params.data) === 'array' && params.data.length === 1 && $.type(params.data[0]) === 'object'){
      params.data = params.data[0];
    }

    if (params.patch === true && params.data.id === null && model) {
      params.data.id = model.id;
    }

    // посылаем серверу
    WS.on(url, params.data, calbackOnMessage);
    
    var defer = $.Deferred();
    function calbackOnMessage(data) {
      if (data.error) {
        options.error(data.error);
      } else {
        options.success(data);
      }
    }

    var promise = defer.promise();
    return promise;
  };

// Throw an error when a URL is needed, and none is supplied.
  // Copy from backbone.js#1558
  var urlError = function () {
    throw new Error('A "url" property or function must be specified');
  };
  
  return Backbone.sync;
});
