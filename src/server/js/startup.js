/*
 * pwi:accounts/src/server/js/startup.js
 */

if( Meteor.isServer ){
    Meteor.startup( function(){
        console.log( 'pwi:accounts/src/server/js/startup.js Meteor.startup()' );
    });
} else {
    console.error( 'pwi:accounts/src/server/js/startup.js should only be run from the server' );
}
