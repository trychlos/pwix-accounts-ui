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

import { acShower } from '../../classes/ac_shower.class.js';

import './acMenuItems.html';

Template.acMenuItems.onCreated( function(){
    const self = this;

    self.AC = {
        display: new ReactiveVar( null )
    };

    self.autorun(() => {
        const dataContext = Template.currentData();
        if( Object.keys( dataContext ).includes( 'name' )){
            self.AC.display.set( acShower.byName( dataContext.name ));
        } else {
            self.AC.display.set( dataContext.aculInstance.AC.display );
        }
    });
});

Template.acMenuItems.onRendered( function(){
    const self = this;

    // a small note for the maintainer!
    //  the acShower dynItemsBefore/Standard/After() returns the button content as a HTML string
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
        const display = self.AC.display.get();
        if( display && menu ){
            let result = [];
            const before = display.dynItemsBefore();
            before.every(( it ) => {
                result.push( it );
                return true;
            });
            const std = display.dynItemsStandard();
            std.every(( it ) => {
                result.push( it );
                return true;
            });
            const after = display.dynItemsAfter();
            after.every(( it ) => {
                result.push( it );
                return true;
            });
            let html = '';
            result.every(( it ) => {
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
            $( event.currentTarget ).trigger( msg );
        }
    }
});
