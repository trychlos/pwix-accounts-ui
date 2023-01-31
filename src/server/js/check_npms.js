/*
 * pwix:editor/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
    // whitelist packages which are included via a subfolder
    require( '@popperjs/core/package.json' );
    require( 'bootstrap/package.json' );
}

checkNpmVersions({
    '@popperjs/core': '^2.11.6',
    'bootstrap': '^5.2.1',
    'email-validator': '^2.0.4',
    'printf': '^0.6.1',
    'uuid': '^9.0.0',
    'zxcvbn': '^4.4.2'
    }, 'pwix:editor' );
