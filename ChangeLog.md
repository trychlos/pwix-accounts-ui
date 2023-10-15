# pwix:accounts-ui

## ChangeLog

### 1.5.0-rc

    Release date: 

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
- Last updated on 2023, Oct. 11th
