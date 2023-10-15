/*
 * pwix:accounts-ui/src/client/components/acUserLogin/acUserLogin.js
 *
 * Main user login template.
 * It is callable many times so that a different set of parameters produces different (though, of course, consistent) results.
 */

import _ from 'lodash';

import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import { acCompanionOptions } from '../../classes/ac_companion_options.class.js';

import '../../../common/js/index.js';

import '../../stylesheets/ac_accounts.less';

import '../ac_dropdown/ac_dropdown.js';
import '../ac_footer/ac_footer.js';
import '../ac_render_div/ac_render_div.js';
import '../ac_render_modal/ac_render_modal.js';

import '../ac_change_pwd/ac_change_pwd.js';
import '../ac_reset_ask/ac_reset_ask.js';
import '../ac_signin/ac_signin.js';
import '../ac_signout/ac_signout.js';
import '../ac_signup/ac_signup.js';
import '../ac_verify_ask/ac_verify_ask.js';

import '../acMandatoryField/acMandatoryField.js';
import '../acMandatoryFooter/acMandatoryFooter.js';

import './acUserLogin.html';

Template.acUserLogin.onCreated( function(){
    const self = this;

    self.AC = {
        id: Random.id(),
        options: new acCompanionOptions(),
        // this event target (useful when a modal is opened)
        target: null,
        // the currently displayed panel for this acUserLogin workflow
        panelRV: new ReactiveVar( AccountsUI.C.Panel.NONE ),

        // monitor the modal events (when apply)
        //  called from the panels.onRendered() function
        monitorModalEvents( $panel ){
            if( self.AC.options.renderMode() === AccountsUI.C.Render.MODAL ){
                // reset the current panel when the modal closes
                $panel.closest( '.md-modal' ).on( 'md-close', ( event ) => {
                    if( Modal.count() && self.AC.panel() !== AccountsUI.C.Panel.NONE ){
                        self.AC.panel( AccountsUI.C.Panel.NONE );
                    }
                });
                // deal with error messages
                //$panel.closest( '.ac-content' ).on( 'ac-display-error', ( event, data ) => {
                $panel.on( 'ac-display-error', ( event, data ) => {
                    self.AC.target.trigger( event.type, data );
                });
                // intercept Enter keypressed
                $panel.closest( '.ac-content' ).on( 'keydown', ( event ) => {
                    if( event.keyCode === 13 ){
                        self.AC.target.trigger( 'ac-enter', event );
                    }
                });
            }
        },

        // a getter/setter for the current panel
        panel( panel ){
            if( panel !== undefined ){
                self.AC.panelRV.set( panel || AccountsUI.C.Panel.NONE );
                AccountsUI.fn.errorMsg( '' );
            }
            return self.AC.panelRV.get();
        }
    };

    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
        console.log( 'pwix:accounts-ui instanciating acUserLogin id='+self.AC.managerId );
    }

    // register the configuration options
    self.autorun(() => {
        self.AC.options.base_set( _.merge( {}, defaults.acUserLogin, Template.currentData()));
    });

    // be not reactive to future changes to initialPanel
    self.AC.panel( self.AC.options.initialPanel() || AccountsUI.C.Panel.NONE );
});

Template.acUserLogin.onRendered( function(){
    const self = this;

    // set the name attribute if any
    self.autorun(() => {
        const name = self.AC.options.name();
        if( name ){
            AccountsUI.fn.nameAdd( name, self );
            self.$( '.acUserLogin' ).attr( 'data-ac-name', name );
        }
    });

    // set the event target to this component
    //  mainly used by ac_footer to send its events here
    self.AC.target = self.$( '.acUserLogin#'+self.AC.id );
});

Template.acUserLogin.helpers({

    // whether this template must be initially displayed as a dropdown button
    hasDropdown(){
        return Template.instance().AC.options.initialDisplay() === AccountsUI.C.Display.DROPDOWNBUTTON;
    },

    // set a unique id on the acUserLogin div
    id(){
        return Template.instance().AC.id;
    },

    // whether the display must be rendered as a modal one ?
    modal(){
        return Template.instance().AC.options.renderMode() === AccountsUI.C.Render.MODAL;
    },

    // do not pass the raw configuration options, but provides our own data to the child templates
    parms(){
        return {
            AC: Template.instance().AC
        };
    }
});

