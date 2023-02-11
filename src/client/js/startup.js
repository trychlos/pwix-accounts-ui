/*
 * pwix:accounts/src/client/js/startup.js
 */

Meteor.startup( function(){
    //console.log( 'pwix:accounts setting package ready' );
    _ready.val = true,
    _ready.dep.changed();
});
