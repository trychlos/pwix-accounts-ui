/*
 * pwix:accounts-ui/src/client/components/ac_dropdown/ac_dropdown.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import '../../../common/js/index.js';

import '../ac_menu_items/ac_menu_items.js';

import './ac_dropdown.html';

Template.ac_dropdown.onCreated( function(){
    const self = this;

    self.AC = {
        // compute the class of the button
        //  this depend of the provided configuration options, and maybe also of the current user connection state
        buttonClass( parentAC ){
            let result = '';
            state = AccountsUI.Connection.state();
            switch( state ){
                case AccountsUI.C.Connection.LOGGED:
                    result = parentAC.options.loggedButtonClass();
                    break;
                case AccountsUI.C.Connection.UNLOGGED:
                    result = parentAC.options.unloggedButtonClass();
                    break;
            }
            return result;
        },

        // set the content of the button
        buttonContent( parentAC ){
            let result = '';
            state = AccountsUI.Connection.state();
            switch( state ){
                case AccountsUI.C.Connection.LOGGED:
                    result = parentAC.options.loggedButtonContent();
                    break;
                case AccountsUI.C.Connection.UNLOGGED:
                    result = parentAC.options.unloggedButtonContent();
                    break;
            }
            return result;
        }
    };
});

Template.ac_dropdown.onRendered( function(){
    const self = this;
    btn = self.$( '.ac-dropdown button' );

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
        btn.html( self.AC.buttonContent( Template.currentData().AC ));
    });
});

Template.ac_dropdown.helpers({
    // the classes to be added to the button
    //  note that the 'dropdown-toggle' bootstrap class displays the down-arrow '::after' the label
    buttonClass(){
        return Template.instance().AC.buttonClass( this.AC );
    },
    // obviously only display a dropdown menu if there is at least one item
    //  for now just display the dropdown
    emptyDropdown(){
        return false;
    }
});
