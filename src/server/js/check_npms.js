/*
 * pwix:accounts/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
    // whitelist packages which are included via a subfolder
    require( 'email-validator/package.json' );  // still not detected
    require( 'zxcvbn/package.json' );           // still not detected
}

checkNpmVersions({
    'email-validator': '^2.0.4',
    'printf': '^0.6.1',
    'zxcvbn': '^4.4.2'
},
    'pwix:accounts'
);
