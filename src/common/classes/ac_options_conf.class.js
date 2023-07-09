/*
 * pwix:accounts-ui/src/common/classes/ac_options_global_conf.class.js
 *
 * This class manages the global configuration options.
 */

import '../js/constants.js';

import { Options } from 'meteor/pwix:options';

export class acOptionsConf extends Options.BaseOpt {

    // static data
    //

    // fields management
    static Fields = [
        AC_FIELD_NONE,
        AC_FIELD_OPTIONAL,
        AC_FIELD_MANDATORY
    ];

    // inform the user of a wrong email
    static ResetWrongEmail = [
        AC_RESET_EMAILSENT,
        AC_RESET_EMAILUNSENT,
        AC_RESET_EMAILERROR
    ];

    // password strength
    static Strength = [
        AC_PWD_VERYWEAK,
        AC_PWD_WEAK,
        AC_PWD_MEDIUM,
        AC_PWD_STRONG,
        AC_PWD_VERYSTRONG
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
     * The acBaseOpt base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @returns {acOptionsConf}
     */
    constructor( options ){
        super( options );

        if( AccountsUI.opts() && AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acOptionsConf' );
        }

        return this;
    }

    /**
     * Getter/Setter
     * @param {String|Function} value whether and how do we want an email address
     * @returns {String}
     */
    haveEmailAddress( value ){
        return this.baseOpt_gsStringFn( 'haveEmailAddress', value, { default: defaults.common.haveEmailAddress, ref: acOptionsConf.Fields });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value whether and how do we want a username
     * @returns {String}
     */
    haveUsername( value ){
        return this.baseOpt_gsStringFn( 'haveUsername', value, { default: defaults.common.haveUsername, ref: acOptionsConf.Fields });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value how to inform the user of a bad email address when asking for resetting a password
     * @returns {String}
     */
    informResetWrongEmail( value ){
        return this.baseOpt_gsStringFn( 'informResetWrongEmail', value, { default: defaults.common.informResetWrongEmail, ref: acOptionsConf.ResetWrongEmail });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} set whether the mandatory fields borders must be colored
     * @returns {Boolean}
     */
    mandatoryFieldsBorder( set ){
        return this.baseOpt_gsBoolFn( 'mandatoryFieldsBorder', set, { default: defaults.common.mandatoryFieldsBorder });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether we want display a confirmation dialog box on email verification done.
     * @returns {Boolean}
     */
    onVerifiedEmailBox( flag ){
        return this.baseOpt_gsBoolFn( 'onVerifiedEmailBox', flag, { default: defaults.common.onVerifiedEmailBox });
    }

    /**
     * Getter/Setter
     * @param {Function} fn a callback function
     * @returns {Function}
     */
    onVerifiedEmailCb( fn ){
        return this.baseOpt_gsFn( 'onVerifiedEmailCb', fn, { default: defaults.common.onVerifiedEmailCb });
    }

    /**
     * Getter/Setter
     * @param {Object|Function} text the content of the displayed confirmation dialog box
     * @returns {String}
     */
    onVerifiedEmailMessage( text ){
        return this.baseOpt_gsStringObjectFn( 'onVerifiedEmailMessage', text, { default: defaults.common.onVerifiedEmailMessage });
    }

    /**
     * Getter/Setter
     * @param {Object|Function} text the title of the displayed confirmation dialog box
     * @returns {String}
     */
    onVerifiedEmailTitle( text ){
        return this.baseOpt_gsStringObjectFn( 'onVerifiedEmailTitle', text, { default: defaults.common.onVerifiedEmailTitle });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required password length
     *  must be greater or equal to zero
     *  default to DEF_PASSWORD_LENGTH
     * @returns {Integer}
     */
    passwordLength( value ){
        return this.baseOpt_gsIntegerFn( 'passwordLength', value, { check: ( val ) => { return val >= 0 }, default: defaults.common.passwordLength });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value required password strength
     * @returns {String}
     */
    passwordStrength( value ){
        return this.baseOpt_gsStringFn( 'passwordStrength', value, { default: defaults.common.passwordStrength, ref: acOptionsConf.Strength });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} twice whether we want use two password input fields when changing a user's password.
     *  This global value acts as the default value for all panels which want a new password.
     * @returns {Boolean}
     */
    passwordTwice( twice ){
        return this.baseOpt_gsBoolFn( 'passwordTwice', twice, { default: defaults.common.passwordTwice });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value preferred user label
     * @returns {String}
     */
    preferredLabel( value ){
        return this.baseOpt_gsStringFn( 'preferredLabel', value, { default: defaults.common.preferredLabel, ref: Object.keys( AccountsUI.C.PreferredLabel )});
    }

    /**
     * Getter/Setter
     * @param {String|Function} value first text when resetting a password
     * @returns {String}
     */
    resetPwdTextOne( value ){
        return this.baseOpt_gsStringObjectFn( 'resetPwdTextOne', value, { default: defaults.common.resetPwdTextOne });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value second text when resetting a password
     * @returns {String}
     */
    resetPwdTextTwo( value ){
        return this.baseOpt_gsStringObjectFn( 'resetPwdTextTwo', value, { default: defaults.common.resetPwdTextTwo });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether we want an email verification be sent on user creation
     * @returns {Boolean}
     */
    sendVerificationEmail( flag ){
        return this.baseOpt_gsBoolFn( 'sendVerificationEmail', flag, { default: defaults.common.sendVerificationEmail });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} twice whether we want use two password input fields when resetting a user's password.
     * @returns {Boolean}
     */
    resetPasswordTwice( twice ){
        return this.baseOpt_gsBoolFn( 'resetPasswordTwice', twice, { default: defaults.common.resetPasswordTwice });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value the OR-ed integer which determines the verbosity level
     * @returns {Integer}
     */
    verbosity( value ){
        return this.baseOpt_gsIntegerFn( 'verbosity', value, { default: defaults.common.verbosity });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required username length
     * @returns {Integer}
     */
    usernameLength( value ){
        return this.baseOpt_gsIntegerFn( 'usernameLength', value, { check: ( val ) => { return val >= 0 }, default: defaults.common.usernameLength });
    }
}
