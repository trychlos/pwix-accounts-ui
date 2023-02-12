/*
 * /src/client/classes/ac_anon_requester.class.js
 *
 * A companion class which implements the IDisplayRequester interface.
 * 
 * A unique instance of this class is allocated and managed by pwiAccounts global.
 * It targets the cases where we do not have any acUserLogin Blaze template instance.
 */

import { Random } from 'meteor/random';

import { IDisplayRequester } from './idisplay_requester.interface.js';
import { Interface } from './interface.class';

export class acAnonRequester {

    // static data
    //

    // static methods
    //

    // private data
    //

    // a unique identifier for this instance
    _id = null;

    // private methods
    //

    /*
     * @returns {String} A unique identifier
     * [-IDisplayRequester implementation-]
     */
    _idisplayrequesterId(){
        return this._id;
    }

    /*
     * @returns {Object} the jQuery object which will receive the events
     * [-IDisplayRequester implementation-]
     */
    _idisplayrequesterTarget(){
        console.debug( 'acAnonRequester._idisplayrequesterTarget()' );
        return $( 'body' );
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @returns {acAnonRequester}
     * @throws {Error}
     */
    constructor(){
        const self = this;
        console.log( 'pwix:accounts instanciating acAnonRequester', instance );

        self._id = Random.id();

        Interface.add( this, IDisplayRequester, {
            v_id: this._idisplayrequesterId,
            v_target: this._idisplayrequesterTarget
        });

        return this;
    }
}
