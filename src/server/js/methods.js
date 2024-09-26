/*
 * pwix:accounts-ui/src/server/js/methods.js
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Accounts } from 'meteor/accounts-base';
import { AccountsHub } from 'meteor/pwix:accounts-hub';

Meteor.methods({
    // All AccountsUI.byXxxx methods return a user object without the crypted password nor the profile

    // find the user who holds the given reset password token
    async 'AccountsUI.byResetToken'( ahName, token ){
        //console.debug( 'AccountsUI.byResetToken' );
        const ahInstance = AccountsHub.instances[ahName];
        assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
        return ahInstance.collection().findOneAsync({ 'services.password.reset.token': token },{ 'services.password.reset': 1 })
            .then(( doc ) => { return AccountsHub.s.cleanupUserDocument( doc ); });
    },

    // find the user who holds the given email verification token
    async 'AccountsUI.byEmailVerificationToken'( token ){
        //console.debug( 'AccountsUI.byEmailVerificationToken' );
        return Meteor.users.findOneAsync({ 'services.email.verificationTokens': { $elemMatch: { token: token }}},{ 'services.email':1 })
            .then(( doc ) => { return AccountsHub.s.cleanupUserDocument( doc ); });
    },

    // create a user without auto login
    // https://docs.meteor.com/api/passwords.html#Accounts-createUser
    // and https://v3-docs.meteor.com/api/accounts.html#Accounts-createUser
    // called on the server, this methods returns the new account id
    async 'AccountsUI.createUser'( options ){
        return Accounts.createUser( options )
            .then(( ret ) => {
                console.debug( 'AccountsUI.createUser() ret=', ret );
                return ret;
            });
    },

    // ask to send a reset password email
    // see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L363
    // see https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_server.js#L529
    // do not send extra data when using the standard 'users' collection
    // return true|false
    async 'AccountsUI.forgotPassword'( ahName, email ){
        const ahInstance = AccountsHub.instances[ahName];
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
    async 'AccountsUI.sendVerificationEmailById'( id ){
        return Accounts.sendVerificationEmail( id )
            .then(( ret ) => {
                console.debug( 'AccountsUI.sendVerificationEmailById() ret=', ret );
                return ret;
            });
    },

    async 'AccountsUI.sendVerificationEmailByEmail'( email ){
        return Accounts.findUserByEmail( email )
            .then(( doc ) => {
                if( doc ){
                    return Accounts.sendVerificationEmail( doc._id );
                } else {
                    console.error( 'no user found by email', email );
                }
            });
    }
});
