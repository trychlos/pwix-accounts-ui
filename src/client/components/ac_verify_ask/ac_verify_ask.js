/*
 * pwix:accounts-ui/src/client/components/ac_verify_ask/ac_verify_ask.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import './ac_verify_ask.html';

Template.ac_verify_ask.helpers({
    // error message
    errorMsg(){
        return AccountsUI.fn.errorMsg();
    },

    // the text of the section
    textOne(){
        return this.AC.options.verifyAskTextOne();
    }
});
