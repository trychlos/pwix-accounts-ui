/*
 * pwix:accounts-ui/src/client/classes/ac_companion_options.class.js
 *
 * This class manages the acUserLogin configuration options.
 */

import _ from 'lodash';

import { Options } from 'meteor/pwix:options';

import '../../common/js/index.js';

export class acCompanionOptions extends Options.Base {

    // static data
    //

    // borders colors
    static BorderedColors = [
        AC_COLORED_NEVER,
        AC_COLORED_VALIDATION,
        AC_COLORED_MANDATORY
    ];

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

    // static methods
    //

    // private data
    //

    // the identifier attributed by the manager
    _managerId = null;

    // private methods
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * 
     * The acBase base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @param {String} managerId the identifier attributed by the acManager
     * @returns {acCompanionOptions}
     */
    constructor( managerId ){
        super();
        const self = this;

        if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acCompanionOptions' );
        }

        self._managerId = managerId;

        _.merge( self, {
            coloredBorders( arg ){ return this.base_gsStringFn( 'coloredBorders', arg, { default: defaults.acUserLogin.coloredBorders, ref: acCompanionOptions.ColoredBorders }); },
        });

        return this;
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} single whether this instance uses two password input fields when changing a user's password
     * @returns {Boolean}
     */
    changePasswordTwice( twice ){
        return this.base_gsBoolFn( 'changePasswordTwice', twice, { default: defaults.acUserLogin.changePasswordTwice });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in first place of the 'change_pwd' section, before old password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextOne( label ){
        return this.base_gsStringObjectFn( 'changePwdTextOne', label, { default: defaults.acUserLogin.changePwdTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in second place of the 'change_pwd' section, between old and new passwords
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextTwo( label ){
        return this.base_gsStringObjectFn( 'changePwdTextTwo', label, { default: defaults.acUserLogin.changePwdTextTwo });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in last place of the 'change_pwd' section, after new passwords
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    changePwdTextThree( label ){
        return this.base_gsStringObjectFn( 'changePwdTextThree', label, { default: defaults.acUserLogin.changePwdTextThree });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display a 'Cancel' button
     * @returns {Boolean}
     */
    haveCancelButton( flag ){
        return this.base_gsBoolFn( 'haveCancelButton', flag, { default: defaults.acUserLogin.haveCancelButton });
    }

    /**
     * Getter/Setter
     * @param {String|Function} panel the initial panel to be displayed
     * @returns {String} the initial panel
     */
    initialPanel( panel ){
        return this.base_gsStringObjectFn( 'initialPanel', panel, { default: defaults.acUserLogin.initialPanel, ref: Object.keys( AccountsUI.Panel.Refs ) });
    }

    /**
     * Getter/Setter
     * @param {String|Function} action the action triggered by the 'logged' button
     * @returns {String}
     */
    loggedButtonAction( action ){
        return this.base_gsStringObjectFn( 'loggedButtonAction', action, { default: defaults.acUserLogin.loggedButtonAction, ref: acCompanionOptions.Actions });
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'logged' button
     * @returns {String}
     */
    loggedButtonClass( classname ){
        return this.base_gsStringObjectFn( 'loggedButtonClass', classname, { default: defaults.acUserLogin.loggedButtonClass });
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'logged' button
     * @returns {String}
     */
    loggedButtonContent( content ){
        return this.base_gsStringObjectFn( 'loggedButtonContent', content, { default: defaults.acUserLogin.loggedButtonContent });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    loggedItems( items ){
        return this.base_gsStringArrayFn( 'loggedItems', items, { default: defaults.acUserLogin.loggedItems });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided item as a maybe empty array.
     */
    loggedItemsAfter( items ){
        return this.base_gsStringArrayFn( 'loggedItemsAfter', items, { default: defaults.acUserLogin.loggedItemsAfter });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided item as a maybe empty array.
     */
    loggedItemsBefore( items ){
        return this.base_gsStringArrayFn( 'loggedItemsBefore', items, { default: defaults.acUserLogin.loggedItemsBefore });
    }

    /**
     * Getter/Setter
     * @param {String|Function} name the name of this acUserLogin instance
     * @returns {String}
     */
    name( name ){
        return this.base_gsStringObjectFn( 'name', name, { default: defaults.acUserLogin.name });
    }

    /**
     * Getter/Setter
     * The dialog is it rendered as a modal or as a div ?
     * @param {String|Function} mode the rendering mode
     * @returns {String} the rendering mode
     */
    renderMode( mode ){
        return this.base_gsStringObjectFn( 'renderMode', mode, { default: defaults.acUserLogin.renderMode, ref: acCompanionOptions.RenderModes });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'resetPwd' link
     * @returns {Boolean}
     */
    resetLink( flag ){
        return this.base_gsBoolFn( 'resetLink', flag, { default: defaults.acUserLogin.resetLink });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'reset_ask' section, before the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    resetAskTextOne( label ){
        return this.base_gsStringObjectFn( 'resetAskTextOne', label, { default: defaults.acUserLogin.resetAskTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'reset_ask section, after the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    resetAskTextTwo( label ){
        return this.base_gsStringObjectFn( 'resetAskTextTwo', label, { default: defaults.acUserLogin.resetAskTextTwo });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the legend to be set inside of email fieldset
     * @returns {String}
     */
    signinLegendEmail( str ){
        return this.base_gsStringObjectFn( 'signinLegendEmail', str, { default: defaults.acUserLogin.signinLegendEmail });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the legend to be set inside of password(s) fieldset
     * @returns {String}
     */
    signinLegendPassword( str ){
        return this.base_gsStringObjectFn( 'signinLegendPassword', str, { default: defaults.acUserLogin.signinLegendPassword });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the legend to be set inside of username fieldset
     * @returns {String}
     */
    signinLegendUsername( str ){
        return this.base_gsStringObjectFn( 'signinLegendUsername', str, { default: defaults.acUserLogin.signinLegendUsername });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'signin' link
     * @returns {Boolean}
     */
    signinLink( flag ){
        return this.base_gsBoolFn( 'signinLink', flag, { default: defaults.acUserLogin.signinLink });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'signin' section, before the mail
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextOne( label ){
        return this.base_gsStringObjectFn( 'signinTextOne', label, { default: defaults.acUserLogin.signinTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'signin' section, between the mail and the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextTwo( label ){
        return this.base_gsStringObjectFn( 'signinTextTwo', label, { default: defaults.acUserLogin.resetAsksigninTextTwoTextTwo });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the last place of the 'signin' section, after the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signinTextThree( label ){
        return this.base_gsStringObjectFn( 'signinTextThree', label, { default: defaults.acUserLogin.signinTextThree });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put as the 'signout' section
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signoutTextOne( label ){
        return this.base_gsStringObjectFn( 'signoutTextOne', label, { default: defaults.acUserLogin.signoutTextOne });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to auto-close the modal after having created a new account
     * @returns {Boolean}
     */
    signupAutoClose( flag ){
        return this.base_gsBoolFn( 'signupAutoClose', flag, { default: defaults.acUserLogin.signupAutoClose });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to auto-connect a newly created account
     * @returns {Boolean}
     */
    signupAutoConnect( flag ){
        return this.base_gsBoolFn( 'signupAutoConnect', flag, { default: defaults.acUserLogin.signupAutoConnect });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the placeholder of the input email
     * @returns {String}
     */
    signupEmailPlaceholder( str ){
        return this.base_gsStringObjectFn( 'signupEmailPlaceholder', str, { default: defaults.acUserLogin.signupEmailPlaceholder });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the legend to be set inside of email fieldset
     * @returns {String}
     */
    signupLegendEmail( str ){
        return this.base_gsStringObjectFn( 'signupLegendEmail', str, { default: defaults.acUserLogin.signupLegendEmail });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the legend to be set inside of password(s) fieldset
     * @returns {String}
     */
    signupLegendPassword( str ){
        return this.base_gsStringObjectFn( 'signupLegendPassword', str, { default: defaults.acUserLogin.signupLegendPassword });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the legend to be set inside of username fieldset
     * @returns {String}
     */
    signupLegendUsername( str ){
        return this.base_gsStringObjectFn( 'signupLegendUsername', str, { default: defaults.acUserLogin.signupLegendUsername });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether to display the 'signup' link
     * @returns {Boolean}
     */
    signupLink( flag ){
        return this.base_gsBoolFn( 'signupLink', flag, { default: defaults.acUserLogin.signupLink });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the placeholder of the first input password
     * @returns {String}
     */
    signupPasswdOnePlaceholder( str ){
        return this.base_gsStringObjectFn( 'signupPasswdOnePlaceholder', str, { default: defaults.acUserLogin.signupPasswdOnePlaceholder });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the placeholder of the second input password
     * @returns {String}
     */
    signupPasswdTwoPlaceholder( str ){
        return this.base_gsStringObjectFn( 'signupPasswdTwoPlaceholder', str, { default: defaults.acUserLogin.signupPasswdTwoPlaceholder });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} single whether this instance uses two password input fields when creating a new account
     * @returns {Boolean}
     */
    signupPasswordTwice( twice ){
        return this.base_gsBoolFn( 'signupPasswordTwice', twice, { default: defaults.acUserLogin.signupPasswordTwice });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the first place of the 'signup' section, before the username
     * Not considered if username is not permitted.
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextOne( label ){
        return this.base_gsStringObjectFn( 'signupTextOne', label, { default: defaults.acUserLogin.signupTextOne });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the second place of the 'signup' section, before the mail
     * Not considered if email address is not considered
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextTwo( label ){
        return this.base_gsStringObjectFn( 'signupTextTwo', label, { default: defaults.acUserLogin.signupTextTwo });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the third place of the 'signup' section, before the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextThree( label ){
        return this.base_gsStringObjectFn( 'signupTextThree', label, { default: defaults.acUserLogin.signupTextThree });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put in the last place of the 'signup' section, after the password
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    signupTextFour( label ){
        return this.base_gsStringObjectFn( 'signupTextFour', label, { default: defaults.acUserLogin.signupTextFour });
    }

    /**
     * Getter/Setter
     * @param {String|Function|Object} str the placeholder of the input username
     * @returns {String}
     */
    signupUsernamePlaceholder( str ){
        return this.base_gsStringObjectFn( 'signupUsernamePlaceholder', str, { default: defaults.acUserLogin.signupUsernamePlaceholder });
    }

    /**
     * Getter/Setter
     * @param {String|Function} action the action triggered by the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonAction( action ){
        return this.base_gsStringObjectFn( 'unloggedButtonAction', action, { default: defaults.acUserLogin.unloggedButtonAction, ref: acCompanionOptions.Actions });
    }

    /**
     * Getter/Setter
     * @param {String|Function} classname the class(es) to be added the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonClass( classname ){
        return this.base_gsStringObjectFn( 'unloggedButtonClass', classname, { default: defaults.acUserLogin.unloggedButtonClass });
    }

    /**
     * Getter/Setter
     * @param {String|Function} content the content to be displayed in the 'unlogged' button
     * @returns {String}
     */
    unloggedButtonContent( content ){
        return this.base_gsStringObjectFn( 'unloggedButtonContent', content, { default: defaults.acUserLogin.unloggedButtonContent });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItems( items ){
        return this.base_gsStringArrayFn( 'unloggedItems', items, { default: defaults.acUserLogin.unloggedItems });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItemsAfter( items ){
        return this.base_gsStringArrayFn( 'unloggedItemsAfter', items, { default: defaults.acUserLogin.unloggedItemsAfter });
    }

    /**
     * Getter/Setter
     * @param {String|Array|Function} items the <li>...</li> inner HTML as a string,
     *  or an array of such strings, or a function which returns a string or an array.
     * @returns {Array} the provided items as a maybe empty array.
     */
    unloggedItemsBefore( items ){
        return this.base_gsStringArrayFn( 'unloggedItemsBefore', items, { default: defaults.acUserLogin.unloggedItemsBefore });
    }

    /**
     * Getter/Setter
     * Returns the HTML content to be put as the 'verify_ask' section
     * @param {String|Function} label a string or a function which returns a string
     * @returns {String}
     */
    verifyAskTextOne( label ){
        return this.base_gsStringObjectFn( 'verifyAskTextOne', label, { default: defaults.acUserLogin.verifyAskTextOne });
    }
}
