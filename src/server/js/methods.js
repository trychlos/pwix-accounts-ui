/*
 * pwix:accounts-ui/src/server/js/methods.js
 */

import { Accounts } from 'meteor/accounts-base';
import { AccountsTools } from 'meteor/pwix:accounts-tools';

AccountsUI._byEmailAddress = function( email ){
    //console.debug( email );
    return AccountsTools.cleanupUserDocument( Accounts.findUserByEmail( email ));
};

AccountsUI._byId = function( id ){
    return AccountsTools.cleanupUserDocument( Meteor.users.findOne({ _id: id }));
};

AccountsUI._byUsername = function( username ){
    return AccountsTools.cleanupUserDocument( Accounts.findUserByUsername( username ));
};

Meteor.methods({
    // All AccountsUI.byXxxx methods return a user object without the crypted password nor the profile

    // find a user by his email address
    'AccountsUI.byEmailAddress'( email ){
        //console.debug( 'AccountsUI.byEmailAddress', email );
        return AccountsUI._byEmailAddress( email );
    },

    // find a user by his internal (mongo) identifier
    'AccountsUI.byId'( id ){
        //console.debug( 'AccountsUI.byId' );
        return AccountsUI._byId( id );
    },

    // find the user who holds the given reset password token
    'AccountsUI.byResetToken'( token ){
        //console.debug( 'AccountsUI.byResetToken' );
        return AccountsTools.cleanupUserDocument( Meteor.users.findOne({ 'services.password.reset.token': token },{ 'services.password.reset': 1 }));
    },

    // find a user by his username
    'AccountsUI.byUsername'( username ){
        //console.debug( 'AccountsUI.byUsername' );
        return AccountsUI._byUsername( username );
    },

    // find the user who holds the given email verification token
    'AccountsUI.byEmailVerificationToken'( token ){
        //console.debug( 'AccountsUI.byEmailVerificationToken' );
        return AccountsTools.cleanupUserDocument( Meteor.users.findOne({ 'services.email.verificationTokens': { $elemMatch: { token: token }}},{ 'services.email':1 }));
    },

    // create a user without auto login
    // https://docs.meteor.com/api/passwords.html#Accounts-createUser
    // and https://v3-docs.meteor.com/api/accounts.html#Accounts-createUser
    // called on the server, this methods returns the new account id
    'AccountsUI.createUser'( options ){
        const ret = Accounts.createUser( options );
        console.debug( 'Accounts.createUser() ret=', ret );
        return ret;
    },

    // send a mail with a verification link
    //  the returned object has:
    //  - email
    //  - user { _id, services.email, emails }
    //  - token
    //  - url
    //  - options
    'AccountsUI.sendVerificationEmailById'( id ){
        console.debug( 'AccountsUI.sendVerificationEmailById' );
        return Accounts.sendVerificationEmail( id );
    },

    'AccountsUI.sendVerificationEmailByEmail'( email ){
        const u = Accounts.findUserByEmail( email );
        //console.debug( u );
        if( u ){
            console.debug( 'AccountsUI.sendVerificationEmailByEmail' );
            return Accounts.sendVerificationEmail( u._id );
        }
    }
});
