import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgxNotify } from '@gersomsim/ngx-notify';
import { CodeBlock } from '../../ui/code-block';

@Component({
  selector: 'app-test-ngx-confirm',
  imports: [ReactiveFormsModule, CodeBlock],
  templateUrl: './test-ngx-confirm.html',
  styleUrl: './test-ngx-confirm.css',
})
export class TestNgxConfirm implements OnInit {
  private fb = inject(FormBuilder);

  icons = ['success', 'error', 'warning', 'info'];

  formConfirm = this.fb.nonNullable.group({
    title: ['Are you sure?'],
    message: ['Confirm delete this item?'],
    showConfirmButton: [true],
    showCancelButton: [true],
    timer: [3000],
    confirmText: ['Yes, delete it!'],
    cancelText: ['No'],
    showProgressBar: [false],
    closeBackdropClick: [true],
    icon: [this.icons[0]],
  });

  configCode = signal('');
  copied     = signal(false);

  ngOnInit() {
    this.updateCode();
    this.formConfirm.valueChanges.subscribe(() => this.updateCode());
  }

  testConfirm() {
    const value = this.formConfirm.getRawValue();
    NgxNotify.confirm({...value, icon: value.icon as any});
  }

  copyConfig() {
    navigator.clipboard.writeText(this.configCode());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  private updateCode() {
    const v = this.formConfirm.getRawValue();
    this.configCode.set(
`NgxNotify.confirm({
  title: '${v.title}',
  message: '${v.message}',
  icon: '${v.icon}',
  confirmText: '${v.confirmText}',
  cancelText: '${v.cancelText}',
  showConfirmButton: ${v.showConfirmButton},
  showCancelButton: ${v.showCancelButton},
  timer: ${v.timer},
  showProgressBar: ${v.showProgressBar},
  closeBackdropClick: ${v.closeBackdropClick},
});`
    );
  }
}
