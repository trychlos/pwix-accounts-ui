/*
 * /src/client.js/accounts.js
 */
import { Accounts } from 'meteor/accounts-base';

import { pwiBootbox } from 'meteor/pwi:bootbox';
import { pwiI18n } from 'meteor/pwi:i18n';

import '../../common/js/index.js';

import '../components/ac_reset_input/ac_reset_input.js';

//  when the user clicks on the two below links, the function is executed between
//  the packages configurations and Meteor.startup() (and before the object instanciation)

// https://docs.meteor.com/api/passwords.html#Accounts-onEmailVerificationLink

Accounts.onEmailVerificationLink( function( token, done ){
    console.log( 'onEmailVerificationLink' );
    Accounts.verifyEmail( token, ( err ) => {
        if( err ){
            console.error( err );
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
//  have to open a dialog to get the new password
//  it is expected the user is not logged, but who says ? maybe another account has been logged in the mean time
//  so do not change the connection state here
// Note: the expiration of the token is checked by Accounts.resetPassword() so after the user interaction
//  The lifetime must so be enough to let the user enter it..

Accounts.onResetPasswordLink( function( token, done ){
    console.log( 'onResetPasswordLink' );
    Blaze.renderWithData( Template.ac_reset_input, { cb: ( passwd ) => {
        if( passwd && passwd.length ){
            Accounts.resetPassword( token, passwd, ( err ) => {
                if( err ){
                    console.error( err );
                    pwiBootbox.alert({
                        title: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_title' ),
                        message: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_error' )
                    });
                } else {
                    pwiBootbox.alert({
                        title: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_title' ),
                        message: pwiI18n.label( pwiAccounts.strings, 'user', 'reset_text' )
                    });
                    done();
                }
            });
        }
    }}, $( 'body' )[0] );
});
