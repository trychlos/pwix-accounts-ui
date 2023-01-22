/*
 * /src/client/classes/ac_dialog.class.js
 *
 * This class manages the display of all login/logout dialogs.
 * The instance is first attached to the 'acUserLogin' template, and then passed to every child template.
 * 
 * As of 23.01, acDialog class may use either the Bootstrap or the jQuery UI version of their modal dialog widget.
 * This is needed because the Bootstrap version doesn't support to be embedded in a 'position:fixed' parent
 *  which be unfortunately the case when the application header is sticky.
 */
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import { v4 as uuidv4 } from 'uuid';

import { pwiI18n } from 'meteor/pwi:i18n';

import '../../common/js/index.js';

import { acPanel } from './ac_panel.class.js';
import { acUser } from './ac_user.class.js';

export class acDialog {

    // static data
    //

    // when an instance asks to have a 'singlePanel', i.e. wants reserve the display, we put this static to true
    //  so that each instance may know that someone wants the display for itself
    //  as a consequence, an instance is allowed to display its panels if SinglePanelReqs() is empty || singlePanel()=true
    static SinglePanelReqs = [];

    // keep here a list of all instanciated acDialog objects
    static Dialogs = {};

    // private data
    //

    // the 'acUserLogin' template instance
    _instance = null;
    _name = new ReactiveVar( null );

    // a UUID which identifies *this* acDialog instance
    //  mainly used for debugging purposes
    _uuid = null;

    // the jQuery selector for the modal
    //  the corresponding method has some suitable defaut values, depending of whether we are using
    //  Bootstrap of jQueryUI dialogs
    //  it is changed as soon as the acDialog is initialized with the generated uuid for this acDialog
    _modalSelector = '';

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    // the configuration options
    _renderMode = new ReactiveVar( acDialog.r.MODAL );

    _loggedButtonShown = new ReactiveVar( true );
    _loggedButtonClass = new ReactiveVar( 'dropdown-toggle' );
    _loggedButtonContent = new ReactiveVar(() => {
        return( '<p>'+pwiAccounts.user.mailAddress()+'</p>' );
    });
    _loggedButtonAction = new ReactiveVar( acDialog.a.DROPDOWN );
    _loggedItemsAfter = new ReactiveVar( null );
    _loggedItemsBefore = new ReactiveVar( null );

    _unloggedButtonShown = new ReactiveVar( true );
    _unloggedButtonClass = new ReactiveVar( 'ac-py045' );
    _unloggedButtonContent = new ReactiveVar( '<span class="fa-regular fa-fw fa-user"></span>' );
    _unloggedButtonAction = new ReactiveVar( acDialog.a.DROPDOWN );
    _unloggedItemsAfter = new ReactiveVar( null );
    _unloggedItemsBefore = new ReactiveVar( null );

    _errorMsg = new ReactiveVar( '' );
    _modalTitle = new ReactiveVar( '' );
    _showPanels = new ReactiveVar( true );

    _changepwdTextAfter = new ReactiveVar( '' );
    _changepwdTextBefore = new ReactiveVar( '' );

    _resetLink = new ReactiveVar( true );
    _resetpwdTextAfter = new ReactiveVar( '' );
    _resetpwdTextBefore = new ReactiveVar( '' );

    _signinLink = new ReactiveVar( true );
    _signinTextAfter = new ReactiveVar( '' );
    _signinTextBefore = new ReactiveVar( '' );

    _signoutTextBefore = new ReactiveVar( '' );

    _signupAutoConnect = new ReactiveVar( true );
    _signupLink = new ReactiveVar( true );
    _signupTextAfter = new ReactiveVar( '' );
    _signupTextBefore = new ReactiveVar( '' );

    _verifyTextBefore = new ReactiveVar( '' );

    // used to toggle the hide/show display
    _shown = new ReactiveVar( false );

    // whether the user can click outside the modal to close it
    _staticBackdrop = new ReactiveVar( false );

    // the initial panel to be displayed
    _initialPanel = new ReactiveVar( acPanel.c.NONE );
    _singlePanel = new ReactiveVar( false );

    // private functions

    // public data

