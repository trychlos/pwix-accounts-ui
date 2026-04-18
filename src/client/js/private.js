/*
 * pwix:accounts-ui/src/client/js/private.js
 */

import _ from 'lodash';

import { Logger } from 'meteor/pwix:logger';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

const logger = Logger.get();

// keep here a list of all instanciated named acUserLogin objects
_named = {};

AccountsUI.fn = {

    /*
     * @summary Manage menu items callbacks
     *  The array is incremented from AccountsUI.onRebuildMenuItems() public API
     *  Is called each time the menu is rebuilt
     * 
     * @param {Array} the current dropdown items array
     * @param {acCompanionOption} opts the current acUserLogin options
     * 
     * @returns {Array} the new dropdown items array
     */
    _rebuildMenuItemsFns: [],

    async _rebuildMenuItems( items, opts ){
        for( const fn of AccountsUI.fn._rebuildMenuItemsFns ){
            items = await fn( items, opts );
        }
        return items;
    },

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

    // the error message internally used - not used when acUserLogin is defined to be used with an external messager
    //  defined here to be useable even in reset_pwd modal (which doesn't depend of acUserLogin)
    _errorMsg: new ReactiveVar( null ),

    async errorMsg( msg, opts={} ){
        //logger.warning( 'msg', msg, 'checker', opts.dataContext?.checker?.get() );
        if( opts.dataContext && AccountsUI.fn.hasExternalMessager( opts.dataContext )){
            const checker = opts.dataContext.checker.get();
            if( checker ){
                if( msg ){
                    await checker.messagerPush( new Package['pwix:typed-message'].TM.TypedMessage({
                        level: Package['pwix:typed-message'].TM.MessageLevel.C.ERROR,
                        message: msg
                    }));
                } else {
                    await checker.messagerClearMine();
                }
            }
        } else {
            AccountsUI.fn._errorMsg.set( msg );
        }
        return AccountsUI.fn._errorMsg.get();
    },

    /*
     * Getter
     * Panels have their own error messages (e.g. password too short or too weak).
     * @returns {ReactiveVar} which contains the current error message
     */
    errorMsgRv(){
        return AccountsUI.fn._errorMsg;
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
    _menuItems: null,

    _resetMenuItems(){
        // first make sure we erase the previous content
        AccountsUI.fn._menuItems = null;
        // only then re-instanciate
        AccountsUI.fn._menuItems = {
            dep: new Tracker.Dependency(),
            status: null,
            items: []
        }
    },

    async menuItems( opts ){
        if( !AccountsUI.fn._menuItems ){
            AccountsUI.fn._resetMenuItems();
        }
        // depend
        AccountsUI.fn._menuItems.dep.depend();
        // do we have changed something ?
        const status = AccountsUI.Connection.stringify();
        // if yes, rebuild
        if( status !== AccountsUI.fn._menuItems.status ){
            AccountsUI.fn._menuItems.status = status;
            const _before = AccountsUI.fn.menuItemsBefore( opts );
            const _core = _before.concat( AccountsUI.fn.menuItemsCore( opts ));
            AccountsUI.fn._menuItems.items = _core.concat( AccountsUI.fn.menuItemsAfter( opts ));
            AccountsUI.fn._menuItems.items = await AccountsUI.fn._rebuildMenuItems( AccountsUI.fn._menuItems.items, opts );
            AccountsUI.fn._menuItems.dep.changed();
        }
        return AccountsUI.fn._menuItems.items;
    },

    /*
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    menuItemsAfter( opts ){
        const state = AccountsUI.Connection.state();
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
    menuItemsBefore( opts ){
        const state = AccountsUI.Connection.state();
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
    menuItemsCore( opts ){
        let res = [];
        const state = AccountsUI.Connection.state();
        const unverified = AccountsUI.Connection.unverifiedCount();
        switch( state ){
            case AccountsUI.C.Connection.LOGGED:
                res = opts.loggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[state], unverified );
                }
                break;
            case AccountsUI.C.Connection.UNLOGGED:
                res = opts.unloggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[state], unverified );
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

// on evaluation time, do not keep any previous state
AccountsUI.fn._resetMenuItems();
