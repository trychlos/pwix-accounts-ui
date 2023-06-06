/*
 * acDisplayManager class
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
 *  This class declares itself as a common event handler for events which bubble until the body,
 *  and so happens to be a potential central (re-)distribution point of the events.
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { pwixModal } from 'meteor/pwix:modal';

import { acPanel } from './ac_panel.js';

export class acDisplayManager {

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

    /**
     * Constructor
     * @returns {acDisplayManager}
     */
    constructor(){
        const self = this;

        if( acDisplayManager.Singleton ){
            if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
                console.log( 'pwix:accounts returning already instanciated acDisplayManager singleton' );
            }
            return acDisplayManager.Singleton;
        }

        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts instanciating acDisplayManager' );
        }

        // re-set modal title when panel changes
        Tracker.autorun(() => {
            const panel = self.panel();
            if( panel ){
                pwixModal.setTitle( acPanel.title( panel ));
                pwixModal.setBody( acPanel.template( panel ));
            }
        });

        acDisplayManager.Singleton = this;
        return this;
    }

    /**
     * @summary Request for the display of the specified panel
     * @param {String} panel the panel to be displayed
     * @param {Object} requester any object instance
     *  if null, then will be set to ANONYMOUS
     *  else should implement id() and target() methods
     * @param {Object} parms the optional parms to be passed as a data context to the panel template
     * @returns {Boolean} whether the acDisplayManager is able to satisfy the request
     *  i.e. whether the display is free before the request and can be allocated to it
     */
    ask( panel, requester, parms={} ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_IDPASK ){
            console.log( 'pwix:accounts acDisplayManager.ask() self', this );
            console.log( 'pwix:accounts acDisplayManager.ask() panel', panel );
            console.log( 'pwix:accounts acDisplayManager.ask() requester', requester );
            console.log( 'pwix:accounts acDisplayManager.ask() parms', parms );
        }
        acPanel.validate( panel );
        if( !requester ){
            requester = ANONYMOUS;
        }
        // if we already have a another requester for the display, then refuse the request
        if( this._requester && ( this._requester !== requester || this._requester.id() !== requester.id())){
            console.log( 'refusing request as already used by another requester' );
            return false;
        }
        // asking for AC_PANEL_NONE is same than releasing
        if( panel === AC_PANEL_NONE ){
            this.release();
            return true;
        }
        // show the panel (at last...)
        // modal template and title are set through the panel reactivity
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
            console.log( 'pwix:accounts acDisplayManager run the modal', parms );
        }
        this.panel( panel );
        this._requester = requester;
        pwixModal.run({
            mdFooter: 'ac_footer',
            requester: requester,
            ...parms
        });
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
     *  This is called by acEventManager
     * @param {Object} event the jQuery event
     * @param {Object} data the data associated to the event by the sender
     * @return {Boolean} true if the message has been successfully handled
     */
    handleModal( event, data ){
        switch( event.type ){
            case 'md-close':
                if( pwiAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
                    console.log( 'pwix:accounts acDisplayManager handling', event.type );
                }
                this.errorMsg( '' );
                this.title( '' );
                pwiAccounts.DisplayManager.release();
                return true;
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
     * @summary Release the current requester
     */
    release(){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_IDPFREE ){
            console.log( 'pwix:accounts acDisplayManager.release()' );
        }
        this._requester = null;
        this.panel( AC_PANEL_NONE );
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
