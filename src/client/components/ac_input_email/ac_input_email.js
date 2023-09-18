/*
 * pwix:accounts-ui/src/client/components/ac_input_email/ac_input_email.js
 *
 * Email input field
 * 
 * Parms:
 *  - component: the acComponent object
 *  - new: true|false whether to check for non-yet existant, defaulting to false
 *  - placeholder (opt.)
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_email.html';

Template.ac_input_email.onCreated( function(){
    const self = this;
    //console.log( self );
    //console.debug( Template.currentData());

    self.AC = {
        inputField: null,
        errorMsg: new ReactiveVar( '' ),
        checkNew: new ReactiveVar( true ),

        // check the current input field
        //  let the error message empty if field is empty
        //  only set an error message for new input
        check(){
            self.AC.errorMsg.set( '' );
            AccountsUI._checkEmailAddress( self.AC.inputField.val())
                .then(( result ) => {
                    // only display error message if field is not empty
                    if( result.errors.length && result.email.length && self.AC.checkNew.get()){
                        self.AC.errorMsg.set( result.errors[0] );
                    }
                    self.$( '.ac-input-email' ).trigger( 'ac-email-data', { ok: result.ok, email: result.email });
                });
        },

        // provides a translated label
        i18n( key ){
            return i18n.label( I18N, 'input_email.'+key );
        },

        // whether the email address is mandatory ?
        //  true if field is required and new account
        mandatoryField(){
            return Template.currentData().new && AccountsUI.opts().haveEmailAddress() === AccountsUI.C.Input.MANDATORY;
        },

        // reinitialize the form
        reset(){
            self.$( 'input' ).val( '' );
            if( self.AC.checkNew.get()){
                self.AC.check();
            }
        }
    };

    // setup reactive vars
    self.autorun(() => {
        const newx = Template.currentData().new;
        if( newx === true || newx === false ){
            self.AC.checkNew.set( newx );
        } else {
            self.AC.checkNew.set( false );
        }
    });
});

Template.ac_input_email.onRendered( function(){
    const self = this;

    // get the input field
    self.AC.inputField = self.$( '.ac-input-email input' );

    // initialize the form
    self.AC.reset();
});

Template.ac_input_email.helpers({
    // whether we have to check anything
    checks(){
        const AC = Template.instance().AC;
        return AC.checkNew.get();
    },

    // an error message if new password
    errorMsg(){
        return '<p>'+Template.instance().AC.errorMsg.get()+'</p>';
    },

    // fieldset legend
    legend(){
        const component = Template.currentData().component;
        return this.new ? component.opts().signupLegendEmail() : component.opts().signinLegendEmail();
    },

    // whether the email address is mandatory ?
    mandatoryField(){
        return Template.instance().AC.mandatoryField();
    },

    // whether the mandatory field must exhibit an ad-hoc colored border ?
    mandatoryBorder(){
        return Template.instance().AC.mandatoryField() && Template.currentData().component.opts().coloredBorders() === AccountsUI.C.Colored.MANDATORY ? 'ac-mandatory-border' : '';
    },

    // returns the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : Template.instance().AC.i18n( key );
    }
});

Template.ac_input_email.events({
    'input input.ac-input'( event, instance ){
        instance.AC.check();
    },

    // reset the form
    'ac-reset-input .ac-input-email'( event, instance ){
        instance.AC.reset();
    }
});
