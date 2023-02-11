/*
 * /src/client/classes/ac_requester.class.js
 *
 * A companion class which implements the IDisplayRequester interface.
 */

import { IDisplayRequester } from './idisplay-requester.interface.js';
import { Interface } from './interface.class';

export class acRequester {

    // static data

    // private data

    // private functions

    /*
     * @returns {Object} the jQuery object which will receive the events
     * [-IDisplayRequester implementation-]
     */
    _idisplayrequesterTarget(){
        console.debug( 'acRequester._idisplayrequesterTarget()' );
        return null;
    }

    // public data

    /**
     * Constructor
     * @returns {acRequester}
     */
    constructor(){

        Interface.add( this, IDisplayRequester, {
            v_target: this._idisplayrequesterTarget
        });

        return this;
    }
}
