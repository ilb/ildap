import * as path from 'path';
import { readFileSync } from 'fs';
import OpenLDAPConfig from '../src/OpenLDAPConfig';
import LDAPClientConfig from '../src/LDAPClientConfig';
import LDAPClientFactory from '../src/LDAPClientFactory';
import CacheableLDAPResource from '../src/CacheableLDAPResource';

const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
const ldapClientFactory = new LDAPClientFactory();

const expected = 'mysql://localhost/testapp';

test('getInstance', async () => {
  const ldapClient = ldapClientFactory.getLDAPClient(new LDAPClientConfig(ldapConfig));
  let ldapResource = await CacheableLDAPResource.getInstance(ldapClient);

  let resourceUrl = await ldapResource.lookup(
    'com.iconicompany.apps.testapp.db',
    'dc=iconicompany,dc=com'
  );

  expect(resourceUrl).toBe(expected);

  expect(ldapResource.ldapResource.lookupCount).toBe(1);

  resourceUrl = await ldapResource.lookup(
    'com.iconicompany.apps.testapp.db',
    'dc=iconicompany,dc=com'
  );

  expect(resourceUrl).toBe(expected);

  // second call should be cached
  expect(ldapResource.ldapResource.lookupCount).toBe(1);

  resourceUrl = await ldapResource.lookup('ru.bystrobank.apps.bailverification.db', 'c=ru');

  expect(ldapResource.ldapResource.lookupCount).toBe(2);

  ldapClientFactory.close();
});
