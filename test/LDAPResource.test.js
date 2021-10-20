import { readFileSync } from 'fs';
import OpenLDAPConfig from '../src/OpenLDAPConfig';
import LDAPClientConfig from '../src/LDAPClientConfig';
import LDAPClientFactory from '../src/LDAPClientFactory';
import LDAPResource from '../src/LDAPResource';
import * as path from 'path';

const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
const ldapClientFactory = new LDAPClientFactory();

const expected = 'mysql://develdb.net.ilb.ru/testapp';

test('search', async () => {
  const ldapClient = ldapClientFactory.getLDAPClient(new LDAPClientConfig(ldapConfig));
  const ldapResource = new LDAPResource(ldapClient);
  const resourceUrl = await ldapResource.lookup('ru.bystrobank.apps.testapp.db', 'c=ru');
  expect(resourceUrl).toBe(expected);

  ldapClientFactory.close();
});
