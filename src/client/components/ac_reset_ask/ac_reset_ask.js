/*
 * pwix:accounts-ui/src/client/components/ac_reset_ask/ac_reset_ask.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_email/ac_input_email.js';

import './ac_reset_ask.html';

Template.ac_reset_ask.onCreated( function(){
    const self = this;

    self.AC = {
        emailOk: new ReactiveVar( false ) 
    };
});

Template.ac_reset_ask.onRendered( function(){
    const self = this;
 
    self.autorun(() => {
        self.$( '.ac-reset-ask' ).closest( '.ac-content' ).find( '.ac-submit' ).prop( 'disabled', !self.AC.emailOk.get());
    });

    // monitor the modal events if apply
    Template.currentData().AC.monitorModalEvents( self.$( '.ac-reset-ask' ));
});

Template.ac_reset_ask.helpers({
    // parameters for the ac_error_msg component
    parmsErrorMsg(){
        return {
            ...this,
            withErrorArea: AccountsUI.fn.hasErrorArea( this ),
            errorMsgRv: AccountsUI.fn.errorMsgRv()
        };
    },

    // parameters for the email address inputs
    //  because that asking for reset a password REQUIRES an email address, whatever be the AccountsUI configuration
    parmsInputEmail(){
        return {
            AC: this.AC,
            withErrorMsg: true
        };
    },

    // the text at the first place of the section
    textOne(){
        return this.AC.options.resetAskTextOne();
    },

    // the text at the second place of the section
    textTwo(){
        return this.AC.options.resetAskTextTwo();
    }
});

Template.ac_reset_ask.events({
    // input-email status
    'ac-email-data .ac-reset-ask'( event, instance, data ){
        //console.debug( data );
        instance.AC.emailOk.set( data.ok );
    }
});
