/*
 * pwix:accounts-ui/src/client/components/ac_reset_ask/ac_reset_ask.js
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_email/ac_input_email.js';

import './ac_reset_ask.html';

Template.ac_reset_ask.onCreated( function(){
    const self = this;

    self.AC = {
        component: new ReactiveVar( null ),
        emailOk: new ReactiveVar( true ) 
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
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
        return AccountsUI.Display.errorMsg();
    },

    // the text at the first place of the section
    textOne(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().resetAskTextOne() : '';
    },

    // the text at the second place of the section
    textTwo(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().resetAskTextTwo() : '';
    }
});

Template.ac_reset_ask.events({
    'ac-email-data'( event, instance, data ){
        instance.AC.emailOk.set( data.ok );
    }
});
