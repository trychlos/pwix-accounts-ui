/*
 * pwix:accounts-ui/src/client/components/ac_dropdown/ac_dropdown.js
 * 
 * The 'acUserLogin' template make sure that this template is only rendered when needed, i.e.:
 * - either a user is logged-in, and the 'loggedButtonAction' is not hidden,
 * - or (not exclusive) when no user is logged, and the 'unloggedButtonAction' is not hidden.
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../../../common/js/index.js';

import '../ac_menu_items/ac_menu_items.js';

import './ac_dropdown.html';

Template.ac_dropdown.onCreated( function(){
    const self = this;

    self.AC = {
        component: new ReactiveVar( null ),

        // compute the class of the button
        btnClass( state ){
            let result = '';
            const component = self.AC.component.get();
            if( component ){
                switch( state ){
                    case AccountsUI.C.Connection.LOGGED:
                        result = component.opts().loggedButtonClass();
                        break;
                    case AccountsUI.C.Connection.UNLOGGED:
                        result = component.opts().unloggedButtonClass();
                        break;
                }
            }
            return result;
        },

        // set the content of the button
        btnContent( state ){
            let result = '';
            const component = self.AC.component.get();
            if( component ){
                switch( state ){
                    case AccountsUI.C.Connection.LOGGED:
                        result = component.opts().loggedButtonContent();
                        break;
                    case AccountsUI.C.Connection.UNLOGGED:
                        result = component.opts().unloggedButtonContent();
                        break;
                }
            }
            return result;
        },

        // whether this template has to manage a dropdown menu
        hasDropdown( state ){
            let hasDropdown = false;
            const component = self.AC.component.get();
            if( component ){
                hasDropdown = ( state === AccountsUI.C.Connection.LOGGED && component.opts().loggedButtonAction() === AccountsUI.C.Button.DROPDOWN )
                    || ( state === AccountsUI.C.Connection.UNLOGGED && component.opts().unloggedButtonAction() === AccountsUI.C.Button.DROPDOWN )
            }
            return hasDropdown;
        }
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });
});

Template.ac_dropdown.onRendered( function(){
    const self = this;
    btn = self.$( '.ac-dropdown button' );

    self.autorun(() => {
        if( self.AC.hasDropdown( AccountsUI.Connection.state())){
            btn.attr( 'data-bs-toggle', 'dropdown' );
            btn.attr( 'data-bs-auto-close', 'true' );
            btn.attr( 'aria-expanded', 'false' );
        } else {
            btn.attr( 'data-bs-toggle', '' );
            btn.attr( 'data-bs-auto-close', '' );
            btn.attr( 'aria-expanded', '' );
        }
    });

    // a small note for the maintainer!
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
        //console.log( 'btnContent autorun' );
        btn.html( self.AC.btnContent( AccountsUI.Connection.state()));
    });
});

Template.ac_dropdown.helpers({

    // the classes to be added to the button
    //  note that the 'dropdown-toggle' bootstrap class displays the down-arrow '::after' the label
    buttonClass(){
        //console.log( 'buttonClass helper' );
        return Template.instance().AC.btnClass( AccountsUI.Connection.state());
    },

    // whether we have to manage a dropdown menu
    dropdown(){
        return Template.instance().AC.hasDropdown( AccountsUI.Connection.state()) ? 'dropdown' : '';
    },

    hasDropdown(){
        return Template.instance().AC.hasDropdown( AccountsUI.Connection.state());
    }
});
