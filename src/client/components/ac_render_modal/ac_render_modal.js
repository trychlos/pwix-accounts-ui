/*
 * pwix:accounts-ui/src/client/components/ac_render_modal/ac_render_modal.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';

import './ac_render_modal.html';

Template.ac_render_modal.onCreated( function(){
    const self = this;

    let parentAC = null;

    // get the acUserLogin parent data structure
    self.autorun(() => {
        parentAC = Template.currentData().AC;
    });

    // whether we have to open a new dialog ?
    self.autorun(() => {
        if( parentAC && parentAC.options.renderMode() === AccountsUI.C.Render.MODAL ){
            const panel = parentAC.panel();
            if( panel && panel !== AccountsUI.C.Panel.NONE && Modal.count() === 0 ){
                if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.MODAL ){
                    console.log( 'pwix:accounts-ui ac_render_modal run the '+panel+' modal' );
                }
                // let the caller override our configuration, but take care of keeping our main class
                let o = _.merge({
                    mdBody: AccountsUI.Panel.template( panel ),
                    mdTitle: AccountsUI.Panel.title( panel ),
                    mdFooter: 'ac_footer'
                }, Template.currentData());
                o.mdClassesContent = ( o.mdClassesContent || '' ) + ' ac-content';
                Modal.run( o );
            }
        }
    });

    // whether we want close the current modal ?
    self.autorun(() => {
        if( parentAC && parentAC.options.renderMode() === AccountsUI.C.Render.MODAL ){
            const panel = parentAC.panel();
            if( !panel || panel === AccountsUI.C.Panel.NONE ){
                if( Modal.count() > 0 ){
                    Modal.close();
                }
            }
        }
    });

    // update title and body
    self.autorun(() => {
        if( parentAC && parentAC.options.renderMode() === AccountsUI.C.Render.MODAL ){
            const panel = parentAC.panel();
            if( panel && panel !== AccountsUI.C.Panel.NONE && Modal.count() > 0 ){
                Modal.set({
                    title: AccountsUI.Panel.title( panel ),
                    body: AccountsUI.Panel.template( panel )
                });
            }
        }
    });
});
