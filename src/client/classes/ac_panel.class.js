/*
 * /src/client/classes/ac_panel.class.js
 *
 * This class manages the requested panel as a singleton, as all 'acUserLogin' instanciated templates share the same display request.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../../common/js/index.js';

export class acPanel {

    // private data
    static Singleton = null;

    // the known panels
    static Knowns = [
        AC_PANEL_NONE,
        AC_PANEL_SIGNIN,
        AC_PANEL_SIGNUP,
        AC_PANEL_RESETASK,
        AC_PANEL_SIGNOUT,
        AC_PANEL_CHANGEPWD,
        AC_PANEL_VERIFYASK
    ];

    // what is the current displayed template ?
    _panel = new ReactiveVar( null );
    _previous = new ReactiveVar( null );
    _view = new ReactiveVar( null );

    // private functions

    // public data

    /**
     * Constructor
     * @param {String} panel the panel to initialize with, defaulting to 'AC_PANEL_NONE'
     * @returns {acPanel}
     */
    constructor( panel=AC_PANEL_NONE ){
        if( acPanel.Singleton ){
            console.log( 'pwi:accounts returning already instanciated acPanel' );
            return acPanel.Singleton;
        }

        console.log( 'pwi:accounts instanciating new acPanel' );

        this.asked( panel );

        acPanel.Singleton = this;
        return this;
    }

    /**
     * Getter/Setter
     * @param {String} panel the requested panel (may be null)
     * @returns {String} the currently requested panel
     */
    asked( panel ){
        const previous = this._panel.get();
        if( acPanel.Knowns.includes( panel ) && panel !== previous ){
            console.log( 'pwi:accounts triggering transition from '+previous+' to '+panel );
            $( '.acUserLogin' ).trigger( 'ac-panel-transition', { previous:previous, next:panel });
            this._panel.set( panel );
            this._previous.set( previous );
        }
        return this._panel.get();
    }

    /**
     * @returns {String} the previous panel
     */
    previous(){
        return this._previous.get();
    }

    /**
     * Getter/Setter
     * @param {Object} view the just created view
     * @returns {Object} the current view
     */
    view( view ){
        //console.log( arguments );
        if( view || arguments.length === 1 ){
            this._view.set( view );
        }
        return this._view.get();
    }
}
