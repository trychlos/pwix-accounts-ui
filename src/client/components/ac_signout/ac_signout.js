/*
 * pwix:accounts-ui/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import './ac_signout.html';

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.AC.options.signoutTextOne();
    }
});
