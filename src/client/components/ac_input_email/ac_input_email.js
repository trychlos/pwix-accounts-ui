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
    console.log( self, Template.currentData());

    self.AC = {
        errorMsg: new ReactiveVar( '' ),

        // check the current input field
        //  let the error message empty if field is empty
        check(){
            self.AC.displayError( '' );
            const wantsNew = Boolean( Template.currentData().wantsNew === true );
            AccountsUI._checkEmailAddress( self.$( '.ac-input-email-sub input' ).val(), { testExistance: wantsNew })
                .then(( result ) => {
                    //console.debug( result );
                    // only display an error message if field is not empty
                    if( result.email.length ){
                        if( !result.ok ){
                            self.AC.displayError( pwixI18n.label( I18N, 'input_email.invalid' ));
                        } else if( wantsNew && result.exists ){
                            self.AC.displayError( pwixI18n.label( I18N, 'input_email.already_exists' ));
                        }
                    }
                    self.$( '.ac-input-email-sub' ).trigger( 'ac-email-data', { ok: result.ok, email: result.email });
                });
        },

        // display an error message, either locally (here) ou at the panel level
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
});

Template.ac_input_email_sub.onRendered( function(){
    // initialize the form, so that is is checked (though empty) and send the input-email status event
    this.AC.reset();
});

Template.ac_input_email_sub.helpers({
    // a dedicated error message
    //  when used, always keep the area height so that the display is kept stable
    errorMsg(){
        return '<p>'+( Template.instance().AC.errorMsg.get() || '&nbsp;' )+'</p>';
    },

    // whether the mandatory field must exhibit an ad-hoc colored border ?
    mandatoryBorder(){
        return this.AC.options.coloredBorders() === AccountsUI.C.Colored.MANDATORY ? 'ac-mandatory-border' : '';
    },

    // returns the text, maybe from data context, defaulting to the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_email.'+key );
    }
});

Template.ac_input_email_sub.events({
    // we are asked to re-check
    'ac-check .ac-input-email-sub'( event, instance ){
        instance.AC.check();
    },

    'input input.ac-input'( event, instance ){
        instance.AC.check();
    }
});
