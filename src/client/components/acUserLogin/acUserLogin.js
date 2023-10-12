/*
 * pwix:accounts-ui/src/client/components/acUserLogin/acUserLogin.js
 *
 * Main user login template.
 * It is callable many times so that a different set of parameters produces different (though, of course, consistent) results.
 */

import _ from 'lodash';

import { Random } from 'meteor/random';

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
        panel: null
    };

    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.INSTANCIATIONS ){
        console.log( 'pwix:accounts-ui instanciating acUserLogin id='+self.AC.managerId );
    }

    // register the configuration options
    self.autorun(() => {
        self.AC.options.base_set( _.merge( {}, defaults.acUserLogin, Template.currentData()));
    });
});

Template.acUserLogin.onRendered( function(){
    const self = this;

    // set the name attribute if any
    self.autorun(() => {
        const name = self.AC.options.name();
        if( name ){
            AccountsUI.Manager.name( name, self );
            self.$( '.acUserLogin' ).attr( 'data-ac-name', name );
        }
    });

    // set the event target to this component
    self.AC.target = self.$( '.acUserLogin#'+self.AC.id );
});

Template.acUserLogin.helpers({

    // whether this template must be initially displayed as a dropdown button
    hasDropdown(){
        return Template.instance().AC.options.initialDisplay() === AccountsUI.C.Display.DROPDOWNBUTTON;
    },

    // whether this template must be initially displayed as a panel
    //  if an initial panel is asked for, then set it
    hasPanel(){
        const AC = Template.instance().AC;
        const hasPanel = Boolean( AC.options.initialDisplay() === AccountsUI.C.Display.PANEL );
        if( hasPanel ){
            AC.panel = AC.options.initialPanel();
        }
        return hasPanel;
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
