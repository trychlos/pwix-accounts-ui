/*
 * pwix:accounts-ui/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
    // whitelist packages which are included via a subfolder
    require( 'email-validator/package.json' );
    require( 'zxcvbn/package.json' );
}

checkNpmVersions({
    'email-validator': '^2.0.4',
    'lodash': '^4.17.0',
    'printf': '^0.6.1',
    'zxcvbn': '^4.4.2'
},
    'pwix:accounts-ui'
);
