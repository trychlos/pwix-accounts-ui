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
        checksOk: new ReactiveVar( false ),

        // check each event and its data here
        checks( event, data ){
            switch( event.type ){
                case 'ac-email-data':
                    self.AC.checkEmail( data );
                    self.AC.checkPanel();
                    break;
                case 'ac-twice-data':
                    self.AC.checkTwice( data );
                    self.AC.checkPanel();
                    break;
                case 'ac-username-data':
                    self.AC.checkUsername( data );
                    self.AC.checkPanel();
                    break;
            }
        },
        checkEmail( data ){
            self.AC.emailOk.set( data.ok );
        },
        checkPanel(){
            let isOk = self.AC.twiceOk.get();
            // if an email is mandatory, it must be set here
            if( AccountsUI.opts().haveEmailAddress() !== AccountsUI.C.Input.NONE ){
                isOk &&= self.AC.emailOk.get();
            }
            // if a username is mandatory, it must be set here
            if( AccountsUI.opts().haveUsername() !== AccountsUI.C.Input.NONE ){
                isOk &&= self.AC.usernameOk.get();
            }
            self.AC.checksOk.set( isOk );
        },
        checkTwice( data ){
            self.AC.twiceOk.set( data.ok );
        },
        checkUsername( data ){
            self.AC.usernameOk.set( data.ok );
        },
        haveEmailAddress(){
            return AccountsUI.opts().haveEmailAddress() !== AccountsUI.C.Input.NONE;
        },
        haveUsername(){
            //console.debug( 'username', AccountsUI.opts().haveUsername());
            return AccountsUI.opts().haveUsername() !== AccountsUI.C.Input.NONE;
        },
        resetInput(){
            self.$( '.ac-input-password' ).trigger( 'ac-reset-input' );
            if( self.AC.haveEmailAddress()){
                self.$( '.ac-input-email' ).trigger( 'ac-reset-input' );
            }
            if( self.AC.haveUsername()){
                self.$( '.ac-input-username' ).trigger( 'ac-reset-input' );
            }
            self.$( 'input' ).first().focus();
        }
    };

    // setup initial default values so that field which is not present is always true
    self.AC.emailOk.set( !self.AC.haveEmailAddress());
    self.AC.usernameOk.set( !self.AC.haveUsername());
});

Template.ac_signup.onRendered( function(){
    const self = this;
    const parentAC = Template.currentData().AC;

    const $acContent = self.$( '.ac-signup' ).closest( '.ac-content' );

    self.autorun(() => {
        const ok = self.AC.checksOk.get();
        $acContent.find( '.ac-submit' ).prop( 'disabled', !ok );
        parentAC.target.trigger( 'ac-signup-ok', { ok: ok });
    });

    // on a modal, let ac-content intercept Enter keypressed
    if( parentAC.options.renderMode() === AccountsUI.C.Render.MODAL ){
        self.$( '.ac-signin ').closest( '.ac-content' ).on( 'keydown', function( event ){ if( event.keyCode === 13 ){ parentAC.target.trigger( 'ac-enter', event ); }});
    }
});

Template.ac_signup.helpers({
    // error message
    errorMsg(){
        // even if we have no message at all, we keep at least one blank line
        return AccountsUI.Display.errorMsg();
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
            new: true,
            placeholder: this.AC.options.signupEmailPlaceholder()
        };
    },

    // parameters for the email address and username inputs
    parmsUser(){
        return {
            AC: this.AC,
            new: true
        };
    },

    // parameters for the password input
    parmsTwice(){
        return {
            AC: this.AC,
            role: 'signup',
            placeholder1: this.AC.options.signupPasswdOnePlaceholder(),
            placeholder2: this.AC.options.signupPasswdTwoPlaceholder()
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
    }
});

Template.ac_signup.events({
    // message sent by the input email component
    'ac-email-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-email-data', data );
        if( data ){
            instance.AC.checks( event, data );
        }
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        if( data ){
            instance.AC.checks( event, data );
        }
    },

    // message sent by the input username component
    'ac-username-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-username-data', data );
        if( data ){
            instance.AC.checks( event, data );
        }
    },

    // message sent from acUserLogin after having successfully created a new user
    //  clear the input fields to prepare the creation of another account
    'ac-clear-panel .ac-signup'( event, instance ){
        instance.AC.resetInput();
        return false;
    }
});
