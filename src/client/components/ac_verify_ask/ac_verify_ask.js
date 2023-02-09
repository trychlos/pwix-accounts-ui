/*
 * pwix:accounts/src/client/components/ac_verify_ask/ac_verify_ask.js
 * 
 * Parms:
 *  - aculInstance: the acUserLogin template instance
 */

import './ac_verify_ask.html';

Template.ac_verify_ask.helpers({
    // error message
    errorMsg(){
        return this.aculInstance.AC.display.errorMsg();
    },

    // the text of the section
    textOne(){
        return this.aculInstance.AC.options.verifyAskTextOne();
    }
});
