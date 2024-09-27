/*
 * pwix:accounts-ui/src/client/components/ac_signup/ac_signup.js
 *
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import { AccountsHub } from 'meteor/pwix:accounts-hub';
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
        emailValue: new ReactiveVar( null ),
        twiceOk: new ReactiveVar( false ),
        twiceValue: new ReactiveVar( null ),
        usernameOk: new ReactiveVar( false ),
        usernameValue: new ReactiveVar( null ),
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
            self.AC.emailValue.set( data.email );
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
            if( self.AC.haveEmailAddress() !== AccountsHub.C.Identifier.NONE ){
                if( !self.AC.emailOk.get()){
                    self.$( '.ac-input-email-sub' ).trigger( 'ac-check' );
                }
            }
            // if a username is mandatory, it must be set here
            if( self.AC.haveUsername() !== AccountsHub.C.Identifier.NONE ){
                if( !self.AC.usernameOk.get()){
                    self.$( '.ac-input-username-sub' ).trigger( 'ac-check' );
                }
            }
            self.AC.inCheck = false;
        },
        checkTwice( data ){
            self.AC.twiceOk.set( data.ok );
            self.AC.twiceValue.set( data.password );
            return data.ok;
        },
        checkUsername( data ){
            self.AC.usernameOk.set( data.ok );
            self.AC.usernameValue.set( data.username );
            return data.ok;
        },
        haveEmailAddress(){
            return Template.currentData().AC.options.signupHaveEmailAddress() !== AccountsHub.C.Identifier.NONE;
        },
        haveUsername(){
            return Template.currentData().AC.options.signupHaveUsername() !== AccountsHub.C.Identifier.NONE;
        },
        // no tonly we have to clear all the fields, but also our internal datas
        clearPanel(){
            self.$( 'input' )
                .val( '' )
                .first().focus();
            self.AC.emailOk.set( false );
            self.AC.emailValue.set( null );
            self.AC.twiceOk.set( false );
            self.AC.twiceValue.set( null );
            self.AC.usernameOk.set( false );
            self.AC.usernameValue.set( null );
        }
    };

    // setup initial default values so that field which is not present is always true
    self.AC.emailOk.set( Template.currentData().AC.options.signupHaveEmailAddress() !== AccountsHub.C.Identifier.MANDATORY );
    self.AC.usernameOk.set( Template.currentData().AC.options.signupHaveUsername() !== AccountsHub.C.Identifier.MANDATORY);
});

Template.ac_signup.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const ok = self.AC.emailOk.get() && self.AC.usernameOk.get() && self.AC.twiceOk.get();
        //console.debug( 'emailOk', self.AC.emailOk.get(), 'usernameOk', self.AC.usernameOk.get(), 'twiceOk', self.AC.twiceOk.get(), 'ok', ok );
        self.$( '.ac-signup' ).closest( '.ac-content' ).find( '.ac-submit' ).prop( 'disabled', !ok );
        // ac-signup is rendered before acUserLogin in div context
        const target = Template.currentData().AC.target || self.$( '.ac-signup' );
        target.trigger( 'ac-signup-ok', {
            ok: ok,
            email: self.AC.emailValue.get(),
            username: self.AC.usernameValue.get(),
            password: self.AC.twiceValue.get()
        });
    });

    // monitor the modal events if apply
    Template.currentData().AC.monitorModalEvents( self.$( '.ac-signup' ));
});

Template.ac_signup.helpers({
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
            withMandatoryField: this.AC.options.signupHaveEmailAddress() === AccountsHub.C.Identifier.MANDATORY,
            placeholder: this.AC.options.signupEmailPlaceholder()
        };
    },

    // parameters for the ac_error_msg component
    parmsErrorMsg(){
        return {
            ...this,
            withErrorArea: AccountsUI.fn.hasErrorArea( this ),
            errorMsgRv: AccountsUI.fn.errorMsgRv()
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
            withMandatoryField: this.AC.options.signupHaveUsername() === AccountsHub.C.Identifier.MANDATORY
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
        //console.log( event.type, data );
        instance.AC.checks( event, data );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-signup'( event, instance, data ){
        //console.log( event.type, data );
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
        //console.log( 'ac-clear-panel' );
        instance.AC.clearPanel();
        return false;
    }
});
