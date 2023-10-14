/*
 * pwix:accounts-ui/src/client/components/ac_reset_pwd/ac_reset_pwd.js
 *
 * Let the user reset his/her password.
 * Doesn't change the connection state.
 * 
 * Please note that this panel is run OUTSIDE of usual 'acUserLogin' flow.
 * We so do NOT have any particular acUserLogin information.
 * 
 * Parms:
 * - user
 */

import printf from 'printf';

import '../../../common/js/index.js';

import '../ac_twice_passwords/ac_twice_passwords.js';

import './ac_reset_pwd.html';

Template.ac_reset_pwd.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        passwordOk: new ReactiveVar( true ),
        twiceOk: new ReactiveVar( true ),
            
        text( label ){
            const item = 'resetPwd'+label;
            const string = AccountsUI.opts()[item]();
            const user = self.data.user;
            return printf( string, user ? user.services.password.reset.email : '' );
        }
    };
});

Template.ac_reset_pwd.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const btn = self.$( '.ac-reset-pwd .ac-submit' );
        btn.prop( 'disabled', !self.AC.passwordOk.get() || !self.AC.twiceOk.get());
    });
});

Template.ac_reset_pwd.helpers({
    // parameters for the password input
    parmTwice(){
        return {
            role: 'reset'
        };
    },

    // the text before the old password
    textOne(){
        return Template.instance().AC.text( 'TextOne' );
    },

    // the text between old and new passwords
    textTwo(){
        return Template.instance().AC.text( 'TextTwo' );
    },
});

Template.ac_reset_pwd.events({
    // message sent by the input password component
    //  NB: happens that data arrives undefined :( see #24
    'ac-password-data .ac-reset-pwd'( event, instance, data ){
        //console.log( 'ac-password-data', data );
        instance.AC.passwordOk.set( data ? data.ok : false );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-reset-pwd'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        instance.AC.twiceOk.set( data ? data.ok : false );
    },

    // on Submit button
    'ac-submit .ac-reset-pwd'( event, instance ){
        console.log( event );
        const pwd = instance.$( '.ac-newone .ac-input-password input' ).val().trim();
        Template.currentData().cb( pwd );
    }
});
