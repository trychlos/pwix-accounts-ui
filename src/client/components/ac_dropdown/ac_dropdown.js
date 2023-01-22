/*
 * pwi:accounts/src/client/components/ac_dropdown/ac_dropdown.js
 * 
 * The 'acUserLogin' template make sure that this template is only rendered when needed, i.e.:
 * - either a user is logged-in, and the 'loggedButtonShown' is true,
 * - or (not exclusive) when no user is logged, and the 'unloggedButtonShown' is true.
 * 
 * Parms:
 *  - dialog: the acDialog which manages this 'acUserLogin' template's hierarchy
 * 
 * pwi 2022-10-22 seems that the dropdown menu keeps somewhere a trace of previous options between itemsStandard() reloads.
 * Reproducing:
 *  - refresh the browser page (F5):
 *  - say the first displayed item is (for example) Signin, so activating it triggers a Signin transition: fine
 *  - after signin, the items are automagically reloaded, and the dropdown menu now displays signout, changepwd, verifymail options: fine
 *  - checking the DOM now actually shows these exactly same options
 *  - but activating the first one (here signout) actually triggers a signin transition, i.e. the first one of the previous load !!
 * This bug is referenced in TODO as #74.
 * Work-around: keep a copy of loaded items, referencing them by their index.
 */

import '../acMenuItems/acMenuItems.js';

import '../../../common/js/index.js';

import { acDialog } from '../../classes/ac_dialog.class.js';
import { acUser } from '../../classes/ac_user.class.js';

import './ac_dropdown.html';

Template.ac_dropdown.onCreated( function(){
    const self = this;

    self.AC = {
        // whether this template has to manage a dropdown menu
        hasDropdown(){
            const dialog = Template.currentData().dialog;
            const state = pwiAccounts.client.User.state();
            //console.log( 'state='+state, 'loggedButtonShown='+dialog.loggedButtonShown(), 'loggedButtonAction='+dialog.loggedButtonAction(), 'unloggedButtonShown='+dialog.unloggedButtonShown(), 'unloggedButtonAction='+dialog.unloggedButtonAction());
            return ( state === AC_LOGGED && dialog.loggedButtonShown() && dialog.loggedButtonAction() === acDialog.a.DROPDOWN )
                || ( state === AC_UNLOGGED && dialog.unloggedButtonShown() && dialog.unloggedButtonAction() === acDialog.a.DROPDOWN );
        }
    };
});

Template.ac_dropdown.onRendered( function(){
    const self = this;
    const btn = self.$( '.ac-dropdown button' );

    self.autorun(() => {
        if( self.AC.hasDropdown()){
            btn.attr( 'data-bs-toggle', 'dropdown' );
            btn.attr( 'data-bs-auto-close', 'true' );
            btn.attr( 'aria-expanded', 'false' );
        }
    });

    // a small note for the maintainer!
    //  the acDialog dynButtonContent() returns the button content as a HTML string
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
        btn.html( Template.currentData().dialog.dynButtonContent());
    });
});

Template.ac_dropdown.helpers({

    // the classes to be added to the button
    //  note that the 'dropdown-toggle' bootstrap class displays the down-arrow ':after' the label
    buttonClass(){
        return this.dialog.dynButtonClass();
    },

    // provides the acDialog instance to the child template (will be available as 'dataContext.dialog' object)
    // without this helper, the passed-in acDialog would have been available as 'dataContext' (without any other subkey)
    dialog(){
        return this.dialog;
    },

    // whether we have to manage a dropdown menu
    dropdown(){
        return Template.instance().AC.hasDropdown() ? 'dropdown' : '';
    },

    hasDropdown(){
        return Template.instance().AC.hasDropdown();
    }
});
