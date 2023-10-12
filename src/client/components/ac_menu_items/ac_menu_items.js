/*
 * pwix:accounts-ui/src/client/components/ac_menu_items/ac_menu_items.js
 *
 * This template is responsible to provide the dropdown menu items, either inside the ac_dropdown parent template,
 * or as individual items inside of an application menu.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import { acCompanion } from '../../classes/ac_companion.class.js';

import './ac_menu_items.html';

Template.ac_menu_items.onRendered( function(){
    const self = this;
    //console.log( self, Template.currentData());

    // a small note for the maintainer!
    //  the acCompanion dynItemsBefore/Standard/After() returns the button content as a HTML string
    //  first try has been to use a triple-braces helper '{{{ buttonContent }}}' to feed the data into the DOM
    //  it happens that this doesn't work as each content update seems to be added to the previous content
    //  visual effect is for example to have several user icons :(
    //  second try has been to empty() the button element just before returning the content: this doesn't work either
    //  as the content terminates empty! the remove() is rightly applied, but not replaced with the new content
    //  even if a console.log() shows that is correctly returned
    // I think/believe that the mix of DOM updates, Blaze reactivity and jQuery accesses may not work very well
    //  when dealing with HTML content and more generally with triple-braces helpers
    //  This solution, as a one-line jQuery which doesn't use Blaze helpers, works well.
    self.autorun(() => {
        const menu = self.$( '.ac-menu-items' );
        const ddItems = AccountsUI.menuItems( Template.currentData().AC.options );
        let html = '';
        ddItems.every(( it ) => {
            html += '<li>'+it+'</li>\n';
            return true;
        });
        menu.html( html );
    });
});

Template.ac_menu_items.events({

    'click .ac-dropdown-item'( event, instance ){
        //console.log( event, instance );
        const msg = $( event.currentTarget ).attr( 'data-ac-msg' );
        if( msg ){
            const parms = {
                AC: this.AC,
                panel: $( event.currentTarget ).attr( 'data-ac-panel' )
            };
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.PANEL ){
                console.log( 'pwix:accounts-ui ac_menu_items triggering', msg, parms );
            }
            // whatever be the chosen render mode, this event will pass through acUserLogin before bubbling up to Event.handler()
            console.debug( msg, parms );
            $( event.currentTarget ).trigger( msg, parms );
        }
    }
});
