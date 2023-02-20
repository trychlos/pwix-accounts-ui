/*
 * acEventManager class
 *
 * The central point of event distribution, managed as a singleton.
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

export class acEventManager {

    // static data
    //
    static Singleton = null;

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
        'ac-user-verifieddone-event',
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
        if( !acEventManager.Events.includes( event )){
            throw new Error( 'unknown event', event );
        }
    }

    // private methods
    //

    /*
     * @summary Handle 'ac-panel' events
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Default is to redirect the event if possible.
     */
    _handlePanel( event, data ){
        switch( event.type ){
            // a dropdown item ask for a panel
            //  it must provide its IDisplayRequester instance
            case 'ac-panel-changepwd-event':
            case 'ac-panel-resetask-event':
            case 'ac-panel-signin-event':
            case 'ac-panel-signout-event':
            case 'ac-panel-signup-event':
            case 'ac-panel-verifyask-event':
                if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_HANDLE ){
                    console.log( 'pwix:accounts acEventManager handling', event.type, data );
                }
                const requester = data.requester;
                if( requester && requester.target ){
                    requester.target().trigger( event.type, data );
                } else {
                    throw new Error( 'no requester found', data );
                }
                return false;
        }
        return true;
    }

    /*
     * @summary Handle 'ac-user' events
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Close the modal when original event has been successfully handled.
     */
    _handleUser( event, data ){
        switch( event.type ){
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
                if( pwiAccounts.opts().verbosity() & AC_VERBOSE_USER_HANDLE ){
                    console.log( 'pwix:accounts acEventManager handling', event.type, data );
                }
                if( data.autoClose !== false ){
                    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
                        console.log( 'pwix:accounts acEventManager closing modal' );
                    }
                    pwixModal.close();
                }
        }
        return true;
    }

    /*
     * @summary Handle 'ac-submit' event
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Try to redirect to the requester.
     */
    _handleSubmit( event, data ){
        switch( event.type ){
            // if we have a ac-submit button which has triggered this ac-submit event, then we must have a current requester
            //  to which we redirect the event
            case 'ac-submit':
                if( pwiAccounts.opts().verbosity() & AC_VERBOSE_SUBMIT_HANDLE ){
                    console.log( 'pwix:accounts acEventManager handling', event.type, data );
                }
                const requester = pwiAccounts.DisplayManager.requester();
                let done = false;
                if( requester && requester.target ){
                    const target = requester.target();
                    if( target ){
                        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_SUBMIT_TRIGGER ){
                            console.log( 'pwix:accounts acEventManager triggering', event.type, 'to', target, 'with', data );
                        }
                        target.trigger( event.type, data );
                        done = true;
                    }
                }
                if( !done ){
                    throw new Error( 'no current requester' );
                }
                return false;
        }
        return true;
    }

    /*
     * @summary Handle modal events
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     */
    _handleModal( event, data ){
        switch( event.type ){
            case 'md-close':
                pwiAccounts.DisplayManager.handleModal( event, data );
                break;
        }
        return true;
    }

    /*
     * @summary Common event handler
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Default is to redirect the event if possible.
     */
    _handler( event, data ){
        return this._handlePanel( event, data ) && this._handleUser( event, data ) &&
                this._handleSubmit( event, data ) && this._handleUser( event, data ) && this._handleModal( event, data );
    }

    /**
     * Constructor
     * @returns {acEventManager}
     */
    constructor( instance ){

        if( acEventManager.Singleton ){
            if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
                console.log( 'pwix:accounts returning already instanciated acEventManager singleton' );
            }
            return acEventManager.Singleton;
        }

        const self = this;

        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts instanciating acEventManager' );
        }

        // install a general events handler
        acEventManager.Events.every(( name ) => {
            $( document ).on( name, self._handler.bind( self ));
            return true;
        });

        acEventManager.Singleton = this;
        return this;
    }

    /**
     * @summary Send an event
     * @param {String} event the name of the event, as known by acEvent.isKnown()
     * @param {Object} Parms additional arguments, if any, to be sent as a data object associated to the event
     */
    trigger( event, parms={} ){
        acEventManager.validate( event );
        $( 'body' ).trigger( event, parms );
    }
}
