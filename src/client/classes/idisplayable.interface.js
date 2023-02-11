/*
 * IDisplayer interface
 *
 *  Is the implementation a acDisplayer requester ?
 * 
 *  Everyone, and for example every implemented interface, is allowed to add() here a new checkable event.
 *  Each of the returned checkable will then be tested in sequence when requiring a feature status.
 */
import { Checkable, Interface, Msg } from './index.js';

export class ICheckable {

    _instance = null;
    _checkables = [];

    /**
     * Constructor
     * @param {*} instance the implementation instance
     * @returns {ICheckable}
     */
    constructor( instance ){
        Msg.debug( 'ICheckable instanciation' );
        this._instance = instance;
        return this;
    }

    /* *** ***************************************************************************************
       *** The implementation API, i.e; the functions the implementation may want to implement ***
       *** *************************************************************************************** */

    /* *** ***************************************************************************************
       *** The public API, i.e; the API anyone may call to access the interface service        ***
       *** *************************************************************************************** */

    /**
     * Statically add a checkable to the implementation instance
     * Takes care of implementing this interface if not already done
     * @param {Object} instance the implementation instance
     * @param {Function} fn the function to be invoked prior status may be checked
     *  The function will be called with the implementation instance as first argument, followed by the args provided here
     *  The function must return a Promise which resolves to a value which must conform to checkable.schema.json
     * @param {Object[]} args the arguments to pass to the function, after:
     *  - the implementation instance
     * [-Public API-]
     */
    static add(){
        Msg.debug( 'ICheckable.static.add()' );
        if( arguments.length < 2 ){
            Msg.error( 'ICheckable.static.add() expects at least ( instance, function ) arguments' );
        } else {
            let _args = [ ...arguments ];
            const instance = _args.splice( 0, 1 )[0];
            if( instance ){
                if( !instance.ICheckable ){
                    Interface.add( instance, ICheckable );
                }
                instance.ICheckable.add( ..._args );
            } else {
                Msg.error( 'ICheckable.static.add() lacks at least an instance' );
            }
        }
    }

    /**
     * Add a checkable to the implementation instance
     * @param {Function} fn the function to be invoked prior status may be checked
     *  The function will be called with the implementation instance as first argument, followed by the args provided here
     *  The function must return a Promise which resolves to a value which must conform to checkable.schema.json
     * @param {Object[]} args the arguments to pass to the function, after:
     *  - the implementation instance
     * [-Public API-]
     */
    add(){
        Msg.debug( 'ICheckable.add()' );
        if( arguments.length < 1 ){
            Msg.error( 'ICheckable.add() expects at least ( function ) arguments' );
        } else {
            let _args = [ ...arguments ];
            const fn = _args.splice( 0, 1 )[0];
            if( fn && typeof fn === 'function' ){
                this._checkables.push({
                    fn: fn,
                    args: [ ..._args ]
                });
            } else {
                Msg.error( 'ICheckable.add() lacks a function' );
            }
        }
    }

    /**
     * @returns {Promise} which resolves to each checkable be successively requested, then merged into a single object
     * [-Public API-]
     */
    run(){
        Msg.debug( 'ICheckable.run()' );
        let _result = new Checkable();
        let _promise = Promise.resolve( _result );
        this._checkables.every(( o ) => {
            if( o.fn && typeof o.fn === 'function' ){
                _promise = _promise.then(() => { return o.fn( this._instance, ...o.args ); })
                _promise = _promise.then(( res ) => { return _result.merge( res ); });
            }
            return true;
        });
        //_promise = _promise.then(() => { return Promise.resolve( _result ); });
        return _promise;
    }
}
