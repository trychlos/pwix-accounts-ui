/*
 * pwi:accounts/src/common/js/defaults.js
 */

stdMenuItems = {
    AC_LOGGED: [
        {
            id: 'ac-signout-item',
            aclass: 'ac-signout',
            faicon: 'fa-right-from-bracket',
            labelkey: 'signout',
            enablefn: enableAlways,
            panel: 'SIGNOUT',
            msgaction: 'ac-panel-signout'
        },
        {
            id: 'ac-changepwd-item',
            aclass: 'ac-changepwd',
            faicon: 'fa-passport',
            labelkey: 'changepwd',
            enablefn: enableAlways,
            panel: 'CHANGEPWD',
            msgaction: 'ac-panel-changepwd'
        },
        {
            id: 'ac-verifyask-item',
            aclass: 'ac-verifyask',
            faicon: 'fa-envelope-circle-check',
            labelkey: 'verifyask',
            enablefn: enableMailVerified,
            panel: 'VERIFYASK',
            msgaction: 'ac-panel-verifyask'
        }
    ],
    AC_UNLOGGED: [
        {
            id: 'ac-signin-item',
            aclass: 'ac-signin',
            faicon: 'fa-user',
            labelkey: 'signin',
            enablefn: enableAlways,
            panel: 'SIGNIN',
            msgaction: 'ac-panel-signin'
        },
        {
            id: 'ac-signup-item',
            aclass: 'ac-signup',
            faicon: 'fa-user-plus',
            labelkey: 'signup',
            enablefn: enableAlways,
            panel: 'SIGNUP',
            msgaction: 'ac-panel-signup'
        },
        {
            id: 'ac-resetask-item',
            aclass: 'ac-resetask',
            faicon: 'fa-lock-open',
            labelkey: 'resetask',
            enablefn: enableAlways,
            panel: 'RESETASK',
            msgaction: 'ac-panel-resetask'
        },
    ]
};

defaults = {
    conf: {
        haveEmailAddress: AC_FIELD_MANDATORY,
        haveUsername: AC_FIELD_NONE,
        loginNonVerified: true,
        passwordLength: 8,
        passwordStrength: AC_PWD_MEDIUM,
        preferredButtonId: AC_DISP_EMAIL,
        preferredLabelId: AC_DISP_EMAIL,
        ui: AC_UI_BOOTSTRAP
    },
    acUserLogin: {
        loggedButtonAction: AC_ACT_DROPDOWN,
        unloggedButtonAction: AC_ACT_DROPDOWN,
        loggedButtonClass: '',
        unloggedButtonClass: 'dropdown-toggle',
        loggedButtonContent: AC_DISP_EMAIL,
        unloggedButtonContent: '<span class="fa-regular fa-fw fa-user"></span>',
        loggedItems: pwiAccounts.client.loggedItems( false ),
        unloggedItems: pwiAccounts.client.unloggedItems( false ),
        loggedItemsAfter: [],
        unloggedItemsAfter: [],
        loggedItemsBefore: [],
        unloggedItemsBefore: [],
        renderMode: AC_RENDER_MODAL,
        initialPanel: AC_PANEL_NONE,
        singlePanel: false,
        changePwdText: '',
        resetPwdText: fn(),
        signinText: '',
        signoutText: '',
        signupText: '',
    }
};
