WarriorVsOrc
============

intento de enviar objetos complejos (array de objetos JSON) e interpretarlos 

CONSEGUIDO: 
- Envío de objetos distintos segun quien ataca
- No envío de objetos si el PJ está muerto
- Anuncia sucesos en la consola de texto
- Solo cambia valores de los PJ's si la respuesta fue daño

TODO:
- El Texto de la consola debería agregarse al final no simplemente borrarse, así hay historial
- Los Pjs deberian tener un #name que procesar en la data y asi el texto sería más legible y podría tener color própio
- Devolución desde el servidor de objetos, no de texto (para eventosmás complejos)
- Envío de la data completa del party (será necesario???) (seguro que si para el load game) en un solo objeto (JSON que contenga multiples objetos)
- Parseo de contenedor con multiples obbjetos a nivel de cliente y server


