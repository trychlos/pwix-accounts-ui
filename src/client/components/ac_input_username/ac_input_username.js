/*
 * pwix:accounts-ui/src/client/components/ac_input_username/ac_input_username.js
 *
 * Username input field
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *  - wantsNew: whether an existing username must be reported as an error, defaulting to false
 *  - withErrorArea: whether we want a dedicated error message area here, defaulting to false
 *  - withMandatoryBorder: whether we want display the mandatory borders on input field, defaulting to acUserLogin configured option
 *  - withMandatoryField: whether we want display the mandatory indicator, defaulting to false
 *  - label: the form label, defaulting to 'Username:'
 *  - legend: the fieldset legend, defaulting to 'Username'
 *  - placeholder: the input placeholder, defaulting to 'Enter your password'
 */

import { AccountsCore } from 'meteor/pwix:accounts-core';
import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_username.html';

Template.ac_input_username.helpers({
    // returns the text, maybe from data context, defaulting to the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_username.'+key );
    }
});

Template.ac_input_username_sub.onCreated( function(){
    const self = this;

    self.AC = {
        errorMsg: new ReactiveVar( '' ),
        acInstance: null,

        // check the current input field (only if new)
        //  let the error message empty if field is empty
        check(){
            self.AC.displayError( '' );
            const wantsNew = Boolean( Template.currentData().wantsNew === true );
            if( self.AC.acInstance ){
                self.AC.acInstance.checkUsername( self.$( '.ac-input-username input' ).val() || '', {
                    testEmpty: Template.currentData().AC.options.signupHaveUsername(),
                    textExists: wantsNew
                })
                .then(( result ) => {
                    if( !result.ok ){
                        self.AC.displayError( result.errors[0] );
                    }
                    self.$( '.ac-input-username-sub' ).trigger( 'ac-username-data', { ok: result.ok, username: result.canonical });
                });
            }
        },

        // display an error message, either locally (here) or at the panel level
        displayError( msg ){
            const withErrorArea = Boolean( Blaze.getData( self.view ).withErrorArea === true );
            if( withErrorArea ){
                self.AC.errorMsg.set( msg );
            } else {
                self.$( '.ac-input-username' ).trigger( 'ac-display-error', msg );
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
        if( AC ){
            const acName = AC.options.acName();
            if( acName ){
                const acInstance = AccountsCore.getInstance( acName );
                assert( acInstance && acInstance instanceof AccountsCore.Account, 'expects an instance of AccountsCore.Account, got '+acInstance );
                self.AC.acInstance = acInstance;
            }
        }
    });
});

Template.ac_input_username_sub.onRendered( function(){
    const self = this;

    // initialize the form
    self.AC.reset();
});

Template.ac_input_username_sub.helpers({
    // whether the mandatory field must exhibit an ad-hoc colored border ?
    mandatoryBorder(){
        return this.AC.options.coloredBorders() === AccountsUI.C.Colored.MANDATORY ? 'ac-mandatory-border' : '';
    },

    // parameters for the ac_error_msg component
    parmsErrorMsg(){
        return {
            ...this,
            errorMsgRv: Template.instance().AC.errorMsg
        };
    },

    // returns the keyed translated string
    text( key ){
        let res = Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_username.'+key );
        return res;
    }
});

Template.ac_input_username_sub.events({
    // check input
    'input input'( event, instance ){
        instance.AC.check();
    },

    // we are asked to re-check
    'ac-check .ac-input-username-sub'( event, instance ){
        instance.AC.check();
        return false;
    },
});
