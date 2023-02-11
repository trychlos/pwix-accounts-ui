/*
 * /src/client/classes/ac_displayerer.class.js
 *
 * This class implements the IDisplayer interface.
 * Because this display is a unique resource, the class is managed as a singleton which is maintained by the pwiAccounts
 * global object.
 */

import { IDisplayer } from './idisplayer.interface.js';
import { Interface } from './interface.class';

export class acDisplayer {

    // static data
    static Singleton = null;

    // private data
    _requester = null;
    _panel = null;

    // private functions

    // public data

    /**
     * Constructor
     * @returns {acDisplayer}
     */
    constructor(  ){
        if( acDisplayer.Singleton ){
            console.log( 'pwix:accounts returning already instanciated acDisplayer' );
            return acDisplayer.Singleton;
        }
        //console.log( 'pwix:accounts instanciating new acDisplayer' );

        Interface.add( this, IDisplayer, {
        });

        acDisplayer.Singleton = this;
        return this;
    }

    /**
     * @summary register a new requester
     *  The requesters register themselves as future requesters against the acDisplayer singleton.
     *  Later, they will use the returned identifier to identify themselves.
     * @returns {String} the requester newly allocated identifier
     */
    /*
    register(){
        const id = Random.id();
        acDisplayer.Requesters.push( id );
        return id;
    }
    */

    /**
     * @summary Ask for the display of the specified panel
     * @param {IRequester} requester an IRequester instance
     * @param {String} panel the panel to be displayed
     * @param {Object} opts options to be passed to the panel
     * @returns {Boolean} whether the acDisplayer singleton is able to satisfy the request
     *  i.e. whether the display is free before the request and can be reserved for it
     */
    ask( requester, panel, opts ){
        if( !( requester && requester instanceof IDisplayer )){
            throw new Error( 'not a IRequester instance', requester );
        }
    }
}
