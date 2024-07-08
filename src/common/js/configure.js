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
        informWrongEmail: AccountsUI.C.WrongEmail.ERROR,
        coloredBorders: AccountsUI.C.Colored.NEVER,
        onEmailVerifiedBeforeFn: null,
        onEmailVerifiedBox: true,
        onEmailVerifiedBoxCb: null,
        onEmailVerifiedBoxMessage: { namespace: I18N, i18n: 'user.verify_text' },
        onEmailVerifiedBoxTitle: { namespace: I18N, i18n: 'user.verify_title' },
        passwordLength: 8,
        passwordStrength: AccountsUI.C.Password.MEDIUM,
        passwordTwice: true,
        resetPasswordTwice: _passwordTwice,
        resetPwdTextOne: { namespace: I18N, i18n: 'reset_pwd.textOne' },
        resetPwdTextTwo: '',
        sendVerificationEmail: true,
        usernameLength: 4,
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
        _.merge( AccountsUI._conf, o );
        AccountsUI._opts.base_set( AccountsUI._conf );
        // be verbose if asked for
        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.CONFIGURE ){
            //console.log( 'pwix:accounts-ui configure() with', o, 'building', AccountsUI._conf );
            console.log( 'pwix:accounts-ui configure() with', o );
        }
    }
    //console.debug( AccountsUI._conf );
    // also acts as a getter
    return AccountsUI._conf;
};
