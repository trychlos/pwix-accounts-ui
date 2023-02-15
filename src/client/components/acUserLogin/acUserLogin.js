/*
 * pwix:accounts/src/client/components/acUserLogin/acUserLogin.js
 *
 * Main user login template
 *
 * Is callable many times so that a different set of parameters produces different (though, of course, consistent) results.
 *
 * This behavior relies on several classes:
 * 
 * - global classes:
 *   > acDisplayer is a singleton attached to the global 'pwiAccounts' object, and maintains the display (aka the viewport) as a whole
 *      it implements IDisplayManager and IEventManager interfaces
 *   > acUser is a singleton attached to the global 'pwiAccounts' object, and interfaces the user status.
 * 
 * - local classes:
 *   > acUserLoginOptions the configuration options provided by the caller (or their defaults)
 *   > acUserLoginCompanion a companion class which glues together this Blaze template instance with classes and interfaces
 * 
 * - acShower is attached to each and every 'acUserLogin' template, and manages the display of the fields

 *
 * Even if the logged (resp. unlogged) buttons are not displayed, the underlying panels can still be activated when
 * a transition requires that. This is because all acUserLogin instances share the same required panel, which is
 * a design decision.
 * 
 * The template is instanciated here (and potentially several times as explained above), and uniquely identified by the id of its companion class.
 * The acUserLoginCompanion and acUserLoginOptions objects are attached to this instance.
 * The companion class acts as a IDisplayRequester, and is then passed as a parameter to each and every child template.
 */

import '../../../common/js/index.js';

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';
import { acUserLoginOptions } from '../../classes/ac_user_login_options.class.js';

import '../../stylesheets/ac_accounts.less';

import '../ac_dropdown/ac_dropdown.js';
import '../ac_footer/ac_footer.js';
import '../ac_user_login/ac_user_login.js';

import './acUserLogin.html';

Template.acUserLogin.onCreated( function(){
    const self = this;

    // note for the maintainer: as the companion object is passed to each and every child template, all of them
    //  is able to address this AC object, and tu ouse the below methods. Take care when changing something.
    self.AC = {
        companion: null,
        options: null,

        // whether this template instance is to display a dropdown button ?
        hasDropdown(){
            const state = pwiAccounts.User.state();
            return ( state === AC_LOGGED && self.AC.options.loggedButtonAction() !== AC_ACT_HIDDEN )
                || ( state === AC_UNLOGGED && self.AC.options.unloggedButtonAction() !== AC_ACT_HIDDEN );
        },

        // whether rendering as a <div>...</div> or as a modal ?
        modal(){
            return self.AC.options.renderMode() === 'AC_RENDER_MODAL';
        }
    };

    // first instanciates the options manager
    self.AC.options = new acUserLoginOptions({
        ...defaults.acUserLogin,
        ...Template.currentData()
    });

    // instanciates our companion class
    self.AC.companion = new acUserLoginCompanion( self );

    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
        console.log( 'pwix:accounts instanciating acUserLogin id='+self.AC.companion.IDisplayRequester.id());
    }
});

Template.acUserLogin.onRendered( function(){
    const self = this;

    // make the acUserLoginCompanion 'ready' as soon as the DOM is itself ready
    //  thanks to Blaze rendering mechanisms, this toplevel template is the last to be rendered
    const intervalId = setInterval(() => {
        const div = self.$( self.AC.companion.jqSelector());
        if( div.length > 0 ){
            self.AC.companion.ready( true );
            clearInterval( intervalId );
        }
    }, 15 );

    // setup the initial panel only when the template is rendered
    self.AC.companion.IDisplayRequester.ask( self.AC.options.initialPanel(), { companion: self.AC.companion });
});

Template.acUserLogin.helpers({

    // whether this template controls a logged/unlogged user button
    hasDropdown(){
        return Template.instance().AC.hasDropdown();
    },

    // set a unique id on the acUserLogin div
    id(){
        return Template.instance().AC.companion.IDisplayRequester.id();
    },

    // whether the display must be rendered as a modal one ?
    modal(){
        return Template.instance().AC.modal();
    },

    // provides the IDisplayRequester instance to the child templates
    //  if present, also provides the acUserLogin name
    parms(){
        let o = {
            companion: Template.instance().AC.companion
        };
        const name = o.companion.opts().name();
        if( name ){
            o.name = name;
        }
        return o;
    }
});

