/*
 * pwix:accounts-ui/src/client/components/acMenuItems/acMenuItems.js
 *
 * This template is provided to the application to let it insert our dropdown items in its own application menu.
 * The corresponding 'acUserLogin' template must be identified by its passed-in 'name'.
 * 
 * Parms:
 *  - name: the acUserLogin Blaze template instance name
 * 
 * This template is just a go-between to be able to identify the acUserLogin instance from the name, up to the ac_menu_items template.
 */

import '../ac_menu_items/ac_menu_items.js';

import './acMenuItems.html';

Template.acMenuItems.helpers({
    // provide the managerId to ac_menu_items
    parmsMenuItems(){
        const instance = AccountsUI.fn.nameGet( this.name );
        const AC = instance ? instance.AC : null;
        return {
            AC: AC
        };
    }
});
