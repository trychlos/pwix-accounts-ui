/*
 * pwix:accounts/src/client/components/ac_verify_ask/ac_verify_ask.js
 * 
 * Parms:
 *  - companion: the acCompanion object
 */

import { acCompanion } from '../../classes/ac_companion.class.js';

import './ac_verify_ask.html';

Template.ac_verify_ask.onCreated( function(){
    const self = this;

    // check that companion is a acCompanion
    self.autorun(() => {
        const companion = Template.currentData().companion;
        if( companion && !( companion instanceof acCompanion )){
            throw new Error( 'expected acCompanion, found', companion );
        }
    });
});

Template.ac_verify_ask.helpers({
    // error message
    errorMsg(){
        return pwixAccounts.DisplayManager.errorMsg();
    },

    // the text of the section
    textOne(){
        return this.companion.opts().verifyAskTextOne();
    }
});
