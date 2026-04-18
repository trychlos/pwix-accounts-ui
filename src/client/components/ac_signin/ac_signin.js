/*
 * pwix:accounts-ui/src/client/components/ac_signin/ac_signin.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsCore } from 'meteor/pwix:accounts-core';
import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_email/ac_input_email.js';
import '../ac_input_password/ac_input_password.js';
import '../ac_input_userid/ac_input_userid.js';
import '../ac_input_username/ac_input_username.js';

import './ac_signin.html';

const logger = Logger.get();

Template.ac_signin.onCreated( function(){
    const self = this;

    self.AC = {
        emailOk: new ReactiveVar( false ),
        emailValue: new ReactiveVar( null ),
        passwordOk: new ReactiveVar( false ),
        passwordValue: new ReactiveVar( null ),
        usernameOk: new ReactiveVar( false ),
        usernameValue: new ReactiveVar( null ),
        useridOk: new ReactiveVar( false ),
        useridValue: new ReactiveVar( null ),
        inCheck: false,

        // checks: enable the submit button if both fields are set
        //  this is enough to try to connect
        checks( event, data ){
            switch( event.type ){
                case 'ac-email-data':
                    if( self.AC.checkEmail( data ) && !self.AC.inCheck ){
                        self.AC.checkPanel();
                    }
                    break;
                case 'ac-password-data':
                    if( self.AC.checkPassword( data ) && !self.AC.inCheck ){
                        self.AC.checkPanel();
                    }
                    break;
                case 'ac-userid-data':
                    if( self.AC.checkUserid( data ) && !self.AC.inCheck ){
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
            let wants = 1;  // we want at least a password
            let has = 0;    // and don't have any at the moment
            if( !self.AC.passwordOk.get()){
                self.$( '.ac-input-password' ).trigger( 'ac-check' );
            } else {
                has += 1;
            }
            // if an email is wanted, it must be set here
            if( self.AC.onlyEmailAddress()){
                wants += 1;
                if( !self.AC.emailOk.get()){
                    self.$( '.ac-input-email-sub' ).trigger( 'ac-check' );
                } else {
                    has += 1;
                }
            // if a username is wanted, it must be set here
            } else if( self.AC.onlyUsername()){
                wants += 1;
                if( !self.AC.usernameOk.get()){
                    self.$( '.ac-input-username-sub' ).trigger( 'ac-check' );
                } else {
                    has += 1;
                }
            // else we want a userid
            } else {
                wants += 1;
                if( !self.AC.useridOk.get()){
                    self.$( '.ac-input-userid' ).trigger( 'ac-check' );
                } else {
                    has += 1;
                }
            }
            if( has > 0 && has !== wants ){
                let errorDisplayed = false;
                if( self.AC.onlyEmailAddress()){
                    if( !self.AC.emailOk.get()){
                        self.$( '.ac-signin' ).trigger( 'ac-display-error', pwixI18n.label( I18N, 'signin.email_missing' ));
                        errorDisplayed = true;
                    }
                    self.AC.usernameOk.set( true );
                    self.AC.useridOk.set( true );

                } else if( self.AC.onlyUsername()){
                    if( !self.AC.usernameOk.get()){
                        self.$( '.ac-signin' ).trigger( 'ac-display-error', pwixI18n.label( I18N, 'signin.username_missing' ));
                        errorDisplayed = true;
                    }
                    self.AC.emailOk.set( true );
                    self.AC.useridOk.set( true );

                } else {
                    if( !self.AC.useridOk.get()){
                        self.$( '.ac-signin' ).trigger( 'ac-display-error', pwixI18n.label( I18N, 'signin.userid_missing' ));
                        errorDisplayed = true;
                    }
                    self.AC.emailOk.set( true );
                    self.AC.usernameOk.set( true );
                }
                if( !errorDisplayed && !self.AC.passwordOk.get()){
                    self.$( '.ac-signin' ).trigger( 'ac-display-error', pwixI18n.label( I18N, 'signin.password_missing' ));
                    errorDisplayed = true;
                }
            }
            self.AC.inCheck = false;
        },

        checkPassword( data ){
            self.AC.passwordOk.set( data.ok );
            self.AC.passwordValue.set( data.username );
            return data.ok;
        },

        checkUserid( data ){
            self.AC.useridOk.set( data.ok );
            self.AC.useridValue.set( data.username );
            return data.ok;
        },

        checkUsername( data ){
            self.AC.usernameOk.set( data.ok );
            self.AC.usernameValue.set( data.username );
            return data.ok;
        },

        // enable the submit button
        enableSubmit( enable ){
            self.$( '.ac-signin ').closest( '.ac-content' ).find( '.ac-submit' ).prop( 'disabled', !enable );
        },

        // whether we want an email address
        onlyEmailAddress(){
            const acName = Template.currentData().AC.options.acName();
            const acInstance = AccountsCore.getInstance( acName );
            assert( acInstance && acInstance instanceof AccountsCore.Account, 'expects an instance of AccountsCore.Account, got '+acInstance );
            return acInstance.emailAtLeastOne() && !acInstance.usernameMayHaveOne();
        },

        // whether we have username and not email address
        onlyUsername(){
            const acName = Template.currentData().AC.options.acName();
            const acInstance = AccountsCore.getInstance( acName );
            assert( acInstance && acInstance instanceof AccountsCore.Account, 'expects an instance of AccountsCore.Account, got '+acInstance );
            return !acInstance.emailMayHaveOne() && acInstance.usernameAtLeastOne();
        },
    };
});

Template.ac_signin.onRendered( function(){
    const self = this;

    // monitor the panel status to enable the submit button
    self.autorun(() => {
        const ok = self.AC.emailOk.get() && self.AC.usernameOk.get() && self.AC.useridOk.get() && self.AC.passwordOk.get();
        self.$( '.ac-signin' ).closest( '.ac-content' ).find( '.ac-submit' ).prop( 'disabled', !ok );
        // ac-signin is rendered before acUserLogin in div context
        const target = Template.currentData().AC.target || self.$( '.ac-signin' );
        target.trigger( 'ac-signin-ok', {
            ok: ok,
            email: self.AC.emailValue.get(),
            userid: self.AC.useridValue.get(),
            username: self.AC.usernameValue.get(),
            password: self.AC.passwordValue.get()
        });
    });

    // monitor the modal events if apply
    Template.currentData().AC.monitorModalEvents( self.$( '.ac-signin' ));

    // at first render, re-check panel
    self.AC.checkPanel();
});

Template.ac_signin.helpers({
    // true if we have email address and not username
    onlyEmailAddress(){
        return Template.instance().AC.onlyEmailAddress();
    },

    // true if we have username and not email address
    onlyUsername(){
        return Template.instance().AC.onlyUsername();
    },

    parmsEmail(){
        return {
            ...this,
            ...{
                withFieldset: this.AC.options.signinFieldset()
            }
        }
    },

    // parameters for the ac_error_msg component
    parmsErrorMsg(){
        const parms = {
            ...this,
            withErrorArea: AccountsUI.fn.hasErrorArea( this ),
            errorMsgRv: AccountsUI.fn.errorMsgRv()
        };
        return parms;
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
    // message sent by the email address input component
    'ac-email-data .ac-signin'( event, instance, data ){
        instance.AC.checks( event, data );
    },

    // message sent by the password input component
    'ac-password-data .ac-signin'( event, instance, data ){
        instance.AC.checks( event, data );
    },

    // message sent by the userid input component
    'ac-userid-data .ac-signin'( event, instance, data ){
        instance.AC.checks( event, data );
    },

    // message sent by the username input component
    'ac-username-data .ac-signin'( event, instance, data ){
        instance.AC.checks( event, data );
    }
});
