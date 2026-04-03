/*
 * /src/client.js/accounts-links.js
 */

import { Accounts } from 'meteor/accounts-base';
import { Bootbox } from 'meteor/pwix:bootbox';
import { Logger } from 'meteor/pwix:logger';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';

import '../../common/js/index.js';

import '../components/ac_footer/ac_footer.js';
import '../components/ac_reset_pwd/ac_reset_pwd.js';

const logger = Logger.get();

// https://docs.meteor.com/api/accounts.html#Accounts-onEnrollmentLink

_handleEnrollmentToken = function( token, done = () => {} ){
    logger.debug( 'in _handleEnrollmentToken()', token );
    done();
};

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

_handleResetPasswordToken = function( token, done = () => {} ){
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
    Meteor.callAsync( 'pwix.AccountsUI.m.byResetToken', parms.acName, token )
        .then(( user ) => {
            if( user ){
                Modal.run({
                    mdBody: 'ac_reset_pwd',
                    mdButtons: [ Modal.C.Button.CANCEL, { id: Modal.C.Button.OK, dismiss: true }],
                    mdTitle: pwixI18n.label( I18N, 'reset_pwd.modal_title' ),
                    user: user,
                    acName: parms.acName,
                    cb: () => {
                        const passwd = $( '.ac-reset-pwd .ac-newone .ac-input-password input' ).val().trim();
                        Accounts.resetPassword( token, passwd, ( err ) => {
                            if( err ){
                                logger.error( err );
                                _resetExpired();
                            } else {
                                Bootbox.alert({
                                    title: pwixI18n.label( I18N, 'user.resetpwd_title' ),
                                    message: pwixI18n.label( I18N, 'user.resetpwd_text' )
                                });
                                const event = 'ac-user-resetdone-event';
                                const parms = { email: user.services.password.reset.email };
                                logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.USER }, 'onResetPasswordLink() triggering', event, parms );
                                $( 'body' ).trigger( event, parms );
                            }
                        });
                    }
                });
            } else {
                _resetExpired();
            }
            done();
        });
};

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
};

_handleVerifyEmailToken = function( token, done = () => {} ){
    Meteor.callAsync( 'pwix.AccountsUI.m.byEmailVerificationToken', token )
        .then(( userDoc ) => {
            logger.debug( 'got userDoc', userDoc );
            if( userDoc ){
                let email = null;
                userDoc.services.email.verificationTokens.every(( it ) => {
                    if( it.token === token ){
                        email = it.address;
                    }
                    return email === null;
                });
                Accounts.verifyEmail( token, ( err ) => {
                    if( err ){
                        logger.error( err );
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
                        logger.verbose({ verbosity: AccountsUI.opts().verbosity(), against: AccountsUI.C.Verbose.USER }, 'onEmailVerificationLink() triggering', event, parms );
                        $( 'body' ).trigger( event, parms );
                    }
                });
            } else {
                _verifyExpired();
            }
            done();
        });
};

// install an event handler to intercept hash changes
// Rationale: copy/pasting an email verification link (for example) doesn't trigger the Meteor callback as it should without refreshing (F5) the page
// Accrding to ChatGPT, seems that Meteor only handles these on SPA application startup
// So this handler
// It supposes that standard URLs have not been changed server-side (https://docs.meteor.com/api/accounts.html#email-link-callbacks-and-url-customization)

const _urls = {
    'enroll-account': _handleEnrollmentToken,
    'reset-password': _handleResetPasswordToken,
    'verify-email': _handleVerifyEmailToken
};

const _matchReservedHash = function(){
    const hash = window.location.hash || '';
    for( const it of Object.keys( _urls )){
        const regex = new RegExp( '^#\/'+it+'\/([^?]+)' );
        const m = hash.match( regex );
        if( m ){
            return { kind: it, token: m[1] };
        }
    }
    return null;
};

const _consumeReservedHash = function(){
    const matched = _matchReservedHash();
    if( !matched ){
        return;
    }
    logger.debug( 'matched', matched );
    if( matched.kind === 'enroll-account' ){
        _handleEnrollmentToken( matched.token );
    }
    if( matched.kind === 'reset-password' ){
        _handleResetPasswordToken( matched.token );
    }
    if( matched.kind === 'verify-email' ){
        _handleVerifyEmailToken( matched.token );
    }
    // optional: clear the hash yourself after consuming it
    if( window.location.hash ){
        history.replaceState( null, document.title, window.location.pathname + window.location.search );
    }
};

// handle initial load after your package is loaded
Meteor.startup(() => {
    _consumeReservedHash();
});

// handle paste/navigation into an already-running SPA
window.addEventListener( 'hashchange', () => {
    _consumeReservedHash();
});
