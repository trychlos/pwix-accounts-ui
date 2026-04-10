/*
 * pwix:accounts-ui/src/client/components/ac_signup/ac_signup.js
 *
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import { AccountsCore } from 'meteor/pwix:accounts-core';
import { Logger } from 'meteor/pwix:logger';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_email/ac_input_email.js';
import '../ac_input_password/ac_input_password.js';
import '../ac_input_username/ac_input_username.js';
import '../ac_twice_passwords/ac_twice_passwords.js';

import './ac_signup.html';

const logger = Logger.get();

Template.ac_signup.onCreated( function(){
    const self = this;

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
            //logger.debug( 'checks()', event.type, data );
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
            let wants = 1;
            let has = 0;
            if( !self.AC.twiceOk.get()){
                self.$( '.ac-twice-passwords-sub' ).trigger( 'ac-check' );
            } else {
                has += 1;
            }
            // if an email is wanted, it must be set here
            if( self.AC.haveEmailAddress()){
                wants += 1;
                if( !self.AC.emailOk.get()){
                    self.$( '.ac-input-email-sub' ).trigger( 'ac-check' );
                } else {
                    has += 1;
                }
            }
            // if a username is wanted, it must be set here
            if( self.AC.haveUsername()){
                wants += 1;
                if( !self.AC.usernameOk.get()){
                    self.$( '.ac-input-username-sub' ).trigger( 'ac-check' );
                } else {
                    has += 1;
                }
            }
            if( has > 0 && has !== wants ){
                if( self.AC.haveEmailAddress() && !self.AC.emailOk.get()){
                    self.$( '.ac-signup' ).trigger( 'ac-display-error', pwixI18n.label( I18N, 'signup.email_missing' ));

                } else if( self.AC.haveUsername() && !self.AC.usernameOk.get()){
                    self.$( '.ac-signup' ).trigger( 'ac-display-error', pwixI18n.label( I18N, 'signup.username_missing' ));

                } else if( !self.AC.twiceOk.get()){
                    self.$( '.ac-signup' ).trigger( 'ac-display-error', pwixI18n.label( I18N, 'signup.password_missing' ));
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
            return Template.currentData().AC.options.signupHaveEmailAddress() !== AccountsCore.C.Identifier.NONE;
        },

        haveUsername(){
            return Template.currentData().AC.options.signupHaveUsername() !== AccountsCore.C.Identifier.NONE;
        },

        // not only we have to clear all the fields, but also our internal datas
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
    self.AC.emailOk.set( Template.currentData().AC.options.signupHaveEmailAddress() !== AccountsCore.C.Identifier.MANDATORY );
    self.AC.usernameOk.set( Template.currentData().AC.options.signupHaveUsername() !== AccountsCore.C.Identifier.MANDATORY);

    // track the status of sub-components
    self.autorun(() => {
        //logger.debug( 'emailOk', self.AC.emailOk.get(), 'twiceOk', self.AC.twiceOk.get(), 'usernameOk', self.AC.usernameOk.get());
    });
});

Template.ac_signup.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const ok = self.AC.emailOk.get() && self.AC.usernameOk.get() && self.AC.twiceOk.get();
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

    // at first render, re-check panel
    self.AC.checkPanel();
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
            withMandatoryField: this.AC.options.signupHaveEmailAddress() === AccountsCore.C.Identifier.MANDATORY,
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
            withMandatoryField: this.AC.options.signupHaveUsername() === AccountsCore.C.Identifier.MANDATORY
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
        instance.AC.checks( event, data );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-signup'( event, instance, data ){
        instance.AC.checks( event, data );
    },

    // message sent by the input username component
    'ac-username-data .ac-signup'( event, instance, data ){
        instance.AC.checks( event, data );
    },

    // message sent from acUserLogin after having successfully created a new user
    //  clear the input fields to prepare the creation of another account
    'ac-clear-panel .ac-signup'( event, instance ){
        instance.AC.clearPanel();
        return false;
    }
});
