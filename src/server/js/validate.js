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
    if( AccountsUI.opts().haveEmailAddress() !== AC_FIELD_NONE ){
        _.merge( schema, {
            emails: { type: Array },
            'emails.$': { type: Object },
            'emails.$.address': { type: String },
            'emails.$.verified': { type: Boolean },
        });
        if( AccountsUI.opts().haveEmailAddress() === AC_FIELD_OPTIONAL ){
            schema.emails.optional = true;
        }
    }
    if( AccountsUI.opts().haveUsername() !== AC_FIELD_NONE ){
        _.merge( schema, {
            username: { type: String }
        });
        if( AccountsUI.opts().haveUsername() === AC_FIELD_OPTIONAL ){
            schema.username.optional = true;
        }
    }
    //console.debug( schema );
    new SimpleSchema( schema ).validate( user );

    // if schema is valid, individually check the datas
    let ok = true;
    if( ok && AccountsUI.opts().haveEmailAddress() !== AC_FIELD_NONE ){
        user.emails.every(( o ) => {
            let result = AccountsUI._checkEmailAddress( o.address );
            if( !result.ok ){
                console.error( result.errors[0] );
            }
            ok &= result.ok;
            return ok;
        });
    }
    if( ok && AccountsUI.opts().haveUsername() !== AC_FIELD_NONE ){
        let result = AccountsUI._checkUsername( user.username );
        if( !result.ok ){
            console.error( result.errors[0] );
        }
        ok &= result.ok;
    }
    // the password is provided as a crypted password in user.services.password.bcrypt
    //  so unable to check it here
    if( ok && ( !user || !user.services || !user.services.password || !user.services.password.bcrypt )){
        console.error( 'user.services.password.bcrypt is empty or undefined' );
        ok = false;
    }

    // Return true to allow user creation to proceed
    return ok;
});
