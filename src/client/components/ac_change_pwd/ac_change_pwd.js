/*
 * pwix:accounts-ui/src/client/components/ac_change_pwd/ac_change_pwd.js
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */
import { pwixI18n } from 'meteor/pwix:i18n';

import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_password/ac_input_password.js';

import './ac_change_pwd.html';

Template.ac_change_pwd.onCreated( function(){
    const self = this;

    self.AC = {
        component: new ReactiveVar( null ),
        passwordOk: new ReactiveVar( true ),
        twiceOk: new ReactiveVar( true )
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });
});

Template.ac_change_pwd.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const btn = self.$( '.ac-change-pwd' ).closest( '.ac-content' ).find( '.ac-submit' );
        btn.prop( 'disabled', !self.AC.passwordOk.get() || !self.AC.twiceOk.get());
    });
});

Template.ac_change_pwd.helpers({
    // error message
    errorMsg(){
        return AccountsUI.Display.errorMsg();
    },

    // params to old password
    labelOld(){
        return {
            label: pwixI18n.label( I18N, 'change_pwd.old_label' )
        }
    },

    // parameters for the password input
    parmTwice(){
        return {
            component: Template.instance().AC.component.get(),
            role: 'change',
            label: pwixI18n.label( I18N, 'change_pwd.new_label' )
        };
    },

    // the text before the old password
    textOne(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().changePwdTextOne() : '';
    },

    // the text between old and new passwords
    textTwo(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().changePwdTextTwo() : '';
    },

    // the text after new passwords
    textThree(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().changePwdTextThree() : '';
    }
});

Template.ac_change_pwd.events({
    // message sent by the input password component
    //  NB: happens that data arrives undefined :( see #24
    'ac-password-data .ac-change-pwd'( event, instance, data ){
        //console.log( 'ac-password-data', data );
        instance.AC.passwordOk.set( data ? data.ok : false );
        AccountsUI.Display.errorMsg( '' );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-change-pwd'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        instance.AC.twiceOk.set( data ? data.ok : false );
        AccountsUI.Display.errorMsg( '' );
    }
});
