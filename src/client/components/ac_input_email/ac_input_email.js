/*
 * pwix:accounts/src/client/components/ac_input_email/ac_input_email.js
 *
 * Email input field
 * 
 * Parms:
 *  - label: String, defaulting to 'Mail address'
 *  - placeholder: String, defaulting to 'Enter your email address'
 *  - syntax: true|false whether to check the email syntax, defaulting to true
 *  - new: true|false whether to check for non-yet existant, defaulting to false
 */

import emailValidator from 'email-validator';

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_email.html';

Template.ac_input_email.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        inputField: null,
        errorMsg: new ReactiveVar( '' ),
        checkSyntax: new ReactiveVar( true ),
        checkNew: new ReactiveVar( true ),

        // check the current input field (only if new)
        //  let the error message empty if field is empty
        check(){
            let promise = Promise.resolve( true );
            let ok = true;
            self.AC.errorMsg.set( '' );
            let val = self.AC.inputField.val().trim();
            //console.log( 'syntax='+self.AC.checkSyntax.get(), 'new='+self.AC.checkNew.get());
            promise = promise
                .then(() => {
                    if( ok && self.AC.checkSyntax.get() && val.length && !emailValidator.validate( val )){
                        ok = false;
                        self.AC.errorMsg.set( self.AC.i18n( 'invalid' ));
                    }
                    return ok;
                })
                .then(() => {
                    return ok && self.AC.checkNew.get() && val.length ? Meteor.callPromise( 'pwiAccounts.byEmailAddress', val ) : ok;
                })
                .then(( res, err ) => {
                    if( ok && self.AC.checkNew.get() && val.length ){
                        if( err ){
                            console.error( err );
                        } else if( res ){
                            ok = false;
                            self.AC.errorMsg.set( self.AC.i18n( 'already_exists' ));
                        } else {
                            self.AC.errorMsg.set( '' );
                        }
                    }
                    return ok;
                })
                .then(() => {
                    if( ok && !val.length ){
                        ok = pwiAccounts.opts().haveEmailAddress() === AC_FIELD_OPTIONAL;
                        self.AC.errorMsg.set( '' );
                    }
                    return ok;
                })
                .then(() => {
                    //console.log( 'sending', { ok: ok, username: val });
                    self.$( '.ac-input-email' ).trigger( 'ac-email-data', { ok: ok, email: val });
                    return ok;
                });
        },

        // provides a translated label
        i18n( key ){
            return i18n.label( AC_I18N, 'input_email.'+key );
        },

        // reinitialize the form
        reset(){
            self.$( 'input' ).val( '' );
            if( self.AC.checkSyntax.get() || self.AC.checkNew.get()){
                self.AC.check();
            }
        }
    };

    // setup reactive vars
    self.autorun(() => {
        const syntax = Template.currentData().syntax;
        if( syntax === true || syntax === false ){
            self.AC.checkSyntax.set( syntax );
        } else {
            self.AC.checkSyntax.set( true );
        }
    });

    // setup reactive vars
    self.autorun(() => {
        const newx = Template.currentData().new;
        if( newx === true || newx === false ){
            self.AC.checkNew.set( newx );
        } else {
            self.AC.checkNew.set( false );
        }
    });
});

Template.ac_input_email.onRendered( function(){
    const self = this;

    // get the input field
    self.AC.inputField = self.$( '.ac-input-email input' );

    // initialize the form
    self.AC.reset();
});

Template.ac_input_email.helpers({
    // whether we have to check anything
    checks(){
        const AC = Template.instance().AC;
        return AC.checkSyntax.get() || AC.checkNew.get();
    },

    // an error message if new password
    errorMsg(){
        return '<p>'+Template.instance().AC.errorMsg.get()+'</p>';
    },

    // whether the username is marked as mandatory ?
    //  true if field is required and new account
    mandatory(){
        return this.new && pwiAccounts.opts().haveEmailAddress() === AC_FIELD_MANDATORY;
    },

    // returns the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : Template.instance().AC.i18n( key );
    }
});

Template.ac_input_email.events({
    'keyup input'( event, instance ){
        instance.AC.check();
    },

    // reset the form
    'ac-reset-input .ac-input-email'( event, instance ){
        instance.AC.reset();
    }
});
