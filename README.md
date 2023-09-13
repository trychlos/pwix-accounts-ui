# pwix:accounts-ui

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

`pwix:accounts-ui` is an encapsulation of the Meteor Accounts UI system.

It aims to provide a full replacement for Meteor [accounts-ui](https://atmospherejs.com/meteor/accounts-ui) while still relying on standard [accounts-password](https://atmospherejs.com/meteor/accounts-password). As a consequence, it expects (and makes use of) a 'users' collection be available in the application database.

However, `pwix:accounts-ui` is fully configurable and is able to provide different user interfaces to adapt to different contexts.

## How does it work ?

The main `pwix:accounts-ui` user interface is the `acUserLogin` template.

In its default configuration, the `acUserLogin` template provides the full login workflow through beautiful Bootstrap modal dialogs.
See [the most simple usage](#the-most-simple-usage) later.

`pwix:accounts-ui` adds to this standard behavior the capability to call `acUserLogin` several times, each time with a different configuration, so that the package is able to nicely handle different running contexts.

As some example use cases, we can evoke:

- defining a first administrator when a user runs the application for the first time, thus displaying a specific form with specific styling, and have a distinct workflow

- reusing the users's management capabilities of `pwix:accounts-ui` to provide some sort of users list, users selection, and so on

- reusing `pwix:accounts-ui` user interface to let a user create account for another one, or for many other ones.

Please note that, though several `acUserLogin` templates can be instanciated by the application, and display different things or answer to different use cases, all these instances actually share a single connection state. Their interfaces are always kept consistent.

Last, this `pwix:accounts-ui` package is able to fully configure the Meteor Accounts system it relies on, so that the application may fully subcontract the Meteor Accounts configuration to the package.

One single configuration place for one application subsystem!

## The most simple usage

Just insert the template into your component `{{> acUserLogin }}` and:

- a dropdown button will be displayed, the dropdown menu including the standard items which let the user log-in, or ask for reset his password, or sign up for a new account;

- when logged-in, the dropdown button will display his email address, the dropdown menu including the standard items which let the user log out, change his password, or ask for receive a verification link in his mailbox if not already done.

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

![signin](/maintainer/png/signin_fr_384.png)

- while the user is not logged in, and after he/she has clicked the 'Sign-up' button
    - display a modal (resp. a div) to let him/she enter some new credentials
    - have (or not) a 'Sign-in' link

![signup](/maintainer/png/signup_fr_384.png)

- while the user is not logged in, and after he/she has clicked the 'Reset password' button
    - display a modal (resp. a div) to let him/she enter a target email address
    - have (or not) a 'Sign-in' link
    - have (or not) a 'Sign-up' link

![resetpwd](/maintainer/png/resetpwd_fr_384.png)

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

![signout](/maintainer/png/signout_fr_384.png)

- when the user is logged in, and after he/she has clicked the 'Change password' button
    - display a modal (resp. a div) to let him/she change his/her credentials

![changepwd](/maintainer/png/changepwd_fr_384.png)

Additionnally, the master `acUserLogin` template, and all the underlying infrastructure, takes care of:

- verifying the mail adress
    - send a mail to the address with a link
    - the sent link has a limited lifetime
    - when activated, the link redirect to a dedicated panel on the site which set the mail address as 'verified'

![verifyemail](/maintainer/png/verifyemail_fr_384.png)

- let the user reset his/her password
    - send a mail to the specified address with a link
    - the sent link has a limited lifetime
    - when activated, the link redirect to a dedicated panel on the site which let the user enter his/her new credentials.

## Configuring

The package's behavior can be configured through a call to the `AccountsUI.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `haveEmailAddress`
- `haveUsername`

    Whether the user accounts are to be configured with or without a username (resp. an email address), and whether it is optional or mandatory.

    For each of these terms, accepted values are:

    - `AC_FIELD_NONE`: the field is not displayed nor considered
    - `AC_FIELD_OPTIONAL`: the input field is proposed to the user, but may be left empty
    - `AC_FIELD_MANDATORY`: the input field must be filled by the user

    At least one of these fields MUST be set as `AC_FIELD_MANDATORY`. Else, the default value will be applied.

    Defauts to:

    - `haveMailAddress`: `AC_FIELD_MANDATORY`
    - `haveUsername`: `AC_FIELD_NONE`

    Please be conscious that some features of your application may want display an identifier for each user. It would be a security hole to let the application display a verified email address anywhere, as this would be some sort of spam magnet!

- `informWrongEmail`

    Whether to inform the user that the email address he/she has entered when asking for resetting a password is not known of our users database.

    Rationale:

        Meteor default is to return a [403] Something went wrong. Please check your credentials.' error message.

        Some security guys consider that returning such error would let a malicious user to check which email addresses are registered - or not - in the accounts database, so would lead to a potential confidentiality break.

    This parameter let the application decide what to do:

    - `AC_WRONGEMAIL_OK`: say the user that the email has been sucessfully sent, even when this is not the case
    - `AC_WRONGEMAIL_ERROR`: say the user that something went wrong (Meteor standard behavior).

    Defaults to `AC_WRONGEMAIL_ERROR`.

- `coloredBorders`

    Whether the borders of fields in the panels should or not be colored, and when:

    - `AC_COLORED_NEVER`: do not use colored borders at all
    - `AC_COLORED_VALIDATION`: use colored borders to exhibit the validation state of the fields
    - `AC_COLORED_MANDATORY`: use colored borders to exhibit the mandatory character of each field

    Defaults to `AC_COLORED_NEVER`: the error messages are red-colored, but the fields themselves stay normal colored.

- `onEmailVerifiedBeforeFn`

    A user function to be called when an email has just been verified.

    If a box is also displayed (cf. below), then this function is called before the box is displayed.

    Defaults to `null`.

- `onEmailVerifiedBox`

    Whether we display a confirmation dialog box when an email has just been verified.

    Accepted values are `true` or `false`.

    Defaults to `true`.

- `onEmailVerifiedBoxCb`

    A user function to be called when the user acknowledges the displayed confirmation box.

    Defaults to `null`.

- `onEmailVerifiedBoxTitle`

    The title of the confirmation box as a string.

    Defaults to (localized) 'Email address verification'.

- `onEmailVerifiedBoxMessage`

    The content of the confirmation box as a HTML string.

    Defaults to (localized) 'Hi.<br />Your email address is now said "verified".<br />Thanks.'.

- `passwordLength`

    The minimal required password length when setting a new password, either when creating a new account of when changing the password of an existing account.

    The package doesn't hardcodes by itself a minimal 'minimal length', and so will accept even a minimal length of, say, 1 character!

    Defaults to eight (8) characters.

    **Please note that, for security reasons, you shouldn't set the minimal password length less than this default, unless you are absolutely sure of what you are doing.**

- `passwordStrength`

    The minimal required password strength when setting a new password, either when creating a new account of when changing the password of an existing account.

    `pwix:accounts-ui` makes use of the [zxcvbn](https://www.npmjs.com/package/zxcvbn) package to estimate the strength of entered passwords. The estimated strength can take folloging values:

    - `AC_PWD_VERYWEAK`: too guessable, risky password (guesses < 10^3)
    - `AC_PWD_WEAK`: very guessable, protection from throttled online attacks (guesses < 10^6)
    - `AC_PWD_MEDIUM`: somewhat guessable, protection from unthrottled online attacks (guesses < 10^8)
    - `AC_PWD_STRONG`: safely unguessable, moderate protection from offline slow-hash scenario (guesses < 10^10)
    - `AC_PWD_VERYSTRONG`: very unguessable, strong protection from offline slow-hash scenario (guesses >= 10^10)

    The package doesn't hardcodes by itself a minimal 'required strength', and so will accept even a minimal length of, say, `AC_PWD_VERYWEAK`!

    Defaults to `AC_PWD_MEDIUM`.

    **Please note that, for security reasons, you shouldn't set the password required strength less than this default, unless you are absolutely sure of what you are doing.**

- `passwordTwice`

    Whether a new password has to be entered twice.

    This option applies to both:

    - defining a new account
    - changing the user's password
    - defining a new password after a reset

    Accepted values are `true` or `false`.

    Defaults to `true`.

- `resetPasswordTwice`

    Whether to request the user to enter twice the password when resetting for an existing account.

    Accepted values are `true` or `false`, defaulting to the value of the `passwordTwice` package configuration.

- `resetPwdTextOne`
- `resetPwdTextTwo`

    Display personalization of the Reset password dialog box.

    These options let the application provides its own content before the input fields of the corresponding panel.

    Value is expected to be a HTML string, or a function which returns such a string.

    Defaults to 'Hello <b>%s</b>,<br />Welcome again!<br />Let us reset your password, and enjoy.' for the first text, none for the second.

- `sendVerificationEmail`

    Whether to send a verification email to each newly created user.

    Accepted values are `true` or `false`.

    Defaults to `true`.

- `usernameLength`

    The minimal required username length.

    The package doesn't hardcodes by itself a minimal 'minimal length'.

    Defaults to four (4) characters.

- `verbosity`

    The verbosity level as:
    
    - `AC_VERBOSE_NONE`
    
    or an OR-ed value of integer constants:

    - `AC_VERBOSE_CONFIGURE`

        Trace configuration operations

    - `AC_VERBOSE_DISPLAY`

        Trace `acDisplay` operations

    - `AC_VERBOSE_EVENT`

        Trace all handled events

    - `AC_VERBOSE_INSTANCIATIONS`

        Trace classes instanciations

    - `AC_VERBOSE_MODAL`

        Trace modal changes

    - `AC_VERBOSE_PANEL`

        Trace panel changes

    - `AC_VERBOSE_READY`

        Emit a log message when the readyness status of the client changes

    - `AC_VERBOSE_STARTUP`

        Emit a log message at startup; the `Meteor` object is dumped at that moment

    - `AC_VERBOSE_SUBMIT`

        Trace submit-related events trigerring and handling.

    - `AC_VERBOSE_USER`

        Trace user-related events trigerring and handling.

    Defaults to `AC_VERBOSE_NONE`.

A function can be provided by the application for each of these parameters. The function will be called without argument and must return a suitable value.

Please note that `AccountsUI.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `AccountsUI.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## What does the package provide ?

### `AccountsUI`

The globally exported object.

### Methods

- `AccountsUI.clearPanel()`

    A client-only method which clears the current panel.

- `AccountsUI.dropdownItems()`

    A client-only method which returns the list of standard dropdown items, depending of the current user connection state.

    The returned value is an array where each item is a HTML string '`<a>...</a>`'.

    A reactive data source.

- `AccountsUI.i18n.namespace()`

    This method returns the `pwix:i18n` namespace of the `pwix:accounts-ui` package.

    With that name, anyone is so able to provide additional translations.

- `AccountsUI.ready()`

    A client-only method which advertises when the package has been successfully initialized.

    A reactive data source.

- `AccountsUI.restore( prefix )`

    Restore previously saved package parameters whose name begins with `prefix`.

- `AccountsUI.saveOnce( prefix )`

    Save (once) all package parameters whose name begins with `prefix`.

    The save is done in memory, and doesn't survive to a page reload. This function should so be called at every application initialization.

    This may be useful when another package wants to temporarily set its own parameters, in place of those provided by the application.

### Blaze components

Besides of the `acUserLogin` template already invoked, the `pwix:accounts-ui` package exports following templates:

#### `acMenuItems`

This template displays the list of `<li>...</li>` items of the menu to be displayed regarding the current connection state.

The template expects to be called with one parameter:

- a '`name`' key which must address the same name of the corresponding '`acUserLogin`' instance.

#### `acUserLogin`

This template is the main interaction way between the application and this `pwix:accounts-ui` package.

Thanks to its numerous options, the `acUserLogin` template may be called several times and is able to answer to
many different situations: each `acUserLogin` instance is independently configurable so that it will display or
not the expected dialogs.

The template expects to be called with a single configuration object parameter, or maybe nothing at all if all the defaults are to be used.
Even when providing a configuration object, as all keys are optional, this object can be just empty.

- `withConnectionState`

    There is obviously only one user connected at once in this device for this application. So a single connection state managed by the `pwix:accounts-ui` package, and which defaults to be shared by each and every `acUserLogin` component.

    Some situations will nonetheless take advantage of reusing the Blaze components without considering any other thing than that simple components. Say, for example, when an application administrator wants create several user accounts: obviously these accounts should not be automatically connected at their creation, nor disconnect the administrator, etc.

    Accepted values are `true` or `false`.

    Defaults to `true`.

    When set to `false`, the login workflow is not considered, but accounts are created, mails are sent if asked for, etc.

- `loggedButtonAction`
- `unloggedButtonAction`

    The action triggered when the user clicks on the button.

    Accepted values ares:

    - `AC_ACT_HIDDEN`: the button is not displayed at all
    - `AC_ACT_NONE`: the button is displayed, but not activable (this is a false button, just a label with the appearance of a button)
    - `AC_ACT_DROPDOWN`: the button opens a dropdown menu
    - `AC_ACT_BUBBLE`: the button is activated, but does nothing; the event bubble up

    Defaults to `AC_ACT_DROPDOWN`.

- `loggedButtonClass`
- `unloggedButtonClass`

    Classes to be added to a displayed button.

    Only applies if the button is shown (cf. `loggedButtonAction` and `unloggedButtonAction` parms).
    
    The provided value is expected to be a string, or a function which takes no argument and returns a string.

    Defaults to:

    - empty when unlogged (no added class)
    - `dropdown-toggle` when logged;

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
    - the email address value when logged.

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

    Accepted values are:

    - `AC_RENDER_MODAL`
    - `AC_RENDER_DIV`

    Default: to `AC_RENDER_MODAL`: when visible, the template is rendered as a modal dialog.

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

- `coloredBorders`

    Whether the borders of fields in the panels should or not be colored, and when:

    - `AC_COLORED_NEVER`: do not use colored borders at all
    - `AC_COLORED_VALIDATION`: use colored borders to exhibit the validation state of the fields
    - `AC_COLORED_MANDATORY`: use colored borders to exhibit the mandatory character of each field

    Defaults to the value configured at the package level.

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

    Values: `true`|`false`, defaulting to `true`.

- `signupAutoConnect`

    Whether to auto-connect a newly created account.

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Values: `true`|`false`, defaulting to `true`.

- `name`

    As a convenience for an application which would wish make use of several `acUserLogin` templates, each one may be named
    (obviously uniquely), and internal configuration may later be get via the AccountsUI methods, accessing it via the
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
- `AC_VERBOSE_DISPLAY`,
- `AC_VERBOSE_EVENT`,
- `AC_VERBOSE_INSTANCIATIONS`,
- `AC_VERBOSE_MODAL`,
- `AC_VERBOSE_PANEL`,
- `AC_VERBOSE_READY`,
- `AC_VERBOSE_STARTUP`,
- `AC_VERBOSE_SUBMIT`,
- `AC_VERBOSE_USER`

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

The full list of the dropdown items may be obtained by the application via the `AccountsUI.dropdownItems()` reactive method.

The activation of one of these standard items triggers the display of a panel which let the user enter
the required informations.

### Media queries

When the application chooses to hide the logged/unlogged button depending of the size of the device,
it should apply its media query on the 'display' div class, which is a direct child of the `acUserLogin` one.

This way, the `acUserLogin` div is kept active, and continues to receive and handle the messages.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.3.0:
```
    'email-validator': '^2.0.4',
    'lodash': '^4.17.0',
    'printf': '^0.6.1',
    'simpl-schema': '^3.4.1',
    'zxcvbn': '^4.4.2'
```

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

`pwix:accounts-ui` provides at the moment **fr** and **en** translations.

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-accounts-ui/pulls).

---
P. Wieser
- Last updated on 2023, Sept. 4th
