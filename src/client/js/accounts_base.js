/*
 * /src/client.js/accounts_base
.js
 */
import { Accounts } from 'meteor/accounts-base';

import { Bootbox } from 'meteor/pwix:bootbox';
import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../../common/js/index.js';

import '../components/ac_footer/ac_footer.js';
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
    Bootbox.alert({
        title: i18n.label( I18N, 'user.verify_title' ),
        message: i18n.label( I18N, 'user.verify_error' )
    });
}

Accounts.onEmailVerificationLink( function( token, done ){
    //console.log( 'onEmailVerificationLink' );
    //console.log( 'document.URL', document.URL );
    Meteor.callPromise( 'AccountsUI.byEmailVerificationToken', token )
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
                        if( AccountsUI.opts().onVerifiedEmailBox()){
                            console.debug( 'before bootbox alert' );
                            Bootbox.alert({
                                title: AccountsUI.opts().onVerifiedEmailTitle(),
                                message: AccountsUI.opts().onVerifiedEmailMessage(),
                                cb: AccountsUI.opts().onVerifiedEmailCb()
                            });
                            console.debug( 'after bootbox alert' );
                        }
                        const event = 'ac-user-verifieddone-event';
                        const parms = { email: email };
                        if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
                            console.log( 'pwix:accounts-ui triggering', event, parms );
                        }
                        AccountsUI.EventManager.trigger( event, parms );
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
    Bootbox.alert({
        title: i18n.label( I18N, 'user.resetpwd_title' ),
        message: i18n.label( I18N, 'user.resetpwd_error' )
    });
}

Accounts.onResetPasswordLink( function( token, done ){
    //console.log( 'onResetPasswordLink token='+token );
    //console.log( 'Accounts._getPasswordResetTokenLifetimeMs', Accounts._getPasswordResetTokenLifetimeMs());
    //console.log( 'onResetPasswordLink', Meteor.user());
    Meteor.callPromise( 'AccountsUI.byResetToken', token )
        .then(( user ) => {
            if( user ){
                AccountsUI.DisplayManager.ask( AC_PANEL_RESETPWD, null, {
                    user: user,
                    submitCallback: () => {
                        const passwd = $( '.ac-reset-pwd .ac-newone .ac-input-password input' ).val().trim();
                        Accounts.resetPassword( token, passwd, ( err ) => {
                            if( err ){
                                console.error( err );
                                _resetExpired();
                            } else {
                                Bootbox.alert({
                                    title: i18n.label( I18N, 'user.resetpwd_title' ),
                                    message: i18n.label( I18N, 'user.resetpwd_text' )
                                });
                                const event = 'ac-user-resetdone-event';
                                const parms = { email: user.services.password.reset.email };
                                if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
                                    console.log( 'pwix:accounts-ui triggering', event, parms );
                                }
                                AccountsUI.EventManager.trigger( event, parms );
                                done();
                            }
                        });
                    }
                });
            } else {
                _resetExpired();
            }
        });
});
