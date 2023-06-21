/*
 * pwix:accounts/src/client/classes/ac_companion.class.js
 *
 * A companion class for the 'acUserLogin' Blaze template.
 * 
 * This acCompanion class holds the configuration options of the template,
 *  acts as the requester for all displayed templates, and take care
 *  of adressing the acUserLogin Blaze template as the event handler.
 */

import _ from 'lodash';

import { Random } from 'meteor/random';

import { acCompanionDom } from './ac_companion_dom.class.js';
import { acCompanionOptions } from './ac_companion_options.class.js';

export class acCompanion {

    // static data
    //

    // keep here a list of all instanciated named objects
    static NamedInstances = {};

    // static methods
    //

    /**
     * @param {String} name the searched name
     * @returns {acCompanion} the corresponding acCompanion instance, or null
     */
    static byName( name ){
        return acCompanion.NamedInstances[name] || null;
    }

    // private data
    //

    // the acUserLogin template instance
    _instance = null;

    // a random unique identifier alolcated by this acCompanion for this instance
    _id = null;

    // the DOM companion class
    _dom = null;

    // the configuration options passed by the application to the acUserLogin Blaze template
    _options = null;

    _default_options( opts ){
        let o = {};
        return _.merge( o, defaults.acUserLogin, opts );
    }

    // the events target
    _target = null;

    // private methods
    //

