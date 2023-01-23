/*
 * pwi:accounts/src/client/components/ac_signup/ac_signup.js
 * 
 * Parms:
 *  - display: the acDisplay instance
 */
import '../../../common/js/index.js';

import '../ac_input_mail/ac_input_mail.js';
import '../ac_input_password/ac_input_password.js';

import './ac_signup.html';

Template.ac_signup.onCreated( function(){
    const self = this;

    self.AC = {
        enableSubmit: function(){
            const mail = self.$( '.ac-input-mail .ac-input' ).val();
            const pwd = self.$( '.ac-input-password .ac-input' ).val();
            const btn = self.$( '.ac-signup' ).closest( '.acUserLogin' ).find( '.ac-submit' );
            let errs = [];
            const emailOk =  pwiAccounts.validateEmail( mail );
            if( !emailOk ){
                errs.push( '<p>'+pwiI18n.label( pwiAccounts.strings, 'user', 'email_invalid' )+'</p>' );
            }
            const lengthOk = pwiAccounts.validatePasswordLength( pwd );
            if( !lengthOk ){
                errs.push( '<p>'+pwiI18n.label( pwiAccounts.strings, 'user', 'password_too_short' )+'</p>' );
            }
            const strengthOk = pwiAccounts.validatePasswordStrength( pwd, self.AC.strength );
            if( !strengthOk ){
                errs.push( '<p>'+pwiI18n.label( pwiAccounts.strings, 'user', 'password_too_weak' )+'</p>' );
            }
            btn.prop( 'disabled', !( emailOk && lengthOk && strengthOk ));
            self.AC.errors.set( errs );
        },
        resetInput(){
            self.$( '.ac-input-mail input' ).val( '' );
            self.$( '.ac-input-password input' ).val( '' );
            self.$( 'input' ).first().focus();
        },
        strength: '',
        length: 0,
        errors: new ReactiveVar( [] )
    };
});

Template.ac_signup.onRendered( function(){
    this.AC.enableSubmit();
});

Template.ac_signup.helpers({
    // error message
    errorMsg(){
        let html = Template.instance().AC.errors.get().join( '\n' );
        const errmsg = this.display.errorMsg();
        if( errmsg ){
            html += '\n<p>'+errmsg+'</p>';
        }
        return html;
    },

    // provides data to ac_input_password template
    passwordData(){
        return {
            new: true
        };
    },

    // the text at the first place of the section
    textOne(){
        return this.display.signupTextOne();
    },

    // the text at the second place of the section
    textTwo(){
        return this.display.signupTextTwo();
    },

    // the text at the third place of the section
    textThree(){
        return this.display.signupTextThree();
    }
});

Template.ac_signup.events({
    'keyup .ac-mail-input'( event, instance ){
        instance.AC.enableSubmit();
    },
    'keyup .ac-input-password'( event, instance ){
        instance.AC.enableSubmit();
    },
    'ac-password .ac-change-pwd'( event, instance, data ){
        // may happen that data be undefined !
        if( data ){
            instance.AC.strength = data.strength;
            instance.AC.length = data.length;
        }
    },

    // message sent from acUserLogin after having successfully created a new user
    //  clear the input fields to prepare the creation of another account
    'ac-clear .ac-signup'( event, instance ){
        instance.AC.resetInput();
        return false;
    }
});
