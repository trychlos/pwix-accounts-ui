/*
 * interface.class.js
 *
 * Let define an interface implementation
 * 
 * Usage: Interface.add( object, interface, mapFns );
 * 
 * To be called from the implementing constructor.
 * 
 * This works by adding to the implementation instance:
 * - a member interface which holds the methods
 * - an array of the implemented interfaces.
 * 
 * Ex: if class A implements interface IB:
 * - each A object will have a IB member, with A.IB instanceof IB
 * - each A object will have a Interfaces member array, which will contain 'IB' (and other implemented interfaces)
 * 
 * TODO
 *  1. once an object A has overriden an IB method, it cannot called again the default method; this would gain to be fixed in a future version.
 *  2. this is a bit counter-intuitive that we do not have A instanceof IB, but we rather adapt to that
 */

export class Interface {

    /**
     * @param {Object} instance the instance of the class which wants implement the interface
     * @param {Class} ifaceClass the class which defines the interface
     *  interface is expected to be a class definition: we so expect to have (at least)
     *  [[class_prototype]] -> [[Object_prototype]] -> [[null]]
     *  so three inheritance levels at least, last being null
     * @param {Object} mapFns an object whose keys map the interface functions to the implementation ones
     * @returns {String} the name of the interface
     * @throws Error
     */
    static add( instance, ifaceClass, mapFns={} ){

        // attach a new instance of the interface to the object
        //console.log( new iface());
        const ifaceInstance = new ifaceClass( instance );
        const name = ifaceInstance.constructor.name;
        instance[name] = ifaceInstance;

        // now we want that calls to the interface functions listed in mapFns are actually redirected
        //  by the implementation functions addressed in this same mapFns
        //  for the sake of this interface instance, the original function - which are overriden by
        //  the implementation - are safe to disappear
        Object.keys( mapFns ).every(( k ) => {
            if( ifaceInstance.constructor[k] ){
                //console.log( k,'is a static function' );
                ifaceInstance.constructor[k] = function(){
                    return mapFns[k].apply( instance, arguments );
                }
            } else {
                //console.log( k,'is an instance method' );
                ifaceInstance[k] = function(){
                    //console.log( name, k );
                    //console.log( ...arguments );
                    return mapFns[k].apply( instance, arguments );
                }
            }
            return true;
        });

        // register the new interface against the instance
        if( !instance.Interfaces ){
            instance.Interfaces = [];
        }
        instance.Interfaces.push( name );

        // let the interfaces be published with the class status (only once)
        /* iztiar-specific
        if( !Interface._published ){
            if( instance.IFeatureProvider && instance.IFeatureProvider.api && typeof instance.IFeatureProvider.api === 'function' ){
                const api = instance.IFeatureProvider.api();
                if( api && api.exports && typeof api.exports === 'function' ){
                    Interface._published = true;
                    const IStatus = instance.IFeatureProvider.api().exports().IStatus;
                    if( !instance.IStatus ){
                        Interface.add( instance, IStatus );
                    }
                    instance.IStatus.add( Interface._statusPart );
                }
            }
        }
        */

        return name;
    }
    /**
     *** Object.appendChain(@object, @prototype)
     *
     * Appends the first non-native prototype of a chain to a new prototype.
     * Returns @object (if it was a primitive value it will transformed into an object).
     *
     *** Object.appendChain(@object [, "@arg_name_1", "@arg_name_2", "@arg_name_3", "..."], "@function_body")
     *** Object.appendChain(@object [, "@arg_name_1, @arg_name_2, @arg_name_3, ..."], "@function_body")
     *
     * Appends the first non-native prototype of a chain to the native Function.prototype object, then appends a
     * new Function(["@arg"(s)], "@function_body") to that chain.
     * Returns the function.
     *
     *  From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
     */
    /*
    static extends(){
        Object.appendChain = function( oChain, oProto ){
            if( arguments.length < 2 ){
                throw new TypeError( 'Object.appendChain - Not enough arguments' );
            }
            if( typeof oProto !== 'object' && typeof oProto !== 'string' ){
                throw new TypeError('second argument to Object.appendChain must be an object or a string');
            }

            var oNewProto = oProto,
                oReturn = o2nd = oLast = oChain instanceof this ? oChain : new oChain.constructor( oChain );
        
            for( let o1st = this.getPrototypeOf( o2nd );
                o1st !== Object.prototype && o1st !== Function.prototype;
                o1st = this.getPrototypeOf( o2nd )){
                    o2nd = o1st;
            }
        
            if( oProto.constructor === String ){
                oNewProto = Function.prototype;
                oReturn = Function.apply( null, Array.prototype.slice.call( arguments, 1 ));
                this.setPrototypeOf(oReturn, oLast);
            }
        
            this.setPrototypeOf( o2nd, oNewProto );
            return oReturn;
        }
    }
    */

