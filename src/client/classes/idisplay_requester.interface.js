/*
 * IDisplayRequester interface
 *
 *  The interface that each display requester should implement.
 * 
 *  It materializes the fact that the display is unique, and so must be asked for.
 *  The IDIsplayManager will take care of only allowing the display if the display is free and a requester is identified.
 */

import { Random } from 'meteor/random';

export class IDisplayRequester {

    _instance = null;

    // a random unique identifier for this instance
    _id = null;

    /**
     * Constructor
     * @param {*} instance the implementation instance
     * @returns {IDisplayRequester}
     */
    constructor( instance ){
        console.debug( 'IDisplayRequester instanciation' );
        this._instance = instance;

        // allocate a new random unique identifier for this instance
        //  may be overriden by the implementation through the v_id() method
        this._id = Random.id();

        return this;
    }

    /* *** ***************************************************************************************
       *** The implementation API, i.e; the functions the implementation may want to implement ***
       *** *************************************************************************************** */

    /**
     * @returns {String} The IDisplayRequester unique identifier
     * [-implementation Api-]
     */
    v_id(){
        return this._id;
    }

    /**
     * @summary Provides the events target.
     * @returns {Object} the jQuery object which acts as the receiver of the events.
     *  Defaults is to send the messages to pwiAccounts.Displayer which implements the IEventManager interface.
     * [-implementation Api-]
     */
    v_target(){
        return null;
    }

    /* *** ***************************************************************************************
       *** The public API, i.e; the API anyone may call to access the interface service        ***
       *** *************************************************************************************** */

    /**
     * @summary ask for the display of a panel
     * @param {String} panel the panel to be displayed
     * @param {Object} parms the parms to be passed to the panel, may be undefined, null or empty
     * @returns {Boolean} whether the request has been accepter by the IDisplayManager
     * [-Public Api-]
     */
    ask( panel, parms={} ){
        return pwiAccounts.Displayer.IDisplayManager.ask( panel, this, parms );
    }

    /**
     * @returns {String} The IDisplayRequester unique identifier.
     * [-Public Api-]
     */
    id(){
        return this.v_id();
    }

    /**
     * @summary Provides the events target.
     * @returns {Object} the jQuery object which acts as the receiver of the event.
     * [-Public Api-]
     */
    target(){
        return this.v_target();
    }
}
