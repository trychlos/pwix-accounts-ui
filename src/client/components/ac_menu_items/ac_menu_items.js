/*
 * pwix:accounts-ui/src/client/components/ac_menu_items/ac_menu_items.js
 *
 * This template is responsible to provide the dropdown menu items, either inside the ac_dropdown parent template,
 * or as individual items inside of an application menu.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import { Logger } from 'meteor/pwix:logger';

import './ac_menu_items.html';

const logger = Logger.get();

Template.ac_menu_items.onCreated( function(){
    const self = this;

    self.AC = {
        buildMenus( dataContext ){
            const menu = self.$( '.ac-menu-items' );
            AccountsUI.fn.menuItems( dataContext.AC.options ).then(( items ) => {
                let html = '';
                for( const it of items ){
                    html += '<li>'+it+'</li>\n';
                }
                menu.html( html );
            });
        }
    };
});

Template.ac_menu_items.onRendered( function(){
    const self = this;

    // a small note for the maintainer!
    //  the _itemsBefore/Standard/After() returns the button content as a HTML string
    //  first try has been to use a triple-braces helper '{{{ buttonContent }}}' to feed the data into the DOM
    //  it happens that this doesn't work as each content update seems to be added to the previous content
    //  visual effect is for example to have several user icons :(
    //  second try has been to empty() the button element just before returning the content: this doesn't work either
    //  as the content terminates empty! the remove() is rightly applied, but not replaced with the new content
    //  even if logs show that is correctly returned
    // I think/believe that the mix of DOM updates, Blaze reactivity and jQuery accesses may not work very well
    //  when dealing with HTML content and more generally with triple-braces helpers
    //  This solution, as a one-line jQuery which doesn't use Blaze helpers, works well.
    self.autorun(() => {
        self.AC.buildMenus( Template.currentData());
    });
});

Template.ac_menu_items.events({
    'click .ac-dropdown-item'( event, instance ){
        const msg = $( event.currentTarget ).attr( 'data-ac-event' );
        if( msg ){
            const parms = {
                AC: this.AC,
                panel: $( event.currentTarget ).attr( 'data-ac-panel' )
            };
            logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.PANEL }, 'ac_menu_items triggering', msg, parms );
            // whatever be the chosen render mode, this event will pass through acUserLogin before bubbling up
            $( event.currentTarget ).trigger( msg, parms );
        }
    }
});
