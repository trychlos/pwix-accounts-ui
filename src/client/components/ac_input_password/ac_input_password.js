/*
 * pwix:accounts-ui/src/client/components/ac_input_password/ac_input_password.js
 *
 * Password input field.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *      Is undefined when invoked from ac_reset_pwd template (via ac_twice_passwords)
 *      Take care!
 *  - acName: the AccountsCore.Account instance name (passed from reset_ask through URL parameters)
 *      set from ac_reset_pwd (so exclusive from AC above)
 *  - wantsLength: whether to check against the minimal length of the password, defaulting to false
 *  - wantsStrength: whether to check for input password strength, defaulting to false
 *  - withAutocomplete: whether to have an autocomplete attribute, defaulting to false (to be set to true for a login panel)
 *  - withErrorArea: whether we want a dedicated error message area here, defaulting to false
 *  - withMandatoryBorder: whether we want display the mandatory borders on input field, defaulting to acUserLogin configured option
 *  - withMandatoryField: whether we want display the mandatory indicator, defaulting to false
 *  - label: the form label, defaulting to 'Password'
 *  - placeholder: the input placeholder, defaulting to 'Enter your password'
 *  - strength: the div label, defaulting to 'Strength:'
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsCore } from 'meteor/pwix:accounts-core';
import { Logger } from 'meteor/pwix:logger';
import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_password.html';

const logger = Logger.get();

Template.ac_input_password.onCreated( function(){
    const self = this;

    self.AC = {
        errorMsg: new ReactiveVar( '' ),
        acInstance: null,

        score: [
            { k:AccountsCore.C.Password.VERYWEAK,   css: { backgroundColor: '#ff0000' }}, // red
            { k:AccountsCore.C.Password.WEAK,       css: { backgroundColor: '#cc3300' }},
            { k:AccountsCore.C.Password.MEDIUM,     css: { backgroundColor: '#669900' }},
            { k:AccountsCore.C.Password.STRONG,     css: { backgroundColor: '#33cc00' }},
            { k:AccountsCore.C.Password.VERYSTRONG, css: { backgroundColor: '#00ff00' }}, // green
        ],
        minScore: -1,

        // check the strength of the password with https://www.npmjs.com/package/zxcvbn
        //  is only called for a new password
        check(){
            self.AC.displayError( '' );
            const wantsLength = Template.currentData().wantsLength === true;
            const wantsStrength = Template.currentData().wantsStrength === true;
            if( self.AC.acInstance ){
                self.AC.acInstance.checkPassword( self.$( '.ac-input-password input' ).val() || '', { testLength: wantsLength, testComplexity: wantsStrength })
                    .then(( result ) => {
                        //logger.debug( 'result', result );
                        if( wantsStrength ){
                            // css
                            self.$( '.ac-strength-bar' ).css( self.AC.score[result.zxcvbn.score].css );
                            let width = result.canonical.length ? 1+parseInt( result.zxcvbn.score ) : 0;
                            self.$( '.ac-strength-bar' ).css({ width: width+'em' });
                            width = 5-width;
                            self.$( '.ac-strength-other' ).css({ width: width+'em' });
                        }
                        if( !result.ok ){
                            self.AC.displayError( result.errors[0] );
                        }
                        // advertises of the current password characteristics
                        const data = {
                            ok: result.ok,
                            score: result.zxcvbn.score,
                            strength: self.AC.score[result.zxcvbn.score].k,
                            password: result.canonical
                        };
                        self.$( '.ac-input-password' ).trigger( 'ac-password-data', data );
                    });
            }
        },

        // display an error message, either locally (here) or at the panel level
        displayError( msg ){
            const withErrorArea = Boolean( Blaze.getData( self.view ).withErrorArea === true );
            if( withErrorArea ){
                self.AC.errorMsg.set( msg );
            } else {
                self.$( '.ac-input-password' ).trigger( 'ac-display-error', msg );
            }
        },

        // reinitialize the form
        reset(){
            self.$( 'input' ).val( '' );
            self.AC.check();
        }
    };

    self.autorun(() => {
        const AC = Template.currentData().AC;
        const acName = AC ? AC.options.acName() : Template.currentData().acName;
        if( acName ){
            const acInstance = AccountsCore.getInstance( acName );
            assert( acInstance && acInstance instanceof AccountsCore.Account, 'expects an instance of AccountsCore.Account, got '+acInstance );
            self.AC.acInstance = acInstance;
            // compute the minimal required score according to the configured required strength
            const requiredStrength = acInstance.opts().passwordStrength();
            for( let i=0 ; i<self.AC.score.length ; ++i ){
                if( self.AC.score[i].k === requiredStrength ){
                    self.AC.minScore = i;
                    break;
                }
            }
        }
    });
});

Template.ac_input_password.onRendered( function(){
    // initialize the form, so that is is checked (though empty) and send the input-password status event
    this.AC.reset();
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
            logger.warn( 'no withMandatoryBorder in data context, and AC not provided' );
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
    },

    // whether we want display an indicator of the password strength, defaulting to false
    withStrength(){
        return this.wantsStrength === true;
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
