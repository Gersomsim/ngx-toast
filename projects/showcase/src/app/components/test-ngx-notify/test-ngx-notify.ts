import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgxNotify, NgxNotifyAnimationType, NgxNotifyPositionType, NgxNotifyToastConfig, NgxNotifyType } from '@gersomsim/ngx-notify';
import { CodeBlock } from '../../ui/code-block';

@Component({
  selector: 'app-test-ngx-notify',
  imports: [ReactiveFormsModule, CodeBlock],
  templateUrl: './test-ngx-notify.html',
  styleUrl: './test-ngx-notify.css',
})
export class TestNgxNotify implements OnInit {
  private fb = inject(FormBuilder);

  animations = ['fade', 'slide', 'zoom', 'none'];
  types      = ['success', 'error', 'warning', 'info'];

  // 3×3 grid — row-major order: top, center, bottom × left, center, right
  positionGrid = [
    'top-left',    'top-center',    'top-right',
    'center-left', 'center',        'center-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];

  notifyConfig = this.fb.nonNullable.group({
    type:        [this.types[0]],
    position:    [this.positionGrid[2]],   // top-right
    animation:   [this.animations[0]],
    title:       ['Success'],
    message:     ['You logged in successfully!'],
    duration:    [3000],
    icon:        [true],
    closeButton: [true],
  });

  configCode = signal('');
  copied     = signal(false);

  ngOnInit() {
    this.updateCode();
    this.notifyConfig.valueChanges.subscribe(() => this.updateCode());
  }

  showNotification() {
    const v = this.notifyConfig.getRawValue();
    const config: NgxNotifyToastConfig  = {
      message:     v.message,
      type:        v.type as NgxNotifyType,
      duration:    v.duration,
      title:       v.title,
      animation:   v.animation as NgxNotifyAnimationType,
      closeButton: v.closeButton,
      icon:        v.icon,
      position:    v.position as NgxNotifyPositionType,
    };
    NgxNotify.show(config);
  }

  copyConfig() {
    navigator.clipboard.writeText(this.configCode());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  setPosition(pos: string) {
    this.notifyConfig.patchValue({ position: pos });
  }

  private updateCode() {
    const v = this.notifyConfig.getRawValue();
    this.configCode.set(
`NgxNotify.show({
  message: '${v.message}',
  type: '${v.type}',
  title: '${v.title}',
  position: '${v.position}',
  duration: ${v.duration},
  animation: '${v.animation}',
  icon: ${v.icon},
  closeButton: ${v.closeButton},
});`
    );
  }
}
