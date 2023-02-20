/*
 * pwix:accounts/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object
 */

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';

import './ac_signout.html';

Template.ac_signout.onCreated( function(){
    const self = this;

    // check that requester is a acUserLoginCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acUserLoginCompanion )){
            throw new Error( 'expected acUserLoginCompanion, found', requester );
        }
    });
});

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.requester.opts().signoutTextOne();
    }
});
