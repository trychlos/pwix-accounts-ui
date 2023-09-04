/*
 * pwix:accounts-ui/src/client/components/ac_render_modal/ac_render_modal.js
 * 
 * Parms:
 *  - companion: the acCompanion object
 */

import { Modal } from 'meteor/pwix:modal';

import { acCompanion } from '../../classes/ac_companion.class.js';
import { acPanel } from '../../classes/ac_panel.js';

import './ac_render_modal.html';

Template.ac_render_modal.onCreated( function(){
    const self = this;

    // whether we have to open a new dialog ?
    //  one should NEVER directly set the panel value - the right way is to DisplayManager.ask()
    self.autorun(() => {
        const panel = AccountsUI.DisplayManager.panel();
        if( panel && panel !== AC_PANEL_NONE && Modal.count() === 0 && acCompanion.areSame( Template.currentData().companion, AccountsUI.DisplayManager.requester())){
            if( AccountsUI.opts().verbosity() & AC_VERBOSE_MODAL ){
                console.log( 'pwix:accounts-ui ac_render_modal run the '+panel+' modal' );
            }
            const id = Modal.run({
                ... Template.currentData(),
                ... {
                    mdBody: acPanel.template( panel ),
                    mdTitle: acPanel.title( panel ),
                    mdFooter: 'ac_footer'
                }
            });
            AccountsUI.DisplayManager.modalId( id );
        }
    });

    // whether we want close the current modal ?
    //  one should NEVER directly set the AC_PANEL_NONE - the right way is to DisplayManager.release()
    self.autorun(() => {
        const panel = AccountsUI.DisplayManager.panel();
        if( Template.currentData().companion.modal() && ( !panel || panel === AC_PANEL_NONE )){
            if( Modal.count() > 0 ){
                Modal.close();
            }
            AccountsUI.DisplayManager.modalId( null );
        }
    });

    // update title and body
    self.autorun(() => {
        const panel = AccountsUI.DisplayManager.panel();
        if( panel && panel !== AC_PANEL_NONE && Modal.count() > 0 ){
            Modal.setTitle( acPanel.title( panel ));
            Modal.setBody( acPanel.template( panel ));
        }
    });
});
