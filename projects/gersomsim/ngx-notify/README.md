# @gersomsim/ngx-notify

Lightweight Angular library for **toast notifications** and **confirmation dialogs**. Fully typed, standalone-first, zero extra CSS imports.

[![npm](https://img.shields.io/npm/v/@gersomsim/ngx-notify)](https://www.npmjs.com/package/@gersomsim/ngx-notify)
[![GitHub](https://img.shields.io/badge/GitHub-repo-181717?logo=github)](https://github.com/Gersomsim/ngx-toast)
[![Angular](https://img.shields.io/badge/Angular-21+-DD0031?logo=angular)](https://angular.dev)

---

## Installation

```bash
npm install @gersomsim/ngx-notify
```

---

## Setup

Register the provider once in your `app.config.ts`. No modules needed.

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
        animation: 'slide',
        closeButton: true,
      },
    }),
  ],
};
```

Configuration is optional — sensible defaults are applied automatically.

---

## Toast Notifications

### Shorthand methods

```ts
import { NgxNotify } from '@gersomsim/ngx-notify';

NgxNotify.success('Operation completed!');
NgxNotify.error('Something went wrong.');
NgxNotify.warning('Please review your input.');
NgxNotify.info('New update available.');
```

### Full configuration

```ts
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

### Per-call overrides

Pass a partial config as a second argument to any shorthand method:

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

@Component({ selector: 'app-root', standalone: true, template: '' })
export class AppComponent {
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

---

## Confirmation Dialogs

### Static facade

```ts
import { NgxNotify } from '@gersomsim/ngx-notify';

NgxNotify.confirm({
  title: 'Delete item',
  message: 'This action cannot be undone.',
  icon: 'error',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  showConfirmButton: true,
  showCancelButton: true,
  callback: (event) => {
    if (event.confirm) deleteItem();
    if (event.cancel)  console.log('cancelled');
  },
});
```

### Injectable service

```ts
import { Component, inject } from '@angular/core';
import { NgxConfirmService, NgxNotifyConfirmEvent } from '@gersomsim/ngx-notify';

@Component({ selector: 'app-settings', standalone: true, template: '' })
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

### Auto-dismiss timer

When both buttons are hidden the dialog acts as an alert and auto-closes after `timer` ms.

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

---

## API Reference

### `NgxNotifyToastConfig`

| Property | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | required | Main body text. |
| `type` | `NgxNotifyType` | required | Visual style: `'success'` \| `'error'` \| `'warning'` \| `'info'`. |
| `title` | `string` | — | Optional heading above the message. |
| `position` | `NgxNotifyPositionType` | `'top-right'` | Screen position. |
| `duration` | `number` | `3000` | Milliseconds before auto-dismiss. |
| `animation` | `NgxNotifyAnimationType` | `'slide'` | Entry/exit animation. |
| `icon` | `boolean` | `true` | Show the type icon. |
| `closeButton` | `boolean` | `true` | Show a manual close (×) button. |
| `onClose` | `() => void` | — | Callback fired on dismiss. |

### `ConfirmConfig`

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Heading at the top of the dialog. |
| `message` | `string` | — | Body text below the title. |
| `icon` | `NgxNotifyType` | `'warning'` | Icon and accent color. |
| `showConfirmButton` | `boolean` | `true` | Show the primary action button. |
| `confirmText` | `string` | `'Confirm'` | Label for the confirm button. |
| `showCancelButton` | `boolean` | `true` | Show the cancel button. |
| `cancelText` | `string` | `'Cancel'` | Label for the cancel button. |
| `callback` | `(event: NgxNotifyConfirmEvent) => void` | — | Called when the dialog is closed by any means. |
| `timer` | `number` | — | Auto-dismiss after N ms. Requires both buttons hidden. |
| `showTimerProgressBar` | `boolean` | `false` | Countdown bar when timer is active. |
| `showCloseButton` | `boolean` | — | Close (×) button in the top-right corner. |
| `closeBackdropClick` | `boolean` | `false` | Dismiss by clicking the backdrop. |

### `NgxNotifyConfirmEvent`

| Property | Type | Description |
|---|---|---|
| `type` | `NgxNotifyConfirmEventType` | `'confirm'` \| `'cancel'` \| `'close'` \| `'backdropClick'` |
| `confirm` | `boolean` | User clicked the confirm button. |
| `cancel` | `boolean` | User clicked the cancel button. |
| `close` | `boolean` | Dialog closed via × or auto-timer. |

### `NgxNotifyConfig` (global)

| Property | Type | Default | Description |
|---|---|---|---|
| `timer` | `number` | `3000` | Default auto-dismiss duration (ms). |
| `toast` | `object` | `{}` | Default toast options (`position`, `animation`, `closeButton`, `icon`). |
| `confirmBtnColor` | `string` | `'#111827'` | Confirm button background. |
| `confirmBtnTextColor` | `string` | `'#ffffff'` | Confirm button text color. |
| `cancelBtnColor` | `string` | `'transparent'` | Cancel button background. |
| `cancelBtnTextColor` | `string` | `'#374151'` | Cancel button text color. |
| `successColor` | `string` | `'#22c55e'` | Success accent color. |
| `errorColor` | `string` | `'#ef4444'` | Error accent color. |
| `warningColor` | `string` | `'#f59e0b'` | Warning accent color. |
| `infoColor` | `string` | `'#0ea5e9'` | Info accent color. |
| `mainBgColor` | `string` | `'#fff'` | Notification background. |
| `mainTextColor` | `string` | `'#40444d'` | Notification text color. |

---

## Types

```ts
type NgxNotifyType             = 'success' | 'error' | 'warning' | 'info';
type NgxNotifyAnimationType    = 'fade' | 'slide' | 'zoom' | 'none';
type NgxNotifyConfirmEventType = 'confirm' | 'cancel' | 'close' | 'backdropClick';
type NgxNotifyPositionType     =
  | 'top-left'    | 'top-center'    | 'top-right'
  | 'center-left' | 'center'        | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';
```

---

## Requirements

- Angular **21** or higher
- Standalone application (recommended)

---

## Links

- [GitHub](https://github.com/Gersomsim/ngx-toast)
- [npm](https://www.npmjs.com/package/@gersomsim/ngx-notify)
- Docs — _coming soon_

---

## License

MIT
