/*
 * pwi:accounts/src/client/components/ac_input_password/ac_input_password.js
 *
 * Password input field
 * 
 * Parms:
 *  - label: String, defaulting to 'Password'
 *  - placeholder: String, defaulting to 'Enter your password'
 *  - new: Boolean, true for entering a new password (so to be checked for its strength)
 */
import zxcvbn from 'zxcvbn';

import { pwiI18n as pI } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import './ac_input_password.html';

Template.ac_input_password.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        score: [
            { backgroundColor: '#ff0000' },
            { backgroundColor: '#cc3300' },
            { backgroundColor: '#669900' },
            { backgroundColor: '#33cc00' },
            { backgroundColor: '#00ff00' },
        ],
        // check the strength of the password with https://www.npmjs.com/package/zxcvbn
        //  is only called for a new password
        check( element ){
            const val = element.val();
            const res = zxcvbn( val );
            self.$( '.ac-strength-bar' ).css( self.AC.score[res.score] );
            let width = val.trim().length ? 1+parseInt( res.score ) : 0;
            self.$( '.ac-strength-bar' ).css({ width: width+'em' });
            width = 5-width;
            self.$( '.ac-strength-other' ).css({ width: width+'em' });
        },
        // provides a translated label
        i18n( key ){
            const data = Template.currentData();
            let text = '';
            if( Object.keys( data ).includes( key )){
                text = data[key];
            } else {
                text = pI.label( pwiAccounts.strings, 'input_password', key );
            }
            return text;
        }
    };
});

Template.ac_input_password.onRendered( function(){
    const self = this;

    // initialize the strength pbar
    if( Template.currentData().new ){
        self.AC.check( self.$( '.ac-input' ));
    }
});

Template.ac_input_password.helpers({
    // prevent the use of the div.ac-label if nothing is to be written
    // - key is planned a the form label
    // - if new, there will be the strength indicator
    isEmpty( key ){
        const text = Template.instance().AC.i18n( key );
        const isNew = this.new ? true : false;
        return !text && !isNew;
    },

    // whether we are entering a new password
    isNew(){
        return this.new ? true : false;
    },

    // returns the keyed translated string
    i18n( key ){
        return Template.instance().AC.i18n( key );
    }
});

Template.ac_input_password.events({
    'keyup .ac-input'( event, instance ){
        if( Template.currentData().new ){
            instance.AC.check( instance.$( event.currentTarget ));
        }
    }
});
