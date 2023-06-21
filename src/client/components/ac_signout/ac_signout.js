/*
 * pwix:accounts-ui/src/client/components/ac_signout/ac_signout.js
 * 
 * Parms:
 *  - companion: the acCompanion object
 */

import { acCompanion } from '../../classes/ac_companion.class.js';

import './ac_signout.html';

Template.ac_signout.onCreated( function(){
    const self = this;

    // check that companion is a acCompanion
    self.autorun(() => {
        const companion = Template.currentData().companion;
        if( companion && !( companion instanceof acCompanion )){
            throw new Error( 'expected acCompanion, found', companion );
        }
    });
});

Template.ac_signout.helpers({
    // the text the section
    textOne(){
        return this.companion.opts().signoutTextOne();
    }
});
