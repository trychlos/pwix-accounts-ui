/*
 * pwix:accounts/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - requester: the acCompanion object
 */

import { acCompanion } from '../../classes/ac_companion.class.js';

import './ac_signout.html';

Template.ac_signout.onCreated( function(){
    const self = this;

    // check that requester is a acCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acCompanion )){
            throw new Error( 'expected acCompanion, found', requester );
        }
    });
});

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.requester.opts().signoutTextOne();
    }
});
