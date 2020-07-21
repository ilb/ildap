# LDAP client wrapper

Based on https://github.com/zont/ldapjs-client

Example usage

```javascript

import LDAPFactory from '@ilb/node_ldap';
const ldapFactory = new LDAPFactory();

const ldapResource = await ldapFactory.getLDAPResource();
const resourceUrl = await ldapResource.lookup('ru.bystrobank.apps.testapp.db');
```

## Update deps

npm i --save-dev @babel/core @babel/cli @babel/plugin-transform-runtime @babel/preset-env babel-jest jest regenerator-runtime
npm i @babel/runtime