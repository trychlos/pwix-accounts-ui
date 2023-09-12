/*
 * pwix:accounts-ui/src/client/classes/ac_companion.class.js
 *
 * A companion class for the 'acUserLogin' component.
 * 
 * This acCompanion class holds the configuration options of the template,
 *  acts as the requester for all displayed templates, and take care
 *  of adressing the acUserLogin Blaze template as the event handler.
 */

import _ from 'lodash';

import { acCompanionDom } from './ac_companion_dom.class.js';
import { acCompanionOptions } from './ac_companion_options.class.js';

export class acCompanion {

    // static data
    //

    // static methods
    //

    // private data
    //

    // the identifier attributed by the manager
    _managerId = null;

    // private methods
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {String} managerId the identifier attributed by the acManager
     * @returns {acCompanion}
     */
    constructor( managerId ){
        const self = this;

        if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acCompanion' );
        }

        self._managerId = managerId;

        return this;
    }

    /****************************************************************************************************************************************************************
     * **************************************************************************************************************************************************************
     *****************************************************************************************************************************************************************/

    // keep here a list of all instanciated named objects
    static NamedInstances = {};

    /**
     * @param {acCompanion} companionA 
     * @param {acCompanion} companionB 
     * @returns {Boolean} true if companionA and companionB are the same
     */
    static areSame( companionA, companionB ){
        return companionA.id() === companionB.id();
    }

    /**
     * @param {String} name the searched name
     * @returns {acCompanion} the corresponding acCompanion instance, or null
     */
    static byName( name ){
        return acCompanion.NamedInstances[name] || null;
    }

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
        if( AccountsUI.opts().verbosity() & AC_VERBOSE_SUBMIT ){
            console.log( 'pwix:accounts-ui acCompanion handling', event.type, data );
        }
        let mail = null;
        let password = null;
        let managed = false;
        const panel = AccountsUI.DisplayManager.panel();
        switch( panel ){
            case AC_PANEL_CHANGEPWD:
                const pwd1 = $( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = $( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                AccountsUI.Account.changePwd( pwd1, pwd2, this.target());
                managed = true;
                break;
            case AC_PANEL_RESETASK:
                //console.log( 'element', $( '.ac-reset-ask' ));
                mail = $( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                AccountsUI.Account.resetAsk( mail, this.target());
                managed = true;
                break;
            case AC_PANEL_SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = $( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = $( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                AccountsUI.Account.loginWithPassword( mail, password, this.target());
                managed = true;
                break;
            case AC_PANEL_SIGNOUT:
                AccountsUI.Account.logout();
                managed = true;
                break;
            case AC_PANEL_SIGNUP:
                let options = {};
                if( AccountsUI.opts().haveUsername() !== AC_FIELD_NONE ){
                    options.username = $( '.ac-signup .ac-input-username .ac-input' ).val().trim();
                }
                if( AccountsUI.opts().haveEmailAddress() !== AC_FIELD_NONE ){
                    options.email = $( '.ac-signup .ac-input-email .ac-input' ).val().trim();
                }
                options.password = $( '.ac-signup .ac-newone .ac-input' ).val().trim();
                const autoClose = this.opts().signupAutoClose();
                //console.debug( 'found autoClose='+autoClose );
                const autoConnect = this.opts().signupAutoConnect();
                //console.debug( 'found autoConnect='+autoConnect );
                AccountsUI.Account.createUser( options, this.target(), autoClose, autoConnect );
                if( !autoClose ){
                    $( '.ac-signup' ).trigger( 'ac-clear' );
                }
                managed = true;
                break;
            case AC_PANEL_VERIFYASK:
                AccountsUI.Account.verifyMail( this.target());
                managed = true;
                break;
        }
        return !managed;
    }

    /*
    constructor( instance ){
        const self = this;

        if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acCompanion' );
        }

        // allocate a new random unique identifier for this instance
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
    */

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
        switch( AccountsUI.Connection.state()){
            case AC_LOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().loggedItemsAfter();
            case AC_UNLOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().unloggedItemsAfter();
        }
        return [];
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsBefore(){
        switch( AccountsUI.Connection.state()){
            case AC_LOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().loggedItemsBefore();
            case AC_UNLOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().unloggedItemsBefore();
        }
        return [];
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsCore(){
        let res = [];
        switch( AccountsUI.Connection.state()){
            case AC_LOGGED:
                res = AccountsUI.Manager.component( this._managerId ).opts().loggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[ AC_LOGGED ] );
                }
                break;
            case AC_UNLOGGED:
                res = AccountsUI.Manager.component( this._managerId ).opts().unloggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[ AC_UNLOGGED ] );
                }
                break;
        }
        return res;
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
                if( AccountsUI.opts().verbosity() & AC_VERBOSE_PANEL ){
                    console.log( 'pwix:accounts-ui acCompanion handling', event.type, data );
                }
                if( !data.panel ){
                    throw new Error( 'expecting a panel, not found' );
                }
                return AccountsUI.DisplayManager.ask( data.panel, this );

            // message sent from ac_footer
            //  no data is expected
            case 'ac-submit':
                return this._handleSubmitEvent( event, data );
        }
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
