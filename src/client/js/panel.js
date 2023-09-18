/*
 * /src/client/js/panel.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

AccountsUI.Panel = {

    // the known panels
    Refs: {},

    /**
     * @param {String} name the name of the panel
     * @returns {Array} the ordered list of buttons to be displayed for this panel
     */
    buttons: function( name ){
        return AccountsUI.Panel.Refs[name] ? AccountsUI.Panel.Refs[name].buttons || [] : [];
    },

    /**
     * @param {String} name the name of the panel
     * @returns {Array} the ordered list of links to be displayed for this panel
     * Note that whether these links will be actually displayed also depends of configuration options
     *  which are not managed here.
     */
    links: function( name ){
        return AccountsUI.Panel.Refs[name] ? AccountsUI.Panel.Refs[name].links || [] : [];
    },

    /**
     * @param {String} name the name of the panel
     * @returns {String} the Blaze template which implements the panel, or empty
     */
    template: function( name ){
        return AccountsUI.Panel.Refs[name] ? AccountsUI.Panel.Refs[name].template || '' : '';
    },

    /**
     * @param {String} name the name of the panel
     * @returns {String} the localized title of the modal which implements the panel, or empty
     */
    title: function( name ){
        const o = AccountsUI.Panel.Refs[name] ? AccountsUI.Panel.Refs[name].modal_title || null : null;
        return o ? pwixI18n.label( I18N, o.i18n ) : '';
    },

    /**
     * Validate that the provided panel is a valid one, i.e. a known, non-empty, string.
     * @throws {Error}
     */
    validate: function( panel ){
        if( !panel ){
            throw new Error( 'empty panel name' );
        }
        //console.log( this ); // AccountsUI.Panel
        if( !Object.keys( AccountsUI.Panel.Refs ).includes( panel )){
            throw new Error( 'unknown panel', panel );
        }
    }
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.NONE] = {
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.CHANGEPWD] = {
    buttons: [
        { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
        { class: 'btn-primary ac-submit',   key: 'ok_label' }
    ],
    modal_title: { i18n: 'change_pwd.modal_title' },
    template: 'ac_change_pwd'
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.RESETASK] = {
    buttons: [
        { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
        { class: 'btn-primary ac-submit',   key: 'send_label' }
    ],
    links: [
        { key: 'signin_link', target: AccountsUI.C.Panel.SIGNIN, have: 'signinLink' },
        { key: 'signup_link', target: AccountsUI.C.Panel.SIGNUP, have: 'signupLink' }
    ],
    modal_title: { i18n: 'reset_ask.modal_title' },
    template: 'ac_reset_ask'
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.RESETPWD] = {
    buttons: [
        { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
        { class: 'btn-primary ac-submit',   key: 'ok_label' }
    ],
    modal_title: { i18n: 'reset_pwd.modal_title' },
    template: 'ac_reset_pwd'
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.SIGNIN] = {
    buttons: [
        { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
        { class: 'btn-primary ac-submit',   key: 'signin_label' }
    ],
    links: [
        { key: 'reset_link',  target: AccountsUI.C.Panel.RESETASK, have: 'resetLink' },
        { key: 'signup_link', target: AccountsUI.C.Panel.SIGNUP,   have: 'signupLink' }
    ],
    modal_title: { i18n: 'signin.modal_title' },
    template: 'ac_signin'
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.SIGNOUT] = {
    buttons: [
        { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
        { class: 'btn-primary ac-submit',   key: 'signout_label' }
    ],
    modal_title: { i18n: 'signout.modal_title' },
    template: 'ac_signout'
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.SIGNUP] = {
    buttons: [
        { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
        { class: 'btn-primary ac-submit',   key: 'signup_label' }
    ],
    links: [
        { key: 'reset_link',  target: AccountsUI.C.Panel.RESETASK, have: 'resetLink' },
        { key: 'signin_link', target: AccountsUI.C.Panel.SIGNIN, have: 'signinLink' }
    ],
    modal_title: { i18n: 'signup.modal_title' },
    template: 'ac_signup'
};

AccountsUI.Panel.Refs[AccountsUI.C.Panel.VERIFYASK] = {
    buttons: [
        { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
        { class: 'btn-primary ac-submit',   key: 'send_label' }
    ],
    modal_title: { i18n: 'verify_ask.modal_title' },
    template: 'ac_verify_ask'
};
