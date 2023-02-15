/*
 * /src/client/classes/ac_panel.class.js
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

export class acPanel {

    // static data
    //

    // the known panels
    static Panels = {
        AC_PANEL_NONE: {
        },
        AC_PANEL_CHANGEPWD: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'ok_label' }
            ],
            modal_title: { i18n: 'change_pwd.modal_title' },
            template: 'ac_change_pwd'
        },
        AC_PANEL_RESETASK: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'send_label' }
            ],
            links: [
                { key: 'signin_link', target: AC_PANEL_SIGNIN, have: 'signinLink' },
                { key: 'signup_link', target: AC_PANEL_SIGNUP, have: 'signupLink' }
            ],
            modal_title: { i18n: 'reset_ask.modal_title' },
            template: 'ac_reset_ask'
        },
        AC_PANEL_RESETPWD: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'ok_label' }
            ],
            modal_title: { i18n: 'reset_pwd.modal_title' },
            template: 'ac_reset_pwd'
        },
        AC_PANEL_SIGNIN: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'signin_label' }
            ],
            links: [
                { key: 'reset_link',  target: AC_PANEL_RESETASK, have: 'resetLink' },
                { key: 'signup_link', target: AC_PANEL_SIGNUP,   have: 'signupLink' }
            ],
            modal_title: { i18n: 'signin.modal_title' },
            template: 'ac_signin'
        },
        AC_PANEL_SIGNOUT: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'signout_label' }
            ],
            modal_title: { i18n: 'signout.modal_title' },
            template: 'ac_signout'
        },
        AC_PANEL_SIGNUP: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'signup_label' }
            ],
            links: [
                { key: 'signin_link', target: AC_PANEL_SIGNIN, have: 'signinLink' }
            ],
            modal_title: { i18n: 'signup.modal_title' },
            template: 'ac_signup'
        },
        AC_PANEL_VERIFYASK: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'send_label' }
            ],
            modal_title: { i18n: 'verify_ask.modal_title' },
            template: 'ac_verify_ask'
        }
    };

    // static methods
    //

    /**
     * @param {String} name the name of the panel
     * @returns {Array} the ordered list of buttons to be displayed for this panel
     */
    static buttons( name ){
        return acPanel.Panels[name] ? acPanel.Panels[name].buttons || [] : [];
    }

    /**
     * @param {String} name the name of the panel
     * @returns {Array} the ordered list of links to be displayed for this panel
     * Note that whether these links will be actually displayed also depends of configuration options
     *  which are not managed here.
     */
    static links( name ){
        return acPanel.Panels[name] ? acPanel.Panels[name].links || [] : [];
    }

    /**
     * @param {String} name the name of the panel
     * @returns {String} the Blaze template which implements the panel, or empty
     */
    static template( name ){
        return acPanel.Panels[name] ? acPanel.Panels[name].template || '' : '';
    }

    /**
     * @param {String} name the name of the panel
     * @returns {String} the localized title of the modal which implements the panel, or empty
     */
    static title( name ){
        const o = acPanel.Panels[name] ? acPanel.Panels[name].modal_title || null : null;
        return o ? i18n.label( AC_I18N, o.i18n ) : '';
    }

    /**
     * Validate that the provided panel is a valid one, i.e. a known, non-empty, string.
     * @throws {Error}
     */
    static validate( panel ){
        if( !panel ){
            throw new Error( 'empty panel name' );
        }
        if( !Object.keys( acPanel.Panels ).includes( panel )){
            throw new Error( 'unknown panel', panel );
        }
    }

    // private data
    //

    // private methods
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @returns {acPanel}
     */
    constructor(){

        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts instanciating acPanel' );
        }

        return this;
    }
}
