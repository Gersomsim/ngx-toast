import { Component, input } from '@angular/core';

export interface TerminalLine {
  type: 'command' | 'output' | 'comment' | 'blank';
  text?: string;
}

@Component({
  selector: 'ui-terminal-block',
  standalone: true,
  template: `
    <div class="rounded-xl overflow-hidden border border-[#2a2a2a] shadow-lg font-mono text-[13px] leading-[1.7]">

      <!-- Title bar -->
      <div class="flex items-center gap-3 px-4 py-2.5 bg-[#1c1c1e] border-b border-[#2d2d2d]">
        <div class="flex gap-1.5 shrink-0">
          <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
          <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
          <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
        </div>
        @if (title()) {
          <span class="flex-1 text-center text-[11px] text-[#5c5c5c] tracking-wide pr-12">
            {{ title() }}
          </span>
        }
      </div>

      <!-- Terminal body -->
      <div class="bg-[#0d0d0d] px-5 py-4">
        @for (line of lines(); track $index) {
          @if (line.type === 'blank') {
            <div class="h-3"></div>
          } @else if (line.type === 'comment') {
            <div class="text-[#4e6e57] italic leading-[1.7]">
              # {{ line.text }}
            </div>
          } @else if (line.type === 'command') {
            <div class="flex items-baseline gap-2 leading-[1.7]">
              <span class="text-[#10b981] select-none shrink-0">$</span>
              <span class="text-[#f1f1f1]">{{ line.text }}</span>
            </div>
          } @else if (line.type === 'output') {
            <div class="text-[#6c7a74] pl-5 leading-[1.7]">{{ line.text }}</div>
          }
        }
      </div>

    </div>
  `,
  styles: [':host { display: block; }']
})
export class TerminalBlock {
  lines = input.required<TerminalLine[]>();
  title = input('');
}