    // the title of the modal dialogs is configured here
    //  buttons are configured in 'ac_modal_buttons' component
    static c = {
        CHANGEPWD: {
            modal_title: {
                group: 'change_pwd',
                key: 'modal_title'
            }
        },
        RESETASK: {
            modal_title: {
                group: 'reset_ask',
                key: 'modal_title'
            }
        },
        SIGNIN: {
            modal_title: {
                group: 'signin',
                key: 'modal_title'
            }
        },
        SIGNOUT: {
            modal_title: {
                group: 'signout',
                key: 'modal_title'
            }
        },
        SIGNUP: {
            modal_title: {
                group: 'signup',
                key: 'modal_title'
            }
        },
        VERIFYASK: {
            modal_title: {
                group: 'verify_ask',
                key: 'modal_title'
            }
        }
    }

    // render modes
    static r = {
        DIV: 'DIV',
        MODAL: 'MODAL',
        NONE: 'NONE'
    };

    // button actions
    static a = {
        DROPDOWN: 'dropdown',
        MODAL: 'modal',
        NONE: 'none',
        ROUTE: 'route'
    };

    /**
     * Constructor
     * @param {Object} instance an 'acUserLogin' template instance
     * @param {Object} opts the parameters passed to the initial 'acUserLogin' template:
     * @returns {acDialog}
     */
    constructor( instance, opts={} ){
        const self = this;

        this._uuid = uuidv4();
        this._instance = instance;

        console.log( 'pwi:accounts instanciating acDialog', opts, 'uuid', this._uuid );

        this.name( opts.name );
        this.renderMode( opts.renderMode );
        this.staticBackdrop( opts.staticBackdrop );
        this.initialPanel( opts.initialPanel );
        this.showPanels( opts.showPanels );
        this.singlePanel( opts.singlePanel );
        if( this.singlePanel()){
            acDialog.SinglePanelReqs.push( this.uuid());
        }

        this.loggedButtonShown( opts.loggedButtonShown );
        this.loggedButtonClass( opts.loggedButtonClass );
        this.loggedButtonContent( opts.loggedButtonContent );
        this.loggedButtonAction( opts.loggedButtonAction );
        this.loggedItemsBefore( opts.loggedItemsBefore || null );
        this.loggedItemsAfter( opts.loggedItemsAfter || null );

        this.unloggedButtonShown( opts.loggedButtonShown );
        this.unloggedButtonClass( opts.unloggedButtonClass );
        this.unloggedButtonContent( opts.unloggedButtonContent );
        this.unloggedButtonAction( opts.unloggedButtonAction );
        this.unloggedItemsBefore( opts.unloggedItemsBefore || null );
        this.unloggedItemsAfter( opts.unloggedItemsAfter || null );

        function f_setDescription( optName, confTmpl, confGroup ){
            if( Object.keys( opts ).includes( optName )){
                return opts[optName];
            } else if( Object.keys( pwiAccounts.conf ).includes( confTmpl ) && Object.keys( pwiAccounts.conf[confTmpl] ).includes( confGroup )){
                if( typeof pwiAccounts.conf[confTmpl][confGroup] === 'string' ){
                    return pwiAccounts.conf[confTmpl][confGroup];
                } else {
                    const obj = pwiAccounts.conf[confTmpl][confGroup];
                    return pwiI18n.label( pwiAccounts.strings, obj.group, obj.key );
                }
            }
            return '';
        }

        this.changePwdTextAfter( f_setDescription( 'changePwdTextAfter', 'change_pwd', 'textAfter' ));
        this.changePwdTextBefore( f_setDescription( 'changePwdTextBefore', 'change_pwd', 'textBefore' ));

        this.resetLink( opts.resetLink );
        this.resetPwdTextAfter( f_setDescription( 'resetPwdTextAfter', 'reset_ask', 'textAfter' ));
        this.resetPwdTextBefore( f_setDescription( 'resetPwdTextBefore', 'reset_ask', 'textBefore' ));

        this.signinLink( opts.signinLink );
        this.signinTextAfter( f_setDescription( 'signinTextAfter', 'signin', 'textAfter' ));
        this.signinTextBefore( f_setDescription( 'signinTextBefore', 'signin', 'textBefore' ));

        this.signoutTextBefore( f_setDescription( 'signoutTextBefore', 'signout', 'textBefore' ));

        this.signupAutoConnect( opts.signupAutoConnect );
        this.signupLink( opts.signupLink );
        this.signupTextAfter( f_setDescription( 'signupTextAfter', 'signup', 'textAfter' ));
        this.signupTextBefore( f_setDescription( 'signupTextBefore', 'signup', 'textBefore' ));

        this.verifyAskTextBefore( f_setDescription( 'verifyAskTextBefore', 'verify_ask', 'textBefore' ));

        pwiAccounts.panel.asked( this.initialPanel());

        // manage the panel transition
        // show/hide the dialog depending of the currently requested template and the options of this dialog
        Tracker.autorun(() => {
            if( self.ready()){
                let show = false;
                const panel = pwiAccounts.panel.asked();
                const prev = pwiAccounts.panel.previous();
                switch( panel ){
                    case acPanel.c.NONE:
                        if( self.singlePanel() && prev && prev !== acPanel.c.NONE ){
                            // transition to NONE ends up with singlePanel feature
                            //self.renderMode( acDialog.r.NONE );
                            const idx = acDialog.SinglePanelReqs.indexOf( self.uuid());
                            if( idx > -1 ){
                                acDialog.SinglePanelReqs.splice( idx, 1 );
                            }
                        }
                        break;
                    case acPanel.c.SIGNIN:
                    case acPanel.c.SIGNUP:
                    case acPanel.c.RESETASK:
                    case acPanel.c.SIGNOUT:
                    case acPanel.c.CHANGEPWD:
                    case acPanel.c.VERIFYASK:
                        // to be displayed, must allow panels, have a no-NONE rendering mode, and not be inside of a singlePanel run
                        show = self.allowed();
                        break;
                }
                if( show ){
                    self.show();
                } else {
                    self.hide();
                }
            }
        });

        // set the modal title depending of the current displayed template
        Tracker.autorun(() => {
            if( self.ready()){
                const panel = pwiAccounts.panel.asked();
                if( Object.keys( acDialog.c ).includes( panel ) && acDialog.c[panel].modal_title ){
                    this.modalTitle( pwiI18n.label( pwiAccounts.strings, acDialog.c[panel].modal_title.group, acDialog.c[panel].modal_title.key ));
                }
            }
        });

        // if the instance is named, then keep it to be usable later
        const name = self.name();
        if( name ){
            acDialog.Dialogs.name = self;
        }

        return this;
    }

