/*
 * pwix:accounts-ui/src/client/components/acMandatoryField/acMandatoryField.js
 */

import './acMandatoryField.html';

Template.acMandatoryField.onRendered( function(){
    const ratio = Template.currentData().acMandatoryRatio || 0.8;
    this.$( '.acMandatoryField img' ).css({ width: ( 16*ratio )+'px' });
});
