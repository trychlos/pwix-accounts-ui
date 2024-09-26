/*
 * pwix:accounts-ui/src/client/components/ac_input_email/ac_input_email.js
 *
 * Email input field
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *  - wantsNew: whether an existing email must be reported as an error, defaulting to false
 *  - withErrorArea: whether we want a dedicated error message area here, defaulting to false
 *  - withErrorMsg: whether this component should send error message, defaulting to false
 *  - withFieldset: whether we want the input be inside a fieldset (which implies a legend), defaulting to false
 *  - withMandatoryField: whether we want display the mandatory indicator if applies, defaulting to false
 *  - label: the form label, defaulting to 'Email address:'
 *  - placeholder: the input placeholder, defaulting to 'Enter your email address, e.g. name@example.com'
 *  - legend: the fieldset legend, defaulting to legend translated from 'Email address'
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_email.html';

Template.ac_input_email.helpers({
    // returns the text, maybe from data context, defaulting to the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_email.'+key );
    }
});

/***
 *** sub-template
 ***/

 Template.ac_input_email_sub.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.AC = {
        errorMsg: new ReactiveVar( '' ),
        ahInstance: null,

        // check the current input field
        //  let the error message empty if field is empty
        check(){
            self.AC.displayError( '' );
            const wantsNew = Boolean( Template.currentData().wantsNew === true );
            if( self.AC.ahInstance ){
                self.AC.ahInstance.checkEmailAddress( self.$( '.ac-input-email-sub input' ).val(), { testExists: wantsNew })
                    .then(( result ) => {
                        //console.debug( result );
                        // only display an error message if field is not empty
                        if( result.canonical.length && !result.ok ){
                            self.AC.displayError( result.errors[0] );
                        }
                        self.$( '.ac-input-email-sub' ).trigger( 'ac-email-data', { ok: result.ok, email: result.email });
                    });
            }
        },

        // display an error message, either locally (here) or at the panel level
        displayError( msg ){
            //const withError = Boolean( Template.currentData().withError !== false );
            // see https://stackoverflow.com/questions/39271499/template-actual-data-context/39272483#39272483
            // function context here doesn't let Template.currentData() find a current view as we are called from inside a Promise.then()
            const withErrorArea = Boolean( Blaze.getData( self.view ).withErrorArea === true );
            const withErrorMsg = Boolean( Blaze.getData( self.view ).withErrorMsg === true );
            //console.debug( 'withErrorArea', withErrorArea, 'withErrorMsg', withErrorMsg, msg );
            if( withErrorMsg ){
                if( withErrorArea ){
                    self.AC.errorMsg.set( msg );
                } else {
                    self.$( '.ac-input-email-sub' ).trigger( 'ac-display-error', msg );
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

Template.ac_input_email_sub.onRendered( function(){
    // initialize the form, so that is is checked (though empty) and send the input-email status event
    this.AC.reset();
});

Template.ac_input_email_sub.helpers({
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

    // returns the text, maybe from data context, defaulting to the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_email.'+key );
    }
});

Template.ac_input_email_sub.events({
    // check input
    'input input.ac-input'( event, instance ){
        instance.AC.check();
    },

    // we are asked to re-check
    'ac-check .ac-input-email-sub'( event, instance ){
        instance.AC.check();
        return false;
    },
});
