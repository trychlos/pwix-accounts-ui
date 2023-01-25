/*
 * pwix:accounts/src/client/components/acUserLogin/acUserLogin.js
 *
 * Main user login template
 *
 * Is callable many times so that a different set of parameters produces different (though, of course, consistent) results.
 *
 * This behavior relies on three distinct classes:
 * - acDisplay is attached to each and every 'acUserLogin' template, and manages the display of the fields
 * - acPanel is a singleton attached to the global 'pwiAccounts' object, and maintains the currently displayed panel
 * - acUser is a singleton attached to the global 'pwiAccounts' object, and interfaces the user status.
 *
 * Even if the logged (resp. unlogged) buttons are not displayed, the underlying panels can still be activated when
 * a transition requires that. This is because all acUserLogin instances share the same required panel, which is
 * a design decision.
 * You can prevent panels to be displayed with the 'singlePanel' option which defaults to false.
 * 
 ***   Note that you should only let the panels be displayed for one acUserLogin instance. Else, panels would be
 ***   displayed twice, or three or more times, and this would be a waste of resources...
 *** Parms:
 ***  - staticBackdrop    A modal display may usually be cancelled (closed) by just clicking outside of it.
 ***                      When backdrop is set to static, the modal will not close when clicking outside of it, and so will
 ***                      actually block the whole application. This is a very specific behavior which should not be
 ***                      usually recommanded.
 ***                      Values: true|false, defaulting to false (clicking outside of the modal will close this modal).
 ***                      No message is planned to modify this configuration.
 ***                      As a side effect, having a static backdrop also removes the 'close' button displayed in the modal title.
 */
import '../../../common/js/index.js';

import { acDisplay } from '../../classes/ac_display.class.js';

import '../../stylesheets/ac_accounts.less';

import '../ac_dropdown/ac_dropdown.js';
import '../ac_modal/ac_modal.js';
import '../ac_user_login/ac_user_login.js';

import './acUserLogin.html';

Template.acUserLogin.onCreated( function(){
    const self = this;

    self.AC = {
        display: new acDisplay( self, Template.currentData()),

        hasButton(){
            const display = self.AC.display;
            const state = pwiAccounts.User.state();
            return ( state === AC_LOGGED && display.loggedButtonAction() !== AC_ACT_HIDDEN )
                || ( state === AC_UNLOGGED && display.unloggedButtonAction() !== AC_ACT_HIDDEN );
        }
    };
});

Template.acUserLogin.onRendered( function(){
    const self = this;

    // make the acDisplay 'ready' as soon as the DOM is itself ready
    //  thanks to Blaze rendering mechanisms, this toplevel template is the last to be rendered
    const intervalId = setInterval(() => {
        const div = self.$( '.acUserLogin' );
        if( div.length > 0 ){
            self.AC.display.ready( true );
            clearInterval( intervalId );
        }
    }, 15 );

    //console.log( this );
});

Template.acUserLogin.helpers({

    // provides the acDialog instance to the child template (will be available as 'dataContext.display' object)
    // without this helper, the passed-in acDisplay would have been available as 'dataContext' (without any other subkey)
    display(){
        return Template.instance().AC.display;
    },

    // whether this template controls a logged/unlogged user button
    hasButton(){
        return Template.instance().AC.hasButton();
    },

    // whether the display must be rendered as a modal one ?
    modal(){
        //console.log( 'rendering as modal', Template.instance().AC.display.modal());
        return Template.instance().AC.display.modal();
    }
});

