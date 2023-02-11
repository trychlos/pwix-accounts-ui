/*
 * IDisplayer interface
 *
 *  The public interface to the display service
 *  aka the public interface of the acDisplayer singleton
 * 
 * Rationale
 * 
 *  This interface let the display of the different dialogs in the user interface be managed.
 *  Because this display is a unique resource, the implementation class should be managed as a singleton.
 * 
 *  Not only the acUserLogin template instance, but also any other class or piece of code of the package may
 *  ask at any time to display a dialog to interact with the user.
 *  In order these dialogs do not overlap each other and lead to a poor user experience, this interface make sure
 *  that only one dialog is showed at any time, and who has requested it.
 */

export class IDisplayer {

    _instance = null;

    /**
     * Constructor
     * @param {*} instance the implementation instance
     * @returns {IDisplayer}
     */
    constructor( instance ){
        console.debug( 'IDisplayer instanciation' );
        this._instance = instance;
        return this;
    }

    /* *** ***************************************************************************************
       *** The implementation API, i.e; the functions the implementation may want to implement ***
       *** *************************************************************************************** */

    /* *** ***************************************************************************************
       *** The public API, i.e; the API anyone may call to access the interface service        ***
       *** *************************************************************************************** */
}
