/*
 * pwix:accounts-ui/src/client/components/ac_footer/ac_footer.js
 *
 * Provides various buttons, to be displayed either in a modal footer, or in the bottom of a div.
 * 
 * Parms:
 *  - companion: ANONYMOUS or a acCompanion object
 *  - submitCallback: if provided, a callback which will be called on .ac-submit button click
 *      instead of triggering an 'ac-submit' event
 */
import { pwixI18n as i18n } from 'meteor/pwix:i18n';
import { Modal } from 'meteor/pwix:modal';
import { ReactiveVar } from 'meteor/reactive-var';

import { acCompanion } from '../../classes/ac_companion.class.js';
import { acPanel } from '../../classes/ac_panel.js';

import './ac_footer.html';

Template.ac_footer.onCreated( function(){
    const self = this;

    self.AC = {
        companion: null,
        buttons: new ReactiveVar( acPanel.buttons( AccountsUI.DisplayManager.panel()))
    };

    // get companion
    self.autorun(() => {
        const companion = Template.currentData().companion;
        if( companion && companion instanceof acCompanion ){
            self.AC.companion = companion;
        }
    });

    // build an adapted buttons list
    self.autorun(() => {
        if( self.AC.companion ){
            const haveCancelButton = self.AC.companion.opts().haveCancelButton();
            //console.debug( 'haveCancelButton', haveCancelButton );
            let _buttons = [];
            acPanel.buttons( AccountsUI.DisplayManager.panel()).every(( btn ) => {
                //console.debug( btn.class );
                //console.debug( btn.class.includes( 'ac-cancel' ));
                if( !btn.class.includes( 'ac-cancel' ) || haveCancelButton ){
                    _buttons.push( btn );
                }
                return true;
            });
            self.AC.buttons.set( _buttons );
        }
    });
});

Template.ac_footer.helpers({

    // buttons helpers
    btnClass( btn ){
        return btn.class || '';
    },

    btnLabel( btn ){
        return btn.key && btn.key.length ? i18n.label( I18N, 'buttons.'+btn.key ) : '';
    },

    // returns the ordered list of buttons to be displayed depending of the currently displayed template
    buttons(){
        return Template.instance().AC.buttons.get();
    },

    // whether to display this link
    haveLink( link ){
        //console.debug( link );
        const ret = link.have && ( this.companion && this.companion !== ANONYMOUS ) ? this.companion.opts()[link.have]() : link.have;
        return ret;
    },

    linkLabel( link ){
        return link.key && link.key.length ? i18n.label( I18N, 'buttons.'+link.key ) : '';
    },

    // returns the ordered list of links to be displayed depending of the current state
    links(){
        return acPanel.links( AccountsUI.DisplayManager.panel());
    }
});

Template.ac_footer.events({

    'click .ac-link'( event, instance ){
        const panel = instance.$( event.currentTarget ).find( 'a' ).attr( 'data-ac-target' );
        //console.debug( panel );
        AccountsUI.DisplayManager.panel( panel );
    },

    'click .ac-cancel'( event, instance ){
        if( AccountsUI.opts().verbosity() & AC_VERBOSE_MODAL ){
            console.log( 'pwix:accounts-ui ac_footer closing modal' );
        }
        Modal.close();
    },

    'click .ac-submit'( event, instance ){
        const submitCallback = Template.currentData().submitCallback;
        if( submitCallback ){
            if( AccountsUI.opts().verbosity() & AC_VERBOSE_SUBMIT ){
                console.log( 'pwix:accounts-ui ac_footer calling submitCallback()' );
            }
            submitCallback();
        } else {
            if( AccountsUI.opts().verbosity() & AC_VERBOSE_SUBMIT ){
                console.log( 'pwix:accounts-ui ac_footer triggering', 'ac-submit' );
            }
            instance.$( event.currentTarget ).trigger( 'ac-submit' );
        }
    }
});
