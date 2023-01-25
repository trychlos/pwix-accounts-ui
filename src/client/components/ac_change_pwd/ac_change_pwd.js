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
        error: new ReactiveVar( '' ),

        enableSubmit: function(){
            const pwd2 = self.$( '.ac-newone .ac-input' ).val();
            const pwd3 = self.$( '.ac-newtwo .ac-input' ).val();
            const btn = self.$( '.ac-change-pwd' ).closest( '.acUserLogin' ).find( '.ac-submit' );
            self.AC.error.set( '' );
            // whether the old password 'pwd1' is ok will be validated by the Meteor.Accounts package
            // whether the new password 'pwd2' is ok is checked by the input password component
            // we have to check that the two occurences 'pwd2' and 'pwd3' are the same
            const equalsOk = pwd2 === pwd3;
            //console.log( 'pwd2='+pwd2, 'pwd3='+pwd3, 'equalsOk='+equalsOk );
            if( !equalsOk ){
                self.AC.error.set( '<p>'+pwiI18n.label( pwiAccounts.strings, 'user', 'password_different' )+'</p>' );
            }
            btn.prop( 'disabled', !( pwd2.length && pwd3.length && equalsOk ));
        },
    };
});

Template.ac_change_pwd.onRendered( function(){
    this.AC.enableSubmit();
});

Template.ac_change_pwd.helpers({
    // error message
    errorMsg(){
        return Template.instance().AC.error.get() || this.display.errorMsg();
    },

    // params to first occurrence of new password
    parmNewOne(){
        return {
            label: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'new_label' ),
            placeholder: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'newone_placeholder' ),
            new: true
        }
    },

    // params to second occurrence of new password
    //  do not set as 'new' to not have the 'strength' display
    parmNewTwo(){
        return {
            label: '',
            placeholder: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'newtwo_placeholder' )
        }
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
    'keyup .ac-change-pwd'( event, instance ){
        instance.AC.enableSubmit();
    },
    'ac-password-data .ac-change-pwd'( event, instance, data ){
        // may happen that data be undefined !
        console.log( 'ac-password-data', data );
        if( data ){
            instance.AC.strength = data.strength;
            instance.AC.length = data.length;
        }
    }
});
