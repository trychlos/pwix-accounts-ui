/*
 * pwix:accounts/src/client/components/ac_input_username/ac_input_username.js
 *
 * Email input field
 * 
 * Parms:
 *  - label: String, defaulting to 'Username'
 *  - placeholder: String, defaulting to 'Enter your username'
 *  - new: Boolean, whether we are entering a new username, defaulting to false
 */
import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_username.html';

Template.ac_input_username.onCreated( function(){
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
                    if( ok && val.length && val.length < pwiAccounts.conf.usernameLength ){
                        ok = false;
                        self.AC.errorMsg.set( self.AC.i18n( 'too_short' ));
                    }
                    return ok;
                })
                .then(() => {
                    return ok && val.length ? Meteor.callPromise( 'pwiAccounts.byUsername', val ) : ok;
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
                        ok = pwiAccounts.conf.haveUsername === AC_FIELD_OPTIONAL;
                        self.AC.errorMsg.set( '' );
                    }
                    return ok;
                })
                .then(() => {
                    //console.log( 'sending', { ok: ok, username: val });
                    self.$( '.ac-input-username' ).trigger( 'ac-username-data', { ok: ok, username: val });
                    return ok;
                });
        },

        // provides a translated label
        i18n( key ){
            return i18n.label( AC_I18N, 'input_username.'+key );
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

Template.ac_input_username.onRendered( function(){
    const self = this;

    // get the input field
    self.AC.inputField = self.$( '.ac-input-username input' );

    // initialize the form
    if( Template.currentData().new ){
        self.AC.check();
    }
});

Template.ac_input_username.helpers({
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

    // returns the keyed translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : Template.instance().AC.i18n( key );
    }
});

Template.ac_input_username.events({
    'keyup input'( event, instance ){
        if( Template.currentData().new ){
            instance.AC.check();
        }
    },

    // reset the form
    'ac-reset-input .ac-input-username'( event, instance ){
        instance.AC.reset();
    }
});
