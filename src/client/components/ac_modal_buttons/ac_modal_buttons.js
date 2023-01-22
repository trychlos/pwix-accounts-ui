/*
 * pwi:accounts/src/client/components/ac_modal_buttons/ac_modal_buttons.js
 *
 * Provides various buttons, to be displayed either in a modal footer, or in the bottom of a div.
 * 
 * Parms:
 *  - dialog: the acDialog which manages this 'acUserLogin' template's hierarchy
 */
import { pwiI18n as pI } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import { acDialog } from '../../classes/ac_dialog.class.js';
import { acPanel } from '../../classes/ac_panel.class.js';

import './ac_modal_buttons.html';

Template.ac_modal_buttons.onCreated( function(){
    const self = this;

    // some configurations depending of the currently displayed template
    self.AC = {
        btns: {
            CHANGEPWD: {
                buttons: [
                    {
                        class: 'btn-secondary ac-cancel',
                        key: 'cancel_label'
                    },
                    {
                        class: 'btn-primary ac-submit',
                        key: 'ok_label'
                    }
                ]
            },
            RESETASK: {
                links: [
                    {
                        key: 'signin_link',
                        target: AC_PANEL_SIGNIN,
                        have: 'signinLink'
                    },
                    {
                        key: 'signup_link',
                        target: AC_PANEL_SIGNUP,
                        have: 'signupLink'
                    }
                ],
                buttons: [
                    {
                        class: 'btn-secondary ac-cancel',
                        key: 'cancel_label'
                    },
                    {
                        class: 'btn-primary ac-submit',
                        key: 'send_label'
                    }
                ]
            },
            SIGNIN: {
                links: [
                    {
                        key: 'reset_link',
                        target: AC_PANEL_RESETASK,
                        have: 'resetLink'
                    },
                    {
                        key: 'signup_link',
                        target: AC_PANEL_SIGNUP,
                        have: 'signupLink'
                    }
                ],
                buttons: [
                    {
                        class: 'btn-secondary ac-cancel',
                        key: 'cancel_label'
                    },
                    {
                        class: 'btn-primary ac-submit',
                        key: 'signin_label'
                    }
                ]
            },
            SIGNOUT: {
                buttons: [
                    {
                        class: 'btn-secondary ac-cancel',
                        key: 'cancel_label'
                    },
                    {
                        class: 'btn-primary ac-submit',
                        key: 'signout_label'
                    }
                ]
            },
            SIGNUP: {
                links: [
                    {
                        key: 'signin_link',
                        target: AC_PANEL_SIGNIN,
                        have: 'signinLink'
                    }
                ],
                buttons: [
                    {
                        class: 'btn-secondary ac-cancel',
                        key: 'cancel_label'
                    },
                    {
                        class: 'btn-primary ac-submit',
                        key: 'signup_label'
                    }
                ]
            },
            VERIFYASK: {
                buttons: [
                    {
                        class: 'btn-secondary ac-cancel',
                        key: 'cancel_label'
                    },
                    {
                        class: 'btn-primary ac-submit',
                        key: 'send_label'
                    }
                ]
            }
        }
    };
});

Template.ac_modal_buttons.onRendered( function(){
});

Template.ac_modal_buttons.helpers({

    // buttons helpers
    btnClass( btn ){
        return btn.class || '';
    },

    btnLabel( btn ){
        return btn.key && btn.key.length ? pI.label( pwiAccounts.strings, 'buttons', btn.key ) : '';
    },

    // returns the ordered list of buttons to be displayed depending of the currently displayed template
    buttons(){
        const panel = pwiAccounts.panel.asked();
        const ac = Template.instance().AC;
        return Object.keys( ac.btns ).includes( panel ) ? ac.btns[panel].buttons : [];
    },

    // whether to display this link
    haveLink( link ){
        const dialog = this.dialog;
        const ret = link.have ? dialog[link.have]() : true;
        //console.log( 'haveLink', dialog, link, dialog[link.have](), ret );
        return ret;
    },

    // returns the ordered list of links to be displayed depending of the current state
    linkLabel( link ){
        return link.key && link.key.length ? pI.label( pwiAccounts.strings, 'buttons', link.key ) : '';
    },

    linkTarget( link ){
        return link.target;
    },

    links(){
        const panel = pwiAccounts.panel.asked();
        const ac = Template.instance().AC;
        return Object.keys( ac.btns ).includes( panel ) ? ac.btns[panel].links : [];
    }
});

Template.ac_modal_buttons.events({

    'click .ac-link'( event, instance ){
        //console.log( event );
        pwiAccounts.panel.asked( instance.$( event.currentTarget ).find( 'a' ).attr( 'data-ac-target' ));
    },

    'click .ac-cancel'( event, instance ){
        //console.log( 'trigger ac-button-cancel' );
        instance.$( event.target ).trigger( 'ac-button-cancel' );
    },

    'click .ac-submit'( event, instance ){
        instance.$( event.target ).closest( '.acUserLogin' ).find( '.ac-user-login' ).trigger( 'ac-button-submit' );
    }
});
