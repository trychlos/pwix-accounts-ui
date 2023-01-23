/*
 * pwi:accounts/src/client/components/ac_reset_input/ac_reset_input.js
 *
 * Runs a modal dialog to let the user enter a new password.
 * Doesn't change the connection state.
 */
import { pwiI18n as pI } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import '../ac_input_password/ac_input_password.js';

import './ac_reset_input.html';

Template.ac_reset_input.onCreated( function(){
    const self = this;

    self.AC = {
        close(){
            self.$( '.ac-reset-input .modal' ).modal( 'hide' );
            return false;
        },
        enableSubmit: function(){
            const pwd = self.$( '.ac-input-password .ac-input' ).val();
            const btn = self.$( '.ac-submit' );
            btn.prop( 'disabled', !pwiAccounts.fn.validatePassword( pwd ));
        }
    };
});

Template.ac_reset_input.onRendered( function(){
    this.$( '.ac-reset-input .modal' ).modal( 'show' );
    this.AC.enableSubmit();
});

Template.ac_reset_input.helpers({
    // label translation
    i18n( opts ){
        return pI.label( pwiAccounts.strings, 'reset_input', opts.hash.label, opts.hash.language );
    },

    // provides data to ac_input_password template
    passwordData(){
        return {
            new: true,
            label: pI.label( pwiAccounts.strings, 'reset_input', 'password_label' )
        };
    },
});

Template.ac_reset_input.events({
    'click .ac-cancel'( event, instance ){
        return instance.AC.close();
    },
    'click .ac-submit'( event, instance ){
        const pwd = self.$( '.ac-password-input' ).val().trim();
        Template.currentData().cb( pwd );
        return instance.AC.close();
    },
    'keyup .ac-input-password'( event, instance ){
        instance.AC.enableSubmit();
    },

    // remove the Blaze element from the DOM
    'hidden.bs.modal .ac-reset-input'( event, instance ){
        Blaze.remove( instance.view );
    }
});
