/*
 * pwix:accounts/src/client/components/ac_mandatory_footer/ac_mandatory_footer.js
 */

import { pwiI18n } from 'meteor/pwi:i18n';

import '../ac_mandatory_field/ac_mandatory_field.js';

import './ac_mandatory_footer.html';

Template.ac_mandatory_footer.helpers({
    // mandatory fields
    mandatory_label(){
        return pwiI18n.label( pwiAccounts.strings, 'user', 'mandatory_fields' );
    }
});
