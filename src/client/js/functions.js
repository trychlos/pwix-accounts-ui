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

_namedItems = {
    dep: null,
    state: null,
    items: []
};

AccountsUI = {
    ...AccountsUI,
    ...{

        /**
         * @summary Clears the panel currently displayed by the named instance
         * @locus Client
         * @param {String} name the name of the target acUserLogin instance
         */
        clearPanel( name ){
            const instance = AccountsUI.fn.nameGet( name );
            if( instance ){
                const panel = instance.AC.panel();
                if( panel && panel !== AccountsUI.C.Panel.NONE ){
                    instance.$( '.ac-panel' ).trigger( 'ac-clear-panel' );
                }
            }
        },

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
         * @param {String} name the acUserLogin name
         * @returns {Array} the list of dropdown items to be displayed regarding the
         *  current user connection state and the acUserLogin configuration.
         *  A reactive data source.
         */
        namedDropdownItems( name ){
            if( !_namedItems.dep ){
                _namedItems.dep = new Tracker.Dependency();
                _namedItems.dep.depend();
            }
            const instance = AccountsUI.fn.nameGet( name );
            if( instance ){
                const state = AccountsUI.Connection.state();
                if( state !== _namedItems.state ){
                    _menuItemsExt.state = state;
                    _namedItems.items = AccountsUI.fn.menuItems( instance.AC.options );
                    _namedItems.dep.changed();
                }
            }
            //console.log( _dropdownItems );
            return _namedItems.items;
        }
    }
};
