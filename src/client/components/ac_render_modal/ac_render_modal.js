/*
 * pwix:accounts/src/client/components/ac_render_modal/ac_render_modal.js
 * 
 * Parms:
 *  - companion: the acCompanion object
 */

import { pwixModal } from 'meteor/pwix:modal';

import { acPanel } from '../../classes/ac_panel.js';

import './ac_render_modal.html';

Template.ac_render_modal.onCreated( function(){
    const self = this;

    // trace panel changes
    self.autorun(() => {
        const panel = pwixAccounts.DisplayManager.panel();
        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_PANEL ){
            console.log( 'panel', panel );
        }
    });

    // whether we have to open a new dialog ?
    //  one should NEVER directly set the panel value - the right way is to DisplayManager.ask()
    self.autorun(() => {
        const panel = pwixAccounts.DisplayManager.panel();
        if( panel && panel !== AC_PANEL_NONE && pwixModal.count() === 0 ){
            if( pwixAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
                console.log( 'pwix:accounts ac_render_modal run the '+panel+' modal' );
            }
            pwixModal.run({
                ... Template.currentData(),
                ... {
                    mdBody: acPanel.template( panel ),
                    mdTitle: acPanel.title( panel ),
                    mdFooter: 'ac_footer'
                }
            });
        }
    });

    // whether we want close the current modal ?
    //  one should NEVER directly set the AC_PANEL_NONE - the right way is to DisplayManager.release()
    self.autorun(() => {
        const panel = pwixAccounts.DisplayManager.panel();
        if( !panel || panel === AC_PANEL_NONE ){
            if( pwixModal.count() > 0 ){
                pwixModal.close();
            }
        }
    });

    // update title and body
    self.autorun(() => {
        const panel = pwixAccounts.DisplayManager.panel();
        if( panel && panel !== AC_PANEL_NONE ){
            pwixModal.setTitle( acPanel.title( panel ));
            pwixModal.setBody( acPanel.template( panel ));
        }
    });
});
