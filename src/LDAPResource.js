export default class LDAPResource {

    constructor(ldapClient, base) {
        this.ldapClient = ldapClient;
        this.base = base;
        this.lookupCount = 0;
    }

    async lookup(name, base) {
        base = base || this.base;
        const options = {
            filter: `(&(objectClass=applicationProcess)(cn=${name}))`,
            scope: 'sub',
            attributes: ['labeledURI']
        };
        let entries = null;
        try {
            entries = await this.ldapClient.search(base, options);
        } catch (ex) {
            throw new Error('LDAP lookup failed ' + ex);
        }
        //console.log('entries',entries);
        let result = null;
        if (entries.length > 0 && entries[0].labeledURI) {
            result = entries[0].labeledURI;
        }
        this.lookupCount++;
        return result;
    }
}
