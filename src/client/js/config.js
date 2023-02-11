/*
 * pwix:accounts/src/client/js/config.js
 *
 * - attach the acDisplayer singleton as Displayer to pwiAccounts
 * - attach the acUser singleton as User to pwiAccounts
 */

import { Tracker } from 'meteor/tracker';

import { acDisplayer } from '../classes/ac_displayer.class.js';
import { acUser } from '../classes/ac_user.class.js';
import { IDisplayer } from '../classes/idisplayer.interface.js';

_ready = {
    dep: new Tracker.Dependency(),
    val: false
};

pwiAccounts = {
    ...pwiAccounts,
    ...{
        Displayer: new acDisplayer(),
        User: new acUser(),

        /**
         * @summary Returned value is updated at package client startup.
         * @locus Client
         * @returns {Boolean} true when the package is ready
         * A reactive data source.
         */
        ready: function(){
            _ready.dep.depend();
            return _ready.val;
        }
    }
}

console.log( 'pwiAccounts.Displayer instanceof acDisplayer', pwiAccounts.Displayer instanceof acDisplayer );
console.log( 'pwiAccounts.Displayer instanceof IDisplayer', pwiAccounts.Displayer instanceof IDisplayer );
