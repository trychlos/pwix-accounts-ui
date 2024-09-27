# pwix:accounts-ui

## ChangeLog

### 2.0.0-rc

    Release date: 

    - Replace pwix-accounts-conf and pwix-accounts-tools dependencies with pwix:accounts-hub, thus bumping major candidate version number
    - Define new 'withExternalMessager' acUserLogin data context parameter
    - Define new internal ac_error_msg Blaze component
    - Check functions are moved to pwix:accounts-hub package
    - Move 'informWrongEmail' and 'sendVerificationEmail' configuration parameters to AccountsHub.ahClass

### 1.8.0

    Release date: 2024- 9-20

    - Accept aldeed:simple-schema v2.0.0, thus bumping minor candidate version number

### 1.7.0

    Release date: 2024- 9-13

    - AccountsUI.Features.createUser() now accepts a 'name' parameter instead of target and options, bumping minor candidate version number
    - Use pwix:accounts-conf package to configure haveEmailAddress and haveUsername parameters
    - Minor typos fixes on the messages

### 1.6.3

    Release date: 2024- 6-25

    - Update README
    - Send ac-signup-ok event on each change when creating a new account (todo #76)

### 1.6.2

    Release date: 2024- 6- 8

    - Re-add breakpoints constants from pwix:ui-layout

### 1.6.1

    Release date: 2024- 6- 8

    - Remove obsoleted pwix:layout stylesheet (the new ui-layout one being automatically loaded)
    - Upgrade pwix:modal dependency

### 1.6.0

    Release date: 2024- 6- 8

    - Makes use of pwix:accounts-tools
    - Define new signupClearPanel parameter (thus bumping candidate release number)
    - DIV-rendered panels now are able to automatically set the focus on the first input field (todo #74)
    - Remove obsolete callPromise() calls
    - Replace obsolete pwix:layout v1 dependency with pwix:ui-layout v2
    - Decrease the required accounts-tools dependency to be able to publish

### 1.5.0

    Release date: 2024- 5-25

    - Publish acMandatoryField component (bumping candidate version number)
    - Publish acMandatoryFooter component
    - Define new haveOKButton acUserLogin configuration parameter
    - Fix ac-signup panel check
    - Define new ac-signup-ok event
    - Fix verification email sending twice when autoConnect is true
    - Simplify code removing acManager, acCompanion, acDisplay classes
    - Improve error display so that the panels are stable
    - Rename supported languages so that it is clearer they can act as fallbacks too
    - Review and (hopefully) fix the acUserLogin configuration options
    - Define 'signupTextFive' acUserLogin option
    - Define 'signinFieldset' and 'signupFieldset' acUserLogin options
    - Review fieldset style
    - Define 'signupHaveEmailAddress' and 'signupHaveUsername' acUserLogin options
    - ac_input_username: fix display when fieldset if false
    - ac_signup: fix tests for username and email address
    - ac_signup: display the mandatory indicators depending of the required mandatory fields
    - checkPassword(): doesn't let the caller believe the password is ok when it is empty
    - checkUsername(): honors testLength and testExistance options
    - Improve the data content of ac-signup-ok event
    - Define new signupSubmit acUserLogin configuration parameter
    - Modal options passed to acUserLogin are also passed to modal rendering component
    - Fix and improve signup panel stylesheet
    - Add errFn() and successFn callback function to createUser() options
    - Get rid of deanius:promise dependency
    - Replace simpl-schema NPM dependency with aldeed:simple-schema meteor package
    - Meteor 3.0 ready

### 1.4.0

    Release date: 2023-10-11

    - Upgrade pwix:options requirement to 2.1.0
    - Deep code refactoring and configuration parameters evolution (bumping candidate version number)
    - Remove AccountsUI.preferredLabel() method, moved to pwix:accounts-tools
    - Make sure old and new passwords are different when changing a password
    - Have a 'data-ac-name' attribute on acUserLogin (todo #20)
    - Remove save() and restore() methods (obsoleting todo #55)
    - Implement clearPanel() function (todo #56)
    - Replace all exported constants with the AccountsUI.C object (todo #60)
    - Release the display when acUserLogin is destroyed

### 1.3.0

    Release date: 2023- 9- 4

    - Upgrade pwix:layout version requirement to get layout.less constants
    - Define mandatoryFieldsBorder both as a configuration option and a acUserLogin option (bumping candidate version number)
    - Validate the user account structure before creation on server side
    - Remove one success message on user creation, to keep stuck with only one
    - Introduce new AccountsUI.preferredLabel() method and corresponding preferredLabel configuration option
    - Upgrade pwix:modal version requirement to get Modal export
    - Upgrade pwix:bootbox version requirement to get Bootbox export
    - Define save() and restore() methods
    - Define clearPanel() method
    - Upgrade pwix:options requirement to v 2.0.0
    - Define new AccountsUI.C.Verbose.HANDLED verbosity level
    - Make sure we only close modals we have ourselves opened (fix pwix:cookie-manager#26)

### 1.2.5

    Release date: 2023- 7- 1

    - Fix mispelled 'loadash' as 'lodash'
    - Make sure a modal is rendered when the requester is its companion (todo #52)
    - Now accepts signin and signup fieldset legends
    - Dropdown items are now reactive to the language changes (todo #54)
    - Make the dropdown items aligned independently of the application stylesheet (todo #53)

### 1.2.4

    Release date: 2023- 7- 1

    Publication error.

### 1.2.3

    Release date: 2023- 7- 1

    Publication error.

### 1.2.2

    Release date: 2023- 6-21

    - Provide new AccountsUI.i18n.namespace() method to let anyone improve the i18n translations (todo #49)
    - Add screenshots to the documentation
    - Remove unused AccountsUI.C.Verbose.PANEL_HANDLE constant
    - Consolidate AccountsUI.C.Verbose.SUBMIT_HANDLE and AccountsUI.C.Verbose.SUBMIT_TRIGGER constants into AccountsUI.C.Verbose.SUBMIT
    - Consolidate AccountsUI.C.Verbose.USER_HANDLE and AccountsUI.C.Verbose.USER_TRIGGER constants into AccountsUI.C.Verbose.USER
    - Add lodash dependency
    - configure() now acts both as a getter and a setter

### 1.2.1

    Release date: 2023- 6-12

    - Update release date

### 1.2.0

    Release date: 2023- 6-12

    - AccountsUI: add new 'onVerifiedEmailBox' configuration parameter
    - AccountsUI: add new 'onVerifiedEmailTitle' configuration parameter
    - AccountsUI: add new 'onVerifiedEmailMessage' configuration parameter
    - AccountsUI: add new 'sendVerificationEmail' configuration parameter
    - acUserLogin: add new 'haveCancelButton' configuration parameter

    - Fix 'DIV' render mode
    - Fix mandatory indicator on email address

    - Remove NPM dependencies on @popperjs/Core and bootstrap
    - Bump pwix:i18n dependency to v 1.3.0
    - Bump pwix:layout dependency to v 1.2.0
    - Bump pwix:modal dependency to v 1.5.0
    - Bump pwix:options dependency to v 1.3.0

### 1.1.0

    Release date: 2023- 2-20

    - Get rid of the Interfaces strategy, back to the good old classes (see maintainer/Interfaces.md for the rationale)
    - Remove jQuery-UI dependency, getting tied to Bootstrap at the moment
    - Add a dependency on pwix:modal 1.1.0 (get stackable, draggable and resizable modals)

### 1.0.0

    Release date: 2023- 1-27

    - Initial release

---
P. Wieser
- Last updated on 2024, Sep. 20th
