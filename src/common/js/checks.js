/*
 * pwix:accounts-ui/src/common/js/checks.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import emailValidator from 'email-validator';
import zxcvbn from 'zxcvbn';

AccountsUI = {
    ...AccountsUI,
    ...{
        //
        // Rationale: we need as usual check functions both on client and on server side.
        //  But server side requires synchronous results while client side works better with asynchronous code
        //
        /*
         * @summary: check that the proposed candidate email address is valid, and not already exists
         * @locus Anywhere
         * @param {String} email the email address to be checked
         * @returns {Promise} on client side which resolves to the check result,
         * @returns {Object} the check result itself on the server side, as:
         *  - ok: true|false
         *  - errors: [] an array of localized error messages
         *  - warnings: [] an array of localized warning messages
         *  - email: trimmed lowercase email address
         */
        _checkEmailAddress( email ){
            let result = {
                ok: true,
                email: ( email ? email.trim() : '' ).toLowerCase(),
                errors: [],
                warnings: []
            };
            // stop there if the value is empty
            if( !result.email || !result.email.length ){
                if( AccountsUI.opts().haveEmailAddress() === AC_FIELD_OPTIONAL ){
                    result.warnings.push( pwixI18n.label( I18N, 'input_email.empty' ));
                } else {
                    result.ok = false;
                    result.errors.push( pwixI18n.label( I18N, 'input_email.empty' ));
                }
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // if the email address syntactically correct ?
            if( !emailValidator.validate( result.email )){
                result.ok = false;
                result.errors.push( pwixI18n.label( I18N, 'input_email.invalid' ));
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // check for unicity
            if( Meteor.isClient ){
                return Meteor.callPromise( 'AccountsUI.byEmailAddress', result.email )
                    .then(( res, err ) => {
                        if( err ){
                            console.error( err );
                        } else if( res ){
                            result.ok = false;
                            result.errors.push( pwixI18n.label( I18N, 'input_email.already_exists' ));
                        }
                        return result;
                    });
            } else {
                const user = AccountsUI._byEmailAddress( result.email );
                if( user ){
                    result.ok = false;
                    result.errors.push( pwixI18n.label( I18N, 'input_email.already_exists' ));
                }
                return result;
            }
        },

        /*
         * @summary: check that the proposed candidate username is valid, and not already exists
         * @locus Anywhere
         * @param {String} username the username to be checked
         * @returns {Promise} on client side which resolves to the check result,
         * @returns {Object} the check result itself on the server side, as:
         *  - ok: true|false
         *  - errors: [] an array of localized error messages
         *  - warnings: [] an array of localized warning messages
         *  - username: trimmed username
         */
        _checkUsername( username ){
            let result = {
                ok: true,
                errors: [],
                warnings: [],
                username: username ? username.trim() : ''
            };
            // stop there if the value is empty
            if( !result.username.length ){
                result.ok = AccountsUI.opts().haveUsername() === AC_FIELD_OPTIONAL;
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // check for minimal length
            if( result.username.length < AccountsUI.opts().usernameLength()){
                result.ok = false;
                result.errors.push( pwixI18n.label( I18N, 'input_username.too_short' ));
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // check for unicity
            if( Meteor.isClient ){
                return Meteor.callPromise( 'AccountsUI.byUsername', result.username )
                    .then(( res, err ) => {
                        if( err ){
                            console.error( err );
                        } else if( res ){
                            result.ok = false;
                            result.errors.push( pwixI18n.label( I18N, 'input_username.already_exists' ));
                        }
                        return result;
                    });
            } else {
                const user = AccountsUI._byUsername( result.username );
                if( user ){
                    result.ok = false;
                    result.errors.push( pwixI18n.label( I18N, 'input_username.already_exists' ));
                }
                return result;
            }
        },

        _scores: [
            AC_PWD_VERYWEAK,
            AC_PWD_WEAK,
            AC_PWD_MEDIUM,
            AC_PWD_STRONG,
            AC_PWD_VERYSTRONG
        ],

        _computeMinScore(){
            let i = 0;
            let minScore = -1;
            AccountsUI._scores.every(( it ) => {
                if( it === AccountsUI.opts().passwordStrength()){
                    minScore = i;
                    return false;
                }
                i += 1;
                return true;
            });
            return minScore;
        },

        /*
         * @summary: check that the proposed candidate password is valid
         * @locus Anywhere
         * @param {String} password the password to be checked
         * @returns {Promise} on client side which resolves to the check result,
         * @returns {Object} the check result itself on the server side, as:
         *  - ok: true|false
         *  - errors: [] an array of localized error messages
         *  - warnings: [] an array of localized warning messages
         *  - password: password,
         *  - minScore: the minimal computed score depending of the required strength
         *  - zxcvbn: the zxcvbn computed result
         */
        _checkPassword( password ){
            let result = {
                ok: true,
                errors: [],
                warnings: [],
                password: password || '',
                minScore: -1,
                zxcvbn: null
            };
            // compute min score function of required complexity
            result.minScore = AccountsUI._computeMinScore();
            // compute complexity
            result.zxcvbn = zxcvbn( result.password );
            // check for minimal length
            if( result.password.length < AccountsUI.opts().passwordLength()){
                result.ok = false;
                result.errors.push( pwixI18n.label( I18N, 'input_password.too_short' ));
                //console.debug( 'result', result, 'minPasswordLength', AccountsUI.opts().passwordLength());
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // check for complexity
            if( result.zxcvbn.score < result.minScore ){
                result.ok = false;
                result.errors.push( pwixI18n.label( I18N, 'input_password.too_weak' ));
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // return
            return Meteor.isClient ? Promise.resolve( result ) : result;
        }
    }
};
