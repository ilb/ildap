export default function OpenLDAPConfig(config) {
  const ldapSchemasRegexp = /^ldaps?:\/\//;
  const configMap = parseConfig(config);
  this.uri = [];
  if (configMap.URI) {
    this.uri = configMap.URI.split(/\s+/).filter((l) => l.match(ldapSchemasRegexp));
  }
  this.base = configMap.BASE || null;
  this.caCert = configMap.TLS_CACERT || null;
}
/**
 * check if this instance if configured
 */
OpenLDAPConfig.prototype.isConfigured = function () {
  return this.uri && this.uri.length > 0;
};

export function parseConfig(config) {
  const alllines = config.split(/\r?\n/);
  const lines = alllines
    .map((l) => l.replace(/#.*$/, '').trim()) // remove comments and trim
    .filter((l) => l.length > 0); // skip empty lines
  //console.log(lines);
  const map = lines
    .map((l) => l.split(/\s(.*)/)) // split by first whitespace
    .reduce(function (map, obj) {
      map[obj[0]] = obj[1];
      return map;
    }, {});
  //console.log(map);
  return map;
}
