/*
 * pwix:accounts/src/client/components/ac_reset_ask/ac_reset_ask.js
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object
*/
import '../../../common/js/index.js';

import '../ac_input_email/ac_input_email.js';

import './ac_reset_ask.html';

Template.ac_reset_ask.onCreated( function(){
    const self = this;

    self.AC = {
        emailOk: new ReactiveVar( true ) 
    };
});

Template.ac_reset_ask.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const btn = self.$( '.ac-reset-ask' ).closest( '.acUserLogin' ).find( '.ac-submit' );
        btn.prop( 'disabled', !self.AC.emailOk.get());
    });
});

Template.ac_reset_ask.helpers({
    // error message
    errorMsg(){
        return pwiAccounts.Displayer.errorMsg();
    },

    // the text at the first place of the section
    textOne(){
        return this.requester.opts().resetAskTextOne();
    },

    // the text at the second place of the section
    textTwo(){
        return this.requester.opts().resetAskTextTwo();
    }
});

Template.ac_reset_ask.events({
    'ac-email-data'( event, instance, data ){
        instance.AC.emailOk.set( data.ok );
    }
});
