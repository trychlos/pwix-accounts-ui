/*
 * pwi:accounts/src/client/components/ac_input_mail/ac_input_mail.js
 *
 * Email input field
 * 
 * Parms:
 *  - label: String, defaulting to 'Mail address'
 *  - placeholder: String, defaulting to 'Enter your password'
 */
import { pwiI18n as pI } from 'meteor/pwi:i18n';

import '../../../common/js/index.js';

import './ac_input_mail.html';

Template.ac_input_mail.onCreated( function(){
    const self = this;
    //console.log( self );

    self.AC = {
        // provides a translated label
        i18n( key ){
            const data = Template.currentData();
            let text = '';
            if( Object.keys( data ).includes( key )){
                text = data[key];
            } else {
                text = pI.label( pwiAccounts.strings, 'input_mail', key );
            }
            return text;
        }
    };
});

Template.ac_input_mail.helpers({
    // returns the keyed translated string
    text( key ){
        return Template.instance().AC.i18n( key );
    }
});
