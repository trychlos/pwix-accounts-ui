/*
 * pwix:accounts/src/common/js/functions.js
 */

pwiAccounts = {
    ...pwiAccounts,
    ...{
        /*
         * @returns {Promise} which resolves to the main identity if the specified user
         *  {
         *      exists: true|false
         *      emails: [] array of objects { address, verified }, may be empty
         *      username: <string>
         *  }
         */
        identity( id ){
            return Meteor.callPromise( 'pwiAccounts.getIdentity', id );
        },

        /*
         * @returns {Promise} which resolves to the first email address of the user
         */
        emailAddress( id ){
            return pwiAccounts.identity( id )
                .then(( result ) => {
                        return result.exists ? ( result.emails[0].address ) : null;
                });
        },

        /*
         * @returns {Promise} which resolves to true if user exists and at least hist first email address has been verified
         */
        isEmailVerified( id ){
            return pwiAccounts.identity( id )
                .then(( result ) => {
                        return result.exists ? ( result.emails[0].verified ) : false;
                });
        }
    }
};
