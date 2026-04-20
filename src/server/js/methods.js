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
    //  as soon as the token has been found, and even if it is no more valid of if the user cancels his password reset, then the email can be considered as verified
    async 'pwix.AccountsUI.m.byResetToken'( acName, token ){
        check( acName, Match.NonEmptyString );
        check( token, Match.NonEmptyString );
        const acInstance = AccountsCore.getInstance( acName );
        check( acInstance, AccountsCore.Account );
        let userDoc = await acInstance.collection().findOneAsync({ 'services.password.reset.token': token },{ 'services.password.reset': 1 });
        // if the user is found, then the email can be considered as verified
        if( userDoc ){
            const email = userDoc.services.password.reset.email;
            // shouldn't we rather call applyReadTransforms() ?
            //userDoc = await AccountsCore.s.applyReadTransforms( 'pwix.AccountsUI.m.byResetToken', acInstance, userDoc );
            userDoc = await AccountsCore.Transforms.cleanupUserDocument( acInstance, userDoc );
            if( email ){
                for( const it of ( userDoc.emails || [] )){
                    if( it.address === email ){
                        if( !it.verified ){
                            it.verified = true;
                            const res = await AccountsCore.s.updateByQuery( acInstance, { _id: userDoc._id }, userDoc );
                            //logger.debug( 'set email verified', email, res );
                        }
                        break;
                    }
                }
            }
        }
        return userDoc;
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

    async 'pwix.AccountsUI.m.sendVerificationEmailByEmail'( email ){
        const userDoc = await Accounts.findUserByEmail( email );
        if( userDoc ){
            return await Accounts.sendVerificationEmail( userDoc._id );
        } else {
            logger.error( 'no user found by email', email );
        }
    }
});
