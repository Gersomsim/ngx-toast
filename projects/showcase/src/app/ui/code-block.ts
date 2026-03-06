import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ui-code-block',
  standalone: true,
  template: `
    <div class="rounded-xl overflow-hidden border border-[#2a2a2a] shadow-lg font-mono text-[12.5px] leading-[1.65]">

      <!-- Header bar -->
      <div class="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#333]">
        <div class="flex items-center gap-3">
          <div class="flex gap-1.5">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
            <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
          </div>
          <span class="text-[#858585] text-[11px] tracking-wide">{{ filename() }}</span>
        </div>
        <button
          (click)="copy()"
          class="text-[11px] px-2.5 py-0.5 rounded text-[#858585] hover:text-[#ccc]
                 hover:bg-[#3c3c3c] transition-colors duration-100 cursor-pointer select-none">
          {{ copied() ? '✓ Copied' : 'Copy' }}
        </button>
      </div>

      <!-- Code body -->
      <div class="flex bg-[#1e1e1e] overflow-x-auto">

        @if (showLineNumbers()) {
          <div class="flex flex-col items-end select-none shrink-0
                      py-5 px-4 text-[#4d4d4d] leading-[1.65]">
            @for (n of lineNumbersList(); track n) {
              <span>{{ n }}</span>
            }
          </div>
        }

        <pre class="flex-1 py-5 px-6 text-[#d4d4d4] leading-[1.65] m-0 bg-transparent overflow-x-auto whitespace-pre"><code [innerHTML]="highlighted()"></code></pre>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    :host ::ng-deep .kw  { color: #569cd6; }
    :host ::ng-deep .str { color: #ce9178; }
    :host ::ng-deep .cmt { color: #6a9955; font-style: italic; }
    :host ::ng-deep .dec { color: #dcdcaa; }
    :host ::ng-deep .typ { color: #4ec9b0; }
    :host ::ng-deep .num { color: #b5cea8; }
    :host ::ng-deep .fn  { color: #dcdcaa; }
  `]
})
export class CodeBlock {
  code            = input.required<string>();
  filename        = input('code.ts');
  language        = input<'typescript' | 'plain'>('typescript');
  showLineNumbers = input(false);

  copied  = signal(false);

  private sanitizer = inject(DomSanitizer);

  lineNumbersList = computed(() =>
    Array.from({ length: this.code().split('\n').length }, (_, i) => i + 1)
  );

  /**
   * Returns SafeHtml so Angular skips sanitization.
   * Content is always developer-authored code, never user input.
   */
  highlighted = computed((): SafeHtml => {
    const escaped = this.escapeHtml(this.code());
    const html = this.language() === 'typescript'
      ? this.applyHighlighting(escaped)
      : escaped;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  copy() {
    navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  // ── Helpers ─────────────────────────────────────────────────────

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Single-pass regex: patterns are tried left-to-right, so comments and
   * strings always win over keywords — no multi-step placeholder magic needed.
   */
  private applyHighlighting(code: string): string {
    const kw = [
      'import','export','from','const','let','var','function','class',
      'interface','type','return','if','else','new','this','async','await',
      'extends','implements','public','private','protected','readonly','static',
      'abstract','true','false','null','undefined','void','any','string',
      'number','boolean','of','in','for','while','do','switch','case',
      'break','continue','default','declare','enum','as','override',
      'keyof','typeof','instanceof',
    ].join('|');

    const re = new RegExp(
      // 1 — line & block comments  (matched first → keywords inside ignored)
      '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +
      // 2 — template literals, double-quoted, single-quoted strings
      '|(`[^`]*`|"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')' +
      // 3 — decorators  @Something
      '|(@[a-zA-Z]\\w*)' +
      // 4 — reserved keywords
      `|\\b(${kw})\\b` +
      // 5 — PascalCase identifiers (types / class names)
      '|\\b([A-Z][a-zA-Z0-9]*)\\b' +
      // 6 — function / method calls  foo(
      '|\\b([a-z_]\\w*)(?=\\s*\\()' +
      // 7 — numeric literals
      '|(\\b\\d+(?:\\.\\d+)?)',
      'g'
    );

    return code.replace(re, (m, cmt, str, dec, keyword, typ, fn, num) => {
      if (cmt     !== undefined) return `<span class="cmt">${m}</span>`;
      if (str     !== undefined) return `<span class="str">${m}</span>`;
      if (dec     !== undefined) return `<span class="dec">${m}</span>`;
      if (keyword !== undefined) return `<span class="kw">${m}</span>`;
      if (typ     !== undefined) return `<span class="typ">${m}</span>`;
      if (fn      !== undefined) return `<span class="fn">${m}</span>`;
      if (num     !== undefined) return `<span class="num">${m}</span>`;
      return m;
    });
  }
}
