/*
 * pwix:accounts/src/client/components/ac_mandatory_footer/ac_mandatory_footer.js
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../ac_mandatory_field/ac_mandatory_field.js';

import './ac_mandatory_footer.html';

Template.ac_mandatory_footer.helpers({
    // mandatory fields
    mandatory_label(){
        return i18n.label( I18N, 'user.mandatory_fields' );
    }
});
