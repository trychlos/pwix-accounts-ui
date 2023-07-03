/*
 * pwix:accounts-ui/src/server/js/methods.js
 */
import { Accounts } from 'meteor/accounts-base';

// make sure we remove all sensitive information before returning to the client
_cleanUser = function ( user ){
    if( user ){
        if( user.services ){
            delete user.services.resume;
            if( user.services.password ){
                delete user.services.password.bcrypt;
            }
        }
        delete user.profile;
    }
    //console.log( user );
    return user;
};

Meteor.methods({
    // All pwixAccounts.byXxxx methods return a user object without the crypted password nor the profile

    // find a user by his email address
    'pwixAccounts.byEmailAddress'( email ){
        //console.debug( 'pwixAccounts.byEmailAddress' );
        return _cleanUser( Accounts.findUserByEmail( email ));
    },

    // find a user by his internal (mongo) identifier
    'pwixAccounts.byId'( id ){
        //console.debug( 'pwixAccounts.byId' );
        return _cleanUser( Meteor.users.findOne({ _id: id }));
    },

    // find the user who holds the given reset password token
    'pwixAccounts.byResetToken'( token ){
        //console.debug( 'pwixAccounts.byResetToken' );
        return _cleanUser( Meteor.users.findOne({ 'services.password.reset.token': token },{ 'services.password.reset': 1 }));
    },

    // find a user by his username
    'pwixAccounts.byUsername'( username ){
        //console.debug( 'pwixAccounts.byUsername' );
        return _cleanUser( Accounts.findUserByUsername( username ));
    },

    // find the user who holds the given email verification token
    'pwixAccounts.byEmailVerificationToken'( token ){
        //console.debug( 'pwixAccounts.byEmailVerificationToken' );
        return _cleanUser( Meteor.users.findOne({ 'services.email.verificationTokens': { $elemMatch: { token: token }}},{ 'services.email':1 }));
    },

    // create a user without auto login
    // https://docs.meteor.com/api/passwords.html#Accounts-createUser
    // called on the server, this methods returns the new account id
    'pwixAccounts.createUser'( options ){
        return Accounts.createUser( options );
    },

    // send a mail with a verification link
    //  the returned object has:
    //  - email
    //  - user { _id, services.email, emails }
    //  - token
    //  - url
    //  - options
    'pwixAccounts.sendVerificationEmail'( id ){
        return Accounts.sendVerificationEmail( id );
    },

    'pwixAccounts.sendVerificationEmailByEmail'( email ){
        const u = Accounts.findUserByEmail( email );
        //console.debug( u );
        if( u ){
            Accounts.sendVerificationEmail( u._id );
        }
    }
});
