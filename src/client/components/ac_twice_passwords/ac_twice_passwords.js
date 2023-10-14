/*
 * pwix:accounts-ui/src/client/components/ac_twice_passwords/ac_twice_passwords.js
 *
 * New password entering with one or two input fields.
 * 
 * In order to correctly manage the UI reactivity, the parent should implement handlers for
 * 'ac-password-data' and 'ac-twice-data' messages.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *      Is undefined when invoked from ac_reset_pwd template
 *      Take care!
 *  - role: 'signup|change|reset'
 *      This happens to also be the prefix of the to-be-called AccountsUI options methods
 *      Do not change!
 *  - withError: whether we want a dedicated error message here, defaulting to false
 *  - with Fieldset: whether to display a field set (and a legend), defaulting to false
 *  - withMandatoryBorder: whether we want display the mandatory borders on input field, defaulting to acUserLogin configured option, defaulting to globally configured option
 *  - withMandatoryField: whether we want display the mandatory indicator, defaulting to false
 *  - label: String, defaulting to 'Password:'
 *  - legend: String, defaulting to 'Password'
 *  - placeholder1: String, defaulting to 'Enter your password'
 *  - placeholder2: String, defaulting to 'Renter your password'
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import '../ac_input_password/ac_input_password.html';

import './ac_twice_passwords.html';

Template.ac_twice_passwords.helpers({
    // returns the text, maybe from data context, defaulting to the translated string
    text( key ){
        return Object.keys( this ).includes( key ) ? this[key] : pwixI18n.label( I18N, 'twice_password.'+key );
    }
});

/***
 *** sub-template
 ***/

Template.ac_twice_passwords_sub.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        twice: new ReactiveVar( false ),
        errorMsg: new ReactiveVar( '' ),

        check(){
            const pwd1 = self.$( '.ac-twice-passwords-sub .ac-newone .ac-input' ).val();
            const pwd2 = self.AC.twice.get() ? self.$( '.ac-twice-passwords-sub .ac-newtwo .ac-input' ).val() : pwd1;
            self.AC.displayError( '' );
            // whether the new password 'pwd1' is ok is checked by the input password component
            // we have to check that the two occurences 'pwd1' and 'pwd2' are the same
            const equalsOk = pwd1 === pwd2;
            self.AC.displayError( equalsOk ? '' : pwixI18n.label( I18N, 'twice_passwords.password_different' ) );
            self.$( '.ac-twice-passwords-sub' ).trigger( 'ac-twice-data', {
                ok: equalsOk,
                length: pwd1.length,
                password: equalsOk ? pwd1 : null
            });
        },

        // display an error message, either locally (here) ou at the panel level
        displayError( msg ){
            //const withError = Boolean( Template.currentData().withError !== false );
            // see https://stackoverflow.com/questions/39271499/template-actual-data-context/39272483#39272483
            const withError = Boolean( Blaze.getData( self.view ).withError === true );
            if( withError ){
                self.AC.errorMsg.set( msg );
            } else {
                self.$( '.ac-twice-passwords-sub' ).trigger( 'ac-display-error', msg );
            }
        }
    };

    self.autorun(() => {
        const fn = Template.currentData().role + 'PasswordTwice';
        const parentAC = Template.currentData().AC;
        self.AC.twice.set( 
            parentAC && parentAC.options && parentAC.options[fn] ?
            parentAC.options[fn]() : ( AccountsUI.opts()[fn] ? AccountsUI.opts()[fn]() : AccountsUI.opts().passwordTwice()));
    });
});

Template.ac_twice_passwords_sub.helpers({

    // a dedicated error message
    //  when used, always keep the area height so that the display is kept stable
    errorMsg(){
        return '<p>'+( Template.instance().AC.errorMsg.get() || '&nbsp;' )+'</p>';
    },

    // params to first occurrence of new password
    parmNewOne(){
        const mandatoryBorder = this.AC && this.AC.options
                ? this.AC.options.coloredBorders() === AccountsUI.C.Colored.MANDATORY : AccountsUI.opts().coloredBorders() === AccountsUI.C.Colored.MANDATORY;
        return {
            AC: this.AC,
            label: this.label || pwixI18n.label( I18N, 'twice_passwords.label' ),
            placeholder: this.placeholder1 || pwixI18n.label( I18N, 'twice_passwords.placeholder1' ),
            new: true,
            withStrength: true,
            withMandatoryBorder: mandatoryBorder,
            withMandatoryField: Boolean( this.withMandatoryField === true )
        }
    },

    // params to second occurrence of new password
    //  do not set as 'new' to not have the 'strength' display
    parmNewTwo(){
        const mandatoryBorder = this.AC && this.AC.options
                ? this.AC.options.coloredBorders() === AccountsUI.C.Colored.MANDATORY : AccountsUI.opts().coloredBorders() === AccountsUI.C.Colored.MANDATORY;
        return {
            AC: this.AC,
            label: '',
            placeholder: this.placeholder2 || pwixI18n.label( I18N, 'twice_passwords.placeholder2' ),
            withMandatoryBorder: mandatoryBorder,
            withMandatoryField: Boolean( this.withMandatoryField === true )
        }
    },

    // whether we must display two input fields ?
    twice(){
        return Template.instance().AC.twice.get();
    }
});

Template.ac_twice_passwords_sub.events({
    'ac-password-data .ac-twice-passwords-sub'( event, instance, data ){
        instance.AC.check();
        // do not bubble up
        return false;
    }
});
