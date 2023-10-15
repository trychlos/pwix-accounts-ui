/*
 * pwix:accounts-ui/src/client/components/ac_signin/ac_signin.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import '../ac_input_email/ac_input_email.js';
import '../ac_input_password/ac_input_password.js';
import '../ac_input_userid/ac_input_userid.js';
import '../ac_input_username/ac_input_username.js';

import './ac_signin.html';

Template.ac_signin.onCreated( function(){
    const self = this;

    self.AC = {
        // checks: enable the submit button if both fields are set
        //  this is enough to try to connect
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
});

Template.ac_signin.onRendered( function(){
    const self = this;

    // disable the submit button at start
    self.AC.enableSubmit( false );

    // monitor the modal events if apply
    Template.currentData().AC.monitorModalEvents( self.$( '.ac-signin' ));
});

Template.ac_signin.helpers({
    // error message
    //  here, the only error is when server doesn't validate the credentials
    errorMsg(){
        return '<p>'+( AccountsUI.fn.errorMsg() || '&nbsp;' )+'</p>';
    },

    // true if we have email address and not username
    onlyEmailAddress(){
        return AccountsUI.opts().haveEmailAddress() !== AccountsUI.C.Input.NONE && AccountsUI.opts().haveUsername() === AccountsUI.C.Input.NONE;
    },

    // true if we have username and not email address
    onlyEmailAddress(){
        return AccountsUI.opts().haveEmailAddress() === AccountsUI.C.Input.NONE && AccountsUI.opts().haveUsername() !== AccountsUI.C.Input.NONE;
    },

    parmsEmail(){
        return {
            ...this,
            ...{
                withFieldset: this.AC.options.signinFieldset()
            }
        }
    },

    parmsPassword(){
        return {
            ...this,
            ...{
                withFieldset: this.AC.options.signinFieldset()
            }
        }
    },

    parmsUserid(){
        return {
            ...this,
            ...{
                withFieldset: this.AC.options.signinFieldset()
            }
        }
    },

    parmsUsername(){
        return {
            ...this,
            ...{
                withFieldset: this.AC.options.signinFieldset()
            }
        }
    },

    // a description before the section
    textOne(){
        return this.AC.options.signinTextOne();
    },

    // a description in the middle of the section
    textTwo(){
        return this.AC.options.signinTextTwo();
    },

    // a description at the endof the section
    textThree(){
        return this.AC.options.signinTextThree();
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
