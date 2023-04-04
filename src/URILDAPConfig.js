import LDAPConfig from './LDAPConfig.js';

/**
 * Configure LDAP from URI
 * example: ldaps://devel.net.ilb.ru/c=ru
 */
export default class URILDAPConfig extends LDAPConfig {
  constructor(uri, caCert) {
    super();
    const urlobj = new URL(uri);
    this.base = urlobj.pathname.substring(1);
    urlobj.pathname = '';
    this.uri = [urlobj.toString()];
    this.caCert = caCert;
  }
}
