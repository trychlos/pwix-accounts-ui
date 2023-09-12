/*
 * pwix:accounts-ui/src/client/components/ac_input_username/ac_input_username.js
 *
 * Email input field
 * 
 * Parms:
 *  - component: the acComponent object
 *  - new: Boolean, whether we are entering a new username, defaulting to false
 */
import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_input_username.html';

Template.ac_input_username.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        inputField: null,
        errorMsg: new ReactiveVar( '' ),

        // check the current input field (only if new)
        //  let the error message empty if field is empty
        check(){
            self.AC.errorMsg.set( '' );
            let promise = AccountsUI._checkUsername( self.AC.inputField.val())
                .then(( result ) => {
                    // only display error message if field is not empty
                    if( result.errors.length && result.username.length ){
                        self.AC.errorMsg.set( result.errors[0] );
                    }
                    self.$( '.ac-input-username' ).trigger( 'ac-username-data', { ok: result.ok, username: result.username });
                });
        },

        // provides a translated label
        i18n( key ){
            return i18n.label( I18N, 'input_username.'+key );
        },

        // whether the username is mandatory ?
        //  true if field is required and new account
        mandatoryField(){
            return Template.currentData().new && AccountsUI.opts().haveUsername() === AC_FIELD_MANDATORY;
        },

        // reinitialize the form
        reset(){
            self.$( 'input' ).val( '' );
            if( Template.currentData().new ){
                self.AC.check();
            }
        }
    };
});

Template.ac_input_username.onRendered( function(){
    const self = this;

    // get the input field
    self.AC.inputField = self.$( '.ac-input-username input' );

    // initialize the form
    if( Template.currentData().new ){
        self.AC.check();
    }
});

Template.ac_input_username.helpers({
    // an error message if new password
    errorMsg(){
        return '<p>'+Template.instance().AC.errorMsg.get()+'</p>';
    },

    // whether we are entering a new username
    isNew(){
        return this.new || false;
    },

    // fieldset legend
    legend(){
        const component = Template.currentData().component;
        return this.new ? component.opts().signupLegendUsername() : component.opts().signinLegendUsername();
    },

    // whether the username is mandatory ?
    mandatoryField(){
        return Template.instance().AC.mandatoryField();
    },

    // whether the mandatory field must exhibit an ad-hoc colored border ?
    mandatoryBorder(){
        return Template.instance().AC.mandatoryField() && Template.currentData().component.opts().mandatoryFieldsBorder() ? 'ac-mandatory-border' : '';
    },

    // returns the keyed translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : Template.instance().AC.i18n( key );
    }
});

Template.ac_input_username.events({
    'keyup input'( event, instance ){
        if( Template.currentData().new ){
            instance.AC.check();
        }
    },

    // reset the form
    'ac-reset-input .ac-input-username'( event, instance ){
        instance.AC.reset();
    }
});
