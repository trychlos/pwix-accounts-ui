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
        haveEmailAddress: AC_FIELD_MANDATORY,
        haveUsername: AC_FIELD_NONE,
        informResetWrongEmail: AC_RESET_EMAILUNSENT,
        mandatoryFieldsBorder: false,
        onVerifiedEmailBox: true,
        onVerifiedEmailTitle: { namespace: I18N, i18n: 'user.verify_title' },
        onVerifiedEmailMessage: { namespace: I18N, i18n: 'user.verify_text' },
        onVerifiedEmailCb: null,
        passwordLength: 8,
        passwordStrength: AC_PWD_MEDIUM,
        passwordTwice: true,
        preferredLabel: AccountsUI.C.PreferredLabel.EMAIL_ADDRESS,
        resetPwdTextOne: { namespace: I18N, i18n: 'reset_pwd.textOne' },
        resetPwdTextTwo: '',
        resetPasswordTwice: _passwordTwice,
        sendVerificationEmail: true,
        usernameLength: 4,
        verbosity: AC_VERBOSE_NONE
    }
};

_.merge( AccountsUI._conf, defaults.common );
//console.debug( AccountsUI );
AccountsUI._opts = new acOptionsConf( AccountsUI._conf );

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server
 * @locus Anywhere
 * @param {Object} o the configuration options
 * @returns {Object} the package configuration
 */
AccountsUI.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( AccountsUI._conf, defaults.common, o );
        AccountsUI._opts.baseOpt_set( AccountsUI._conf );
        // be verbose if asked for
        if( AccountsUI.opts().verbosity() & AC_VERBOSE_CONFIGURE ){
            console.log( 'pwix:accounts-ui configure() with', o, 'building', AccountsUI._conf );
        }
    }
    // also acts as a getter
    return AccountsUI._conf;
};
