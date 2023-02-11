/*
 * pwix:accounts/src/client/components/ac_footer_buttons/ac_footer_buttons.js
 *
 * Provides various buttons, to be displayed either in a modal footer, or in the bottom of a div.
 * 
 * Parms:
 *  - aculInstance: the acUserLogin template instance
 *      Is undefined when invoked from ac_reset_pwd template
 *      Take care!
 * or
 * - me: the name of the requesting panel
 *      Only set by ac_reset_pwd template
 */
import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_footer_buttons.html';

Template.ac_footer_buttons.helpers({

    // buttons helpers
    btnClass( btn ){
        return btn.class || '';
    },

    btnLabel( btn ){
        return btn.key && btn.key.length ? i18n.label( AC_I18N, 'buttons.'+btn.key ) : '';
    },

    // returns the ordered list of buttons to be displayed depending of the currently displayed template
    buttons(){
        return pwiAccounts.Display.buttons( this.me ? this.me : pwiAccounts.Display.asked());
    },

    // whether to display this link
    haveLink( link ){
        const ret = link.have && this.aculInstance ? this.aculInstance.AC.options[link.have]() : link.have;
        return ret;
    },

    linkLabel( link ){
        return link.key && link.key.length ? i18n.label( AC_I18N, 'buttons.'+link.key ) : '';
    },

    linkTarget( link ){
        return link.target;
    },

    // returns the ordered list of links to be displayed depending of the current state
    links(){
        return pwiAccounts.Display.links( this.me ? this.me : pwiAccounts.Display.asked());
    }
});

Template.ac_footer_buttons.events({

    'click .ac-link'( event, instance ){
        //console.log( event );
        pwiAccounts.Display.asked( instance.$( event.currentTarget ).find( 'a' ).attr( 'data-ac-target' ), Template.currentData().aculInstance.AC.uuid );
    },

    'click .ac-cancel'( event, instance ){
        //console.log( 'trigger ac-button-cancel' );
        instance.$( event.target ).trigger( 'ac-button-cancel' );
    },

    'click .ac-submit'( event, instance ){
        //instance.$( event.target ).closest( '.acUserLogin' ).find( '.ac-user-login' ).trigger( 'ac-button-submit' );
        const aculInstance = Template.currentData().aculInstance;
        let target = instance.$( event.target );
        let data = {};
        if( aculInstance ){
            target = $( '.acUserLogin#'+aculInstance.AC.uuid );
            data.uuid = aculInstance.AC.uuid;
        }
        //console.log( target );
        target.trigger( 'ac-button-submit', data );
    }
});
