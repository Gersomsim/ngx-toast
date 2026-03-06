import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimationType, NgxNotify, NotifyPosition, NotifyType } from '@gersomsim/ngx-notify';
import { TestNgxNotify } from "../../components/test-ngx-notify/test-ngx-notify";
import { CodeBlock } from '../../ui/code-block';
import { PropRow, PropsTable, } from '../../ui/props-table';

@Component({
  selector: 'app-notify-page',
  imports: [CodeBlock, PropsTable, RouterLink, TestNgxNotify],
  templateUrl: './notify-page.html',
  styleUrl: './notify-page.css',
})
export class NotifyPage {

  // ── Code examples ─────────────────────────────────────────

  shorthandCode = `import { NgxNotify } from '@gersomsim/ngx-notify';

NgxNotify.success('Data saved successfully');
NgxNotify.error('Connection failed');
NgxNotify.warning('Session about to expire');
NgxNotify.info('New update available');`;

  showCode = `import { NgxNotify } from '@gersomsim/ngx-notify';

NgxNotify.show({
  message: 'New message received',
  type: 'info',
  title: 'Inbox',
  position: 'top-right',
  duration: 3000,
  icon: true,
  closeButton: true,
  onClose: () => console.log('notification closed'),
});`;

  configOptionsCode = `NgxNotify.error('Upload failed', {
  duration: 5000,
  position: 'top-center',
  animation: 'zoom',
});

NgxNotify.success('Saved!', {
  title: 'Done',
  icon: false,
  closeButton: false,
});`;

  serviceCode = `import { Component, inject } from '@angular/core';
import { NgxNotifyService } from '@gersomsim/ngx-notify';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: \`<button (click)="save()">Save</button>\`,
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
}`;

  positionCode = `// Position-specific shorthand
NgxNotify.successAt('Saved!',   'bottom-right');
NgxNotify.errorAt('Failed!',    'top-center');
NgxNotify.warningAt('Careful!', 'center');
NgxNotify.infoAt('Note',        'bottom-left');`;

  closeAllCode = `// Dismiss all visible notifications
NgxNotify.closeAll();`;

  // ── API table ──────────────────────────────────────────────

  configRows: PropRow[] = [
    {
      name: 'message',
      type: 'string',
      required: true,
      description: 'The main body text of the notification.',
    },
    {
      name: 'type',
      type: `'success' | 'error' | 'warning' | 'info'`,
      required: true,
      description: 'Controls the visual style and default icon of the notification.',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Optional heading displayed above the message.',
    },
    {
      name: 'position',
      type: 'NotifyPosition',
      default: `'top-right'`,
      description: 'Where on the screen the toast appears. See positions reference below.',
    },
    {
      name: 'duration',
      type: 'number',
      default: '3000',
      description: 'Milliseconds before the notification auto-dismisses.',
    },
    {
      name: 'animation',
      type: `'fade' | 'slide' | 'zoom' | 'none'`,
      default: `'fade'`,
      description: 'Entry and exit animation style.',
    },
    {
      name: 'icon',
      type: 'boolean',
      default: 'true',
      description: 'Show or hide the type icon.',
    },
    {
      name: 'closeButton',
      type: 'boolean',
      default: 'true',
      description: 'Display a manual close (×) button.',
    },
    {
      name: 'onClose',
      type: '() => void',
      description: 'Callback fired when the notification is dismissed.',
    },
  ];

  // ── Types reference ────────────────────────────────────────

  positions = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];

  animations = [
    { value: 'fade',  desc: 'Smooth opacity transition.' },
    { value: 'slide', desc: 'Slides in from the edge of the screen. (default)' },
    { value: 'zoom',  desc: 'Scales up from the notification origin.' },
    { value: 'none',  desc: 'No animation — instant appearance.' },
  ];

  showPosition(position: string) {
    const newPosition = position as NotifyPosition
    NgxNotify.success('Toast in position'  , { 
      title: position,
      position: newPosition});
  }

  showAnimation(animation: string) {
    const newAnimation = animation as AnimationType
    NgxNotify.success('Hello Wordl!'  , { 
      animation: newAnimation,
      duration: 5000
    });
  }
  showType(type: string) {
    const typeNotification = type as NotifyType
    NgxNotify.success('Hey there!'  , { 
      type: typeNotification,
      duration: 5000
    });
  }
}
