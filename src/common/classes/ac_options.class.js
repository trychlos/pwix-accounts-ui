/*
 * pwix:accounts-ui/src/common/classes/ac_options.class.js
 *
 * This class manages the global configuration options.
 */

import _ from 'lodash';

import '../js/constants.js';

import { AccountsHub } from 'meteor/pwix:accounts-conf';
import { Options } from 'meteor/pwix:options';

export class acOptions extends Options.Base {

    // static data
    //

    // borders colors
    static BorderedColors = [
        AccountsUI.C.Colored.NEVER,
        AccountsUI.C.Colored.VALIDATION,
        AccountsUI.C.Colored.MANDATORY
    ];

    // fields management
    static Fields = [
        AccountsHub.C.Identifier.NONE,
        AccountsHub.C.Identifier.OPTIONAL,
        AccountsHub.C.Identifier.MANDATORY
    ];

    // inform the user of a wrong email
    static WrongEmail = [
        AccountsUI.C.WrongEmail.OK,
        AccountsUI.C.WrongEmail.ERROR
    ];

    // password strength
    static Strength = [
        AccountsUI.C.Password.VERYWEAK,
        AccountsUI.C.Password.WEAK,
        AccountsUI.C.Password.MEDIUM,
        AccountsUI.C.Password.STRONG,
        AccountsUI.C.Password.VERYSTRONG
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
     * @param {Object} options the options to be managed
     * 
     * The acBase base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @returns {acOptions}
     */
    constructor( options ){
        super( options );
        const self = this;

        if( AccountsUI.opts() && AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acOptions' );
        }

        return this;
    }

    /**
     * Getter/Setter
     * @param {String|Function} value the borders of the fields must them be colored and how ?
     * @returns {String}
     */
    coloredBorders( value ){
        return this.base_gsStringFn( 'coloredBorders', value, { default: defaults.common.coloredBorders, ref: acOptions.ColoredBorders });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value how to inform the user of a bad email address when asking for resetting a password
     * @returns {String}
     */
    informWrongEmail( value ){
        return this.base_gsStringFn( 'informWrongEmail', value, { default: defaults.common.informWrongEmail, ref: acOptions.WrongEmail });
    }

    /**
     * Getter/Setter
     * @param {Function} fn a user function
     * @returns {Function}
     */
    onEmailVerifiedBeforeFn( fn ){
        return this.base_gsFn( 'onEmailVerifiedBeforeFn', fn, { default: defaults.common.onEmailVerifiedBeforeFn });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether we want display a confirmation dialog box on email verification done.
     * @returns {Boolean}
     */
    onEmailVerifiedBox( flag ){
        return this.base_gsBoolFn( 'onEmailVerifiedBox', flag, { default: defaults.common.onEmailVerifiedBox });
    }

    /**
     * Getter/Setter
     * @param {Function} fn a user function
     * @returns {Function}
     */
    onEmailVerifiedBoxCb( fn ){
        return this.base_gsFn( 'onEmailVerifiedBoxCb', fn, { default: defaults.common.onEmailVerifiedBoxCb });
    }

    /**
     * Getter/Setter
     * @param {Object|Function} text the content of the displayed confirmation dialog box
     * @returns {String}
     */
    onEmailVerifiedBoxMessage( text ){
        return this.base_gsStringObjectFn( 'onEmailVerifiedBoxMessage', text, { default: defaults.common.onEmailVerifiedBoxMessage });
    }

    /**
     * Getter/Setter
     * @param {Object|Function} text the title of the displayed confirmation dialog box
     * @returns {String}
     */
    onEmailVerifiedBoxTitle( text ){
        return this.base_gsStringObjectFn( 'onEmailVerifiedBoxTitle', text, { default: defaults.common.onEmailVerifiedBoxTitle });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required password length
     *  must be greater or equal to zero
     *  default to DEF_PASSWORD_LENGTH
     * @returns {Integer}
     */
    passwordLength( value ){
        return this.base_gsIntegerFn( 'passwordLength', value, { check: ( val ) => { return val >= 0 }, default: defaults.common.passwordLength });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value required password strength
     * @returns {String}
     */
    passwordStrength( value ){
        return this.base_gsStringFn( 'passwordStrength', value, { default: defaults.common.passwordStrength, ref: acOptions.Strength });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} twice whether we want use two password input fields when changing a user's password.
     *  This global value acts as the default value for all panels which want a new password.
     * @returns {Boolean}
     */
    passwordTwice( twice ){
        return this.base_gsBoolFn( 'passwordTwice', twice, { default: defaults.common.passwordTwice });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} twice whether we want use two password input fields when resetting a user's password.
     * @returns {Boolean}
     */
    resetPasswordTwice( twice ){
        return this.base_gsBoolFn( 'resetPasswordTwice', twice, { default: defaults.common.resetPasswordTwice });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value first text when resetting a password
     * @returns {String}
     */
    resetPwdTextOne( value ){
        return this.base_gsStringObjectFn( 'resetPwdTextOne', value, { default: defaults.common.resetPwdTextOne });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value second text when resetting a password
     * @returns {String}
     */
    resetPwdTextTwo( value ){
        return this.base_gsStringObjectFn( 'resetPwdTextTwo', value, { default: defaults.common.resetPwdTextTwo });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether we want an email verification be sent on user creation
     * @returns {Boolean}
     */
    sendVerificationEmail( flag ){
        return this.base_gsBoolFn( 'sendVerificationEmail', flag, { default: defaults.common.sendVerificationEmail });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required username length
     * @returns {Integer}
     */
    usernameLength( value ){
        return this.base_gsIntegerFn( 'usernameLength', value, { check: ( val ) => { return val >= 0 }, default: defaults.common.usernameLength });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value the OR-ed integer which determines the verbosity level
     * @returns {Integer}
     */
    verbosity( value ){
        return this.base_gsIntegerFn( 'verbosity', value, { default: defaults.common.verbosity });
    }
}
