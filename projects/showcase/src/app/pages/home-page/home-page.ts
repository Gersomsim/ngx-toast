import { Component, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CodeBlock } from '../../ui/code-block';
import { PropRow, PropsTable } from '../../ui/props-table';
import { TerminalBlock, TerminalLine } from '../../ui/terminal-block';

@Component({
  selector: 'app-home-page',
  imports: [CodeBlock, TerminalBlock, RouterLink, PropsTable],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  ngOnInit() {
    this.titleService.setTitle('ngx-notify - Elegant Toast Notifications & Confirmation Dialogs for Angular');
    this.metaService.updateTag({ name: 'description', content: 'A lightweight, standalone-first library for elegant toast messages and confirmation dialogs in modern Angular applications.' });
    this.metaService.updateTag({ name: 'keywords', content: 'angular, toast, notification, ngx-notify, confirmation dialog, standalone, typescript' });
    this.addRssLink();
  }

  private addRssLink() {
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('type', 'application/rss+xml');
    link.setAttribute('title', 'ngx-notify RSS Feed');
    link.setAttribute('href', '/rss.xml');
    this.document.head.appendChild(link);
  }

  features = [
    {
      icon: '🔔',
      title: 'Toast Notifications',
      desc: 'Display lightweight toast messages to provide quick feedback to users.',
    },
    {
      icon: '❓',
      title: 'Confirmation Dialogs',
      desc: 'Easily prompt users to confirm or cancel important actions.',
    },
    {
      icon: '⚡',
      title: 'Standalone First',
      desc: 'Designed for modern Angular applications using standalone providers.',
    },
    {
      icon: '🧠',
      title: 'TypeScript Fully Typed',
      desc: 'Strong typing for configurations and events.',
    },
    {
      icon: '🎯',
      title: 'Predefined Notification Types',
      desc: 'Built-in support for common notification types: [success, error, warning, info]',
    },{
      icon: '🧩',
      title: 'Flexible Injection Options',
      desc: 'Use the service directly in standalone components or services.',
    },
  ];

  requirements = [
    'Angular 21 or higher',
    'TypeScript support (included in Angular projects)',
    'Application configured using standalone APIs (recommended)',
  ];

  installLines: TerminalLine[] = [
    { type: 'command', text: 'npm install @gersomsim/ngx-notify' },
  ];

  setupCode = `import { ApplicationConfig } from '@angular/core';
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
};`;
toastServiceCode = `import { Component, inject } from '@angular/core';
import { NgxNotifyService } from '@gersomsim/ngx-notify';

@Component({
  ...
  providers: [NgxNotifyService],
})
export class MyComponent {
  private notifyService = inject(NgxNotifyService);

  showSuccess() {
    this.notifyService.show({
      message: 'Operation completed!',
      type: 'success',
      icon: true,
      closeButton: true,
    });
  }
}`;
confirmServiceCode = `import { Component, inject } from '@angular/core';
import { NgxConfirmService } from '@gersomsim/ngx-notify';

@Component({
  ...
  providers: [NgxConfirmService],
})
export class MyComponent {
  private confirmService = inject(NgxConfirmService);

  showConfirm() {
    this.confirmService.show({
      title: 'Delete item',
      message: 'Are you sure you want to delete this item?',
      callback: (event: ConfirmEvent) => {
        if (event.confirm) {
          console.log('Item deleted');
        }
  }
});
}`;
  usageFacadeCode = `import { NgxNotify } from '@gersomsim/ngx-notify';

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
  icon: true,
  closeButton: true,
  onClose: () => console.log('closed'),
});


// Confirm dialog
NgxNotify.confirm({
  title: 'Delete item',
  message: 'Are you sure you want to delete this item?',
  callback: (event: ConfirmEvent) => {
    if (event.confirm) {
      console.log('Item deleted');
    }
  },
});
`;
configurationCode = `import { NgxNotifyConfig } from '@gersomsim/ngx-notify';

export const ngxNotifyConfig: NgxNotifyConfig = {
    timer: 3000,
    toast: {
        position: 'top-right',
        closeButton: true,
        animation: 'slide',
    },
    confirmBtnColor: '#28a745',
    
}
`;
appConfigCode = `import { ApplicationConfig } from '@angular/core';
import { NgxNotify } from '@gersomsim/ngx-notify';
import { ngxNotifyConfig } from '../ngx-notify.config';

export const appConfig: ApplicationConfig = {
  providers: [
    NgxNotify.provide(ngxNotifyConfig) // <--- Register the configuration optional
  ]
};`;

configRows: PropRow[] = [
  {
    name: 'timer',
    type: 'number',
    default: '3000',
    description: 'Milliseconds before the notification auto-dismisses.',
  },
  {
    name: 'toast',
    type: 'ToastConfig',
    default: '{}',
    description: 'Configuration for the toast notifications.',
  },
  {
    name: 'confirmBtnColor',
    type: 'string',
    default: '#111827',
    description: 'Color for the confirm button in the confirm dialog.',
  },
  {
    name: 'confirmBtnTextColor',
    type: 'string',
    default: '#ffffff',
    description: 'Text color for the confirm button in the confirm dialog.',
  },
  {
    name: 'cancelBtnColor',
    type: 'string',
    default: 'transparent',
    description: 'Color for the cancel button in the confirm dialog.',
  },
  {
    name: 'cancelBtnTextColor',
    type: 'string',
    default: '#374151',
    description: 'Text color for the cancel button in the confirm dialog.',
  },
  {
    name: 'successColor',
    type: 'string',
    default: '#22c55e',
    description: 'Color for the success notification.',
  },
  {
    name: 'errorColor',
    type: 'string',
    default: '#ef4444',
    description: 'Color for the error notification.',
  },
  {
    name: 'warningColor',
    type: 'string',
    default: '#f59e0b',
    description: 'Color for the warning notification.',
  },
  {
    name: 'infoColor',
    type: 'string',
    default: '#0ea5e9',
    description: 'Color for the info notification.',
  },
  {
    name: 'mainBgColor',
    type: 'string',
    default: '#fff',
    description: 'Background color for the notifications.',
  },
  {
    name: 'mainTextColor',
    type: 'string',
    default: '#40444dff',
    description: 'Text color for the notifications.',
  },
]

toastConfigRows: PropRow[] = [
  {
    name: 'position',
    type: 'ToastPosition',
    default: 'top-right',
    description: 'Position of the toast notifications.',
  },
  {
    name: 'closeButton',
    type: 'boolean',
    default: 'false',
    description: 'Show close button.',
  },
  {
    name: 'animation',
    type: 'ToastAnimation',
    default: 'slide',
    description: 'Animation of the toast notifications.',
  },
  {
    name: 'icon',
    type: 'boolean',
    default: 'true',
    description: 'Show icon.',
  },
  
]
}
