/*
 * pwix:accounts/src/client/classes/ac_user_login_companion.class.js
 *
 * A companion class for the 'acUserLogin' Blaze template.
 * Implements the IDisplayRequester interface.
 */

import { Random } from 'meteor/random';

import { IDisplayRequester } from './idisplay_requester.interface.js';
import { Interface } from './interface.class';
import { acPanel } from './ac_panel.class.js';

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
        return acUserLoginCompanion.NamedInstances.name || null;
    }

    // private data
    //

    // a unique identifier for this instance
    _id = null;

    // the acUserLogin template instance and its jQuery selector
    _instance = null;
    _jqSelector = null;

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    // private methods
    //

    /*
     * @returns {String} A unique identifier
     * [-IDisplayRequester implementation-]
     */
    _idisplayrequesterId(){
        return this.id();
    }

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
        console.log( 'pwix:accounts instanciating acUserLoginCompanion', instance );

        self._id = Random.id();
        self._instance = instance;
        self._jqSelector = '.acUserLogin#'+self._id;

        // if the instance is named, then keep it to be usable later
        const name = self._instance.AC.options.name();
        if( name ){
            acUserLoginCompanion.NamedInstances.name = self;
        }

        Interface.add( this, IDisplayRequester, {
            v_id: this._idisplayrequesterId,
            v_target: this._idisplayrequesterTarget
        });

        return this;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        switch( pwiAccounts.User.state()){
            case AC_LOGGED:
                return this._instance.AC.options.loggedItemsAfter();
            case AC_UNLOGGED:
                return this._instance.AC.options.unloggedItemsAfter();
        }
        return [];
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsBefore(){
        switch( pwiAccounts.User.state()){
            case AC_LOGGED:
                return this._instance.AC.options.loggedItemsBefore();
            case AC_UNLOGGED:
                return this._instance.AC.options.unloggedItemsBefore();
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
        if( data.requester && data.requester.IDisplayRequester && data.requester.IDisplayRequester instanceof IDisplayRequester ){
            if( data.requester.IDisplayRequester.id() !== this.id()){
                console.log( 'cowardly refusing to handle an event for someone else', data, this );
                return false;
            }
        }
        if( data.panel ){
            acPanel.validate( data.panel );
            return pwiAccounts.Displayer.IDisplayManager.ask( this, data.panel, data );
        }
        return false;
    }

    /**
     * @returns {String} the unique identifier of this instance
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
            console.log( 'DOM ready', ready );
            this._ready.set( ready );
        }
        return this._ready.get();
    }
}
