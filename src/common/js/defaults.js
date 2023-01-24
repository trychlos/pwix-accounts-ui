/*
 * pwix:accounts/src/common/js/defaults.js
 *
 * Setup the common defaults
 */

defaults = {
    common: {
        haveEmailAddress: AC_FIELD_MANDATORY,
        haveUsername: AC_FIELD_NONE,
        loginNonVerified: true,
        passwordLength: 8,
        passwordStrength: AC_PWD_MEDIUM,
        ui: AC_UI_BOOTSTRAP
    }
};

pwiAccounts.conf = {
    ...pwiAccounts.conf,
    ...defaults.common
};