Template.acUserLogin.events({
    // validate the current display
    'ac-submit .acUserLogin'( event, instance, data ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_SUBMIT_HANDLE ){
            console.log( 'pwix:accounts acUserLogin handling', event.type, data );
        }
        let mail = null;
        let password = null;
        let managed = false;
        const panel = pwiAccounts.Displayer.IDisplayManager.panel();
        switch( panel ){
            case AC_PANEL_CHANGEPWD:
                const pwd1 = $( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = $( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                pwiAccounts.User.changePwd( pwd1, pwd2, instance.AC.companion.IDisplayRequester.target());
                managed = true;
                break;
            case AC_PANEL_RESETASK:
                console.log( 'element', $( '.ac-reset-ask' ));
                mail = $( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                pwiAccounts.User.resetAsk( mail, instance.AC.companion.IDisplayRequester.target());
                managed = true;
                break;
            case AC_PANEL_SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = $( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = $( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                pwiAccounts.User.loginWithPassword( mail, password, instance.AC.companion.IDisplayRequester.target());
                managed = true;
                break;
            case AC_PANEL_SIGNOUT:
                pwiAccounts.User.logout();
                managed = true;
                break;
            case AC_PANEL_SIGNUP:
                let options = {};
                if( pwiAccounts.opts().haveUsername()){
                    options.username = $( '.ac-signup .ac-input-username .ac-input' ).val().trim();
                }
                if( pwiAccounts.opts().haveEmailAddress()){
                    options.email = $( '.ac-signup .ac-input-email .ac-input' ).val().trim();
                }
                options.password = $( '.ac-signup .ac-newone .ac-input' ).val().trim();
                const autoClose = instance.AC.options.signupAutoClose();
                console.log( 'found autoClose='+autoClose );
                const autoConnect = instance.AC.options.signupAutoConnect();
                console.log( 'found autoConnect='+autoConnect );
                pwiAccounts.User.createUser( options, instance.AC.companion.IDisplayRequester.target(), autoClose, autoConnect );
                if( !autoClose ){
                    $( '.ac-signup' ).trigger( 'ac-clear' );
                }
                managed = true;
                break;
            case AC_PANEL_VERIFYASK:
                pwiAccounts.User.verifyMail( instance.AC.companion.IDisplayRequester.target());
                managed = true;
                break;
        }
        return !managed;
    },

    'ac-display-error .acUserLogin'( event, instance, msg ){
        //console.log( event, instance, msg );
        pwiAccounts.Displayer.errorMsg( msg );
        return false;
    },

    // usually sent from acMenuItems, including this requester and requested panel
    // Flow is: acMenuItems -> IDisplayManager -> here -> acUserLoginCompanion -> IDisplayManager
    'ac-panel-changepwd-event .acUserLogin'( event, instance, data ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_HANDLE ){
            console.log( 'pwix:accounts acUserLogin handling', event.type );
        }
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-resetask-event .acUserLogin'( event, instance, data ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_HANDLE ){
            console.log( 'pwix:accounts acUserLogin handling', event.type );
        }
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-signin-event .acUserLogin'( event, instance, data ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_HANDLE ){
            console.log( 'pwix:accounts acUserLogin handling', event.type );
        }
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-signout-event .acUserLogin'( event, instance, data ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_HANDLE ){
            console.log( 'pwix:accounts acUserLogin handling', event.type );
        }
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-signup-event .acUserLogin'( event, instance, data ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_HANDLE ){
            console.log( 'pwix:accounts acUserLogin handling', event.type );
        }
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-verifyask-event .acUserLogin'( event, instance, data ){
        if( pwiAccounts.opts().verbosity() & AC_VERBOSE_PANEL_HANDLE ){
            console.log( 'pwix:accounts acUserLogin handling', event.type );
        }
        return !instance.AC.companion.handleEvent( event, data );
    },

    // change the rendering mode
    'ac-render-modal .acUserLogin'( event, instance ){
        console.log( event, instance );
        instance.AC.options.renderMode( AC_RENDER_MODAL );
        return false;
    },
    'ac-render-div .acUserLogin'( event, instance ){
        console.log( event, instance );
        instance.AC.options.renderMode( AC_RENDER_DIV );
        return false;
    },

    // set the modal title
    'ac-title .acUserLogin'( event, instance, data ){
        console.log( event, instance, data );
        pwiAccounts.Displayer.title( data );
        return false;
    }
});