    /*
     * @returns {Boolean} whether we have successfully managed the event
     */
    _handleSubmitEvent( event, data ){
        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_SUBMIT ){
            console.log( 'pwix:accounts acCompanion handling', event.type, data );
        }
        let mail = null;
        let password = null;
        let managed = false;
        const panel = pwixAccounts.DisplayManager.panel();
        switch( panel ){
            case AC_PANEL_CHANGEPWD:
                const pwd1 = $( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = $( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                pwixAccounts.User.changePwd( pwd1, pwd2, this.target());
                managed = true;
                break;
            case AC_PANEL_RESETASK:
                //console.log( 'element', $( '.ac-reset-ask' ));
                mail = $( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                pwixAccounts.User.resetAsk( mail, this.target());
                managed = true;
                break;
            case AC_PANEL_SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = $( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = $( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                pwixAccounts.User.loginWithPassword( mail, password, this.target());
                managed = true;
                break;
            case AC_PANEL_SIGNOUT:
                pwixAccounts.User.logout();
                managed = true;
                break;
            case AC_PANEL_SIGNUP:
                let options = {};
                if( pwixAccounts.opts().haveUsername() !== AC_FIELD_NONE ){
                    options.username = $( '.ac-signup .ac-input-username .ac-input' ).val().trim();
                }
                if( pwixAccounts.opts().haveEmailAddress() !== AC_FIELD_NONE ){
                    options.email = $( '.ac-signup .ac-input-email .ac-input' ).val().trim();
                }
                options.password = $( '.ac-signup .ac-newone .ac-input' ).val().trim();
                const autoClose = this.opts().signupAutoClose();
                //console.debug( 'found autoClose='+autoClose );
                const autoConnect = this.opts().signupAutoConnect();
                //console.debug( 'found autoConnect='+autoConnect );
                pwixAccounts.User.createUser( options, this.target(), autoClose, autoConnect );
                if( !autoClose ){
                    $( '.ac-signup' ).trigger( 'ac-clear' );
                }
                managed = true;
                break;
            case AC_PANEL_VERIFYASK:
                pwixAccounts.User.verifyMail( this.target());
                managed = true;
                break;
        }
        return !managed;
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {acUserLogin} instance the acUserLogin Blaze template instance
     * @param {Object} context optional template data context at runtime
     * @returns {acCompanion}
     */
    constructor( instance, context ){
        const self = this;

        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts instanciating acCompanion' );
        }

        // allocate a new random unique identifier for this instance
        self._id = Random.id();
        self._instance = instance;
        self._dom = new acCompanionDom( self );
        self._options = new acCompanionOptions( self, this._default_options( context ));

        // if the instance is named, then keep it to be usable later
        const name = self.opts().name();
        if( name ){
            acCompanion.NamedInstances[name] = self;
        }

        //console.debug( self );
        return this;
    }

    /**
     * @returns {acCompanionDom} the acCompanionDom which manages our DOM
     */
    dom(){
        return this._dom;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        switch( pwixAccounts.User.state()){
            case AC_LOGGED:
                return this.opts().loggedItemsAfter();
            case AC_UNLOGGED:
                return this.opts().unloggedItemsAfter();
        }
        return [];
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsBefore(){
        switch( pwixAccounts.User.state()){
            case AC_LOGGED:
                return this.opts().loggedItemsBefore();
            case AC_UNLOGGED:
                return this.opts().unloggedItemsBefore();
        }
        return [];
    }

    /**
     * @summary A generic event handler for acUserLogin
     *  This is called by acEventManager as an event forwarding
     *  If the provided data contains a requester, we can check that we are actually the right target
     *  If the provided data contains a panel, we have to ask for the display of this panel
     *  Else...
     * @param {String} event the event type
     * @param {Object} data the associated data
     * @returns {Boolean} whether we have successfully managed this event
     *  This returned value may be used by the caller to allow - or not - the event propagation...
     */
    handleEvent( event, data ){
        if( data && data.requester && ( !data.requester.id || ( data.requester.id() !== this.id()))){
            console.error( 'cowardly refusing to handle an event for someone else', data, this );
            return false;
        }
        switch( event.type ){
            // message sent by dropdown items (ac_menu_items)
            //  data is { requester, panel }
            case 'ac-panel-changepwd-event':
            case 'ac-panel-resetask-event':
            case 'ac-panel-signin-event':
            case 'ac-panel-signout-event':
            case 'ac-panel-signup-event':
            case 'ac-panel-verifyask-event':
                if( pwixAccounts.opts().verbosity() & AC_VERBOSE_PANEL ){
                    console.log( 'pwix:accounts acCompanion handling', event.type, data );
                }
                if( !data.panel ){
                    throw new Error( 'expecting a panel, not found' );
                }
                return pwixAccounts.DisplayManager.ask( data.panel, this );

            // message sent from ac_footer
            //  no data is expected
            case 'ac-submit':
                return this._handleSubmitEvent( event, data );
        }
    }

    /**
     * @returns {Boolean} whether this acUserLogin template should display a dropdown menu
     */
    hasDropdown(){
        const state = pwixAccounts.User.state();
        //console.debug( 'state', state );
        //console.debug( 'this.opts().loggedButtonAction()', this.opts().loggedButtonAction());
        //console.debug( 'this.opts().unloggedButtonAction()', this.opts().unloggedButtonAction());
        return ( state === AC_LOGGED && this.opts().loggedButtonAction() !== AC_ACT_HIDDEN )
            || ( state === AC_UNLOGGED && this.opts().unloggedButtonAction() !== AC_ACT_HIDDEN );
    }

    /**
     * @returns {String} The acCompanion unique identifier
     *  Also acts as the requester identifier
     */
    id(){
        return this._id;
    }

    /**
     * @returns {acUserLogin} the acUserLogin Blaze template
     */
    instance(){
        return this._instance;
    }

    /**
     * @returns {Boolean} whether the panels must be rendered as modals
     */
    modal(){
        return this.opts().renderMode() === 'AC_RENDER_MODAL';
    }

    /**
     * @returns {Object} the acCompanionOptions from the acUserLogin Blaze template instance
     */
    opts(){
        return this._options;
    }

    /**
     * Rationale: when options are passed through a template data context, then we must be able to reset them
     *  when they change - Hence, we cannot just pass them in the constructor, but must have a dedicated method
     * @param {Object} opts the template data context at runtime
     */
    setOptions( opts ){
        this._options.set( this._default_options( opts ));
    }

    /**
     * Getter/Setter
     * @summary Provides/set the events target.
     *  We are talking of our acUserLogin div, which may be the target of some events (notably for example error messages)
     * @returns {Object} the jQuery object which acts as the receiver of the event.
     */
    target( target ){
        if( target !== undefined ){
            this._target = target;
        }
        return this._target;
    }
}
