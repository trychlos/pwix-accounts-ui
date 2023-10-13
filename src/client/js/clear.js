/*
 * pwix:accounts-ui/src/client/js/clear.js
 */

/**
 * @summary Clears the panel currently displayed by the named instance
 * @locus Client
 * @param {String} name the name of the target acUserLogin instance
 */
AccountsUI.clearPanel = function( name ){
    const instance = AccountsUI.Manager.byName( name );
    if( instance ){
        const panel = instance.AC.panel.get();
        if( panel && panel !== AccountsUI.C.Panel.NONE ){
            instance.$( '.ac-panel' ).trigger( 'ac-clear-panel' );
        }
    }
};
