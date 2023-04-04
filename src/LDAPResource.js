export default function LDAPResource(ldapClient, base) {
  this.ldapClient = ldapClient;
  this.base = base;
  this.lookupCount = 0;
}

LDAPResource.prototype.lookup = async function (name, base) {
  base = base || this.base;
  const options = {
    filter: `(&(objectClass=applicationProcess)(cn=${name}))`,
    scope: 'sub',
    attributes: ['labeledURI']
  };
  let entries = [];
  try {
    entries = await this.ldapClient.search(base, options);
  } catch (ex) {
    if (ex.name !== 'NoSuchObjectError') {
      throw new Error('LDAP lookup failed ' + ex);
    }
  }
  //console.log('entries',entries);
  let result = null;
  if (entries.length > 0 && entries[0].labeledURI) {
    result = entries[0].labeledURI;
  }
  this.lookupCount++;
  return result;
};
