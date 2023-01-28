/*
 * pwix:accounts/src/common/js/defaults.js
 *
 * Setup the common defaults
 */

/*
 * a function to return the 'passwordTwice' package default value
 */
function _passwordTwice(){
    return pwiAccounts.conf.passwordTwice;
}

defaults = {
    common: {
        haveEmailAddress: AC_FIELD_MANDATORY,
        haveUsername: AC_FIELD_NONE,
        loginNonVerified: true,
        passwordLength: 8,
        passwordStrength: AC_PWD_MEDIUM,
        passwordTwice: true,
        resetPwdTextOne: { i18n: 'reset_pwd.textOne' },
        resetPwdTextTwo: '',
        resetPasswordTwice: _passwordTwice,
        usernameLength: 4,
        ui: AC_UI_BOOTSTRAP
    }
};

pwiAccounts.conf = {
    ...pwiAccounts.conf,
    ...defaults.common
};
