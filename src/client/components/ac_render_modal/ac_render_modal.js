/*
 * pwix:accounts/src/client/components/ac_render_modal/ac_render_modal.js
 * 
 * Parms:
 *  - companion: the acCompanion object
 */

import { pwixModal } from 'meteor/pwix:modal';

import './ac_render_modal.html';

Template.ac_render_modal.onCreated( function(){
    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_MODAL ){
        console.log( 'pwix:accounts ac_render_modal run the modal' );
    }
    pwixModal.run({
        ... Template.currentData(),
        ... {
            mdFooter: 'ac_footer'
        }
    });
});
