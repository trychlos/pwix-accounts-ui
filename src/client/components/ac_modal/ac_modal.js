/*
 * pwi:accounts/src/client/components/ac_modal/ac_modal.js
 *
 * Creates a modal dialog which embeds the specified '<div>....</div>'.
 * 
 * Parms:
 *  - template: the name of the template to embed
 *  - dialog: the acDialog which manages this 'acUserLogin' template's hierarchy
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
            //console.log( 'uiBootstrap', pwiAccounts.conf.ui === pwiAccounts.client.ui.Bootstrap );
            return pwiAccounts.conf.ui === pwiAccounts.client.ui.Bootstrap;
        },

        uiJQuery(){
            //console.log( 'uiJQuery', pwiAccounts.conf.ui === pwiAccounts.client.ui.jQueryUI );
            return pwiAccounts.conf.ui === pwiAccounts.client.ui.jQueryUI;
        },

        // the id set on the top div of this template (div.ac-modal)
        topId: null
    };
});

Template.ac_modal.onRendered( function(){
    const self = this;
    const dialog = Template.currentData().dialog;

    // set a unique id on the top div of the template
    const uuid = dialog.uuid();
    const modalAc = self.$( '.ac-modal' );
    self.AC.topId = uuid+'-ac';
    modalAc.attr( 'id', self.AC.topId );

    // initializing the jQueryUI dialog makes the html code be splitted so that the modalSelector
    //  be pushed down to the bottom of the body while the ac-modal parent stays in place.
    //  set an ID to the splitted div to be sure to be able to uniquely find it, and changes the
    //  modalSelector accordingly
    if( self.AC.uiJQuery()){
        const modalJq = self.$( dialog.modalSelector());
        modalJq.attr( 'id', uuid+'-jq' );
        dialog.modalSelector( '#'+uuid+'-jq' );

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
    if( self.AC.uiBootstrap ){
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
        const dialog = this.dialog;
        if( dialog.staticBackdrop() && dialog.ready()){
            Template.instance().$( dialog.modalSelector()).prop( 'data-bs-backdrop', 'static' );
        }
    },

    // whether this modal exhibits a body ?
    //  obviously always true, but here for consistency and completeness
    body(){
        return true;
    },

    // provides the acDialog instance to the child template
    //  note: passing data=dialog set the whole child template data context as the acDialog object itself.
    //      instead, we want the data context be an object with a 'dialog' key
    dialog(){
        return { dialog: this.dialog };
    },

    // whether this modal exhibits a footer ?
    //  true if have a cancel button or a submit one
    footer(){
        return Template.instance().AC.haveCancelButton() || Template.instance().AC.haveSubmitButton();
    },

    // whether this modal exhibits a header ?
    //  true if have a title (only for a modal rendering, which is the case here) or a close button
    header(){
        const title = this.dialog.modalTitle();
        const staticBackdrop = this.dialog.staticBackdrop();
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
        return this.dialog.modalTitle();
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
        pwiAccounts.client.Panel.view( null );
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
