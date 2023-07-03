/*
 * /src/client/classes/ac_user.class.js
 *
 * This class manages the interface with the currently logged-in user.
 * A singleton is attached to the global 'pwixAccounts' object.
 */
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';

import { pwixI18n as i18n } from 'meteor/pwix:i18n';
import { Tolert } from 'meteor/pwix:tolert';

export class acUser {

    // static data
    //

    static Singleton = null;

    // static methods
    //

    // private data
    //

    // maintains a LOGGED/UNLOGGED status
    //  is expected to be exactly consistant with Meteor.user() but adds a (very) thin conceptualization level
    _state = {
        dep: null,
        value: null
    }

    // private methods
    //

    /*
     * Setter only
     * @param {String} state the new logged-in status
     * @returns {String} the logged-in status as AC_LOGGED or AC_UNLOGGED
     * A reactive data source
     */
    _stateSet( state ){
        if( !this._state.dep ){
            this._state.dep = new Tracker.Dependency();
        }
        if( state && ( state === AC_LOGGED || state === AC_UNLOGGED ) && state !== this._state.value ){
            this._state.value = state;
            this._state.dep.changed();
        }
        return this._state.value;
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @returns {acUser}
     */
    constructor(){
        if( acUser.Singleton ){
            console.log( 'pwix:accounts-ui returning already instanciated acUser' );
            return acUser.Singleton;
        }

        // this is never displayed as object is instanciated before call to configure()
        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_INSTANCIATIONS ){
            console.log( 'pwix:accounts-ui instanciating acUser' );
        }

        Tracker.autorun(() => {
            this._stateSet( Meteor.userId() ? AC_LOGGED : AC_UNLOGGED );
        });

        acUser.Singleton = this;
        return this;
    }

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
                target.trigger( 'ac-display-error', i18n.label( I18N, 'user.changepwd_error' ));
            } else {
                Tolert.success( i18n.label( I18N, 'user.changepwd_success' ));
                const event = 'ac-user-changedpwd-event';
                const parms = Meteor.user()
                if( pwixAccounts.opts().verbosity() & AC_VERBOSE_USER ){
                    console.log( 'pwix:accounts-ui triggering', event, parms );
                }
                pwixAccounts.EventManager.trigger( event, parms );
            }
        });
    }

    /**
     * Create a new user with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * We try to verify emails, so send simultaneouly (in the background) an email to check that.
     * Note that the 'Accounts.createUser()' method doesn't force any security rule on the password.
     * We have to rely on pwixAccounts.fn.validatePassword() for that.
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
            target.trigger( 'ac-display-error', i18n.label( I18N, 'user.signup_error' ));
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
            if( pwixAccounts.opts().verbosity() & AC_VERBOSE_USER ){
                console.log( 'pwix:accounts-ui triggering', event, parms );
            }
            pwixAccounts.EventManager.trigger( event, parms );
            // send a verification mail if asked for
            if( options.email && pwixAccounts.opts().sendVerificationEmail()){
                Meteor.call( 'pwixAccounts.sendVerificationEmailByEmail', options.email, ( err, res ) => {
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
                    Tolert.success( i18n.label( I18N, 'user.signup_autoconnect' ));
                }
            });
        } else {
            Meteor.call( 'pwixAccounts.createUser', options, ( err, res ) => {
                if( err ){
                    _errorFn( err );
                } else {
                    _successFn();
                    Tolert.success( i18n.label( I18N, 'user.signup_noconnect' ));
                }
            });
        }
    }

    /**
     * @returns {String} the (first) mail address of the currently logged-in user
     */
    emailAddress(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        const email = user ? user.emails[0].address : '';
        return email;
    }

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
                target.trigger( 'ac-display-error', i18n.label( I18N, 'user.signin_error' ));
            } else {
                const event = 'ac-user-signedin-event';
                const parms = Meteor.user();
                if( pwixAccounts.opts().verbosity() & AC_VERBOSE_USER ){
                    console.log( 'pwix:accounts-ui triggering', event, parms );
                }
                pwixAccounts.EventManager.trigger( event, parms );
            }
        });
    }

    /**
     * Logout
     */
    logout(){
        const user = { ...Meteor.user() };
        Meteor.logout();
        const event = 'ac-user-signedout-event';
        const parms = user;
        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_USER ){
            console.log( 'pwix:accounts-ui triggering', event, parms );
        }
        pwixAccounts.EventManager.trigger( event, parms );
    }

    /**
     * @returns {Boolean} whether the (first) mail address is verified
     */
    mailVerified(){
        return Meteor.user() ? Meteor.user().emails[0].verified : false;
    }

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
        Tolert.success( i18n.label( I18N, 'user.resetask_success' ));
        const event = 'ac-user-resetasked-event';
        const parms = { email: email };
        if( pwixAccounts.opts().verbosity() & AC_VERBOSE_USER ){
            console.log( 'pwix:accounts-ui triggering', event, parms );
        }
        pwixAccounts.EventManager.trigger( event, parms );
    }

    resetAsk( email, target ){
        const self = this;
        Accounts.forgotPassword({ email: email }, ( err ) => {
            if( err ){
                console.error( err );
                switch( pwixAccounts.opts().informResetWrongEmail()){
                    case AC_RESET_EMAILSENT:
                        this._resetAskSuccess( email );
                        break;

                    case AC_RESET_EMAILUNSENT:
                        target.trigger( 'ac-display-error', i18n.label( I18N, 'user.resetask_error' ));
                        break;

                    case AC_RESET_EMAILERROR:
                        target.trigger( 'ac-display-error', i18n.label( I18N, 'user.resetask_credentials' ));
                }
            } else {
                this._resetAskSuccess( email );
            }
        });
    }

    /**
     * Getter only
     * @param {String} state the new logged-in status
     * @returns {String} the logged-in status as AC_LOGGED or AC_UNLOGGED
     * A reactive data source
     */
    state(){
        this._state.dep.depend();
        return this._state.value;
    }

    /**
     * @returns {String} the username of the currently logged-in user
     */
    username(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        return user ? user.username : '';
    }

    /**
     * Re-send a mail to let us verify the user's email
     * @param {Object} target the target of the sent events
     */
    verifyMail( target ){
        const self = this;
        Meteor.callPromise( 'pwixAccounts.sendVerificationEmail', Meteor.userId())
            .then(( result ) => {
                if( result ){
                    Tolert.success( i18n.label( I18N, 'user.verifyask_success' ));
                    const event = 'ac-user-verifyasked-event';
                    const parms = { ...Meteor.user() };
                    if( pwixAccounts.opts().verbosity() & AC_VERBOSE_USER ){
                        console.log( 'pwix:accounts-ui triggering', event, parms );
                    }
                    pwixAccounts.EventManager.trigger( event, parms );
                } else {
                    Tolert.error( i18n.label( I18N, 'user.verifyask_error' ));
                }
            });
    }
}
