const { objectClassResource, objectClassGroup } = require('./settings');

function LDAPResource(ldapClient, base) {
  this.ldapClient = ldapClient;
  this.base = base;
  this.lookupCount = 0;
}

LDAPResource.prototype.lookup = async function (name, base) {
  base = base || this.base;
  let result = await this.lookupResource(name, base);
  if (result === null) {
    result = await this.lookupGroup(name, base);
  }
  return result;
};
LDAPResource.prototype.lookupResource = async function (name, base) {
  const options = {
    filter: `(&(objectClass=${objectClassResource})(cn=${name}))`,
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
  if (entries.length > 0) {
    const entry = entries[0];
    if (entry.labeledURI) {
      result = entry.labeledURI;
    }
  }
  this.lookupCount++;
  return result;
};

LDAPResource.prototype.lookupGroup = async function (name, base) {
  const options = {
    filter: `(&(objectClass=${objectClassGroup})(cn=${name}))`,
    scope: 'sub'
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
  if (entries.length > 0) {
    // const entry = entries[0];
    // если группа найдена, подставляем cn
    result = name;
  }
  this.lookupCount++;
  return result;
};

module.exports = LDAPResource;
