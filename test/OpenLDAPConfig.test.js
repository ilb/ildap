import { readFileSync } from 'fs';
import OpenLDAPConfig from '../src/OpenLDAPConfig';
import * as path from 'path';

const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));

const ldapConfPathUnc = path.resolve('test/unconfiguredldap.conf');

const ldapConfigUnc = new OpenLDAPConfig(readFileSync(ldapConfPathUnc, 'utf8'));

const expectedConfig = {
  BASE: 'dc=iconicompany,dc=com',
  TLS_CACERT: 'test/openldap/certs/ca.crt',
  URI: 'ldapi:/// ldap://localhost:1389'
};

test('parseConfig', () => {
  expect(OpenLDAPConfig.parseConfig(readFileSync(ldapConfPath, 'utf8'))).toStrictEqual(
    expectedConfig
  );
});

const expectedUri = ['ldap://localhost:1389'];

test('uri', () => {
  expect(ldapConfig.uri).toStrictEqual(expectedUri);
});

test('base', () => {
  expect(ldapConfig.base).toBe('dc=iconicompany,dc=com');
});

test('caCert', () => {
  expect(ldapConfig.caCert).toBe('test/openldap/certs/ca.crt');
});

test('isConfigured', () => {
  expect(ldapConfig.isConfigured()).toBe(true);
});

test('isUnConfigured', () => {
  expect(ldapConfigUnc.isConfigured()).toBe(false);
});
