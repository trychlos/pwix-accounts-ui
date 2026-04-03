/*
 * pwix:accounts-ui/src/server/js/methods.js
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Accounts } from 'meteor/accounts-base';
import { AccountsCore } from 'meteor/pwix:accounts-core';
import { check, Match } from 'meteor/check';
import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

Meteor.methods({
    // All AccountsUI.byXxxx methods return a user object without the crypted password nor the profile

    // find the user who holds the given email verification token
    async 'pwix.AccountsUI.m.byEmailVerificationToken'( token ){
        check( token, Match.NonEmptyString );
        const userDoc = await Meteor.users.findOneAsync({ 'services.email.verificationTokens': { $elemMatch: { token: token }}},{ 'services.email': 1 });
        const acInstance = AccountsCore.getInstance( 'users' );
        check( acInstance, AccountsCore.Account );
        return await AccountsCore.Transforms.cleanupUserDocument( acInstance, userDoc );
    },

    // find the user who holds the given reset password token
    async 'pwix.AccountsUI.m.byResetToken'( acName, token ){
        check( acName, Match.NonEmptyString );
        check( token, Match.NonEmptyString );
        const acInstance = AccountsCore.getInstance( acName );
        check( acInstance, AccountsCore.Account );
        const userDoc = await acInstance.collection().findOneAsync({ 'services.password.reset.token': token },{ 'services.password.reset': 1 });
        return await AccountsCore.Transforms.cleanupUserDocument( acInstance, userDoc );
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
    // return true|false
    async 'pwix.AccountsUI.m.forgotPassword'( acName, email ){
        check( acName, Match.NonEmptyString );
        check( email, Match.NonEmptyString );
        const acInstance = AccountsCore.getInstance( acName );
        check( acInstance, AccountsCore.Account );
        let res = null;
        const userDoc = await acInstance.byEmailAddress( email );
        if( userDoc ){
            res = await Accounts.sendResetPasswordEmail( userDoc._id, email, undefined, { acName: acName });
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
        const userDoc = await Accounts.findUserByEmail( email );
        if( userDoc ){
            return Accounts.sendVerificationEmail( userDoc._id );
        } else {
            logger.error( 'no user found by email', email );
        }
    }
});
