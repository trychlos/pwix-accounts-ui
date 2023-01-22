/*
 * pwi:accounts/src/client/js/startup.js
 */

import '../../common/js/index.js';

if( Meteor.isClient ){
    Meteor.startup( function(){
        console.log( 'pwi:accounts/src/client/js/startup.js Meteor.startup() setting package ready' );
        _ready.val = true,
        _ready.dep.changed();
    });
}
