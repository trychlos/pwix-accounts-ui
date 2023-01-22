/*
 * pwi:accounts/src/client/js/functions.js
 */

import { Tracker } from 'meteor/tracker';

import { pwiI18n } from 'meteor/pwi:i18n';

import { acPanel } from '../classes/ac_panel.class.js';
import { acUser } from '../classes/ac_user.class.js';


// if not already done, instanciates 'acUser' and 'acPanel' singletons
/*
if( !pwiAccounts.client.User ){
    pwiAccounts.client.User = new acUser();
}
if( !pwiAccounts.client.Panel ){
    pwiAccounts.client.Panel = new acPanel( pwiAccounts.client.User.state());
}

// export some constants
if( !pwiAccounts.c ){
    pwiAccounts.c = {
        LOGGED: AC_LOGGED,
        UNLOGGED: AC_UNLOGGED
    };
}
*/

pwiAccounts.client.fn = {

    // validate an inputed mail address
    validateEmail( email ){
        if( email && email.trim().length > 0 && email.includes( '@' )){
            const words = email.split( '@', 2 );
            return words[1].includes( '.' );
        }
        return false;
    },

    // validate an inputed password
    validatePassword( passwd ){
        return passwd && passwd.trim().length >= pwiAccounts.conf.password.min_length;
    }
};

/**
 * @returns {Array} the list of standard dropdown items to be displayed regarding the
 *  current user connection state.
 *  Each item of the returned array is an object with keys:
 *  - used for HTML rendering
 *      + aclass: the class to add to the <a> element to qualify it
 *      + faicon: the icon to be displayed besides of the item
 *      + labelkey: the key of the label in pwiAccounts.strings[]['features']
 *      + enablefn: a function which returns a boolean to enable an item
 *  - which define the action to be taken on item activation
 *      + panel: the panel to be displayed at item activation
 *        the function pwiAccounts.client.Panel.asked() may be called with this argument
 *      + msgaction: the message to be triggered for simulating the item activation
 *        under the hood, the message handler just calls pwiAccounts.client.Panel.asked() with the corresponding argument.
 *  Also, please note that pwiAccounts.dropdownItems() is a reactive data source.
 */
_dropdownItems = {
    dep: null,
    state: null,
    items: []
};
pwiAccounts.dropdownItems = function(){
    if( !_dropdownItems.dep ){
        _dropdownItems.dep = new Tracker.Dependency();
        _dropdownItems.dep.depend();
    }
    const state = pwiAccounts.client.User.state();
    if( state !== _dropdownItems.state ){
        _dropdownItems.state = state;
        switch( state ){
            case AC_LOGGED:
                _dropdownItems.items = [ ...pwiAccounts.client.features.LOGGED ];
                break;
            case AC_UNLOGGED:
                _dropdownItems.items = [ ...pwiAccounts.client.features.UNLOGGED ];
                break;
        }
        _dropdownItems.dep.changed();
    }
    //console.log( _dropdownItems );
    return _dropdownItems.items;
};
