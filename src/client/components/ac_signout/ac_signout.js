/*
 * pwix:accounts/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object
 */

import { pwixModal } from 'meteor/pwix:modal';

import './ac_signout.html';

Template.ac_signout.onCreated( function(){
    console.log( this );
});

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.requester.opts().signoutTextOne();
    }
});
