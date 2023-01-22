/*
 * pwi:accounts/src/client/js/functions.js
 */

import { Tracker } from 'meteor/tracker';

import { pwiI18n } from 'meteor/pwi:i18n';

import { acPanel } from '../classes/ac_panel.class.js';
import { acUser } from '../classes/ac_user.class.js';


// if not already done, instanciates 'acUser' and 'acPanel' singletons
if( !pwiAccounts.user ){
    pwiAccounts.user = new acUser();
}
if( !pwiAccounts.panel ){
    pwiAccounts.panel = new acPanel( pwiAccounts.user.state());
}

// export some constants
if( !pwiAccounts.c ){
    pwiAccounts.c = {
        LOGGED: acUser.s.LOGGED,
        UNLOGGED: acUser.s.UNLOGGED
    };
}

function enableAlways(){
    return true;
}
function enableMailVerified(){
    return !pwiAccounts.user.mailVerified()
}

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
 *        the function pwiAccounts.panel.asked() may be called with this argument
 *      + msgaction: the message to be triggered for simulating the item activation
 *        under the hood, the message handler just calls pwiAccounts.panel.asked() with the corresponding argument.
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
    const state = pwiAccounts.user.state();
    if( state !== _dropdownItems.state ){
        _dropdownItems.state = state;
        switch( state ){
            case acUser.s.LOGGED:
                _dropdownItems.items = [ ...pwiAccounts.client.features.LOGGED ];
                break;
            case acUser.s.UNLOGGED:
                _dropdownItems.items = [ ...pwiAccounts.client.features.UNLOGGED ];
                break;
        }
        _dropdownItems.dep.changed();
    }
    //console.log( _dropdownItems );
    return _dropdownItems.items;
};

pwiAccounts.client = {
    ...pwiAccounts.client,
    ...{
        /**
         * @param {Boolean} runtime whether to return only the default value, or the runtime one
         * @returns {Array} the standard items displayed when a user is logged-in as HTML code
         */
        loggedItems: function( runtime=true ){
            const source = runtime ? pwiAccounts.conf.loggedItems : stdMenuItems.AC_LOGGED;
            let result = [];
            if( typeof source === 'function' ){
                result = source();
            } else {
                source.every(( it ) => {
                    let html = '<a class="dropdown-item d-flex align-items-center justify-content-start ac-dropdown-item '+it.aclass;
                    if( it.enablefn && !it.enablefn()){
                        html += ' disabled';
                    }
                    html += '" href="#" data-ac-msg="'+it.msgaction+'"';
                    html += '>';
                    html += '<span class="fa-solid fa-fw '+it.faicon+'"></span>';
                    html += '<p>'+pwiI18n.label( pwiAccounts.strings, 'features', it.labelkey )+'</p>';
                    html += '</a>'
                    res.push( html );
                    return true;
                });
            }
        },
        /**
         * @param {Boolean} runtime whether to return only the default value, or the runtime one
         * @returns {Array} the standard items displayed when no user is logged-in, as HTML code
         */
        unloggedItems: function( runtime=true ){
            const source = runtime ? pwiAccounts.conf.unloggedItems : stdMenuItems.AC_UNLOGGED;
            let result = [];
            if( typeof source === 'function' ){
                result = source();
            } else {
                source.every(( it ) => {
                    let html = '<a class="dropdown-item d-flex align-items-center justify-content-start ac-dropdown-item '+it.aclass;
                    if( it.enablefn && !it.enablefn()){
                        html += ' disabled';
                    }
                    html += '" href="#" data-ac-msg="'+it.msgaction+'"';
                    html += '>';
                    html += '<span class="fa-solid fa-fw '+it.faicon+'"></span>';
                    html += '<p>'+pwiI18n.label( pwiAccounts.strings, 'features', it.labelkey )+'</p>';
                    html += '</a>'
                    res.push( html );
                    return true;
                });
            }
        }
    }
}