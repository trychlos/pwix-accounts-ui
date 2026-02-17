/*
 * pwix:accounts-ui/src/common/js/configure.js
 *
 * Just define the object here.
 */

import _ from 'lodash';

import { acOptions } from '../classes/ac_options.class.js';

/**
 * @summarry Runtime configuration getter
 * @locus Anywhere
 * @returns {acOptions} the runtime configuration object
 */
AccountsUI.opts = function(){
    return AccountsUI._opts;
};

/*
 * a function to return the 'passwordTwice' package default value
 */
function _passwordTwice(){
    return AccountsUI._opts ? AccountsUI.opts().passwordTwice() : true;
}

defaults = {
    common: {
        coloredBorders: AccountsUI.C.Colored.NEVER,
        onEmailVerifiedBeforeFn: null,
        onEmailVerifiedBox: true,
        onEmailVerifiedBoxCb: null,
        onEmailVerifiedBoxMessage: { namespace: I18N, i18n: 'user.verify_text' },
        onEmailVerifiedBoxTitle: { namespace: I18N, i18n: 'user.verify_title' },
        passwordTwice: true,
        resetPasswordTwice: _passwordTwice,
        resetPwdTextOne: { namespace: I18N, i18n: 'reset_pwd.textOne' },
        resetPwdTextTwo: '',
        verbosity: AccountsUI.C.Verbose.NONE
    }
};

_.merge( AccountsUI._conf, defaults.common );
//console.debug( AccountsUI );
AccountsUI._opts = new acOptions( AccountsUI._conf );

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server
 * @locus Anywhere
 * @param {Object} o the configuration options
 * @returns {Object} the package configuration
 */
AccountsUI.configure = function( o ){
    if( o && _.isObject( o )){
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( defaults.common ).includes( it )){
                built_conf[it] = o[it];
            } else {
                console.warn( 'pwix:accounts-ui configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _.merge( AccountsUI._conf, built_conf );
            AccountsUI._opts.base_set( AccountsUI._conf );
            // be verbose if asked for
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.CONFIGURE ){
                //console.log( 'pwix:accounts-ui configure() with', o, 'building', AccountsUI._conf );
                console.log( 'pwix:accounts-ui configure() with', built_conf );
            }
        }
    }
    //console.debug( AccountsUI._conf );
    // also acts as a getter
    return AccountsUI._conf;
};
