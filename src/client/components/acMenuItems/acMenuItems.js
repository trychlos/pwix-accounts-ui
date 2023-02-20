/*
 * pwix:accounts/src/client/components/acMenuItems/acMenuItems.js
 *
 * This template is responsible to provide the dropdown menu items, either inside the ac_dropdown parent template,
 * or as individual items inside of an application menu. In this later case, having a name is the pnly way for the
 * application to be attached back to a specific 'acUserLogin' Blaze template instance.
 * 
 * Parms:
 *  - companion: the acUserLoginCompanion object, may be null
 *  - name: the acUserLogin Blaze template instance name, may be null or undefined
 * 
 * Each of these parm may be individually undefined, null or empty, but never both at the same time.
 * Exactly one of these parms MUST be provided.
 * 
 * From the application point of view, the name is at the time the only way to identify 
 * 
 * From our point of view, 'acMenuItems' component display the available items as a dropdown menu.
 * Though we do our best to inherit from a 'acUserLogin' configuration, we will limit ourselves
 * to a standard menu if we do not find any willing-to 'acUserLogin' instance.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../../../common/js/index.js';

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';

import './acMenuItems.html';

Template.acMenuItems.onCreated( function(){
    const self = this;

    self.AC = {
        companion: new ReactiveVar( null ),
        name: new ReactiveVar( null )
    };

    // do we have a companion ?
    self.autorun(() => {
        const companion = Template.currentData().companion;
        if( companion ){
            self.AC.companion.set( companion );
        }
    });

    // do we have a name ?
    self.autorun(() => {
        const name = Template.currentData().name;
        if( name ){
            self.AC.name.set( name );
        }
    });

    // if we have a name, then we also have a companion!
    self.autorun(() => {
        const name = self.AC.name.get();
        if( name ){
            self.AC.companion.set( acUserLoginCompanion.byName( name ));
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
        const companion = self.AC.companion.get();
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
            const parms = {
                companion: instance.AC.companion.get(),
                panel: $( event.currentTarget ).attr( 'data-ac-panel' )
            };
            if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_TRIGGER ){
                console.log( 'pwix:accounts acMenuItems triggering', msg, parms );
            }
            // will bubble up to acUserLogin Blaze instance, or IEventManager.handler(), depending of which takes it first
            // in a standard width display, acMenuItems are attached to an ac_dropdown, and acUserLogin Blaze template will manage them
            // in a small display, items are attached to the application menu, so only IEventHandler will be able to handle the events
            // this all depends of the target
            const target = instance.AC.companion.get().target() || $( event.currentTarget );
            target.trigger( msg, parms );
        }
    }
});
