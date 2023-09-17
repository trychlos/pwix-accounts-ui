/*
 * pwix:accounts-ui/src/server/js/validate.js
 */

import _ from 'lodash';
import SimpleSchema from 'simpl-schema';

import { Accounts } from 'meteor/accounts-base';

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
    //  cannot really validate the user here as this schema is most probably uncomplete
    //  just get the errors
    const validationContext =  new SimpleSchema( schema ).newContext();
    validationContext.validate( user, { ignore: [ 'keyNotInSchema'] });
    let isValid = validationContext.isValid();
    //console.log( isValid );
    //console.log( validationContext.validationErrors());

    // if schema is valid, individually check the datas
    if( isValid && AccountsUI.opts().haveEmailAddress() !== AC_FIELD_NONE ){
        user.emails.every(( o ) => {
            let result = AccountsUI._checkEmailAddress( o.address );
            if( !result.ok ){
                console.error( result.errors[0] );
            }
            isValid &&= result.ok;
            return isValid;
        });
    }
    if( isValid && AccountsUI.opts().haveUsername() !== AC_FIELD_NONE ){
        let result = AccountsUI._checkUsername( user.username );
        if( !result.ok ){
            console.error( result.errors[0] );
        }
        isValid &&= result.ok;
    }
    // the password is provided as a crypted password in user.services.password.bcrypt
    //  so unable to check it here
    if( isValid && ( !user || !user.services || !user.services.password || !user.services.password.bcrypt )){
        console.error( 'user.services.password.bcrypt is empty or undefined' );
        isValid = false;
    }

    // Return true to allow user creation to proceed
    return isValid;
});
