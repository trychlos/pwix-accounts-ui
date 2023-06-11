/*
 * pwix:accounts/src/common/i18n/en_US.js
 */

pwixAccounts.i18n = {
    ...pwixAccounts.i18n,
    ...{
        en_US: {
            buttons: {
                reset_link: '[ Lost password ? ]',
                signin_link: '[ Sign in with my account ]',
                signup_link: '[ Sign up for a new account ]',
                cancel_label: 'Cancel',
                send_label: 'Send',
                signin_label: 'Sign in',
                signout_label: 'Sign out',
                signup_label: 'Sign up',
                ok_label: 'OK'
            },
            change_pwd: {
                modal_title: 'Change my password',
                old_label: 'Your current password',
                new_label: 'Your new password',
                newone_placeholder: 'Enter a new password',
                newtwo_placeholder: 'Re-enter your new password',
            },
            dropdown_btn: {
                unlogged: 'Account'
            },
            features: {
                signout: 'Sign out',
                changepwd: 'Change my password',
                verifyask: 'Verify my mail',
                signin: 'Sign in with my account',
                signup: 'Sign up for a new account',
                resetask: 'Reset my password'
            },
            input_email: {
                label: 'Mail address:',
                placeholder: 'Enter your email address, e.g. name@example.com',
                already_exists: 'Email address already known',
                invalid: 'Invalid email address'
            },
            input_password: {
                label: 'Password:',
                placeholder: 'Enter your password',
                strength: 'Strength',
                too_short: 'Too short password',
                too_weak: 'Too weak password'
            },
            input_userid: {
                label: 'Identifier:',
                placeholder: 'Enter your username or your email address'
            },
            input_username: {
                label: 'Username:',
                placeholder: 'Enter your username',
                too_short: 'Too short username',
                already_exists: 'Username already in use'
            },
            logged: {
                signout: 'Sign out',
                changepwd: 'Change my password',
                verifyask: 'Verify my mail'
            },
            reset_ask: {
                modal_title: 'Lost password ?',
                textOne: 'By clicking on the below "Send" button, we will send a mail to the specified mail address.'
                    +' This mail will include a link which will let you freely change your password.'
                    +' Please be conscious that the provided link will have a limited life.<br />'
                    +' Do not run the process if you do not have an access to your mailbox.<br /><p>&nbsp;</p>'
            },
            reset_pwd: {
                modal_title: 'Reset your password',
                textOne: 'Hello <b>%s</b>,<br />'
                    +'Welcome again!<br />'
                    +'Let us reset your password, and enjoy.'
            },
            select: {
                close_btn: 'Cancel',
                save_btn: 'Save',
                title: 'Users selection'
            },
            signin: {
                modal_title: 'Sign in with my account'
            },
            signout: {
                modal_title: 'Sign out',
                textOne: 'You are about to log out from the site.<br />Are you sure ?',
            },
            signup: {
                modal_title: 'Sign up for a new account'
            },
            twice_passwords: {
                label: 'Password:',
                placeholder1: 'Enter a password',
                placeholder2: 'Re-enter the password',
                password_different: 'Passwords are different'
            },
            unlogged: {
                unlogged: 'Account',
                signin: 'Sign in',
                signup: 'Sign up',
                resetask: 'Reset my password'
            },
            user: {
                changepwd_error: 'Unable to change the password.',
                changepwd_success: 'Password successfully changed',
                resetask_credentials: 'Unable to send a reset link, please check your credentials',
                resetask_error: 'Unable to send a reset link to the specified address',
                resetask_success: 'Reset mail successfully sent',
                resetpwd_title: 'Password reset',
                resetpwd_text: 'Hi.<br />Your password has been successfully reset.<br />You are now automatically logged-in.',
                resetpwd_error: 'Humm... Sorry, but your token has expired. I\'am unfortunately unable to reset your password.<br />You have to re-ask for a new reset link.',
                signin_error: 'Invalid mail address and/or password. Please check your credentials. In case of doubt, please contact our administrator.',
                signup_error: 'Unable to create this new account',
                signup_success: 'New account %s successfully created',
                signup_autoconnect: 'New account has been automatically connected',
                signup_noconnect: 'Account is not connected',
                verify_error: 'Humm... Sorry, but it seems your token has expired.<br />You have to re-ask for a new verification link.',
                verify_text: 'Hi.<br />Your email address is now said verified.',
                verify_title: 'Email address verification',
                verifyask_error: 'Sorry, it happens that I am unable to send a verification mail. Be kind enough to try later.',
                verifyask_success: 'Mail successfully sent',
                mandatory_fields: 'Mandatory fields'
            },
            verify_ask: {
                modal_title: 'Re-send verification mail',
                textOne: 'While your mail address has not been verified, you are not able to participate to discussions forums.<br />'
                    +'By clicking on the below "Send" button, we will send a mail to your declared mail address.<br />'
                    +'This mail will include a link which you have to click on so that your email becomes "verified".'
            }
        }
    }
};

pwixAccounts.i18n.en = pwixAccounts.i18n.en_US;
