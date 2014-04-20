var pathRegexp = require('path-to-regexp');
var Netmask = require('netmask').Netmask;


module.exports = function accessControl(path, rules) {
  var regexp = pathRegexp(path);
  rules = (rules || []).map(makeRule);

  return function(req, res, next) {
    if (!req.url.match(regexp)) {
      next();
      return;
    }

    if (!checkIP(req.connection.remoteAddress, rules)) {
      res.statusCode = 403;
      res.end('Forbidden\n');
      return;
    }

    next();
  }
};


function makeRule(rule) {
  var allowed = true,
      bit = rule.substr(0, 1);

  // Check if there's a prefix bit to explicitly allow/deny
  if (bit === '+' || bit === '-') {
    allowed = bit === '+';
    rule = rule.substr(1);
  }

  // Trim whitespace
  rule = rule.replace(/^\s+|\s+$/g, '');

  // Special case "all"
  if (rule === 'all') {
    netmask = rule;
  } else {
    netmask = new Netmask(rule);
  }

  return {
    allowed: allowed,
    netmask: netmask
  };
}


function checkIP(ip, rules) {
  var i = 0,
      length = rules.length;

  for (; i < length; i++) {
    var rule = rules[i],
        netmask = rule.netmask,
        allowed = rule.allowed;

    if (netmask === 'all' || netmask.contains(ip)) {
      return allowed;
    }
  };

  // If it doesn't match anything, assume '+all';
  return true;
}
