/*
 * pwi:accounts/src/server/js/methods.js
 */
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    // send a mail with a verification link
    'pwiAccounts.sendVerificationEmail'( id ){
        Accounts.sendVerificationEmail( id );
        return true;
    }
});

Meteor.methods({
    // create a user without auto login
    // https://docs.meteor.com/api/passwords.html#Accounts-createUser
    // called on the server, this methods returns the new account id
    'pwiAccounts.createUser'( email, password ){
        return Accounts.createUser({ email:email, password:password });
    }
});