    /**
     * @returns {Boolean} true if *this* dialog is allowed to be shown at the moment
     */
    allowed(){
        const panel = pwiAccounts.panel.asked();
        const show = this.showPanels()
            && this.renderMode() !== acPanel.c.NONE
            && (( this.singlePanel() && this.initialPanel() === panel ) || acDialog.SinglePanelReqs.length === 0 );
        //console.log( this, acDialog.SinglePanelReqs, 'show', show );
        return show;
    }

    /**
     * static
     * @param {String} name the searched name
     * @returns {acDialog} the corresponding acDialog instance, or null
     */
    static byName( name ){
        return acDialog.Dialogs.name || null;
    }

    /**
     * Getter/Setter
     * Returns the description to be put after the 'change_pwd' section
     * @param {String} label the (localized) 'change_pwd' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    changePwdTextAfter( label=null ){
        if( label !== null ){
            this._changepwdTextAfter.set( label );
        }
        return this._changepwdTextAfter.get();
    }

    /**
     * Getter/Setter
     * Returns the description to be put in front of the 'change_pwd' section
     * @param {String} label the (localized) 'change_pwd' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    changePwdTextBefore( label=null ){
        if( label !== null ){
            this._changepwdTextBefore.set( label );
        }
        return this._changepwdTextBefore.get();
    }

    /**
     * @returns {String} the class(es) to be added to the dropdown button
     *  considering the current user state and the configured options
     */
    dynButtonClass(){
        const state = pwiAccounts.user.state();
        let res = null;
        switch( state ){
            case acUser.s.LOGGED:
                res = this.loggedButtonClass();
                break;
            case acUser.s.UNLOGGED:
                res = this.unloggedButtonClass();
                break;
        }
        return res ? ( typeof res === 'string' ? res : res()) : null;
    }

