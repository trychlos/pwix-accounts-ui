/*
 * pwix:accounts-ui/src/client/js/defaults.js
 *
 * Setup the client defaults.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

/* 
 *  HTML attributs
 * 
 * - aclass: the class to add to the <a> element to qualify it
 * - faicon: the icon to be displayed besides of the item
 * - labelkey: the key of the label in pwixAccounts.strings[]['features']
 * - enablefn: a function which returns a boolean to enable an item
 *
 * Properties
 * 
 * - panel: the panel to be displayed at item activation
 * - msgaction: the message to be triggered for simulating the item activation
 *          under the hood, the message handler just requests the specified panel with the corresponding argument
 */
_stdMenuItems = {
    AC_LOGGED: [
        {
            id: 'ac-signout-item',
            aclass: 'ac-signout',
            faicon: 'fa-right-from-bracket',
            labelkey: 'signout',
            enablefn: _enableAlways,
            panel: 'AC_PANEL_SIGNOUT',
            msgaction: 'ac-panel-signout-event'
        },
        {
            id: 'ac-changepwd-item',
            aclass: 'ac-changepwd',
            faicon: 'fa-passport',
            labelkey: 'changepwd',
            enablefn: _enableAlways,
            panel: 'AC_PANEL_CHANGEPWD',
            msgaction: 'ac-panel-changepwd-event'
        },
        {
            id: 'ac-verifyask-item',
            aclass: 'ac-verifyask',
            faicon: 'fa-envelope-circle-check',
            labelkey: 'verifyask',
            enablefn: _enableMailVerified,
            panel: 'AC_PANEL_VERIFYASK',
            msgaction: 'ac-panel-verifyask-event'
        }
    ],
    AC_UNLOGGED: [
        {
            id: 'ac-signin-item',
            aclass: 'ac-signin',
            faicon: 'fa-user',
            labelkey: 'signin',
            enablefn: _enableAlways,
            panel: 'AC_PANEL_SIGNIN',
            msgaction: 'ac-panel-signin-event'
        },
        {
            id: 'ac-signup-item',
            aclass: 'ac-signup',
            faicon: 'fa-user-plus',
            labelkey: 'signup',
            enablefn: _enableAlways,
            panel: 'AC_PANEL_SIGNUP',
            msgaction: 'ac-panel-signup-event'
        },
        {
            id: 'ac-resetask-item',
            aclass: 'ac-resetask',
            faicon: 'fa-lock-open',
            labelkey: 'resetask',
            enablefn: _enableAlways,
            panel: 'AC_PANEL_RESETASK',
            msgaction: 'ac-panel-resetask-event'
        },
    ]
};

/*
 * whether to enable the items
 */
function _enableAlways(){
    return true;
}

function _enableMailVerified(){
    return !pwixAccounts.User.mailVerified()
}

/*
 * @param {Array} the stdMenuItems[AC_LOGGED] (resp AC_UNLOGGED) source array
 * @returns {Array} an array of items as the <li>...</li> inner HTML strings
 */
_buildStandardItems = function( source ){
    let result = [];
    source.every(( it ) => {
        let html = '<a class="dropdown-item d-flex align-items-center justify-content-start ac-dropdown-item '+it.aclass;
        if( it.enablefn && !it.enablefn()){
            html += ' disabled';
        }
        html += '" href="#" data-ac-msg="'+it.msgaction+'" data-ac-panel="'+it.panel+'"';
        html += '>';
        html += '<span class="fa-solid fa-fw '+it.faicon+'"></span>';
        html += '<p>'+pwixI18n.label( I18N, 'features.'+it.labelkey )+'</p>';
        html += '</a>'
        result.push( html );
        return true;
    });
    return result;
}

/*
 * a function to return the email address of the logged-in user
 */
function _emailAddress(){
    return pwixAccounts.User.emailAddress();
}

/*
 * a function to return the 'passwordTwice' package default value
 */
function _passwordTwice(){
    return pwixAccounts.opts().passwordTwice();
}

_.merge( defaults, {
    acUserLogin: {
        loggedButtonAction: AC_ACT_DROPDOWN,
        unloggedButtonAction: AC_ACT_DROPDOWN,
        loggedButtonClass: 'dropdown-toggle',
        unloggedButtonClass: '',
        loggedButtonContent: _emailAddress,
        unloggedButtonContent: '<span class="fa-regular fa-fw fa-user"></span>',
        loggedItems: _buildStandardItems( _stdMenuItems.AC_LOGGED ),
        unloggedItems: _buildStandardItems( _stdMenuItems.AC_UNLOGGED ),
        loggedItemsAfter: [],
        unloggedItemsAfter: [],
        loggedItemsBefore: [],
        unloggedItemsBefore: [],
        renderMode: AC_RENDER_MODAL,
        haveCancelButton: true,
        signupPasswordTwice: _passwordTwice,
        changePasswordTwice: _passwordTwice,
        initialPanel: AC_PANEL_NONE,
        changePwdTextOne: '',
        changePwdTextTwo: '',
        changePwdTextThree: '',
        resetAskTextOne: { namespace: I18N, i18n: 'reset_ask.textOne' },
        resetAskTextTwo: '',
        signinLegendEmail: '',
        signinLegendPassword: '',
        signinLegendUsername: '',
        signinTextOne: '',
        signinTextTwo: '',
        signinTextThree: '',
        signoutTextOne: { namespace: I18N, i18n: 'signout.textOne' },
        signupLegendEmail: '',
        signupLegendPassword: '',
        signupLegendUsername: '',
        signupTextOne: '',
        signupTextTwo: '',
        signupTextThree: '',
        signupTextFour: '',
        verifyAskTextOne: { namespace: I18N, i18n: 'verify_ask.textOne' },
        signinLink: true,
        signupLink: true,
        resetLink: true,
        signupAutoClose: true,
        signupAutoConnect: true,
        name: ''
    }
});
