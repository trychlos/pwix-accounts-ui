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
        // when the modal is about to close
        'md-modal-close'
    ];

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
        IEventManager.Events(( name ) => {
            $( document ).on( name, this.v_handler.bind( self ));
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
     *  Default is to redirect the event if possible.
     * [-implementation Api-]
     */
    v_handler( event, data ){
        //console.debug( 'IEventManager.v_handler()', event, data );
        // some messages can be directly handled here
        switch( event.type ){
            case 'ac-submit':
                if( data.requester === null && this.requester === ANONYMOUS && this.panel() === AC_PANEL_RESETPWD ){
                    
                }
                break;
            case 'md-modal-close':
                this.free();
                return;
        }
        // if the event has a requester information, then redirect the former to the later
        const requester = data.requester || this._requester;
        //console.log( requester );
        if( requester && requester.IDisplayRequester && requester.IDisplayRequester instanceof IDisplayRequester ){
            //console.log( 'redirecting to', requester.IDisplayRequester.target());
            requester.IDisplayRequester.target().trigger( event.type, data );
        }
    }

    /* *** ***************************************************************************************
       *** The public API, i.e; the API anyone may call to access the interface service        ***
       *** *************************************************************************************** */

    /**
     * @summary Send an event
     * @param {String} event the name of the event, as known by acEvent.isKnown()
     *  Additional arguments, if any, are sent as a data object associated to the event
     *  So MUST be an object
     * [-Public API-]
     */
    /*
    trigger( event, parms={} ){
        acEvent.validate( event );
        //console.log( event, parms );
        $( 'body' ).trigger( event, parms );
    }
    */
}
