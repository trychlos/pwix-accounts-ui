/*
 * pwix:accounts/src/client/components/ac_verify_ask/ac_verify_ask.js
 * 
 * Parms:
 *  - companion: the acUserLoginCompanion object
 */

import './ac_verify_ask.html';

Template.ac_verify_ask.helpers({
    // error message
    errorMsg(){
        return pwiAccounts.Displayer.errorMsg();
    },

    // the text of the section
    textOne(){
        return this.companion.opts().verifyAskTextOne();
    }
});
