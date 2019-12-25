import OpenLDAPConfig from '../OpenLDAPConfig';
import * as path from 'path';

const fs = require('fs');
const ldapConfPath = path.resolve('src/__tests__/ldap.conf');

const ldapConfig = new OpenLDAPConfig(fs.readFileSync(ldapConfPath, 'utf8'));

const expectedConfig = {BASE: 'dc=example,dc=com',
    TLS_CACERT: "/etc/ssl/certs/ourCAbundle.crt",
    URI: 'ldapi:/// ldaps://devel.net.ilb.ru ldaps://ldap.net.ilb.ru ldaps://ldap2.net.ilb.ru'};

test('parseConfig', () => {
    expect(OpenLDAPConfig.parseConfig(fs.readFileSync(ldapConfPath, 'utf8'))).toStrictEqual(expectedConfig);
});


const expectedUri = ['ldaps://devel.net.ilb.ru', 'ldaps://ldap.net.ilb.ru', 'ldaps://ldap2.net.ilb.ru'];

test('getUri', () => {
    expect(ldapConfig.getUri()).toStrictEqual(expectedUri);
});


test('getBase', () => {
    expect(ldapConfig.getBase()).toBe('dc=example,dc=com');
});

test('getCaCert', () => {
    expect(ldapConfig.getCaCert()).toBe('/etc/ssl/certs/ourCAbundle.crt');
});
