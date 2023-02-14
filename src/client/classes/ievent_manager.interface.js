/*
 * IEventManager interface
 *
 *  The central point of event distribution.
 * 
 * Note about the event system
 * 
 *  We get tied here to jQuery event system, to keep compatibility with other packages.
 *  But we could also have used:
 *      document.body.dispatchEvent( new CustomEvent( event, { bubbles: true, detail: parms }));
 *  and then
 *      document.addEventListener( name, this.v_handler );
 *  with the inconvenience that addEventListener doesn't work with jQuery events :(
 */

import { IDisplayRequester } from './idisplay_requester.interface.js';

export class IEventManager {

    // static data
    //

    // the known events
    static Events = [
        // a request to display a panel
        'ac-panel-changepwd-event',
        'ac-panel-resetask-event',
        'ac-panel-resetpwd-event',
        'ac-panel-signin-event',
        'ac-panel-signout-event',
        'ac-panel-signup-event',
        'ac-panel-verifyask-event',
        // a change has been done on user data
        'ac-user-changedpwd-event',
        'ac-user-created-event',
        'ac-user-signedin-event',
        'ac-user-signedout-event',
        'ac-user-resetasked-event',
        'ac-user-resetdone-event',
        'ac-user-verifyasked-event',
        'ac-user-verified-event',
        // when submitting a modal not attached to any Blaze template event handler
        'ac-submit',
        // when the modal is about to close
        'md-modal-close'
    ];

    // static methods
    //

    /**
     * @summary Validate an event name
     * @param {String} event the event to be validated
     * @throws {Error}
     */
    static validate( event ){
        if( !event ){
            throw new Error( 'empty event name' );
        }
        if( !IEventManager.Events.includes( event )){
            throw new Error( 'unknon event', event );
        }
    }

    // the implementation instance
    _instance = null;

    /**
     * Constructor
     * @param {*} instance the implementation instance
     * @returns {IEventManager}
     */
    constructor( instance ){
        console.debug( 'IEventManager instanciation' );
        this._instance = instance;
        const self = this;

        // install a general events handler
        IEventManager.Events.every(( name ) => {
            $( document ).on( name, self.v_handler.bind( self ));
            return true;
        });

        return this;
    }

    /* *** ***************************************************************************************
       *** The implementation API, i.e; the functions the implementation may want to implement ***
       *** *************************************************************************************** */

    /**
     * @summary Common event handler
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} 
     *  Default is to redirect the event if possible.
     * [-implementation Api-]
     */
    v_handler( event, data ){
        console.debug( 'IEventManager.v_handler()', event, data );
        let requester;
        let target;
        // some messages can be directly handled here
        switch( event.type ){
            // a dropdown item ask for a panel
            //  it must provide its IDisplayRequester instance
            case 'ac-panel-changepwd-event':
            case 'ac-panel-resetask-event':
            case 'ac-panel-signin-event':
            case 'ac-panel-signout-event':
            case 'ac-panel-signup-event':
            case 'ac-panel-verifyask-event':
                requester = data.requester;
                if( requester && requester instanceof IDisplayRequester ){
                    requester.target().trigger( event.type, data );
                } else {
                    throw new Error( 'no IDisplayRequester found', data );
                }
                return false;

            // an action has been done, and the application is informed
            //  let bubble the event, making sure we do not left an opened modal dialog
            case 'ac-user-changedpwd-event':
            case 'ac-user-created-event':
            case 'ac-user-signedin-event':
            case 'ac-user-signedout-event':
            case 'ac-user-resetasked-event':
            case 'ac-user-resetdone-event':
            case 'ac-user-verifyasked-event':
            case 'ac-user-verifieddone-event':
                //console.log( event, data );
                pwixModal.close();
                return true;

            // if we have a ac-submit button which has triggered this ac-submit event, then we must have a current requester
            //  to which we redirect the event
            case 'ac-submit':
                requester = pwiAccounts.Displayer.IDisplayManager.requester();
                if( requester && requester instanceof IDisplayRequester ){
                    target = requester.target();
                    if( target ){
                        target.trigger( event.type, data );
                    }
                } else {
                    throw new Error( 'no current IDisplayRequester' );
                }
                return false;

            case 'md-modal-close':
                pwiAccounts.Displayer.IDisplayManager.free();
                return false;
        }
    }

    /* *** ***************************************************************************************
       *** The public API, i.e; the API anyone may call to access the interface service        ***
       *** *************************************************************************************** */

    /**
     * @summary Send an event
     * @param {String} event the name of the event, as known by acEvent.isKnown()
     * @param {Object} Parms additional arguments, if any, to be sent as a data object associated to the event
     * [-Public API-]
     */
    trigger( event, parms={} ){
        IEventManager.validate( event );
        $( 'body' ).trigger( event, parms );
    }
}
