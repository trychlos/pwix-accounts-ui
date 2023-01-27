/*
 * pwix:accounts/src/common/js/functions.js
 */

pwiAccounts = {
    ...pwiAccounts,
    ...{
        /**
         * @locus Anywhere
         * @returns {Promise} which resolves to the specified user account
         */
        identity( id ){
            return Meteor.callPromise( 'pwiAccounts.byId', id );
        },

        /**
         * @locus Anywhere
         * @returns {Promise} which resolves to the first email address of the user
         */
        emailAddress( id ){
            return pwiAccounts.identity( id )
                .then(( user ) => {
                        return user ? ( user.emails[0].address ) : null;
                });
        },

        /**
         * @locus Anywhere
         * @returns {Promise} which resolves to true if user exists and at least his first email address has been verified
         */
        isEmailVerified( id ){
            return pwiAccounts.identity( id )
                .then(( user ) => {
                        return user ? ( user.emails[0].verified ) : false;
                });
        }
    }
};
