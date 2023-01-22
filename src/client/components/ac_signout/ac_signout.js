/*
 * pwi:accounts/src/client/components/ac_signout/ac_signout.js
 */

import '../../../common/js/index.js';

import './ac_signout.html';

Template.ac_signout.onRendered( function(){
    console.log( 'pwi:accounts:ac_signout', Template.currentData().dialog.uuid());
});

Template.ac_signout.helpers({
    // a description as a prefix of the section
    textBefore(){
        return this.dialog.signoutTextBefore();
    }
});
