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

    // maintains the preferred label
    _label = new ReactiveVar( '' );

    // maintains a LOGGED/UNLOGGED status
    _state = new ReactiveVar( AccountsUI.C.Connection.UNLOGGED );

    // maintains the count of unverified email addresses
    //  is expected to be exactly consistant with Meteor.user() but adds a (very) thin conceptualization level
    //  a reactive data source
    _unverified = new ReactiveVar( -1 );

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

        logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.INSTANCIATIONS }, 'instanciating acConnection' );

        // track logged/unlogged connection state
        Tracker.autorun(() => {
            this._state.set( Meteor.userId() ? AccountsUI.C.Connection.LOGGED : AccountsUI.C.Connection.UNLOGGED );
        });

        // track count of unverified email addresses
        Tracker.autorun(() => {
            const user = Meteor.user({ fields: { 'emails': 1 }});
            let count = -1;
            if( user ){
                count = 0;
                for( const it of ( user?.emails || [] )){
                    if( !it.verified ){
                        count += 1;
                    }
                }
            }
            //logger.debug( user?.emails[0].address, count );
            this._unverified.set( count );
        });

        // track the preferred label
        Tracker.autorun(() => {
            const acInstance = AccountsCore.getInstance( 'users' );
            if( acInstance && Meteor.userId()){
                acInstance.preferredLabel( Meteor.userId()).then(( res ) => this._label.set( res.label ));
                return;
            }
            this._label.set( '' );
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
     * @returns {Integer} the count of unverified email addresses
     * A reactive data source
     */
    unverifiedCount(){
        return this._unverified.get();
    }
}
