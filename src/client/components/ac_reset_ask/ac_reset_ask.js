/*
 * pwi:accounts/src/client/components/ac_reset_ask/ac_reset_ask.js
 */
import '../../../common/js/index.js';

import '../ac_input_mail/ac_input_mail.js';

import './ac_reset_ask.html';

Template.ac_reset_ask.onCreated( function(){
    const self = this;

    self.AC = {
        enableSubmit: function(){
            const mail = self.$( '.ac-input-mail .ac-input' ).val();
            const btn = self.$( '.ac-reset-ask' ).closest( '.acUserLogin' ).find( '.ac-submit' );
            btn.prop( 'disabled', !( pwiAccounts.client.fn.validateEmail( mail )));
        }
    };
});

Template.ac_reset_ask.onRendered( function(){
    this.AC.enableSubmit();
    console.log( 'pwi:accounts:ac_reset_ask', this.data.dialog.uuid());
});

Template.ac_reset_ask.helpers({
    // error message
    errorMsg(){
        return this.dialog.errorMsg();
    },

    // a description as a sufix of the section
    textAfter(){
        return this.dialog.resetPwdTextAfter();
    },

    // a description as a prefix of the section
    textBefore(){
        return this.dialog.resetPwdTextBefore();
    }
});

Template.ac_reset_ask.events({
    'keyup .ac-mail-input'( event, instance ){
        instance.AC.enableSubmit();
    }
});
