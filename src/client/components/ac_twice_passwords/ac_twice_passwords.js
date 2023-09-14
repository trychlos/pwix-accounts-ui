/*
 * pwix:accounts-ui/src/client/components/ac_twice_passwords/ac_twice_passwords.js
 *
 * New password entering with one or two input fields.
 * 
 * In order to correctly manage the UI reactivity, the parent should implement handlers for
 * 'ac-password-data' and 'ac-twice-data' messages.
 * 
 * Parms:
 *  - component: the acComponent object
 *      Is undefined when invoked from ac_reset_pwd template
 *      Take care!
 *  - role: 'signup|change|reset'
 *      This happens to also be the prefix of the to-be-called AccountsUI options methods
 *      Do not change!
 *  - label: String, defaulting to 'Password'
 *  - placeholder1: String, defaulting to 'Enter your password'
 *  - placeholder2: String, defaulting to 'Renter your password'
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import '../ac_input_password/ac_input_password.html';

import './ac_twice_passwords.html';

Template.ac_twice_passwords.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        twice: new ReactiveVar( false ),
        error: new ReactiveVar( '' ),

        check(){
            const pwd1 = self.$( '.ac-twice-passwords .ac-newone .ac-input' ).val();
            const pwd2 = self.AC.twice.get() ? self.$( '.ac-twice-passwords .ac-newtwo .ac-input' ).val() : pwd1;
            self.AC.error.set( '' );
            // whether the new password 'pwd1' is ok is checked by the input password component
            // we have to check that the two occurences 'pwd1' and 'pwd2' are the same
            const equalsOk = pwd1 === pwd2;
            self.AC.error.set( equalsOk ? '' : pwixI18n.label( I18N, 'twice_passwords.password_different' ) );
            self.$( '.ac-twice-passwords' ).trigger( 'ac-twice-data', { ok: equalsOk, length: pwd1.length });
        }
    };

    self.autorun(() => {
        const fn = Template.currentData().role + 'PasswordTwice';
        const component = Template.currentData().component;
        self.AC.twice.set( 
            component && component.opts[fn] ?
            component.opts[fn]() : ( AccountsUI.opts()[fn] ? AccountsUI.opts()[fn]() : AccountsUI.opts().passwordTwice()));
    });
});

Template.ac_twice_passwords.helpers({
    // error message
    errorMsg(){
        return '<p>' + Template.instance().AC.error.get() + '</p>';
    },

    // fieldset legend
    legend(){
        const component = Template.currentData().component;
        const signup = Template.currentData().role === 'signup';
        return signup ? component.opts().signupLegendPassword() : '';
    },

    // params to first occurrence of new password
    parmNewOne(){
        const component = Template.currentData().component;
        const mandatoryBorder = component && component.opts()
                ? component.opts().coloredBorders() === AC_COLORED_MANDATORY : AccountsUI.opts().coloredBorders() === AC_COLORED_MANDATORY;
        return {
            label: this.label || pwixI18n.label( I18N, 'twice_passwords.label' ),
            placeholder: this.placeholder1 || pwixI18n.label( I18N, 'twice_passwords.placeholder1' ),
            new: true,
            checkStrength: true,
            mandatoryBorder: mandatoryBorder,
            autocomplete: false
        }
    },

    // params to second occurrence of new password
    //  do not set as 'new' to not have the 'strength' display
    parmNewTwo(){
        const component = Template.currentData().component;
        const mandatoryBorder = component && component.opts()
                ? component.opts().coloredBorders() === AC_COLORED_MANDATORY : AccountsUI.opts().coloredBorders() === AC_COLORED_MANDATORY;
        return {
            label: '',
            placeholder: this.placeholder2 || pwixI18n.label( I18N, 'twice_passwords.placeholder2' ),
            mandatoryBorder: mandatoryBorder,
            autocomplete: false
        }
    },

    // whether we must display two input fields ?
    twice(){
        return Template.instance().AC.twice.get();
    }
});

Template.ac_twice_passwords.events({
    'ac-password-data .ac-twice-passwords'( event, instance, data ){
        instance.AC.check();
        // do not bubble up
        return false;
    }
});
