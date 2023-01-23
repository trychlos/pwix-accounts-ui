/*
 * pwix:accounts/src/client/components/ac_modal/ac_modal.js
 *
 * Creates a modal dialog which embeds the specified '<div>....</div>'.
 * 
 * Parms:
 *  - template: the name of the template to embed
 *  - display: the acDisplay instance (needed here as we must not be tied to where the modal is rendered in the HTML page)
 */
import { pwiI18n } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import '../ac_change_pwd/ac_change_pwd.js';
import '../ac_modal_buttons/ac_modal_buttons.js';
import '../ac_reset_ask/ac_reset_ask.js';
import '../ac_signin/ac_signin.js';
import '../ac_signout/ac_signout.js';
import '../ac_signup/ac_signup.js';
import '../ac_user_login/ac_user_login.js';

import './ac_modal.html';

Template.ac_modal.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        display: Template.currentData().display,

        // whether this modal exhibits a cancel button in the footer ?
        haveCancelButton(){
            return true;
        },

        // whether this modal exhibits a close button in the header ?
        haveCloseButton(){
            return true;
        },

        // whether this modal exhibits a submit button in the footer ?
        haveSubmitButton(){
            return true;
        },

        // whether this modal exhibits a non-empty title ?
        haveTitle(){
            return true;
        },

        uiBootstrap(){
            //console.log( 'uiBootstrap', pwiAccounts.conf.ui === pwiAccounts.ui.Bootstrap );
            return pwiAccounts.conf.ui === AC_UI_BOOTSTRAP;
        },

        uiJQuery(){
            //console.log( 'uiJQuery', pwiAccounts.conf.ui === pwiAccounts.ui.jQueryUI );
            return pwiAccounts.conf.ui === AC_UI_JQUERY;
        },

        // the id set on the top div of this template (div.ac-modal)
        topId: null
    };
});

Template.ac_modal.onRendered( function(){
    const self = this;

    // set a unique id on the top div of the template
    const uuid = self.AC.display.uuid();
    const modalAc = self.$( '.ac-modal' );
    self.AC.topId = uuid+'-ac';
    modalAc.attr( 'id', self.AC.topId );

    // initializing the jQueryUI dialog makes the html code be splitted so that the modalSelector
    //  be pushed down to the bottom of the body while the ac-modal parent stays in place.
    //  set an ID to the splitted div to be sure to be able to uniquely find it, and changes the
    //  modalSelector accordingly
    if( self.AC.uiJQuery()){
        const modalJq = self.$( self.AC.display.modalSelector());
        modalJq.attr( 'id', uuid+'-jq' );
        self.AC.display.modalSelector( '#'+uuid+'-jq' );

        modalJq.dialog({
            autoOpen: false,
            modal: true,
            width: 'auto',
            close: function( event, instance ){
                $( '#'+uuid+'-ac' ).trigger( 'hidden.bs.modal' );
            },
            open: function( event, instance ){
                $( '#'+uuid+'-ac' ).trigger( 'shown.bs.modal' );
            },
            click: function(){
                console.log( arguments );
            }
        });
    }

    // initialize Bootstrap
    if( self.AC.uiBootstrap()){
        this.$( '.ac-modal .bs-modal' ).draggable({
            handle: '.modal-header',
            cursor: 'grab'
        });
    }

    //console.log( 'modal rendered' );
});

Template.ac_modal.helpers({

    // whether to use a static backdrop
    backdrop(){
        const self = Template.instance();
        const display = self.AC.display;
        if( display.staticBackdrop() && display.ready()){
            self.$( display.modalSelector()).prop( 'data-bs-backdrop', 'static' );
        }
    },

    // whether this modal exhibits a body ?
    //  obviously always true, but here for consistency and completeness
    body(){
        return true;
    },

    // pass the acDisplay instance to child template
    display(){
        return { display: Template.instance().AC.display };
    },

    // whether this modal exhibits a footer ?
    //  true if have a cancel button or a submit one
    footer(){
        return Template.instance().AC.haveCancelButton() || Template.instance().AC.haveSubmitButton();
    },

    // whether this modal exhibits a header ?
    //  true if have a title (only for a modal rendering, which is the case here) or a close button
    header(){
        const display = Template.instance().AC.display;
        const title = display.modalTitle();
        const staticBackdrop = display.staticBackdrop();
        return title.length || !staticBackdrop;
    },

    // label translation
    i18n( opts ){
        return pwiI18n.label( pwiAccounts.strings, 'modal', opts.hash.label, opts.hash.language );
    },

    // provides the template name
    template(){
        return this.template;
    },

    // modal title
    title(){
        return Template.instance().AC.display.modalTitle();
    },

    // are we configured for a Bootstrap ui ?
    uiBootstrap(){
        return Template.instance().AC.uiBootstrap();
    },

    // are we configured for a jQuery UI ui ?
    uiJQuery(){
        return Template.instance().AC.uiJQuery();
    }
});

Template.ac_modal.events({

    // Bootstrap events
    //  also jQueryUI events redirected to ad-hoc plugin functions (see above)

    'hidden.bs.modal .ac-modal'( event, instance ){
        //console.log( 'hidden.bs.modal .ac-modal' );
        //console.log( 'trigger ac-button-cancel' );
        //console.log( event, instance );
        $( event.currentTarget ).trigger( 'ac-button-cancel' );
        $( event.currentTarget ).trigger( 'ac-hidden-modal', event.currentTarget );

        // because the template has been created 'on the fly'
        Blaze.remove( instance.view );
        pwiAccounts.Panel.view( null );
    },

    'shown.bs.modal .ac-modal'( event, instance ){
        //console.log( 'shown.bs.modal .ac-modal' );
        instance.$( 'input' ).first().focus();
        $( event.currentTarget ).trigger( 'ac-shown-modal', event.currentTarget );
    }
});

Template.ac_modal.onDestroyed( function(){
    //console.log( 'onDestroyed ac-modal' );
});
