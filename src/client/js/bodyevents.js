/*
 * pwix:accounts-ui/src/client/js/bodyevents.js
 */

// the tracked events
_refs = [
    // a request to display a panel
    'ac-panel-changepwd-event',
    'ac-panel-resetask-event',
    'ac-panel-signin-event',
    'ac-panel-signout-event',
    'ac-panel-signup-event',
    'ac-panel-verifyask-event',
    // a change has been done on user data
    'ac-user-changedpwd-event',
    'ac-user-created-event',
    'ac-user-signedin-event',
    'ac-user-signedout-event',
    'ac-user-resetasked-event',
    'ac-user-resetdone-event',
    'ac-user-verifyasked-event',
    'ac-user-verifieddone-event',
    // other internal messages
    'ac-clear-panel',
    'ac-close',
    'ac-display-error',
    'ac-enter',
    'ac-render-div',
    'ac-render-modal',
    'ac-submit',
    // the modal events we may want to deal with
    'md-click',
    'md-close',
    'md-ready'
];

// install a general events handler
_refs.every(( name ) => {
    $( document ).on( name, ( event ) => {
        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.EVENT ){
            console.log( 'pwix:accounts-ui body event:', event.type );
        }
    });
    return true;
});
