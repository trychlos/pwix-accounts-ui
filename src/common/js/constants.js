/*
 * pwix:accounts-ui/src/common/js/constants.js
 */

AccountsUI.C = {

    // when choosing a preferred label
    PreferredLabel: {
        USERNAME: 'USERNAME',
        EMAIL_ADDRESS: 'EMAIL_ADDRESS'
    }
};

// connection status
AC_LOGGED = 'AC_LOGGED';
AC_UNLOGGED = 'AC_UNLOGGED';

// action of the button
AC_ACT_HIDDEN = 'AC_ACT_HIDDEN';
AC_ACT_NONE = 'AC_ACT_NONE';
AC_ACT_DROPDOWN = 'AC_ACT_DROPDOWN';
AC_ACT_BUBBLE = 'AC_ACT_BUBBLE';

// username / email address input rule
AC_FIELD_NONE = 'AC_FIELD_NONE';
AC_FIELD_OPTIONAL = 'AC_FIELD_OPTIONAL';
AC_FIELD_MANDATORY = 'AC_FIELD_MANDATORY';

// known panels
AC_PANEL_NONE = 'AC_PANEL_NONE';
AC_PANEL_CHANGEPWD = 'AC_PANEL_CHANGEPWD';
AC_PANEL_RESETASK = 'AC_PANEL_RESETASK';
AC_PANEL_RESETPWD = 'AC_PANEL_RESETPWD';
AC_PANEL_SIGNIN = 'AC_PANEL_SIGNIN';
AC_PANEL_SIGNOUT = 'AC_PANEL_SIGNOUT';
AC_PANEL_SIGNUP = 'AC_PANEL_SIGNUP';
AC_PANEL_VERIFYASK = 'AC_PANEL_VERIFYASK';

// password estimated strength
AC_PWD_VERYWEAK = 'AC_PWD_VERYWEAK';
AC_PWD_WEAK = 'AC_PWD_WEAK';
AC_PWD_MEDIUM = 'AC_PWD_MEDIUM';
AC_PWD_STRONG = 'AC_PWD_STRONG';
AC_PWD_VERYSTRONG = 'AC_PWD_VERYSTRONG';

// rendering mode
AC_RENDER_MODAL = 'AC_RENDER_MODAL';
AC_RENDER_DIV = 'AC_RENDER_DIV';

// what to do when email cannot be sent on resetpwd_ask
AC_RESET_EMAILSENT = 'AC_RESET_EMAILSENT';
AC_RESET_EMAILUNSENT = 'AC_RESET_EMAILUNSENT';
AC_RESET_EMAILERROR = 'AC_RESET_EMAILERROR'

// verbosity level
AC_VERBOSE_NONE           = 0x00;
AC_VERBOSE_CONFIGURE      = 0x01 <<  0;
AC_VERBOSE_STARTUP        = 0x01 <<  1;
AC_VERBOSE_INSTANCIATIONS = 0x01 <<  2;
AC_VERBOSE_READY          = 0x01 <<  3;     // when ready(), client-only
AC_VERBOSE_DISP_MANAGER   = 0x01 <<  4;
// = 0x01 <<  5;
AC_VERBOSE_PANEL          = 0x01 <<  6;
// = 0x01 <<  7;
AC_VERBOSE_USER           = 0x01 <<  8;
// = 0x01 <<  9;
AC_VERBOSE_SUBMIT         = 0x01 << 10;
// = 0x01 << 11;
AC_VERBOSE_MODAL          = 0x01 << 12;

// non exported internal constant as i18n namespace
I18N = 'pwix:accounts-ui:i18n'

// non exported internal constant as unidentified requester
ANONYMOUS = 'ANONYMOUS';

// non exported default content
DEF_CONTENT = 'DEF_CONTENT';
