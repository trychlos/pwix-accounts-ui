/*
 * pwix:accounts-ui/src/client/classes/ac_companion.class.js
 *
 * A companion class for the 'acUserLogin' component.
 * 
 * This acCompanion class holds the configuration options of the template,
 *  acts as the requester for all displayed templates, and take care
 *  of adressing the acUserLogin Blaze template as the event handler.
 */

import _ from 'lodash';

export class acCompanion {

    // static data
    //

    // static methods
    //

    // private data
    //

    // the identifier attributed by the manager
    _managerId = null;

    // private methods
    //

    /*
     * @returns {Boolean} whether we have successfully managed the event
     */
    _handleSubmitEvent( event, data ){
        if( AccountsUI.opts().verbosity() & AC_VERBOSE_SUBMIT ){
            console.log( 'pwix:accounts-ui acCompanion handling', event.type, data );
        }
        let mail = null;
        let password = null;
        let managed = false;
        const panel = AccountsUI.Display.panel();
        switch( panel ){
            case AC_PANEL_CHANGEPWD:
                //console.debug( this );
                const pwd1 = $( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = $( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                AccountsUI.Account.changePwd( pwd1, pwd2, this._target());
                managed = true;
                break;
            case AC_PANEL_RESETASK:
                //console.log( 'element', $( '.ac-reset-ask' ));
                mail = $( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                AccountsUI.Account.resetAsk( mail, this._target());
                managed = true;
                break;
            case AC_PANEL_SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = $( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = $( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                AccountsUI.Account.loginWithPassword( mail, password, this._target());
                managed = true;
                break;
            case AC_PANEL_SIGNOUT:
                AccountsUI.Account.logout();
                managed = true;
                break;
            case AC_PANEL_SIGNUP:
                let options = {};
                if( AccountsUI.opts().haveUsername() !== AC_FIELD_NONE ){
                    options.username = $( '.ac-signup .ac-input-username .ac-input' ).val().trim();
                }
                if( AccountsUI.opts().haveEmailAddress() !== AC_FIELD_NONE ){
                    options.email = $( '.ac-signup .ac-input-email .ac-input' ).val().trim();
                }
                options.password = $( '.ac-signup .ac-newone .ac-input' ).val().trim();
                const autoClose = this.opts().signupAutoClose();
                //console.debug( 'found autoClose='+autoClose );
                const autoConnect = this.opts().signupAutoConnect();
                //console.debug( 'found autoConnect='+autoConnect );
                AccountsUI.Account.createUser( options, this._target(), autoClose, autoConnect );
                if( !autoClose ){
                    $( '.ac-signup' ).trigger( 'ac-clear' );
                }
                managed = true;
                break;
            case AC_PANEL_VERIFYASK:
                AccountsUI.Account.verifyMail( this._target());
                managed = true;
                break;
        }
        return !managed;
    }

    // returns the jQuery target relative to our acComponent
    //  because it is expected to be the target of events
    _target(){
        return AccountsUI.Manager.component( this._managerId );
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {String} managerId the identifier attributed by the acManager
     * @returns {acCompanion}
     */
    constructor( managerId ){
        const self = this;

        if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acCompanion' );
        }

        self._managerId = managerId;

        return this;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        switch( AccountsUI.Connection.state()){
            case AC_LOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().loggedItemsAfter();
            case AC_UNLOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().unloggedItemsAfter();
        }
        return [];
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsBefore(){
        switch( AccountsUI.Connection.state()){
            case AC_LOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().loggedItemsBefore();
            case AC_UNLOGGED:
                return AccountsUI.Manager.component( this._managerId ).opts().unloggedItemsBefore();
        }
        return [];
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsCore(){
        let res = [];
        switch( AccountsUI.Connection.state()){
            case AC_LOGGED:
                res = AccountsUI.Manager.component( this._managerId ).opts().loggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[ AC_LOGGED ] );
                }
                break;
            case AC_UNLOGGED:
                res = AccountsUI.Manager.component( this._managerId ).opts().unloggedItems();
                if( res === DEF_CONTENT || _.isEqual( res, [ DEF_CONTENT ] )){
                    res = _buildStandardItems( _stdMenuItems[ AC_UNLOGGED ] );
                }
                break;
        }
        return res;
    }

    /**
     * @summary A generic event handler for acUserLogin
     *  This is called by Event as an event forwarding
     *  If the provided data contains a requester, we can check that we are actually the right target
     *  If the provided data contains a panel, we have to ask for the display of this panel
     *  Else...
     * @param {String} event the event type
     * @param {Object} data the associated data
     *  data.requester: acComponent identifier
     *  data.panel
     * @returns {Boolean} whether we have successfully managed this event
     *  This returned value may be used by the caller to allow - or not - the event propagation...
     */
    handleEvent( event, data ){
        let managed = false;
        switch( event.type ){
            // message sent by dropdown items (ac_menu_items)
            //  data is { requester, panel }
            case 'ac-panel-changepwd-event':
            case 'ac-panel-resetask-event':
            case 'ac-panel-signin-event':
            case 'ac-panel-signout-event':
            case 'ac-panel-signup-event':
            case 'ac-panel-verifyask-event':
                if( !data || !data.requester ){
                    console.error( 'requester expected, but found empty' );
                } else {
                    component = AccountsUI.Manager.component( data.requester );
                    if( component ){
                        if( component._managerId !== this._managerId ){
                            console.error( 'cowardly refusing to handle an event for someone else', data, this );
                        } else if( !data.panel ){
                            console.error( 'panel expected, but found empty' );
                        } else {
                            if( AccountsUI.opts().verbosity() & AC_VERBOSE_PANEL ){
                                console.log( 'pwix:accounts-ui acCompanion handling', event.type, data );
                            }
                            managed = AccountsUI.Display.ask( data.panel, data.requester );
                        }
                    } else {
                        console.error( 'unable to get acComponent with requester', requester );
                    }
                }
                break;

            // message sent from ac_footer
            //  no data is expected
            case 'ac-submit':
                managed = this._handleSubmitEvent( event, data );
                break;
        }
        return !managed;
    }
}
