/*
 * pwix:accounts/src/client/components/ac_user_login/ac_user_login.js
 * 
 * Parms:
 *  - display: the acDisplay instance passed through the acUserLogin (if div) or ac_modal (if modal)
 *
 */
import '../../../common/js/index.js';

import '../ac_change_pwd/ac_change_pwd.js';
import '../ac_reset_ask/ac_reset_ask.js';
import '../ac_signin/ac_signin.js';
import '../ac_signout/ac_signout.js';
import '../ac_signup/ac_signup.js';
import '../ac_verify_ask/ac_verify_ask.js';

import './ac_user_login.html';

Template.ac_user_login.onCreated( function(){
    const self = this;

    self.AC = {
        templates: {
            AC_PANEL_SIGNIN: 'ac_signin',
            AC_PANEL_SIGNUP: 'ac_signup',
            AC_PANEL_RESETASK: 'ac_reset_ask',
            AC_PANEL_SIGNOUT: 'ac_signout',
            AC_PANEL_CHANGEPWD: 'ac_change_pwd',
            AC_PANEL_VERIFYASK: 'ac_verify_ask'
        }
    };
});

Template.ac_user_login.helpers({

    // pass the acDisplay instance to child template
    display(){
        return this.display;
    },

    // whether to display as a modal dialog ?
    modal(){
        return this.display.modal();
    },

    template(){
        return Template.instance().AC.templates[pwiAccounts.Panel.asked()];
    }
});
