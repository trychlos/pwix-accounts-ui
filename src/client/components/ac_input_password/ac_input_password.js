/*
 * pwix:accounts-ui/src/client/components/ac_input_password/ac_input_password.js
 *
 * Password input field
 * 
 * Parms:
 *  - label: String, defaulting to 'Password'
 *  - placeholder: String, defaulting to 'Enter your password'
 *  - new: Boolean, true for entering a new password (so to be checked for its strength)
 */
import zxcvbn from 'zxcvbn';

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import '../ac_mandatory_field/ac_mandatory_field.html';

import './ac_input_password.html';

Template.ac_input_password.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        inputField: null,
        errorMsg: new ReactiveVar( '' ),

        score: [
            { k:AC_PWD_VERYWEAK,   css: { backgroundColor: '#ff0000' }}, // red
            { k:AC_PWD_WEAK,       css: { backgroundColor: '#cc3300' }},
            { k:AC_PWD_MEDIUM,     css: { backgroundColor: '#669900' }},
            { k:AC_PWD_STRONG,     css: { backgroundColor: '#33cc00' }},
            { k:AC_PWD_VERYSTRONG, css: { backgroundColor: '#00ff00' }}, // green
        ],
        minScore: -1,

        // check the strength of the password with https://www.npmjs.com/package/zxcvbn
        //  is only called for a new password
        check(){
            const val = self.AC.inputField.val() || '';
            const res = zxcvbn( val );
            self.$( '.ac-strength-bar' ).css( self.AC.score[res.score].css );
            let width = val.trim().length ? 1+parseInt( res.score ) : 0;
            self.$( '.ac-strength-bar' ).css({ width: width+'em' });
            width = 5-width;
            self.$( '.ac-strength-other' ).css({ width: width+'em' });
            // computes the error message (empty if field is empty)
            //console.log( 'res.score='+res.score, 'minScore='+self.AC.minScore, 'passwordStrrngth='+pwixAccounts.opt().passwordStrength());
            let ok = true;
            if( val.length ){
                if( val.length < pwixAccounts.opts().passwordLength()){
                    ok = false;
                    self.AC.errorMsg.set( self.AC.i18n( 'too_short' ));
                } else if( res.score < self.AC.minScore ){
                    ok = false;
                    self.AC.errorMsg.set( self.AC.i18n( 'too_weak' ));
                } else {
                    self.AC.errorMsg.set( '' );
                }
            } else {
                ok = false;
                self.AC.errorMsg.set( '' );
            }
            // advertises of the current password characteristics
            self.$( '.ac-input-password' ).trigger( 'ac-password-data', { ok: ok, score: res.score, strength: self.AC.score[res.score].k, length: val.length });
        },

        // provides a translated label
        i18n( key ){
            return i18n.label( I18N, 'input_password.'+key );
        },

        // reinitialize the form
        reset(){
            self.$( 'input' ).val( '' );
            if( Template.currentData().new ){
                self.AC.check();
            }
        }
    };

    // compute the minimal required score according to the configures minimal strength
    let i = 0;
    self.AC.score.every(( it ) => {
        if( it.k === pwixAccounts.opts().passwordStrength()){
            self.AC.minScore = i;
            return false;
        }
        i += 1;
        return true;
    });
});

Template.ac_input_password.onRendered( function(){
    const self = this;

    // get the input field
    self.AC.inputField = self.$( '.ac-input-password input' );

    // initialize the form
    if( Template.currentData().new ){
        self.AC.check();
    }
});

Template.ac_input_password.helpers({
    // an error message if new password
    errorMsg(){
        const str = Template.instance().AC.errorMsg.get();
        return str.length ? str : ' ';
    },

    // whether we are entering a new password
    isNew(){
        return this.new || false;
    },

    // returns the default text or the provided one
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : Template.instance().AC.i18n( key );
    }
});

Template.ac_input_password.events({
    'click .ac-eye'( event, instance ){
        const current = instance.AC.inputField.attr( 'type' );
        if( current === 'password' ){
            instance.AC.inputField.attr( 'type', 'text' );
            $( event.currentTarget ).addClass( 'fa-regular fa-eye' ); 
            $( event.currentTarget ).removeClass( 'fa-eye-slash' ); 
        } else {
            instance.AC.inputField.attr( 'type', 'password' );
            $( event.currentTarget ).addClass( 'fa-regular fa-eye-slash' ); 
            $( event.currentTarget ).removeClass( 'fa-eye' ); 
        }
    },

    'keyup input'( event, instance ){
        if( Template.currentData().new ){
            instance.AC.check();
        }
    },

    // reset order sent by the parent form (at least as first initialization)
    'ac-reset-input .ac-input-password'( event, instance ){
        instance.AC.reset();
    }
});
