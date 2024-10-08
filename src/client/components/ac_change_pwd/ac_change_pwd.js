/*
 * pwix:accounts-ui/src/client/components/ac_change_pwd/ac_change_pwd.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_password/ac_input_password.js';

import './ac_change_pwd.html';

Template.ac_change_pwd.onCreated( function(){
    const self = this;

    self.AC = {
        passwordOk: new ReactiveVar( false ),
        passwordVal: null,
        twiceOk: new ReactiveVar( false ),
        twiceVal: null,
        equalsOk: new ReactiveVar( false ),
        inCheck: false,

        // not only each field must be individually ok
        //  but we also make sure the old and new passwords are different
        checks( event, data ){
            switch( event.type ){
                case 'ac-password-data':
                    if( self.AC.checkPassword( data ) && !self.AC.inCheck ){
                        self.AC.checkPanel();
                    }
                    break;
                case 'ac-twice-data':
                    if( self.AC.checkTwice( data ) && !self.AC.inCheck ){
                        self.AC.checkPanel();
                    }
                    break;
            }
        },
        // only relevant if individual checks are ok
        checkPanel(){
            self.AC.inCheck = true;
            if( !self.AC.passwordOk.get()){
                self.$( '.ac-change-pwd .ac-old .ac-input-password' ).trigger( 'ac-check' );
            } else if( !self.AC.twiceOk.get()){
                self.$( '.ac-change-pwd .ac-twice-passwords-sub' ).trigger( 'ac-check' );
            } else {
                const equalsOk = self.AC.passwordVal && self.AC.passwordVal.length > 0 && self.AC.passwordVal !== self.AC.twiceVal;
                self.AC.equalsOk.set( equalsOk );
                if( !equalsOk ){
                    AccountsUI.fn.errorMsg( pwixI18n.label( I18N, 'change_pwd.pwds_are_equal' ), { dataContext: Template.currentData() });
                }
            }
            self.AC.inCheck = false;
        },
        // we look here only the current password
        //  and we do not care of its validity not its strength as long as it is not empty
        checkPassword( data ){
            self.AC.passwordVal = data.password;
            const isOk = ( data.password.length > 0 );
            self.AC.passwordOk.set( isOk );
            return isOk;

        },
        checkTwice( data ){
            //console.debug( data );
            self.AC.twiceVal = data.password;
            self.AC.twiceOk.set( data.ok );
            return data.ok;
        }
    };
});

Template.ac_change_pwd.onRendered( function(){
    const self = this;

    self.autorun(() => {
        self.$( '.ac-change-pwd' ).closest( '.ac-content' ).find( '.ac-submit' ).prop( 'disabled', !self.AC.passwordOk.get() || !self.AC.twiceOk.get() || !self.AC.equalsOk.get());
    });

    // monitor the modal events if apply
    Template.currentData().AC.monitorModalEvents( self.$( '.ac-change-pwd' ));
});

Template.ac_change_pwd.helpers({
    // parameters for the ac_error_msg component
    parmsErrorMsg(){
        return {
            ...this,
            withErrorArea: AccountsUI.fn.hasErrorArea( this ),
            errorMsgRv: AccountsUI.fn.errorMsgRv()
        };
    },

    // params to old password
    parmsOldPassword(){
        return {
            AC: this.AC,
            label: pwixI18n.label( I18N, 'change_pwd.old_label' )
        }
    },

    // parameters for the password input
    parmsTwice(){
        return {
            AC: this.AC,
            role: 'change',
            withErrorMsg: true,
            label: pwixI18n.label( I18N, 'change_pwd.new_label' ),
            placeholder1: pwixI18n.label( I18N, 'change_pwd.newone_placeholder' ),
            placeholder2: pwixI18n.label( I18N, 'change_pwd.newtwo_placeholder' )
        };
    },

    // the text before the old password
    textOne(){
        return this.AC.options.changePwdTextOne();
    },

    // the text between old and new passwords
    textTwo(){
        return this.AC.options.changePwdTextTwo();
    },

    // the text after new passwords
    textThree(){
        return this.AC.options.changePwdTextThree();
    }
});

Template.ac_change_pwd.events({
    // message sent by the input current password component
    'ac-password-data .ac-change-pwd .ac-old'( event, instance, data ){
        instance.AC.checks( event, data );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-change-pwd'( event, instance, data ){
        instance.AC.checks( event, data );
    }
});
