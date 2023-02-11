/*
 * /src/client/classes/ac_panel.class.js
 */

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
     * Validate that the provided panel is a valid one, i.e. a known, non-empty, string.
     * @throws {Error}
     */
    static validate( panel ){
        if( !panel ){
            throw new Error( 'empty panel name' );
        }
        if( !acPanel.Panels.includes( panel )){
            throw new Error( 'unknown panel', panel );
        }
    }

    // private data
    //

    // what is the current displayed template ?
    _panel = new ReactiveVar( null );
    _previous = new ReactiveVar( null );
    _view = new ReactiveVar( null );
    _requester = new ReactiveVar( null );

    // private methods
    //

    // public data
    //

    // public methods
    //

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

        //console.log( 'pwix:accounts instanciating new acPanel' );

        this.asked( panel );

        acPanel.Singleton = this;
        return this;
    }

    /**
     * Getter/Setter
     * @param {String} panel the requested panel
     * @param {String} uuid the uuid identifier of the requester acUserLogin object
     * @returns {String} the currently (maybe newly ?) requested panel
     */
    asked( panel, uuid ){
        if( panel ){
            const previous = this._panel.get();
            if( Object.keys( acPanel.Panels ).includes( panel ) && panel !== previous ){
                // manage reservations
                if( panel === AC_PANEL_NONE ){
                    this._requester.set( null );
                } else if( uuid ){
                    this._requester.set( uuid );
                } else {
                    console.errror( 'requester not identified' );
                }
                // trigger the transition
                console.log( 'pwix:accounts triggering transition from '+previous+' to '+panel+' (uuid='+uuid+')' );
                $( '.acUserLogin' ).trigger( 'ac-panel-transition', { previous: previous, next: panel, requester: uuid || null });
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
        return acPanel.Panels[name] ? acPanel.Panels[name].buttons || [] : [];
    }

    /**
     * @param {String} name the name of the panel
     * @returns {Array} the ordered list of links to be displayed for this panel
     * Note that whether these links will be actually displayed also depends of configuration options
     *  which are not managed here.
     */
    links( name ){
        return acPanel.Panels[name] ? acPanel.Panels[name].links || [] : [];
    }

    /**
     * @param {String} name the name of the panel
     * @returns {String} the localized title of the modal which implements the panel, or empty
     */
    modalTitle( name ){
        const o = acPanel.Panels[name] ? acPanel.Panels[name].modal_title || null : null;
        return o ? i18n.label( AC_I18N, o.i18n ) : '';
    }

    /**
     * @returns {String} the previous panel
     */
    previous(){
        return this._previous.get();
    }

    /**
     * @param {String} uuid the identifier of the willing-to acUserLogin template instance
     * @returns {Boolean} whether this instance is allowed to handle the request
     */
    requesterAllowed( uuid ){
        const requester = this._requester.get();
        return !requester || requester === uuid;
    }

    /**
     * @param {String} name the name of the panel
     * @returns {String} the Blaze template which implements the panel, or empty
     */
    template( name ){
        return acPanel.Panels[name] ? acPanel.Panels[name].template || '' : '';
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
