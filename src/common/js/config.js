/*
 * pwix:accounts/src/common/js/config.js
 *
 * Just define the object here.
 */

import { Tracker } from 'meteor/tracker';

import { acOptionsConf } from '../classes/ac_options_conf.class.js';

//console.log( 'pwix:accounts/src/common/js/config.js defining globally exported pwiAccounts object' );

_ready = {
    dep: new Tracker.Dependency(),
    val: false
};

pwiAccounts = {
    _conf: {},
    _opts: null,

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwix:accounts configure() with', o );
        pwiAccounts._conf = { ...pwiAccounts._conf, ...o };
        pwiAccounts._opts = new acOptionsConf( pwiAccounts._conf );
    },

    // internationalization
    i18n: {},

    // configuration access
    opts(){
        return pwiAccounts._opts;
    },

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
