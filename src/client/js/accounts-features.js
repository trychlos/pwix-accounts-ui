/*
 * pwix:accounts-ui/src/client/js/accounts-base.js
 *
 * Manages here the account interactions with the 'users' database (login, creation, logout and so out).
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { pwixI18n } from 'meteor/pwix:i18n';

AccountsUI.Features = {
    /**
     * Change the user's password
     * @param {String} oldpwd the current password
     * @param {String} newpwd the new password to be set
     * @param {Object} opts, object options with following keys:
     *  - AC: the private acUserLogin AC data
     */
    changePwd( oldpwd, newpwd, opts={} ){
        const target = opts.AC.target || $( 'body' );
        const ahName = opts.AC.options.ahName();
        if( ahName === AccountsHub.ahOptions._defaults.name ){
            Accounts.changePassword( oldpwd, newpwd, ( err ) => {
                if( err ){
                    console.error( err );
                    target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.changepwd_error' ));
                } else {
                    Tolert.success( pwixI18n.label( I18N, 'user.changepwd_success' ));
                    const event = 'ac-user-changedpwd-event';
                    const parms = Meteor.user();
                    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                        console.log( 'pwix:accounts-ui triggering', event, parms );
                    }
                    target.trigger( event, parms );
                }
            });
        } else {
            const ahInstance = AccountsHub.instances[ahName];
            assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
            console.warn( 'onChangePwd() ignored', ahInstance );
        }
    },

    /**
     * Create a new user with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * We try to verify emails, so send simultaneouly (in the background) an email to check that.
     * Note that the 'Accounts.createUser()' method doesn't force any security rule on the password.
     * We have to rely on AccountsUI.fn.validatePassword() for that.
     * @param {Object}  object options as expected by Accounts.createUser(), i.e.
     *  - username
     *  - email
     *  - password
     *  - profile
     *  Also cf. https://docs.meteor.com/api/passwords#Accounts-createUser
     *       and https://v3-docs.meteor.com/api/accounts.html#Accounts-createUser
     * @param {Object} opts, object options with following keys:
     *  - AC: the private acUserLogin AC data, may not be set when called from outside (say. AccountsManager ?)
     *  - errFn: an optional function to be called in case of an error
     *  - successFn: an optional function to be called in case of a success
     *  - name: the name given to the acUserLogin instance
     *      when set, this let the package get target and options from this same instance
     *
     * Note that Accounts.createUser() auto-connnects the newly created user account when called from the client side.
     * So, if we do not want this autoconnection, we have to call the server-side method.
     */
    async createUser( createUserOptions, opts={} ){
        // compute parameters when the 'name' option is passed-in
        let target = opts.AC?.target;
        let options = opts.AC?.options;
        if( opts.name ){
            const instance = AccountsUI.fn.nameGet( opts.name );
            if( instance ){
                target = target || instance.AC.target;
                options = options || instance.AC.options;
            }
        }
        target = target || $( 'body' );
        const ahName = options.ahName();
        // the error handler
        const _errorFn = function( err ){
            console.error( err );
            target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.signup_error', err.reason || '' ));
            // call error function if any
            if( opts.errFn ){
                opts.errFn();
            }
        };
        // the success handler
        const _successFn = function(){
            delete createUserOptions.password;
            const parms = {
                ...Meteor.user(),
                createUserOptions: { ...createUserOptions },
                opts: { ...opts }
            };
            const event = 'ac-user-created-event';
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                console.log( 'pwix:accounts-ui triggering', event, parms );
            }
            target.trigger( event, parms );
            // send a verification mail if asked for
            let promises = [];
            if( createUserOptions.email && AccountsHub.instances.users.opts().sendVerificationEmail()){
                promises.push( Meteor.callAsync( 'AccountsUI.sendVerificationEmailByEmail', createUserOptions.email ));
            }
            Promise.allSettled( promises )
                .then(( res ) => {
                    //console.debug( 'AccountsUI.sendVerificationEmailByEmail', res );
                    // autoClose is only relevant in MODAL render mode
                    const autoClose = options.signupAutoClose();
                    const renderMode = options.renderMode();
                    if( renderMode === AccountsUI.C.Render.MODAL && autoClose ){
                        target.trigger( 'ac-close' );
                    } else {
                        // clearPanel is only relevant if we do not have closed
                        const clearPanel = options.signupClearPanel();
                        if( clearPanel ){
                            $( '.ac-signup' ).trigger( 'ac-clear-panel' );
                        }
                    }
                    // call success function if any
                    if( opts.successFn ){
                        opts.successFn();
                    }
                })
                .catch(( err ) => {
                    console.error( err );
                });
        };
        // the main code
        if( ahName === AccountsHub.ahOptions._defaults.name ){
            //  https://docs.meteor.com/api/passwords#Accounts-createUser
            const autoConnect = options.signupAutoConnect();
            if( autoConnect !== false ){
                Accounts.createUser( createUserOptions, ( err ) => {
                    if( err ){
                        _errorFn( err );
                    } else {
                        _successFn();
                        Tolert.success( pwixI18n.label( I18N, 'user.signup_autoconnect', createUserOptions.email ));
                    }
                });
            } else {
                Meteor.callAsync( 'AccountsUI.createUser', createUserOptions )
                    .then(() => {
                        _successFn();
                        Tolert.success( pwixI18n.label( I18N, 'user.signup_noconnect', createUserOptions.email ));
                    })
                    .catch(( err ) => {
                        // doesn't handle here credentials issues as the user is not connected anyway
                        if( err.error !== 403 ){
                            _errorFn( err );
                        }
                    });
            }
        } else {
            const ahInstance = AccountsHub.instances[ahName];
            assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
            console.warn( 'onSignup() ignored', ahInstance );
        }
    },

    /**
     * Login with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * @param {String} userid the entered username or mail address
     * @param {String} password the entered password
     * @param {Object} opts, object options with following keys:
     *  - AC: the private acUserLogin AC data
     * 
     * As of v2.0.0, only manages the Meteor standard 'users' accounts collection.
     */
    loginWithPassword( userid, password, opts={} ){
        const target = opts.AC.target || $( 'body' );
        const ahName = opts.AC.options.ahName();
        if( ahName === AccountsHub.ahOptions._defaults.name ){
            Meteor.loginWithPassword( userid, password, ( err ) => {
                if( err ){
                    //console.error( err );
                    target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.signin_error' ));
                } else {
                    const event = 'ac-user-signedin-event';
                    const parms = Meteor.user();
                    if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                        console.log( 'pwix:accounts-ui triggering', event, parms );
                    }
                    target.trigger( event, parms );
                    // last close the modal
                    target.trigger( 'ac-close' );
                }
            });
        } else {
            const ahInstance = AccountsHub.instances[ahName];
            assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
            console.warn( 'onSignin() ignored', ahInstance );
        }
    },

    /**
     * Logout
     * @param {Object} opts, object options with following keys:
     *  - AC: the private acUserLogin AC data
     */
    logout( opts={} ){
        const target = opts.AC.target || $( 'body' );
        const ahName = opts.AC.options.ahName();
        if( ahName === AccountsHub.ahOptions._defaults.name ){
            const user = { ...Meteor.user() };
            Meteor.logout();
            const event = 'ac-user-signedout-event';
            const parms = user;
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                console.log( 'pwix:accounts-ui triggering', event, parms );
            }
            target.trigger( event, parms );
            // last close the modal
            target.trigger( 'ac-close' );
        } else {
            const ahInstance = AccountsHub.instances[ahName];
            assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
            console.warn( 'onSignout() ignored', ahInstance );
        }
    },

    /**
     * Send a mail to let the user reset his/her password
     * @param {String} email the entered mail address
     * @param {Object} opts, object options with following keys:
     *  - AC: the private acUserLogin AC data
     *
     * Note: if the asked email address doesn't exist in the users database, then we receive an error message
     *  [403] Something went wrong. Please check your credentials.
     * This may create a security hole which let a malicious user to validate that such email address is or not registered in our application.
     * So it is a package configuration to send back this error to the user, or to say him that an email has been sent (event if this is not true).
     */
    async resetAsk( email, opts={} ){
        const target = opts.AC.target || $( 'body' );
        const ahName = opts.AC.options.ahName();
        const ahInstance = AccountsHub.instances[ahName];
        assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
        // the success handler
        const _resetAskSuccess = function(){
            Tolert.success( pwixI18n.label( I18N, 'user.resetask_success' ));
            const event = 'ac-user-resetasked-event';
            const parms = { email: email };
            if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                console.log( 'pwix:accounts-ui triggering', event, parms );
            }
            target.trigger( event, parms );
            // last close the modal
            target.trigger( 'ac-close' );
        };
        // the main code
        if( ahName === AccountsHub.ahOptions._defaults.name ){
            const res = await Meteor.callAsync( 'AccountsUI.forgotPassword', ahName, email );
            if( res ){
                _resetAskSuccess( email, opts );
            } else {
                switch( ahInstance.opts().informWrongEmail()){
                    case AccountsHub.C.WrongEmail.OK:
                        _resetAskSuccess( email, opts );
                        break;
                    case AccountsHub.C.WrongEmail.ERROR:
                        target.trigger( 'ac-display-error', pwixI18n.label( I18N, 'user.resetask_credentials' ));
                }
            }
        } else {
            console.warn( 'onResetAsk() ignored', ahInstance );
        }
    },

    /**
     * Re-send a mail to let us verify the user's email
     * @param {Object} opts, object options with following keys:
     *  - AC: the private acUserLogin AC data
     */
    verifyMail( opts={} ){
        const target = opts.AC.target || $( 'body' );
        const ahName = opts.AC.options.ahName();
        if( ahName === AccountsHub.ahOptions._defaults.name ){
            Meteor.callAsync( 'AccountsUI.sendVerificationEmailById', Meteor.userId())
                .then(( result ) => {
                    if( result ){
                        Tolert.success( pwixI18n.label( I18N, 'user.verifyask_success' ));
                        const event = 'ac-user-verifyasked-event';
                        const parms = { ...Meteor.user() };
                        if( AccountsUI.opts().verbosity() & AccountsUI.C.Verbose.USER ){
                            console.log( 'pwix:accounts-ui triggering', event, parms );
                        }
                        target.trigger( event, parms );
                        // last close the modal
                        target.trigger( 'ac-close' );
                    } else {
                        Tolert.error( pwixI18n.label( I18N, 'user.verifyask_error' ));
                    }
                });
        } else {
            const ahInstance = AccountsHub.instances[ahName];
            assert( ahInstance && ahInstance instanceof AccountsHub.ahClass, 'expects an instance of AccountsHub.ahClass, got '+ahInstance );
            console.warn( 'onVerifyAsk() ignored', ahInstance );
        }
    }
};
