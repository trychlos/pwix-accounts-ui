/*
 * IDisplayManager interface
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
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { pwixModal } from 'meteor/pwix:modal';

import { IDisplayRequester } from './idisplay_requester.interface.js';
import { acPanel } from './ac_panel.class.js';

export class IDisplayManager {

    // the implementation instance
    _instance = null;

    // the current IDisplayRequester (null if nobody)
    _requester = null;

    // the currently displayed panel as a reactive var
    _panel = new ReactiveVar( null );

    /**
     * Constructor
     * @param {*} instance the implementation instance
     * @returns {IDisplayManager}
     */
    constructor( instance ){
        this._instance = instance;
        const self = this;

        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts instanciating IDisplayManager interface' );
        }

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

    /* *** ***************************************************************************************
       *** The public API, i.e; the API anyone may call to access the interface service        ***
       *** *************************************************************************************** */

    /**
     * @summary Request for the display of the specified panel
     * @param {String} panel the panel to be displayed
     * @param {IDisplayRequester} requester a IDisplayRequester instance
     * @param {Object} parms the parms to be passed to the panel, may be undefined, null or empty
     * @returns {Boolean} whether the IDisplayManager is able to satisfy the request
     *  i.e. whether the display is free before the request and can be allocated to it
     * [-Public API-]
     */
    ask( panel, requester, parms={} ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_IDPASK ){
            console.log( 'pwix:accounts IDisplayManager.ask() panel', panel );
            console.log( 'pwix:accounts IDisplayManager.ask() requester', requester );
            console.log( 'pwix:accounts IDisplayManager.ask() parms', parms );
        }
        acPanel.validate( panel );
        if( !requester || !( requester instanceof IDisplayRequester )){
            throw new Error( 'not a IDisplayRequester instance', requester );
        }
        // freeing the display (if asked by the same initial requester)
        if( panel === AC_PANEL_NONE ){
            if( !this._requester || this._requester.id() === requester.id()){
                this.free();
                return true;
            } else {
                console.log( 'refusing request of another IDisplayRequester' );
                return false;
            }
        }
        // if we already have a another requester for the display, then refuse the request
        if( this._requester && this._requester.id() !== requester.id()){
            console.log( 'refusing request as already used by another IDisplayRequester' );
            return false;
        }
        this.panel( panel );
        this._requester = requester;
        // show the panel (at last...)
        // modal template and title are set through the panel reactivity
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
            console.log( 'pwix:accounts IDisplayManager running modal' );
        }
        pwixModal.run({
            mdFooter: 'ac_footer',
            requester: requester,
            ...parms
        });
        return true;
    }

    /**
     * @summary Free the current requester
     * [-Public API-]
     */
    free(){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_IDPFREE ){
            console.log( 'pwix:accounts IDisplayManager.free()' );
        }
        this._requester = null;
        this.panel( AC_PANEL_NONE );
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
     * @returns {IDisplayRequester} the current IDisplayRequester which has reserved the display
     */
    requester(){
        return this._requester;
    }
}
