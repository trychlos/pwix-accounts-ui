/*
 * pwix:accounts/src/common/js/config.js
 *
 * Just define the object here.
 */

import { Tracker } from 'meteor/tracker';

console.log( 'pwix:accounts/src/common/js/config.js defining globally exported pwiAccounts object' );

_ready = {
    dep: new Tracker.Dependency(),
    val: false
};

pwiAccounts = {
    conf: {},

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwix:accounts configure() with', o );
        pwiAccounts.conf = { ...pwiAccounts.conf, ...o };
    },

    // internationalization
    i18n: {},

    /**
     * A reactive data source.
     * Returned value is updated at package client startup.
     * @returns {Boolean} true when the package is ready
     */
    ready: function(){
        _ready.dep.depend();
        return _ready.val;
    }
};
