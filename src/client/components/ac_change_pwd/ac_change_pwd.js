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
        enableSubmit: function(){
            const pwd1 = self.$( '.ac-old .ac-input' ).val();
            const pwd2 = self.$( '.ac-newone .ac-input' ).val();
            const pwd3 = self.$( '.ac-newtwo .ac-input' ).val();
            const btn = self.$( '.ac-change-pwd' ).closest( '.acUserLogin' ).find( '.ac-submit' );
            let errs = [];
            // whether the old password 'pwd1' is ok will be validated by the Meteor.Accounts package
            // we have to check that:
            //  - new password 'pwd2' is long and string enough
            //  - the two occurences 'pwd2' and 'pwd3' are the same
            const lengthOk = pwiAccounts.validatePasswordLength( pwd2 );
            if( !lengthOk ){
                errs.push( '<p>'+pwiI18n.label( pwiAccounts.strings, 'user', 'password_too_short' )+'</p>' );
            }
            const strengthOk = pwiAccounts.validatePasswordStrength( pwd2, self.AC.strength );
            if( !strengthOk ){
                errs.push( '<p>'+pwiI18n.label( pwiAccounts.strings, 'user', 'password_too_weak' )+'</p>' );
            }
            const equalsOk = pwd2 === pwd3;
            if( !equalsOk ){
                errs.push( '<p>'+pwiI18n.label( pwiAccounts.strings, 'user', 'password_different' )+'</p>' );
            }
            btn.prop( 'disabled', !( pwiAccounts.validatePasswordLength( pwd1 ) && lengthOk && strengthOk && equalsOk ));
            self.AC.errors.set( errs );
        },
        strength: '',
        length: 0,
        errors: new ReactiveVar( [] )
    };
});

Template.ac_change_pwd.onRendered( function(){
    this.AC.enableSubmit();
});

Template.ac_change_pwd.helpers({
    // error message
    errorMsg(){
        let html = Template.instance().AC.errors.get().join( '\n' );
        const errmsg = this.display.errorMsg();
        if( errmsg ){
            html += '\n<p>'+errmsg+'</p>';
        }
        return html;
    },

    // params to first occurrence of new password
    labelNewOne(){
        return {
            label: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'new_label' ),
            placeholder: pwiI18n.label( pwiAccounts.strings, 'change_pwd', 'newone_placeholder' ),
            new: true,
            trigger: true
        }
    },

    // params to second occurrence of new password
    //  do not set as 'new' to not have the 'strength' display
    labelNewTwo(){
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
    'ac-password .ac-change-pwd'( event, instance, data ){
        // may happen that data be undefined !
        if( data ){
            instance.AC.strength = data.strength;
            instance.AC.length = data.length;
        }
    }
});
