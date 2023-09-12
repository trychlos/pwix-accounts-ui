/*
 * pwix:accounts-ui/src/client/components/ac_render_modal/ac_render_modal.js
 * 
 * Parms:
 *  - managerId: the identified allocated by acManager
 */

import { Modal } from 'meteor/pwix:modal';
import { ReactiveVar } from 'meteor/reactive-var';

import { acPanel } from '../../classes/ac_panel.js';

import './ac_render_modal.html';

Template.ac_render_modal.onCreated( function(){
    const self = this;

    self.AC = {
        component: new ReactiveVar( null )
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });

    // whether we have to open a new dialog ?
    //  one should NEVER directly set the panel value - the right way is to DisplayManager.ask()
    self.autorun(() => {
        const component = self.AC.component.get();
        if( component ){
            const panel = AccountsUI.DisplayManager.panel();
            if( panel && panel !== AC_PANEL_NONE && Modal.count() === 0 && component.companion.areSame( component.companion, AccountsUI.DisplayManager.requester())){
                if( AccountsUI.opts().verbosity() & AC_VERBOSE_MODAL ){
                    console.log( 'pwix:accounts-ui ac_render_modal run the '+panel+' modal' );
                }
                const id = Modal.run({
                    mdBody: acPanel.template( panel ),
                    mdTitle: acPanel.title( panel ),
                    mdFooter: 'ac_footer',
                    ... Template.currentData()
                });
                AccountsUI.DisplayManager.modalId( id );
            }
        }
    });

    // whether we want close the current modal ?
    //  one should NEVER directly set the AC_PANEL_NONE - the right way is to DisplayManager.release()
    self.autorun(() => {
        const component = self.AC.component.get();
        if( component ){
            const panel = AccountsUI.DisplayManager.panel();
            if( component.modal() && ( !panel || panel === AC_PANEL_NONE )){
                if( Modal.count() > 0 ){
                    Modal.close();
                }
                AccountsUI.DisplayManager.modalId( null );
            }
        }
    });

    // update title and body
    self.autorun(() => {
        const panel = AccountsUI.DisplayManager.panel();
        if( panel && panel !== AC_PANEL_NONE && Modal.count() > 0 ){
            Modal.set({
                title: acPanel.title( panel ),
                body: acPanel.template( panel )
            });
        }
    });
});