Template.acUserLogin.events({

    // handler here the message which want change the displayed panel (or open a new one)
    'ac-panel-changepwd-event/ac-panel-resetask-event/ac-panel-signin-event/ac-panel-signout-event/ac-panel-signup-event/ac-panel-verifyask-event .acUserLogin'( event, instance, data ){
        let panel = AccountsUI.Panel.fromEvent( event.type );
        console.debug( event.type, '->', panel );
        instance.AC.panel( panel );
    },

    'ac-close .acUserLogin'( event, instance ){
        instance.AC.panel( AccountsUI.C.Panel.NONE );
    },

    'ac-display-error .acUserLogin'( event, instance, data ){
        //console.debug( event, data );
        AccountsUI.fn.errorMsg( data );
    },

    // change the rendering mode
    'ac-render-modal .acUserLogin'( event, instance ){
        instance.AC.options.renderMode( AccountsUI.C.Render.MODAL );
    },
    'ac-render-div .acUserLogin'( event, instance ){
        instance.AC.options.renderMode( AccountsUI.C.Render.DIV );
    },

    // handle form submission
    'ac-submit .acUserLogin'( event, instance ){
        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.SUBMIT ){
            console.log( 'pwix:accounts-ui acUserLogin handling', event.type );
        }
        let mail = null;
        let password = null;
        let managed = false;
        const panel = instance.AC.panel();
        switch( panel ){
            case AccountsUI.C.Panel.CHANGEPWD:
                //console.debug( this );
                const pwd1 = $( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = $( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                AccountsUI.Account.changePwd( pwd1, pwd2, { target: instance.AC.target });
                managed = true;
                break;
            case AccountsUI.C.Panel.RESETASK:
                //console.log( 'element', $( '.ac-reset-ask' ));
                mail = $( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                AccountsUI.Account.resetAsk( mail, { target: instance.AC.target });
                managed = true;
                break;
            case AccountsUI.C.Panel.SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = $( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = $( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                AccountsUI.Account.loginWithPassword( mail, password, { target: instance.AC.target });
                managed = true;
                break;
            case AccountsUI.C.Panel.SIGNOUT:
                AccountsUI.Account.logout({ target: instance.AC.target });
                managed = true;
                break;
            case AccountsUI.C.Panel.SIGNUP:
                let options = {};
                if( AccountsUI.opts().haveUsername() !== AccountsUI.C.Input.NONE ){
                    options.username = $( '.ac-signup .ac-input-username .ac-input' ).val().trim();
                }
                if( AccountsUI.opts().haveEmailAddress() !== AccountsUI.C.Input.NONE ){
                    options.email = $( '.ac-signup .ac-input-email .ac-input' ).val().trim();
                }
                options.password = $( '.ac-signup .ac-newone .ac-input' ).val().trim();
                const autoClose = instance.AC.options.signupAutoClose();
                //console.debug( 'found autoClose='+autoClose );
                const autoConnect = instance.AC.options.signupAutoConnect();
                //console.debug( 'found autoConnect='+autoConnect );
                AccountsUI.Account.createUser( options, {
                    target: instance.AC.target,
                    autoClose: autoClose,
                    autoConnect: autoConnect
                });
                if( !autoClose ){
                    $( '.ac-signup' ).trigger( 'ac-clear-panel' );
                }
                managed = true;
                break;
            case AccountsUI.C.Panel.VERIFYASK:
                AccountsUI.Account.verifyMail({ target: instance.AC.target });
                managed = true;
                break;
        }
        return !managed;
    },

    // we want intercept the Enter keypress
    //  it is naturally bubbled up here when rendering as div
    //  when rendering as modal, panels bind the event to AC.target
    // data here is the original 'keydown' event
    'ac-enter .acUserLogin'( event, instance, data ){
        //console.debug( 'Enter' );
        instance.$( '.acUserLogin' ).trigger( 'ac-submit' );
    }
});

Template.acUserLogin.onDestroyed( function(){
    const self = this;
    AccountsUI.fn.nameRemove( self.AC.options.name());
});
