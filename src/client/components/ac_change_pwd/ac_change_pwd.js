/*
 * pwix:accounts/src/client/components/ac_change_pwd/ac_change_pwd.js
 * 
 * Parms:
 *  - display: the acDisplay instance
 */
import { pwiI18n } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import '../ac_input_password/ac_input_password.js';

import './ac_change_pwd.html';

Template.ac_change_pwd.onCreated( function(){
    const self = this;

    self.AC = {
        passwordOk: new ReactiveVar( true ),
        twiceOk: new ReactiveVar( true )
    };
});

Template.ac_change_pwd.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const btn = self.$( '.ac-change-pwd' ).closest( '.acUserLogin' ).find( '.ac-submit' );
        btn.prop( 'disabled', !self.AC.passwordOk.get() || !self.AC.twiceOk.get());
    });
});

Template.ac_change_pwd.helpers({
    // error message
    errorMsg(){
        return this.display.errorMsg();
    },

    // parameters for the password input
    parmTwice(){
        return {
            display: this.display,
            role: 'change'
        };
    },

    // params to old password
    labelOld(){
        return {
            label: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'old_label' )
        }
    },

    // the text before the old password
    textOne(){
        return this.display.changePwdTextOne();
    },

    // the text between old and new passwords
    textTwo(){
        return this.display.changePwdTextTwo();
    },

    // the text after new passwords
    textThree(){
        return this.display.changePwdTextThree();
    }
});

Template.ac_change_pwd.events({
    // message sent by the input password component
    //  NB: happens that data arrives undefined :( see #24
    'ac-password-data .ac-change-pwd'( event, instance, data ){
        //console.log( 'ac-password-data', data );
        instance.AC.passwordOk.set( data ? data.ok : false );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-change-pwd'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        instance.AC.twiceOk.set( data ? data.ok : false );
    }
});
