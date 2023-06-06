/*
 * pwix:accounts/src/client/components/ac_signin/ac_signin.js
 * 
 * Parms:
 *  - requester: the acCompanion object
 */

import { acCompanion } from '../../classes/ac_companion.class.js';

import '../ac_input_userid/ac_input_userid.js';
import '../ac_input_password/ac_input_password.js';

import './ac_signin.html';

Template.ac_signin.onCreated( function(){
    const self = this;

    // check that requester is a acCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acCompanion )){
            throw new Error( 'expected acCompanion, found', requester );
        }
    });
});

Template.ac_signin.onRendered( function(){
    const self = this;
    self.$( '.ac-signin ').closest( '.acUserLogin' ).find( '.ac-submit' ).prop( 'disabled', false );
});

Template.ac_signin.helpers({
    // error message
    //  here, the only error is when server doesn't validate the credentials
    errorMsg(){
        return pwiAccounts.DisplayManager.errorMsg();
    },

    // a description before the section
    textOne(){
        return this.requester.opts().signinTextOne();
    },

    // a description in the middle of the section
    textTwo(){
        return this.requester.opts().signinTextTwo();
    },

    // a description at the endof the section
    textThree(){
        return this.requester.opts().signinTextThree();
    }
});
