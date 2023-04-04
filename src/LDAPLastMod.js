export default class LDAPLastMod {
  constructor(ldapClient, base, options) {
    this.ldapClient = ldapClient;
    this.base = base || 'cn=lastmod,c=ru';
    this.options = options || {
      filter: '(objectClass=lastmod)',
      attributes: ['modifyTimestamp']
    };
  }

  async getLastMod() {
    let entries = [];
    try {
      entries = await this.ldapClient.search(this.base, this.options);
    } catch (ex) {
      if (ex.name !== 'NoSuchObjectError') {
        throw new Error('LDAP lookup failed ' + ex);
      }
    }

    let dateLastMod = null;
    if (entries.length === 1 && entries[0].modifyTimestamp) {
      const rawLastMod = entries[0].modifyTimestamp.match(
        /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})Z$/
      );
      dateLastMod = new Date(
        rawLastMod[1],
        Number(rawLastMod[2]) - 1,
        rawLastMod[3],
        rawLastMod[4],
        rawLastMod[5],
        rawLastMod[6]
      );
    }
    return dateLastMod;
  }
}
