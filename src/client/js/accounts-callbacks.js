/*
 * /src/client.js/accounts-callbacks.js
 */

import { Accounts } from 'meteor/accounts-base';
import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { Bootbox } from 'meteor/pwix:bootbox';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';

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
        title: pwixI18n.label( I18N, 'user.verify_title' ),
        message: pwixI18n.label( I18N, 'user.verify_error' )
    });
}

Accounts.onEmailVerificationLink( function( token, done ){
    //console.log( 'onEmailVerificationLink' );
    //console.log( 'document.URL', document.URL );
    Meteor.callAsync( 'AccountsUI.byEmailVerificationToken', token )
        .then(( user ) => {
            if( user ){
                let email = null;
                user.services.email.verificationTokens.every(( it ) => {
                    if( it.token === token ){
                        email = it.address;
                    }
                    return email === null;
                });
                Accounts.verifyEmail( token, ( err ) => {
                    if( err ){
                        console.error( err );
                        _verifyExpired();
                    } else {
                        const fn = AccountsUI.opts().onEmailVerifiedBeforeFn();
                        if( fn ){
                            fn();
                        }
                        if( AccountsUI.opts().onEmailVerifiedBox()){
                            Bootbox.alert({
                                title: AccountsUI.opts().onEmailVerifiedBoxTitle(),
                                message: AccountsUI.opts().onEmailVerifiedBoxMessage(),
                                cb: AccountsUI.opts().onEmailVerifiedBoxCb()
                            });
                        }
                        const event = 'ac-user-verifieddone-event';
                        const parms = { email: email };
                        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                            console.log( 'pwix:accounts-ui triggering', event, parms );
                        }
                        $( 'body' ).trigger( event, parms );
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
// Note 1: it happens that resetting the password of the user A automatically logs-in this user A,
//  even if a user B was previsouly connected :()
//  As this function is called just before Meteor.startup() is run, the connextion of user B seems
//  to be temporarily suspended. If user A completes the form, then it automatically logs in.
//  Else, user B is re-connected.
//
// Note 2: activating the ResetPassword link automatically set the email address as 'verified'.
//
// https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
//
// https://github.com/meteor/meteor/blob/devel/packages/accounts-password/password_client.js#L234
// Accounts.resetPassword(): checks its arguments and immediately and only call Accounts.callLoginMethod() with 'resetPassword' method name
//
// When the password is expired
// {
//     "isClientSafe": true,
//     "error": 403,
//     "reason": "Token expired",
//     "message": "Token expired [403]",
//     "errorType": "Meteor.Error"
// }
//
// When the password has been sucessfully changed, but the user is not allowed to login
// {
//     "isClientSafe": true,
//     "error": 403,
//     "reason": "Login forbidden",
//     "message": "Login forbidden [403]",
//     "errorType": "Meteor.Error"
// }


Accounts.onResetPasswordLink( function( token, done ){
    const json = '{"' + location.search.substring( 1 ).replace( /&/g, '","' ).replace( /=/g, '":"' ) + '"}';
    const parms = JSON.parse( json, function( key, value ){ return key === '' ? value : decodeURIComponent( value ); });
    // error handling
    const _resetExpired = function(){
        Bootbox.alert({
            title: pwixI18n.label( I18N, 'user.resetpwd_title' ),
            message: pwixI18n.label( I18N, 'user.resetpwd_error' )
        });
    };
    // main code    
    Meteor.callAsync( 'AccountsUI.byResetToken', parms.ahName, token )
        .then(( user ) => {
            if( user ){
                Modal.run({
                    mdBody: 'ac_reset_pwd',
                    mdButtons: [ Modal.C.Button.CANCEL, { id: Modal.C.Button.OK, dismiss: true }],
                    mdTitle: pwixI18n.label( I18N, 'reset_pwd.modal_title' ),
                    user: user,
                    ahName: parms.ahName,
                    cb: () => {
                        const passwd = $( '.ac-reset-pwd .ac-newone .ac-input-password input' ).val().trim();
                        Accounts.resetPassword( token, passwd, ( err ) => {
                            if( err ){
                                console.error( err );
                                _resetExpired();
                            } else {
                                Bootbox.alert({
                                    title: pwixI18n.label( I18N, 'user.resetpwd_title' ),
                                    message: pwixI18n.label( I18N, 'user.resetpwd_text' )
                                });
                                const event = 'ac-user-resetdone-event';
                                const parms = { email: user.services.password.reset.email };
                                if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                                    console.log( 'pwix:accounts-ui triggering', event, parms );
                                }
                                $( 'body' ).trigger( event, parms );
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
