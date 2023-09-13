# pwix:accounts-ui - maintainer/Architecture

## Use cases

- Most probably, the application at least implements one `acUserLogin` template. This is the user view of the login system.

    Even if this `acUserLogin` template is not shown, and its items are merged into an application menu, then the template is still present in the DOM and can receive events.

- If the application wants CRUD operations on the user accounts, it will need at least one another `acUserLogin` template, with different parameters.

    All we have to check here is that several `acUserLogin` templates can be managed together while keeping each one their personality.

- The login system also have some features triggered from the top-level, completely outside of the `acUserLogin` flow. Two use cases are known:

    - reset password
    - email verification.

    Two options coexist here:

    - either create an hidden element, which will act as an event receiver
    - or wait for the events reach the `body` top target.

    I do not see at the moment any pro/con which may lead to a relevant and argumented design decision.

    Say we attach an event listener to the body, just to not have to design a ghost element, which in all cases should itself be attached to the `body` as we do not have any DOM element whose we are sure it is always present...

- `acUserLogin` can be displayed inside a `<div>...</div>` of the application, or as a modal dialog. In this later case, events trigerred by the modal are only handleable at the `<body>` level.

## Events management

Because we manage modal dialogs, we have a generic event handler bound to the `<body>` of the document: see `AccountsUI.Event` object.

From `acUserLogin` point of view, all known `ac-` events are forwarded to `AccountsUI.Event`.

## acUserLogin template

A standard - even if very dynamic - Blaze template.

As any Blaze template, it acts as the event receiver for all dialogs it can want run.

In the detail:

- when the user selects a dropdown item, a panel transition occurs

- if the display is free, the panel is rendered
    - either a `<div>...</div>` in the DOM
    - or as a modal.

- if rendered as a DOM div, then the panel is the natural event receiver

- if rendered as a modal, then the panel set itself as the `pwix:modal` target

- this is so the panel which triggers the '`ac-xxxx`' events to the `acUserLogin` template.

The `acUserLogin` template is associated to the `acCompanion` and `acCompanionOptions` classes which take care of of the global interactions with the template.

## Display manager

This is a singleton class which make sure that the display is allocated to a single requester.

Requesters may be:

- either one of the several `acUserLogin` instanciated templates

    These templates are identified by a random identifier allocated at run time.

- or one of the out-of-flow functions

    These functions are identified as '`ANONYMOUS`': only one at the time may request the display.

As a consequence, the display manager must be informed, by releasing it, when a panel is closed.

## Event manager

Events are of three sort:

- events sent by the application to the `acUserLogin` component, as a way to interact with it

- events sent as a result of the selection of an `ac_menu_items` item

- events sent when the user triggers an outside-of-the-flow feature as reset his password or verify his email

- events sent by `acUserLogin` either to inform the application or to manage its own workflow.

---
P. Wieser
- Last updated on 2023, Feb. 19th.
