/*
 * pwix:accounts/src/common/js/functions.js
 */

pwixAccounts = {
    ...pwixAccounts,
    ...{
        // this has been obsoleted as of v 1.1.0
        //  kept here to have a next function template
        /**
         * @locus Anywhere
         * @param {Object} user the user record got from the database
         * @returns {Boolean} whether the firest email address has been verified
         */
        /*
        isEmailVerified( user ){
            return user ? ( user.emails[0].verified ) : false;
        }
        */
    }
};
