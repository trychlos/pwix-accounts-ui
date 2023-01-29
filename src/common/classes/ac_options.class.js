/*
 * pwix:accounts/src/common/classes/ac_options.class.js
 *
 * This class manages the configuration options.
 * It is expected to be derived by each consumer, i.e. global configuration and acUserLogin configuration.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

export class acOptions {

    // static data
    //

    // private data
    //

    // configuration options as an object which contains one ReactiveVar for each key
    _conf = {};

    // private functions
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {Object} options the options to be managed (may be empty, but must be defined)
     * @returns {acOptions}
     */
    constructor( options ){
        const self = this;

        // allocate a new reactive var for each known option and set it
        Object.keys( options ).every(( name ) => {
            if( typeof self[name] === 'function' ){
                self._conf[name] = {
                    value: new ReactiveVar(),
                    options: null
                };
                self[name]( options[name] );
            } else {
                console.error( self.constructor.name, 'unmanaged configuration option', name );
            }
            return true;
        });

        return this;
    }

    /**
     * @summary Get or set a configuration option as a boolean or a function
     * @param {String} name 
     * @param {Boolean|Function} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     * @returns {Boolean}
     *  if the returned/computed value is not valid according to the check function, then we return the default value
     *  which may happen to be undefined :(
     */
    getset_Bool_Fn( name, value, opts={} ){
        if( value !== undefined ){
            if( value === true || value === false || typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
            this._conf[name].options = opts;
        }
        let result = this._conf[name].value.get();
        if( typeof result === 'function' ){
            result = result();
        }
        if( result !== true || result !== false
            || ( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result ))){

                let _default = this._conf[name].options.default;
                if( typeof _default === 'function' ){
                    _default = _default();
                }
                result = _default;
        }
        return result;
    }

    /**
     * @summary Get or set a configuration option as an integer or a function
     * @param {String} name 
     * @param {Integer|Function} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     * @returns {Integer}
     *  if the returned/computed value is not valid according to the check function, then we return the default value
     *  which may happen to be undefined :(
     */
    getset_Integer_Fn( name, value, opts={} ){
        if( value !== undefined ){
            if( typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else {
                this._conf[name].value.set( parseInt( value ));
            }
            this._conf[name].options = opts;
        }
        let result = this._conf[name].value.get();
        if( typeof result === 'function' ){
            result = result();
        }
        if( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result )){
            let _default = this._conf[name].options.default;
            if( typeof _default === 'function' ){
                _default = _default();
            }
            result = _default;
        }
        return result;
    }

    /**
     * @summary Get or set a configuration option as a string or a function
     *  Also accepts an object with 'i8n' key
     * @param {String} name 
     * @param {String|Function|Object} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     *  ref: an optional array which contains accepted values
     * @returns {String}
     *  if the returned/computed value is not valid according to the check function or the reference array,
     *  then we return the default value - or at least an empty string
     */
    getset_String_Fn_Object( name, value, opts={} ){
        if( value !== undefined ){
            if( typeof value === 'string' || typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else if( typeof value === 'object' && Object.keys( value ).includes( 'i18n' )){
                this._conf[name].value.set( i18n.label( AC_I18N, value.i18n ));
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
            this._conf[name].options = opts;
        }
        let result = this._conf[name].value.get();
        if( typeof result === 'function' ){
            result = result();
        }
        if(( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result ))
            || ( this._conf[name].options.ref && Array.isArray( this._conf[name].options.ref ) && !this._conf[name].options.ref.includes( result ))){

                let _default = this._conf[name].options.default;
                if( typeof _default === 'function' ){
                    _default = _default();
                }
                result = _default;
        }
        return result || '';
    }

    /**
     * @summary Get or set a configuration option as a string, an array or a function
     * @param {String} name 
     * @param {String|Array|Function} value 
     * @param {Object} opts
     *  check: an optional check function, called with the value, must return true or false
     *  default: an optional default value, or a function which returns a default value
     * @returns {Array} an array of strings
     */
    getset_String_Array_Fn( name, value, opts={} ){
        if( value !== undefined ){
            if( typeof value === 'string' || Array.isArray( value ) || typeof value === 'function' ){
                this._conf[name].value.set( value );
            } else {
                console.error( name, 'invalid argument:', value, opts );
            }
            this._conf[name].options = opts;
        }
        if( this._conf[name].options.check && typeof this._conf[name].options.check === 'function' && !this._conf[name].options.check( result )){
            let _default = this._conf[name].options.default;
            if( typeof _default === 'function' ){
                _default = _default();
            }
            result = _default;
        }
        result = result || '';
        if( !Array.isArray( result )){
            result = [result];
        }
        return result;
    }
}
