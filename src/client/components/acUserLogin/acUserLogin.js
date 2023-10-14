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
        panel: new ReactiveVar( AccountsUI.C.Panel.NONE )
    };

    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
        console.log( 'pwix:accounts-ui instanciating acUserLogin id='+self.AC.managerId );
    }

    // register the configuration options
    self.autorun(() => {
        self.AC.options.base_set( _.merge( {}, defaults.acUserLogin, Template.currentData()));
        self.AC.panel.set( self.AC.options.initialPanel() || AccountsUI.C.Panel.NONE );
    });
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

    // whether this template must be initially displayed as a panel
    //  if an initial panel is asked for, then set it
    /*
    hasPanel(){
        const AC = Template.instance().AC;
        const hasPanel = Boolean( AC.options.initialDisplay() === AccountsUI.C.Display.PANEL );
        if( hasPanel ){
            AC.panel = AC.options.initialPanel();
        }
        return hasPanel;
    },
    */

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
        let panel = null;
        Object.keys( _stdMenuItems ).every(( st ) => {
            _stdMenuItems[st].every(( it ) => {
                if( it.msgaction === event.type ){
                    panel = it.panel;
                }
                return panel === null;
            });
            return panel === null;
        });
        console.debug( event.type, '->', panel );
        panel = panel || AccountsUI.C.Panel.NONE;
        instance.AC.panel.set( panel );
        return false;
    },

    'ac-display-error .acUserLogin'( event, instance, msg ){
        AccountsUI.fn.errorMsg( msg );
        return false;
    },

    // change the rendering mode
    'ac-render-modal .acUserLogin'( event, instance ){
        instance.AC.options.renderMode( AccountsUI.C.Render.MODAL );
        return false;
    },
    'ac-render-div .acUserLogin'( event, instance ){
        instance.AC.options.renderMode( AccountsUI.C.Render.DIV );
        return false;
    },

    // handle form submission
    'ac-submit .acUserLogin'( event, instance ){
        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.SUBMIT ){
            console.log( 'pwix:accounts-ui acUserLogin handling', event.type );
        }
        let mail = null;
        let password = null;
        let managed = false;
        let close = false;
        const panel = instance.AC.panel.get();
        switch( panel ){
            case AccountsUI.C.Panel.CHANGEPWD:
                //console.debug( this );
                const pwd1 = $( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = $( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                AccountsUI.Account.changePwd( pwd1, pwd2, { target: instance.AC.target });
                managed = true;
                close = true;
                break;
            case AccountsUI.C.Panel.RESETASK:
                //console.log( 'element', $( '.ac-reset-ask' ));
                mail = $( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                AccountsUI.Account.resetAsk( mail, { target: instance.AC.target });
                managed = true;
                close = true;
                break;
            case AccountsUI.C.Panel.SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = $( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = $( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                AccountsUI.Account.loginWithPassword( mail, password, { target: instance.AC.target });
                managed = true;
                close = true;
                break;
            case AccountsUI.C.Panel.SIGNOUT:
                AccountsUI.Account.logout({ target: instance.AC.target });
                managed = true;
                close = true;
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
                close = !autoClose;
                break;
            case AccountsUI.C.Panel.VERIFYASK:
                AccountsUI.Account.verifyMail({ target: instance.AC.target });
                managed = true;
                close = true;
                break;
        }
        if( close ){
            instance.AC.panel.set( AccountsUI.C.Panel.NONE );
        }
        return !managed;
    },

    // set the panel title
    'ac-title .acUserLogin'( event, instance, data ){
        AccountsUI.fn.title( data );
        return false;
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
