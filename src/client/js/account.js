/*
 * pwix:accounts-ui/src/client/js/account.js
 *
 * Manages here the account interactions with the 'users' database (login, creation, logout and so out).
 */

import { pwixI18n } from 'meteor/pwix:i18n';

AccountsUI.Account = {
    /**
     * Change the user's password
     * @param {String} oldpwd the current password
     * @param {String} newpwd the new password to be set
     * @param {Object} target the target of the sent events
     */
    changePwd( oldpwd, newpwd, target ){
        const self = this;
        Accounts.changePassword( oldpwd, newpwd, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.changepwd_error' ));
            } else {
                Tolert.success( pwixI18n.label( I18N, 'user.changepwd_success' ));
                const event = 'ac-user-changedpwd-event';
                const parms = Meteor.user();
                if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
                    console.log( 'pwix:accounts-ui triggering', event, parms );
                }
                AccountsUI.Event.trigger( event, parms );
            }
        });
    },

    /**
     * Create a new user with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * We try to verify emails, so send simultaneouly (in the background) an email to check that.
     * Note that the 'Accounts.createUser()' method doesn't force any security rule on the password.
     * We have to rely on AccountsUI.fn.validatePassword() for that.
     * @param {Object} options as expected by Accounts.createUser
     * @param {Object} target the target of the sent events
     * @param {Boolean} autoClose whether to automatically close the modal on successful creation
     * @param {Boolean} autoConnect whether to automatically login the newly created user
     */
    createUser( options, target, autoClose=true, autoConnect=true ){
        const self = this;
        // the error handler
        const _errorFn = function( err ){
            console.error( err );
            target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.signup_error' ));
        };
        // the success handler
        const _successFn = function(){
            delete options.password;
            const parms = {
                ...Meteor.user(),
                options: { ...options },
                autoClose: autoClose,
                autoConnect: autoConnect
            };
            const event = 'ac-user-created-event';
            if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
                console.log( 'pwix:accounts-ui triggering', event, parms );
            }
            AccountsUI.Event.trigger( event, parms );
            // send a verification mail if asked for
            if( options.email && AccountsUI.opts().sendVerificationEmail()){
                Meteor.call( 'AccountsUI.sendVerificationEmailByEmail', options.email, ( err, res ) => {
                    if( err ){
                        console.error( err );
                    }
                });
            }
        };
        // the main code
        if( autoConnect ){
            Accounts.createUser( options, ( err, res ) => {
                if( err ){
                    _errorFn( err );
                } else {
                    _successFn();
                    Tolert.success( pwixI18n.label( I18N, 'user.signup_autoconnect', options.email ));
                }
            });
        } else {
            Meteor.call( 'AccountsUI.createUser', options, ( err, res ) => {
                if( err ){
                    _errorFn( err );
                } else {
                    _successFn();
                    Tolert.success( pwixI18n.label( I18N, 'user.signup_noconnect', options.email ));
                }
            });
        }
    },

    /**
     * Login with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * @param {String} userid the entered username or mail address
     * @param {String} password the entered password
     * @param {Object} target the target of the sent events
     */
    loginWithPassword( userid, password, target ){
        const self = this;
        Meteor.loginWithPassword( userid, password, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.signin_error' ));
            } else {
                const event = 'ac-user-signedin-event';
                const parms = Meteor.user();
                if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
                    console.log( 'pwix:accounts-ui triggering', event, parms );
                }
                AccountsUI.Event.trigger( event, parms );
            }
        });
    },

    /**
     * Logout
     */
    logout(){
        const user = { ...Meteor.user() };
        Meteor.logout();
        const event = 'ac-user-signedout-event';
        const parms = user;
        if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
            console.log( 'pwix:accounts-ui triggering', event, parms );
        }
        AccountsUI.Event.trigger( event, parms );
    },

    /**
     * Send a mail to let the user reset his/her password
     * @param {String} email the entered mail address
     * @param {Object} target the target of the sent events
     * 
     * Note: if the asked email doesn't exist in the users database, then we receive an error message
     *  [403] Something went wrong. Please check your credentials.
     * This may create a security hole which let a malicious user to validate that such email address is or not registered in our application.
     * So it is a package configuration to send back this error to the user, or to say him that an email has been sent (event if this is not true).
     */
    _resetAskSuccess( email ){
        Tolert.success( pwixI18n.label( I18N, 'user.resetask_success' ));
        const event = 'ac-user-resetasked-event';
        const parms = { email: email };
        if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
            console.log( 'pwix:accounts-ui triggering', event, parms );
        }
        AccountsUI.Event.trigger( event, parms );
    },

    resetAsk( email, target ){
        const self = this;
        Accounts.forgotPassword({ email: email }, ( err ) => {
            if( err ){
                console.error( err );
                switch( AccountsUI.opts().informResetWrongEmail()){
                    case AC_RESET_EMAILSENT:
                        this._resetAskSuccess( email );
                        break;

                    case AC_RESET_EMAILUNSENT:
                        target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.resetask_error' ));
                        break;

                    case AC_RESET_EMAILERROR:
                        target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.resetask_credentials' ));
                }
            } else {
                this._resetAskSuccess( email );
            }
        });
    },

    /**
     * Re-send a mail to let us verify the user's email
     * @param {Object} target the target of the sent events
     */
    verifyMail( target ){
        const self = this;
        Meteor.callPromise( 'AccountsUI.sendVerificationEmail', Meteor.userId())
            .then(( result ) => {
                if( result ){
                    Tolert.success( pwixI18n.label( I18N, 'user.verifyask_success' ));
                    const event = 'ac-user-verifyasked-event';
                    const parms = { ...Meteor.user() };
                    if( AccountsUI.opts().verbosity() & AC_VERBOSE_USER ){
                        console.log( 'pwix:accounts-ui triggering', event, parms );
                    }
                    AccountsUI.Event.trigger( event, parms );
                } else {
                    Tolert.error( pwixI18n.label( I18N, 'user.verifyask_error' ));
                }
            });
    }
};
