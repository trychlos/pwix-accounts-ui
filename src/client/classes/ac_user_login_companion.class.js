/*
 * pwix:accounts/src/client/classes/ac_user_login_companion.class.js
 *
 * A companion class for the 'acUserLogin' Blaze template.
 * Implements the IDisplayRequester interface.
 */

import { Random } from 'meteor/random';

import { IDisplayRequester } from './idisplay-requester.interface.js';
import { Interface } from './interface.class';

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
     * @returns {Object} the jQuery object which will receive the events
     * [-IDisplayRequester implementation-]
     */
    _idisplayrequesterTarget(){
        console.debug( 'acUserLoginCompanion._idisplayrequesterTarget()' );
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
