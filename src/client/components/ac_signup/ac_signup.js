/*
 * pwix:accounts-ui/src/client/components/ac_signup/ac_signup.js
 * 
 * Parms:
 *  - managerId: the identifier allocated by acManager
 */

import { ReactiveVar } from 'meteor/reactive-var';

import '../ac_input_email/ac_input_email.js';
import '../ac_input_password/ac_input_password.js';
import '../ac_input_username/ac_input_username.js';
import '../ac_mandatory_footer/ac_mandatory_footer.js';
import '../ac_twice_passwords/ac_twice_passwords.js';

import './ac_signup.html';

Template.ac_signup.onCreated( function(){
    const self = this;
    //console.debug( 'onCreated', this, Template.currentData());

    self.AC = {
        component: new ReactiveVar( null ),
        emailOk: new ReactiveVar( true ),
        passwordOk: new ReactiveVar( true ),
        twiceOk: new ReactiveVar( true ),
        usernameOk: new ReactiveVar( true ),

        // submit button
        submitBtn: null,

        haveEmailAddress(){
            return AccountsUI.opts().haveEmailAddress() !== AC_FIELD_NONE;
        },
        haveUsername(){
            console.debug( 'username', AccountsUI.opts().haveUsername());
            return AccountsUI.opts().haveUsername() !== AC_FIELD_NONE;
        },
        resetInput(){
            self.$( '.ac-input-password' ).trigger( 'ac-reset-input' );
            if( self.AC.haveEmailAddress()){
                self.$( '.ac-input-email' ).trigger( 'ac-reset-input' );
            }
            if( self.AC.haveUsername()){
                self.$( '.ac-input-username' ).trigger( 'ac-reset-input' );
            }
            self.$( 'input' ).first().focus();
        }
    };

    // setup the acUserLogin acManager component
    self.autorun(() => {
        const managerId = Template.currentData().managerId;
        if( managerId ){
            self.AC.component.set( AccountsUI.Manager.component( managerId ));
        }
    });
});

Template.ac_signup.onRendered( function(){
    const self = this;

    self.AC.submitBtn = self.$( '.ac-signup' ).closest( '.ac-content' ).find( '.ac-submit' );
    this.AC.resetInput();

    self.autorun(() => {
        self.AC.submitBtn.prop( 'disabled', !self.AC.emailOk.get() || !self.AC.passwordOk.get() || !self.AC.twiceOk.get() || !self.AC.usernameOk.get());
    });
});

Template.ac_signup.helpers({
    // error message
    errorMsg(){
        // even if we have no message at all, we keep at least one blank line
        return AccountsUI.Display.errorMsg();
    },

    // whether email address is permitted
    haveEmailAddress(){
        return Template.instance().AC.haveEmailAddress();
    },

    // whether username is permitted
    haveUsername(){
        return Template.instance().AC.haveUsername();
    },

    // parameters for the email address
    parmsEmailAddress(){
        const component = Template.instance().AC.component.get();
        return {
            component: component,
            new: true,
            placeholder: component.opts().signupEmailPlaceholder()
        };
    },

    // parameters for the email address and username inputs
    parmsUser(){
        return {
            component: Template.instance().AC.component.get(),
            new: true
        };
    },

    // parameters for the password input
    parmsTwice(){
        const component = Template.instance().AC.component.get();
        return {
            component: component,
            role: 'signup',
            placeholder1: component.opts().signupPasswdOnePlaceholder(),
            placeholder2: component.opts().signupPasswdTwoPlaceholder()
        };
    },

    // the text at the first place of the section (if username)
    textOne(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextOne() : '';
    },

    // the text at the second place of the section (if email)
    textTwo(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextTwo() : '';
    },

    // the text at the third place of the section
    textThree(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextThree() : '';
    },

    // the text at the fourth place of the section
    textFour(){
        const component = Template.instance().AC.component.get();
        return component ? component.opts().signupTextFour() : '';
    }
});

Template.ac_signup.events({
    // message sent by the input email component
    'ac-email-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-email-data', data );
        instance.AC.emailOk.set( data.ok );
    },

    // message sent by the input password component
    //  NB: happens that data arrives undefined :( see #24
    'ac-password-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-password-data', data );
        instance.AC.passwordOk.set( data ? data.ok : false );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        instance.AC.twiceOk.set( data ? data.ok : false );
    },

    // message sent by the input username component
    'ac-username-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-username-data', data );
        instance.AC.usernameOk.set( data.ok );
    },

    // message sent from acUserLogin after having successfully created a new user
    //  clear the input fields to prepare the creation of another account
    'ac-clear .ac-signup'( event, instance ){
        instance.AC.resetInput();
        return false;
    }
});
