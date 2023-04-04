#docker run --detach --rm --name openldap \
#  --env LDAP_ADMIN_USERNAME=admin \
#  --env LDAP_ADMIN_PASSWORD=adminpassword \
#  --env LDAP_USERS=customuser \
#  --env LDAP_PASSWORDS=custompassword \
#  -p 1389:1389 \
#  bitnami/openldap:latest


docker run  \
    --env LDAP_ORGANISATION="Iconicompany" \
    --env LDAP_DOMAIN="iconicompany.com" \
    --env LDAP_ADMIN_PASSWORD="StrongAdminPassw0rd" \
    --env LDAP_BASE_DN="dc=iconicompany,dc=com" \
    --volume ./ldif:/container/service/slapd/assets/config/bootstrap/ldif/custom \
   -p 1389:389 \
   osixia/openldap:latest --copy-service --loglevel debug
