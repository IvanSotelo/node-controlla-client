# JavaScript JIRA API for node.js #

A node.js module, which provides an object oriented wrapper for the Controlla Rest API.

[![Documentation](https://img.shields.io/badge/Documentation--green.svg)]()
[![Controlla Rest API](https://img.shields.io/badge/Jira%20Rest%20API--green.svg)]()
[![Run tests](https://github.com/controlla/node-controlla-client/workflows/Run%20tests/badge.svg)]()
[![npm](https://img.shields.io/npm/v/controlla-client.svg)](https://www.npmjs.com/package/controlla-client)
[![Downloads](https://img.shields.io/npm/dm/controlla-client.svg)](https://npmjs.com/controlla-client)
[![Install Size](https://packagephobia.now.sh/badge?p=controlla-client)](https://packagephobia.now.sh/result?p=controlla-client)
[![dependency Status](https://david-dm.org/controlla/node-controlla-client/status.svg)](https://david-dm.org/controlla/node-controlla-client)
[![devDependency Status](https://david-dm.org/controlla/node-controlla-client/dev-status.svg)](https://david-dm.org/controlla/node-controlla-client?type=dev)

## Installation ##

Install with the node package manager [npm](http://npmjs.org):

```shell
$ npm install controlla-client
```

## Examples ##

### Create the Controlla client ###

```javascript
// With ES5
var ControllaApi = require('controlla-client');

// With ES6
import ControllaApi from 'controlla-client';

// Initialize
var controlla = new ControllaApi({
  protocol: 'https',
  host: 'controlla.somehost.com',
  username: 'username',
  password: 'password',
  apiVersion: '2',
  strictSSL: true
});
```

## Documentation ##
Can't find what you need in the readme?  Check out our documentation here:
