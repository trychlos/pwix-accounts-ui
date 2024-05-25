# Accounts - TODO

## Summary

1. [Todo](#todo)
2. [Done](#done)

---
## Todo

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    2 | 2023- 1-20 | provides a button with a configurable label 'login with Zimbra' |
|    3 | 2023- 1-20 | provides a button to connect to the future chosen identity manager |
|    8 | 2023- 1-21 | develop a small SPA application to provide tests for the package |
|      | 2023- 9-18 | better try to define a test suite to make sure all entered fields are rightly written in database |
|   13 | 2023- 1-21 | feat: be able to handle all Meteor Accounts configuration |
|   14 | 2023- 1-21 | feat: provide enrollment (see for example accounts-ui) |
|   26 | 2023- 1-25 | feat: let the user change his email address |
|      | 2023- 1-29 | implies to define a new dropdown item and a new panel |
|   27 | 2023- 1-25 | feat: let the user change his username |
|      | 2023- 1-29 | implies to define a new dropdown item and a new panel |
|   28 | 2023- 1-25 | feat: have a profile dialog with all change options |
|      | 2023- 1-29 | implies to define a new dropdown item and a new panel |
|   29 | 2023- 1-26 | feat: manage several email addresses per user |
|      | 2023- 1-27 | even if the package itself should be capable, this is actually an application decision to manage that |
|   63 | 2023- 9- 9 | in izDate, many errors with textOne, textTwo textThree, textFour, legend and mandatoryBorder when trying to create a new account |
|   65 | 2023- 9-12 | feat: have a onUserCreated parm with nothing, dialog box or user function (but is it relevant client side) |
|   67 | 2023- 9-12 | feat: honor coloredBorders parm |
|   70 | 2023-10- 2 | validateNewUser() function should be only set on a acUserLogin option |
|      |            | as a new account is nonetheless created from acUserLogin, it is then possible to activate/unactivate it from the component |
|   71 | 2023-12-16 | with the birth of izIAM, AccountsUI MUST be capable being OAuth/OpenID client |
|   7é |  |  |

---
## Done

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    1 | 2023- 1-20 | be able to define a specific format for a form in some situations |
|      |            | use case: have a specific form when defining the first account of an application |
|      | 2023- 1-21 | rather build each panel dynamically from configuration options |
|      | 2023- 1-25 | or not !?? |
|      | 2023- 2-19 | This use case is supposed to be solved by the acUserLogin philosophy - so obsolete this item |
|    4 | 2023- 1-20 | honor haveEmailAddress, haveUsername |
|      | 2023- 1-25 | signup: done |
|      | 2023- 1-25 | signin: done |
|      | 2023- 1-25 | change_pwd: done |
|      | 2023- 1-25 | done with v0.9.1 |
|    5 | 2023- 1-20 | configure whether username (resp. email address) may be used for login when accepted |
|      | 2023- 1-25 | cancelled: when an identifier is enteredn test against both username and email address |
|    6 | 2023- 1-20 | honor preferredButton |
|      | 2023- 1-23 | done in v0.90.1 |
|    7 | 2023- 1-21 | have a hardcoded min password length |
|      |            | Cancelled as README.md states that we do not do that |
|    9 | 2023- 1-21 | do not autopublish the list of users |
|      | 2023- 1-26 | publication is disabled (commented out) |
|   10 | 2023- 1-21 | use constantes rather than just strings when configuring |
|      |            | AC_UI_BOOTSTRAP, AC_UI_JQUERY |
|      |            | AccountsUI.C.Password.VERYWEAK, AccountsUI.C.Password.WEAK, AccountsUI.C.Password.MEDIUM, AccountsUI.C.Password.STRONG, AccountsUI.C.Password.VERYSTRONG |
|      |            | AC_FLD_NO, AC_FLD_OPTIONAL, AC_FLD_MANDATORY |
|      |            | AC_DISP_ID, AC_DISP_EMAIL, AC_DISP_USERNAME |
|      |            | AccountsUI.C.Button.HIDDEN, AccountsUI.C.Button.NONE, AccountsUI.C.Button.DROPDOWN, AccountsUI.C.Button.BUBBLE |
|      |            | AccountsUI.C.Render.MODAL, AccountsUI.C.Render.DIV |
|      | 2023- 1-23 | done in v0.90.1 |
|   11 | 2023- 1-21 | rename password.min_length configuration to passwordLength |
|      | 2023- 1-23 | done in v0.90.1 |
|   12 | 2023- 1-21 | have passwordStrength configuration |
|      | 2023- 1-23 | done in v0.90.1 |
|   15 | 2023- 1-21 | make sure we provide a full replacement for accounts-ui (see enrollment ?) |
|      | 2023- 1-23 | cancelled as duplicate of #14 |
|   16 | 2023- 1-21 | honor preferredLabel |
|      | 2023- 1-24 | cancelled as parm is removed |
|   18 | 2023- 1-21 | honor loginNonVerified |
|      | 2023- 1-25 | cancelled as useless at the moment |
|   19 | 2023- 1-21 | honor loggedButtonAction (resp. unlogged) in replacement of loggedButtonShown |
|      | 2023- 1-23 | done in v0.90.1 |
|   20 | 2023- 1-21 | when a name is set, set a data-ac-name attribute on the acUserLogin div |
|      | 2023- 9-18 | done |
|   21 | 2023- 1-24 | BUG CSS: when unlogged, the dropdown  button doesn't consider the padding set by the application (height is too small) |
|      | 2023- 1-27 | fixed |
|   22 | 2023- 1-24 | configure a username minimal length |
|      | 2023- 1-24 | done |
|   23 | 2023- 1-24 | configure whether the signup has two password fields (+ prevent copy/paste in these fields) |
|      | 2023- 1-24 | having an eye on the right of the password input field would make two password fields useless |
|      | 2023- 1-25 | eye is ok, but should not prevent these two input fields |
|      | 2023- 1-25 | if this option is confirmed, should apply both to signup and change_pwd and reset_pwd |
|      | 2023- 1-26 | done in v0.90.1 |
|   24 | 2023- 1-25 | BUG data associated to ac-password-data message is received as undefined when length=0 |
|      | 2023- 1-29 | as a work-around has been found, this is very low priority |
|      | 2023- 9-18 | actually this empty message is only received during Blaze initialization - so cancel the todo |
|      | 2023-10-15 | happens that there is nothing to do with Blaze rendering, but with the presence of a 'length' property. See also https://api.jquery.com/trigger/ |
|      |            | so 'length' result property is renamed ac-length |
|   25 | 2023- 1-25 | reset_ask make sure we take an email address |
|      | 2023- 1-26 | done |
|   30 | 2023- 1-26 | send ac-user-resetpwd message from Accounts.onResetPasswordLink() function |
|      | 2023- 1-27 | done in v0.90.1 |
|   31 | 2023- 1-27 | send ac-user-verifymail message from Accounts.onEmailVerificationLink() function |
|      | 2023- 1-27 | done in v0.90.1 |
|   32 | 2023- 1-27 | BUG dropdown button is not reactive |
|      | 2023- 1-27 | fixed in v0.90.1 |
|   33 | 2023- 1-27 | before first publication, get rid of local pwi:tolert dependancy |
|      | 2023- 1-27 | done, replacing with (published) pwix:tolert |
|   34 | 2023- 1-27 | before first publication, get rid of local pwi:string-prototype dependancy |
|      | 2023- 1-27 | done in v0.90.1 |
|   35 | 2023- 1-27 | before first publication, get rid of local pwi:layout dependancy |
|      | 2023- 1-28 | done, replacing with (published) pwix-layout |
|   36 | 2023- 1-27 | before first publication, get rid of local pwi:i18n dependancy |
|      | 2023- 1-28 | done, replacing with (published) pwix-i18n |
|   37 | 2023- 1-27 | before first publication, get rid of local pwi:bootbox dependancy |
|      | 2023- 1-28 | done, replacing with (published) pwix-bootbox |
|   38 | 2023- 1-27 | review acSelect: do not use Promise in helpers |
|      | 2023- 1-29 | done |
|   39 | 2023- 1-31 | WARN email-validator not detected by checkNpmversions |
|      | 2023- 6-12 | fixed |
|   40 | 2023- 1-31 | WARN zxcvbn not detected by checkNpmversions |
|      | 2023- 6-12 | fixed |
|   41 | 2023- 2-11 | AccountsUI.isEmailVerified() assert that the function is relevant and at is right place |
|      | 2023- 2-19 | obsoleted by #44 |
|   42 | 2023- 2-11 | AccountsUI.dropdownItems() assert that the function is relevant and at is right place |
|      | 2023- 2-20 | Yes, as this method is published |
|   43 | 2023- 2-15 | update documentation with new event names |
|      | 2023- 2-15 | done |
|   44 | 2023- 2-18 | obsolete isEmailVerified() function, has been duplicated in pwix:accounts-ui-tools |
|      | 2023- 2-20 | done |
|   45 | 2023- 2-19 | obsolete the interfaces and come back to the good old system of DOM components - see rationale in maintainer/Interfaces.md |
|      | 2023- 2-20 | done |
|   46 | 2023- 2-19 | rename AC_I18N to I18N |
|      | 2023- 6-12 | done |
|   47 | 2023- 6- 9 | upgrade bootbox to 1.3.0 (use onVerifiedEmailCb) |
|      | 2023- 6- 9 | done |
|   48 | 2023- 6- 9 | upgrade options to 1.4.0 (use onVerifiedEmailCb) |
|      | 2023- 6- 9 | done |
|   49 | 2023- 6-12 | let another package add a translation to this one - this requires at least exporting the i18n namespace |
|      | 2023- 6-12 | done |
|   50 | 2023- 6-22 | have an automated way to associates a div (resp. a modal) to its acUserLogin or a data-ac attribute |
|      | 2023- 9-18 | done e.g. in event manager to associate the 'Enter' key with a acComponent and its acCompanion |
|   51 | 2023- 6-22 | default acUserLogin dropdown is not styled as a button but should |
|      | 2023- 6-22 | this is a acUserLogin configuration option (not a bug, but a feature) |
|   52 | 2023- 6-22 | default acUserLogin display a signup modal at start! (maybe because of pwiSAA?) |
|      | 2023- 6-22 | fixed |
|   53 | 2023- 6-22 | dropdown items are badly aligned |
|      | 2023- 6-26 | fixed |
|   54 | 2023- 6-22 | dropdown items are not reactive to the language |
|      | 2023- 6-23 | fixed |
|   55 | 2023- 7- 5 | Fix save/restore() |
|      | 2023- 9-18 | These functions are removed as of v 1.4.0-rc |
|   56 | 2023- 7- 5 | Fix clearPanel() |
|      | 2023- 9-18 | implemented in input panels |
|   57 | 2023- 9- 9 | Have a function to be called instead of OnEmailverified() |
|      | 2023- 9-18 | done |
|   58 | 2023- 9- 9 | Have a function to be called after OnEmailverified() |
|      | 2023- 9-18 | done |
|   59 | 2023- 9- 9 | buttons labels should be set as nowrap |
|      | 2023- 9-18 | done |
|   60 | 2023- 9- 9 | with Meteor 2.13, packages constants no more default to be imported by the application => must move them to pwixI18n.C |
|      | 2023- 9-18 | done |
|   61 | 2023- 9- 9 | provide additional classes for modal-content, modal-header, modal-body and modal-footer |
|      | 2023- 9-17 | the feature is available starting with pwix:modal 1.8.0 |
|   62 | 2023- 9- 9 | change title of the modals |
|      | 2023- 9-12 | cancelled as duplicate of #64 |
|   64 | 2023- 9-12 | todo: handle ac-title message - for now, is only used to set a rv var, itself unsused |
|      | 2023-10-14 | event is removed |
|   66 | 2023- 9-12 | feat: honor onEmailverifiedXxxx parms |
|      | 2023- 9-18 | done |
|   68 | 2023- 9-12 | disable submit button on modals (and divs) when the panels is not ok |
|      | 2023- 9-17 | was a bug from code refactoring! fixed |
|   69 | 2023- 9-17 | signup panel doesn't get the focus |
|      | 2023- 9-17 | fixed |

---
P. Wieser
- Last updated on 2023, Oct. 11th