    /**
     * @returns {String} the HTML content to be displayed in the dropdown button
     *  considering the current user state and the configured options
     */
    dynButtonContent(){
        const state = pwiAccounts.user.state();
        let res = null;
        switch( state ){
            case acUser.s.LOGGED:
                res = this.loggedButtonContent();
                break;
            case acUser.s.UNLOGGED:
                res = this.unloggedButtonContent();
                break;
        }
        return res ? ( typeof res === 'string' ? res : res()) : null;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        const state = pwiAccounts.user.state();
        let items = null;
        switch( state ){
            case acUser.s.LOGGED:
                items = this.loggedItemsAfter();
                break;
            case acUser.s.UNLOGGED:
                items = this.unloggedItemsAfter();
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
        return res;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsBefore(){
        const state = pwiAccounts.user.state();
        let items = null;
        switch( state ){
            case acUser.s.LOGGED:
                items = this.loggedItemsBefore();
                break;
            case acUser.s.UNLOGGED:
                items = this.unloggedItemsBefore();
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
        let res = [];
        pwiAccounts.dropdownItems().every(( it ) => {
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
        return res;
    }

    /**
     * Getter/Setter
     * @param {String} msg error msg
     * @returns {String} the current error message
     */
    errorMsg( msg=null ){
        if( msg !== null ){
            this._errorMsg.set( msg );
        }
        return this._errorMsg.get();
    }

    /**
     * Hode the dialog, either as a modal or as a div
     * @returns {acDialog}
     */
    hide(){
        //console.log( 'acDialog hide', this.modal());
        if( this.modal()){
            switch( pwiAccounts.conf.ui ){
                case pwiAccounts.client.ui.Bootstrap:
                    $( this.modalSelector()).modal( 'hide' );
                    break;
                case pwiAccounts.client.ui.jQueryUI:
                    $( this.modalSelector()).dialog( 'close' );
                    break;
            }
        } else {
            this._instance.$( this.modalSelector()).hide();
        }
        this._shown.set( false );
        this.errorMsg( '' );
        this.modalTitle( '' );
        return this;
    }
    
    /**
     * Getter/Setter
     * @param {String} panel the initial panel to be displayed
     * @returns {String} the initial panel
     */
    initialPanel( panel=null ){
        if( panel ){
            this._initialPanel.set( panel );
        }
        return this._initialPanel.get();
    }

    /**
     * Getter/Setter
     * @param {String|Object} action the action triggered by the 'logged' button
     * @returns {String|Object}
     */
    loggedButtonAction( action ){
        if( action ){
            if( typeof action === 'string' && ( action === acDialog.a.NONE || action === acDialog.a.DROPDOWN )){
                this._loggedButtonAction.set( action );
            } else if( typeof action === 'object' && Object.keys( action ).length === 1 && ( Object.keys( action )[0] === acDialog.a.ROUTE || Object.keys( action )[0] === acDialog.a.MODAL )){
                this._loggedButtonAction.set( action );
            } else {
                console.error( '[loggedButtonAction] invalid argument:', action );
            }
        }
        return this._loggedButtonAction.get();
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'logged' button
     * @returns {String|Function}
     */
    loggedButtonClass( classname ){
        if( classname ){
            if( typeof classname === 'string' || typeof classname === 'function' ){
                this._loggedButtonClass.set( classname );
            } else {
                console.error( '[loggedButtonClass] invalid argument:', classname );
            }
        }
        return this._loggedButtonClass.get();
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'logged' button
     * @returns {String|Function}
     */
    loggedButtonContent( content ){
        if( content ){
            if( typeof content === 'string' || typeof content === 'function' ){
                this._loggedButtonContent.set( content );
            } else {
                console.error( '[loggedButtonContent] invalid argument:', content );
            }
        }
        return this._loggedButtonContent.get();
    }

    /**
     * Getter/Setter
     * @param {Boolean} show whether to show the 'logged' button when a user is logged-in
     * @returns {Boolean}
     */
    loggedButtonShown( show ){
        if( show === true || show === false ){
            this._loggedButtonShown.set( show );
        }
        return this._loggedButtonShown.get();
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {String|Array|Function} the provided items.
     */
    loggedItemsAfter( items=null ){
        if( items ){
            this._loggedItemsAfter.set( items );
        }
        return this._loggedItemsAfter.get();
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {String|Array|Function} the provided items.
     */
    loggedItemsBefore( items=null ){
        if( items ){
            this._loggedItemsBefore.set( items );
        }
        return this._loggedItemsBefore.get();
    }

    /**
     * @returns {Boolean} true if rendered as a modal
     */
    modal(){
        return this._renderMode.get() === acDialog.r.MODAL;
    }

    /**
     * Getter/Setter
     * @param {String} selector the new selector to be set
     * @returns {String} the jQuery selector of the modal dialog
     */
    modalSelector( selector ){
        if( selector ){
            this._modalSelector = selector;
        }
        if( this._modalSelector ){
            return this._modalSelector;
        }
        switch( pwiAccounts.conf.ui ){
            case pwiAccounts.client.ui.Bootstrap:
                return 'div.ac-modal div.bs-modal';
            case pwiAccounts.client.ui.jQueryUI:
                return 'div.jq-modal';
        }
        console.error( 'unknown \'ui\' configuration', pwiAccounts.conf.ui );
        return '';
    }

    /**
     * Getter/Setter
     * When rendered as a modal dialog, the title displayed in the header
     * @param {String} title the title
     *  Pass an empty string to erase the title
     * @returns {String} the title
     */
    modalTitle( title=null ){
        if( title ){
            this._modalTitle.set( title.trim());
        }
        return this._modalTitle.get();
    }

    /**
     * Getter/Setter
     * @param {String} name the name of this acUserLogin instance
     * @returns {String}
     */
    name( name ){
        if( name ){
            this._name.set( name );
        }
        return this._name.get();
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

    /**
     * Getter/Setter
     * The dialog is it rendered as a modal or as a div ?
     * @param {String} mode the rendering mode
     * @returns {String} the rendering mode
     */
    renderMode( mode=null ){
        if( Object.keys( acDialog.r ).includes( mode )){
            this._renderMode.set( mode );
        }
        return this._renderMode.get();
    }

    /**
     * Getter/Setter
     * @param {Boolean} flag whether to display the 'resetPwd' link
     * @returns {Boolean}
     */
    resetLink( flag=null ){
        if( flag === true || flag === false ){
            this._resetLink.set( flag );
        }
        return this._resetLink.get();
    }

    /**
     * Getter/Setter
     * Returns the description to be put after the 'reset_pwd' section
     * @param {String} label the (localized) 'reset_pwd' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    resetPwdTextAfter( label=null ){
        if( label !== null ){
            this._resetpwdTextAfter.set( label );
        }
        return this._resetpwdTextAfter.get();
    }

    /**
     * Getter/Setter
     * Returns the description to be put in front of the 'reset_pwd' section
     * @param {String} label the (localized) 'reset_pwd' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    resetPwdTextBefore( label=null ){
        if( label !== null ){
            this._resetpwdTextBefore.set( label );
        }
        return this._resetpwdTextBefore.get();
    }

    /**
     * Make the dialog visible, either as a modal or as a div
     * @returns {acDialog}
     */
    show(){
        //console.log( 'acDialog show', this.modal());
        if( this.modal()){
            switch( pwiAccounts.conf.ui ){
                case pwiAccounts.client.ui.Bootstrap:
                    //console.log( 'showing BS modal', this.modalSelector());
                    $( this.modalSelector()).modal( 'show' );
                    break;
                case pwiAccounts.client.ui.jQueryUI:
                    //console.log( 'opening jQueryUI dialog', $( this.modalSelector()) );
                    $( this.modalSelector()).dialog( 'open' );
                    break;
            }
        } else {
            this._instance.$( this.modalSelector()).show();
        }
        this._shown.set( true );
        return this;
    }

    /**
     * Getter/Setter
     * @param {Boolean} show whether to show the panels
     * @returns {Boolean}
     */
    showPanels( show ){
        if( show === true || show === false ){
            this._showPanels.set( show );
        }
        return this._showPanels.get();
    }

    /**
     * Getter/Setter
     * @param {Boolean} flag whether to display the 'signin' link
     * @returns {Boolean}
     */
    signinLink( flag ){
        if( flag === true || flag === false ){
            this._signinLink.set( flag );
        }
        return this._signinLink.get();
    }

    /**
     * Getter/Setter
     * Returns the description to be put after the 'signin' section
     * @param {String} label the (localized) 'signin' description sufix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    signinTextAfter( label=null ){
        if( label !== null ){
            this._signinTextAfter.set( label );
        }
        return this._signinTextAfter.get();
    }

    /**
     * Getter/Setter
     * Returns the description to be put in front of the 'signin' section
     * @param {String} label the (localized) 'signin' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    signinTextBefore( label=null ){
        if( label !== null ){
            this._signinTextBefore.set( label );
        }
        return this._signinTextBefore.get();
    }

    /**
     * Getter/Setter
     * Returns the description to be put in front of the 'signout' section
     * @param {String} label the (localized) 'signout' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    signoutTextBefore( label=null ){
        if( label !== null ){
            this._signoutTextBefore.set( label );
        }
        return this._signoutTextBefore.get();
    }

    /**
     * Getter/Setter
     * @param {Boolean} flag whether to auto-connect a newly created account
     * @returns {Boolean}
     */
    signupAutoConnect( flag=null ){
        if( flag === true || flag === false ){
            this._signupAutoConnect.set( flag );
        }
        return this._signupAutoConnect.get();
    }

    /**
     * Getter/Setter
     * @param {Boolean} flag whether to display the 'signup' link
     * @returns {Boolean}
     */
    signupLink( flag=null ){
        if( flag === true || flag === false ){
            this._signupLink.set( flag );
        }
        return this._signupLink.get();
    }

    /**
     * Getter/Setter
     * Returns the description to be put after the 'signup' section
     * @param {String} label the (localized) 'signup' description sufix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    signupTextAfter( label=null ){
        if( label !== null ){
            this._signupTextAfter.set( label );
        }
        return this._signupTextAfter.get();
    }

    /**
     * Returns the description to be put in front of the 'signup' section
     * @param {String} label the (localized) 'signup' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    signupTextBefore( label=null ){
        if( label !== null ){
            this._signupTextBefore.set( label );
        }
        return this._signupTextBefore.get();
    }

    /**
     * Getter/Setter
     * @param {Boolean} single whether to reserve the display of the panels to *this* instance
     * @returns {Boolean}
     */
    singlePanel( single ){
        if( single === true || single === false ){
            this._singlePanel.set( single );
        }
        return this._singlePanel.get();
    }

    /**
     * Getter/Setter
     * The dialog is it rendered as a modal or as a div ?
     * @param {Boolean} backdrop true if the backdrop is static (thus blocking the application)
     * @returns {Boolean} the backdrop status
     */
    staticBackdrop( backdrop=null ){
        if( backdrop === true || backdrop === false ){
            this._staticBackdrop.set( backdrop );
        }
        return this._staticBackdrop.get();
    }

    /**
     * Toggle the visibility of the dialog
     * @returns {acDialog}
     */
    toggleDisplay(){
        if( this._shown.get()){
            this.hide();
        } else {
            this.show();
        }
        return this;
    }

    /**
     * Getter/Setter
     * @param {String|Object} action the action triggered by the 'unlogged' button
     * @returns {String|Object}
     */
    unloggedButtonAction( action ){
        if( action ){
            if( typeof action === 'string' && ( action === acDialog.a.NONE || action === acDialog.a.DROPDOWN )){
                this._unloggedButtonAction.set( action );
            } else if( typeof action === 'object' && Object.keys( action ).length === 1 && ( Object.keys( action )[0] === acDialog.a.ROUTE || Object.keys( action )[0] === acDialog.a.MODAL )){
                this._unloggedButtonAction.set( action );
            } else {
                console.error( '[unloggedButtonAction] invalid argument:', action );
            }
        }
        return this._unloggedButtonAction.get();
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'unlogged' button
     * @returns {String|Function}
     */
    unloggedButtonClass( classname ){
        if( classname ){
            if( typeof classname === 'string' || typeof classname === 'function' ){
                this._unloggedButtonClass.set( classname );
            } else {
                console.error( '[unloggedButtonClass] invalid argument:', classname );
            }
        }
        return this._unloggedButtonClass.get();
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'unlogged' button
     * @returns {String|Function}
     */
    unloggedButtonContent( content ){
        if( content ){
            if( typeof content === 'string' || typeof content === 'function' ){
                this._unloggedButtonContent.set( content );
            } else {
                console.error( '[unloggedButtonContent] invalid argument:', content );
            }
        }
        return this._unloggedButtonContent.get();
    }

    /**
     * Getter/Setter
     * @param {Boolean} show whether to show the 'unlogged' button when a user is logged-in
     * @returns {Boolean}
     */
    unloggedButtonShown( show ){
        if( show === true || show === false ){
            this._unloggedButtonShown.set( show );
        }
        return this._unloggedButtonShown.get();
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {String|Array|Function} the provided items.
     */
    unloggedItemsAfter( items=null ){
        if( items ){
            this._unloggedItemsAfter.set( items );
        }
        return this._unloggedItemsAfter.get();
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {String|Array|Function} the provided items.
     */
    unloggedItemsBefore( items=null ){
        if( items ){
            this._unloggedItemsBefore.set( items );
        }
        return this._unloggedItemsBefore.get();
    }

    /**
     * @returns {String} the UUID of this instance
     */
    uuid(){
        return this._uuid;
    }

    /**
     * Returns the description to be put in front of the 'verify_ask' section
     * @param {String} label the (localized) 'verify_ask' description prefix
     *  Pass an empty string to empty the displayed description
     * @returns {String}
     */
    verifyAskTextBefore( label=null ){
        if( label !== null ){
            this._verifyTextBefore.set( label );
        }
        return this._verifyTextBefore.get();
    }
}
