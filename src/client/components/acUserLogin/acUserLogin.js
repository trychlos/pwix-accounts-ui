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
 * Note that you should only let the panels be displayed for one acUserLogin instance. Else, panels would be
 * displayed twice, or three or more times, and this would be a waste of resources, besides of the obviously
 * weird display.
 * 
 * The template is instanciated here (and potentially several times as explained above), and uniquely identified by its uuid.
 * The acShower and acUserLoginOptions objects are attached to this instance.
 * The instance is then passed as a parameter to each and every child template.
 */

import { v4 as uuidv4 } from 'uuid';

import '../../../common/js/index.js';

import { acShower } from '../../classes/ac_shower.class.js';
import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';
import { acUserLoginOptions } from '../../classes/ac_user_login_options.class.js';

import '../../stylesheets/ac_accounts.less';

import '../ac_dropdown/ac_dropdown.js';
import '../ac_footer/ac_footer.js';
import '../ac_modal/ac_modal.js';
import '../ac_user_login/ac_user_login.js';

import './acUserLogin.html';

Template.acUserLogin.onCreated( function(){
    const self = this;

    self.AC = {
        companion: null,
        display: null,      // to be obsoleted
        options: null,
        uuid: uuidv4(),     // to be obsoleted

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

    console.log( 'pwix:accounts instanciating acUserLogin', self.AC.uuid );

    // first instanciates the options manager
    self.AC.options = new acUserLoginOptions({
        ...defaults.acUserLogin,
        ...Template.currentData()
    });

    // instanciates our companion class
    self.AC.companion = new acUserLoginCompanion( self );

    // instanciates the display manager
    self.AC.display = new acShower( self );
});

Template.acUserLogin.onRendered( function(){
    const self = this;
    console.log( 'onRendered', this );

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
    //pwiAccounts.Displayer.asked( self.AC.options.initialPanel(), self.AC.uuid );
});

Template.acUserLogin.helpers({

    // provides the acUserLogin instance to the child template (will be available as 'dataContext.aculInstance' object)
    // without this helper, the passed-in acUserLogin would have been available as just 'dataContext' (without any other subkey)
    aculInstance(){
        return Template.instance();
    },

    // whether this template controls a logged/unlogged user button
    hasDropdown(){
        return Template.instance().AC.hasDropdown();
    },

    // set a unique id on the acUserLogin div
    id(){
        return Template.instance().AC.companion.id();
    },

    // whether the display must be rendered as a modal one ?
    modal(){
        return Template.instance().AC.modal();
    }
});

Template.acUserLogin.events({
    // validate the current display
    'ac-button-submit .acUserLogin'( event, instance, data ){
        console.log( event, instance, data );
        let mail = null;
        let password = null;
        let managed = false;
        switch( data.panel ){
            case AC_PANEL_CHANGEPWD:
                const pwd1 = $( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = $( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                pwiAccounts.User.changePwd( pwd1, pwd2, instance.AC.companion );
                managed = true;
                break;
            case AC_PANEL_RESETASK:
                console.log( 'element', $( '.ac-reset-ask' ));
                mail = $( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                pwiAccounts.User.resetAsk( mail, instance.AC.companion );
                managed = true;
                break;
            case AC_PANEL_SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = $( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = $( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                pwiAccounts.User.loginWithPassword( mail, password, instance.AC.companion );
                managed = true;
                break;
            case AC_PANEL_SIGNOUT:
                pwiAccounts.User.logout( instance.AC.companion );
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
                const autoConnect = instance.AC.options.signupAutoConnect();
                console.log( 'found autoConnect='+autoConnect );
                pwiAccounts.User.createUser( options, instance.AC.companion, autoConnect );
                if( !autoConnect ){
                    $( event.currentTarget ).find( '.ac-signup' ).trigger( 'ac-clear' );
                }
                managed = true;
                break;
            case AC_PANEL_VERIFYASK:
                pwiAccounts.User.verifyMail( instance.AC.companion );
                managed = true;
                break;
        }
        if( managed ){
            pwixModal.close();
        }
        return !managed;
    },

    'ac-display-error .acUserLogin'( event, instance, msg ){
        console.log( event, instance, msg );
        pwiAccounts.Displayer.IDisplayer.errorMsg( msg );
        return false;
    },

    // usually sent from acMenuItems, including this requester and requested panel
    // Flow is: acMenuItems -> IDisplayer -> here -> acUserLoginCompanion -> IDisplayer
    'ac-panel-changepwd-event .acUserLogin'( event, instance, data ){
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-resetask-event .acUserLogin'( event, instance, data ){
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-signin-event .acUserLogin'( event, instance, data ){
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-signout-event .acUserLogin'( event, instance, data ){
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-signup-event .acUserLogin'( event, instance, data ){
        return !instance.AC.companion.handleEvent( event, data );
    },

    'ac-panel-verifyask-event .acUserLogin'( event, instance, data ){
        return !instance.AC.companion.handleEvent( event, data );
    },

    // transition advertising
    //  let the message bubble up
    'ac-panel-transition .acUserLogin'( event, instance, data ){
        console.log( event, instance, data );
        if( pwiAccounts.Displayer.requesterAllowed( instance.AC.uuid )){
            if( data.next !== AC_PANEL_NONE && instance.AC.options.renderMode() === AC_RENDER_MODAL ){
                if( !pwiAccounts.Displayer.view()){
                    const uuid = data.uuid || instance.AC.uuid;
                    view = Blaze.renderWithData( Template.ac_modal, { template: 'ac_user_login', aculInstance: instance }, $( '.acUserLogin#'+uuid )[0] );
                    pwiAccounts.Displayer.view( view );
                }
            }
            return false;
        }
    },

    // change the acShower rendering mode
    'ac-render-modal .acUserLogin'( event, instance ){
        if( pwiAccounts.Displayer.requesterAllowed( instance.AC.uuid )){
            console.log( event, instance );
            instance.AC.options.renderMode( AC_RENDER_MODAL );
            return false;
        }
    },
    'ac-render-div .acUserLogin'( event, instance ){
        if( pwiAccounts.Displayer.requesterAllowed( instance.AC.uuid )){
            console.log( event, instance );
            instance.AC.options.renderMode( AC_RENDER_DIV );
            return false;
        }
    },

    // set the modal title
    'ac-title .acUserLogin'( event, instance, data ){
        if( pwiAccounts.Displayer.requesterAllowed( instance.AC.uuid )){
            console.log( event, instance, data );
            instance.AC.display.modalTitle( data );
            return false;
        }
    },

    // application advertising of a change on the user
    //  let the message bubble up
    'ac-user-changepwd .acUserLogin'( event, instance, email ){
        console.log( 'ac-user-changepwd', email );
    },
    'ac-user-create .acUserLogin'( event, instance, email ){
        console.log( 'ac-user-create', email );
    },
    'ac-user-login .acUserLogin'( event, instance, email ){
        console.log( 'ac-user-login', email );
    },
    'ac-user-logout .acUserLogin'( event, instance, email ){
        console.log( 'ac-user-logout', email );
    },
    'ac-user-resetasked .acUserLogin'( event, instance, email ){
        console.log( 'ac-user-resetasked', email );
    },
    'ac-user-verifyasked .acUserLogin'( event, instance, email ){
        console.log( 'ac-user-verifyasked', email );
    }
});
