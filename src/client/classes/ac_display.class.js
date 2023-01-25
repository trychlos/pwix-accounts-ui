/*
 * pwix:accounts/src/client/classes/ac_display.class.js
 *
 * This class manages the display of all login/logout dialogs.
 * The instance is first attached to the 'acUserLogin' template, thus available to each and every child template.
 * 
 * As of 23.01, acDisplay class may use either the Bootstrap or the jQuery UI version of their modal dialog widget.
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

export class acDisplay {

    // static data
    //

    // when an instance asks to have a 'singlePanel', i.e. wants reserve the display, we put this static to true
    //  so that each instance may know that someone wants the display for itself
    //  as a consequence, an instance is allowed to display its panels if SinglePanelReqs() is empty || singlePanel()=true
    static SinglePanelReqs = [];

    // keep here a list of all instanciated acDisplay objects
    static Displays = {};

    // the known actions
    static Actions = [
        AC_ACT_HIDDEN,
        AC_ACT_NONE,
        AC_ACT_DROPDOWN,
        AC_ACT_BUBBLE
    ];

    // the known render modes
    static RenderModes = [
        AC_RENDER_MODAL,
        AC_RENDER_DIV
    ];

    // private data
    //

    // the 'acUserLogin' template instance
    _instance = null;

    // a UUID which identifies *this* acDisplay instance
    //  mainly used for debugging purposes
    _uuid = null;

    // the jQuery selector for the modal
    //  the corresponding method has some suitable defaut values, depending of whether we are using
    //  Bootstrap of jQueryUI dialogs
    //  it is changed as soon as the acDisplay is initialized with the generated uuid for this acDisplay
    _modalSelector = '';

    // configuration options as an object which contains one ReactiveVar for each key
    _conf = {};

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    _errorMsg = new ReactiveVar( '' );
    _modalTitle = new ReactiveVar( '' );
    _showPanels = new ReactiveVar( true );

    // used to toggle the hide/show display
    _shown = new ReactiveVar( false );

    // whether the user can click outside the modal to close it
    //  at the moment this is not a configuration option, and always false
    _staticBackdrop = new ReactiveVar( false );

    // private functions

    // make sure we return an array for the configuration option
    _toArray( key ){
        const value = this._conf[key].get();
        let result = [];
        if( typeof value === 'function' ){
            const ret = value();
            result = typeof ret === 'string' ? [ ret ] : ( Array.isArray( ret ) ? ret : [] );
        } else if( typeof value === 'string' ){
            result = [ value ];
        } else if( Array.isArray( value )){
            result = value;
        }
        return result;
    }

    // get/set a configuration option as a boolean or a function
    _get_set_bool_fn( key, bool ){
        if( bool !== undefined ){
            if( bool === true || bool === false || typeof bool === 'function' ){
                this._conf[key].set( bool );
            } else {
                console.error( key, 'invalid argument:', bool );
            }
        }
        const value = this._conf[key].get();
        return typeof value === 'function' ? value() : value;
    }

    // get/set a configuration option as a string or a function
    //  maybe be with a reference array of accepted values
    //  also accept an object with 'group' and 'label' keys
    _get_set_string_fn( key, label, ref ){
        if( label !== undefined ){
            if(( typeof label === 'string' && ( ref === undefined || ref.includes( label ))) || typeof label === 'function' ){
                this._conf[key].set( label );
            } else if( typeof label === 'object' && Object.keys( label ).includes( 'group' ) && Object.keys( label ).includes( 'label' )){
                this._conf[key].set( pwiI18n.label( pwiAccounts.strings, label.group, label.label ));
            } else {
                console.error( key, 'invalid argument:', label );
            }
        }
        const value = this._conf[key].get();
        return typeof value === 'function' ? value() : value;
    }

    // get/set a configuration option as a string, an array or a function
    _get_set_string_array_fn( key, inval ){
        if( inval !== undefined ){
            if( typeof inval === 'string' || Array.isArray( inval ) || typeof inval === 'function' ){
                this._conf[key].set( inval );
            } else {
                console.error( key, 'invalid argument:', inval );
            }
        }
        return this._toArray( key );
    }

    // public data

    // the title of the modal dialogs is configured here
    //  buttons are configured in 'ac_modal_buttons' component
    static c = {
        AC_PANEL_CHANGEPWD: {
            modal_title: {
                group: 'change_pwd',
                key: 'modal_title'
            }
        },
        AC_PANEL_RESETASK: {
            modal_title: {
                group: 'reset_ask',
                key: 'modal_title'
            }
        },
        AC_PANEL_SIGNIN: {
            modal_title: {
                group: 'signin',
                key: 'modal_title'
            }
        },
        AC_PANEL_SIGNOUT: {
            modal_title: {
                group: 'signout',
                key: 'modal_title'
            }
        },
        AC_PANEL_SIGNUP: {
            modal_title: {
                group: 'signup',
                key: 'modal_title'
            }
        },
        AC_PANEL_VERIFYASK: {
            modal_title: {
                group: 'verify_ask',
                key: 'modal_title'
            }
        }
    }

    /**
     * Constructor
     * @param {Object} instance an 'acUserLogin' template instance
     * @param {Object} opts the parameters passed to the initial 'acUserLogin' template:
     * @returns {acDisplay}
     */
    constructor( instance, opts={} ){
        const self = this;

        this._uuid = uuidv4();
        this._instance = instance;

        console.log( 'pwix:accounts instanciating acDisplay', opts, 'uuid', this._uuid );

        // by merging defaults and provided options, we get an object which contains all known configuration options
        // allocate a new reactive var for the option and set it
        let _parms = {
            ...defaults.acUserLogin,
            ...opts
        };
        Object.keys( _parms ).every(( key ) => {
            if( typeof self[key] === 'function' ){
                self._conf[key] = new ReactiveVar();
                self[key]( _parms[key] );
            } else {
                console.error( 'acDisplay: unmanaged configuration option', key );
            }
            return true;
        });

        // if single panel, record it to be kept outside of the normal flow
        if( this.singlePanel()){
            acDisplay.SinglePanelReqs.push( this.uuid());
        }

        // setup the initial panel
        pwiAccounts.Panel.asked( this.initialPanel());

        // if the instance is named, then keep it to be usable later
        const name = this.name();
        if( name ){
            acDisplay.Displays.name = self;
        }

        // manage the panel transition
        // show/hide the dialog depending of the currently requested template and the options of this dialog
        Tracker.autorun(() => {
            if( self.ready()){
                let show = false;
                const panel = pwiAccounts.Panel.asked();
                const prev = pwiAccounts.Panel.previous();
                switch( panel ){
                    case AC_PANEL_NONE:
                        if( self.singlePanel() && prev && prev !== AC_PANEL_NONE ){
                            // transition to NONE ends up with singlePanel feature
                            //self.renderMode( acDisplay.r.NONE );
                            const idx = acDisplay.SinglePanelReqs.indexOf( self.uuid());
                            if( idx > -1 ){
                                acDisplay.SinglePanelReqs.splice( idx, 1 );
                            }
                        }
                        break;
                    case AC_PANEL_SIGNIN:
                    case AC_PANEL_SIGNUP:
                    case AC_PANEL_RESETASK:
                    case AC_PANEL_SIGNOUT:
                    case AC_PANEL_CHANGEPWD:
                    case AC_PANEL_VERIFYASK:
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

        // set the modal title depending of the current displayed panel
        Tracker.autorun(() => {
            if( self.ready()){
                const panel = pwiAccounts.Panel.asked();
                if( Object.keys( acDisplay.c ).includes( panel ) && acDisplay.c[panel].modal_title ){
                    this.modalTitle( pwiI18n.label( pwiAccounts.strings, acDisplay.c[panel].modal_title.group, acDisplay.c[panel].modal_title.key ));
                }
            }
        });

        return this;
    }

    /**
     * @returns {Boolean} true if *this* dialog is allowed to be shown at the moment
     */
    allowed(){
        const panel = pwiAccounts.Panel.asked();
        const show = this.showPanels()
            && this.renderMode() !== AC_PANEL_NONE
            && (( this.singlePanel() && this.initialPanel() === panel ) || acDisplay.SinglePanelReqs.length === 0 );
        //console.log( this, acDisplay.SinglePanelReqs, 'show', show );
        return show;
    }

    /**
     * static
     * @param {String} name the searched name
     * @returns {acDisplay} the corresponding acDisplay instance, or null
     */
    static byName( name ){
        return acDisplay.Displays.name || null;
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in first place of the 'change_pwd' section, before old password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextOne( label ){
        return this._get_set_string_fn( 'changePwdTextOne', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in second place of the 'change_pwd' section, between old and new passwords
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextTwo( label ){
        return this._get_set_string_fn( 'changePwdTextTwo', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in last place of the 'change_pwd' section, after new passwords
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextThree( label ){
        return this._get_set_string_fn( 'changePwdTextThree', label );
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        const state = pwiAccounts.User.state();
        let items = null;
        switch( state ){
            case AC_LOGGED:
                items = this.loggedItemsAfter();
                break;
            case AC_UNLOGGED:
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
        const state = pwiAccounts.User.state();
        let items = null;
        switch( state ){
            case AC_LOGGED:
                items = this.loggedItemsBefore();
                break;
            case AC_UNLOGGED:
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
        return pwiAccounts.dropdownItems();
    }

    /**
     * Getter/Setter
     * Panels have their own error messages (e.g. password too short or too weak).
     * This method is provided to host error messages returned from the server (e.g. bad credentials).
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
     * @returns {acDisplay}
     */
    hide(){
        //console.log( 'acDisplay hide', this.modal());
        if( this.modal()){
            switch( pwiAccounts.conf.ui ){
                case AC_UI_BOOTSTRAP:
                    $( this.modalSelector()).modal( 'hide' );
                    break;
                case AC_UI_JQUERY:
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
     * @param {String|Function} panel the initial panel to be displayed
     * @returns {String} the initial panel
     */
    initialPanel( panel ){
        return this._get_set_string_fn( 'initialPanel', panel, acPanel.Knowns );
    }

    /**
     * Getter/Setter
     * @param {String|Function} action the action triggered by the 'logged' button
     * @returns {String}
     */
    loggedButtonAction( action ){
        return this._get_set_string_fn( 'loggedButtonAction', action, acDisplay.Actions );
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'logged' button
     * @returns {String}
     */
    loggedButtonClass( classname ){
        return this._get_set_string_fn( 'loggedButtonClass', classname );
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'logged' button
     * @returns {String}
     */
    loggedButtonContent( content ){
        return this._get_set_string_fn( 'loggedButtonContent', content );
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    loggedItems( items ){
        return this._get_set_string_array_fn( 'loggedItems', items );
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided item as a maybe empty array.
     */
    loggedItemsAfter( items ){
        return this._get_set_string_array_fn( 'loggedItemsAfter', items );
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided item as a maybe empty array.
     */
    loggedItemsBefore( items ){
        return this._get_set_string_array_fn( 'loggedItemsBefore', items );
    }

    /**
     * @returns {Boolean} true if rendered as a modal
     */
    modal(){
        return this._conf.renderMode.get() === AC_RENDER_MODAL;
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
            case AC_UI_BOOTSTRAP:
                return 'div.ac-modal div.bs-modal';
            case AC_UI_JQUERY:
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
     * @param {String|Function} name the name of this acUserLogin instance
     * @returns {String}
     */
    name( name ){
        return this._get_set_string_fn( 'name', name );
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
     * @param {String|Function} mode the rendering mode
     * @returns {String} the rendering mode
     */
    renderMode( mode ){
        return this._get_set_string_fn( 'renderMode', mode, acDisplay.RenderModes );
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'resetPwd' link
     * @returns {Boolean}
     */
    resetLink( flag ){
        return this._get_set_bool_fn( 'resetLink', flag );
    }
    
    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'reset_pwd' section, before the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    resetPwdTextOne( label ){
        return this._get_set_string_fn( 'resetPwdTextOne', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'reset_pwd' section, after the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    resetPwdTextTwo( label ){
        return this._get_set_string_fn( 'resetPwdTextTwo', label );
    }

    /**
     * Make the dialog visible, either as a modal or as a div
     * @returns {acDisplay}
     */
    show(){
        //console.log( 'acDisplay show', this.modal());
        if( this.modal()){
            switch( pwiAccounts.conf.ui ){
                case AC_UI_BOOTSTRAP:
                    //console.log( 'showing BS modal', this.modalSelector());
                    $( this.modalSelector()).modal( 'show' );
                    break;
                case AC_UI_JQUERY:
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
     * @param {Boolean|Function} flag whether to display the 'signin' link
     * @returns {Boolean}
     */
    signinLink( flag ){
        return this._get_set_bool_fn( 'signinLink', flag );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'signin' section, before the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextOne( label ){
        return this._get_set_string_fn( 'signinTextOne', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'signin' section, between the mail and the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextTwo( label ){
        return this._get_set_string_fn( 'signinTextTwo', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the last place of the 'signin' section, after the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextThree( label ){
        return this._get_set_string_fn( 'signinTextThree', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put as the 'signout' section
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signoutTextOne( label ){
        return this._get_set_string_fn( 'signoutTextOne', label );
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to auto-connect a newly created account
     * @returns {Boolean}
     */
    signupAutoConnect( flag ){
        return this._get_set_bool_fn( 'signupAutoConnect', flag );
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'signup' link
     * @returns {Boolean}
     */
    signupLink( flag ){
        return this._get_set_bool_fn( 'signupLink', flag );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'signup' section, before the username
     * Not considered if username is not permitted.
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextOne( label ){
        return this._get_set_string_fn( 'signupTextOne', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'signup' section, before the mail
     * Not considered if email address is not considered
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextTwo( label ){
        return this._get_set_string_fn( 'signupTextTwo', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the third place of the 'signup' section, before the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextThree( label ){
        return this._get_set_string_fn( 'signupTextThree', label );
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the last place of the 'signup' section, after the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextFour( label ){
        return this._get_set_string_fn( 'signupTextFour', label );
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} single whether this instance is to be used outside of the standard workflow
     * @returns {Boolean}
     */
    singlePanel( single ){
        return this._get_set_bool_fn( 'singlePanel', single );
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
     * @returns {acDisplay}
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
     * @param {String|Function} action the action triggered by the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonAction( action ){
        return this._get_set_string_fn( 'unloggedButtonAction', action, acDisplay.Actions );
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonClass( classname ){
        return this._get_set_string_fn( 'unloggedButtonClass', classname );
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonContent( content ){
        return this._get_set_string_fn( 'unloggedButtonContent', content );
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItems( items ){
        return this._get_set_string_array_fn( 'unloggedItems', items );
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItemsAfter( items ){
        return this._get_set_string_array_fn( 'unloggedItemsAfter', items );
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItemsBefore( items ){
        return this._get_set_string_array_fn( 'unloggedItemsBefore', items );
    }

    /**
     * @returns {String} the UUID of this instance
     */
    uuid(){
        return this._uuid;
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put as the 'verify_ask' section
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    verifyAskTextOne( label ){
        return this._get_set_string_fn( 'verifyAskTextOne', label );
    }
}
