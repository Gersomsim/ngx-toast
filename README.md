# @gersomsim/ngx-notify

A lightweight Angular library for toast notifications and confirmation dialogs. Fully typed with TypeScript, designed for modern standalone applications.

[![npm](https://img.shields.io/npm/v/@gersomsim/ngx-notify)](https://www.npmjs.com/package/@gersomsim/ngx-notify)
[![Docs](https://img.shields.io/badge/Docs-ngx--toast.vercel.app-black)](https://ngx-toast.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-repo-181717?logo=github)](https://github.com/Gersomsim/ngx-toast)

---

## Features

- **Toast Notifications** — display lightweight messages to provide quick feedback
- **Confirmation Dialogs** — prompt users to confirm or cancel important actions
- **Standalone First** — designed for modern Angular applications using standalone providers
- **Fully Typed** — strong TypeScript types for all configurations and events
- **Predefined Types** — built-in support for `success`, `error`, `warning`, and `info`
- **Flexible Injection** — use the static facade or inject services directly

---

## Requirements

- Angular 21 or higher
- TypeScript (included in Angular projects)
- Application configured with standalone APIs (recommended)

---

## Installation

```bash
npm install @gersomsim/ngx-notify
```

The library includes its own styles — no additional CSS imports required.

---

## Setup

Register the library once in your application config using `NgxNotify.provide()`. No modules needed.

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { NgxNotify } from '@gersomsim/ngx-notify';

export const appConfig: ApplicationConfig = {
  providers: [
    NgxNotify.provide({
      timer: 3000,
      toast: {
        position: 'top-right',
        closeButton: true,
        animation: 'slide',
      },
    }),
  ],
};
```

This global config defines the default behavior for all notifications and confirm dialogs across your app. Configuration is optional — if omitted, sensible defaults are used.

---

## Basic Usage

`NgxNotify` can be used in two independent ways:

1. **Static facade** — call `NgxNotify` methods directly anywhere in your code
2. **Angular services** — inject `NgxNotifyService` or `NgxConfirmService`

Both approaches work independently. If you use services directly, no global configuration is required.

---

## Toast Notifications

### Static facade

```ts
import { NgxNotify } from '@gersomsim/ngx-notify';

// Shorthand methods
NgxNotify.success('Operation completed!');
NgxNotify.error('Something went wrong.');
NgxNotify.warning('Please review your input.');
NgxNotify.info('New update available.');

// Full configuration
NgxNotify.show({
  message: 'File saved successfully',
  type: 'success',
  title: 'Saved',
  position: 'top-right',
  duration: 4000,
  animation: 'slide',
  icon: true,
  closeButton: true,
  onClose: () => console.log('closed'),
});
```

Shorthand methods also accept a partial `NgxNotifyToastConfig` as a second argument to override specific options per call:

```ts
NgxNotify.error('Upload failed', {
  duration: 5000,
  position: 'top-center',
  animation: 'zoom',
});
```

### Position-specific methods

```ts
NgxNotify.successAt('Saved!',   'bottom-right');
NgxNotify.errorAt('Failed!',    'top-center');
NgxNotify.warningAt('Careful!', 'center');
NgxNotify.infoAt('Note',        'bottom-left');
```

### Dismiss all

```ts
NgxNotify.closeAll();
```

### Injectable service

```ts
import { Component, inject } from '@angular/core';
import { NgxNotifyService } from '@gersomsim/ngx-notify';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<button (click)="save()">Save</button>`,
})
export class DashboardComponent {
  private notify = inject(NgxNotifyService);

  save() {
    this.notify.show({
      message: 'Changes saved',
      type: 'success',
      position: 'bottom-right',
    });
  }
}
```

### `NgxNotifyToastConfig`

| Property | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | required | Main body text of the notification. |
| `type` | `NgxNotifyType` | required | Visual style and default icon. |
| `title` | `string` | — | Optional heading above the message. |
| `position` | `NgxNotifyPositionType` | `'top-right'` | Where the toast appears on screen. |
| `duration` | `number` | `3000` | Milliseconds before auto-dismiss. |
| `animation` | `NgxNotifyAnimationType` | `'fade'` | Entry and exit animation. |
| `icon` | `boolean` | `true` | Show or hide the type icon. |
| `closeButton` | `boolean` | `true` | Display a manual close (×) button. |
| `onClose` | `() => void` | — | Callback fired when the notification is dismissed. |

---

## Confirmation Dialogs

### Static facade

```ts
import { NgxNotify } from '@gersomsim/ngx-notify';

NgxNotify.confirm({
  title: 'Delete item',
  message: 'This action cannot be undone. Are you sure?',
  icon: 'error',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  showConfirmButton: true,
  showCancelButton: true,
  callback: (event) => {
    if (event.confirm) deleteItem();
  },
});
```

### Injectable service

```ts
import { Component, inject } from '@angular/core';
import { NgxConfirmService, NgxNotifyConfirmEvent } from '@gersomsim/ngx-notify';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `<button (click)="reset()">Reset settings</button>`,
})
export class SettingsComponent {
  private confirm = inject(NgxConfirmService);

  reset() {
    this.confirm.show({
      title: 'Reset settings',
      message: 'All preferences will be restored to defaults.',
      icon: 'warning',
      confirmText: 'Reset',
      showCancelButton: true,
      callback: (event: NgxNotifyConfirmEvent) => {
        if (event.confirm) this.resetSettings();
      },
    });
  }

  private resetSettings() { /* ... */ }
}
```

### Handling the callback

The `callback` receives a `NgxNotifyConfirmEvent` object regardless of how the dialog was dismissed.

```ts
NgxNotify.confirm({
  title: 'Logout',
  message: 'You will be signed out of all devices.',
  showConfirmButton: true,
  showCancelButton: true,
  callback: (event) => {
    if (event.confirm) handleConfirm();
    if (event.cancel)  handleCancel();
    if (event.close)   handleClose();

    // event.type: 'confirm' | 'cancel' | 'close' | 'backdropClick'
    console.log(event.type);
  },
});
```

### Auto-dismiss timer

When both buttons are hidden, the dialog acts as an alert and auto-closes after `timer` ms.

```ts
NgxNotify.confirm({
  title: 'Session expired',
  message: 'You will be redirected in 5 seconds.',
  icon: 'warning',
  showConfirmButton: false,
  showCancelButton: false,
  timer: 5000,
  showTimerProgressBar: true,
  callback: (event) => {
    if (event.close) redirect();
  },
});
```

### Backdrop click

```ts
NgxNotify.confirm({
  title: 'Unsaved changes',
  message: 'Close without saving?',
  closeBackdropClick: true,
  showConfirmButton: true,
  showCancelButton: true,
  callback: (event) => {
    // event.type === 'backdropClick' when user clicks outside
    console.log(event.type);
  },
});
```

### `ConfirmConfig`

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Heading displayed at the top of the dialog. |
| `message` | `string` | — | Body text shown below the title. |
| `icon` | `NgxNotifyType` | `'info'` | Sets the icon and accent color of the dialog. |
| `showConfirmButton` | `boolean` | `true` | Show or hide the primary action button. |
| `confirmText` | `string` | `'Confirm'` | Label for the confirm button. |
| `showCancelButton` | `boolean` | `false` | Show or hide the cancel button. |
| `cancelText` | `string` | `'Cancel'` | Label for the cancel button. |
| `callback` | `(event: NgxNotifyConfirmEvent) => void` | — | Called when the dialog is closed by any means. |
| `timer` | `number` | — | Auto-dismiss after N milliseconds. Active when both buttons are hidden. |
| `showTimerProgressBar` | `boolean` | `false` | Display a countdown bar when timer is set. |
| `showCloseButton` | `boolean` | — | Show a close (×) button in the top-right corner. |
| `closeBackdropClick` | `boolean` | `false` | Dismiss by clicking the backdrop overlay. |

### `NgxNotifyConfirmEvent`

| Property | Type | Description |
|---|---|---|
| `type` | `NgxNotifyConfirmEventType` | Which action triggered the callback: `'confirm'` \| `'cancel'` \| `'close'` \| `'backdropClick'`. |
| `confirm` | `boolean` | `true` when the user clicked the confirm button. |
| `cancel` | `boolean` | `true` when the user clicked the cancel button. |
| `close` | `boolean` | `true` when the dialog was closed via the × button or auto-timer. |

---

## Global Configuration

Define a configuration file at the root of your project for consistent behavior across the app.

```ts
// ngx-notify.config.ts
import { NgxNotifyConfig } from '@gersomsim/ngx-notify';

export const ngxNotifyConfig: NgxNotifyConfig = {
  timer: 3000,
  toast: {
    position: 'top-right',
    closeButton: true,
    animation: 'slide',
  },
  confirmBtnColor: '#111827',
};
```

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { NgxNotify } from '@gersomsim/ngx-notify';
import { ngxNotifyConfig } from '../ngx-notify.config';

export const appConfig: ApplicationConfig = {
  providers: [
    NgxNotify.provide(ngxNotifyConfig),
  ],
};
```

### `NgxNotifyConfig`

| Property | Type | Default | Description |
|---|---|---|---|
| `timer` | `number` | `3000` | Default auto-dismiss duration (ms). |
| `toast` | `object` | `{}` | Default options for toast notifications (see below). |
| `confirmBtnColor` | `string` | `'#111827'` | Background color for the confirm button. |
| `confirmBtnTextColor` | `string` | `'#ffffff'` | Text color for the confirm button. |
| `cancelBtnColor` | `string` | `'transparent'` | Background color for the cancel button. |
| `cancelBtnTextColor` | `string` | `'#374151'` | Text color for the cancel button. |
| `successColor` | `string` | `'#22c55e'` | Accent color for success notifications. |
| `errorColor` | `string` | `'#ef4444'` | Accent color for error notifications. |
| `warningColor` | `string` | `'#f59e0b'` | Accent color for warning notifications. |
| `infoColor` | `string` | `'#0ea5e9'` | Accent color for info notifications. |
| `mainBgColor` | `string` | `'#fff'` | Background color for notifications. |
| `mainTextColor` | `string` | `'#40444d'` | Text color for notifications. |

**Toast sub-config (`toast`):**

| Property | Type | Default | Description |
|---|---|---|---|
| `position` | `NgxNotifyPositionType` | `'top-right'` | Default position for toasts. |
| `closeButton` | `boolean` | `false` | Show close button by default. |
| `animation` | `NgxNotifyAnimationType` | `'slide'` | Default entry/exit animation. |
| `icon` | `boolean` | `true` | Show icon by default. |

---

## Type Reference

### `NgxNotifyType`

```ts
type NgxNotifyType = 'success' | 'error' | 'warning' | 'info';
```

### `NgxNotifyPositionType`

```ts
type NgxNotifyPositionType =
  | 'top-left'    | 'top-center'    | 'top-right'
  | 'center-left' | 'center'        | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';
```

### `NgxNotifyAnimationType`

```ts
type NgxNotifyAnimationType = 'fade' | 'slide' | 'zoom' | 'none';
```

### `NgxNotifyConfirmEventType`

```ts
type NgxNotifyConfirmEventType = 'confirm' | 'cancel' | 'close' | 'backdropClick';
```
