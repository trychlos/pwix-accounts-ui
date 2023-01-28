# Accounts - TODO

## Summary

1. [Todo](#todo)
2. [Done](#done)

---
## Todo

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    1 | 2023- 1-20 | be able to define a specific format for a form in some situations |
|      |            | use case: have a specific form when defining the first account of an application |
|      | 2023- 1-21 | rather build each panel dynamically from configuration options |
|      | 2023- 1-25 | or not !?? |
|    2 | 2023- 1-20 | provides a button with a configurable label 'login with Zimbra' |
|    3 | 2023- 1-20 | provides a button to connect to the future chosen identity manager |
|    8 | 2023- 1-21 | develop a small SPA application to provide tests for the package |
|   13 | 2023- 1-21 | be able to handle all Meteor Accounts configuration |
|   14 | 2023- 1-21 | provide enrollment (see for example accounts-ui) |
|   20 | 2023- 1-21 | when a name is set, set a data-ac-name attribute on the acUserLogin div |
|   24 | 2023- 1-25 | BUG data associated to ac-password-data message is received as undefined when length=0 |
|   26 | 2023- 1-25 | let the user change his email address |
|   27 | 2023- 1-25 | let the user change his username |
|   28 | 2023- 1-25 | have a profile dialog with all change options |
|   29 | 2023- 1-26 | manage several email addresses per user |
|      | 2023- 1-27 | even if the package itself should be capable, this is actually an application decision to manage that |
|   36 | 2023- 1-27 | before first publication, get rid of local pwix:i18n dependancy |
|   37 | 2023- 1-27 | before first publication, get rid of local pwix:bootbox dependancy |
|   38 | 2023- 1-27 | review acSelect: do not use Promise in helpers |
|   39 |  |  |

---
## Done

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
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
|      |            | AC_PWD_VERYWEAK, AC_PWD_WEAK, AC_PWD_MEDIUM, AC_PWD_STRONG, AC_PWD_VERYSTRONG |
|      |            | AC_FLD_NO, AC_FLD_OPTIONAL, AC_FLD_MANDATORY |
|      |            | AC_DISP_ID, AC_DISP_EMAIL, AC_DISP_USERNAME |
|      |            | AC_ACT_HIDDEN, AC_ACT_NONE, AC_ACT_DROPDOWN, AC_ACT_BUBBLE |
|      |            | AC_RENDER_MODAL, AC_RENDER_DIV |
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
|   21 | 2023- 1-24 | BUG CSS: when unlogged, the dropdown  button doesn't consider the padding set by the application (height is too small) |
|      | 2023- 1-27 | fixed |
|   22 | 2023- 1-24 | configure a username minimal length |
|      | 2023- 1-24 | done |
|   23 | 2023- 1-24 | configure whether the signup has two password fields (+ prevent copy/paste in these fields) |
|      | 2023- 1-24 | having an eye on the right of the password input field would make two password fields useless |
|      | 2023- 1-25 | eye is ok, but should not prevent these two input fields |
|      | 2023- 1-25 | if this option is confirmed, should apply both to signup and change_pwd and reset_pwd |
|      | 2023- 1-26 | done in v0.90.1 |
|   25 | 2023- 1-25 | reset_ask make sure we take an email address |
|      | 2023- 1-26 | done |
|   30 | 2023- 1-26 | send ac-user-resetpwd message from Accounts.onResetPasswordLink() function |
|      | 2023- 1-27 | done in v0.90.1 |
|   31 | 2023- 1-27 | send ac-user-verifymail message from Accounts.onEmailVerificationLink() function |
|      | 2023- 1-27 | done in v0.90.1 |
|   32 | 2023- 1-27 | BUG dropdown button is not reactive |
|      | 2023- 1-27 | fixed in v0.90.1 |
|   33 | 2023- 1-27 | before first publication, get rid of local pwi:tolert dependancy |
|      | 2023- 1-27 | done, replacing with pwix:tolert |
|   34 | 2023- 1-27 | before first publication, get rid of local pwi:string-prototype dependancy |
|      | 2023- 1-27 | done in v0.90.1 |
|   35 | 2023- 1-27 | before first publication, get rid of local pwi:layout dependancy |
|      | 2023- 1-28 | done, replacing with pwix-layout |

---
P. Wieser
- Created on 2023, Jan. 18th
- Last updated on 2023, Jan. 26th
