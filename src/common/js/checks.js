/*
 * pwix:accounts-ui/src/common/js/checks.js
 */

import _ from 'lodash';
import emailValidator from 'email-validator';
import zxcvbn from 'zxcvbn';

import { pwixI18n } from 'meteor/pwix:i18n';

AccountsUI = {
    ...AccountsUI,
    ...{
        //
        // Rationale: we need as usual check functions both on client and on server side.
        //  Both server and client sides use asynchronous code
        //

        /*
         * @summary: check that the proposed candidate email address is valid, and not already exists
         * @locus Anywhere
         * @param {String} email the email address to be checked
         * @param {Object} opts:
         *  - testSyntax: true|false, defaulting to true (test the syntax, returning an error if empty or bad syntax)
         *  - testExistance: true|false, defaulting to true (test the existance, positionning the flag in result object)
         * @returns {Promise} which resolves to the check result, as:
         *  - ok: true|false
         *  - exists: undefined|true|false
         *  - reason: the first reason for the tests have been failed
         *  - email: trimmed lowercase email address
         */
        async _checkEmailAddress( email, opts={} ){
            let result = {
                ok: undefined,
                exists: undefined,
                reason: undefined,
                email: ( email ? email.trim() : '' ).toLowerCase()
            };
            // if the value is empty
            if( !result.email || !result.email.length ){
                result.ok = false;
                result.reason = AccountsUI.C.Reason.EMAIL_EMPTY;
                return Promise.resolve( result );
            }
            return Promise.resolve( result )
                .then(( res ) => {
                    return ( opts.testSyntax !== false ) ? this._checkEmailAddressSyntax( res.email ) : Promise.resolve( result );
                })
                .then(( res ) => {
                    _.merge( result, res );
                    return ( opts.testExistance !== false && res.ok !== false ) ? this._checkEmailAddressExists( result.email ) : Promise.resolve( result );
                })
                .then(( res ) => {
                    _.merge( result, res );
                    return Promise.resolve( result );
                });
        },

        /*
         * @summary: check that the proposed candidate email address is syntaxically valid
         * @locus Anywhere
         * @param {String} email the email address to be checked
         * @returns {Promise} on client side which resolves to the check result,
         * @returns {Object} the check result itself on the server side, as:
         *  - ok: true|false: whether the syntax is ok or not
         *  - reason: undefined|set: if not ok, the reason of the returned error
         */
        _checkEmailAddressSyntax( email ){
            let result = {
                ok: undefined,
                reason: undefined
            };
            // is the email address syntactically correct ?
            if( emailValidator.validate( email )){
                result.ok = true;
            } else {
                result.ok = false;
                result.reason = AccountsUI.C.Reason.EMAIL_SYNTAX;
            }
            return result;
        },

        /*
         * @summary: check whether the candidate email address exists in our system
         * @locus Anywhere
         * @param {String} email the email address to be checked
         * @returns {Promise} which resolves to the check result, as:
         *  - exists: true|false
         */
        async _checkEmailAddressExists( email ){
            let result = {
                exists: undefined
            };
            // check for unicity
            if( Meteor.isClient ){
                return Meteor.callAsync( 'AccountsUI.byEmailAddress', email )
                    .then(( res ) => {
                        result.exists = ( res ? true : false );
                        return result;
                    });
            }
            // server side
            return AccountsUI._byEmailAddress( email ).then(( doc ) => {
                result.exists = ( doc ? true : false );
                return result;
            });
        },

        /*
         * @summary: check that the proposed candidate password is valid
         * @locus Anywhere
         * @param {String} password the password to be checked
         * @param {Object} opts:
         *  - testLength: true|false, defaulting to true (test the length vs the globally configured option)
         *  - testComplexity: true|false, defaulting to true (test the complexity)
         * @returns {Object} the check result, as:
         *  - ok: true|false
         *  - errors: an array of error messages
         *  - minScore: the minimal computed score depending of the required strength
         *  - zxcvbn: the zxcvbn computed result
         *  - password: the checked password
         */
        _checkPassword( password, opts={} ){
            let result = {
                ok: undefined,
                errors: [],
                minScore: -1,
                zxcvbn: null,
                password: password || ''
            };
            // compute min score function of required complexity
            result.minScore = AccountsUI._computeMinScore();
            // compute complexity first, so that the UI may display it
            result.zxcvbn = zxcvbn( result.password );
            // do not let the caller believe the password is ok if it is empty
            if( !password.length ){
                result.ok = false;
                return result;
            }
            // check for minimal length
            if( opts.testLength !== false && result.password.length < AccountsUI.opts().passwordLength()){
                result.ok = false;
                result.errors.push( pwixI18n.label( I18N, 'input_password.too_short' ));
                return result;
            }
            // check for complexity
            if( opts.testComplexity !== false && result.zxcvbn.score < result.minScore ){
                result.ok = false;
                result.errors.push( pwixI18n.label( I18N, 'input_password.too_weak' ));
            }
            // ok
            result.ok = true;
            return result;
        },

        /*
         * @summary: check that the proposed candidate username is valid, and not already exists
         * @locus Anywhere
         * @param {String} username the username to be checked
         * @param {Object} an option object with:
         *  - mandatory: whether the username is mandatory or optional, defaulting to the package configured value
         *  - testLength: true|false, defaulting to true (test the length vs the globally configured option)
         *  - testExistance: true|false, defaulting to true (test the existance, positionning the flag in result object)
         * @returns {Promise} which resolves to the check result, as:
         *  - ok: true|false
         *  - errors: [] an array of localized error messages
         *  - warnings: [] an array of localized warning messages
         *  - username: trimmed username
         */
        async _checkUsername( username, opts={} ){
            let result = {
                ok: true,
                errors: [],
                warnings: [],
                username: username ? username.trim() : ''
            };
            // stop there if the value is empty
            if( !result.username.length ){
                let mandatory = opts.mandatory || AccountsUI.opts().haveUsername();
                result.ok = ( mandatory === AccountsUI.C.Input.OPTIONAL );
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // check for minimal length
            if( opts.testLength !== false && result.username.length < AccountsUI.opts().usernameLength()){
                result.ok = false;
                result.errors.push( pwixI18n.label( I18N, 'input_username.too_short' ));
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // check for unicity
            if( opts.testExistance !== false ){
                if( Meteor.isClient ){
                    return Meteor.callAsync( 'AccountsUI.byUsername', result.username )
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
                    return AccountsUI._byUsername( result.username ).then(( doc ) => {
                        if( doc ){
                            result.ok = false;
                            result.errors.push( pwixI18n.label( I18N, 'input_username.already_exists' ));
                        }
                        return result;
                    });
                }
            }
        },

        _scores: [
            AccountsUI.C.Password.VERYWEAK,
            AccountsUI.C.Password.WEAK,
            AccountsUI.C.Password.MEDIUM,
            AccountsUI.C.Password.STRONG,
            AccountsUI.C.Password.VERYSTRONG
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
        }
    }
};
