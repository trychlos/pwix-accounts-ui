/*
 * pwix:accounts-ui/src/client/components/ac_input_email/ac_input_email.js
 *
 * Email input field
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *  - wantsNew: whether an existing email must be reported as an error, defaulting to true
 *  - wantsMandatory: whether we want display the mandatory indicator if applies, defaulting to true
 *  - wantsError: whether we want a dedicated error message here, defaulting to true
 *  - withFieldset: whether we want the input be inside a fieldset (which implies a legend), defaulting to true
 *  - placeholder: the input placeholder, defaulting to placeholder translated from 'input_email.placeholder'
 *  - label: the input label, defaulting to label translated from 'input_email.label'
 *  - legend: the fieldset legend, defaulting to legend translated from 'input_email.legend'
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_email.html';

Template.ac_input_email.helpers({
    // whether we have a fieldset (and a legend)
    haveFieldset(){
        return this.withFieldset !== false;
    },

    // fieldset legend
    legend(){
        return Object.keys( this ).includes( 'legend' ) ? this.legend : pwixI18n.label( I18N, 'input_email.legend' );
    }
});

/***
 *** sub-template
 ***/

 Template.ac_input_email_sub.onCreated( function(){
    const self = this;
    //console.log( self, Template.currentData());

    self.AC = {
        errorMsg: new ReactiveVar( '' ),

        // check the current input field
        //  let the error message empty if field is empty
        check(){
            self.AC.displayError( '' );
            const wantsNew = Boolean( Template.currentData().wantsNew !== false );
            AccountsUI._checkEmailAddress( self.$( '.ac-input-email-sub input' ).val(), { testExistance: wantsNew })
                .then(( result ) => {
                    console.debug( result );
                    // only display an error message if field is not empty
                    if( result.email.length ){
                        if( !result.ok ){
                            self.AC.displayError( pwixI18n.label( I18N, 'input_email.invalid' ));
                        } else if( wantsNew && result.exists ){
                            self.AC.displayError( pwixI18n.label( I18N, 'input_email.already_exists' ));
                        }
                    }
                    self.$( '.ac-input-email' ).trigger( 'ac-email-data', { ok: result.ok, email: result.email });
                });
        },

        // display an error message, either locally (here) ou at the panel level
        displayError( msg ){
            //const wantsError = Boolean( Template.currentData().wantsError !== false );
            // see https://stackoverflow.com/questions/39271499/template-actual-data-context/39272483#39272483
            const wantsError = Boolean( Blaze.getData( self.view ).wantsError !== false );
            if( wantsError ){
                self.AC.errorMsg.set( msg );
            } else {
                self.$( '.ac-input-email-sub' ).trigger( 'ac-display-error', msg );
            }
        },

        // whether the email address is mandatory ?
        mandatoryField(){
            return ( Template.currentData().wantsMandatory !== false ) && ( AccountsUI.opts().haveEmailAddress() === AccountsUI.C.Input.MANDATORY );
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
    // an error message if new password
    errorMsg(){
        return '<p>'+( Template.instance().AC.errorMsg.get() || '&nbsp;' )+'</p>';
    },

    // whether we want display a dedicated error message here
    haveError(){
        return this.wantsError !== false;
    },

    // returns the translated string
    i18n( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'input_email.'+key );
    },

    // whether the email address must be indicated as mandatory ?
    mandatoryField(){
        return Template.instance().AC.mandatoryField();
    },

    // whether the mandatory field must exhibit an ad-hoc colored border ?
    mandatoryBorder(){
        return Template.instance().AC.mandatoryField() && this.AC.options.coloredBorders() === AccountsUI.C.Colored.MANDATORY ? 'ac-mandatory-border' : '';
    }
});

Template.ac_input_email_sub.events({
    'input input.ac-input'( event, instance ){
        instance.AC.check();
    }
});
