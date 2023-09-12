/*
 * pwix:accounts-ui/src/client/components/ac_render_div/ac_render_div.js
 * 
 * Parms:
 *  - managerId: the identified allocated by acManager
 */

import './ac_render_div.html';

Template.ac_render_div.helpers({
    template(){
        return AccountsUI.Panel.template( AccountsUI.Display.panel());
    }
});
