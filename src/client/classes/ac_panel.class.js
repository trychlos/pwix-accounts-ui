/*
 * /src/client/classes/ac_panel.class.js
 *
 * This class manages the requested panel as a singleton, as all 'acUserLogin' instanciated templates share the same display request.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { pwiI18n } from 'meteor/pwi:i18n';

import '../../common/js/index.js';

export class acPanel {

    // private data
    static Singleton = null;

    // the known panels
    static Knowns = {
        AC_PANEL_NONE: {

        },
        AC_PANEL_CHANGEPWD: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'ok_label' }
            ],
            modal_title: { group: 'change_pwd', key: 'modal_title' },
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
            modal_title: { group: 'reset_ask', key: 'modal_title' },
            template: 'ac_reset_ask'
        },
        AC_PANEL_RESETPWD: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'ok_label' }
            ],
            modal_title: { group: 'reset_pwd', key: 'modal_title' },
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
            modal_title: { group: 'signin', key: 'modal_title' },
            template: 'ac_signin'
        },
        AC_PANEL_SIGNOUT: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'signout_label' }
            ],
            modal_title: { group: 'signout', key: 'modal_title' },
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
            modal_title: { group: 'signup', key: 'modal_title' },
            template: 'ac_signup'
        },
        AC_PANEL_VERIFYASK: {
            buttons: [
                { class: 'btn-secondary ac-cancel', key: 'cancel_label' },
                { class: 'btn-primary ac-submit',   key: 'send_label' }
            ],
            modal_title: { group: 'verify_ask', key: 'modal_title' },
            template: 'ac_verify_ask'
        }
    };

    // what is the current displayed template ?
    _panel = new ReactiveVar( null );
    _previous = new ReactiveVar( null );
    _view = new ReactiveVar( null );

    // private functions

    // public data

    /**
     * Constructor
     * @param {String} panel the panel to initialize with, defaulting to 'AC_PANEL_NONE'
     * @returns {acPanel}
     */
    constructor( panel=AC_PANEL_NONE ){
        if( acPanel.Singleton ){
            console.log( 'pwix:accounts returning already instanciated acPanel' );
            return acPanel.Singleton;
        }

        console.log( 'pwix:accounts instanciating new acPanel' );

        this.asked( panel );

        acPanel.Singleton = this;
        return this;
    }

    /**
     * Getter/Setter
     * @param {String} panel the requested panel
     * @returns {String} the currently (maybe newly ?) requested panel
     */
    asked( panel ){
        if( panel ){
            const previous = this._panel.get();
            if( Object.keys( acPanel.Knowns ).includes( panel ) && panel !== previous ){
                console.log( 'pwix:accounts triggering transition from '+previous+' to '+panel );
                $( '.acUserLogin' ).trigger( 'ac-panel-transition', { previous: previous, next: panel });
                this._panel.set( panel );
                this._previous.set( previous );
            }
        }
        return this._panel.get();
    }

    /**
     * @param {String} name the name of the panel
     * @returns {Array} the ordered list of buttons to be displayed for this panel
     */
    buttons( name ){
        return acPanel.Knowns[name] ? acPanel.Knowns[name].buttons || [] : [];
    }

    /**
     * @param {String} name the name of the panel
     * @returns {Array} the ordered list of links to be displayed for this panel
     * Note that whether these links will be actually displayed also depends of configuration options
     *  which are not managed here.
     */
    links( name ){
        return acPanel.Knowns[name] ? acPanel.Knowns[name].links || [] : [];
    }

    /**
     * @param {String} name the name of the panel
     * @returns {String} the localized title of the modal which implements the panel, or empty
     */
    modalTitle( name ){
        const o = acPanel.Knowns[name] ? acPanel.Knowns[name].modal_title || null : null;
        return o ? pwiI18n.label( pwiAccounts.strings, o.group, o.key ) : '';
    }

    /**
     * @returns {String} the previous panel
     */
    previous(){
        return this._previous.get();
    }

    /**
     * @param {String} name the name of the panel
     * @returns {String} the Blaze template which implements the panel, or empty
     */
    template( name ){
        return acPanel.Knowns[name] ? acPanel.Knowns[name].template || '' : '';
    }

    /**
     * Getter/Setter
     * @param {Object} view the just created view
     * @returns {Object} the current view
     */
    view( view ){
        //console.log( arguments );
        if( view || arguments.length === 1 ){
            this._view.set( view );
        }
        return this._view.get();
    }
}
