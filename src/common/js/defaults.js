/*
 * pwix:accounts/src/common/js/defaults.js
 *
 * Setup the common defaults
 */

import { acOptionsConf } from '../classes/ac_options_conf.class.js';

/*
 * a function to return the 'passwordTwice' package default value
 */
function _passwordTwice(){
    return pwiAccounts._opts ? pwiAccounts.opts().passwordTwice() : true;
}

defaults = {
    common: {
        haveEmailAddress: AC_FIELD_MANDATORY,
        haveUsername: AC_FIELD_NONE,
        informResetWrongEmail: AC_RESET_EMAILUNSENT,
        passwordLength: 8,
        passwordStrength: AC_PWD_MEDIUM,
        passwordTwice: true,
        resetPwdTextOne: { namespace: AC_I18N, i18n: 'reset_pwd.textOne' },
        resetPwdTextTwo: '',
        resetPasswordTwice: _passwordTwice,
        usernameLength: 4,
        verbosity: AC_VERBOSE_CONFIGURE
    }
};

pwiAccounts._conf = {
    ...pwiAccounts._conf,
    ...defaults.common
};

pwiAccounts._opts = new acOptionsConf( pwiAccounts._conf );
