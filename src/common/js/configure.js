/*
 * pwix:accounts/src/common/js/configure.js
 *
 * Just define the object here.
 */

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
        onVerifiedEmailTitle: { namespace: AC_I18N, i18n: 'user.verify_title' },
        onVerifiedEmailMessage: { namespace: AC_I18N, i18n: 'user.verify_text' },
        onVerifiedEmailCb: null,
        passwordLength: 8,
        passwordStrength: AC_PWD_MEDIUM,
        passwordTwice: true,
        resetPwdTextOne: { namespace: AC_I18N, i18n: 'reset_pwd.textOne' },
        resetPwdTextTwo: '',
        resetPasswordTwice: _passwordTwice,
        sendVerificationEmail: true,
        usernameLength: 4,
        verbosity: AC_VERBOSE_NONE
    }
};

pwixAccounts._conf = { ...defaults.common };
pwixAccounts._opts = new acOptionsConf( pwixAccounts._conf );

/**
 * @summary Package configuration
 * @locus Anywhere
 * @param {Object} o the runtime configuration of the package
 *  Should be *in same terms* called both by the client and the server.
 */
pwixAccounts.configure = function( o ){
    pwixAccounts._conf = { ...defaults.common, ...o };
    pwixAccounts._opts.set( pwixAccounts._conf );

    if( pwixAccounts.opts().verbosity() & AC_VERBOSE_CONFIGURE ){
        console.log( 'pwix:accounts configure() with', o );
    }
};
