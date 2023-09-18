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
        passwordOk: new ReactiveVar( false ),
        passwordVal: null,
        twiceOk: new ReactiveVar( false ),
        twiceVal: null,
        checksOk: new ReactiveVar( false ),

        // not only each field must be individually ok
        //  but we also make sure the old and new passwords are different
        checks( event, data ){
            switch( event.type ){
                case 'ac-password-data':
                    self.AC.checkPassword( data );
                    self.AC.checkPanel();
                    break;
                case 'ac-twice-data':
                    self.AC.checkTwice( data );
                    self.AC.checkPanel();
                    break;
            }
        },
        // only relevant if individual checks are ok
        checkPanel(){
            let isOk = self.AC.passwordOk.get() && self.AC.twiceOk.get();
            if( isOk ){
                isOk &&= self.AC.passwordVal && self.AC.twiceVal && self.AC.passwordVal !== self.AC.twiceVal;
                if( self.AC.passwordVal && self.AC.passwordVal.length > 0 && self.AC.passwordVal === self.AC.twiceVal ){
                    AccountsUI.Display.errorMsg( pwixI18n.label( I18N, 'change_pwd.pwds_are_equal' ));
                }
            }
            self.AC.checksOk.set( isOk );
        },
        checkPassword( data ){
            //console.debug( data );
            self.AC.passwordVal = data.password;
            self.AC.passwordOk.set( data.ok );
        },
        checkTwice( data ){
            //console.debug( data );
            self.AC.twiceVal = data.password;
            self.AC.twiceOk.set( data.ok );
        },

        // clear the panel
        clear(){
            self.$( 'input' ).val( '' );
        }
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

    const $acContent = self.$( '.ac-change-pwd' ).closest( '.ac-content' );

    self.autorun(() => {
        $acContent.attr( 'data-ac-requester', Template.currentData().managerId );
    });

    self.autorun(() => {
        //console.debug( self );
        $acContent.find( '.ac-submit' ).prop( 'disabled', !self.AC.checksOk.get());
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
        AccountsUI.Display.errorMsg( '' );
        if( data ){
            instance.AC.checks( event, data );
        }
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-change-pwd'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        AccountsUI.Display.errorMsg( '' );
        if( data ){
            instance.AC.checks( event, data );
        }
    },

    // clear the panel
    //  this is only for completude as this has almost no chance to be used
    'ac-clear-panel-fwd .ac-change-pwd'( event, instance ){
        instance.AC.clear();
    }
});
