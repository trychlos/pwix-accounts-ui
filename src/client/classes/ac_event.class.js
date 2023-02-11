/*
 * /src/client/classes/ac_event.class.js
 */

export class acEvent {

    // static data
    //

    // the known events
    static Events = [
        // displayed panels
        'ac-panel-changepwd-event',
        'ac-panel-resetask-event',
        'ac-panel-resetpwd-event',
        'ac-panel-signin-event',
        'ac-panel-signout-event',
        'ac-panel-signup-event',
        'ac-panel-verifyask-event',
        // user status changes
        'ac-user-changedpwd-event',
        'ac-user-created-event',
        'ac-user-signedin-event',
        'ac-user-signedout-event',
        'ac-user-resetasked-event',
        'ac-user-resetdone-event',
        'ac-user-verifyasked-event',
        'ac-user-verified-event',
        // when the modal is about to close
        'md-modal-close'
    ];

    // static methods
    //

    /**
     * Enumerate the events by name
     */
    static enumerate( cb ){
        acEvent.Events.every(( event ) => {
            cb( event );
            return true;
        });
    }

    /**
     * Validate that the provided event is a valid one, i.e. a known, non-empty, string.
     * @throws {Error}
     */
    static validate( event ){
        if( !event ){
            throw new Error( 'empty event name' );
        }
        if( !acEvent.Events.includes( event )){
            throw new Error( 'unknown event', event );
        }
    }

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
     * @returns {acEvent}
     */
    constructor(){
        return this;
    }
}
