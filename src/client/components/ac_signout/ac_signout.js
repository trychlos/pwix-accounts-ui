/*
 * pwix:accounts/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - aculInstance: the acUserLogin template instance
 */

import './ac_signout.html';

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.aculInstance.AC.options.signoutTextOne();
    }
});
