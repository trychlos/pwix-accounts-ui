/*
 * pwix:accounts-ui/src/common/js/constants.js
 */

AccountsUI.C = {

    // action of the button
    Button: {
        HIDDEN: 'AC_ACT_HIDDEN',
        NONE: 'AC_ACT_NONE',
        DROPDOWN: 'AC_ACT_DROPDOWN',
        BUBBLE: 'AC_ACT_BUBBLE'
    },

    // colored borders
    Colored: {
        NEVER: 'AC_COLORED_NEVER',
        VALIDATION: 'AC_COLORED_VALIDATION',
        MANDATORY: 'AC_COLORED_MANDATORY'
    },

    // connection status
    Connection: {
        LOGGED: 'AC_LOGGED',
        UNLOGGED: 'AC_UNLOGGED'
    },

    // username / email address input rule
    Input: {
        NONE: 'AC_FIELD_NONE',
        OPTIONAL: 'AC_FIELD_OPTIONAL',
        MANDATORY: 'AC_FIELD_MANDATORY'
    },


    // known panels
    Panel: {
        NONE: 'AC_PANEL_NONE',
        CHANGEPWD: 'AC_PANEL_CHANGEPWD',
        RESETASK: 'AC_PANEL_RESETASK',
        RESETPWD: 'AC_PANEL_RESETPWD',
        SIGNIN: 'AC_PANEL_SIGNIN',
        SIGNOUT: 'AC_PANEL_SIGNOUT',
        SIGNUP: 'AC_PANEL_SIGNUP',
        VERIFYASK: 'AC_PANEL_VERIFYASK'
    },

    // password estimated strength
    Password: {
        VERYWEAK: 'AC_PWD_VERYWEAK',
        WEAK: 'AC_PWD_WEAK',
        MEDIUM: 'AC_PWD_MEDIUM',
        STRONG: 'AC_PWD_STRONG',
        VERYSTRONG: 'AC_PWD_VERYSTRONG'
    },

    // rendering mode
    Render: {
        MODAL: 'AC_RENDER_MODAL',
        DIV: 'AC_RENDER_DIV'
    },

    // verbosity level
    Verbose: {
        NONE:           0,
        CONFIGURE:      0x01 <<  0,
        STARTUP:        0x01 <<  1,
        INSTANCIATIONS: 0x01 <<  2,
        READY:          0x01 <<  3,     // when ready(), client-only
        DISPLAY:        0x01 <<  4,
        EVENT:          0x01 <<  5,
        PANEL:          0x01 <<  6,
        USER:           0x01 <<  7,
        SUBMIT:         0x01 <<  8,
        MODAL:          0x01 <<  9
    },

    // what to do when email cannot be sent
    WrongEmail: {
        OK: 'AccountsUI.C.WrongEmail.OK',
        ERROR: 'AccountsUI.C.WrongEmail.ERROR'
    }
};

// non exported internal constant as i18n namespace
I18N = 'pwix:accounts-ui:i18n'

// non exported internal constant as unidentified requester
ANONYMOUS = 'ANONYMOUS';

// non exported default content
DEF_CONTENT = 'DEF_CONTENT';
