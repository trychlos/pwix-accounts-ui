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
        //  But server side requires synchronous results while client side works better with asynchronous code
        //

        /*
         * @summary: check that the proposed candidate email address is valid, and not already exists
         * @locus Anywhere
         * @param {String} email the email address to be checked
         * @param {Object} opts:
         *  - testSyntax: true|false, defaulting to true (test the syntax, returning an error if empty or bad syntax)
         *  - testExistance: true|false, defaulting to true (test the existance, positionning the flag in result object)
         * @returns {Promise} on client side which resolves to the check result,
         * @returns {Object} the check result itself on the server side, as:
         *  - ok: true|false
         *  - exists: undefined|true|false
         *  - reason: the first reason for the tests have been false
         *  - email: trimmed lowercase email address
         */
        _checkEmailAddress( email, opts={} ){
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
                return Meteor.isClient ? Promise.resolve( result ) : result;
            }
            // client side
            if( Meteor.isClient ){
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
            }
            // server side
            let res;
            if( opts.testSyntax !== false ){
                res = this._checkEmailAddressSyntax( result.email );
                _.merge( result, res );
            }
            if( opts.testExistance !== false && result.ok !== false ){
                res = this._checkEmailAddressExists( result.email );
                _.merge( result, res );
            }
            return result;
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
            return Meteor.isClient ? Promise.resolve( result ) : result;
        },

        /*
         * @summary: check whether the candidate email address exists in our system
         * @locus Anywhere
         * @param {String} email the email address to be checked
         * @returns {Promise} on client side which resolves to the check result,
         * @returns {Object} the check result itself on the server side, as:
         *  - exists: true|false
         */
        _checkEmailAddressExists( email ){
            let result = {
                exists: undefined
            };
            // check for unicity
            if( Meteor.isClient ){
                console.debug( email );
                return Meteor.callPromise( 'AccountsUI.byEmailAddress', email )
                    .then(( res, err ) => {
                        if( err ){
                            console.error( err );
                        } else {
                            result.exists = ( res ? true : false );
                        }
                        return result;
                    });
            }
            // server side
            const user = AccountsUI._byEmailAddress( email );
            result.exists = ( res ? true : false );
            return result;
        },

        /*
         * @summary: check that the proposed candidate password is valid
         * @locus Anywhere
         * @param {String} password the password to be checked
         * @returns {Promise} which eventually resolves to the check result, as:
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
            return Promise.resolve( result );
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
                result.ok = AccountsUI.opts().haveUsername() === AccountsUI.C.Input.OPTIONAL;
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
