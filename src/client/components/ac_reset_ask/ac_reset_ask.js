/*
 * pwix:accounts-ui/src/client/components/ac_reset_ask/ac_reset_ask.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

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
    const parentAC = Template.currentData().AC;

    const $acContent = self.$( '.ac-reset-ask' ).closest( '.ac-content' );

    self.autorun(() => {
        $acContent.find( '.ac-submit' ).prop( 'disabled', !self.AC.emailOk.get());
    });

    // on a modal, let ac-content intercept Enter keypressed
    if( parentAC.options.renderMode() === AccountsUI.C.Render.MODAL ){
        $acContent.on( 'keydown', function( event ){ if( event.keyCode === 13 ){ parentAC.target.trigger( 'ac-enter', event ); }});
    }
});

Template.ac_reset_ask.helpers({
    // error message
    errorMsg(){
        return AccountsUI.fn.errorMsg();
    },

    // parameters for the email address and username inputs
    parmsUser(){
        return {
            AC: this.AC,
            new: false
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
    'ac-email-data .ac-reset-ask'( event, instance, data ){
        instance.AC.emailOk.set( data.ok );
    }
});
