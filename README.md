# pwix:accounts - README

## Summary

1. [What is it ?](#what-is-it)
2. [How does it work ?](#how-does-it-work)
3. [The most simple usage](#the-most-simple-usage)
4. [Default synoptic](#default-synoptic)
5. [Configuration](#configuration)
    1. [Configuring *accounts*](#configuring-accounts)
    2. [Configuring acUserLogin](#configuring-acuserlogin)
    3. [Messages sendable to acUserLogin](#messages-sendable-to-acuserlogin)
    4. [Messages sent by acUserLogin](#messages-sent-by-acuserlogin)
6. [Advanced use cases](#advanced-use-cases)
7. [What does the package provide ?](#what-does-the-package-provide)
    1. [Exported objects](#exported-objects)
    2. [Exported constants](#exported-constants)
    3. [Exported templates](#exported-templates)
        1. [acMenuItems](#acmenuitems)
        2. [acSelect](#acselect)
8. [References for advanced use cases](#references-for-advanced-use-cases)
    1. [Standard dropdown items](#standard-dropdown-items)
    2. [Media queries](#media-queries)

---

## What is it ?

*accounts* is an encapsulation of the Meteor Accounts system.

It aims to provide a full replacement for [accounts-ui](https://atmospherejs.com/meteor/accounts-ui) while still relying on standard [accounts-password](https://atmospherejs.com/meteor/accounts-password). As a consequence, it expects (and makes use of) a 'users' collection be available in the application database.

However, *accounts* is fully configurable and is able to provide different user interfaces to adapt to different contexts.

## How does it work ?

The main *accounts* user interface is the `acUserLogin` template.

In its default configuration, the `acUserLogin` template provides the full login workflow through beautiful Bootstrap modal dialogs.
See [the most simple user](#the-most-simple-usage) later.

*accounts* adds to this standard behavior the capability to call `acUserLogin` several times, each time with a different configuration, so that the package is able to nicely handle different running contexts.

As some example use cases, we can evoke:

- defining a first administrator when a user runs the application for the first time, thus displaying a specific form with specific styling

- reusing the users's management capabilities of *accounts* to provide some sort of users list, users selection, and so on

- reusing *accounts* user interface to let a user create account for another one, or for many other ones.

Please note that, though several `acUserLogin` templates can be instanciated by the application, and display different things or answer to different use cases, all these instances actually share a single connection state. Their interfaces are always kept consistent.

Last, this *accounts* package is able to fully configure the Meteor Accounts system it relies on, so that the application may fully subcontract the Meteor Accounts configuration to the package.

One single configuration place for one application subsystem!

## The most simple usage

Just insert the template into your component `{{> acUserLogin }}` and:

- a dropdown button will be displayed, the dropdown menu including the standard items which let the user log-in, or ask for reset his password, or sign up for a new account;

- when logged-in, the dropdown button will display his email address, the dropdown menu inclusing the standard items which let the user log out, change his password, or ask for receive a verification link in his mailbox if not already done.

That's all, folks!

Out of the box, and without any configuration, the `acUserLogin` template provides all the needed plumbing for managing the login/logout workflows, including the handling of the reset and verification links.

## Default synoptic

All the behavior and the dynamics are managed through the `acUserLogin` template.

This template organizes itself to show a modal (or a div, see later) adapted to the various situations:

- while the user is not logged in
    - display (or not) a 'Sign-in' button

- while the user is not logged in, and after he/she has clicked the 'Sign-in' button
    - display a modal (resp. a div) to let him/she enter his/her credentials
    - have (or not) a 'Sign-up' link
    - have (or not) a 'Reset password' link

- while the user is not logged in, and after he/she has clicked the 'Sign-up' button
    - display a modal (resp. a div) to let him/she enter some new credentials
    - have (or not) a 'Sign-in' link

- while the user is not logged in, and after he/she has clicked the 'Reset password' button
    - display a modal (resp. a div) to let him/she enter a target email address
    - have (or not) a 'Sign-in' link
    - have (or not) a 'Sign-up' link

- when the user is logged in
    - display (or not) a 'Signed-in' button

- when the logged-in menu is dropdowned
    - display a 'Sign out' link
    - display a 'Change password' link
    - display a 'Verify email' link
    - display a 'Change password' link
    - display a 'Profile' link

- when the user is logged in, and after he/she has clicked the 'Sign out' button
    - display a popup to ask for confirmation

- when the user is logged in, and after he/she has clicked the 'Change password' button
    - display a modal (resp. a div) to let him/she change his/her credentials

Additionnally, the master `acUserLogin` template, and all the underlying infrastructure, takes care of:

- verifying the mail adress
    - send a mail to the address with a link
    - the sent link has a limited lifetime
    - when activated, the link redirect to a dedicated panel on the site which set the mail address as 'verified'

- let the user reset his/her password
    - send a mail to the specified address with a link
    - the sent link has a limited lifetime
    - when activated, the link redirect to a dedicated panel on the site which let the user enter his/her new credentials.

## Configuring

The package's behavior can be configured through a call to the `pwiAccounts.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `haveEmailAddress`
- `haveUsername`

    Whether the user accounts are to be configured with or without a username (resp. an email address), and whether it is optional or mandatory.

    For each of these terms, possible values are:

    - `AC_FIELD_NONE`: the field is not displayed nor considered
    - `AC_FIELD_OPTIONAL`: the input field is proposed to the user, but may be left empty
    - `AC_FIELD_MANDATORY`: the input field must be filled by the user

    At least one of these fields MUST be set as `AC_FIELD_MANDATORY`. Else, the default value will be applied.

    A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.

    Defaut values are:

    - `haveMailAddress`: `AC_FIELD_MANDATORY`
    - `haveUsername`: `AC_FIELD_NONE`

    Please be conscious that some features of your application may want display the identifier of a user.   
    If this is the case, note that it would be a string security hole to let the application display a verified email address as this would be some sort of spam magnet!
    More, whatever be the requirements of the application, this later MUST take care of allowing needed fields in its schema.

- `informResetWrongEmail`

    Whether to inform the user that the email address he/she has entered when asking for resetting a password is not known of our users database.

    Rationale:

    Meteor default is to return a [403] Something went wrong. Please check your credentials.' error message.

    Some security guys consider that returning such error would let a malicious user to check which email addresses are registered - or not - in the accounts database, so would lead to a potential confidentiality break.

    This parameter let the application decide what to do:

    - `AC_RESET_EMAILSENT`: say the user that the email has been sucessfully sent, though this is not the case
    - `AC_RESET_EMAILUNSENT`: say the user that the email cannot be sent, without any other reason
    - `AC_RESET_EMAILERROR`: say the user that something went wrong (Meteor standard behavior).

    Package default is to inform the user that email cannot be sent.

- `onVerifiedEmailBox`

    Whether to display a modal dialog box to confirm to the user that his email has been rightly validated.

    Defaults to `true`.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

- `onVerifiedEmailTitle`
- `onVerifiedEmailMessage`

    These two parameters define the content of the modal dialog box displayed to the user that his email has been rightly validated.

    They are only considered if `onVerifiedEmailBox` is `true`.

    Expected data are objects of the form `{ namespace: <namespace>, i18n: <i18n.key> }`

    Default values are respectively:

    - `{ namespace: AC_I18N, i18n: 'user.verify_title' }` for `onVerifiedEmailTitle` parameter
    - `{ namespace: AC_I18N, i18n: 'user.verify_text' }` for `onVerifiedEmailMessage` parameter.

    A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.

- `passwordLength`

    The minimal required password length when setting a new password, either when creating a new account of when changing the password of an existing account.

    The package doesn't hardcodes by itself a minimal 'minimal length', and so will accept even a minimal length of, say, 4 characters!

    Default is eight (8) characters.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    **Please note that, for security reasons, you shouldn't set the minimal password length less than this default, unless you are absolutely sure of what you are doing.**

- `passwordStrength`

    The minimal required password strength when setting a new password, either when creating a new account of when changing the password of an existing account.

    `pwix:accounts` makes use of the [zxcvbn](https://www.npmjs.com/package/zxcvbn) package to estimate the strength of entered passwords. The estimated strength can take folloging values:

    - `AC_PWD_VERYWEAK`: too guessable, risky password (guesses < 10^3)
    - `AC_PWD_WEAK`: very guessable, protection from throttled online attacks (guesses < 10^6)
    - `AC_PWD_MEDIUM`: somewhat guessable, protection from unthrottled online attacks (guesses < 10^8)
    - `AC_PWD_STRONG`: safely unguessable, moderate protection from offline slow-hash scenario (guesses < 10^10)
    - `AC_PWD_VERYSTRONG`: very unguessable, strong protection from offline slow-hash scenario (guesses >= 10^10)

    The package doesn't hardcodes by itself a minimal 'required strength', and so will accept even a minimal length of, say, `AC_PWD_VERYWEAK`!

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Default is `AC_PWD_MEDIUM`, which corresponds to somewhat guessable, i.e. can be a protection from unthrottled online attacks.

    **Please note that, for security reasons, you shouldn't set the password required strength less than this default, unless you are absolutely sure of what you are doing.**

- `passwordTwice`

    Whether a new password has to be entered twice.

    Unless otherwise specified, this option applies to both:

    - defining a new account
    - changing the user's password
    - defining a new password after a reset

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Possible values are `true` or `false`, defaulting to `true`.

- `resetPwdTextOne`
- `resetPwdTextTwo`

    Display personalization

    These options let the application provides its own content before the input fields of the corresponding panel.

    Value is expected to be a string which contains HTML code, or a function which returns such a string.

- `resetPasswordTwice`

    Whether to request the user to enter twice the password when resetting for an existing account.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    The possible values are `true` or `false`, defaulting to the value of the `passwordTwice` package configuration.

- `sendVerificationEmail`

    Whether to send a verification email to each newly created user.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    The possible values are `true` or `false`, defaulting to `true`.

- `usernameLength`

    The minimal required username length.

    The package doesn't hardcodes by itself a minimal 'minimal length'.

    Default is four (4) characters.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

- `verbosity`

    The verbosity level as:
    
    - `AC_VERBOSE_NONE`
    
    or an OR-ed value of integer constants:

    - `AC_VERBOSE_CONFIGURE`

        Trace configuration operations

    - `AC_VERBOSE_DISP_MANAGER`

        Trace `DisplayManager` methods

    - `AC_VERBOSE_INSTANCIATIONS`

        Trace class instanciations

    - `AC_VERBOSE_PANEL`

        Trace panel changes

    - `AC_VERBOSE_READY`
    - `AC_VERBOSE_STARTUP`
    - `AC_VERBOSE_SUBMIT_HANDLE`
    - `AC_VERBOSE_SUBMIT_TRIGGER`
    - `AC_VERBOSE_USER_HANDLE`
    - `AC_VERBOSE_USER_TRIGGER`

    A function can be provided by the application for this parm. The function will be called without argument and MUST return a suitable value.
    
    Defaults to `AC_VERBOSE_NONE`.

Please note that `pwiAccounts.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `pwiAccounts.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## What does the package provide ?

### `pwiAccounts`

The globally exported object.

### Methods

- `pwiAccounts.dropdownItems()`

    A client-only method which returns the list of standard dropdown items, depending of the current user connection state.

    The returned value is an array where each item is a HTML string '`<a>...</a>`'.

    A reactive data source.

- `pwiAccounts.ready()`

    A client-only method which advertises when the package has been successfully initialized.

    A reactive data source.

### Blaze components

Besides of the `acUserLogin` template already invoked, the *accounts* package exports following templates:

#### `acMenuItems`

This template displays the list of `<li>...</li>` items of the menu to be displayed regarding the current connection state.

The template expects to be called with one parameter:

- a '`name`' key which must address the same name of the corresponding '`acUserLogin`' instance.

#### `acUserLogin`

This template is the main interaction way between the application and this `pwix:accounts` package.

Thanks to its numerous options, the `acUserLogin` template may be called several times and is able to answer to
many different situations: each `acUserLogin` instance is independently configurable so that it will display or
not the expected dialogs.

Nonetheless, all the instanciated `acUserLogin` instances share a same singleton object which manages the current
logged/unlogged connection state. Thanks to this singleton, all the instanciated `acUserLogin` instances share this common
status, event if they are able to display different things, and provide a consistent user experience.

The template expects to be called with a single configuration object parameter, or maybe nothing at all if all the defaults are to be used.
Even when providing a configuration object, as all keys are optional, this object can be just empty.

- `loggedButtonAction`
- `unloggedButtonAction`

    The action triggered when the user clicks on the button.

    Possible values ares:

    - `AC_ACT_HIDDEN`: the button is not displayed at all
    - `AC_ACT_NONE`: the button is displayed, but not activable (this is a false button, just a label with the appearance of a button)<
    - `AC_ACT_DROPDOWN`: the button opens a dropdown menu,
    - `AC_ACT_BUBBLE`: the *accounts* event handler will do nothing, and let the event bubble up to the application

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Default is `AC_ACT_DROPDOWN`.

- `loggedButtonClass`
- `unloggedButtonClass`

    Classes to be added to a displayed button.

    Only applies if the button is shown (cf. `loggedButtonAction` and `unloggedButtonAction` parms).
    
    The provided value is expected to be a string, or a function which takes no argument and returns a string.

    Defaults to:

    - empty when unlogged (no added class)
    - 'dropdown-toggle' when logged;

    in conjonction with default `loggedButtonContent`, the effect is to display the user email address with a small down-arrow after the text.

- `loggedButtonContent`
- `unloggedButtonContent`

    The content to be displayed in the shown button.

    Only applies if the button is visible (cf. `loggedButtonAction` and, `unloggedButtonAction` parms)

    The content is expected to be a HTML string to be inserted in place of the default value;
    this HTML string may (should ?) also embeds needed class names and other styles.
    The provided value is expected to be this content, either as a string or a function which takes no argument and returns the content string.

    Defaults to:

    - a `<span class="fa-regular fa-fw fa-user">` HTML string when unlogged
    - the `preferredButton` value when logged.

- `loggedItems`
- `unloggedItems`

    Items to be displayed in replacement of the standard ones.

    Only applies if a dropdown menu is to be opened as the button action.

    Value: a single HTML string which is expected to be the `<li>...</li>` inner HTML,
    or an array of such strings, or a function which takes no argument and returns a single HTML string or an array.

    Default: standard items.

- `loggedItemsAfter`
- `unloggedItemsAfter`

    Items to be added after the standard items of the dropdown menu.

    Only applies if a dropdown menu is to be opened as the button action.

    Value: a single HTML string which is expected to be the `<li>...</li>` inner HTML,
    or an array of such strings, or a function which takes no argument and returns a single HTML string or an array.

    Default: none.

- `loggedItemsBefore`
- `unloggedItemsBefore`

    Items to be added before the standard items of the dropdown menu.

    Only applies if a dropdown menu is to be opened as the button action.

    Value: a single HTML string which is expected to be the `<li>...</li>` inner HTML,
    or an array of such strings, or a function which takes no argument and returns a single HTML string or an array.

    Default: none.

- `renderMode`

    When displayed, whether the template is rendered as a modal dialog of its own, or inside a `<div>...</div>`
    provided by the application (where the template has been inserted).

    Possible values are:

    - `AC_RENDER_MODAL`
    - `AC_RENDER_DIV`

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Default is `AC_RENDER_MODAL`: when visible, the template is rendered as a modal dialog.

    Whatever be the initial choice, the application may still change the rendering mode via the messages:

    - `ac-render-modal`
    - `ac-render-div`

- `haveCancelButton`

    Whether a `Cancel` button must be proposed.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Values: `true`|`false`, defaulting to `true`.

- `signupPasswordTwice`
- `changePasswordTwice`

    Whether to request the user to enter twice the password of a newly created account, or the new password of an existing account.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    The possible values are `true` or `false`, defaulting to the value of the `passwordTwice` package configuration.

- `initialPanel`

    Through the `acUserLogin` template, the application may also use this package to display any of the *accounts* panels, outside of
    the normal login/logout workflow. This is accomplished by configuring for displaying a single panel.

    This parameter designates the panel to be initially displayed when this `acUserLogin` template is instanciated.

    Possible values are:

    - `AC_PANEL_NONE`
    - `AC_PANEL_SIGNIN`
    - `AC_PANEL_SIGNUP`
    - `AC_PANEL_RESETASK`
    - `AC_PANEL_SIGNOUT`
    - `AC_PANEL_CHANGEPWD`
    - `AC_PANEL_VERIFYASK`

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Default: `AC_PANEL_NONE`

- `changePwdTextOne`
- `changePwdTextTwo`
- `changePwdTextThree`
- `resetAskTextOne`
- `resetAskTextTwo`
- `signinTextOne`
- `signinTextTwo`
- `signinTextThree`
- `signoutTextOne`
- `signupTextOne`
- `signupTextTwo`
- `signuTextThree`
- `signupTextFour`
- `verifyAskTextOne`

    Display personalization.

    These options let the application provides its own content before the input fields of the corresponding panel.

    Value is expected to be a string which contains HTML code, or a function which returns such a string.

- `signinLink`
- `signupLink`
- `resetLink`

    Whether to display the relevant link in the bottom of the relevant panels.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Values: `true`|`false`, defaulting to `true`.

- `signupAutoClose`

    Whether to auto-close the modal after having created a new user.

    A typical use case would be to let an administrator create successively several user accounts.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Values: `true`|`false`, defaulting to `true`.

- `signupAutoConnect`

    Whether to auto-connect a newly created account.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Values: `true`|`false`, defaulting to `true`.

- `name`

    As a convenience for an application which would wish make use of several `acUserLogin` templates, each one may be named
    (obviously uniquely), and internal configuration may later be get via the pwiAccounts methods, accessing it via the
    attributed name.

    `name` is an optional, though unique when set, name attributed by the application to *this* `acUserLogin` instance.

    Value: any string.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Default to none.

### Messages sendable to acUserLogin

Besides of initial configuration options, the behavior of the `acUserLogin` template may be controlled
via messages sent to the `<div class="acUserLogin">...</div>`.

- `ac-panel-signin-event`
- `ac-panel-signup-event`
- `ac-panel-resetask-event`
- `ac-panel-resetpwd-event`
- `ac-panel-signout-event`
- `ac-panel-changepwd-event`
- `ac-panel-verifyask-event`

    Display the targeted panel

- `ac-render-modal`
- `ac-render-div`

    Change the rendering mode

### Messages sent on `body` element

In the same time, the `acUserLogin` template advertises of its contexts:

- `ac-panel-transition` + `{ previous, next }`

    Advertises of a panel transition, with previous and new panels

- `ac-user-changepwd-event` + `emailAddress`
- `ac-user-created-event` + `emailAddress`
- `ac-user-signedin-event` + `userId`
- `ac-user-signedout-event` + `emailAddress`
- `ac-user-resetasked-event` + `emailAddress`
- `ac-user-verifyasked-event` + `emailAddress`

    Advertises of a realized action on the user account

- `ac-user-resetdone-event` + `emailAddress`
- `ac-user-verifieddone-event` + `emailAddress`

### Constants

- `AC_LOGGED`
- `AC_UNLOGGED`

- `AC_ACT_HIDDEN`
- `AC_ACT_NONE`
- `AC_ACT_DROPDOWN`
- `AC_ACT_BUBBLE`

- `AC_FIELD_NONE`
- `AC_FIELD_OPTIONAL`
- `AC_FIELD_MANDATORY`

- `AC_PANEL_NONE`
- `AC_PANEL_CHANGEPWD`
- `AC_PANEL_RESETASK`
- `AC_PANEL_SIGNIN`
- `AC_PANEL_SIGNOUT`
- `AC_PANEL_SIGNUP`
- `AC_PANEL_VERIFYASK`

- `AC_PWD_VERYWEAK`
- `AC_PWD_WEAK`
- `AC_PWD_MEDIUM`
- `AC_PWD_STRONG`
- `AC_PWD_VERYSTRONG`

- `AC_RENDER_MODAL`
- `AC_RENDER_DIV`

- `AC_USERNAME`
- `AC_EMAIL_ADDRESS`

- `AC_VERBOSE_NONE`,
- `AC_VERBOSE_CONFIGURE`,
- `AC_VERBOSE_DISP_MANAGER`,
- `AC_VERBOSE_IDPFREE`,
- `AC_VERBOSE_INSTANCIATIONS`,
- `AC_VERBOSE_PANEL_HANDLE`,
- `AC_VERBOSE_PANEL`,
- `AC_VERBOSE_READY`,
- `AC_VERBOSE_STARTUP`,
- `AC_VERBOSE_SUBMIT_HANDLE`,
- `AC_VERBOSE_SUBMIT_TRIGGER`,
- `AC_VERBOSE_USER_HANDLE`,
- `AC_VERBOSE_USER_TRIGGER`

## Advanced use cases

## References for advanced use cases

### Standard dropdown items

The packages defines and makes use of these standard items.

#### When logged

| standard id | standard action |
| ---         | ---             |
| ac-signout-item | triggers the message 'ac-panel-signout' |
| ac-verifyask-item | triggers the message 'ac-panel-verifyask' |
| ac-changepwd-item | triggers the message 'ac-panel-changepwd' |

#### When unlogged

| standard id | standard action |
| ---         | ---             |
| ac-signin-item | triggers the message 'ac-panel-signin' |
| ac-signup-item | triggers the message 'ac-panel-signup' |
| ac-resetask-item | triggers the message 'ac-panel-resetask' |

The full list of the dropdown items may be obtained by the application via the `pwiAccounts.dropdownItems()` reactive method.

The activation of one of these standard items triggers the display of a panel which let the user enter
the required informations.

### Media queries

When the application chooses to hide the logged/unlogged button depending of the size of the device,
it should apply its media query on the 'display' div class, which is a direct child of the `acUserLogin` one.

This way, the `acUserLogin` div is kept active, and continues to receive and handle the messages.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.1.0:
```
    '@popperjs/core': '^2.11.6',
    'bootstrap': '^5.2.1',
    'email-validator': '^2.0.4',
    'printf': '^0.6.1',
    'zxcvbn': '^4.4.2'
```

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-accounts/pulls).

---
P. Wieser
- Last updated on 2023, Feb. 20th
