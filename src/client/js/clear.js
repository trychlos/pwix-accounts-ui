/*
 * pwix:accounts-ui/src/client/js/clear.js
 */

/**
 * @summary Clears the current panel
 * @locus Client
 */
AccountsUI.clearPanel = function(){
    $( 'body' ).trigger( 'ac-clear-panel' );
};
