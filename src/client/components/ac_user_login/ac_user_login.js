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

Template.ac_user_login.helpers({

    changePwd(){
        return this.display.allowed() && pwiAccounts.Panel.asked() === AC_PANEL_CHANGEPWD;
    },

    // pass the acDisplay instance to child template
    display(){
        return this.display;
    },

    // display the buttons in 'DIV' mode unless the 'DIV' is empty
    hasButtons(){
        const display = this.display;
        let show = false;
        switch( pwiAccounts.Panel.asked()){
            case AC_PANEL_SIGNIN:
            case AC_PANEL_SIGNUP:
            case AC_PANEL_RESETASK:
            case AC_PANEL_SIGNOUT:
            case AC_PANEL_CHANGEPWD:
            case AC_PANEL_VERIFYASK:
                show = display.showPanels();
                break;
        }
        return show;
    },

    // whether to display as a modal dialog ?
    modal(){
        return this.display.modal();
    },

    resetAsked(){
        return this.display.allowed() && pwiAccounts.Panel.asked() === AC_PANEL_RESETASK;
    },

    signin(){
        return this.display.allowed() && pwiAccounts.Panel.asked() === AC_PANEL_SIGNIN;
    },

    signout(){
        return this.display.allowed() && pwiAccounts.Panel.asked() === AC_PANEL_SIGNOUT;
    },

    signup(){
        return this.display.allowed() && pwiAccounts.Panel.asked() === AC_PANEL_SIGNUP;
    },

    verifyAsked(){
        return this.display.allowed() && pwiAccounts.Panel.asked() === AC_PANEL_VERIFYASK;
    },
});
