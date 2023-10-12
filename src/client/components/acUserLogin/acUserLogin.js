/*
 * pwix:accounts-ui/src/client/components/acUserLogin/acUserLogin.js
 *
 * Main user login template
 *
 * Is callable many times so that a different set of parameters produces different (though, of course, consistent) results.
 *
 * This behavior relies on several classes:
 * 
 * - global classes:
 *   > acDisplay is a singleton attached to the global 'AccountsUI' object, and maintains the display (aka the viewport) as a whole
 *   > acUser is a singleton attached to the global 'AccountsUI' object, and interfaces the user status.
 * 
 * - local classes:
 *   > acCompanionOptions the configuration options provided by the caller (or their defaults)
 *   > acCompanion a companion class which glues together this Blaze template instance with other classes
 * 
 * The template is instanciated here (and potentially several times as explained above), and uniquely identified by the id of its companion class.
 * The acCompanion and acCompanionOptions objects are attached to this instance.
 * The companion class acts as a display requester, and is then passed as a parameter to each and every child template.
 */

import _ from 'lodash';

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

import './acUserLogin.html';

Template.acUserLogin.onCreated( function(){
    const self = this;

    self.AC = {
        managerId: AccountsUI.Manager.userloginDefine( self ),

        // @returns {Boolean} whether this acUserLogin template should display a dropdown menu
        //  regarding the current connection state
        hasDropdown(){
            const state = AccountsUI.Connection.state();
            return ( state === AccountsUI.C.Connection.LOGGED && AccountsUI.Manager.component( self.AC.managerId ).opts().loggedButtonAction() !== AccountsUI.C.Button.HIDDEN )
                || ( state === AccountsUI.C.Connection.UNLOGGED && AccountsUI.Manager.component( self.AC.managerId ).opts().unloggedButtonAction() !== AccountsUI.C.Button.HIDDEN );
        }
    };

    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
        console.log( 'pwix:accounts-ui instanciating acUserLogin id='+self.AC.managerId );
    }

    // register the configuration options
    self.autorun(() => {
        AccountsUI.Manager.component( self.AC.managerId ).opts().base_set( _.merge( {}, defaults.acUserLogin, Template.currentData()));
    });

    // register the name
    self.autorun(() => {
        const name = Template.currentData().name;
        if( name ){
            AccountsUI.Manager.name( self.AC.managerId, name );
        }
    });
});

Template.acUserLogin.onRendered( function(){
    const self = this;

    // ask for the display
    AccountsUI.Display.ask( AccountsUI.Manager.component( self.AC.managerId ).opts().initialPanel(), self.AC.managerId );

    // set the name attribute if any
    self.autorun(() => {
        const name = Template.currentData().name;
        if( name ){
            self.$( '.acUserLogin' ).attr( 'data-ac-name', name );
        }
    });
});

Template.acUserLogin.helpers({

    // whether this template controls a logged/unlogged user button
    hasDropdown(){
        //console.debug( 'hasDropdown', Template.instance().AC.companion.hasDropdown());
        return Template.instance().AC.hasDropdown();
    },

    // set a unique id on the acUserLogin div
    id(){
        return Template.instance().AC.managerId;
    },

    // whether the display must be rendered as a modal one ?
    modal(){
        const isModal = AccountsUI.Manager.component( Template.instance().AC.managerId ).modal();
        //console.debug( 'isModal', isModal );
        return isModal;
    },

    // provides the acCompanion instance to the child templates
    parms(){
        return {
            managerId: Template.instance().AC.managerId
        };
    }
});

Template.acUserLogin.events({

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
        if( panel ){
            console.debug( 'panel', panel );
            AccountsUI.Event.handler( event, {
                requester: instance.AC.managerId,
                panel: panel
            });
        } else {
            console.error( 'event', event.type, 'not found or unknown' );
        }
        return false;
    },

    'ac-display-error .acUserLogin'( event, instance, msg ){
        AccountsUI.Display.errorMsg( msg );
        return false;
    },

    // change the rendering mode
    'ac-render-modal .acUserLogin'( event, instance ){
        AccountsUI.Manager.component( instance.AC.managerId ).opts().renderMode( AccountsUI.C.Render.MODAL );
        return false;
    },
    'ac-render-div .acUserLogin'( event, instance ){
        AccountsUI.Manager.component( instance.AC.managerId ).opts().renderMode( AccountsUI.C.Render.DIV );
        return false;
    },

    // set the modal title
    'ac-title .acUserLogin'( event, instance, data ){
        AccountsUI.Display.title( data );
        return false;
    }
});

Template.acUserLogin.onDestroyed( function(){
    const self = this;
    AccountsUI.Display.release( self.AC.managerId );
    AccountsUI.Manager.componentRemove( self.AC.managerId );
});
