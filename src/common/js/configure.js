/*
 * pwix:accounts-ui/src/common/js/configure.js
 *
 * Just define the object here.
 */

import _ from 'lodash';

import { acOptionsConf } from '../classes/ac_options_conf.class.js';

/**
 * @summarry Runtime configuration getter
 * @locus Anywhere
 * @returns {acOptionsConf} the runtime configuration object
 */
pwixAccounts.opts = function(){
    return pwixAccounts._opts;
};

/*
 * a function to return the 'passwordTwice' package default value
 */
function _passwordTwice(){
    return pwixAccounts._opts ? pwixAccounts.opts().passwordTwice() : true;
}

defaults = {
    common: {
        haveEmailAddress: AC_FIELD_MANDATORY,
        haveUsername: AC_FIELD_NONE,
        informResetWrongEmail: AC_RESET_EMAILUNSENT,
        onVerifiedEmailBox: true,
        onVerifiedEmailTitle: { namespace: I18N, i18n: 'user.verify_title' },
        onVerifiedEmailMessage: { namespace: I18N, i18n: 'user.verify_text' },
        onVerifiedEmailCb: null,
        passwordLength: 8,
        passwordStrength: AC_PWD_MEDIUM,
        passwordTwice: true,
        resetPwdTextOne: { namespace: I18N, i18n: 'reset_pwd.textOne' },
        resetPwdTextTwo: '',
        resetPasswordTwice: _passwordTwice,
        sendVerificationEmail: true,
        usernameLength: 4,
        verbosity: AC_VERBOSE_NONE
    }
};

_.merge( pwixAccounts._conf, defaults.common );
//console.debug( pwixAccounts );
pwixAccounts._opts = new acOptionsConf( pwixAccounts._conf );

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server
 * @locus Anywhere
 * @param {Object} o the configuration options
 * @returns {Object} the package configuration
 */
pwixAccounts.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( pwixAccounts._conf, defaults.common, o );
        pwixAccounts._opts.set( pwixAccounts._conf );
        // be verbose if asked for
        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_CONFIGURE ){
            console.log( 'pwix:accounts-ui configure() with', o, 'building', pwixAccounts._conf );
        }
    }
    // also acts as a getter
    return pwixAccounts._conf;
};
