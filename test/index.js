var http = require('http');
var assert = require('assert');
var accept = require('..');

// Generate a mock request object for our purposes
function request(url, ip) {
  var req = new http.IncomingMessage();
  req.url = url || '/';
  req.connection = req.connection || {};
  req.connection.remoteAddress = ip || '127.0.0.1';
  return req;
}

function response(req) {
  var res = new http.ServerResponse(req || request());
  return res;
}

describe('accept', function() {
  it('should accept everything with no rules', function(done) {
    var req = request();
    var next = function() { done(); }
    accept('/', [])(req, {}, next);
  });

  it('should accept if path doesn\'t match', function(done) {
    var req = request('/lol');
    var next = function() { done(); };
    accept('/', ['-all'])(req, {}, next);
  });

  it('should accept if explicitly allowed', function(done) {
    var req = request();
    var next = function() { done(); };
    accept('/', ['127.0.0.1', '-all'])(req, {}, next);
  });

  it('should accept with "all"', function(done) {
    var req = request();
    var next = function() { done(); };
    accept('/', ['all'])(req, {}, next);
  });

  it('should deny all', function() {
    var req = request('/', '192.168.1.1');
    var res = response();
    var next = function() { throw new Error('should not have called `next`!'); };
    accept('/', ['-all'])(req, res, next);
    assert.equal(res.statusCode, 403);
  });

  it('should deny explicit ip', function() {
    var req = request('/', '127.0.0.1');
    var res = response();
    var next = function() { throw new Error('should not have called `next`!'); };
    accept('/', ['-127.0.0.1'])(req, res, next);
    assert.equal(res.statusCode, 403);
  });
});
