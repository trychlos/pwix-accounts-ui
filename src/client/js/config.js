/*
 * pwix:accounts/src/client/js/config.js
 *
 * - attach the acDisplayManager singleton to pwiAccounts
 * - attach the acUser singleton as User to pwiAccounts
 */

import { Tracker } from 'meteor/tracker';

import { acDisplayer } from '../classes/ac_displayer.class.js';
import { acAnonRequester } from '../classes/ac_anon_requester.class.js';
import { acDisplayManager } from '../classes/ac_display_manager.class.js';
import { acEventManager } from '../classes/ac_event_manager.class.js';
import { acUser } from '../classes/ac_user.class.js';

_ready = {
    dep: new Tracker.Dependency(),
    val: false
};

pwiAccounts = {
    ...pwiAccounts,
    ...{
        AnonRequester: new acAnonRequester(),   // to be obsoleted
        Displayer: new acDisplayer(),           // to be obsoleted

        DisplayManager: new acDisplayManager(),
        EventManager: new acEventManager(),
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
