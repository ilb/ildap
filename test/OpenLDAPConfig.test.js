const path = require('path');
const { readFileSync } = require('fs');
const OpenLDAPConfig = require('../src/OpenLDAPConfig.js');

const ldapConfPath = path.resolve('test/ldap.conf');

const ldapConfig = new OpenLDAPConfig(readFileSync(ldapConfPath, 'utf8'));

const ldapConfPathUnc = path.resolve('test/unconfiguredldap.conf');

const ldapConfigUnc = new OpenLDAPConfig(readFileSync(ldapConfPathUnc, 'utf8'));

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
