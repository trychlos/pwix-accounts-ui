/*
 * pwix:accounts-ui/src/client/components/ac_signin/ac_signin.js
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_userid/ac_input_userid.js';
import '../ac_input_password/ac_input_password.js';

import './ac_signin.html';

Template.ac_signin.onCreated( function(){
    const self = this;

    self.AC = {
        component: new ReactiveVar( null ),

        // checks: enable the submit button if bot fields are set
        checks(){
            const userid = self.$( '.ac-signin .ac-input-userid .ac-input' ).val() || '';
            const passwd = self.$( '.ac-signin .ac-input-password .ac-input' ).val() || '';
            self.AC.enableSubmit( userid.length && passwd.length );
        },

        // enable the submit button
        enableSubmit( enable ){
            self.$( '.ac-signin ').closest( '.ac-content' ).find( '.ac-submit' ).prop( 'disabled', !enable );
        }
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });
});

Template.ac_signin.onRendered( function(){
    const self = this;

    // disable the submit button at start
    self.AC.enableSubmit( false );
});

Template.ac_signin.helpers({
    // error message
    //  here, the only error is when server doesn't validate the credentials
    errorMsg(){
        return AccountsUI.Display.errorMsg();
    },

    // a description before the section
    textOne(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signinTextOne() : '';
    },

    // a description in the middle of the section
    textTwo(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signinTextTwo() : '';
    },

    // a description at the endof the section
    textThree(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signinTextThree() : '';
    }
});

Template.ac_signin.events({
    // message sent by the userid input component
    'ac-userid-data .ac-signin'( event, instance, data ){
        instance.AC.checks();
    },

    // message sent by the password input component
    'ac-password-data .ac-signin'( event, instance, data ){
        instance.AC.checks();
    }
});
