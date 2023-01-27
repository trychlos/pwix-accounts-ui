/*
 * /src/client.js/accounts.js
 */
import { Accounts } from 'meteor/accounts-base';

import { pwiBootbox } from 'meteor/pwi:bootbox';
import { pwiI18n } from 'meteor/pwi:i18n';

import '../../common/js/index.js';

import '../components/ac_reset_pwd/ac_reset_pwd.js';

//  when the user clicks on the two below links, the function is executed between
//  the packages configurations and Meteor.startup()

// https://docs.meteor.com/api/passwords.html#Accounts-onEmailVerificationLink
//
//      "services" : {
//          "email" : {
//              "verificationTokens" : [
//                  {
//                      "token" : "znEz5ibBf1uLLvOSpMjjm92Sah7j8iXPWemFdllaexU",
//                      "address" : "xxxx@xxx.xx",
//                      "when" : ISODate("2022-10-23T15:14:42.242Z")
//                  }, {
//                      "token" : "276Oy_MRKwTI0e8cQTIYPZ7wepEX1dD460qsLz9TWaX",
//                      "address" : "xxxx@xxx.xx",
//                      "when" : ISODate("2022-10-23T15:14:45.953Z")
//                  }
//              ]
//          }
//      }
//
// URL is of the form 'http://localhost:3000/#/verify-email/8R7RpL6ysRSAIO6Us6kA4uTITzb3xl1wzbNqyDIlAph'

_verifyExpired = function(){
    pwiBootbox.alert({
        title: pwiI18n.label( pwiAccounts.strings, 'user', 'verify_title' ),
        message: pwiI18n.label( pwiAccounts.strings, 'user', 'verify_error' )
    });
}

Accounts.onEmailVerificationLink( function( token, done ){
    //console.log( 'onEmailVerificationLink' );
    Meteor.callPromise( 'pwiAccounts.byEmailVerificationToken', token )
        .then(( user ) => {
            if( user ){
                let email = null;
                user.services.email.verificationTokens.every(( it ) => {
                    if( it.token === token ){
                        email = it.address;
                        return false;
                    }
                    return true;
                });
                Accounts.verifyEmail( token, ( err ) => {
                    if( err ){
                        console.error( err );
                        _verifyExpired();
                    } else {
                        pwiBootbox.alert({
                            title: pwiI18n.label( pwiAccounts.strings, 'user', 'verify_title' ),
                            message: pwiI18n.label( pwiAccounts.strings, 'user', 'verify_text' )
                        });
                        // a special construction which answers to the special event listener attached to the document
                        // see pwix:accounts/src/client/js/handlers.js
                        document.body.dispatchEvent( new CustomEvent( 'ac-user-verifymail', { bubbles: true, detail: { email: email }}));
                        done();
                    }
                });
            } else {
                _verifyExpired();
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
//         "password" : {
//             "reset" : {
//                 "token" : "1_RmvqfJejCLEF2_ShnrQ6Np5txkycg9v37EqIldXY1",
//                 "email" : "bbbb@bbb.bb",
//                 "when" : ISODate("2023-01-26T17:09:47.020Z"),
//                 "reason" : "reset"
//             }
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
//
// Note: it happens that resetting the password of the user A automatically logs-in this user A,
//  even if a user B was previsouly connected :()
//  As this function is called just before Meteor.startup() is run, the connextion of user B seems
//  to be temporarily suspended. If user A completes the form, then it automatically logs in.
//  Else, user B is re-connected.

_resetExpired = function(){
    pwiBootbox.alert({
        title: pwiI18n.label( pwiAccounts.strings, 'user', 'resetpwd_title' ),
        message: pwiI18n.label( pwiAccounts.strings, 'user', 'resetpwd_error' )
    });
}

Accounts.onResetPasswordLink( function( token, done ){
    //console.log( 'onResetPasswordLink token='+token );
    //console.log( 'Accounts._getPasswordResetTokenLifetimeMs', Accounts._getPasswordResetTokenLifetimeMs());
    //console.log( 'onResetPasswordLink', Meteor.user());
    Meteor.callPromise( 'pwiAccounts.byResetToken', token )
        .then(( user ) => {
            if( user ){
                Blaze.renderWithData( Template.ac_reset_pwd, { user: user, cb: ( passwd ) => {
                    Accounts.resetPassword( token, 'xxxxxx', ( err ) => {
                        if( err ){
                            console.error( err );
                            _resetExpired();
                        } else {
                            pwiBootbox.alert({
                                title: pwiI18n.label( pwiAccounts.strings, 'user', 'resetpwd_title' ),
                                message: pwiI18n.label( pwiAccounts.strings, 'user', 'resetpwd_text' )
                            });
                            // a special construction which answers to the special event listener attached to the document
                            // see pwix:accounts/src/client/js/handlers.js
                            document.body.dispatchEvent( new CustomEvent( 'ac-user-resetpwd', { bubbles: true, detail: { email: user.services.password.reset.email }}));
                            done();
                        }
                    });
                }}, $( 'body' )[0] );
            } else {
                _resetExpired();
            }
        });
});
