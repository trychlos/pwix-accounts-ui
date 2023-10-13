/*
 * acManager class
 *
 * A singleton class which manages the AccountsUI as a whole and gathers all declared acUserLogin instances.
 */

import _ from 'lodash';

export class acManager {

    // static data
    //
    static Singleton = null;

    // static methods
    //

    // private data
    //

    // keep here a list of all instanciated named objects
    _named = {};

    // private methods
    //

    /**
     * Constructor
     * @returns {acManager}
     */
    constructor(){
        const self = this;

        if( acManager.Singleton ){
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
                console.log( 'pwix:accounts-ui returning already instanciated acManager singleton' );
            }
            return acManager.Singleton;
        }

        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acManager' );
        }

        acManager.Singleton = this;
        return this;
    }

    /**
     * @param {String} name the searched name
     * @returns {TemplateInstance} the corresponding acUserLogin instance, or null
     */
    byName( name ){
        return this._named[name] || null;
    }

    /**
     * @summary Name an instance
     * @param {String} name the name to be attributed
     * @param {TemplateInstance} instance the acUserLogin instance
     */
    name( name, instance ){
        this._named[name] = instance;
    }

    /**
     * @summary Remove a named instance
     * @param {String} name the name to be attributed
     */
    remove( name ){
        if( name ){
            delete this._named[name];
        }
    }
}
