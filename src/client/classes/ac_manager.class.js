/*
 * acManager class
 *
 * A singleton class which manages the AccountsUI as a whole and gathers all declared acUserLogin instances.
 */

import _ from 'lodash';

import { Random } from 'meteor/random';

import { acCompanion } from './ac_companion.class.js';
import { acCompanionOptions } from './ac_companion_options.class.js';
import { acComponent } from './ac_component.class.js';

export class acManager {

    // static data
    //
    static Singleton = null;

    // static methods
    //

    // private data
    //

    // the list of acUserLogin components indexed by their internal id
    _components = {};

    // private methods
    //

    /**
     * Constructor
     * @returns {acManager}
     */
    constructor(){
        const self = this;

        if( acManager.Singleton ){
            if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
                console.log( 'pwix:accounts-ui returning already instanciated acManager singleton' );
            }
            return acManager.Singleton;
        }

        if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acManager' );
        }

        acManager.Singleton = this;
        return this;
    }

    /**
     * @param {String} id the internal identifier attributed by this acManager
     * @returns {Object} the corresponding component
     */
    component( id ){
        return this._components[id];
    }

    /**
     * @summary Declare a new instance of a component
     *  to be called from onCreated()
     * @param {Object} instance the Blaze.TemplateInstance object
     * @returns {String} the internal identifier attributed by this acManager
     */
    componentDefine( instance ){
        const id = Random.id();
        let component = new acComponent( id, instance );
        _.merge( component, {
            className(){ return this.className(); },
            id(){ return id; }
        });
        this._components[id] = component;
        return id;
    }

    /**
     * @summary Remove an instance from acUserLogin components hash
     *  to be called from onDestroyed()
     * @param {String} id the internal identifier attributed by this acManager
     */
    componentRemove( id ){
        delete this._components[id];
    }

    /**
     * @summary Declare a new instance of a acUserLogin component
     *  to be called from onCreated()
     * @param {Object} instance the Blaze.TemplateInstance object
     * @returns {String} the internal identifier attributed by this acManager
     */
    userloginDefine( instance ){
        const id = this.componentDefine( instance );
        let component = this.component( id );
        _.merge( component, {
            companion: new acCompanion( id ),
            options: new acCompanionOptions( id ),
            modal(){ return this.opts().renderMode() === 'AC_RENDER_MODAL'; },
            opts(){ return this.options; }
        });
        return id;
    }
}
