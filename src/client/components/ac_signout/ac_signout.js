/*
 * pwix:accounts-ui/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */

import { ReactiveVar } from 'meteor/reactive-var';

import './ac_signout.html';

Template.ac_signout.onCreated( function(){
    const self = this;

    self.AC = {
        component: new ReactiveVar( null )
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });
});

Template.ac_signout.onRendered( function(){
    const self = this;

    const $acContent = self.$( '.ac-signout' ).closest( '.ac-content' );

    self.autorun(() => {
        $acContent.attr( 'data-ac-requester', Template.currentData().managerId );
    });
});

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signoutTextOne() : '';
    }
});
