/*
 * pwix:accounts/src/client/classes/ac_options_user_login.class.js
 *
 * This class manages the acUserLogin configuration options.
 */

import { acOptions } from '../../common/classes/ac_options.class.js';
import { acPanel } from './ac_panel.class.js';

export class acOptionsUserLogin extends acOptions {

    // static data
    //

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

    // private functions
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * 
     * The acOptions base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @param {Object} options the options to be managed
     * @returns {acOptionsUserLogin}
     */
    constructor( options ){
        super( options );
        return this;
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} single whether this instance uses two password input fields when changing a user's password
     * @returns {Boolean}
     */
    changePasswordTwice( twice ){
        return this.getset_Bool_Fn( 'changePasswordTwice', twice, { default: defaults.acUserLogin.changePasswordTwice });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in first place of the 'change_pwd' section, before old password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextOne( label ){
        return this.getset_String_Fn_Object( 'changePwdTextOne', label, { default: defaults.acUserLogin.changePwdTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in second place of the 'change_pwd' section, between old and new passwords
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextTwo( label ){
        return this.getset_String_Fn_Object( 'changePwdTextTwo', label, { default: defaults.acUserLogin.changePwdTextTwo });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in last place of the 'change_pwd' section, after new passwords
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextThree( label ){
        return this.getset_String_Fn_Object( 'changePwdTextThree', label, { default: defaults.acUserLogin.changePwdTextThree });
    }

    /**
     * Getter/Setter
     * @param {String|Function} panel the initial panel to be displayed
     * @returns {String} the initial panel
     */
    initialPanel( panel ){
        return this.getset_String_Fn_Object( 'initialPanel', panel, { default: defaults.acUserLogin.initialPanel, ref: Object.keys( acPanel.Knowns ) });
    }

    /**
     * Getter/Setter
     * @param {String|Function} action the action triggered by the 'logged' button
     * @returns {String}
     */
    loggedButtonAction( action ){
        return this.getset_String_Fn_Object( 'loggedButtonAction', action, { default: defaults.acUserLogin.loggedButtonAction, ref: acOptionsUserLogin.Actions });
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'logged' button
     * @returns {String}
     */
    loggedButtonClass( classname ){
        return this.getset_String_Fn_Object( 'loggedButtonClass', classname, { default: defaults.acUserLogin.loggedButtonClass });
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'logged' button
     * @returns {String}
     */
    loggedButtonContent( content ){
        return this.getset_String_Fn_Object( 'loggedButtonContent', content, { default: defaults.acUserLogin.loggedButtonContent });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    loggedItems( items ){
        return this.getset_String_Array_Fn( 'loggedItems', items, { default: defaults.acUserLogin.loggedItems });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided item as a maybe empty array.
     */
    loggedItemsAfter( items ){
        return this.getset_String_Array_Fn( 'loggedItemsAfter', items, { default: defaults.acUserLogin.loggedItemsAfter });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided item as a maybe empty array.
     */
    loggedItemsBefore( items ){
        return this.getset_String_Array_Fn( 'loggedItemsBefore', items, { default: defaults.acUserLogin.loggedItemsBefore });
    }

    /**
     * Getter/Setter
     * @param {String|Function} name the name of this acUserLogin instance
     * @returns {String}
     */
    name( name ){
        return this.getset_String_Fn_Object( 'name', name, { default: defaults.acUserLogin.name });
    }

    /**
     * Getter/Setter
     * The dialog is it rendered as a modal or as a div ?
     * @param {String|Function} mode the rendering mode
     * @returns {String} the rendering mode
     */
    renderMode( mode ){
        return this.getset_String_Fn_Object( 'renderMode', mode, { default: defaults.acUserLogin.renderMode, ref: acOptionsUserLogin.RenderModes });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'resetPwd' link
     * @returns {Boolean}
     */
    resetLink( flag ){
        return this.getset_Bool_Fn( 'resetLink', flag, { default: defaults.acUserLogin.resetLink });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'reset_ask' section, before the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    resetAskTextOne( label ){
        return this.getset_String_Fn_Object( 'resetAskTextOne', label, { default: defaults.acUserLogin.resetAskTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'reset_ask section, after the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    resetAskTextTwo( label ){
        return this.getset_String_Fn_Object( 'resetAskTextTwo', label, { default: defaults.acUserLogin.resetAskTextTwo });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'signin' link
     * @returns {Boolean}
     */
    signinLink( flag ){
        return this.getset_Bool_Fn( 'signinLink', flag, { default: defaults.acUserLogin.signinLink });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'signin' section, before the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextOne( label ){
        return this.getset_String_Fn_Object( 'signinTextOne', label, { default: defaults.acUserLogin.signinTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'signin' section, between the mail and the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextTwo( label ){
        return this.getset_String_Fn_Object( 'signinTextTwo', label, { default: defaults.acUserLogin.resetAsksigninTextTwoTextTwo });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the last place of the 'signin' section, after the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextThree( label ){
        return this.getset_String_Fn_Object( 'signinTextThree', label, { default: defaults.acUserLogin.signinTextThree });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put as the 'signout' section
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signoutTextOne( label ){
        return this.getset_String_Fn_Object( 'signoutTextOne', label, { default: defaults.acUserLogin.signoutTextOne });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to auto-connect a newly created account
     * @returns {Boolean}
     */
    signupAutoConnect( flag ){
        return this.getset_Bool_Fn( 'signupAutoConnect', flag, { default: defaults.acUserLogin.signupAutoConnect });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'signup' link
     * @returns {Boolean}
     */
    signupLink( flag ){
        return this.getset_Bool_Fn( 'signupLink', flag, { default: defaults.acUserLogin.signupLink });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} single whether this instance uses two password input fields when creating a new account
     * @returns {Boolean}
     */
    signupPasswordTwice( twice ){
        return this.getset_Bool_Fn( 'signupPasswordTwice', twice, { default: defaults.acUserLogin.signupPasswordTwice });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'signup' section, before the username
     * Not considered if username is not permitted.
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextOne( label ){
        return this.getset_String_Fn_Object( 'signupTextOne', label, { default: defaults.acUserLogin.signupTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'signup' section, before the mail
     * Not considered if email address is not considered
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextTwo( label ){
        return this.getset_String_Fn_Object( 'signupTextTwo', label, { default: defaults.acUserLogin.signupTextTwo });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the third place of the 'signup' section, before the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextThree( label ){
        return this.getset_String_Fn_Object( 'signupTextThree', label, { default: defaults.acUserLogin.signupTextThree });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the last place of the 'signup' section, after the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextFour( label ){
        return this.getset_String_Fn_Object( 'signupTextFour', label, { default: defaults.acUserLogin.signupTextFour });
    }

    /**
     * Getter/Setter
     * @param {String|Function} action the action triggered by the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonAction( action ){
        return this.getset_String_Fn_Object( 'unloggedButtonAction', action, { default: defaults.acUserLogin.unloggedButtonAction, ref: acOptionsUserLogin.Actions });
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonClass( classname ){
        return this.getset_String_Fn_Object( 'unloggedButtonClass', classname, { default: defaults.acUserLogin.unloggedButtonClass });
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonContent( content ){
        return this.getset_String_Fn_Object( 'unloggedButtonContent', content, { default: defaults.acUserLogin.unloggedButtonContent });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItems( items ){
        return this.getset_String_Array_Fn( 'unloggedItems', items, { default: defaults.acUserLogin.unloggedItems });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItemsAfter( items ){
        return this.getset_String_Array_Fn( 'unloggedItemsAfter', items, { default: defaults.acUserLogin.unloggedItemsAfter });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItemsBefore( items ){
        return this.getset_String_Array_Fn( 'unloggedItemsBefore', items, { default: defaults.acUserLogin.unloggedItemsBefore });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put as the 'verify_ask' section
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    verifyAskTextOne( label ){
        return this.getset_String_Fn_Object( 'verifyAskTextOne', label, { default: defaults.acUserLogin.verifyAskTextOne });
    }
}
