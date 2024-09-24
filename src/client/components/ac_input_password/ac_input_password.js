/*
 * pwix:accounts-ui/src/client/components/ac_input_password/ac_input_password.js
 *
 * Password input field.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *      Is undefined when invoked from ac_reset_pwd template (via ac_twice_passwords)
 *      Take care!
 *  - wantsLength: whether to check against the minimal length of the password, defaulting to false
 *  - wantsComplexity: whether to check for input password strength, defaulting to false
 *  - withAutocomplete: whether to have an autocomplete attribute, defaulting to false (to be set to true for a login panel)
 *  - withErrorArea: whether we want a dedicated error message area here, defaulting to false
 *  - withErrorMsg: whether this component should send error message, defaulting to false
 *  - withMandatoryBorder: whether we want display the mandatory borders on input field, defaulting to acUserLogin configured option
 *  - withMandatoryField: whether we want display the mandatory indicator, defaulting to false
 *  - label: the form label, defaulting to 'Password'
 *  - placeholder: the input placeholder, defaulting to 'Enter your password'
 *  - strength: the div label, defaulting to 'Strength:'
 *  */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_password.html';

Template.ac_input_password.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        errorMsg: new ReactiveVar( '' ),

        score: [
            { k:AccountsUI.C.Password.VERYWEAK,   css: { backgroundColor: '#ff0000' }}, // red
            { k:AccountsUI.C.Password.WEAK,       css: { backgroundColor: '#cc3300' }},
            { k:AccountsUI.C.Password.MEDIUM,     css: { backgroundColor: '#669900' }},
            { k:AccountsUI.C.Password.STRONG,     css: { backgroundColor: '#33cc00' }},
            { k:AccountsUI.C.Password.VERYSTRONG, css: { backgroundColor: '#00ff00' }}, // green
        ],
        minScore: -1,

        // check the strength of the password with https://www.npmjs.com/package/zxcvbn
        //  is only called for a new password
        // on a new account (which must be specified in data context), we advertise the caller with full data
        //  else (e.g. signin) we just advertise of the input event
        check(){
            self.AC.displayError( '' );
            const wantsLength = Template.currentData().wantsLength == true;
            const wantsStrength = Template.currentData().wantsStrength == true;
            const result = AccountsUI._checkPassword( self.$( '.ac-input-password input' ).val() || '', { testLength: wantsLength, testComplexity: wantsStrength });
            //console.debug( result );
            if( wantsStrength ){
                // css
                self.$( '.ac-strength-bar' ).css( self.AC.score[result.zxcvbn.score].css );
                let width = result.password.length ? 1+parseInt( result.zxcvbn.score ) : 0;
                self.$( '.ac-strength-bar' ).css({ width: width+'em' });
                width = 5-width;
                self.$( '.ac-strength-other' ).css({ width: width+'em' });
            }
            // only display error message if field is not empty
            if( !result.ok && result.password.length ){
                self.AC.displayError( result.errors[0] );
            }
            // advertises of the current password characteristics
            const data = {
                ok: result.ok,
                score: result.zxcvbn.score,
                strength: AccountsUI._scores[result.zxcvbn.score],
                password: result.password
            };
            //console.debug( 'sending ac-password-data with', data );
            self.$( '.ac-input-password' ).trigger( 'ac-password-data', data );
        },

        // display an error message, either locally (here) or at the panel level
        displayError( msg ){
            // this code to be consistent with other input components which are called from inside a Promise.then()
            //  though we could use here the usual Template.currentData()
            const withErrorArea = Boolean( Blaze.getData( self.view ).withErrorArea === true );
            const withErrorMsg = Boolean( Blaze.getData( self.view ).withErrorMsg === true );
            if( withErrorMsg ){
                if( withErrorArea ){
                    self.AC.errorMsg.set( msg );
                } else {
                    self.$( '.ac-input-password' ).trigger( 'ac-display-error', msg );
                }
            }
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
});

Template.ac_input_password.onRendered( function(){
    const self = this;

    // initialize the form
    self.AC.check();
});

Template.ac_input_password.helpers({

    // whether we have an autocomplete on this field ?
    autocomplete(){
        return this.withAutocomplete === true ? 'pwix:accounts-ui password' : 'off';
    },

    // whether the mandatory field must exhibit an ad-hoc colored border ?
    mandatoryBorder(){
        let classe = '';
        if( Object.keys( this ).includes( 'withMandatoryBorder' )){
            classe = this.withMandatoryBorder ? 'ac-mandatory-border' : '';
        } else if( this.AC && this.AC.options ){
            classe = this.AC.options.coloredBorders() === AccountsUI.C.Colored.MANDATORY ? 'ac-mandatory-border' : '';
        } else {
            console.warn( 'no withMandatoryBorder in data context, and AC not provided' );
        }
        return classe;
    },

    // parameters for the ac_error_msg component
    parmsErrorMsg(){
        return {
            ...this,
            errorMsgRv: Template.instance().AC.errorMsg
        };
    },

    // returns the text, maybe from data context, defaulting to the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_password.'+key );
    }
});

Template.ac_input_password.events({
    // toggle the display of the clear password
    'click .ac-eye'( event, instance ){
        const $field = instance.$( '.ac-input-password input');
        if( $field.length ){
            const current = $field.attr( 'type' );
            if( current === 'password' ){
                $field.attr( 'type', 'text' );
                $( event.currentTarget ).addClass( 'fa-regular fa-eye' ); 
                $( event.currentTarget ).removeClass( 'fa-eye-slash' ); 
            } else {
                $field.attr( 'type', 'password' );
                $( event.currentTarget ).addClass( 'fa-regular fa-eye-slash' ); 
                $( event.currentTarget ).removeClass( 'fa-eye' ); 
            }
        }
    },

    // check input
    'input .ac-input-password .ac-input'( event, instance ){
        instance.AC.check();
    },

    // we are asked to re-check
    'ac-check .ac-input-password'( event, instance ){
        instance.AC.check();
        return false;
    }
});
