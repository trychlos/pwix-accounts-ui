/*
 * pwix:accounts/src/client/components/acMenuItems/acMenuItems.js
 *
 * This template is responsible to provide the dropdown menu items.
 * 
 * Parms:
 *  - name (opt.) the name attributed by the application to this 'acUserLogin' instance
 * or
 *  - aculInstance: the acUserLogin template instance
 * 
 * From the application point of view, the name is at the time the only way to identify a specific
 * 'acUserLogin' instance, and thus to get the managing acShower.
 * 
 * From our point of view, 'acMenuItems' component display the available items as a dropdown menu.
 * Though we do our best to inherit from a 'acUserLogin' configuration, we will limit ourselves
 * to a standard menu if we do not find any willing-to 'acUserLogin' instance.
 */

import '../../../common/js/index.js';

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';

import './acMenuItems.html';

Template.acMenuItems.onCreated( function(){
    const self = this;

    self.AC = {
        aculInstance: new ReactiveVar( null )
    };

    // does our best to get a acUserLogin Blaze template instance which is expected to main a menu configuration
    //  if not able to, then rely on standard options only
    self.autorun(() => {
        const dataContext = Template.currentData();
        if( Object.keys( dataContext ).includes( 'name' )){
            self.AC.aculInstance.set( acUserLoginCompanion.byName( dataContext.name ));
        } else {
            self.AC.aculInstance.set( dataContext.aculInstance );
        }
    });
});

Template.acMenuItems.onRendered( function(){
    const self = this;

    // a small note for the maintainer!
    //  the acUserLoginCompanion dynItemsBefore/Standard/After() returns the button content as a HTML string
    //  first try has been to use a triple-braces helper '{{{ buttonContent }}}' to feed the data into the DOM
    //  it happens that this doesn't work as each content update seems to be added to the previous content
    //  visual effect is for example to have several user icons :(
    //  second try has been to empty() the button element just before returning the content: this doesn't work neither
    //  as the content terminates empty! the remove() is rightly applied, but not replaced with the new content
    //  even if a console.log() shows that is correctly returned
    // I think/believe that the mix of DOM updates, Blaze reactivity and jQuery accesses may not work very well
    //  when dealing with HTML content and more generally with triple-braces helpers
    //  This solution, as a one-line jQuery which doesn't use Blaze helpers, works well.
    self.autorun(() => {
        const menu = self.$( '.acMenuItems' );
        const aculInstance = self.AC.aculInstance.get();
        const companion = aculInstance && aculInstance.AC ? aculInstance.AC.companion : null;
        if( menu ){
            ddItems = [];
            if( companion ){
                const before = companion.dynItemsBefore();
                before.every(( it ) => {
                    ddItems.push( it );
                    return true;
                });
            }
            const std = pwiAccounts.dropdownItems();
            std.every(( it ) => {
                ddItems.push( it );
                return true;
            });
            if( companion ){
                const after = companion.dynItemsAfter();
                after.every(( it ) => {
                    ddItems.push( it );
                    return true;
                });
            }
            let html = '';
            ddItems.every(( it ) => {
                html += '<li>'+it+'</li>\n';
                return true;
            });
            menu.html( html );
        }
    });
});

Template.acMenuItems.events({
    'click .ac-dropdown-item'( event, instance ){
        //console.log( event );
        const msg = $( event.currentTarget ).attr( 'data-ac-msg' );
        if( msg ){
            console.log( 'triggering', msg );
            //$( event.currentTarget ).trigger( msg );
            const aculInstance = instance.AC.aculInstance.get();
            const companion = aculInstance && aculInstance.AC ? aculInstance.AC.companion : null;
            const panel = $( event.currentTarget ).attr( 'data-ac-panel' );
            pwiAccounts.Displayer.IDisplayManager.trigger( msg, { requester: companion, panel: panel });
        }
    }
});
