/*
 * pwix:accounts-ui/src/server/js/methods.js
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Accounts } from 'meteor/accounts-base';
import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

Meteor.methods({
    // All AccountsUI.byXxxx methods return a user object without the crypted password nor the profile

    // find the user who holds the given reset password token
    async 'pwix.AccountsUI.m.byResetToken'( ahName, token ){
        const ahInstance = AccountsHub.getInstance( ahName );
        assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
        const doc = await ahInstance.collection().findOneAsync({ 'services.password.reset.token': token },{ 'services.password.reset': 1 });
        return AccountsHub.s.cleanupUserDocument( doc );
    },

    // find the user who holds the given email verification token
    async 'pwix.AccountsUI.m.byEmailVerificationToken'( token ){
        const doc = await Meteor.users.findOneAsync({ 'services.email.verificationTokens': { $elemMatch: { token: token }}},{ 'services.email':1 });
        return AccountsHub.s.cleanupUserDocument( doc );
    },

    // create a user without auto login
    // https://docs.meteor.com/api/passwords.html#Accounts-createUser
    // and https://v3-docs.meteor.com/api/accounts.html#Accounts-createUser
    // called on the server, this methods returns the new account id
    async 'pwix.AccountsUI.m.createUser'( options ){
        const ret = await Accounts.createUser( options );
        logger.debug( 'pwix.AccountsUI.m.createUser() ret=', ret );
        return ret;
    },

    // ask to send a reset password email
    // see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L363
    // see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L529
    // do not send extra data when using the standard 'users' collection
    // return true|false
    async 'pwix.AccountsUI.m.forgotPassword'( ahName, email ){
        const ahInstance = AccountsHub.getInstance( ahName );
        assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
        let res = null;
        const user = await ahInstance.byEmailAddress( email );
        if( user ){
            if( ahName === AccountsHub.ahOptions._defaults.name ){
                res = await Accounts.sendResetPasswordEmail( user._id, email );
            } else {
                res = await Accounts.sendResetPasswordEmail( user._id, email, undefined, { ahName: ahName });
            }
        }
        return Boolean( res );
    },

    // send an email with a verification link
    //  the returned object has:
    //  - email
    //  - user { _id, services.email, emails }
    //  - token
    //  - url
    //  - options
    async 'pwix.AccountsUI.m.sendVerificationEmailById'( id ){
        const ret = await Accounts.sendVerificationEmail( id );
        logger.debug( 'pwix.AccountsUI.m.sendVerificationEmailById() ret=', ret );
        return ret;
    },

    async 'pwix.AccountsUI.m.sendVerificationEmailByEmail'( email ){
        const doc = await Accounts.findUserByEmail( email );
        if( doc ){
            return Accounts.sendVerificationEmail( doc._id );
        } else {
            logger.error( 'no user found by email', email );
        }
    }
});
