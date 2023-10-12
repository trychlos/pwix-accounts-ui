/*
 * pwix:accounts-ui/src/client/js/functions.js
 */

import _ from 'lodash';

import { Tracker } from 'meteor/tracker';

_dropdownItems = {
    dep: null,
    state: null,
    items: []
};

_dropdownItemsExt = {
    dep: null,
    state: null,
    items: []
};

_menuItemsExt = {
    dep: null,
    state: null,
    items: []
};

/*
 * @returns {Array} an array of items as the <li>...</li> inner HTML strings
 */
const _menuItemsAfter = function( opts, state ){
    switch( state ){
        case AccountsUI.C.Connection.LOGGED:
            return opts.loggedItemsAfter();
        case AccountsUI.C.Connection.UNLOGGED:
            return opts.unloggedItemsAfter();
    }
    return [];
}

/*
 * @returns {Array} an array of items as the <li>...</li> inner HTML strings
 */
const _menuItemsBefore = function( opts, state ){
    switch( state ){
        case AccountsUI.C.Connection.LOGGED:
            return opts.loggedItemsBefore();
        case AccountsUI.C.Connection.UNLOGGED:
            return opts.unloggedItemsBefore();
    }
    return [];
}

/*
 * @returns {Array} an array of items as the <li>...</li> inner HTML strings
 */
const _menuItemsCore = function( opts, state ){
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
}

AccountsUI = {
    ...AccountsUI,
    ...{
        /**
         * @locus Client
         * @returns {Array} the list of dropdown items to be displayed regarding the
         *  current user connection state, as an array of '<a>...</a>' strings
         *  NB: we only return here the list of standard dropdown items as we cannot manage
         *  any acUserLogin configuration at this global level.
         *  A reactive data source.
         */
        dropdownItems(){
            if( !_dropdownItems.dep ){
                _dropdownItems.dep = new Tracker.Dependency();
                _dropdownItems.dep.depend();
            }
            const state = AccountsUI.Connection.state();
            if( state !== _dropdownItems.state ){
                _dropdownItems.state = state;
                _dropdownItems.items = _buildStandardItems( AccountsUI.dropdownItemsExt());
                _dropdownItems.dep.changed();
            }
            //console.log( _dropdownItems );
            return _dropdownItems.items;
        },

        /**
         * @locus Client
         * @returns {Array} the list of dropdown items to be displayed regarding the
         *  current user connection state.
         *  NB: we only return here the list of standard dropdown items as we cannot manage
         *  any acUserLogin configuration at this global level.
         *  A reactive data source.
         */
        dropdownItemsExt(){
            if( !_dropdownItemsExt.dep ){
                _dropdownItemsExt.dep = new Tracker.Dependency();
                _dropdownItemsExt.dep.depend();
            }
            const state = AccountsUI.Connection.state();
            if( state !== _dropdownItemsExt.state ){
                _dropdownItemsExt.state = state;
                _dropdownItemsExt.items = _stdMenuItems[state];
                _dropdownItemsExt.dep.changed();
            }
            //console.log( _dropdownItems );
            return _dropdownItemsExt.items;
        },

        /**
         * @locus Client
         * @param {acCompanionOptions} opts the configuration options passed to acUserLogin
         * @returns {Array} the list of dropdown items to be displayed regarding the
         *  current user connection state.
         *  A reactive data source.
         */
        menuItems( opts ){
            if( !_menuItemsExt.dep ){
                _menuItemsExt.dep = new Tracker.Dependency();
                _menuItemsExt.dep.depend();
            }
            const currentUser = opts.currentUser();
            if( currentUser ){
                const state = AccountsUI.Connection.state();
                if( state !== _menuItemsExt.state ){
                    _menuItemsExt.state = state;
                    //_menuItemsExt.items = _menuItemsBefore( opts ).concat( );
                    const _before = _menuItemsBefore( opts, state );
                    const _core = _before.concat( _menuItemsCore( opts, state ));
                    _menuItemsExt.items = _core.concat( _menuItemsAfter( opts, state ));
                    _menuItemsExt.dep.changed();
                }
            }
            //console.log( _dropdownItems );
            return _menuItemsExt.items;
        }
    }
};
