import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cfa',
  standalone: true,
})
export class CfaCurrencyPipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value === null || value === undefined) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  }
}
