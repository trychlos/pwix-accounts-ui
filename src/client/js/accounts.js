/*
 * /src/client.js/accounts.js
 */
import { Accounts } from 'meteor/accounts-base';

import { pwiBootbox } from 'meteor/pwi:bootbox';
import { pwiI18n } from 'meteor/pwi:i18n';

import '../../common/js/index.js';

import '../components/ac_reset_pwd/ac_reset_pwd.js';

_tokenExpired = function(){
    pwiBootbox.alert({
        title: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_title' ),
        message: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_error' )
    });
}

//  when the user clicks on the two below links, the function is executed between
//  the packages configurations and Meteor.startup()

// https://docs.meteor.com/api/passwords.html#Accounts-onEmailVerificationLink

Accounts.onEmailVerificationLink( function( token, done ){
    console.log( 'onEmailVerificationLink' );
    Accounts.verifyEmail( token, ( err ) => {
        if( err ){
            console.error( err );
            _tokenExpired();
        } else {
            pwiBootbox.alert({
                title: pwiI18n.label( pwiAccounts.strings, 'user', 'mail_verified_title' ),
                message: pwiI18n.label( pwiAccounts.strings, 'user', 'mail_verified_text' )
            });
            done();
        }
    });
});

// https://docs.meteor.com/api/passwords.html#Accounts-onResetPasswordLink
//
//  According the documentation, the 'Accounts.onResetPasswordLink()' method is to be called once at top-level code.
//  Then, the registered function is automagically called whenever the user clicks on a reset link (or the URL
//  is of the form 'http://localhost:3000/#/reset-password/wdRauFBqpRU1wgdaUZ8QRyAzzwEKeb51Df7FQxXTGV5' and
//  contains a reset token), WITHOUT needing any router configuration.
//
//  The token validity regarding its expiration is checked by Accounts.resetPassword() so after the user interaction.
//  We prefer here to check that the token still exists before asking the user to enter his new password.
//
//     "services" : {
//     "password" : {
//         "bcrypt" : "$2b$10$l7tmsX0057C/zmhFgYdX4e.l05ajjt40wBGYvOuil44kOYKbg6T72",
//         "reset" : {
//             "token" : "1_RmvqfJejCLEF2_ShnrQ6Np5txkycg9v37EqIldXY1",
//             "email" : "bbbb@bbb.bb",
//             "when" : ISODate("2023-01-26T17:09:47.020Z"),
//             "reason" : "reset"
//         }
//     }
//
//  https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_common.js
//
//  The token expiration delay is configurable as:
//
//      Accounts.config({
//          passwordResetTokenExpiration: 30*1000*60        // 30mn
//      });
//  or
//      Accounts.config({
//          passwordResetTokenExpirationInDays: 1           // 1 day
//      });

Accounts.onResetPasswordLink( function( token, done ){
    //console.log( 'onResetPasswordLink token='+token );
    //console.log( 'Accounts._getPasswordResetTokenLifetimeMs', Accounts._getPasswordResetTokenLifetimeMs());
    Meteor.callPromise( 'pwiAccounts.byResetToken', token )
        .then(( user ) => {
            if( user ){
                Blaze.renderWithData( Template.ac_reset_pwd, { user: user, cb: ( passwd ) => {
                    Accounts.resetPassword( token, 'xxxxxx', ( err ) => {
                        if( err ){
                            console.error( err );
                            _tokenExpired();
                        } else {
                            pwiBootbox.alert({
                                title: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_title' ),
                                message: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_text' )
                            });
                            // a special construction which answers to the special event listener attached to the document
                            // see pwix:accounts/src/client/js/handlers.js
                            document.body.dispatchEvent( new CustomEvent( 'ac-user-resetpwd', { bubbles: true, detail: { email: user.services.password.reset.email }}));
                            done();
                        }
                    });
                }}, $( 'body' )[0] );
            } else {
                _tokenExpired();
            }
        });
});
