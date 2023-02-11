/*
 * pwix:accounts/src/client/classes/ac_user_login_companion.class.js
 *
 * A companion class for the 'acUserLogin' Blaze template.
 */

export class acUserLoginCompanion {

    // static data
    //

    // keep here a list of all instanciated named objects
    static NamedInstances = {};

    // private data
    //

    // the acUserLogin template instance
    _instance = null;

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    // private functions
    //

    // public data
    //

    /**
     * Constructor
     * @param {acUserLogin} instance the acUserLogin Blaze template instance
     * @returns {acUserLoginCompanion}
     */
    constructor( instance ){
        const self = this;
        console.log( 'pwix:accounts instanciating acUserLoginCompanion', instance );
        self._instance = instance;

        // if the instance is named, then keep it to be usable later
        const name = self._instance.AC.options.name();
        if( name ){
            acUserLoginCompanion.NamedInstances.name = self;
        }

        return this;
    }

    /**
     * static
     * @param {String} name the searched name
     * @returns {acUserLoginCompanion} the corresponding acUserLoginCompanion instance, or null
     */
    static byName( name ){
        return acUserLoginCompanion.NamedInstances.name || null;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        const state = pwiAccounts.User.state();
        let items = null;
        switch( state ){
            case AC_LOGGED:
                items = this._instance.AC.options.loggedItemsAfter();
                break;
            case AC_UNLOGGED:
                items = this._instance.AC.options.unloggedItemsAfter();
                break;
        }
        let res = [];
        if( items ){
            if( typeof items === 'string' ){
                res.push( items );
            } else if( Array.isArray( items )){
                res = items;
            } else if( typeof items === 'function' ){
                const res_items = items();
                if( typeof res_items === 'string' ){
                    res.push( res_items );
                } else if( Array.isArray( res_items )){
                    res = res_items;
                } else {
                    console.error( '[dynItemsAfter] invalid function returned value while expecting string, array or function', res_items );
                }
            } else {
                console.error( '[dynItemsAfter] invalid value while expecting string, array or function', items );
            }
        }
        //console.log( 'dynItemsAfter', res );
        return res;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsBefore(){
        const state = pwiAccounts.User.state();
        let items = null;
        switch( state ){
            case AC_LOGGED:
                items = this._instance.AC.options.loggedItemsBefore();
                break;
            case AC_UNLOGGED:
                items = this._instance.AC.options.unloggedItemsBefore();
                break;
        }
        let res = [];
        if( items ){
            if( typeof items === 'string' ){
                res.push( items );
            } else if( Array.isArray( items )){
                res = items;
            } else if( typeof items === 'function' ){
                const res_items = items();
                if( typeof res_items === 'string' ){
                    res.push( res_items );
                } else if( Array.isArray( res_items )){
                    res = res_items;
                } else {
                    console.error( '[dynItemsBefore] invalid function returned value while expecting string, array or function', res_items );
                }
            } else {
                console.error( '[dynItemsBefore] invalid value while expecting string, array or function', items );
            }
        }
        return res;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsStandard(){
        return pwiAccounts.dropdownItems();
    }

    /**
     * Getter/Setter
     * @param {Boolean} ready whether the DOM is ready
     * @returns {Boolean}
     */
    ready( ready ){
        if( ready === true || ready === false ){
            console.log( 'DOM ready', ready );
            this._ready.set( ready );
        }
        return this._ready.get();
    }
}
