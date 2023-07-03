/*
 * pwix:accounts-ui/src/server/js/validate.js
 */
import { Accounts } from 'meteor/accounts-base';

import SimpleSchema from 'simpl-schema';
import _ from 'lodash';

// Ensuring every user has an email address and/or a username
Accounts.validateNewUser(( user ) => {
    let schema = {
        _id: { type: String },
        createdAt: { type: Date },
        services: { type: Object, blackbox: true }
    };
    if( pwixAccounts.opts().haveEmailAddress() !== AC_FIELD_NONE ){
        _.merge( schema, {
            emails: { type: Array },
            'emails.$': { type: Object },
            'emails.$.address': { type: String },
            'emails.$.verified': { type: Boolean },
        });
        if( pwixAccounts.opts().haveEmailAddress() === AC_FIELD_OPTIONAL ){
            schema.emails.optional = true;
        }
    }
    if( pwixAccounts.opts().haveUsername() !== AC_FIELD_NONE ){
        _.merge( schema, {
            username: { type: String }
        });
        if( pwixAccounts.opts().haveUsername() === AC_FIELD_OPTIONAL ){
            schema.username.optional = true;
        }
    }
    //console.debug( schema );
    new SimpleSchema( schema ).validate( user );

    // Return true to allow user creation to proceed
    return true;
});
