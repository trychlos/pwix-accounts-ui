/*
 * pwi:accounts/src/common/js/config.js
 */

import { Tracker } from 'meteor/tracker';

console.log( 'pwi:accounts/src/common/js/config.js declaring globally exported pwiAccounts object' );

_ready = {
    dep: new Tracker.Dependency(),
    val: false
};

pwiAccounts = {

    // client-specific data and functions
    client: {},

    conf: defaults.conf,
    /*
        reset_ask: {
            // textBefore (resp. textAfter) may be an object { group, key } in strings.js, or just a (localized) string
            textBefore: {
                group: 'reset_ask',
                key: 'textBefore'
            }
        },
        signout: {
            textBefore: {
                group: 'signout',
                key: 'textBefore'
            }
        },
        verify_ask: {
            textBefore: {
                group: 'verify_ask',
                key: 'text'
            }
        },
    },
    */

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwi:accounts configure() with', o );
        pwiAccounts.conf = { ...pwiAccounts.conf, ...o };
    },

    /**
     * A reactive data source, only relevant on the client.
     * Returned value is updated at package client startup.
     * @returns {Boolean} true when the package is ready
     */
    ready: function(){
        _ready.dep.depend();
        return _ready.val;
    },

    // server-specific data and functions
    server: {}
};
