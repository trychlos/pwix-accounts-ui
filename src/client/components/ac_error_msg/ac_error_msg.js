/*
 * pwix:accounts-ui/src/client/components/ac_error_msg/ac_error_msg.js
 *
 * A component which display an error message in a consistent way in the panels.
 * 
 * Parms:
 *  - AC: the acUserLogin internal data structure
 *  - withErrorArea: whether we want a dedicated error message area here, defaulting to false
 *      Most of the time, this parameter is set to true when building a panel
 *  - errorMsgRv: a ReactiveVar which contains the error message to be displayed
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../../../common/js/index.js';

import './ac_error_msg.html';

Template.ac_error_msg.helpers({
    // a dedicated error message
    //  when used, always keep the area height so that the display is kept stable
    errorMsg(){
        return '<p>'+( this.errorMsgRv?.get() || '&nbsp;' )+'</p>';
    }
});
