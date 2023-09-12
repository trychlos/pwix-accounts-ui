/*
 * pwix:accounts-ui/src/client/classes/ac_component.class.js
 *
 * A Blaze component as managed by acManager.
 * This object also acts as the event handler for this component (and its descendants).
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

export class acComponent {

    // static data
    //

    // static methods
    //

    // private data
    //

    // the identifier attributed by the manager
    _managerId = null;

    // the Blaze.TemplateInstance object
    _instance = null;

    // the unique jQuery selector for the acUserLogin Blaze template instance
    _jqSelector = null;

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    // the target events handler for this component and its descendants (including modals)
    //  this is NOT the event handler for reset password and email verification
    _target = new ReactiveVar( null );

    // private methods
    //

    /*
     * @summary wait for the DOM be ready - set the corresponding reactive var to true
     */
    _waitForDom(){
        const self = this;
        // make the acCompanionDom 'ready' as soon as the DOM is itself ready
        //  thanks to Blaze rendering mechanisms, the toplevel acUserLogin template is the last to be rendered
        //  and thanks to Javascript, this doesn't block the normal code flow
        const intervalId = setInterval(() => {
            const div = $( self._jqSelector );
            if( div.length > 0 ){
                self.ready( true );
                //self.companion().target( div )
                clearInterval( intervalId );
            }
        }, 20 );
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {String} managerId the identifier attributed by the acManager
     * @param {Object} instance the Blaze.TemplateInstance object
     * @returns {acComponent}
     */
    constructor( managerId, instance ){
        const self = this;

        if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acComponent' );
        }

        self._managerId = managerId;
        self._instance = instance;
        self._jqSelector = '.' + self.className() + '#' + managerId;

        // wait for dom as soon as we are instanciated (there is no need to ask for the caller to recall another method)
        self._waitForDom();

        // when DOM is ready, set this object as the target events handler
        Tracker.autorun(() => {
            if( self.ready()){
                self._target.set( self );
            }
        });

        return this;
    }

    /**
     * @returns {String} the main class name of the Blaze template instance
     */
    className(){
        return this._instance.view.name.replace( /^Template\./, '' );
    }

    /**
     * Getter/Setter
     * @param {Boolean} ready whether the DOM is ready
     * @returns {Boolean} whether the DOM is ready
     *  A reactive data source
     */
    ready( ready ){
        if( ready === true || ready === false ){
            if( AccountsUI.opts().verbosity() & AC_VERBOSE_READY ){
                console.log( 'pwix:accounts-ui acCompanionDom ready', ready );
            }
            this._ready.set( ready );
        }
        return this._ready.get();
    }
}
