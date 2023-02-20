/*
 * pwix:accounts/src/client/components/ac_footer/ac_footer.js
 *
 * Provides various buttons, to be displayed either in a modal footer, or in the bottom of a div.
 * 
 * Parms:
 *  - requester: ANONYMOUS or a acUserLoginCompanion object
 *  - submitCallback: if provided, a callback which will be called on .ac-submit button click
 *      instead of triggering an 'ac-submit' event
 */
import { pwixI18n as i18n } from 'meteor/pwix:i18n';
import { pwixModal } from 'meteor/pwix:modal';

import { acPanel } from '../../classes/ac_panel.class.js';

import './ac_footer.html';

Template.ac_footer.helpers({

    // buttons helpers
    btnClass( btn ){
        return btn.class || '';
    },

    btnLabel( btn ){
        return btn.key && btn.key.length ? i18n.label( AC_I18N, 'buttons.'+btn.key ) : '';
    },

    // returns the ordered list of buttons to be displayed depending of the currently displayed template
    buttons(){
        return acPanel.buttons( pwiAccounts.DisplayManager.panel());
    },

    // whether to display this link
    haveLink( link ){
        const ret = link.have && ( this.requester && this.requester !== ANONYMOUS ) ? this.requester.opts()[link.have]() : link.have;
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
        return acPanel.links( pwiAccounts.DisplayManager.panel());
    }
});

Template.ac_footer.events({

    'click .ac-link'( event, instance ){
        const panel = instance.$( event.currentTarget ).find( 'a' ).attr( 'data-ac-target' );
        pwiAccounts.DisplayManager.panel( panel );
    },

    'click .ac-cancel'( event, instance ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
            console.log( 'pwix:accounts ac_footer closing modal' );
        }
        pwixModal.close();
    },

    'click .ac-submit'( event, instance ){
        const submitCallback = Template.currentData().submitCallback;
        if( submitCallback ){
            if( pwiAccounts.opts().verbosity() & AC_VERBOSE_SUBMIT_TRIGGER ){
                console.log( 'pwix:accounts ac_footer calling submitCallback()' );
            }
            submitCallback();
        } else {
            if( pwiAccounts.opts().verbosity() & AC_VERBOSE_SUBMIT_TRIGGER ){
                console.log( 'pwix:accounts ac_footer triggering', 'ac-submit' );
            }
            instance.$( event.currentTarget ).trigger( 'ac-submit' );
        }
    }
});
