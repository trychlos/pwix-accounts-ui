/*
 * pwix:accounts-ui/src/client/js/bodyevents.js
 */

import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

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
for( const name of _refs ){
    $( document ).on( name, ( event ) => {
        logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.EVENT }, 'document event:', event.type );
    });
}
