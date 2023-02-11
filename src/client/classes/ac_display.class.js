/*
 * pwix:accounts/src/client/classes/ac_display.class.js
 *
 * This class manages the display of all login/logout dialogs.
 * The instance is attached to the 'acUserLogin' template, thus available to each and every child template.
 * 
 * As of 23.01, acShower class may use either the Bootstrap or the jQuery UI version of their modal dialog widget.
 * This is needed because the Bootstrap version doesn't support to be embedded in a 'position:fixed' parent
 *  which be unfortunately the case when the application header is sticky.
 */

import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

import '../../common/js/index.js';

export class acShower {

    // static data
    //

    // keep here a list of all instanciated named acShower objects
    static Displays = {};

    // private data
    //

    // the acUserLogin template instance
    _instance = null;

    // the jQuery selector for the modal
    //  the corresponding method has some suitable defaut values, depending of whether we are using
    //  Bootstrap of jQueryUI dialogs
    //  it is changed as soon as the acShower is initialized with the generated uuid for this acShower
    _modalSelector = '';

    // whether the DOM is ready
    _ready = new ReactiveVar( false );

    _errorMsg = new ReactiveVar( '' );
    _modalTitle = new ReactiveVar( '' );

    // used to toggle the hide/show display
    _shown = new ReactiveVar( false );

    // private functions
    //

    // public data
    //

    /**
     * Constructor
     * @param {acUserLogin} instance the acUserLogin template instance
     * @returns {acShower}
     */
    constructor( instance ){
        const self = this;
        console.log( 'pwix:accounts instanciating acShower', instance );
        self._instance = instance;

        // setup the initial panel
        //pwiAccounts.Panel.asked( self._instance.AC.options.initialPanel(), self._instance.AC.uuid );
        pwiAccounts.Panel.asked( AC_PANEL_NONE, self._instance.AC.uuid );

        // if the instance is named, then keep it to be usable later
        const name = self._instance.AC.options.name();
        if( name ){
            acShower.Displays.name = self;
        }

        // manage the panel transition
        // show/hide the dialog depending of the currently requested template and the options of this dialog
        Tracker.autorun(() => {
            if( self.ready()){
                let show = true;
                const panel = pwiAccounts.Panel.asked();
                switch( panel ){
                    case AC_PANEL_NONE:
                        show = false;
                        break;
                    case AC_PANEL_SIGNIN:
                    case AC_PANEL_SIGNUP:
                    case AC_PANEL_RESETASK:
                    case AC_PANEL_SIGNOUT:
                    case AC_PANEL_CHANGEPWD:
                    case AC_PANEL_VERIFYASK:
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
                this.modalTitle( pwiAccounts.Panel.modalTitle( pwiAccounts.Panel.asked()));
            }
        });

        return this;
    }

    /**
     * static
     * @param {String} name the searched name
     * @returns {acShower} the corresponding acShower instance, or null
     */
    static byName( name ){
        return acShower.Displays.name || null;
    }

    /**
     * @returns {Array} an array of items as the <li>...</li> inner HTML strings
     */
    dynItemsAfter(){
        const state = pwiAccounts.User.state();
        let items = null;
        switch( state ){
            case AC_LOGGED:
                items = this._instance.AC.options.loggedItemsAfter();
                break;
            case AC_UNLOGGED:
                items = this._instance.AC.options.unloggedItemsAfter();
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
        //console.log( 'dynItemsAfter', res );
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
                items = this._instance.AC.options.loggedItemsBefore();
                break;
            case AC_UNLOGGED:
                items = this._instance.AC.options.unloggedItemsBefore();
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
     * @returns {acShower}
     */
    hide(){
        //console.log( 'acShower hide', this.modal());
        if( this._instance.AC.options.renderMode() === AC_RENDER_MODAL ){
            switch( pwiAccounts.opts().ui()){
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
        switch( pwiAccounts.opts().ui()){
            case AC_UI_BOOTSTRAP:
                return 'div.ac-modal div.bs-modal';
            case AC_UI_JQUERY:
                return 'div.jq-modal';
        }
        console.error( 'unknown \'ui\' configuration', pwiAccounts.opts().ui());
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
     * Make the dialog visible, either as a modal or as a div
     * @returns {acShower}
     */
    show(){
        //console.log( 'acShower show', this.modal());
        if( this._instance.AC.options.renderMode() === AC_RENDER_MODAL ){
            switch( pwiAccounts.opts().ui()){
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
     * Toggle the visibility of the dialog
     * @returns {acShower}
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
     * @returns {String} the UUID of this instance
     */
    uuid(){
        return this._uuid;
    }
}
