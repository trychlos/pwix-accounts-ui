/*
 * pwix:accounts-ui/src/client/components/ac_footer/ac_footer.js
 *
 * Provides various buttons, to be displayed either in a modal footer, or in the bottom of a div.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *  - submitCallback: if provided, a callback which will be called on .ac-submit button click
 *      instead of triggering an 'ac-submit' event
 *      this is needed because a modal (with a footer) can be displayed outside of the acUserLogin workflow
 */
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './ac_footer.html';

Template.ac_footer.onCreated( function(){
    const self = this;

    self.AC = {
        buttons: new ReactiveVar( [] )
    };

    // build an adapted buttons list
    self.autorun(() => {
        const parentAC = Template.currentData().AC
        const haveCancelButton = parentAC.options.haveCancelButton();
        const haveOKButton = parentAC.options.haveOKButton();
        //console.debug( 'haveCancelButton', haveCancelButton );
        let _buttons = [];
        AccountsUI.Panel.buttons( parentAC.panel.get()).every(( btn ) => {
            if( btn.class.includes( 'ac-cancel' )){
                if( haveCancelButton ){
                    _buttons.push( btn );
                }
            }
            if( btn.class.includes( 'ac-submit' )){
                if( haveOKButton ){
                    _buttons.push( btn );
                }
            }
            return true;
        });
        self.AC.buttons.set( _buttons );
    });
});

Template.ac_footer.helpers({

    // buttons helpers
    btnClass( btn ){
        return btn.class || '';
    },

    btnLabel( btn ){
        return btn.key && btn.key.length ? pwixI18n.label( I18N, 'buttons.'+btn.key ) : '';
    },

    // returns the ordered list of buttons to be displayed depending of the currently displayed template
    buttons(){
        return Template.instance().AC.buttons.get();
    },

    // whether to display this link
    haveLink( link ){
        //console.debug( link );
        const ret = link.have && ( this.AC ? this.AC.options[link.have]() : link.have );
        return ret;
    },

    linkLabel( link ){
        return link.key && link.key.length ? pwixI18n.label( I18N, 'buttons.'+link.key ) : '';
    },

    // returns the ordered list of links to be displayed depending of the current state
    links(){
        return AccountsUI.Panel.links( this.AC.panel.get());
    }
});

Template.ac_footer.events({

    'click .ac-link'( event, instance ){
        const panel = instance.$( event.currentTarget ).find( 'a' ).attr( 'data-ac-target' );
        //console.debug( panel );
        this.AC.panel.set( panel );
    },

    'click .ac-cancel'( event, instance ){
        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.MODAL ){
            console.log( 'pwix:accounts-ui ac_footer closing modal' );
        }
        if( this.AC.options.renderMode() === AccountsUI.C.Render.MODAL ){
            Modal.close();
        }
    },

    'click .ac-submit'( event, instance ){
        const submitCallback = Template.currentData().submitCallback;
        if( submitCallback ){
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.SUBMIT ){
                console.log( 'pwix:accounts-ui ac_footer calling submitCallback()' );
            }
            submitCallback();
        } else {
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.SUBMIT ){
                console.log( 'pwix:accounts-ui ac_footer triggering', 'ac-submit' );
            }
            this.AC.target.trigger( 'ac-submit' );
        }
    }
});
