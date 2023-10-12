/*
 * pwix:accounts-ui/src/client/components/ac_signup/ac_signup.js
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_email/ac_input_email.js';
import '../ac_input_password/ac_input_password.js';
import '../ac_input_username/ac_input_username.js';
import '../acMandatoryFooter/acMandatoryFooter.js';
import '../ac_twice_passwords/ac_twice_passwords.js';

import './ac_signup.html';

Template.ac_signup.onCreated( function(){
    const self = this;
    //console.debug( 'onCreated', this, Template.currentData());

    self.AC = {
        component: new ReactiveVar( null ),
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

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });

    // setup initial default values so that field which is not present is always true
    self.AC.emailOk.set( !self.AC.haveEmailAddress());
    self.AC.usernameOk.set( !self.AC.haveUsername());
});

Template.ac_signup.onRendered( function(){
    const self = this;

    const $acContent = self.$( '.ac-signup' ).closest( '.ac-content' );

    self.autorun(() => {
        $acContent.attr( 'data-ac-requester', Template.currentData().managerId );
    });

    self.autorun(() => {
        const ok = self.AC.checksOk.get();
        $acContent.find( '.ac-submit' ).prop( 'disabled', !ok );
        self.$( '.ac-signup' ).trigger( 'ac-signup-ok', { ok: ok });
    });
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
        const component = Template.instance().AC.component.get();
        return {
            component: component,
            new: true,
            placeholder: component.opts().signupEmailPlaceholder()
        };
    },

    // parameters for the email address and username inputs
    parmsUser(){
        return {
            component: Template.instance().AC.component.get(),
            new: true
        };
    },

    // parameters for the password input
    parmsTwice(){
        const component = Template.instance().AC.component.get();
        return {
            component: component,
            role: 'signup',
            placeholder1: component.opts().signupPasswdOnePlaceholder(),
            placeholder2: component.opts().signupPasswdTwoPlaceholder()
        };
    },

    // the text at the first place of the section (if username)
    textOne(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextOne() : '';
    },

    // the text at the second place of the section (if email)
    textTwo(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextTwo() : '';
    },

    // the text at the third place of the section
    textThree(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextThree() : '';
    },

    // the text at the fourth place of the section
    textFour(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextFour() : '';
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
    'ac-clear .ac-signup'( event, instance ){
        instance.AC.resetInput();
        return false;
    },

    // clear the panel
    //  this is only for completude as this has almost no chance to be used
    'ac-clear-panel-fwd .ac-signup'( event, instance ){
        instance.AC.resetInput();
        return false;
    }
});
