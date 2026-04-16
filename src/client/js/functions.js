/*
 * pwix:accounts-ui/src/client/js/functions.js
 *
 * This is the external API on client-side.
 */

import _ from 'lodash';

import { Tracker } from 'meteor/tracker';

AccountsUI = {
    ...AccountsUI,
    ...{

        /**
         * @summary Clears the panel currently displayed by the named instance
         * @locus Client
         * @param {String} name the name of the target acUserLogin instance
         */
        clearPanel( name ){
            const instance = AccountsUI.fn.nameGet( name );
            if( instance ){
                const panel = instance.AC.panel();
                if( panel && panel !== AccountsUI.C.Panel.NONE ){
                    instance.$( '.ac-panel' ).trigger( 'ac-clear-panel' );
                }
            }
        },

        /**
         * @locus Client
         * @summary Register callbacks on rebuilt menu items hook
         * @param {Function} fn A function which will be called each type the dropdown menu items is to be rebuilt.
         *  Prototype must be `async fn( menuItems<Array>, opts<acCompanionOptions>, state<>, unverified<Integer> ): <Array>`
         *  The function is expected to return the modified array.
         */
        onRebuildMenuItems( fn ){
            if( fn && _.isFunction( fn )){
                AccountsUI.fn._rebuildMenuItemsFns.push( fn );
            }
        }
    }
};
