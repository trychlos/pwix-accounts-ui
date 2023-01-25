/*
 * pwix:accounts/src/client/components/ac_input_userid/ac_input_userid.js
 *
 * Email/Username input field
 * 
 * This form targets the entering of existing user
 * We do not check either the username or the email address or the password validities before trying to connect.
 * 
 * Parms:
 *  - label: String, defaulting to 'Identifier'
 *  - placeholder: String, defaulting to 'Enter your username or your email address'
 */

import { pwiI18n } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import './ac_input_userid.html';

Template.ac_input_userid.helpers({

    // returns the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwiI18n.label( pwiAccounts.strings, 'input_userid', key );
    }
});
