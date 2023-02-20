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
 *   > acUserLoginOptions the configuration options provided by the caller (or their defaults)
 *   > acUserLoginCompanion a companion class which glues together this Blaze template instance with other classes
 * 
 * The template is instanciated here (and potentially several times as explained above), and uniquely identified by the id of its companion class.
 * The acUserLoginCompanion and acUserLoginOptions objects are attached to this instance.
 * The companion class acts as a display requester, and is then passed as a parameter to each and every child template.
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
        options: null
    };

    // first instanciates the options manager
    self.AC.options = new acUserLoginOptions({
        ...defaults.acUserLogin,
        ...Template.currentData()
    });

    // instanciates our companion class
    self.AC.companion = new acUserLoginCompanion( self );

    if( pwiAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
        console.log( 'pwix:accounts instanciating acUserLogin id='+self.AC.companion.id());
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

    // set the event target
    self.AC.companion.target( self.$( self.AC.companion.jqSelector()));

    // setup the initial panel only when the template is rendered
    pwiAccounts.DisplayManager.ask( self.AC.options.initialPanel(), self.AC.companion, self.AC.options );
});

Template.acUserLogin.helpers({

    // whether this template controls a logged/unlogged user button
    hasDropdown(){
        return Template.instance().AC.companion.hasDropdown();
    },

    // set a unique id on the acUserLogin div
    id(){
        return Template.instance().AC.companion.id();
    },

    // whether the display must be rendered as a modal one ?
    modal(){
        return Template.instance().AC.companion.modal();
    },

    // provides the acUserLoginCompanion instance to the child templates
    parms(){
        return {
            companion: Template.instance().AC.companion
        };
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
        pwiAccounts.DisplayManager.title( data );
        return false;
    }
});
