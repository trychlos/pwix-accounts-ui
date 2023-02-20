/*
 * pwix:accounts/src/client/components/ac_verify_ask/ac_verify_ask.js
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object
 */

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';

import './ac_verify_ask.html';

Template.ac_verify_ask.onCreated( function(){
    const self = this;

    // check that requester is a acUserLoginCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acUserLoginCompanion )){
            throw new Error( 'expected acUserLoginCompanion, found', requester );
        }
    });
});

Template.ac_verify_ask.helpers({
    // error message
    errorMsg(){
        return pwiAccounts.DisplayManager.errorMsg();
    },

    // the text of the section
    textOne(){
        return this.requester.opts().verifyAskTextOne();
    }
});
