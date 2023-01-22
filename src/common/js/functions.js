/*
 * pwi:accounts/src/common/js/functions.js
 */

pwiAccounts.email = function( id ){
    const u = Meteor.users.findOne({ _id: id });
    const email = u ? u.emails[0].address : '';
    return email;
}

pwiAccounts.isEmailVerified = function( id ){
    const u = Meteor.users.findOne({ _id: id });
    const verified = u ? u.emails[0].verified : '';
    return verified;
}
