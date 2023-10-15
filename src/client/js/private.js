/*
 * pwix:accounts-ui/src/client/js/private.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

// menuItems() dependency tracker
_menuItems = {
    dep: null,
    state: null,
    items: []
};

// keep here a list of all instanciated named acUserLogin objects
_named = {};

// error message
//  defined here to be useable even in resetpwd modal
_errorMsg = new ReactiveVar( null );

AccountsUI.fn = {

    /*
     * Getter/Setter
     * Panels have their own error messages (e.g. password too short or too weak).
     * This method is provided to host error messages returned from the server (e.g. bad credentials).
     * @param {String} msg error msg
     * @returns {String} the current error message
     * A reactive data source
     */
    errorMsg( msg ){
        if( msg !== undefined ){
            _errorMsg.set( msg );
        }
        return _errorMsg.get();
    },

    /*
     * @locus Client
     * @param {acCompanionOptions} opts the configuration options passed to acUserLogin
     * @returns {Array} the list of dropdown items to be displayed regarding the
     *  current user connection state.
     *  A reactive data source.
     */
    menuItems( opts ){
        if( !_menuItems.dep ){
            _menuItems.dep = new Tracker.Dependency();
            _menuItems.dep.depend();
        }
        const currentUser = opts.currentUser();
        if( currentUser ){
            const state = AccountsUI.Connection.state();
            if( state !== _menuItems.state ){
                _menuItems.state = state;
                //_menuItems.items = _menuItemsBefore( opts ).concat( );
                const _before = AccountsUI.fn.menuItemsBefore( opts, state );
                const _core = _before.concat( AccountsUI.fn.menuItemsCore( opts, state ));
                _menuItems.items = _core.concat( AccountsUI.fn.menuItemsAfter( opts, state ));
                _menuItems.dep.changed();
            }
        }
        //console.log( _dropdownItems );
        return _menuItems.items;
    },

    /*
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    menuItemsAfter( opts, state ){
        switch( state ){
            case AccountsUI.C.Connection.LOGGED:
                return opts.loggedItemsAfter();
            case AccountsUI.C.Connection.UNLOGGED:
                return opts.unloggedItemsAfter();
        }
        return [];
    },

    /*
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    menuItemsBefore( opts, state ){
        switch( state ){
            case AccountsUI.C.Connection.LOGGED:
                return opts.loggedItemsBefore();
            case AccountsUI.C.Connection.UNLOGGED:
                return opts.unloggedItemsBefore();
        }
        return [];
    },

    /*
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    menuItemsCore( opts, state ){
        let res = [];
        switch( state ){
            case AccountsUI.C.Connection.LOGGED:
                res = opts.loggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[state] );
                }
                break;
            case AccountsUI.C.Connection.UNLOGGED:
                res = opts.unloggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[state] );
                }
                break;
        }
        return res;
    },

    /*
     * @param {String} name the searched name
     * @returns {TemplateInstance} the corresponding acUserLogin instance, or null
     */
    nameGet( name ){
        return this._named[name] || null;
    },

    /*
     * @summary Name an instance
     * @param {String} name the name to be attributed
     * @param {TemplateInstance} instance the acUserLogin instance
     */
    nameAdd( name, instance ){
        _named[name] = instance;
    },

    /*
     * @summary Remove a named instance
     * @param {String} name the name to be attributed
     */
    nameRemove( name ){
        if( name ){
            delete _named[name];
        }
    }
};
