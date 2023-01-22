/*
 * pwi:accounts/src/client/js/defaults.js
 *
 * Setup the client defaults.
 */

import { pwiI18n } from 'meteor/pwi:i18n';

/* 
 *  HTML attributs
 * 
 * - aclass: the class to add to the <a> element to qualify it
 * - faicon: the icon to be displayed besides of the item
 * - labelkey: the key of the label in pwiAccounts.strings[]['features']
 * - enablefn: a function which returns a boolean to enable an item
 *
 * Properties
 * 
 * - panel: the panel to be displayed at item activation
 *          the function pwiAccounts.client.Panel.asked() may be called with this argument
 * 
 * - msgaction: the message to be triggered for simulating the item activation
 *          under the hood, the message handler just calls pwiAccounts.client.Panel.asked() with the corresponding argument
 */
_stdMenuItems = {
    AC_LOGGED: [
        {
            id: 'ac-signout-item',
            aclass: 'ac-signout',
            faicon: 'fa-right-from-bracket',
            labelkey: 'signout',
            enablefn: _enableAlways,
            panel: 'SIGNOUT',
            msgaction: 'ac-panel-signout'
        },
        {
            id: 'ac-changepwd-item',
            aclass: 'ac-changepwd',
            faicon: 'fa-passport',
            labelkey: 'changepwd',
            enablefn: _enableAlways,
            panel: 'CHANGEPWD',
            msgaction: 'ac-panel-changepwd'
        },
        {
            id: 'ac-verifyask-item',
            aclass: 'ac-verifyask',
            faicon: 'fa-envelope-circle-check',
            labelkey: 'verifyask',
            enablefn: _enableMailVerified,
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
            enablefn: _enableAlways,
            panel: 'SIGNIN',
            msgaction: 'ac-panel-signin'
        },
        {
            id: 'ac-signup-item',
            aclass: 'ac-signup',
            faicon: 'fa-user-plus',
            labelkey: 'signup',
            enablefn: _enableAlways,
            panel: 'SIGNUP',
            msgaction: 'ac-panel-signup'
        },
        {
            id: 'ac-resetask-item',
            aclass: 'ac-resetask',
            faicon: 'fa-lock-open',
            labelkey: 'resetask',
            enablefn: _enableAlways,
            panel: 'RESETASK',
            msgaction: 'ac-panel-resetask'
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
    return !pwiAccounts.client.User.mailVerified()
}

/*
 * @param {Array} the stdMenuItems[AC_LOGGED] (resp AC_UNLOGGED) source array
 * @returns {Array} an array of items as the <li>...</li> inner HTML strings
 */
function _buildStandardItems( source ){
    let result = [];
    source.every(( it ) => {
        let html = '<a class="dropdown-item d-flex align-items-center justify-content-start ac-dropdown-item '+it.aclass;
        if( it.enablefn && !it.enablefn()){
            html += ' disabled';
        }
        html += '" href="#" data-ac-msg="'+it.msgaction+'"';
        html += '>';
        html += '<span class="fa-solid fa-fw '+it.faicon+'"></span>';
        html += '<p>'+pwiI18n.label( pwiAccounts.strings, 'features', it.labelkey )+'</p>';
        html += '</a>'
        result.push( html );
        return true;
    });
    return result;
}

defaults = {
    acUserLogin: {
        loggedButtonAction: AC_ACT_DROPDOWN,
        unloggedButtonAction: AC_ACT_DROPDOWN,
        loggedButtonClass: '',
        unloggedButtonClass: 'dropdown-toggle',
        loggedButtonContent: AC_DISP_EMAIL,
        unloggedButtonContent: '<span class="fa-regular fa-fw fa-user"></span>',
        loggedItems: _buildStandardItems( _stdMenuItems.AC_LOGGED ),
        unloggedItems: _buildStandardItems( _stdMenuItems.AC_UNLOGGED ),
        loggedItemsAfter: [],
        unloggedItemsAfter: [],
        loggedItemsBefore: [],
        unloggedItemsBefore: [],
        renderMode: AC_RENDER_MODAL,
        initialPanel: AC_PANEL_NONE,
        singlePanel: false,
        changePwdTextBefore: '',
        changePwdTextAfter: '',
        resetPwdTextBefore: pwiI18n.label( pwiAccounts.strings, 'reset_ask', 'textBefore' ),
        resetPwdTextAfter: '',
        signinTextBefore: '',
        signinTextAfter: '',
        signoutTextBefore: pwiI18n.label( pwiAccounts.strings, 'signout', 'textBefore' ),
        signoutTextAfter: '',
        signupTextBefore: '',
        signupTextAfter: '',
        verifyAskBefore: pwiI18n.label( pwiAccounts.strings, 'verify_ask', 'textBefore' ),
        verifyAskAfter: '',
        signinLink: true,
        signupLink: true,
        resetLink: true,
        signupAutoConnect: true,
        name: ''
    }
};

pwiAccounts.conf = {
    ...pwiAccounts.conf,
    ...defaults
};
