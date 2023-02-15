/*
 * pwix:accounts/src/common/js/functions.js
 */

pwiAccounts = {
    ...pwiAccounts,
    ...{
        /**
         * @locus Anywhere
         * @param {Object} user the user record got from the database
         * @returns {Boolean} whether the firest email address has been verified
         */
        isEmailVerified( user ){
            return user ? ( user.emails[0].verified ) : false;
        }
    }
};
