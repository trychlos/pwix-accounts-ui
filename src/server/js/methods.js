/*
 * pwix:accounts/src/server/js/methods.js
 */
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    // retrieve the account who holds the given reset password token
    'pwiAccounts.byResetToken'( token ){
        const user = Meteor.users.findOne({ 'services.password.reset.token': token },{ 'services.password.reset': 1 });
        if( user ){
            delete user['services.password.bcrypt'];
            delete user['services.resume'];
        }
        console.log( 'pwiAccounts.byResetToken', user );
        return user;
    },

    // create a user without auto login
    // https://docs.meteor.com/api/passwords.html#Accounts-createUser
    // called on the server, this methods returns the new account id
    'pwiAccounts.createUser'( options ){
        return Accounts.createUser( options );
    },

    // return true if the email address already exists
    'pwiAccounts.existsEmailAddress'( email ){
        const res = Accounts.findUserByEmail( email );
        console.log( 'existsEmailAddress', email, res );
        return res;
    },

    // return true if the username already exists
    'pwiAccounts.existsUsername'( username ){
        const res = Accounts.findUserByUsername( username );
        console.log( 'existsUsername', username, res );
        return res !== undefined;
    },

    // @param {String} a user identifier
    // @returns {Object}
    //      {
    //          exists: true|false,
    //          emails: array of objects { address, verified }, maybe empty,
    //          username: as a string
    //      }
    'pwiAccounts.getIdentity'( id ){
        const answer = Meteor.users.findOne({ _id: id }, { emails: 1, username: 1 });
        let result = {
            exists: false,
            emails: [],
            username: null
        };
        //console.log( 'pwiAccounts.getEmailAddresses answer', answer );
        if( answer ){
            result.exists = true;
            result.emails = answer.emails;
            result.username = answer.username;
        }
        //console.log( 'pwiAccounts.getEmailAddresses result', result );
        return result;
    },

    // send a mail with a verification link
    'pwiAccounts.sendVerificationEmail'( id ){
        Accounts.sendVerificationEmail( id );
        return true;
    }
});
