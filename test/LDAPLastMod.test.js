import { readFileSync } from 'fs';
import OpenLDAPConfig from '../src/OpenLDAPConfig';
import LDAPClientConfig from '../src/LDAPClientConfig';
import LDAPClientFactory from '../src/LDAPClientFactory';
import LDAPLastMod from '../src/LDAPLastMod';
import * as path from 'path';

const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));
const ldapClientFactory = new LDAPClientFactory();

test('getLastMod', async () => {
  const ldapClient = ldapClientFactory.getLDAPClient(new LDAPClientConfig(ldapConfig));
  const ldapLastMod = new LDAPLastMod(ldapClient);
  const lmdt = await ldapLastMod.getLastMod();
  expect(lmdt === null || lmdt.getTime() !== null).toBe(true);
  ldapClientFactory.close();
});
