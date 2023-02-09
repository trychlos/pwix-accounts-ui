/*
 * pwix:accounts/src/client/components/ac_signin/ac_signin.js
 * 
 * Parms:
 *  - aculInstance: the acUserLogin template instance
 */
import '../../../common/js/index.js';

import '../ac_input_userid/ac_input_userid.js';
import '../ac_input_password/ac_input_password.js';

import './ac_signin.html';

Template.ac_signin.onRendered( function(){
    const self = this;
    self.$( '.ac-signin ').closest( '.acUserLogin' ).find( '.ac-submit' ).prop( 'disabled', false );
});

Template.ac_signin.helpers({
    // error message
    //  here, the only error is when server doesn't validate the credentials
    errorMsg(){
        return this.aculInstance.AC.display.errorMsg();
    },

    // a description before the section
    textOne(){
        return this.aculInstance.AC.options.signinTextOne();
    },

    // a description in the middle of the section
    textTwo(){
        return this.aculInstance.AC.options.signinTextTwo();
    },

    // a description at the endof the section
    textThree(){
        return this.aculInstance.AC.options.signinTextThree();
    }
});
