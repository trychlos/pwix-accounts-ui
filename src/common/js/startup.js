/*
 * pwix:accounts/src/common/js/startup.js
 */

Meteor.startup( function(){
    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_STARTUP ){
        console.log( 'pwix:accounts pwiAccounts', pwiAccounts );
    }
});
