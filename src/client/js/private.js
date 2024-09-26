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
//  defined here to be useable even in reset_pwd modal
_errorMsg = new ReactiveVar( null );

AccountsUI.fn = {

    /*
     * Getter/Setter
     * Panels have their own error messages (e.g. password too short or too weak).
     * This method is provided to host error messages returned from the server (e.g. bad credentials).
     * @param {String} msg error msg
     * @param {Object} opts an optional options object with following keys:
     *  - dataContext: the caller data context
     * @returns {String} the current error message
     * A reactive data source
     */
    errorMsg( msg, opts={} ){
        if( msg !== undefined ){
            if( opts.dataContext && AccountsUI.fn.hasExternalMessager( opts.dataContext )){
                const checker = opts.dataContext.checker.get();
                if( checker ){
                    if( msg ){
                        checker.messagerPush( new Package['pwix:typed-message'].TM.TypedMessage({
                            level: Package['pwix:typed-message'].TM.MessageLevel.C.ERROR,
                            message: msg
                        }));
                    } else {
                        checker.messagerClearMine();
                    }
                }
            } else {
                _errorMsg.set( msg );
            }
        }
        return _errorMsg.get();
    },

    /*
     * Getter
     * Panels have their own error messages (e.g. password too short or too weak).
     * @returns {ReactiveVar} which contains the current error message
     */
    errorMsgRv(){
        return _errorMsg;
    },

    /*
     * @summary While panels generally want an error area to display their (warning/error) messages to the user,
     *  it is possible that the caller rather want use an external Forms.Checker associated with a Forms.Messager
     *  Check that all conditions are met.
     * @param {Object} dc the caller data context
     * @returns {Boolean} whether we accept to display a local error area in the requesting panel
     */
    hasErrorArea( dc ){
        return !AccountsUI.fn.hasExternalMessager( dc );
    },

    /*
     * @summary While panels generally want an error area to display their (warning/error) messages to the user,
     *  it is possible that the caller rather want use an external Forms.Checker associated with a Forms.Messager
     *  Check that all conditions are met.
     * @param {Object} dc the caller data context
     * @returns {Boolean} whether we can use an external messager
     */
    hasExternalMessager( dc={} ){
        return Boolean(
            dc.withExternalMessager === true &&
            Package['pwix:forms'] &&
            Package['pwix:typed-message'] &&
            dc.checker &&
            dc.checker instanceof ReactiveVar
        );
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
        const state = AccountsUI.Connection.state();
        if( state !== _menuItems.state ){
            _menuItems.state = state;
            //_menuItems.items = _menuItemsBefore( opts ).concat( );
            const _before = AccountsUI.fn.menuItemsBefore( opts, state );
            const _core = _before.concat( AccountsUI.fn.menuItemsCore( opts, state ));
            _menuItems.items = _core.concat( AccountsUI.fn.menuItemsAfter( opts, state ));
            _menuItems.dep.changed();
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
        return name ? _named[name] || null : null;
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
