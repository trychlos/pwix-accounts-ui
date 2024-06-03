/*
 * pwix:accounts-ui/src/server/js/methods.js
 */

import { Accounts } from 'meteor/accounts-base';
import { AccountsTools } from 'meteor/pwix:accounts-tools';

AccountsUI._byEmailAddress = async function( email ){
    return Accounts.findUserByEmail( email )
        .then(( doc ) => { return AccountsTools.cleanupUserDocument( doc ); });
};

AccountsUI._byId = async function( id ){
    return Meteor.users.findOneAsync({ _id: id })
        .then(( doc ) => { return AccountsTools.cleanupUserDocument( doc ); });
};

AccountsUI._byUsername = async function( username ){
    return Accounts.findUserByUsername( username )
        .then(( doc ) => { return AccountsTools.cleanupUserDocument( doc ); });
};

Meteor.methods({
    // All AccountsUI.byXxxx methods return a user object without the crypted password nor the profile

    // find a user by his email address
    async 'AccountsUI.byEmailAddress'( email ){
        //console.debug( 'AccountsUI.byEmailAddress', email );
        return AccountsUI._byEmailAddress( email );
    },

    // find a user by his internal (mongo) identifier
    async 'AccountsUI.byId'( id ){
        //console.debug( 'AccountsUI.byId' );
        return AccountsUI._byId( id );
    },

    // find the user who holds the given reset password token
    async 'AccountsUI.byResetToken'( token ){
        //console.debug( 'AccountsUI.byResetToken' );
        return Meteor.users.findOneAsync({ 'services.password.reset.token': token },{ 'services.password.reset': 1 })
            .then(( doc ) => { return AccountsTools.cleanupUserDocument( doc ); });
    },

    // find a user by his username
    async 'AccountsUI.byUsername'( username ){
        //console.debug( 'AccountsUI.byUsername' );
        return AccountsUI._byUsername( username );
    },

    // find the user who holds the given email verification token
    async 'AccountsUI.byEmailVerificationToken'( token ){
        //console.debug( 'AccountsUI.byEmailVerificationToken' );
        return Meteor.users.findOneAsync({ 'services.email.verificationTokens': { $elemMatch: { token: token }}},{ 'services.email':1 })
            .then(( doc ) => { return AccountsTools.cleanupUserDocument( doc ); });
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

    // send a mail with a verification link
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
