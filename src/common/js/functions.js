/*
 * pwix:accounts/src/common/js/functions.js
 */

pwiAccounts = {
    ...pwiAccounts,
    ...{
        /*
         * @returns {Promise} which resolves to the specified user account
         */
        identity( id ){
            return Meteor.callPromise( 'pwiAccounts.byId', id );
        },

        /*
         * @returns {Promise} which resolves to the first email address of the user
         */
        emailAddress( id ){
            return pwiAccounts.identity( id )
                .then(( user ) => {
                        return user ? ( user.emails[0].address ) : null;
                });
        },

        /*
         * @returns {Promise} which resolves to true if user exists and at least hist first email address has been verified
         */
        isEmailVerified( id ){
            return pwiAccounts.identity( id )
                .then(( user ) => {
                        return user ? ( user.emails[0].verified ) : false;
                });
        }
    }
};