Template.acUserLogin.events({
    // cancel the current display
    'ac-button-cancel'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_NONE );
        return false;
    },

    // validate the current display
    'ac-button-submit'( event, instance ){
        //console.log( event );
        let mail = null;
        let password = null;
        switch( pwiAccounts.Panel.asked()){
            case AC_PANEL_CHANGEPWD:
                const pwd1 = instance.$( '.ac-change-pwd .ac-old .ac-input' ).val().trim();
                const pwd2 = instance.$( '.ac-change-pwd .ac-newone .ac-input' ).val().trim();
                pwiAccounts.User.changePwd( pwd1, pwd2, $( event.currentTarget ));
                break;
            case AC_PANEL_RESETASK:
                mail = instance.$( '.ac-reset-ask .ac-input-email .ac-input' ).val().trim();
                pwiAccounts.User.resetPwd( mail, $( event.currentTarget ));
                break;
            case AC_PANEL_SIGNIN:
                // 'mail' here may be either an email address or a username
                mail = instance.$( '.ac-signin .ac-input-userid .ac-input' ).val().trim();
                password = instance.$( '.ac-signin .ac-input-password .ac-input' ).val().trim();
                //console.log( 'mail',mail,'password', pwd );
                pwiAccounts.User.loginWithPassword( mail, password, $( event.currentTarget ));
                break;
            case AC_PANEL_SIGNOUT:
                pwiAccounts.User.logout();
                break;
            case AC_PANEL_SIGNUP:
                mail = instance.$( '.ac-signup .ac-input-email .ac-input' ).val().trim();
                password = instance.$( '.ac-signup .ac-input-password .ac-input' ).val().trim();
                const autoConnect = instance.AC.display.signupAutoConnect();
                pwiAccounts.User.createUser( mail, password, $( event.currentTarget ), autoConnect );
                if( !autoConnect ){
                    $( event.currentTarget ).find( '.ac-signup' ).trigger( 'ac-clear' );
                }
                break;
            case AC_PANEL_VERIFYASK:
                pwiAccounts.User.verifyMail();
                break;
        }
        return false;
    },

    'ac-display-error'( event, instance, msg ){
        instance.AC.display.errorMsg( msg );
        return false;
    },

    // change the current displayed template
    'ac-panel .acUserLogin'( event, instance, display ){
        pwiAccounts.Panel.asked( display );
        return false;
    },

    // be specific on the requested displayed template
    'ac-panel-none'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_NONE );
        return false;
    },
    'ac-panel-changepwd'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_CHANGEPWD );
        return false;
    },
    'ac-panel-resetask'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_RESETASK );
        return false;
    },
    'ac-panel-resetpwd'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_RESETPWD );
        return false;
    },
    'ac-panel-signin'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_SIGNIN );
        return false;
    },
    'ac-panel-signout'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_SIGNOUT );
        return false;
    },
    'ac-panel-signup'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_SIGNUP );
        return false;
    },
    'ac-panel-verifyask'( event, instance ){
        pwiAccounts.Panel.asked( AC_PANEL_VERIFYASK );
        return false;
    },

    // transition advertising
    //  let the message bubble up
    'ac-panel-transition'( event, instance, data ){
        //console.log( 'ac-panel-transition', 'previous='+data.previous, 'next='+data.next );
        if( data.next !== AC_PANEL_NONE && instance.AC.display.renderMode() === AC_RENDER_MODAL ){
            if( !pwiAccounts.Panel.view()){
                view = Blaze.renderWithData( Template.ac_modal, { template: 'ac_user_login', display: instance.AC.display }, $( '.acUserLogin' )[0] );
                pwiAccounts.Panel.view( view );
            }
        }
    },

    // change the acDisplay rendering mode
    'ac-render-modal'( event, instance ){
        instance.AC.display.renderMode( acDisplay.r.MODAL );
        return false;
    },
    'ac-render-div'( event, instance ){
        instance.AC.display.renderMode( acDisplay.r.DIV );
        return false;
    },

    // set the modal title
    'ac-title'( event, instance, data ){
        instance.AC.display.modalTitle( data );
        return false;
    },

    // application advertising of a change on the user
    //  let the message bubble up
    'ac-user-changepwd'( event, instance, email ){
        console.log( 'ac-user-changepwd', email );
    },
    'ac-user-create'( event, instance, email ){
        console.log( 'ac-user-create', email );
    },
    'ac-user-login'( event, instance, email ){
        console.log( 'ac-user-login', email );
    },
    'ac-user-logout'( event, instance, email ){
        console.log( 'ac-user-logout', email );
    },
    'ac-user-resetasked'( event, instance, email ){
        console.log( 'ac-user-resetasked', email );
    },
    'ac-user-verifyreasked'( event, instance, email ){
        console.log( 'ac-user-verifyreasked', email );
    }
});
