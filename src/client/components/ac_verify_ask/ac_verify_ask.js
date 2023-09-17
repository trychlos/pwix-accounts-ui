/*
 * pwix:accounts-ui/src/client/components/ac_verify_ask/ac_verify_ask.js
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */

import { ReactiveVar } from 'meteor/reactive-var';

import './ac_verify_ask.html';

Template.ac_verify_ask.onCreated( function(){
    const self = this;

    self.AC = {
        component: new ReactiveVar( null ),
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });
});

Template.ac_verify_ask.onRendered( function(){
    const self = this;

    const $acContent = self.$( '.ac-verify-ask' ).closest( '.ac-content' );

    self.autorun(() => {
        $acContent.attr( 'data-ac-requester', Template.currentData().managerId );
    });
});

Template.ac_verify_ask.helpers({
    // error message
    errorMsg(){
        return AccountsUI.Display.errorMsg();
    },

    // the text of the section
    textOne(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().verifyAskTextOne() : '';
    }
});
