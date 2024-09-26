/*
 * pwix:accounts-ui/src/client/components/ac_input_username/ac_input_username.js
 *
 * Username input field
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *  - wantsNew: whether an existing username must be reported as an error, defaulting to false
 *  - withErrorArea: whether we want a dedicated error message area here, defaulting to false
 *  - withErrorMsg: whether this component should send error message, defaulting to false
 *  - withMandatoryBorder: whether we want display the mandatory borders on input field, defaulting to acUserLogin configured option
 *  - withMandatoryField: whether we want display the mandatory indicator, defaulting to false
 *  - label: the form label, defaulting to 'Username:'
 *  - legend: the fieldset legend, defaulting to 'Username'
 *  - placeholder: the input placeholder, defaulting to 'Enter your password'
 */

import { AccountsHub } from 'meteor/pwix:accounts-hub';
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
        ahInstance: null,

        // check the current input field (only if new)
        //  let the error message empty if field is empty
        check(){
            self.AC.displayError( '' );
            const wantsNew = Boolean( Template.currentData().wantsNew === true );
            if( self.AC.ahInstance ){
                self.AC.ahInstance.checkUsername( self.$( '.ac-input-username input' ).val() || '', {
                    testEmpty: Template.currentData().AC.options.signupHaveUsername(),
                    textExists: wantsNew
                })
                .then(( result ) => {
                    // only display error message if field is not empty
                    if( !result.ok && result.canonical.length ){
                        self.AC.displayError( result.errors[0] );
                    }
                    self.$( '.ac-input-username-sub' ).trigger( 'ac-username-data', { ok: result.ok, username: result.username });
                });
            }
        },

        // display an error message, either locally (here) or at the panel level
        displayError( msg ){
            // see https://stackoverflow.com/questions/39271499/template-actual-data-context/39272483#39272483
            // function context here doesn't let Template.currentData() find a current view as we are called from inside a Promise.then()
            const withErrorArea = Boolean( Blaze.getData( self.view ).withErrorArea === true );
            const withErrorMsg = Boolean( Blaze.getData( self.view ).withErrorMsg === true );
            if( withErrorMsg ){
                if( withErrorArea ){
                    self.AC.errorMsg.set( msg );
                } else {
                    self.$( '.ac-input-username' ).trigger( 'ac-display-error', msg );
                }
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
            const ahName = AC.options.ahName();
            if( ahName ){
                const ahInstance = AccountsHub.instances[ahName];
                assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
                self.AC.ahInstance = ahInstance;
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
