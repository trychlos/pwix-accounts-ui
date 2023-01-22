/*
 * pwi:accounts/src/client/components/ac_change_pwd/ac_change_pwd.js
 */
import { pwiI18n as pI } from 'meteor/pwi:i18n';

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
            // whether the old password 'pwd1' is ok will be validated by the Meteor.Accounts package
            // we have to check that:
            //  - new password 'pwd2' is long enough
            //  - the two occurences 'pwd2' and 'pwd3' are the same
            const enabled = pwiAccounts.client.fn.validatePassword( pwd1 ) && pwiAccounts.client.fn.validatePassword( pwd2 ) && pwd2 === pwd3;
            btn.prop( 'disabled', !enabled );
        }
    };
});

Template.ac_change_pwd.onRendered( function(){
    this.AC.enableSubmit();
    console.log( 'pwi:accounts:ac_change_pwd', this.data.dialog.uuid());
});

Template.ac_change_pwd.helpers({
    // error message
    errorMsg(){
        return this.dialog.errorMsg();
    },

    // have a text after ?
    //  if no, prevent inclusion of a superfluous margin-bottom
    hasTextAfter(){
        return this.dialog.changePwdTextAfter();
    },

    hasTextBefore(){
        return this.dialog.changePwdTextBefore();
    },

    // params to first occurrence of new password
    labelNewOne(){
        return {
            label: pI.label( pwiAccounts.strings, 'change_pwd', 'new_label' ),
            placeholder: pI.label( pwiAccounts.strings, 'change_pwd', 'newone_placeholder' ),
            new: true
        }
    },

    // params to second occurrence of new password
    //  do not set as 'new' to not have the 'strength' display
    labelNewTwo(){
        return {
            label: '',
            placeholder: pI.label( pwiAccounts.strings, 'change_pwd', 'newtwo_placeholder' )
        }
    },

    // params to old password
    labelOld(){
        return {
            label: pI.label( pwiAccounts.strings, 'change_pwd', 'old_label' )
        }
    },

    // a description as a sufix of the section
    textAfter(){
        return this.dialog.changePwdTextAfter();
    },

    // a description as a prefix of the section
    textBefore(){
        return this.dialog.changePwdTextBefore();
    }
});

Template.ac_change_pwd.events({
    'keyup .ac-input-password'( event, instance ){
        instance.AC.enableSubmit();
    }
});
