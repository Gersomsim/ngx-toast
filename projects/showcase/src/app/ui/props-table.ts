import { Component, input } from '@angular/core';

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

@Component({
  selector: 'ui-props-table',
  standalone: true,
  template: `
    <div class="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-[13px]">
      <table class="w-full border-collapse">

        <!-- Head -->
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-800
                     bg-slate-50 dark:bg-slate-900/60">
            <th class="th-cell w-[22%]">Property</th>
            <th class="th-cell w-[22%]">Type</th>
            <th class="th-cell w-[16%]">Default</th>
            <th class="th-cell">Description</th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          @for (row of rows(); track row.name; let last = $last) {
            <tr [class]="last ? '' : 'border-b border-slate-100 dark:border-slate-800/70'">

              <!-- Property name -->
              <td class="td-cell">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <code class="font-mono text-[12px] text-slate-800 dark:text-slate-200">
                    {{ row.name }}
                  </code>
                  @if (row.required) {
                    <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded
                                 bg-rose-50 dark:bg-rose-900/30
                                 text-rose-600 dark:text-rose-400
                                 border border-rose-200 dark:border-rose-800/50">
                      required
                    </span>
                  }
                </div>
              </td>

              <!-- Type -->
              <td class="td-cell">
                <code class="font-mono text-[12px] text-indigo-600 dark:text-indigo-400">
                  {{ row.type }}
                </code>
              </td>

              <!-- Default -->
              <td class="td-cell">
                @if (row.default) {
                  <code class="font-mono text-[12px] text-slate-500 dark:text-slate-500">
                    {{ row.default }}
                  </code>
                } @else {
                  <span class="text-slate-300 dark:text-slate-700">—</span>
                }
              </td>

              <!-- Description -->
              <td class="td-cell text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ row.description }}
              </td>

            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    @reference "../../styles.css";
    :host { display: block; }
    .th-cell {
      @apply text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.07em]
             text-slate-400 dark:text-slate-500;
    }
    .td-cell {
      @apply px-4 py-3 align-top;
    }
  `]
})
export class PropsTable {
  rows = input.required<PropRow[]>();
}
