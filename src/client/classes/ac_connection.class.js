/*
 * /src/client/classes/ac_connection.class.js
 *
 * This class manages the current connection state of the logged-in user as a singleton.
 */

import { AccountsCore } from 'meteor/pwix:accounts-core';
import { check, Match } from 'meteor/check';
import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

const logger = Logger.get();

export class acConnection {

    // static data
    //

    static Singleton = null;

    // static methods
    //

    // private data
    //

    // the 'users' acInstance
    _instance = new ReactiveVar( null );

    // maintains the preferred label
    _label = new ReactiveVar( '' );

    // maintains a LOGGED/UNLOGGED status
    _state = new ReactiveVar( AccountsUI.C.Connection.UNLOGGED );

    // maintains the count of unverified email addresses
    //  is expected to be exactly consistant with Meteor.user() but adds a (very) thin conceptualization level
    //  a reactive data source
    _unverified = new ReactiveVar( -1 );

    // the user document
    _userdoc = new ReactiveVar( null );

    // private methods
    //

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
            logger.info( 'returning already instanciated acConnection' );
            return acConnection.Singleton;
        }

        const self = this;

        logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.INSTANCIATIONS }, 'instanciating acConnection' );

        // reactively store the acAccount instance
        //  while the 'users' instance is not available we will refuse to consider any connection
        Tracker.autorun(() => {
            self._instance.set( AccountsCore.getInstance( 'users' ));
        });

        // track logged/unlogged connection state
        Tracker.autorun(() => {
            let state = AccountsUI.C.Connection.UNLOGGED;
            if( self._instance.get() && Meteor.userId()){
                state = AccountsUI.C.Connection.LOGGED;
            }
            self._state.set( state );
        });

        // reactively store a user document
        Tracker.autorun(() => {
            const userId = Meteor.userId();
            const acInstance = self._instance.get();
            if( userId && acInstance ){
                acInstance.byId( userId ).then(( userDoc ) => { self._userdoc.set( userDoc ); });
            } else {
                self._userdoc.set( null );
            }
        });

        // keep some informations about the newly got user document
        //  only reactive on userDoc as acInstance is itself a prerequisite
        Tracker.autorun(() => {
            const userDoc = self._userdoc.get();
            if( userDoc ){
                Tracker.nonreactive(() => {
                    // count unverified email address(es)
                    let count = 0;
                    for( const it of ( userDoc.emails || [] )){
                        if( !it.verified ){
                            count += 1;
                        }
                    }
                    self._unverified.set( count );
                    // get the preferred label
                    const acInstance = self._instance.get();
                    acInstance.preferredLabel( userDoc ).then(( res ) => { self._label.set( res.label ); });
                });
            } else {
                self._unverified.set( -1 );
                self._label.set( null );
            }
        });

        acConnection.Singleton = this;
        return this;
    }

    /**
     * Getter
     * @returns {String} the preferred label of the connected user
     * A reactive data source
     */
    preferredLabel(){
        return this._label.get();
    }

    /**
     * Getter
     * @returns {String} the logged-in status as AccountsUI.C.Connection.LOGGED or AccountsUI.C.Connection.UNLOGGED
     * A reactive data source
     */
    state(){
        return this._state.get();
    }

    /**
     * Getter
     * @returns {String} a string version of the whole status of the connection
     */
    stringify(){
        return JSON.stringify({ state: this.state(), unverified: this.unverifiedCount(), label: this.preferredLabel() });
    }

    /**
     * Getter
     * @returns {Object} the current user document, or null
     * A reactive data source
     */
    userDoc(){
        return this._userdoc.get();
    }

    /**
     * Getter
     * @returns {Integer} the count of unverified email addresses
     * A reactive data source
     */
    unverifiedCount(){
        return this._unverified.get();
    }
}
