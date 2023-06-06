/*
 * pwix:accounts/src/client/components/ac_render_div/ac_render_div.js
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

import './ac_render_div.html';

Template.ac_render_div.onCreated( function(){
    console.debug( this );
    console.debug( Template.currentData());
});

Template.ac_render_div.helpers({
    template(){
        return acPanel.template( pwiAccounts.DisplayManager.panel());
    }
});
