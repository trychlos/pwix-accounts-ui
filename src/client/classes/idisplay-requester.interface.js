/*
 * IDisplayRequester interface
 *
 *  The interface that each display requester should implement.
 */

export class IDisplayRequester {

    _instance = null;

    /**
     * Constructor
     * @param {*} instance the implementation instance
     * @returns {IDisplayRequester}
     */
    constructor( instance ){
        console.debug( 'IDisplayRequester instanciation' );
        this._instance = instance;
        return this;
    }

    /* *** ***************************************************************************************
       *** The implementation API, i.e; the functions the implementation may want to implement ***
       *** *************************************************************************************** */

    /**
     * Provides the events target.
     * @returns {Object} the jQuery object which acts as the receiver of the events.
     * [-implementation Api-]
     */
    v_target(){
        console.debug( 'IDisplayRequester.v_target()' );
        return null;
    }

    /* *** ***************************************************************************************
       *** The public API, i.e; the API anyone may call to access the interface service        ***
       *** *************************************************************************************** */

    /**
     * Provides the events target.
     * @returns {Object} the jQuery object which acts as the receiver of the event.
     * [-Public Api-]
     */
    target(){
        return this.v_target();
    }
}
