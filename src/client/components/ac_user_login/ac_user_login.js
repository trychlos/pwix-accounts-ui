/*
 * pwi:accounts/src/client/components/ac_user_login/ac_user_login.js
 * 
 * Parms:
 *  - dialog: the acDialog which manages this 'acUserLogin' template's hierarchy
 */
import '../../../common/js/index.js';

import { acPanel } from '../../classes/ac_panel.class.js';

import '../ac_change_pwd/ac_change_pwd.js';
import '../ac_reset_ask/ac_reset_ask.js';
import '../ac_signin/ac_signin.js';
import '../ac_signout/ac_signout.js';
import '../ac_signup/ac_signup.js';
import '../ac_verify_ask/ac_verify_ask.js';

import './ac_user_login.html';

Template.ac_user_login.helpers({

    changePwd(){
        return this.dialog.allowed() && pwiAccounts.client.Panel.asked() === AC_PANEL_CHANGEPWD;
    },

    // display the buttons in 'DIV' mode unless the 'DIV' is empty
    hasButtons(){
        const dialog = this.dialog;
        let show = false;
        switch( pwiAccounts.client.Panel.asked()){
            case AC_PANEL_SIGNIN:
            case AC_PANEL_SIGNUP:
            case AC_PANEL_RESETASK:
            case AC_PANEL_SIGNOUT:
            case AC_PANEL_CHANGEPWD:
            case AC_PANEL_VERIFYASK:
                show = dialog.showPanels();
                break;
        }
        return show;
    },

    // whether to display as a modal dialog ?
    modal(){
        return this.dialog.modal();
    },

    resetAsked(){
        return this.dialog.allowed() && pwiAccounts.client.Panel.asked() === AC_PANEL_RESETASK;
    },

    signin(){
        return this.dialog.allowed() && pwiAccounts.client.Panel.asked() === AC_PANEL_SIGNIN;
    },

    signout(){
        return this.dialog.allowed() && pwiAccounts.client.Panel.asked() === AC_PANEL_SIGNOUT;
    },

    signup(){
        return this.dialog.allowed() && pwiAccounts.client.Panel.asked() === AC_PANEL_SIGNUP;
    },

    verifyAsked(){
        return this.dialog.allowed() && pwiAccounts.client.Panel.asked() === AC_PANEL_VERIFYASK;
    },
});
