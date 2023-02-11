/*
 * /src/client/classes/ac_displayer.class.js
 *
 * This class implements the IDisplayer interface.
 * Because this display is a unique resource, the class is managed as a singleton which is maintained by the pwiAccounts
 * global object.
 */

import { IDisplayer } from './idisplayer.interface.js';
import { Interface } from './interface.class';
import { acEvent } from './ac_event.class.js';

export class acDisplayer {

    // static data
    //

    static Singleton = null;

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
     * The object is instanciated at top level of package initialization, i.e. before ready().
     * @returns {acDisplayer}
     */
    constructor(){
        if( acDisplayer.Singleton ){
            console.log( 'pwix:accounts returning already instanciated acDisplayer' );
            return acDisplayer.Singleton;
        }
        //console.log( 'pwix:accounts instanciating new acDisplayer' );

        Interface.add( this, IDisplayer, {
        });

        acEvent.enumerate(( name ) => {
            document.addEventListener( name, this.v_handler );
        });

        acDisplayer.Singleton = this;
        return this;
    }
}
