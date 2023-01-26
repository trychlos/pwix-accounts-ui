/*
 * pwix:accounts/src/client/components/ac_reset_input/ac_reset_input.js
 *
 * Runs a modal dialog to let the user enter a new password.
 * Doesn't change the connection state.
 */

import { pwiI18n } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import '../ac_twice_passwords/ac_twice_passwords.js';

import './ac_reset_input.html';

Template.ac_reset_input.onCreated( function(){
    const self = this;

    self.AC = {
        passwordOk: new ReactiveVar( true ),
        twiceOk: new ReactiveVar( true ),

        close(){
            self.$( '.ac-reset-input .modal' ).modal( 'hide' );
            return false;
        }
    };
});

Template.ac_reset_input.onRendered( function(){
    const self = this;

    self.$( '.ac-reset-input .modal' ).modal( 'show' );

    self.autorun(() => {
        const btn = self.$( '.ac-submit' );
        btn.prop( 'disabled', !self.AC.passwordOk.get() || !self.AC.twiceOk.get());
    });
});

Template.ac_reset_input.helpers({
    // label translation
    i18n( opts ){
        return pwiI18n.label( pwiAccounts.strings, 'reset_input', opts.hash.label, opts.hash.language );
    },

    // provides data to ac_twice_passwords template
    parmTwice(){
        return {
            display: this.display,
            role: 'reset'
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

    'ac-password-data .ac-reset-input'( event, instance, data ){
        if( data ){
            instance.AC.passwordOk.set( data.ok );
        }
    },

    'ac-twice-data .ac-reset-input'( event, instance, data ){
        instance.AC.twiceOk.set( data.ok );
    },

    // remove the Blaze element from the DOM
    'hidden.bs.modal .ac-reset-input'( event, instance ){
        Blaze.remove( instance.view );
    }
});
