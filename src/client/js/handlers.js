/*
 * pwix:accounts/src/client/js/handlers.js
 */

// Because the ac_reset_pwd dialog is run outside of the acUserLogin workflow, it has to be directly
//  attached to the <body> element. We want just here intercept the message sent on 

document.addEventListener( 'ac-user-resetpwd', ( event ) => {
    //console.log( 'this', this );
    //console.log( 'event', event );
    console.log( event.type, event.detail.email );
});

document.addEventListener( 'ac-user-verifymail', ( event ) => {
    console.log( event.type, event.detail.email );
});
