/*
 * pwix:accounts/src/client/js/ready.js
 *
 * The first version of the package used to declare it ready at startup() time.
 * But there is no reason to wait until that while initialization time is safe too...
 */

import { Tracker } from 'meteor/tracker';

_ready = {
    dep: new Tracker.Dependency(),
    val: false
};

/**
 * @summary Manage the readyness package state from the client point of view.
 * @locus Client
 * @returns {Boolean} true when the package is ready
 * A reactive data source.
 */
pwiAccounts.ready = function(){
    _ready.dep.depend();
    return _ready.val;
};

function _set_ready(){
    _ready.val = true,
    _ready.dep.changed();
}

_set_ready();

// trace readyness changes
Tracker.autorun(() => {
    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_READY ){
        console.log( 'pwix:accounts ready', pwiAccounts.ready());
    }
});
