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
        },

        /**
         * @locus Anywhere
         * @param {Object} user the user record got the database
         * @param {String} preferred the optional user preference, either AC_USERNAME or AC_EMAIL_ADDRESS,
         *  defaulting to the configured value.
         * @returns: {String} the label to preferentially use when referring to a user
         *  either a username or an email address
         *  depending of the fields required in the global conf
         *  of the field availability in the user record
         *  and of the user's preference
         */
        preferredLabel( user, preferred ){
            let mypref = preferred;
            if( !mypref || !acOptionsConf.Labels.includes( mypref )){
                mypref = pwiAccounts.opts().preferredLabel();
            }
            if( mypref === AC_USERNAME && user.username ){
                return user.username;
            }
            if( mypref === AC_EMAIL_ADDRESS && user.emails[0].address ){
                return user.emails[0].address;
            }
            if( user.emails[0].address ){
                return user.emails[0].address;
            }
            if( user.username ){
                return user.username;
            }
            return user._id;
        }
    }
};
