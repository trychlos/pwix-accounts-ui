/*
 * pwix:accounts-ui/src/client/js/event.js
 *
 * A central event handler, attached to the body of the document.
 * 
 * Note about the event system:
 *  We get tied here to jQuery event system, to keep compatibility with other packages.
 *  But we could also have used:
 *      document.body.dispatchEvent( new CustomEvent( event, { bubbles: true, detail: parms }));
 *  and then
 *      document.addEventListener( name, this.v_handler );
 *  with the inconvenience that addEventListener doesn't work with jQuery events :(
 */

AccountsUI.Event = {

    // the known events
    Refs: [
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
        // when a modal is about to close
        'md-close'
    ],

    /*
     * @summary Handle modal events
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Here, always let the event bubble up
     */
    _handleModal( event, data ){
        switch( event.type ){
            case 'md-close':
                AccountsUI.Display.handleModal( event, data );
                break;
        }
        return true;
    },

    /*
     * @summary Handle 'ac-panel' events
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     *  coming from ac_menu_items, expects:
     *  - requester
     *  - panel
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
                if( AccountsUI.opts().verbosity() & AC_VERBOSE_PANEL ){
                    console.log( 'pwix:accounts-ui Event handling', event.type, data );
                }
                const requester = data.requester;
                if( requester ){
                    const component = AccountsUI.Manager.component( requester );
                    if( component ){
                        if( AccountsUI.opts().verbosity() & AC_VERBOSE_PANEL ){
                            console.log( 'pwix:accounts-ui Event forwarding to requester', requester );
                        }
                        component.companion.handleEvent( event, data );
                    } else {
                        console.error( 'expected acComponent identifier, found', requester );
                    }
                } else {
                    console.error( 'requester empty while expecting acComponent identifier' );
                }
        }
        return true;
    },

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
                if( AccountsUI.opts().verbosity() & AC_VERBOSE_SUBMIT ){
                    console.log( 'pwix:accounts-ui Event handling', event.type, data );
                }
                //console.debug( AccountsUI.Display );
                const requester = AccountsUI.Display.requester();
                if( requester ){
                    const component = AccountsUI.Manager.component( requester );
                    if( component ){
                        component.companion.handleEvent( event, data );
                    } else {
                        console.error( 'expected acComponent identifier, found', requester );
                    }
                } else {
                    console.error( 'requester empty while handing ac-submit event' );
                }
        }
        return true;
    },

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
                if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
                    console.log( 'pwix:accounts-ui Event handling', event.type, data );
                }
                //console.debug( event, data );
                //console.debug( 'requester', AccountsUI.Display.requester());
                //console.debug( 'panel', AccountsUI.Display.panel());
                if( event.type !== 'ac-user-verifieddone-event' && data.autoClose !== false && Modal.count()){
                    if( AccountsUI.opts().verbosity() & AC_VERBOSE_MODAL ){
                        console.log( 'pwix:accounts-ui Event closing modal' );
                    }
                    Modal.close();
                }
        }
        return true;
    },

    /*
     * @summary Common event handler
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} false to stop the propagation (usually because the event has been handled)
     *  Default is to redirect the event if possible.
     */
    handler( event, data ){
        if( AccountsUI.opts().verbosity() & AC_VERBOSE_HANDLED ){
            console.log( 'pwix:accounts-ui Event handling', event, data );
        }
        return this._handlePanel( event, data ) && this._handleUser( event, data ) &&
                this._handleSubmit( event, data ) && this._handleModal( event, data );
    },

    /**
     * @summary Send an event
     * @param {String} event the name of the event, as known by acEvent
     * @param {Object} Parms additional arguments, if any, to be sent as a data object associated to the event
     */
    trigger( event, parms={} ){
        this.validate( event );
        $( 'body' ).trigger( event, parms );
    },

    /**
     * @summary Validate an event name
     * @param {String} event the event to be validated
     * @throws {Error}
     */
    validate( event ){
        if( !event ){
            console.Error( 'empty event name' );
        }
        if( !this.Refs.includes( event )){
            console.error( 'unknown event', event );
        }
    }
};

// install a general events handler
AccountsUI.Event.Refs.every(( name ) => {
    $( document ).on( name, AccountsUI.Event.handler.bind( AccountsUI.Event ));
    return true;
});
