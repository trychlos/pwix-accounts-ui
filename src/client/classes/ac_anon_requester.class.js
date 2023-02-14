/*
 * /src/client/classes/ac_anon_requester.class.js
 *
 * A companion class which implements the IDisplayRequester interface.
 * 
 * A unique instance of this class is allocated and managed by pwiAccounts global.
 * It targets the cases where we do not have any acUserLogin Blaze template instance.
 */

import { IDisplayRequester } from './idisplay_requester.interface.js';
import { Interface } from './interface.class';

export class acAnonRequester {

    // static data
    //

    // static methods
    //

    // private data
    //

    // private methods
    //

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
        console.log( 'pwix:accounts instanciating acAnonRequester' );

        Interface.add( this, IDisplayRequester, {
        });

        return this;
    }
}
