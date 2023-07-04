/*
 * pwix:accounts-ui/src/common/js/startup.js
 */

Meteor.startup( function(){
    if( AccountsUI.opts().verbosity() & AC_VERBOSE_STARTUP ){
        console.log( 'pwix:accounts-ui AccountsUI', AccountsUI );
    }
});
