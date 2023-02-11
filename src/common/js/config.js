/*
 * pwix:accounts/src/common/js/config.js
 *
 * Just define the object here.
 */

import { acOptionsConf } from '../classes/ac_options_conf.class.js';

//console.log( 'pwix:accounts/src/common/js/config.js defining globally exported pwiAccounts object' );

pwiAccounts = {
    _conf: {},
    _opts: null,

    /**
     * @summary Package configuration
     * @locus Anywhere
     * @param {Object} o the runtime configuration of the package
     *  Should be *in same terms* called both by the client and the server.
     */
    configure: function( o ){
        console.log( 'pwix:accounts configure() with', o );
        pwiAccounts._conf = { ...pwiAccounts._conf, ...o };
        pwiAccounts._opts = new acOptionsConf( pwiAccounts._conf );
    },

    // internationalization
    i18n: {},

    /**
     * @summarry Runtime configuration getter
     * @locus Anywhere
     * @returns {acOptionsConf} the runtime configuration object
     */
    opts(){
        return pwiAccounts._opts;
    }
};
