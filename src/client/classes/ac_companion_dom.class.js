/*
 * pwix:accounts-ui/src/client/classes/ac_companion_dom.class.js
 *
 * A companion class for DOM management.
 */

import { ReactiveVar } from 'meteor/reactive-var';

export class acCompanionDom {

    // static data
    //

    // private data
    //

    // the acCompanion master class
    _companion = null;

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    // public data
    //

    // static methods
    //

    // private methods
    //

    // public methods
    //

    /**
     * Constructor
     * @param {acCompanion} companion the acCompanion instance
     * @returns {acCompanionDom} this instance
     */
    constructor( companion ){
        const self = this;

        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acCompanionDom' );
        }

        self._companion = companion;

        return this;
    }

    /**
     * @returns {acCompanion} the master acCompanion
     */
    companion(){
        return this._companion;
    }

    /**
     * Getter/Setter
     * @param {Boolean} ready whether the DOM is ready
     * @returns {Boolean}
     */
    ready( ready ){
        if( ready === true || ready === false ){
            if( pwixAccounts.opts().verbosity() & AC_VERBOSE_READY ){
                console.log( 'pwix:accounts-ui acCompanionDom ready', ready );
            }
            this._ready.set( ready );
        }
        return this._ready.get();
    }

    /**
     * @summary wait for the DOM be ready
     */
    waitForDom(){
        const self = this;

        // compute the unique jQuery selector for the acUserLogin Blaze template instance
        const _jqSelector = '.acUserLogin#' + self.companion().id();

        // make the acCompanion 'ready' as soon as the DOM is itself ready
        //  thanks to Blaze rendering mechanisms, the toplevel acUserLogin template is the last to be rendered
        //  and thanks to Javascript, this doesn't block the normal code flow
        const intervalId = setInterval(() => {
            const div = self.companion().instance().$( _jqSelector );
            if( div.length > 0 ){
                self.ready( true );
                self.companion().target( div )
                clearInterval( intervalId );
            }
        }, 20 );
    }
}
