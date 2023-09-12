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
 *   > acDisplayManager is a singleton attached to the global 'AccountsUI' object, and maintains the display (aka the viewport) as a whole
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

import './acUserLogin.html';

Template.acUserLogin.onCreated( function(){
    const self = this;

    self.AC = {
        managerId: AccountsUI.Manager.userloginDefine( self ),

        // @returns {Boolean} whether this acUserLogin template should display a dropdown menu
        //  regarding the current connection state
        hasDropdown(){
            const state = AccountsUI.Connection.state();
            return ( state === AC_LOGGED && AccountsUI.Manager.component( self.AC.managerId ).opts().loggedButtonAction() !== AC_ACT_HIDDEN )
                || ( state === AC_UNLOGGED && AccountsUI.Manager.component( self.AC.managerId ).opts().unloggedButtonAction() !== AC_ACT_HIDDEN );
        }
    };

    if( AccountsUI.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
        console.log( 'pwix:accounts-ui instanciating acUserLogin id='+self.AC.managerId );
    }

    self.autorun(() => {
        AccountsUI.Manager.component( self.AC.managerId ).opts().base_set( _.merge( {}, defaults.acUserLogin, Template.currentData()));
    });
});

Template.acUserLogin.onRendered( function(){
    const self = this;

    // ask for the display
    AccountsUI.DisplayManager.ask( AccountsUI.Manager.component( self.AC.managerId ).opts().initialPanel(), self.AC.managerId );
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
        //console.debug( 'isModal', Template.instance().AC.companion.modal());
        return AccountsUI.Manager.component( Template.instance().AC.managerId ).modal();
    },

    // provides the acCompanion instance to the child templates
    parms(){
        return {
            managerId: Template.instance().AC.managerId
        };
    }
});

Template.acUserLogin.events({

    'ac-display-error .acUserLogin'( event, instance, msg ){
        //console.log( event, instance, msg );
        AccountsUI.DisplayManager.errorMsg( msg );
        return false;
    },

    // change the rendering mode
    'ac-render-modal .acUserLogin'( event, instance ){
        console.log( event, instance );
        instance.AC.companion().opts().renderMode( AC_RENDER_MODAL );
        return false;
    },
    'ac-render-div .acUserLogin'( event, instance ){
        console.log( event, instance );
        instance.AC.companion().opts().renderMode( AC_RENDER_DIV );
        return false;
    },

    // set the modal title
    'ac-title .acUserLogin'( event, instance, data ){
        console.log( event, instance, data );
        AccountsUI.DisplayManager.title( data );
        return false;
    }
});

Template.acUserLogin.onDestroyed( function(){
    const self = this;
    AccountsUI.Manager.componentRemove( self.AC.managerId );
});
