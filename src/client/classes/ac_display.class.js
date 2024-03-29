/*
 * acDisplay class
 *
 * The single manager of the display service,
 * 
 * Rationale
 * 
 *  This class let the display of the different dialogs in the user interface be managed.
 *  Because this display is a unique resource, the class is managed as a singleton.
 * 
 *  Not only the acUserLogin template instance, but also any other class or piece of code of the package may
 *  ask at any time to display a dialog to interact with the user.
 *  In order these dialogs do not overlap each other and lead to a poor user experience, this class make sure
 *  that only one dialog is showed at any time, and who has requested it.
 *
 *  Usage:
 *  Whoever wants the display has to ask() for it.
 *  - the method will refuse it, and return false, if another requester is already displaying something
 *  - else the method setup the current panel and return true.
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { acComponent } from './ac_component.class.js';

export class acDisplay {

    // static data
    //
    static Singleton = null;

    // private data
    //

    _errorMsg = new ReactiveVar( '' );
    _title = new ReactiveVar( '' );

    // the current requester (null if nobody)
    _requester = null;

    // the currently displayed panel as a reactive var
    _panel = new ReactiveVar( null );

    // the opened modal identifier, if any
    _modalId = null;

    /**
     * Constructor
     * @returns {acDisplay}
     */
    constructor(){
        const self = this;

        if( acDisplay.Singleton ){
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
                console.log( 'pwix:accounts-ui returning already instanciated acDisplay singleton' );
            }
            return acDisplay.Singleton;
        }

        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acDisplay' );
        }

        // trace panel changes
        Tracker.autorun(() => {
            const panel = this.panel();
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.PANEL ){
                console.log( 'pwix:accounts-ui acDisplay.panel()', panel );
            }
        });

        acDisplay.Singleton = this;
        return this;
    }

    /**
     * @summary Request for the display of the specified panel
     * @param {String} panel the panel to be displayed
     * @param {String} requester the identifier allocated to the component by acManager
     *  if null, then will be set to ANONYMOUS
     * @param {Object} parms the optional parms to be passed as a data context to the panel template
     * @returns {Boolean} whether the acDisplay is able to satisfy the request
     *  i.e. whether the display is free before the request and can be allocated to it
     */
    ask( panel, requester, parms={} ){
        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.DISPLAY ){
            console.log( 'pwix:accounts-ui acDisplay.ask() self', this );
            console.log( 'pwix:accounts-ui acDisplay.ask() panel', panel );
            console.log( 'pwix:accounts-ui acDisplay.ask() requester', requester );
            console.log( 'pwix:accounts-ui acDisplay.ask() parms', parms );
        }
        AccountsUI.Panel.validate( panel );
        if( !requester ){
            requester = ANONYMOUS;
        }
        // if we already have a another requester for the display, then refuse the request
        if( this._requester && ( this._requester !== requester )){
            console.log( 'refusing request as already used by another requester' );
            return false;
        }
        // asking for AccountsUI.C.Panel.NONE is same than releasing
        if( panel === AccountsUI.C.Panel.NONE ){
            this.release();
            return true;
        }
        this.panel( panel );
        this._requester = requester;
        return true;
    }

    /**
     * Getter/Setter
     * Panels have their own error messages (e.g. password too short or too weak).
     * This method is provided to host error messages returned from the server (e.g. bad credentials).
     * @param {String} msg error msg
     * @returns {String} the current error message
     */
    errorMsg( msg ){
        if( msg !== undefined ){
            this._errorMsg.set( msg );
        }
        return this._errorMsg.get();
    }

    /**
     * @summary Handle modal events
     *  This is called by Event as an event forwarding
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} true if the message has been successfully handled
     */
    handleModal( event, data ){
        switch( event.type ){

            // a modal is closing
            //  only dealt with it if it is ours
            case 'md-close':
                const panel = this.panel();
                const managerId = data && data.parms ? data.parms.managerId : null;
                const component = managerId ? AccountsUI.Manager.component( managerId ) : null;
                if( panel && panel !== AccountsUI.C.Panel.NONE && component instanceof acComponent ){
                    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.DISPLAY || AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.MODAL ){
                        console.log( 'pwix:accounts-ui acDisplay handling', event.type );
                    }
                    this.errorMsg( '' );
                    this.title( '' );
                    this.release();
                    return true;
                }
        }
        return false;
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
     * @summary Release the specified requester, or inconditionally
     * @param {String} requester
     */
    release( requester ){
        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.DISPLAY ){
            console.log( 'pwix:accounts-ui acDisplay.release()', requester );
        }
        if( !requester || requester === this._requester ){
            this._requester = null;
            this.panel( AccountsUI.C.Panel.NONE );
        }
    }

    /**
     * @returns {*} the requester which has currently reserved the display
     */
    requester(){
        return this._requester;
    }

    /**
     * Getter/Setter
     * @param {String} title a new title for the modal
     * @returns {String} the current title
     */
    title( title ){
        if( title !== undefined ){
            this._title.set( title );
        }
        return this._title.get();
    }
}
