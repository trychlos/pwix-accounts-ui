/*
 * pwix:accounts-ui/src/client/js/ready.js
 *
 * The first version of the package used to declare it ready at startup() time.
 * But there is no reason to wait until that while initialization time is safe too...
 */

import { Logger } from 'meteor/pwix:logger';
import { Tracker } from 'meteor/tracker';

const logger = Logger.get();

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
AccountsUI.ready = function(){
    _ready.dep.depend();
    return _ready.val;
};

function _set_ready(){
    _ready.val = true,
    _ready.dep.changed();
}

// this is the last file imported on client-side - so we are 'ready' here
_set_ready();

// trace readyness changes
Tracker.autorun(() => {
    logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.READY }, 'AccountsUI.ready()', AccountsUI.ready());
});
