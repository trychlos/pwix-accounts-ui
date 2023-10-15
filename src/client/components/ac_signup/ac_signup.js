/*
 * pwix:accounts-ui/src/client/components/ac_signup/ac_signup.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_email/ac_input_email.js';
import '../ac_input_password/ac_input_password.js';
import '../ac_input_username/ac_input_username.js';
import '../ac_twice_passwords/ac_twice_passwords.js';

import './ac_signup.html';

Template.ac_signup.onCreated( function(){
    const self = this;
    //console.debug( 'onCreated', this, Template.currentData());

    self.AC = {
        emailOk: new ReactiveVar( false ),
        twiceOk: new ReactiveVar( false ),
        usernameOk: new ReactiveVar( false ),
        inCheck: false,

        // check each event and its data here
        checks( event, data ){
            switch( event.type ){
                case 'ac-email-data':
                    if( self.AC.checkEmail( data ) && !self.AC.inCheck ){
                        self.AC.checkPanel();
                    }
                    break;
                case 'ac-twice-data':
                    if( self.AC.checkTwice( data ) && !self.AC.inCheck ){
                        self.AC.checkPanel();
                    }
                    break;
                case 'ac-username-data':
                    if( self.AC.checkUsername( data ) && !self.AC.inCheck ){
                        self.AC.checkPanel();
                    }
                    break;
            }
        },
        checkEmail( data ){
            self.AC.emailOk.set( data.ok );
            return data.ok;
        },
        // the current field is ok
        //  so re-check all other fields to be sure that all errors have been considered
        checkPanel(){
            self.AC.inCheck = true;
            if( !self.AC.twiceOk.get()){
                self.$( '.ac-twice-passwords-sub' ).trigger( 'ac-check' );
            }
            // if an email is mandatory, it must be set here
            if( AccountsUI.opts().haveEmailAddress() !== AccountsUI.C.Input.NONE ){
                if( !self.AC.emailOk.get()){
                    self.$( '.ac-input-email-sub' ).trigger( 'ac-check' );
                }
            }
            // if a username is mandatory, it must be set here
            if( AccountsUI.opts().haveUsername() !== AccountsUI.C.Input.NONE ){
                if( !self.AC.usernameOk.get()){
                    self.$( '.ac-input-username-sub' ).trigger( 'ac-check' );
                }
            }
            self.AC.inCheck = false;
        },
        checkTwice( data ){
            self.AC.twiceOk.set( data.ok );
            return data.ok;
        },
        checkUsername( data ){
            self.AC.usernameOk.set( data.ok );
            return data.ok;
        },
        haveEmailAddress(){
            return AccountsUI.opts().haveEmailAddress() !== AccountsUI.C.Input.NONE;
        },
        haveUsername(){
            //console.debug( 'username', AccountsUI.opts().haveUsername());
            return AccountsUI.opts().haveUsername() !== AccountsUI.C.Input.NONE;
        },
        clearPanel(){
            self.$( 'input' )
                .val( '' )
                .first().focus();
        }
    };

    // setup initial default values so that field which is not present is always true
    self.AC.emailOk.set( !self.AC.haveEmailAddress());
    self.AC.usernameOk.set( !self.AC.haveUsername());
});

Template.ac_signup.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const ok = self.AC.emailOk.get() && self.AC.usernameOk.get() && self.AC.twiceOk.get();
        self.$( '.ac-signup' ).closest( '.ac-content' ).find( '.ac-submit' ).prop( 'disabled', !ok );
        // ac-signup is rendered before acUserLogin in div context
        const target = Template.currentData().AC.target || self.$( '.ac-signup' );
        target.trigger( 'ac-signup-ok', { ok: ok });
    });

    // monitor the modal events if apply
    Template.currentData().AC.monitorModalEvents( self.$( '.ac-signup' ));
});

Template.ac_signup.helpers({
    // error message
    errorMsg(){
        // even if we have no message at all, we keep at least one blank line
        return '<p>'+( AccountsUI.fn.errorMsg() || '&nbsp;' )+'<p>';
    },

    // whether email address is permitted
    haveEmailAddress(){
        return Template.instance().AC.haveEmailAddress();
    },

    // whether username is permitted
    haveUsername(){
        return Template.instance().AC.haveUsername();
    },

    // parameters for the email address
    parmsEmailAddress(){
        return {
            AC: this.AC,
            wantsNew: true,
            withErrorMsg: true,
            withFieldset: this.AC.options.signupFieldset(),
            legend: this.AC.options.signupLegendEmail(),
            withMandatoryField: true,
            placeholder: this.AC.options.signupEmailPlaceholder()
        };
    },

    // parameters for the password input
    parmsTwice(){
        return {
            AC: this.AC,
            role: 'signup',
            withMandatoryField: true,
            withErrorMsg: true,
            withFieldset: this.AC.options.signupFieldset(),
            legend: this.AC.options.signupLegendPassword(),
            placeholder1: this.AC.options.signupPasswdOnePlaceholder(),
            placeholder2: this.AC.options.signupPasswdTwoPlaceholder()
        };
    },

    // parameters for the email address and username inputs
    parmsUsername(){
        return {
            AC: this.AC,
            wantsNew: true,
            withErrorMsg: true,
            withFieldset: this.AC.options.signupFieldset(),
            legend: this.AC.options.signupLegendUsername(),
            withMandatoryField: true
        };
    },

    // the text at the first place of the section (if username)
    textOne(){
        return this.AC.options.signupTextOne();
    },

    // the text at the second place of the section (if email)
    textTwo(){
        return this.AC.options.signupTextTwo();
    },

    // the text at the third place of the section
    textThree(){
        return this.AC.options.signupTextThree();
    },

    // the text at the fourth place of the section
    textFour(){
        return this.AC.options.signupTextFour();
    },

    // the text at the fifth place of the section
    textFive(){
        return this.AC.options.signupTextFive();
    }
});

Template.ac_signup.events({
    // message sent by the input email component
    'ac-email-data .ac-signup'( event, instance, data ){
        //console.log( event, data );
        instance.AC.checks( event, data );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        instance.AC.checks( event, data );
    },

    // message sent by the input username component
    'ac-username-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-username-data', data );
        instance.AC.checks( event, data );
    },

    // message sent from acUserLogin after having successfully created a new user
    //  clear the input fields to prepare the creation of another account
    'ac-clear-panel .ac-signup'( event, instance ){
        instance.AC.clearPanel();
        return false;
    }
});
