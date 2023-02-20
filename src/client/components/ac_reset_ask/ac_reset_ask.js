/*
 * pwix:accounts/src/client/components/ac_reset_ask/ac_reset_ask.js
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object
 */

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';

import '../ac_input_email/ac_input_email.js';

import './ac_reset_ask.html';

Template.ac_reset_ask.onCreated( function(){
    const self = this;

    self.AC = {
        emailOk: new ReactiveVar( true ) 
    };

    // check that requester is a acUserLoginCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acUserLoginCompanion )){
            throw new Error( 'expected acUserLoginCompanion, found', requester );
        }
    });
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
        return pwiAccounts.DisplayManager.errorMsg();
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
