import LDAPConfig from './LDAPConfig.js';

export default class OpenLDAPConfig extends LDAPConfig {
  constructor(config) {
    super();
    this.ldapSchemasRegexp = /^ldaps?:\/\//;
    this.loadValuesFromConfig(config);
  }

  loadValuesFromConfig(config) {
    const configMap = OpenLDAPConfig.parseConfig(config);
    if (configMap.URI) {
      this.uri = configMap.URI.split(/\s+/).filter((l) => l.match(this.ldapSchemasRegexp));
    }
    this.base = configMap.BASE || null;
    this.caCert = configMap.TLS_CACERT || null;
  }

  static parseConfig(config) {
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
}
