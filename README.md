# connect-access

Access controls (ACLs) by location as a Connect middleware. Inspired by nginx's [http_access_module](http://nginx.org/en/docs/http/ngx_http_access_module.html).

## Installation
```
$ npm install connect-access
```

## Basic Usage

```javascript
access(String path, Array rules, Function fail_callback)
```

```javascript
var access = require('connect-access');

var rules = [
    '192.168.1.1',  // Allow 192.168.1.1
    '10.0.0.0/8',   // Allow entire 10.0.0.0/8 range
    '127.0.0.1',    // Allow localhost
    '-all',         // block everyone else
];

var app = connect()
  .use(access('/private/*', rules))  // Lock down all of /private/* to the ACLs we declared
  .use(function(req, res, next) {
    res.end('Hello world');
  });
```

##Failure Callback
You may want to try a different authentication method if the ACL fails. Providing a callback allows you to try a different mechanism. The example below will always grant access if you are in the ACL, and if you are not, will only allow access on Tuesday.

```javascript
var access = require('connect-access');

var rules = [
    '192.168.1.1',  // Allow 192.168.1.1
    '10.0.0.0/8',   // Allow entire 10.0.0.0/8 range
    '127.0.0.1',    // Allow localhost
    '-all',         // block everyone else
];

function allow_on_tuesday(req, res, next) {
    if (new Date().getDay() === 2) {
        return next();
    }
    res.statusCode = 403;
    res.end('Forbidden\n');
    return;
}

var app = connect()
  .use(access('/private/*', rules, allow_on_tuesday)) 
  .use(function(req, res, next) {
    res.end('Hello world');
  });
```

## ACLs
There are 2 ways to declare a list of acls.
* Explicitly allow an IP/CIDR
* Explicitly disallow an IP/CIDR

To allow or disallow, the ip rule is prefixed with a `+` or `-`. If no qualifier is specified, it's assumed to `allow`.

Rules are executed first to last and ends when the first rule is matched. If no match is found, assumes allow everything.

### Example Rules

```javascript
'all'          // Allow everything
'127.0.0.1'    // Allow just 127.0.0.1
'10.0.0.0/8'   // Allow a CIDR range
'-127.0.0.1'   // Disallow 127.0.0.1
'-10.0.0.0/8'  // Disallow a CIDR range
'-all'         // Disallow everything
```
