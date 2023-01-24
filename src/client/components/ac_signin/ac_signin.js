/*
 * pwix:accounts/src/client/components/ac_signin/ac_signin.js
 * 
 * Parms:
 *  - display: the acDisplay instance
 */
import '../../../common/js/index.js';

import '../ac_input_mail/ac_input_mail.js';
import '../ac_input_password/ac_input_password.js';

import './ac_signin.html';

Template.ac_signin.onCreated( function(){
    const self = this;

    self.AC = {
        enableSubmit: function(){
            const mail = self.$( '.ac-input-mail .ac-input' ).val();
            const pwd = self.$( '.ac-input-password .ac-input' ).val();
            const btn = self.$( '.ac-signin' ).closest( '.acUserLogin' ).find( '.ac-submit' );
            btn.prop( 'disabled', !( pwiAccounts.checkEmail( mail ) && pwiAccounts.checkPasswordLength( pwd )));
        },
        errors: []
    };
});

Template.ac_signin.onRendered( function(){
    this.AC.enableSubmit();
});

Template.ac_signin.helpers({
    // error message
    //  here, the only error is when server doesn't validate the credentials
    errorMsg(){
        return this.display.errorMsg();
    },

    // a description before the section
    textOne(){
        return this.display.signinTextOne();
    },

    // a description in the middle of the section
    textTwo(){
        return this.display.signinTextTwo();
    },

    // a description at the endof the section
    textThree(){
        return this.display.signinTextThree();
    }
});

Template.ac_signin.events({
    'keyup .ac-mail-input'( event, instance ){
        instance.AC.enableSubmit();
    },
    'keyup .ac-input-password'( event, instance ){
        instance.AC.enableSubmit();
    }
});
