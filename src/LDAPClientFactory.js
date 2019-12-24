//import LdapClient from 'ldapjs-client';
//import ShutdownHook from 'shutdown-hook';

/**
 * LDAP client factory fith connection reuse
 * TODO: register close hook
 * @type type
 */
class LDAPClientFactory {

    constructor() {
        this.connections = {};
        this.LdapClientClass = require('ldapjs-client');
//        const shutdownHook = new ShutdownHook({});
        //shutdownHook.add(_ => this.close(), {})
        //shutdownHook.add(_ => console.log('shutdown!!!'), {})
//        const exitHook = require('exit-hook');
//        exitHook(() => {
//            console.log('Exiting!!!');
//        });
    }

    close() {
        for (let [url, connection] of Object.entries(this.connections)) {
            connection.unbind();
        }
    }

    getLDAPClient(ldapClientConfig) {
        if (!this.connections[ldapClientConfig.url]) {
            this.connections[ldapClientConfig.url] = new this.LdapClientClass(ldapClientConfig);
        }
        return this.connections[ldapClientConfig.url];
    }

}

export default LDAPClientFactory;
