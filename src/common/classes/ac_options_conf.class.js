/*
 * pwix:accounts/src/common/classes/ac_options_global_conf.class.js
 *
 * This class manages the global configuration options.
 */

import '../js/constants.js';

import { pwixOptions } from 'meteor/pwix:options';

export class acOptionsConf extends pwixOptions.Options {

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
     * The acOptions base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @returns {acOptionsConf}
     */
    constructor( options ){
        super( options );

        if( pwiAccounts.opts() && pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts instanciating acOptionsConf' );
        }

        return this;
    }

    /**
     * Getter/Setter
     * @param {String|Function} value whether and how do we want an email address
     * @returns {String}
     */
    haveEmailAddress( value ){
        return this.getset_String_Fn_Object( 'haveEmailAddress', value, { default: defaults.common.haveEmailAddress, ref: acOptionsConf.Fields });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value whether and how do we want a username
     * @returns {String}
     */
    haveUsername( value ){
        return this.getset_String_Fn_Object( 'haveUsername', value, { default: defaults.common.haveUsername, ref: acOptionsConf.Fields });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value how to inform the user of a bad email address when asking for resetting a password
     * @returns {String}
     */
    informResetWrongEmail( value ){
        return this.getset_String_Fn_Object( 'informResetWrongEmail', value, { default: defaults.common.informResetWrongEmail, ref: acOptionsConf.ResetWrongEmail });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required password length
     *  must be greater or equal to zero
     *  default to DEF_PASSWORD_LENGTH
     * @returns {Integer}
     */
    passwordLength( value ){
        return this.getset_Integer_Fn( 'passwordLength', value, { check: ( val ) => { return val >= 0 }, default: defaults.common.passwordLength });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value required password strength
     * @returns {String}
     */
    passwordStrength( value ){
        return this.getset_String_Fn_Object( 'passwordStrength', value, { default: defaults.common.passwordStrength, ref: acOptionsConf.Strength });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} twice whether we want use two password input fields when changing a user's password.
     *  This global value acts as the default value for all panels which want a new password.
     * @returns {Boolean}
     */
    passwordTwice( twice ){
        return this.getset_Bool_Fn( 'passwordTwice', twice, { default: defaults.common.passwordTwice });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value first text when resetting a password
     * @returns {String}
     */
    resetPwdTextOne( value ){
        return this.getset_String_Fn_Object( 'resetPwdTextOne', value, { default: defaults.common.resetPwdTextOne });
    }

    /**
     * Getter/Setter
     * @param {String|Function} value second text when resetting a password
     * @returns {String}
     */
    resetPwdTextTwo( value ){
        return this.getset_String_Fn_Object( 'resetPwdTextTwo', value, { default: defaults.common.resetPwdTextTwo });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} flag whether we want an email verification be sent on user creation
     * @returns {Boolean}
     */
    sendVerificationEmail( flag ){
        return this.getset_Bool_Fn( 'sendVerificationEmail', flag, { default: defaults.common.sendVerificationEmail });
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} twice whether we want use two password input fields when resetting a user's password.
     * @returns {Boolean}
     */
    resetPasswordTwice( twice ){
        return this.getset_Bool_Fn( 'resetPasswordTwice', twice, { default: defaults.common.resetPasswordTwice });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value the OR-ed integer which determines the verbosity level
     * @returns {Integer}
     */
    verbosity( value ){
        return this.getset_Integer_Fn( 'verbosity', value, { default: defaults.common.verbosity });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value required username length
     * @returns {Integer}
     */
    usernameLength( value ){
        return this.getset_Integer_Fn( 'usernameLength', value, { check: ( val ) => { return val >= 0 }, default: defaults.common.usernameLength });
    }
}
