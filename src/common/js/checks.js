/*
 * pwix:accounts-ui/src/common/js/checks.js
 */

import { AccountsTools } from 'meteor/pwix:accounts-tools';

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
            return AccountsTools.checkEmailAddress( email, opts );
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
            return AccountsTools.checkPassword( password, opts );
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
            return AccountsTools.checkUsername( username, opts );
        }
    }
};
