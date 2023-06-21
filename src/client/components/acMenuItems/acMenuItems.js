/*
 * pwix:accounts-ui/src/client/components/acMenuItems/acMenuItems.js
 *
 * This template is provided to the application to let it insert our dropdown items in its own application menu.
 * The corresponding 'acUserLogin' template must be identified by its passed-in 'name'.
 * 
 * Parms:
 *  - name: the acUserLogin Blaze template instance name
 * 
 * This template is just a go-between to be able to identify the acCompanion object from the name, up to the ac_menu_items template.
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { acCompanion } from '../../classes/ac_companion.class.js';

import '../ac_menu_items/ac_menu_items.js';

import './acMenuItems.html';

Template.acMenuItems.onCreated( function(){
    const self = this;

    self.AC = {
        companion: new ReactiveVar( null ),
        name: new ReactiveVar( null )
    };

    // find the acCompanion by its name
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
            const companion = acCompanion.byName( name );
            if( companion ){
                self.AC.companion.set( companion );
            } else {
                throw new Error( 'unable to find acCompanion by name', name );
            }
        }
    });
});

Template.acMenuItems.helpers({
    // provide the acCompanion to ac_menu_items
    parms(){
        return {
            companion: Template.instance().AC.companion.get()
        };
    }
});
