/*
 * pwi:accounts/src/client/components/ac_signin/ac_signin.js
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
            btn.prop( 'disabled', !( pwiAccounts.client.fn.validateEmail( mail ) && pwiAccounts.client.fn.validatePassword( pwd )));
        }
    };
});

Template.ac_signin.onRendered( function(){
    this.AC.enableSubmit();
    console.log( 'pwi:accounts:ac_signin', this.data.dialog.uuid());
});

Template.ac_signin.helpers({
    // error message
    errorMsg(){
        return this.dialog.errorMsg();
    },

    // have a text after ?
    //  if no, prevent inclusion of a superfluous margin-bottom
    hasTextAfter(){
        return this.dialog.signinTextAfter();
    },

    hasTextBefore(){
        return this.dialog.signinTextBefore();
    },

    // a description as a sufix of the section
    textAfter(){
        return this.dialog.signinTextAfter();
    },

    // a description as a prefix of the section
    textBefore(){
        return this.dialog.signinTextBefore();
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
