/*
 * /src/client/classes/ac_connection.class.js
 *
 * This class manages the current connection state of the logged-in user as a singleton.
 */

import { Tracker } from 'meteor/tracker';

export class acConnection {

    // static data
    //

    static Singleton = null;

    // static methods
    //

    // private data
    //

    // maintains a LOGGED/UNLOGGED status
    //  is expected to be exactly consistant with Meteor.user() but adds a (very) thin conceptualization level
    //  a reactive data source
    _state = {
        dep: null,
        value: null
    }

    // private methods
    //

    /*
     * Setter only
     * @param {String} state the new logged-in status
     * @returns {String} the logged-in status as AC_LOGGED or AC_UNLOGGED
     * A reactive data source
     */
    _stateSet( state ){
        if( !this._state.dep ){
            this._state.dep = new Tracker.Dependency();
        }
        if( state && ( state === AC_LOGGED || state === AC_UNLOGGED ) && state !== this._state.value ){
            this._state.value = state;
            this._state.dep.changed();
        }
        return this._state.value;
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @returns {acConnection}
     */
    constructor(){
        if( acConnection.Singleton ){
            console.log( 'pwix:accounts-ui returning already instanciated acConnection' );
            return acConnection.Singleton;
        }

        if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acConnection' );
        }

        Tracker.autorun(() => {
            this._stateSet( Meteor.userId() ? AC_LOGGED : AC_UNLOGGED );
        });

        acConnection.Singleton = this;
        return this;
    }

    /**
     * Getter
     * @param {String} state the new logged-in status
     * @returns {String} the logged-in status as AC_LOGGED or AC_UNLOGGED
     * A reactive data source
     */
    state(){
        this._state.dep.depend();
        return this._state.value;
    }
}
