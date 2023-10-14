/*
 * pwix:accounts-ui/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import './ac_signout.html';

Template.ac_signout.onRendered( function(){
    // monitor the modal events if apply
    Template.currentData().AC.monitorModalEvents( self.$( '.ac-signout' ));
});

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.AC.options.signoutTextOne();
    }
});
