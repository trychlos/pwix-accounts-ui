/*
 * pwix:accounts/src/common/js/startup.js
 */

Meteor.startup( function(){
    console.log( 'pwix:accounts setting package ready' );
    _ready.val = true,
    _ready.dep.changed();
});

Meteor.startup( function(){
    console.log( 'pwix:accounts pwiAccounts', pwiAccounts );
});
