/*
 * pwix:accounts/src/client/components/ac_reset_ask/ac_reset_ask.js
 * 
 * Parms:
 *  - display: the acDisplay instance
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
            btn.prop( 'disabled', !( pwiAccounts.checkEmail( mail )));
        }
    };
});

Template.ac_reset_ask.onRendered( function(){
    this.AC.enableSubmit();
});

Template.ac_reset_ask.helpers({
    // error message
    errorMsg(){
        return this.display.errorMsg();
    },

    // the text at the first place of the section
    textOne(){
        return this.display.resetPwdTextOne();
    },

    // the text at the second place of the section
    textTwo(){
        return this.display.resetPwdTextTwo();
    }
});

Template.ac_reset_ask.events({
    'keyup .ac-mail-input'( event, instance ){
        instance.AC.enableSubmit();
    }
});
