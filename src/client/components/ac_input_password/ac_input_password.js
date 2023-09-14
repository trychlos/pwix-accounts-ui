/*
 * pwix:accounts-ui/src/client/components/ac_input_password/ac_input_password.js
 *
 * Password input field
 * 
 * Parms:
 *  - label: String, defaulting to 'Password'
 *  - placeholder: String, defaulting to 'Enter your password'
 *  - checkStrength: Boolean, should be true when entering the first occurrence of a new password
 *  - mandatoryBorder: whether to displayed a colored border for mandatory fields
 *  - new: Boolean, true for entering a new password (so to be checked for its strength)
 *  - autocomplete: boolean, whether to have an autocomplete attribute, defaulting to true
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import '../ac_mandatory_field/ac_mandatory_field.html';

import './ac_input_password.html';

Template.ac_input_password.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        inputField: null,
        errorMsg: new ReactiveVar( '' ),
        isNew : new ReactiveVar( false ),

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
        // on a new account (which must be specified in data context), we advertise the caller with full data
        //  else (e.g. signin) we just advertise of the input event
        check(){
            self.AC.errorMsg.set( '' );
            AccountsUI._checkPassword( self.AC.inputField.val() || '' )
                .then(( result ) => {
                    if( self.AC.isNew.get()){
                        // css
                        self.$( '.ac-strength-bar' ).css( self.AC.score[result.zxcvbn.score].css );
                        let width = result.password.length ? 1+parseInt( result.zxcvbn.score ) : 0;
                        self.$( '.ac-strength-bar' ).css({ width: width+'em' });
                        width = 5-width;
                        self.$( '.ac-strength-other' ).css({ width: width+'em' });
                        // only display error message if field is not empty
                        if( result.errors.length && result.password.length ){
                            self.AC.errorMsg.set( result.errors[0] );
                        }
                    }
                    // advertises of the current password characteristics
                    //console.debug( result );
                    self.$( '.ac-input-password' ).trigger( 'ac-password-data', {
                        ok: result.ok,
                        score: result.zxcvbn.score,
                        strength: AccountsUI._scores[result.zxcvbn.score],
                        length: result.password.length
                    });
                });
        },

        // provides a translated label
        i18n( key ){
            return pwixI18n.label( I18N, 'input_password.'+key );
        },

        // reinitialize the form
        reset(){
            self.$( 'input' ).val( '' );
            self.AC.check();
        }
    };

    // compute the minimal required score according to the configures minimal strength
    let i = 0;
    self.AC.score.every(( it ) => {
        if( it.k === AccountsUI.opts().passwordStrength()){
            self.AC.minScore = i;
            return false;
        }
        i += 1;
        return true;
    });

    // get the 'new' parameter
    self.autorun(() => {
        if( Template.currentData().new === true || Template.currentData().new === false ){
            self.AC.isNew.set( Template.currentData().new );
        }
    });
});

Template.ac_input_password.onRendered( function(){
    const self = this;

    // get the input field
    self.AC.inputField = self.$( '.ac-input-password input' );

    // initialize the form
    self.AC.check();
});

Template.ac_input_password.helpers({

    // whether we have an autocomplete on this field ?
    autocomplete(){
        const autocomplete = ( this.autocomplete === true || this.autocomplete === false ) ? this.autocomplete : true;
        return autocomplete ? 'pwix:accounts-ui password' : 'off';
    },

    // whether we must check the strength ?
    checkStrength(){
        return this.checkStrength || false;
    },

    // an error message if new password
    errorMsg(){
        const str = Template.instance().AC.errorMsg.get();
        return str.length ? str : ' ';
    },

    // whether we are entering a new password
    isNew(){
        return this.new || false;
    },

    // whether the mandatory field must exhibit an ad-hoc colored border ?
    mandatoryBorder(){
        return this.mandatoryBorder ? 'ac-mandatory-border' : '';
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

    'input .ac-input-password .ac-input'( event, instance ){
        instance.AC.check();
    },

    // reset order sent by the parent form (at least as first initialization)
    'ac-reset-input .ac-input-password'( event, instance ){
        instance.AC.reset();
    }
});
