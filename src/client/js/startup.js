/*
 * pwix:accounts/src/client/js/startup.js
 */

Meteor.startup( function(){
    _ready.val = true,
    _ready.dep.changed();
    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_READY ){
        console.log( 'pwix:accounts ready', pwiAccounts.ready());
    }
});
