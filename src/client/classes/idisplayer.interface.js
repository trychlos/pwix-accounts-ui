/*
 * IDisplayer interface
 *
 *  The public interface to the display service,
 *  aka the public interface of the acDisplayer singleton.
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
 * 
 *  This interface declares itself as a common event handler for our events, and so happens to be a potential
 *  central (re-)distribution point of the events.
 *  At least as far as it knows to where the event must be redirected. This is the role if the IDIsplayRequester
 *  interface.
 * 
 *  Anybody can request the display, and gains it. But only a IDisplayRequester will be able to get the events
 *  back.
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

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { pwixModal } from 'meteor/pwix:modal';

import { IDisplayRequester } from './idisplay_requester.interface.js';
import { acEvent } from './ac_event.class.js';
import { acPanel } from './ac_panel.class.js';

ANONYMOUS = 'ANONYMOUS';

export class IDisplayer {

    // the implementation instance
    _instance = null;

    // the current IDisplayRequester (null if nobody)
    _requester = null;

    // the currently displayed panel as a reactive var
    _panel = new ReactiveVar( null );

    /**
     * Constructor
     * @param {*} instance the implementation instance
     * @returns {IDisplayer}
     */
    constructor( instance ){
        console.debug( 'IDisplayer instanciation' );
        this._instance = instance;
        const self = this;

        // install a general events handler
        acEvent.enumerate(( name ) => {
            $( document ).on( name, this.v_handler.bind( self ));
        });

        // re-set modal title when panel changes
        Tracker.autorun(() => {
            const panel = self.panel();
            if( panel ){
                pwixModal.setTitle( acPanel.title( panel ));
                pwixModal.setTemplate( acPanel.template( panel ));
            }
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
     *
     *  Default is to redirect the event if possible:
     *  - either because the event itself provides a requester information
     *  - or because an identified requester as asked for the display
     *
     * [-implementation Api-]
     */
    v_handler( event, data ){
        //console.debug( 'IDisplayer.v_handler()', event, data );
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
     * @summary Request for the display of the specified panel
     * @param {IDisplayRequester} requester a IDisplayRequester instance, or null
     * @param {String} panel the panel to be displayed
     * @param {Object} opts options to be passed to the panel
     * @returns {Boolean} whether the IDisplayer is able to satisfy the request
     *  i.e. whether the display is free before the request and can be allocated to it
     * [-Public API-]
     */
    ask( requester, panel, opts ){
        if( requester && !( requester.IDisplayRequester && requester.IDisplayRequester instanceof IDisplayRequester )){
            throw new Error( 'not a IDisplayRequester instance', requester );
        }
        // if we already have a requester for the display, then refuse the request
        if( this._requester ){
            console.log( 'request is refused as display is already used' );
            return false;
        }
        acPanel.validate( panel );
        this.panel( panel );
        // the requester may be null if the caller doesn't care of receiving events
        this._requester = requester || ANONYMOUS;
        // show the panel (at last...)
        pwixModal.run({
            mdTemplate: acPanel.template( panel ),
            mdTitle: acPanel.title( panel ),
            mdTarget : requester ? requester.IDisplayRequester.target() : null,
            mdFooter: 'ac_footer',
            ...opts
        });
        return true;
    }

    /**
     * @summary Free the current requester
     * [-Public API-]
     */
    free(){
        if( !this._requester ){
            console.log( 'no requester at the time' );
        }
        console.log( 'freeing the display' );
        this._requester = null;
        this.panel( null );
    }

    /**
     * Getter/Setter
     * Maintains the currently displayed panel as a ReactiveVar
     * @param {String} panel to be displayed
     * @returns {String} the currently displayed panel, or null
     */
    panel( panel ){
        if( panel !== undefined ){
            this._panel.set( panel );
        }
        return this._panel.get();
    }

    /**
     * @summary Send an event
     * @param {String} event the name of the event, as known by acEvent.isKnown()
     *  Additional arguments, if any, are sent as a data object associated to the event
     *  So MUST be an object
     * [-Public API-]
     */
    trigger( event, parms={} ){
        acEvent.validate( event );
        //console.log( event, parms );
        $( 'body' ).trigger( event, parms );
    }
}
