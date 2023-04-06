# LDAP client wrapper

Based on https://github.com/zont/ldapjs-client

Example usage

```javascript

import LDAPFactory from 'ildap';
const ldapFactory = new LDAPFactory();

const ldapResource = await ldapFactory.getLDAPResource();
const resourceUrl = await ldapResource.lookup('com.iconicompany.apps.testapp.db');
```
