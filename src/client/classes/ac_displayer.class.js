/*
 * /src/client/classes/ac_displayer.class.js
 *
 * This class implements the IDisplayer interface.
 * Because this display is a unique resource, the class is managed as a singleton which is maintained by the pwiAccounts
 * global object.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { IDisplayer } from './idisplayer.interface.js';
import { Interface } from './interface.class';

export class acDisplayer {

    // static data
    //

    static Singleton = null;

    // static methods
    //

    // private data
    //

    _errorMsg = new ReactiveVar( '' );

    // private methods
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * The object is instanciated at top level of package initialization, i.e. before ready().
     * @returns {acDisplayer}
     */
    constructor(){
        if( acDisplayer.Singleton ){
            console.log( 'pwix:accounts returning already instanciated acDisplayer' );
            return acDisplayer.Singleton;
        }
        console.log( 'pwix:accounts instanciating new acDisplayer' );

        Interface.add( this, IDisplayer, {
        });

        acDisplayer.Singleton = this;
        return this;
    }

    /**
     * Getter/Setter
     * Panels have their own error messages (e.g. password too short or too weak).
     * This method is provided to host error messages returned from the server (e.g. bad credentials).
     * @param {String} msg error msg
     * @returns {String} the current error message
     */
    errorMsg( msg=null ){
        if( msg !== null ){
            this._errorMsg.set( msg );
        }
        return this._errorMsg.get();
    }
}
