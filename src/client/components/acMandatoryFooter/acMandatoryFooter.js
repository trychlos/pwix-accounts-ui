/*
 * pwix:accounts-ui/src/client/components/acMandatoryFooter/acMandatoryFooter.js
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import './acMandatoryFooter.html';

Template.acMandatoryFooter.helpers({
    // mandatory fields
    label(){
        return i18n.label( I18N, 'user.mandatory_fields' );
    }
});
