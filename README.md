# Lima / CO — Laboratorio ambiental

Prototipo académico para explorar resultados históricos de WRF y su validación inicial con estaciones de Lima, agosto de 2018. No es un sistema en tiempo real, un pronóstico validado ni una herramienta de alertas sanitarias.

El sitio contiene series reducidas y 248 mapas de la primera capa de CO de la malla d02 de 3 km. La escala espacial es fija: 0–500 µg/m³. La conversión del modelo usa provisionalmente 25 °C y 1 atm. Las condiciones de referencia y las banderas de calidad horaria de las observaciones están pendientes de confirmación. Los mapas representan resultados del modelo, no interpolaciones entre estaciones.

Fuentes y metodología se explican en la sección «Método y trazabilidad» del sitio. Costa: Natural Earth, datos cartográficos de dominio público. Los archivos NetCDF, las credenciales y los documentos privados no forman parte de esta publicación.

## Publicación

Sitio HTML/CSS/JavaScript estático. Para GitHub Pages, publicar la raíz de la rama principal. No requiere ejecutar WRF ni Python. Se puede consultar localmente sirviendo esta carpeta con un servidor HTTP.
