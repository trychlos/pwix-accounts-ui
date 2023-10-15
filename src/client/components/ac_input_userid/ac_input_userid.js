/*
 * pwix:accounts-ui/src/client/components/ac_input_userid/ac_input_userid.js
 *
 * Email/Username input field
 * 
 * This form targets the entering of existing user
 * We do not check either the username or the email address or the password validities before trying to connect.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *  - label: String, defaulting to 'Identifier'
 *  - placeholder: String, defaulting to 'Enter your username or your email address'
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_userid.html';

Template.ac_input_userid.helpers({

    // returns the text, maybe from data context, defaulting to the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_userid.'+key );
    }
});

Template.ac_input_userid.events({
    'input input.ac-input'( event, instance ){
        const value = instance.$( event.currentTarget ).val() || '';
        instance.$( event.currentTarget ).trigger( 'ac-userid-data', { userid: value });
    }
});
