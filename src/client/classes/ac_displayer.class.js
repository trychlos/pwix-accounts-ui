/*
 * /src/client/classes/ac_displayer.class.js
 *
 * This class implements IDisplayManager and IEventManager interfaces.
 * Because this display is a unique resource, the class is managed as a singleton maintained by the pwiAccounts global object.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { IDisplayManager } from './idisplay_manager.interface.js';
import { IEventManager } from './ievent_manager.interface.js';
import { Interface } from './interface.class';

export class acDisplayer {

    // static data
    //

    static Singleton = null;

    // static methods
    //

    // private data
    //

    _errorMsg = new ReactiveVar( '' );
    _title = new ReactiveVar( '' );

    // private methods
    //

    /*
     *  Reinitialize the error message and the title when the modal is closed
     */
    _idisplaymanagerHandleModal( event, data ){
        console.debug( 'acDisplayer._idisplaymanagerHandleModal()' );
        console.log( this );
        switch( event.type ){
            case 'md-modal-close':
                this.errorMsg( '' );
                this.title( '' );
                // default behavior
                pwiAccounts.Displayer.IDisplayManager.free();
                return false;
                // as this call is actually a loop
                //return this.IEventManager.v_handleModal( event, data );
        }
        return true;
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * The object is instanciated at top level of package initialization, i.e. before ready().
     * @returns {acDisplayer}
     */
    constructor(){
        if( acDisplayer.Singleton ){
            console.log( 'pwix:accounts returning already instanciated acDisplayer' );
            return acDisplayer.Singleton;
        }
        console.log( 'pwix:accounts instanciating new acDisplayer' );

        Interface.add( this, IDisplayManager, {
        });

        Interface.add( this, IEventManager, {
            v_handleModal: this._idisplaymanagerHandleModal
        });

        acDisplayer.Singleton = this;
        return this;
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
