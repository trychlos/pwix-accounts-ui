/*
 * pwix:accounts-ui/src/client/js/defaults.js
 *
 * Setup the client defaults.
 */

import _ from 'lodash';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { pwixI18n } from 'meteor/pwix:i18n';

/* 
 *  HTML attributs
 * 
 * - aclass: the class to add to the <a> element to qualify it
 * - faicon: the icon to be displayed besides of the item
 * - labelkey: the key of the label in AccountsUI.strings[]['features']
 * - enablefn: a function which returns a boolean to enable an item
 *
 * Properties
 * 
 * - panel: the panel to be displayed at item activation
 */

_stdMenuItems = {};

_stdMenuItems[AccountsUI.C.Connection.LOGGED] = [
    {
        id: 'ac-signout-item',
        aclass: 'ac-signout',
        faicon: 'fa-right-from-bracket',
        labelkey: 'signout',
        enablefn: _enableAlways,
        panel: AccountsUI.C.Panel.SIGNOUT
    },
    {
        id: 'ac-changepwd-item',
        aclass: 'ac-changepwd',
        faicon: 'fa-passport',
        labelkey: 'changepwd',
        enablefn: _enableAlways,
        panel: AccountsUI.C.Panel.CHANGEPWD
    },
    {
        id: 'ac-verifyask-item',
        aclass: 'ac-verifyask',
        faicon: 'fa-envelope-circle-check',
        labelkey: 'verifyask',
        enablefn: _enableMailVerified,
        panel: AccountsUI.C.Panel.VERIFYASK
    }
];

_stdMenuItems[AccountsUI.C.Connection.UNLOGGED] = [
    {
        id: 'ac-signin-item',
        aclass: 'ac-signin',
        faicon: 'fa-user',
        labelkey: 'signin',
        enablefn: _enableAlways,
        panel: AccountsUI.C.Panel.SIGNIN
    },
    {
        id: 'ac-signup-item',
        aclass: 'ac-signup',
        faicon: 'fa-user-plus',
        labelkey: 'signup',
        enablefn: _enableAlways,
        panel: AccountsUI.C.Panel.SIGNUP
    },
    {
        id: 'ac-resetask-item',
        aclass: 'ac-resetask',
        faicon: 'fa-lock-open',
        labelkey: 'resetask',
        enablefn: _enableAlways,
        panel: AccountsUI.C.Panel.RESETASK
    },
];

/*
 * whether to enable the items
 */
function _enableAlways(){
    return true;
}

function _enableMailVerified(){
    return AccountsUI.User.countUnverifiedEmails() > 0;
}

/*
 * @param {Array} the stdMenuItems[AccountsUI.C.Connection.LOGGED] (resp AccountsUI.C.Connection.UNLOGGED) source array
 * @returns {Array} an array of items as the <li>...</li> inner HTML strings
 */
_buildStandardItems = function( source ){
    let result = [];
    source.every(( it ) => {
        let html = '<a class="dropdown-item d-flex align-items-center justify-content-start ac-dropdown-item '+it.aclass;
        if( it.enablefn && !it.enablefn()){
            html += ' disabled';
        }
        html += '" href="#" data-ac-event="'+AccountsUI.Panel.toEvent( it.panel )+'" data-ac-panel="'+it.panel+'"';
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
 * a function to return the 'mandatoryFieldsBorder' package default value
 */
function _coloredBorders(){
    return AccountsUI.opts().coloredBorders();
}

/*
 * a function to return the first email address of the logged-in user (if any)
 */
function _emailAddress(){
    const email = AccountsUI.User.firstEmailAddress();
    //console.debug( 'email', email );
    return email;
}

/*
 * a function to return the 'haveEmailAddress' package default value
 */
function _haveEmailAddress(){
    return AccountsConf.configure().haveEmailAddress();
}

/*
 * a function to return the 'haveUsername' package default value
 */
function _haveUsername(){
    return AccountsConf.configure().haveUsername();
}

/*
 * a function to return the 'passwordTwice' package default value
 */
function _passwordTwice(){
    return AccountsUI.opts().passwordTwice();
}

_.merge( defaults, {
    acUserLogin: {
        initialDisplay: AccountsUI.C.Display.DROPDOWNBUTTON,
        loggedButtonClass: 'dropdown-toggle',
        unloggedButtonClass: '',
        loggedButtonContent: _emailAddress,
        unloggedButtonContent: '<span class="fa-regular fa-fw fa-user"></span>',
        loggedItems: DEF_CONTENT,
        unloggedItems: DEF_CONTENT,
        loggedItemsAfter: [],
        unloggedItemsAfter: [],
        loggedItemsBefore: [],
        unloggedItemsBefore: [],
        renderMode: AccountsUI.C.Render.MODAL,
        changePasswordTwice: _passwordTwice,
        coloredBorders: _coloredBorders,
        haveCancelButton: true,
        haveOKButton: true,
        changePwdTextOne: '',
        changePwdTextTwo: '',
        changePwdTextThree: '',
        resetAskTextOne: { namespace: I18N, i18n: 'reset_ask.textOne' },
        resetAskTextTwo: '',
        signinTextOne: '',
        signinTextTwo: '',
        signinTextThree: '',
        signoutTextOne: { namespace: I18N, i18n: 'signout.textOne' },
        signupTextOne: '',
        signupTextTwo: '',
        signupTextThree: '',
        signupTextFour: '',
        signupTextFive: '',
        verifyAskTextOne: { namespace: I18N, i18n: 'verify_ask.textOne' },
        signupEmailPlaceholder: { namespace: I18N, i18n: 'input_email.placeholder' },
        signupUsernamePlaceholder: { namespace: I18N, i18n: 'input_username.placeholder' },
        signupPasswdOnePlaceholder: { namespace: I18N, i18n: 'input_password.placeholder' },
        signupPasswdTwoPlaceholder: { namespace: I18N, i18n: 'twice_passwords.placeholder2' },
        signinLink: true,
        signupLink: true,
        resetLink: true,
        signinFieldset: false,
        signinLegendEmail: '',
        signinLegendPassword: '',
        signinLegendUsername: '',
        signupFieldset: false,
        signupHaveEmailAddress: _haveEmailAddress,
        signupHaveUsername: _haveUsername,
        signupLegendEmail: '',
        signupLegendPassword: '',
        signupLegendUsername: '',
        signupPasswordTwice: _passwordTwice,
        signupAutoClose: true,
        signupAutoConnect: true,
        signupClearPanel: true,
        signupSubmit: true,
        name: '',
        withExternalMessager: false
    }
});
