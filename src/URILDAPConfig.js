import { parse, format } from 'url';
import LDAPConfig from './LDAPConfig.js';

/**
 * Configure LDAP from URI
 * example: ldaps://devel.net.ilb.ru/c=ru
 */
export default class URILDAPConfig extends LDAPConfig {
  constructor(uri, caCert) {
    super();
    const urlobj = parse(uri);
    this.base = urlobj.pathname.substring(1);
    urlobj.pathname = null;
    this.uri = [format(urlobj)];
    this.caCert = caCert;
  }
}
