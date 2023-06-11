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
        'md-close'
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
     * @summary Handle modal events
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Here, let the event bubble up
     */
    _handleModal( event, data ){
        switch( event.type ){
            case 'md-close':
                pwixAccounts.DisplayManager.handleModal( event, data );
                break;
        }
        return true;
    }

    /*
     * @summary Handle 'ac-panel' events
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Here, let the event bubble up
     */
    _handlePanel( event, data ){
        switch( event.type ){
            // a dropdown item asks for a panel
            //  as these events are triggered from standard dropdown items, they should convey an acCompanion
            case 'ac-panel-changepwd-event':
            case 'ac-panel-resetask-event':
            case 'ac-panel-signin-event':
            case 'ac-panel-signout-event':
            case 'ac-panel-signup-event':
            case 'ac-panel-verifyask-event':
                if( pwixAccounts.opts().verbosity() & AC_VERBOSE_PANEL ){
                    console.log( 'pwix:accounts acEventManager handling', event.type, data );
                }
                const requester = data.requester;
                if( requester && requester.handleEvent ){
                    if( pwixAccounts.opts().verbosity() & AC_VERBOSE_PANEL ){
                        console.log( 'pwix:accounts acEventManager forwarding to requester' );
                    }
                    requester.handleEvent( event, data );
                } else {
                    throw new Error( 'exepcted acCompanion, found', requester );
                }
        }
        return true;
    }

    /*
     * @summary Handle 'ac-submit' event
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Here, let the event bubble up.
     */
    _handleSubmit( event, data ){
        switch( event.type ){
            // if we have a ac-submit button which has triggered this ac-submit event,
            //  then we must have a current requester capable of handling this event
            //  no data is expected
            case 'ac-submit':
                if( pwixAccounts.opts().verbosity() & AC_VERBOSE_SUBMIT_HANDLE ){
                    console.log( 'pwix:accounts acEventManager handling', event.type, data );
                }
                //console.debug( pwixAccounts.DisplayManager );
                const requester = pwixAccounts.DisplayManager.requester();
                if( requester && requester.handleEvent ){
                    requester.handleEvent( event, data );
                } else {
                    console.error( 'no capable requester' );
                }
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
                if( pwixAccounts.opts().verbosity() & AC_VERBOSE_USER_HANDLE ){
                    console.log( 'pwix:accounts acEventManager handling', event.type, data );
                }
                if( data.autoClose !== false && pwixModal.count()){
                    if( pwixAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
                        console.log( 'pwix:accounts acEventManager closing modal' );
                    }
                    pwixModal.close();
                }
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
                this._handleSubmit( event, data ) && this._handleModal( event, data );
    }

    /**
     * Constructor
     * @returns {acEventManager}
     */
    constructor( instance ){

        if( acEventManager.Singleton ){
            if( pwixAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
                console.log( 'pwix:accounts returning already instanciated acEventManager singleton' );
            }
            return acEventManager.Singleton;
        }

        const self = this;

        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
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
     * @param {String} event the name of the event, as known by acEvent
     * @param {Object} Parms additional arguments, if any, to be sent as a data object associated to the event
     */
    trigger( event, parms={} ){
        acEventManager.validate( event );
        $( 'body' ).trigger( event, parms );
    }
}
