/*
 * /src/client/classes/ac_panel.class.js
 *
 * This class manages the requested panel as a singleton, as all 'acUserLogin' template's hierarchies share the same display request.
 */
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

import '../../common/js/index.js';

export class acPanel {

    // private data
    static _singleton = null;

    // what is the current displayed template ?
    _panel = new ReactiveVar( null );
    _previous = new ReactiveVar( null );
    _view = new ReactiveVar( null );

    // private functions

    // public data

    // the current displayable templates
    static c = {
        NONE: 'NONE',               // nothing is displayed
        SIGNIN: 'SIGNIN',           // currently signing in
        SIGNUP: 'SIGNUP',           // currently signing up / creating a new account
        RESETASK: 'RESETASK',       // ask for resetting a password
        RESETPWD: 'RESETPWD',       // input the password on reset
        CHANGEPWD: 'CHANGEPWD',     // when logged, change the password
        VERIFYASK: 'VERIFYASK',     // ask for resend the verification mail
        SIGNOUT: 'SIGNOUT'          // logout
    };

    /**
     * Constructor
     * @param {String} panel the panel to initialize with, defaulting to 'NONE'
     * @returns {acPanel}
     */
    constructor( panel ){
        if( acPanel._singleton ){
            console.log( 'pwi:accounts returning already instanciated acPanel' );
            return acPanel._singleton;
        }

        console.log( 'pwi:accounts instanciating acPanel' );

        this.asked( panel ? panel : acPanel.c.NONE );

        acPanel._singleton = this;
        return this;
    }

    /**
     * Getter/Setter
     * @param {String} template the requested template (may be null)
     * @returns {String} the currently requested template
     */
    asked( template ){
        const previous = this._panel.get();
        if( Object.keys( acPanel.c ).includes( template ) && previous !== template ){
            console.log( 'pwi:accounts triggering transition from '+previous+' to '+template );
            $( '.acUserLogin' ).trigger( 'ac-panel-transition', { previous:previous, next:template });
            this._panel.set( template );
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
