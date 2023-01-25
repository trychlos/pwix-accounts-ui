/*
 * pwix:accounts/src/client/js/functions.js
 */

import { Tracker } from 'meteor/tracker';

_dropdownItems = {
    dep: null,
    state: null,
    items: []
};

pwiAccounts = {
    ...pwiAccounts,
    ...{
        /**
         * @returns {Array} the list of dropdown items to be displayed regarding the
         *  current user connection state.
         *  NB: we only return here the list of standard dropdown items as we cannot manage
         *  any acUserLogin configuration at this global level.
         *  A reactive data source.
         */
        dropdownItems(){
            if( !_dropdownItems.dep ){
                _dropdownItems.dep = new Tracker.Dependency();
                _dropdownItems.dep.depend();
            }
            const state = pwiAccounts.User.state();
            if( state !== _dropdownItems.state ){
                _dropdownItems.state = state;
                _dropdownItems.items = _buildStandardItems( _stdMenuItems[pwiAccounts.User.state()]); //_getMenuItems();
                _dropdownItems.dep.changed();
            }
            //console.log( _dropdownItems );
            return _dropdownItems.items;
        }
    }
};