    /**
     * extends the instance to get the new defClass base class
     * @param {Object} instance the instance of the class which wants implement the interface
     * @param {Class} defClass the class definition
     * @param {*} args arguments to be passed to the constructor
     * @returns {Object} the instance updated with new class prototype
     * @throws Error
     */
     static extends( instance, defClass ){
        const args = [ ...arguments ].slice( 2 );
        //console.log( 'Interface.extends', args );
        //console.log( 'Interface.extends', arguments );

        /*
        const _base = new defClass( args );
        const _childProto = Object.getPrototypeOf( instance );
        //const _objectProto = Object.getPrototypeOf( _childProto );
        Object.setPrototypeOf( _childProto, Object.getPrototypeOf( _base ));
        */

        // set prototype
        const _base = new defClass( ...args );
        const _childProto = Object.getPrototypeOf( instance );
        Object.setPrototypeOf( _childProto, Object.getPrototypeOf( _base ));

        // set own properties
        Reflect.ownKeys( _base ).every(( p ) => {
            Object.defineProperty( instance, p, Object.getOwnPropertyDescriptor( _base, p ));
            return true;
        });

        return instance;
    }

    /**
     * tries to fill the configuration of the interface
     * This function tests for and calls a 'fillConfig()' method in the interface
     * The 'fillConfig()' method is expected to:
     * - get the full feature configuration as input
     * - fill-in its part of the configuration with the default values
     * - return a Promise which whill resolve to the interface part of the configuration.
     * @param {Object} instance the instance of the implementation class
     * @param {String} iface the interface
     * @returns {Promise} which resolves to the interface part of the configuration
     */
    /* iztiar-specific
    static fillConfig( instance, iface ){
        Msg.debug( 'Interface.fillConfig()', instance.constructor.name+':'+iface );
        let _promise = Promise.resolve( null );

        if( !( instance instanceof featureProvider )){
            Msg.verbose( 'Interface.fillConfig()', instance.constructor.name+':'+iface, 'instance is not a featureProvider' );

        } else {
            const featCard = instance.feature();
            let _conf = featCard.config();
            _promise = Promise.resolve( _conf )

            // an interface which is able to handle several configurations is expected to accept iface.name configuration groups
            const _founds = Interface._getConfigurations( _conf, iface );
            if( _founds.length === 0 ){
                Msg.verbose( 'Interface.fillConfig()', instance.constructor.name+':'+iface, 'interface is not configured' );

            } else if( !instance[iface].fillConfig && typeof instance[iface].fillConfig !== 'function' ){
                Msg.verbose( 'Interface.fillConfig()', instance.constructor.name+':'+iface, 'fillConfig is not a function' );
            
            } else if( instance[iface].filledConfig ){
                Msg.verbose( 'Interface.fillConfig()', instance.constructor.name+':'+iface, 'is already filled' );

            } else {
                _promise = _promise
                    .then(() => { return instance[iface].fillConfig( _conf, _founds ) })
                    .then(( res ) => {
                        //if( res ){
                        //    _conf[iface] = { ...res };
                        //    instance.IFeatureProvider.feature().config( _conf );
                        //}
                        instance[iface].filledConfig = true;
                        return Promise.resolve( _conf );
                    });
            }
        }
        return _promise;
    }
    */
}
