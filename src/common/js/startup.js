/*
 * pwix:accounts-ui/src/common/js/startup.js
 */

Meteor.startup( function(){
    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.STARTUP ){
        console.log( 'pwix:accounts-ui AccountsUI', AccountsUI );
    }
});
