/*
 * pwix:accounts/src/common/js/startup.js
 */

Meteor.startup( function(){
    if( pwixAccounts.opts().verbosity() & AC_VERBOSE_STARTUP ){
        console.log( 'pwix:accounts pwixAccounts', pwixAccounts );
    }
});
