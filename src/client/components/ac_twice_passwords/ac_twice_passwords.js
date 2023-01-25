/*
 * pwix:accounts/src/client/components/ac_twice_passwords/ac_twice_passwords.js
 *
 * New password entering with one or two input fields.
 * 
 * Parms:
 *  - label: String, defaulting to 'Password'
 *  - placeholder: String, defaulting to 'Enter your password'
 *  - new: Boolean, true for entering a new password (so to be checked for its strength)
 */

import { pwiI18n } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import '../ac_input_password/ac_input_password.html';

import './ac_twice_passwords.html';

Template.ac_twice_passwords.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        error: new ReactiveVar( '' )
    };
});

Template.ac_twice_passwords.helpers({
    // error message
    errorMsg(){
        return Template.instance().AC.error.get() || this.display.errorMsg();
    },

    // params to first occurrence of new password
    parmNewOne(){
        return {
            label: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'new_label' ),
            placeholder: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'newone_placeholder' ),
            new: true
        }
    },

    // params to second occurrence of new password
    //  do not set as 'new' to not have the 'strength' display
    parmNewTwo(){
        return {
            label: '',
            placeholder: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'newtwo_placeholder' )
        }
    },
});
