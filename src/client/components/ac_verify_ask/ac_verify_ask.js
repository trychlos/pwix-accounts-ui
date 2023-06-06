/*
 * pwix:accounts/src/client/components/ac_verify_ask/ac_verify_ask.js
 * 
 * Parms:
 *  - requester: the acCompanion object
 */

import { acCompanion } from '../../classes/ac_companion.class.js';

import './ac_verify_ask.html';

Template.ac_verify_ask.onCreated( function(){
    const self = this;

    // check that requester is a acCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acCompanion )){
            throw new Error( 'expected acCompanion, found', requester );
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
