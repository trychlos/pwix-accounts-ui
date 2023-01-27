# accounts

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

The main *accounts* user interface is the 'acUserLogin' template.

In its default configuration, the 'acUserLogin' template provides the full login workflow through beautiful Bootstrap modal dialogs.
See [the most simple user](#the-most-simple-usage) later.

*accounts* adds to this standard behavior the capability to call 'acUserLogin' several times, each time with a different configuration, so that the package is able to nicely handle different running contexts.

As some example use cases, we can evoke:

- defining a first administrator when a user runs the application for the first time, thus displaying a specific form with specific styling

- reusing the users's management capabilities of *accounts* to provide some sort of users list, users selection, and so on

- reusing *accounts* user interface to let a user create account for another one, or for many other ones.

Please note that, though several 'acUserLogin' templates can be instanciated by the application, and display different things or answer to different use cases, all these instances actually share a single connection state. Their interfaces are always kept consistent.

Last, this *accounts* package is able to fully configure the Meteor Accounts system it relies on, so that the application may fully subcontract the Meteor Accounts configuration to the package.

One single configuration place for one application subsystem!

## The most simple usage

Just insert the template into your component `{{> acUserLogin }}` and:

- a dropdown button will be displayed, the dropdown menu including the standard items which let the user log-in, or ask for reset his password, or sign up for a new account;

- when logged-in, the dropdown button will display his email address, the dropdown menu inclusing the standard items which let the user log out, change his password, or ask for receive a verification link in his mailbox if not already done.

That's all, folks!

Out of the box, and without any configuration, the 'acUserLogin' template provides all the needed plumbing for managing the login/logout workflows, including the handling of the reset and verification links.

## Default synoptic

All the behavior and the dynamics are managed through the 'acUserLogin' template.

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

Additionnally, the master 'acUserLogin' template, and all the underlying infrastructure, takes care of:

- verifying the mail adress
    - send a mail to the address with a link
    - the sent link has a limited lifetime
    - when activated, the link redirect to a dedicated panel on the site which set the mail address as 'verified'

- let the user reset his/her password
    - send a mail to the specified address with a link
    - the sent link has a limited lifetime
    - when activated, the link redirect to a dedicated panel on the site which let the user enter his/her new credentials.

## Configuration

*accounts* is configurable as a package, which let the application set parameters which apply to the whole package.

acUserLogin template has itself a large set of configuration parameters, which let the application configure how each 'acUserLogin' instance is to be used.

### Configuring accounts

The *accounts* package is configured by just calling `pwiAccounts.configure()` method, with an object containing the keys (and values) the application wishes change.

Please note that this `pwiAccounts.configure()` method MUST be called in the same terms both by the client and the server.

One more time, this configuration applies to the whole package, and so is common to each and every 'acUserLogin' template instance.

<table>
<tr><td style="vertical-align:top;">
haveEmailAddress<br />
haveUsername
</td><td>
Whether the user accounts are to be configured with or without a username (resp. an email address), and whether it is optional or mandatory.<br />
For each of these terms, possible values are:
<ul><li>AC_FIELD_NONE: the field is not displayed nor considered</li>
<li>AC_FIELD_OPTIONAL: the input field is proposed to the user, but may be left empty</li>
<li>AC_FIELD_MANDATORY: the input field must be filled by the user</li></ul>
At least one of these fields MUST be set as AC_FLD_MANDATORY. Else, the default value will be applied.<br />
A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.<br />
Defaut values are:
<ul><li>haveMailAddress: AC_FIELD_MANDATORY</li>
<li>haveUsername: AC_FIELD_NONE</li></ul>
Please be conscious that some features of your application may want display the identifier of a user.
If this is the case, note that it would be a string security hole to let the application display a verified email address as this would be some sort of spam magnet!
</td></tr>

<tr><td style="vertical-align:top;">
passwordLength
</td><td>
The minimal required password length when setting a new password, either when creating a new account of when changing the password of an existing account.<br />
The package doesn't hardcodes by itself a minimal 'minimal length', and so will accept even a minimal length of, say, 4 characters!<br />
Default is eight (8) characters.<br/>
A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.<br />
<b>Please note that, for security reasons, you shouldn't set the minimal password length less than this default, unless you are absolutely sure of what you are doing.</b>
</td></tr>

<tr><td style="vertical-align:top;">
passwordStrength
</td><td>
The minimal required password strength when setting a new password, either when creating a new account of when changing the password of an existing account.<br />
<i>accounts</i> makes use of <a href="https://www.npmjs.com/package/zxcvbn">zxcvbn</a> package to estimate the strength of entered passwords.
The estimated strength can take folloging values:
<ul>
<li>AC_PWD_VERYWEAK: too guessable, risky password (guesses < 10^3)</li>
<li>AC_PWD_WEAK: very guessable, protection from throttled online attacks (guesses < 10^6)</li>
<li>AC_PWD_MEDIUM: somewhat guessable, protection from unthrottled online attacks (guesses < 10^8)</li>
<li>AC_PWD_STRONG: safely unguessable, moderate protection from offline slow-hash scenario (guesses < 10^10)</li>
<li>AC_PWD_VERYSTRONG: very unguessable, strong protection from offline slow-hash scenario (guesses >= 10^10)</li>
 </ul>
The package doesn't hardcodes by itself a minimal 'required strength', and so will accept even a minimal length of, say, AC_PWD_VERYWEAK!<br />
A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.<br />
Default is AC_PWD_MEDIUM, which corresponds to somewhat guessable, i.e. can be a protection from unthrottled online attacks.<br />
<b>Please note that, for security reasons, you shouldn't set the password required strength less than this default, unless you are absolutely sure of what you are doing.</b>
</td></tr>

<tr><td style="vertical-align:top;">
passwordTwice
</td><td>
Whether a new password has to be entered twice.<br />
Unless otherwise specified, this option applies to both:
<ul>
<li>defining a new account</li>
<li>changing the user's password</li>
<li>defining a new password after a reset</li>
 </ul>
A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.<br />
Possible values are true or false, defaulting to true.</b>
</td></tr>

<tr><td style="vertical-align:top;">
resetPwdTextOne<br />
resetPwdTextTwo
</td><td style="vertical-align:top;">
Panels personalization<br/>
These options let the application provides its own content before the input fields of the corresponding panel.<br />
Value is expected to be a string which contains HTML code, or a function which returns such a string.
</td></tr>

<tr><td style="vertical-align:top;">
resetPasswordTwice
</td><td>
Whether to request the user to enter twice the password when resetting for an existing account.<br />
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
The possible values are true or false, defaulting to the value of the <code>passwordTwice</code> package configuration.
</td></tr>

<tr><td style="vertical-align:top;">
usernameLength
</td><td>
The minimal required username length.<br />
The package doesn't hardcodes by itself a minimal 'minimal length'.<br />
Default is four (4) characters.<br/>
A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.<br />
</td></tr>

<tr><td style="vertical-align:top;">
ui
</td><td>
Indicates if dialogs are to be managed via the Bootstrap frontend toolkit or the jQuery UI ad-hoc widget.<br/>
Accepted values are:
<ul><li>AC_UI_BOOTSTRAP</li><li>
AC_UI_JQUERY</li></ul>
A function can be provided by the application for these parms. The function will be called without argument and MUST return one of the accepted values.<br />
Defaults to AC_UI_BOOTSTRAP.
</td></tr>
</table>

### Configuring acUserLogin

This template is the main interaction way between the application and this *accounts* package.

Thanks to its numerous options, the 'acUserLogin' template may be called several times and is able to answer to
many different situations: each 'acUserLogin' instance is independently configurable so that it will display or
not the expected dialogs.

Nonetheless, all the instanciated 'acUserLogin' instances share a same singleton object which manages the current
logged/unlogged connection state. Thanks to this singleton, all the instanciated 'acUserLogin' instances share this common
status, event if they are able to display different things, and provide a consistent user experience.

The template expects to be called with a single configuration object parameter, or maybe nothing at all if all the defaults are to be used.
Even when providing a configuration object, as all keys are optional, this object can be just empty.

Please note that each and every 'acUserLogin' instance has its own configuration.

<table>
<tr><td style="vertical-align:top;">
loggedButtonAction<br />
unloggedButtonAction
</td><td>
The action triggered when the user clicks on the button.<br />
Possible values ares:
<ul><li>AC_ACT_HIDDEN: the button is not displayed at all</li>
<li>AC_ACT_NONE: the button is displayed, but not activable (this is a false button, just a label with the appearance of a button)</li>
<li>AC_ACT_DROPDOWN: the button opens a dropdown menu,</li>
<li>AC_ACT_BUBBLE: the *accounts* event handler will do nothing, and let the event bubble up to the application</li></ul>
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
Default is AC_ACT_DROPDOWN.
</td></tr>

<tr><td style="vertical-align:top;">
loggedButtonClass<br />
unloggedButtonClass
</td><td>
Classes to be added to a displayed button.<br />
Only applies if the button is shown (cf. loggedButtonAction, unloggedButtonAction parms).<br />
The provided value is expected to be a string, or a function which takes no argument and returns a string.</li></ul>
Defaults to:<br />
<ul><li>empty when unlogged (no added class)</li>
<li>'dropdown-toggle' when logged;<br />
in conjonction with default loggedButtonContent, the effect is to display the user email address with a small down-arrow after the text.</li></ul>
</td></tr>

<tr><td style="vertical-align:top;">
loggedButtonContent<br />
unloggedButtonContent
</td><td>
The content to be displayed in the shown button.<br />
Only applies if the button is visible (cf. loggedButtonAction, unloggedButtonAction parms).<br />
The content is expected to be a HTML string to be inserted in place of the default value;
this HTML string may (should ?) also embeds needed class names and other styles.
The provided value is expected to be this content, either as a string or a function which takes no argument and returns the content string.<br />
Defaults to:<br/>
<ul><li>
a '<code>&lt;span class="fa-regular fa-fw fa-user"&gt;&lt;/span&gt;</code>' HTML string when unlogged</li><li>
the 'preferredButton' value when logged.</li></ul>
</td></tr>

<tr><td style="vertical-align:top;">
loggedItems<br />
unloggedItems
</td><td>
Items to be displayed in replacement of the standard ones.<br/>
Only applies if a dropdown menu is to be opened as the button action<br />
Value: a single HTML string which is expected to be the '<code>&lt;li&gt;...&lt;/li&gt;</code>' inner HTML,
or an array of such strings, or a function which takes no argument and returns a single HTML string or an array.<br />
Default: standard items.
</td></tr>

<tr><td style="vertical-align:top;">
loggedItemsAfter<br />
unloggedItemsAfter
</td><td>
Items to be added after the standard items of the dropdown menu.<br/>
Only applies if a dropdown menu is to be opened as the button action<br />
Value: a single HTML string which is expected to be the '<code>&lt;li&gt;...&lt;/li&gt;</code>' inner HTML,
or an array of such strings, or a function which takes no argument and returns a single HTML string or an array.<br />
Default: none.
<ul><li>
</li></ul>
</td></tr>

<tr><td style="vertical-align:top;">
loggedItemsBefore<br />
unloggedItemsBefore
</td><td>
Items to be added before the standard items of the dropdown menu.<br/>
Only applies if a dropdown menu is to be opened as the button action<br />
Value: a single HTML string which is expected to be the <code>&lt;li&gt;...&lt;/li&gt;</code> inner HTML,
or an array of such strings, or a function which takes no argument and returns a single HTML string or an array.<br />
Default: none.
</td></tr>

<tr><td style="vertical-align:top;">
renderMode
</td><td>
When displayed, whether the template is rendered as a modal dialog of its own, or inside a <code>&lt;div&gt;...&lt;/div&gt;</code>
provided by the application (where the template has been inserted).<br />
Possible values are:
<ul><li>AC_RENDER_MODAL</li>
<li>AC_RENDER_DIV</li></ul>
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
Default is AC_RENDER_MODAL: when visible, the template is rendered as a modal dialog.<br />
Whatever be the initial choice, the application may still change the rendering mode via the messages:
<ul><li><code>ac-render-modal</code>
</li><li><code>ac-render-div</code>.</li></ul>
</td></tr>

<tr><td style="vertical-align:top;">
signupPasswordTwice<br />
changePasswordTwice
</td><td>
Whether to request the user to enter twice the password of a newly created account, or the new password of an existing account.<br />
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
The possible values are true or false, defaulting to the value of the <code>passwordTwice</code> package configuration.
</td></tr>

<tr><td style="vertical-align:top;">
</td><td>
Through the 'acUserLogin' template, the application may also use this package to display any of the *accounts* panels, outside of
the normal login/logout workflow. This is accomplished by configuring for displaying a single panel.
</td></tr>

<tr><td style="vertical-align:top;">
initialPanel
</td><td>
Designates the panel to be initially displayed when this 'acUserLogin' template is instanciated.<br />
Possible values are:
<ul><li>AC_PANEL_NONE</li>
<li>AC_PANEL_SIGNIN</li>
<li>AC_PANEL_SIGNUP</li>
<li>AC_PANEL_RESETASK</li>
<li>AC_PANEL_SIGNOUT</li>
<li>AC_PANEL_CHANGEPWD</li>
<li>AC_PANEL_VERIFYASK</li></ul>
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
Default: AC_PANEL_NONE
</td></tr>

<tr><td style="vertical-align:top;">
changePwdTextOne<br />
changePwdTextTwo<br />
changePwdTextThree<br />
resetAskTextOne<br />
resetAskTextTwo<br />
signinTextOne<br />
signinTextTwo<br />
signinTextThree<br />
signoutTextOne<br />
signupTextOne<br />
signupTextTwo<br />
signupTextThree<br />
signupTextFour<br />
verifyAskTextOne
</td><td style="vertical-align:top;">
Panels personalization<br/>
These options let the application provides its own content before the input fields of the corresponding panel.<br />
Value is expected to be a string which contains HTML code, or a function which returns such a string.
</td></tr>

<tr><td style="vertical-align:top;">
signinLink<br />
signupLink<br />
resetLink
</td><td style="vertical-align:top;">
Whether to display the relevant link in the bottom of the relevant panels.<br />
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
Values: true|false, defaulting to true.
</td></tr>

<tr><td style="vertical-align:top;">
signupAutoConnect
</td><td>
Whether to auto-connect a newly created account.<br />
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
Values: true|false, defaulting to true.
</td></tr>

<tr><td style="vertical-align:top;">
</td><td>
As a convenience for an application which would wish make use of several 'acUserLogin' templates, each one may be named
(obviously uniquely), and internal configuration may later be get via the pwiAccounts methods, accessing it via the
attributed name.
</td></tr>

<tr><td style="vertical-align:top;">
name
</td><td>
An optional, though unique when set, name attributed by the application to *this* 'acUserLogin' instance.<br />
Value: any string.<br />
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
Default to none.
</td></tr>
</table>

### Messages sendable to acUserLogin

Besides of initial configuration options, the behavior of the 'acUserLogin' template may be controlled
via messages sent to the `<div class="acUserLogin">...</div>`.

- ac-panel + `panel`

    Display the requested panel

- ac-panel-none
- ac-panel-signin
- ac-panel-signup
- ac-panel-resetask
- ac-panel-signout
- ac-panel-changepwd
- ac-panel-verifyask

    Display the targeted panel

- ac-render-modal
- ac-render-div

    Change the rendering mode

### Messages sent on `acUserLogin` element

In the same time, the 'acUserLogin' template advertises of its contexts:

- ac-panel-transition + { previous, next }

    Advertises of a panel transition, with previous and new panels

- ac-user-changepwd + `emailAddress`
- ac-user-create + `emailAddress`
- ac-user-login + `userId`
- ac-user-logout + `emailAddress`
- ac-user-resetasked + `emailAddress`
- ac-user-verifyasked + `emailAddress`

    Advertises of a realized action on the user account

- ac-hidden-modal
- ac-shown-modal

    When a modal has been hidden (resp. shown).<br />
    The `.ac-modal` element is provided as a data on these two messages.

- ac-password-data
- ac-username-data
- ac-email-data
- ac-twice-data

    Provides the current characteristics of the new password (resp. username, resp. email address, resp. double password fields) being inputed by the user.

### Messages sent on `body` element

- ac-user-resetpwd + `emailAddress`
- ac-user-verifymail + `emailAddress`

    These messages are sent as `CustomEvent`s with ad-hoc details.

## Advanced use cases

## What does the package provide ?

### Exported objects

- pwiAccounts

### Exported constants

- AC_LOGGED
- AC_UNLOGGED

- AC_ACT_HIDDEN
- AC_ACT_NONE
- AC_ACT_DROPDOWN
- AC_ACT_BUBBLE

- AC_FIELD_NONE
- AC_FIELD_OPTIONAL
- AC_FIELD_MANDATORY

- AC_PANEL_NONE
- AC_PANEL_CHANGEPWD
- AC_PANEL_RESETASK
- AC_PANEL_SIGNIN
- AC_PANEL_SIGNOUT
- AC_PANEL_SIGNUP
- AC_PANEL_VERIFYASK

- AC_PWD_VERYWEAK
- AC_PWD_WEAK
- AC_PWD_MEDIUM
- AC_PWD_STRONG
- AC_PWD_VERYSTRONG

- AC_RENDER_MODAL
- AC_RENDER_DIV

- AC_UI_BOOTSTRAP
- AC_UI_JQUERY

### Exported templates

Besides of the 'acUserLogin' template already invoked, the *accounts* package exports following templates:

#### acMenuItems

This template displays the list of `<li>...</li>` items of the menu to be displayed regarding the current connection state.

The template expects to be called with one of these two parameters:

- either a 'dialog' one, which must address an acDisplay instance, and is the way it is internally called by the package itself

- or with a 'name' key which must address the name of a 'acUserLogin' instance.

#### acSelect

This template displays the list of the users, and let the application user's do a selection.

The template expects to be called with one of these two parameters:

- 'selection' must address a ReactiveVar, which is expected to contain the initial selecttion, and will return the final selection, as an array of `{ id: <id> }` objects

- 'text' is an optional parameter which may address a ReactiveVar, which is expected to contain a HTML string to be displayed before the selection list; it defaults to none.

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
it should apply its media query on the 'display' div class, which is a direct child of the 'acUserLogin' one.

This way, the 'acUserLogin' div is kept active, and continues to receive the messages.
