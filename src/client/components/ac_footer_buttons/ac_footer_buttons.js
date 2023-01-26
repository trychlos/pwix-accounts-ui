/*
 * pwix:accounts/src/client/components/ac_footer_buttons/ac_footer_buttons.js
 *
 * Provides various buttons, to be displayed either in a modal footer, or in the bottom of a div.
 * 
 * Parms:
 *  - display: the acDisplay instance
 */
import { pwiI18n } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import './ac_footer_buttons.html';

Template.ac_footer_buttons.helpers({

    // buttons helpers
    btnClass( btn ){
        return btn.class || '';
    },

    btnLabel( btn ){
        return btn.key && btn.key.length ? pwiI18n.label( pwiAccounts.strings, 'buttons', btn.key ) : '';
    },

    // returns the ordered list of buttons to be displayed depending of the currently displayed template
    buttons(){
        return pwiAccounts.Panel.buttons( pwiAccounts.Panel.asked());
    },

    // whether to display this link
    haveLink( link ){
        const ret = link.have ? this.display[link.have]() : true;
        return ret;
    },

    linkLabel( link ){
        return link.key && link.key.length ? pwiI18n.label( pwiAccounts.strings, 'buttons', link.key ) : '';
    },

    linkTarget( link ){
        return link.target;
    },

    // returns the ordered list of links to be displayed depending of the current state
    links(){
        return pwiAccounts.Panel.links( pwiAccounts.Panel.asked());
    }
});

Template.ac_footer_buttons.events({

    'click .ac-link'( event, instance ){
        //console.log( event );
        pwiAccounts.Panel.asked( instance.$( event.currentTarget ).find( 'a' ).attr( 'data-ac-target' ));
    },

    'click .ac-cancel'( event, instance ){
        //console.log( 'trigger ac-button-cancel' );
        instance.$( event.target ).trigger( 'ac-button-cancel' );
    },

    'click .ac-submit'( event, instance ){
        instance.$( event.target ).closest( '.acUserLogin' ).find( '.ac-user-login' ).trigger( 'ac-button-submit' );
    }
});
