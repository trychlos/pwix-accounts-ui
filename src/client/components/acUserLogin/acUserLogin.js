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
 *   > acDisplayManager is a singleton attached to the global 'pwiAccounts' object, and maintains the display (aka the viewport) as a whole
 *   > acUser is a singleton attached to the global 'pwiAccounts' object, and interfaces the user status.
 * 
 * - local classes:
 *   > acCompanionOptions the configuration options provided by the caller (or their defaults)
 *   > acCompanion a companion class which glues together this Blaze template instance with other classes
 * 
 * The template is instanciated here (and potentially several times as explained above), and uniquely identified by the id of its companion class.
 * The acCompanion and acCompanionOptions objects are attached to this instance.
 * The companion class acts as a display requester, and is then passed as a parameter to each and every child template.
 */

import '../../../common/js/index.js';

import { acCompanion } from '../../classes/ac_companion.class.js';

import '../../stylesheets/ac_accounts.less';

import '../ac_dropdown/ac_dropdown.js';
import '../ac_footer/ac_footer.js';
import '../ac_render_div/ac_render_div.js';

import './acUserLogin.html';

Template.acUserLogin.onCreated( function(){
    const self = this;

    self.AC = {
        companion: new acCompanion( self, Template.currentData())
    };

    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
        console.log( 'pwix:accounts instanciating acUserLogin id='+self.AC.companion.id());
    }
});

Template.acUserLogin.onRendered( function(){
    this.AC.companion.dom().waitForDom();
});

Template.acUserLogin.helpers({

    // whether this template controls a logged/unlogged user button
    hasDropdown(){
        //console.debug( 'hasDropdown', Template.instance().AC.companion.hasDropdown());
        return Template.instance().AC.companion.hasDropdown();
    },

    // set a unique id on the acUserLogin div
    id(){
        return Template.instance().AC.companion.id();
    },

    // whether the display must be rendered as a modal one ?
    modal(){
        //console.debug( 'isModal', Template.instance().AC.companion.modal());
        return Template.instance().AC.companion.modal();
    },

    // provides the acCompanion instance to the child templates
    parms(){
        return {
            companion: Template.instance().AC.companion
        };
    },

    // run the panel as a modal
    runModal(){
        console.debug( 'running modal' );
        const AC = Template.instance().AC;
        pwiAccounts.DisplayManager.ask( AC.companion.opts().initialPanel(), AC.companion );
    }
});

Template.acUserLogin.events({

    'ac-display-error .acUserLogin'( event, instance, msg ){
        //console.log( event, instance, msg );
        pwiAccounts.DisplayManager.errorMsg( msg );
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
        pwiAccounts.DisplayManager.title( data );
        return false;
    }
});
