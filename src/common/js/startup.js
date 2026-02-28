/*
 * pwix:accounts-ui/src/common/js/startup.js
 */

import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

Meteor.startup( function(){
    logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.STARTUP }, 'AccountsUI', AccountsUI );
});
