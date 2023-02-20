/*
 * pwix:accounts/src/client/components/ac_dropdown/ac_dropdown.js
 * 
 * The 'acUserLogin' template make sure that this template is only rendered when needed, i.e.:
 * - either a user is logged-in, and the 'loggedButtonAction' is not hidden,
 * - or (not exclusive) when no user is logged, and the 'unloggedButtonAction' is not hidden.
 * 
 * Parms:
 *  - companion: the acUserLoginCompanion object
 */

import '../../../common/js/index.js';

import '../ac_menu_items/ac_menu_items.js';

import './ac_dropdown.html';

Template.ac_dropdown.onCreated( function(){
    const self = this;

    self.AC = {
        companion: Template.currentData().companion,

        // compute the class of the button
        btnClass( state ){
            let result = '';
            switch( state ){
                case AC_LOGGED:
                    result = self.AC.companion.opts().loggedButtonClass();
                    break;
                case AC_UNLOGGED:
                    result = self.AC.companion.opts().unloggedButtonClass();
                    break;
            }
            return result;
        },

        // set the content of the button
        btnContent( state ){
            let result = '';
            switch( state ){
                case AC_LOGGED:
                    result = self.AC.companion.opts().loggedButtonContent();
                    break;
                case AC_UNLOGGED:
                    result = self.AC.companion.opts().unloggedButtonContent();
                    break;
            }
            return result;
        },

        // whether this template has to manage a dropdown menu
        hasDropdown( state ){
            return ( state === AC_LOGGED && self.AC.companion.opts().loggedButtonAction() === AC_ACT_DROPDOWN )
                || ( state === AC_UNLOGGED && self.AC.companion.opts().unloggedButtonAction() === AC_ACT_DROPDOWN );
        }
    };
});

Template.ac_dropdown.onRendered( function(){
    const self = this;
    btn = self.$( '.ac-dropdown button' );

    self.autorun(() => {
        if( self.AC.hasDropdown( pwiAccounts.User.state())){
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
    //  second try has been to empty() the button element just before returning the content: this doesn't work neither
    //  as the content terminates empty! the remove() is rightly applied, but not replaced with the new content
    //  even if a console.log() shows that is correctly returned
    // I think/believe that the mix of DOM updates, Blaze reactivity and jQuery accesses may not work very well
    //  when dealing with HTML content and more generally with triple-braces helpers
    //  This solution, as a one-line jQuery which doesn't use Blaze helpers, works well.
    self.autorun(() => {
        //console.log( 'btnContent autorun' );
        btn.html( self.AC.btnContent( pwiAccounts.User.state()));
    });
});

Template.ac_dropdown.helpers({

    // the classes to be added to the button
    //  note that the 'dropdown-toggle' bootstrap class displays the down-arrow ':after' the label
    buttonClass(){
        //console.log( 'buttonClass helper' );
        return Template.instance().AC.btnClass( pwiAccounts.User.state());
    },

    // whether we have to manage a dropdown menu
    dropdown(){
        return Template.instance().AC.hasDropdown( pwiAccounts.User.state()) ? 'dropdown' : '';
    },

    hasDropdown(){
        return Template.instance().AC.hasDropdown( pwiAccounts.User.state());
    }
});
