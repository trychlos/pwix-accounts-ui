/*
 * pwix:accounts-ui/src/client/components/ac_render_div/ac_render_div.js
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 */

import './ac_render_div.html';

Template.ac_render_div.onRendered( function(){
    const self = this;

    // wait for the DOM be rendered to set the focus on the first input field
    AccountsUI.DOM.waitFor( 'input' ).then(( elt ) => { self.$( elt ).focus(); });
});

Template.ac_render_div.helpers({
    template(){
        return AccountsUI.Panel.template( this.AC.panel());
    }
});

Template.ac_render_div.events({
    // intercept Enter keypress
    'keydown .ac-render-div'( event, instance ){
        if( event.keyCode === 13 ){
            this.AC.target.trigger( 'ac-enter', event );
        }
    }
});
