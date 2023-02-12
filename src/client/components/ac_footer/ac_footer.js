/*
 * pwix:accounts/src/client/components/ac_footer/ac_footer.js
 *
 * Provides various buttons, to be displayed either in a modal footer, or in the bottom of a div.
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object, may be null when called from outside of the acUserLogin flow
 *  - panel: the displayed panel
 */
import { pwixI18n as i18n } from 'meteor/pwix:i18n';
import { pwixModal } from 'meteor/pwix:modal';

import { acPanel } from '../../classes/ac_panel.class.js';
import { IDisplayRequester } from '../../classes/idisplay_requester.interface.js';

import './ac_footer.html';

/*
Template.ac_footer.onCreated( function(){
    const self = this;

    self.AC = {
        panel: new ReactiveVar( null )
    };

    // make the panel a reactive var so that the footer is re-rendered on change
    self.autorun(() => {
        self.AC.panel.set( Template.currentData().panel );
    });
});


Template.ac_footer.onRendered( function(){
    const self = this;

    // change the modal title when the panel change
});
*/

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
        return acPanel.buttons( pwiAccounts.Displayer.IDisplayManager.panel());
    },

    // whether to display this link
    haveLink( link ){
        const ret = link.have && this.requester ? this.requester.opts()[link.have]() : link.have;
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
        return acPanel.links( pwiAccounts.Displayer.IDisplayManager.panel());
    }
});

Template.ac_footer.events({

    'click .ac-link'( event, instance ){
        //console.log( event );
        const panel = instance.$( event.currentTarget ).find( 'a' ).attr( 'data-ac-target' );
        pwiAccounts.Displayer.IDisplayManager.panel( panel );
    },

    'click .ac-cancel'( event, instance ){
        pwixModal.close();
    },

    'click .ac-submit'( event, instance ){
        const requester = Template.currentData().requester;
        const panel = Template.currentData().panel;
        if( requester && requester.IDisplayRequester && requester.IDisplayRequester instanceof IDisplayRequester ){
            requester.IDisplayRequester.target().trigger( 'ac-button-submit', { requester: requester, panel: panel });
        }
    }
});
