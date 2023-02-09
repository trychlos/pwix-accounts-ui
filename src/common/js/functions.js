/*
 * pwix:accounts/src/common/js/functions.js
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import { acOptionsConf } from '../classes/ac_options_conf.class.js';

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
