/**
 * Configure LDAP from URI
 * example: ldaps://devel.net.ilb.ru/c=ru
 */
function URILDAPConfig(uri, caCert) {
  const urlobj = new URL(uri);
  this.base = urlobj.pathname.substring(1);
  urlobj.pathname = '';
  this.uri = [urlobj.toString()];
  this.caCert = caCert;
}

/**
 * check if this instance if configured
 */
URILDAPConfig.prototype.isConfigured = function () {
  return this.uri && this.uri.length > 0;
};

module.exports = URILDAPConfig;
