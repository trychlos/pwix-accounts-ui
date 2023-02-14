/*
 * pwix:accounts/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - companion: the acUserLoginCompanion object
 */

import './ac_signout.html';

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.companion.opts().signoutTextOne();
    }
});
