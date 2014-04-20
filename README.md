# connect-access

Access controls (ACLs) by location as a Connect middleware.

## Installation
```
$ npm install connect-access
```

## Basic Usage

```javascript
access(String path, Array rules)
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

## ACLs
There are 2 ways to declare a list of acls.
* Explicitly allow an IP/CIDR
* Explicitly disallow an IP/CIDR

To allow or disallow, the ip rule is prefixed with a `+` or `-`. If no qualifier is specified, it's allowed to `allow`.

### Example Rules

```javascript
'all'          // Allow everything
'127.0.0.1'    // Allow just 127.0.0.1
'10.0.0.0/8'   // Allow a CIDR range
'-127.0.0.1'   // Disallow 127.0.0.1
'-10.0.0.0/8'  // Disallow a CIDR range
'-all'         // Disallow everything
```
