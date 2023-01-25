/*
 * pwix:accounts/src/client/components/ac_input_email/ac_input_email.js
 *
 * Email input field
 * 
 * Parms:
 *  - label: String, defaulting to 'Mail address'
 *  - placeholder: String, defaulting to 'Enter your email address'
 */

import emailValidator from 'email-validator';

import { pwiI18n } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import './ac_input_email.html';

Template.ac_input_email.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        inputField: null,
        errorMsg: new ReactiveVar( '' ),

        // check the current input field (only if new)
        //  let the error message empty if field is empty
        check(){
            let promise = Promise.resolve( true );
            let ok = true;
            let val = self.AC.inputField.val().trim();
            promise = promise
                .then(() => {
                    if( ok && val.length && !emailValidator.validate( val )){
                        ok = false;
                        self.AC.errorMsg.set( self.AC.i18n( 'invalid' ));
                    }
                    return ok;
                })
                .then(() => {
                    return ok && val.length ? Meteor.callPromise( 'pwiAccounts.existsEmailAddress', val ) : ok;
                })
                .then(( res, err ) => {
                    if( ok && val.length ){
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
                        ok = pwiAccounts.conf.haveEmailAddress === AC_FIELD_OPTIONAL;
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
            return pwiI18n.label( pwiAccounts.strings, 'input_email', key );
        },

        // reinitialize the form
        reset(){
            self.$( 'input' ).val( '' );
            if( Template.currentData().new ){
                self.AC.check();
            }
        }
    };
});

Template.ac_input_email.onRendered( function(){
    const self = this;

    // get the input field
    self.AC.inputField = self.$( '.ac-input-email input' );

    // initialize the form
    if( Template.currentData().new ){
        self.AC.check();
    }
});

Template.ac_input_email.helpers({
    // an error message if new password
    errorMsg(){
        return '<p>'+Template.instance().AC.errorMsg.get()+'</p>';
    },

    // whether we are entering a new username
    isNew(){
        return this.new || false;
    },

    // whether the username is marked as mandatory ?
    //  true if field is required and new account
    mandatory(){
        return this.new && pwiAccounts.conf.haveUsername === AC_FIELD_MANDATORY;
    },

    // returns the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : Template.instance().AC.i18n( key );
    }
});

Template.ac_input_email.events({
    'keyup input'( event, instance ){
        if( Template.currentData().new ){
            instance.AC.check();
        }
    },

    // reset the form
    'ac-reset-input .ac-input-email'( event, instance ){
        instance.AC.reset();
    }
});
