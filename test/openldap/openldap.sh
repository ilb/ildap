#docker run --detach --rm --name openldap \
#  --env LDAP_ADMIN_USERNAME=admin \
#  --env LDAP_ADMIN_PASSWORD=adminpassword \
#  --env LDAP_USERS=customuser \
#  --env LDAP_PASSWORDS=custompassword \
#  -p 1389:1389 \
#  bitnami/openldap:latest


docker run  \
    --hostname ldaptest \
    --env LDAP_ORGANISATION="Iconicompany" \
    --env LDAP_DOMAIN="iconicompany.com" \
    --env LDAP_ADMIN_PASSWORD="StrongAdminPassw0rd" \
    --env LDAP_BASE_DN="dc=iconicompany,dc=com" \
    --env LDAP_TLS_CRT_FILENAME=ldaptest.crt \
    --env LDAP_TLS_KEY_FILENAME=ldaptest.key \
    --env LDAP_TLS_VERIFY_CLIENT=never \
    --env LDAP_TLS_CA_CRT_FILENAME=ca.crt \
    --env LDAP_TLS_DH_PARAM_FILENAME=dhparams.pem \
    --volume ./ldif:/container/service/slapd/assets/config/bootstrap/ldif/custom \
    --volume ./certs:/container/service/slapd/assets/certs \
   -p 1389:389 -p 1636:636 \
   osixia/openldap:latest --copy-service --loglevel debug
