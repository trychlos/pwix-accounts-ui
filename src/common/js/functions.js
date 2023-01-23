/*
 * pwix:accounts/src/common/js/functions.js
 */

pwiAccounts.emailAddress = function( id ){
    return pwiAccounts.User.emailAddress();
}

pwiAccounts.isEmailVerified = function( id ){
    const u = Meteor.users.findOne({ _id: id });
    const verified = u ? u.emails[0].verified : '';
    return verified;
}
