import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monedaChilena',
  standalone: true
})
export class MonedaChilenaPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '';
    }

    // Formatear el número como CLP usando el formato chileno para miles
    return '$ ' + value.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace(/,/g, '.'); // Remplazamos las comas con puntos
  }

}
