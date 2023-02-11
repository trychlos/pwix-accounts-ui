/*
 * /src/client/classes/ac_requester.class.js
 *
 * A companion class which implements the IDisplayRequester interface.
 */

import { IDisplayRequester } from './idisplay_requester.interface.js';
import { Interface } from './interface.class';

export class acRequester {

    // static data
    //

    // static methods
    //

    // private data
    //

    // the event target (should be the one which instanciates this companion class)
    _target = null;

    // private methods
    //

    /*
     * @returns {Object} the jQuery object which will receive the events
     * [-IDisplayRequester implementation-]
     */
    _idisplayrequesterTarget(){
        console.debug( 'acRequester._idisplayrequesterTarget()' );
        return this._target;
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {Object} target the jQuery object which wants receive the events
     * @returns {acRequester}
     * @throws {Error}
     */
    constructor( target ){
        if( !target ){
            throw new Error( 'invalid target' );
        }

        Interface.add( this, IDisplayRequester, {
            v_target: this._idisplayrequesterTarget
        });

        this._target = target;

        return this;
    }
}
