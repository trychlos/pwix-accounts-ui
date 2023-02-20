/*
 * pwix:accounts/src/client/classes/ac_user_login_companion.class.js
 *
 * A companion class for the 'acUserLogin' Blaze template.
 * 
 * This acUserLoginCompanion class acts as the requester for all displayed templates, and take care
 * of adressing the acUserLogin Blaze template as the event handler.
 */

import { Random } from 'meteor/random';

export class acUserLoginCompanion {

    // static data
    //

    // keep here a list of all instanciated named objects
    static NamedInstances = {};

    // static methods
    //

    /**
     * @param {String} name the searched name
     * @returns {acUserLoginCompanion} the corresponding acUserLoginCompanion instance, or null
     */
    static byName( name ){
        return acUserLoginCompanion.NamedInstances[name] || null;
    }

    // private data
    //

    // a random unique identifier for this instance
    _id = null;

    // the acUserLogin template instance and its jQuery selector
    _instance = null;
    _jqSelector = null;

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    // the events target
    _target = null;

    // private methods
    //

    /*
     * @returns {Object} the jQuery object which will receive the events
     * [-IDisplayRequester implementation-]
     */
    _idisplayrequesterTarget(){
        //console.debug( 'acUserLoginCompanion._idisplayrequesterTarget()' );
        return this.ready() ? this._instance.$( this.jqSelector()) : null;
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {acUserLogin} instance the acUserLogin Blaze template instance
     * @returns {acUserLoginCompanion}
     */
    constructor( instance ){
        const self = this;

        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts instanciating acUserLoginCompanion' );
        }

        // allocate a new random unique identifier for this instance
        //  may be overriden by the implementation through the v_id() method
        self._id = Random.id();

        self._instance = instance;
        self._jqSelector = '.acUserLogin#'+self.id();

        // if the instance is named, then keep it to be usable later
        const name = self.opts().name();
        if( name ){
            acUserLoginCompanion.NamedInstances.name = self;
        }

        return this;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        switch( pwiAccounts.User.state()){
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
        switch( pwiAccounts.User.state()){
            case AC_LOGGED:
                return this.opts().loggedItemsBefore();
            case AC_UNLOGGED:
                return this.opts().unloggedItemsBefore();
        }
        return [];
    }

    /**
     * @summary A generic event handler for acUserLogin
     *  If the provided data contains a requester, we can check that we are actually the right target
     *  If the provided data contains a panel, we have to ask for the display of this panel
     *  Else...
     * @param {String} event the event type
     * @param {Object} data the associated data
     * @returns {Boolean} whether we have successfully managed this event
     *  This returned value may be used by the caller to allow - or not - the default event handling...
     */
    handleEvent( event, data ){
        if( data.requester && data.requester instanceof IDisplayRequester ){
            if( data.requester.id() !== this.IDisplayRequester.id()){
                console.log( 'cowardly refusing to handle an event for someone else', data, this );
                return false;
            }
        }
        if( !data.panel ){
            throw new Error( 'expecting a panel, not found' );
        }
        return data.requester.ask( data.panel,{ ...data, companion: this });
    }

    /**
     * @returns {Boolean} whether this acUserLogin template should display a dropdown menu
     */
    hasDropdown(){
        const state = pwiAccounts.User.state();
        return ( state === AC_LOGGED && this.opts().loggedButtonAction() !== AC_ACT_HIDDEN )
            || ( state === AC_UNLOGGED && this.opts().unloggedButtonAction() !== AC_ACT_HIDDEN );
    }

    /**
     * @returns {String} The acUserLoginCompanion unique identifier
     *  Also acts as the requester identifier
     */
    id(){
        return this._id;
    }

    /**
     * @returns {Object} the jQuery selector for this instance
     */
    jqSelector(){
        return this._jqSelector;
    }

    /**
     * @returns {Boolean} whether the panels must be rendered as modals
     */
    modal(){
        return this.opts().renderMode() === 'AC_RENDER_MODAL';
    }

    /**
     * @returns {Object} the acUserLoginOptions from the acUserLogin Blaze template instance
     */
    opts(){
        return this._instance.AC.options;
    }

    /**
     * Getter/Setter
     * @param {Boolean} ready whether the DOM is ready
     * @returns {Boolean}
     */
    ready( ready ){
        if( ready === true || ready === false ){
            if( pwiAccounts.opts().verbosity() & AC_VERBOSE_READY ){
                console.log( 'pwix:accounts acUserLoginCompanion DOM ready', ready );
            }
            this._ready.set( ready );
        }
        return this._ready.get();
    }

    /**
     * Getter/Setter
     * @summary Provides/set the events target.
     * @returns {Object} the jQuery object which acts as the receiver of the event.
     */
    target( target ){
        if( target !== undefined ){
            this._target = target;
        }
        return this._target;
    }
}
