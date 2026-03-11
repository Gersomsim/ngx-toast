import { Component, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TestNgxConfirm } from '../../test-ngx-confirm/test-ngx-confirm';
import { CodeBlock } from '../../ui/code-block';
import { PropRow, PropsTable } from '../../ui/props-table';

@Component({
  selector: 'app-confirm-page',
  imports: [CodeBlock, PropsTable, RouterLink, TestNgxConfirm],
  templateUrl: './confirm-page.html',
  styleUrl: './confirm-page.css',
})
export class ConfirmPage implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  ngOnInit() {
    this.titleService.setTitle('Confirmation Dialogs API - ngx-notify');
    this.metaService.updateTag({ name: 'description', content: 'Easily prompt users to confirm or cancel important actions in Angular with ngx-notify confirmation dialogs.' });
    this.metaService.updateTag({ name: 'keywords', content: 'angular confirm dialog, ngx-notify confirm, confirmation modal, angular UI' });
    this.addRssLink();
  }

  private addRssLink() {
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('type', 'application/rss+xml');
    link.setAttribute('title', 'ngx-notify Confirm RSS Feed');
    link.setAttribute('href', '/rss.xml');
    this.document.head.appendChild(link);
  }

  // ── Code examples ─────────────────────────────────────────

  staticCode = `import { NgxNotify } from '@gersomsim/ngx-notify';

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
});`;

  serviceCode = `import { Component, inject } from '@angular/core';
import { NgxConfirmService, ConfirmEvent } from '@gersomsim/ngx-notify';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: \`<button (click)="reset()">Reset settings</button>\`,
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
      callback: (event: ConfirmEvent) => {
        if (event.confirm) this.resetSettings();
      },
    });
  }

  private resetSettings() { /* ... */ }
}`;

  callbackCode = `NgxNotify.confirm({
  title: 'Logout',
  message: 'You will be signed out of all devices.',
  icon: 'warning',
  showConfirmButton: true,
  showCancelButton: true,
  callback: (event) => {
    if (event.confirm) handleConfirm();
    if (event.cancel)  handleCancel();
    if (event.close)   handleClose();

    // event.type: 'confirm' | 'cancel' | 'close' | 'backdropClick'
    console.log(event.type);
  },
});`;

  timerCode = `// When no buttons are shown, the dialog auto-closes after timer ms
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
});`;

  backdropCode = `NgxNotify.confirm({
  title: 'Unsaved changes',
  message: 'Close without saving?',
  icon: 'warning',
  closeBackdropClick: true,
  showConfirmButton: true,
  showCancelButton: true,
  callback: (event) => {
    // event.type === 'backdropClick' when user clicks outside
    console.log(event.type);
  },
});`;

  // ── API tables ────────────────────────────────────────────

  configRows: PropRow[] = [
    {
      name: 'title',
      type: 'string',
      description: 'Heading displayed at the top of the dialog.',
    },
    {
      name: 'message',
      type: 'string',
      description: 'Body text shown below the title.',
    },
    {
      name: 'icon',
      type: `'success' | 'error' | 'warning' | 'info'`,
      default: `'info'`,
      description: 'Sets the icon and accent color of the dialog.',
    },
    {
      name: 'showConfirmButton',
      type: 'boolean',
      default: 'true',
      description: 'Show or hide the primary action button.',
    },
    {
      name: 'confirmText',
      type: 'string',
      default: `'Confirm'`,
      description: 'Label for the confirm button.',
    },
    {
      name: 'showCancelButton',
      type: 'boolean',
      default: 'false',
      description: 'Show or hide the secondary cancel button.',
    },
    {
      name: 'cancelText',
      type: 'string',
      default: `'Cancel'`,
      description: 'Label for the cancel button.',
    },
    {
      name: 'callback',
      type: '(event: ConfirmEvent) => void',
      description: 'Function called when the dialog is closed by any means.',
    },
    {
      name: 'timer',
      type: 'number',
      description: 'Auto-dismiss after N milliseconds. Active when both buttons are hidden.',
    },
    {
      name: 'showTimerProgressBar',
      type: 'boolean',
      default: 'false',
      description: 'Display a countdown progress bar when timer is set.',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      description: 'Show a close (×) button in the top-right corner of the dialog.',
    },
    {
      name: 'closeBackdropClick',
      type: 'boolean',
      default: 'false',
      description: 'Allow dismissing the dialog by clicking the backdrop overlay.',
    },
  ];

  eventTypes = [
    { value: 'confirm',       desc: 'User clicked the confirm (primary action) button.' },
    { value: 'cancel',        desc: 'User clicked the cancel (secondary) button.' },
    { value: 'close',         desc: 'Dialog closed via the × button or auto-dismiss timer.' },
    { value: 'backdropClick', desc: 'User clicked the backdrop when closeBackdropClick is true.' },
  ];

  eventRows: PropRow[] = [
    {
      name: 'type',
      type: `'confirm' | 'cancel' | 'close' | 'backdropClick'`,
      required: true,
      description: 'Identifies which action triggered the callback.',
    },
    {
      name: 'confirm',
      type: 'boolean',
      required: true,
      description: 'True when the user clicked the confirm button.',
    },
    {
      name: 'cancel',
      type: 'boolean',
      required: true,
      description: 'True when the user clicked the cancel button.',
    },
    {
      name: 'close',
      type: 'boolean',
      required: true,
      description: 'True when the dialog was closed via the × button or auto-timer.',
    },
  ];

}
