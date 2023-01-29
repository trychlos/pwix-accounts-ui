/*
 * pwix:accounts/src/client/components/ac_twice_passwords/ac_twice_passwords.js
 *
 * New password entering with one or two input fields.
 * 
 * In order to correctly manage the UI reactivity, the parent should implement handlers for
 * 'ac-password-data' and 'ac-twice-data' messages.
 * 
 * Parms:
 *  - display: the acDisplay instance
 *      Is undefined when invoked from ac_reset_pwd template
 *      Take care!
 *  - role: 'signup|change|reset'
 *      This happens to also be the prefix of the to-be-called acDisplay methods
 *      Do not change!
 *  - label: String, defaulting to 'Password'
 *  - placeholder1: String, defaulting to 'Enter your password'
 *  - placeholder2: String, defaulting to 'Renter your password'
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import '../ac_input_password/ac_input_password.html';

import './ac_twice_passwords.html';

Template.ac_twice_passwords.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        twice: new ReactiveVar( false ),
        error: new ReactiveVar( '' ),

        check(){
            const pwd1 = self.$( '.ac-twice-passwords .ac-newone .ac-input' ).val();
            const pwd2 = self.AC.twice.get() ? self.$( '.ac-twice-passwords .ac-newtwo .ac-input' ).val() : pwd1;
            self.AC.error.set( '' );
            // whether the new password 'pwd1' is ok is checked by the input password component
            // we have to check that the two occurences 'pwd1' and 'pwd2' are the same
            const equalsOk = pwd1 === pwd2;
            self.AC.error.set( equalsOk ? '' : '<p>'+i18n.label( AC_I18N, 'twice_passwords.password_different' )+'</p>' );
            self.$( '.ac-twice-passwords' ).trigger( 'ac-twice-data', { ok: equalsOk, length: pwd1.length });
        }
    };

    self.autorun(() => {
        const fn = Template.currentData().role + 'PasswordTwice';
        const display = Template.currentData().display;
        self.AC.twice.set( display && display.opts()[fn] ? display.opts()[fn]() : ( pwiAccounts.opts()[fn] ? pwiAccounts.opts()[fn]() : pwiAccounts.opts().passwordTwice()));
    });
});

Template.ac_twice_passwords.helpers({
    // error message
    errorMsg(){
        return Template.instance().AC.error.get();
    },

    // params to first occurrence of new password
    parmNewOne(){
        return {
            label: i18n.label( AC_I18N, 'twice_passwords.label' ),
            placeholder: i18n.label( AC_I18N, 'twice_passwords.placeholder1' ),
            new: true
        }
    },

    // params to second occurrence of new password
    //  do not set as 'new' to not have the 'strength' display
    parmNewTwo(){
        return {
            label: '',
            placeholder: i18n.label( AC_I18N, 'twice_passwords.placeholder2' )
        }
    },

    // whether we must display two input fields ?
    twice(){
        return Template.instance().AC.twice.get();
    }
});

Template.ac_twice_passwords.events({
    'keyup .ac-twice-passwords'( event, instance ){
        instance.AC.check();
    }
});
