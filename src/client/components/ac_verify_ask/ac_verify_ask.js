/*
 * pwi:accounts/src/client/components/ac_verify_ask/ac_verify_ask.js
 */
import '../../../common/js/index.js';

import './ac_verify_ask.html';

Template.ac_verify_ask.onRendered( function(){
    console.log( 'pwi:accounts:ac_verify_ask', this.data.dialog.uuid());
});

Template.ac_verify_ask.helpers({
    // error message
    errorMsg(){
        return this.dialog.errorMsg();
    },

    // a description as a prefix of the section
    textBefore(){
        return this.dialog.verifyAskTextBefore();
    }
});
