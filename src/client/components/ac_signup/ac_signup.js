/*
 * pwi:accounts/src/client/components/ac_signup/ac_signup.js
 */
import '../../../common/js/index.js';

import '../ac_input_mail/ac_input_mail.js';
import '../ac_input_password/ac_input_password.js';

import './ac_signup.html';

Template.ac_signup.onCreated( function(){
    const self = this;

    self.AC = {
        enableSubmit: function(){
            const mail = self.$( '.ac-input-mail .ac-input' ).val();
            const pwd = self.$( '.ac-input-password .ac-input' ).val();
            const btn = self.$( '.ac-signup' ).closest( '.acUserLogin' ).find( '.ac-submit' );
            btn.prop( 'disabled', !( pwiAccounts.client.fn.validateEmail( mail ) && pwiAccounts.client.fn.validatePassword( pwd )));
        },
        resetInput(){
            self.$( '.ac-input-mail input' ).val( '' );
            self.$( '.ac-input-password input' ).val( '' );
            self.$( 'input' ).first().focus();
        }
    };
});

Template.ac_signup.onRendered( function(){
    this.AC.enableSubmit();
    console.log( 'pwi:accounts:ac_signup', this.data.dialog.uuid());
});

Template.ac_signup.helpers({
    // error message
    errorMsg(){
        return this.dialog.errorMsg();
    },

    // have a text after ?
    //  if no, prevent inclusion of a superfluous margin-bottom
    hasTextAfter(){
        return this.dialog.signupTextAfter();
    },

    hasTextBefore(){
        return this.dialog.signupTextBefore();
    },

    // provides data to ac_input_password template
    passwordData(){
        return {
            new: true
        };
    },

    // a description as a sufix of the section
    textAfter(){
        return this.dialog.signupTextAfter();
    },

    // a description as a prefix of the section
    textBefore(){
        return this.dialog.signupTextBefore();
    }
});

Template.ac_signup.events({
    'keyup .ac-mail-input'( event, instance ){
        instance.AC.enableSubmit();
    },
    'keyup .ac-input-password'( event, instance ){
        instance.AC.enableSubmit();
    },

    // message sent from acUserLogin after having successfully created a new user
    //  clear the input fields to prepare the creation of another account
    'ac-clear .ac-signup'( event, instance ){
        instance.AC.resetInput();
        return false;
    }
});
