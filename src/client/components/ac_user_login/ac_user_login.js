/*
 * pwix:accounts/src/client/components/ac_user_login/ac_user_login.js
 * 
 * Parms:
 *  - companion: the acCompanion object
 */

import { acPanel } from '../../classes/ac_panel.js';

import '../../../common/js/index.js';

import '../ac_change_pwd/ac_change_pwd.js';
import '../ac_reset_ask/ac_reset_ask.js';
import '../ac_signin/ac_signin.js';
import '../ac_signout/ac_signout.js';
import '../ac_signup/ac_signup.js';
import '../ac_verify_ask/ac_verify_ask.js';

import './ac_user_login.html';

Template.ac_user_login.helpers({

    // whether to display as a modal dialog ?
    modal(){
        return this.companion.opts().renderMode() === AC_RENDER_MODAL;
    },

    template(){
        return acPanel.template( pwiAccounts.DisplayManager.panel());
    }
});
