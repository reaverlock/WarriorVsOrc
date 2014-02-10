WarriorVsOrc
============

intento de enviar objetos complejos (array de objetos JSON) e interpretarlos 

CONSEGUIDO: 
- Envío de objetos distintos segun quien ataca
- No envío de objetos si el PJ está muerto
- Anuncia sucesos en la consola de texto
- Solo cambia valores de los PJ's si la respuesta fue daño
- Ya se envia la data como array y se interpreta según necesidad
- cambiado .click(function(){}) por .on('click', function(){})

TODO:
- Generar los JSON a anviar basandose en el modelo al inicio del .js dentro de cada click. (dejar comentado el JSON para tenerlo como referencia)
- Probar si con el formato de JSON con arrays {[]} funciona el parseo en python o no.
- programación de cada personaje (solo funciona el primer wARRIOR que ataca al primer orco y eso solo una vez)
- Devolución desde el servidor de objetos, no de texto (para eventos más complejos)




