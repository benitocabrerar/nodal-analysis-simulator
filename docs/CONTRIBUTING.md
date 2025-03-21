# Contribuyendo al Simulador de Análisis Nodal

¡Gracias por considerar contribuir a este proyecto! Este documento proporciona lineamientos y pasos para contribuir efectivamente.

## Código de Conducta

Al participar en este proyecto, acepta seguir un [Código de Conducta](CODE_OF_CONDUCT.md) que promueve un ambiente de comunidad respetuoso e inclusivo.

## ¿Cómo puedo contribuir?

### Reportando errores

Los reportes de errores son valiosos para mejorar el proyecto:

1. **Verifique si el error ya ha sido reportado** buscando en [Issues](https://github.com/benitocabrerar/nodal-analysis-simulator/issues).
2. **Cree un nuevo issue** con un título claro y descripción detallada.
3. **Incluya pasos para reproducir** el error, comportamiento esperado vs. observado, y capturas de pantalla si es posible.
4. **Especifique** su navegador, sistema operativo y versión de la aplicación.

### Sugiriendo mejoras

Las sugerencias de mejoras son bienvenidas:

1. **Verifique si la idea ya ha sido sugerida** revisando los [Issues](https://github.com/benitocabrerar/nodal-analysis-simulator/issues).
2. **Cree un nuevo issue** describiendo claramente la mejora.
3. **Explique por qué** esta mejora sería útil para la mayoría de los usuarios.

### Pull Requests

Para presentar un Pull Request:

1. **Fork** el repositorio y cree una rama desde `main`.
2. **Instale las dependencias**: `npm install`.
3. **Realice sus cambios** siguiendo las convenciones de código del proyecto.
4. **Añada o actualice pruebas** si es necesario.
5. **Asegúrese de que las pruebas pasen**: `npm test`.
6. **Actualice la documentación** si es necesario.
7. **Envíe su Pull Request** con una descripción clara.

## Convenciones de código

### Estilo de código

- Siga el estilo ya establecido en el proyecto.
- Use nombres descriptivos para variables y funciones.
- Escriba comentarios para código complejo.

### Mensajes de Commit

- Use verbos en imperativo: "Add", "Fix", "Update", "Remove", etc.
- Primera línea: resumen conciso (50 caracteres o menos).
- Cuerpo: explicación detallada si es necesario.

### Organización del código

- Componentes React en `src/components/`.
- Funciones de utilidad en `src/utils/`.
- Estilos CSS en archivos junto a sus componentes.

## Consideraciones técnicas

### Modelos matemáticos

Al implementar o modificar modelos de cálculo para análisis nodal:

- **Documente las ecuaciones** utilizadas con referencias apropiadas.
- **Valide los resultados** comparando con casos conocidos o software comercial.
- **Considere los límites** de aplicabilidad de las correlaciones.

### Rendimiento

- Evite cálculos innecesarios en cada renderizado.
- Utilice `React.memo()` o `useMemo()` para componentes o cálculos costosos.

## Recursos adicionales

- [Documentación de React](https://reactjs.org/docs/getting-started.html)
- [Documentación de Recharts](https://recharts.org/en-US/api)
- Referencias de ingeniería petrolera:
  - Beggs, H.D. (1991). Production Optimization Using Nodal Analysis.
  - Brown, K.E. (1977). The Technology of Artificial Lift Methods.

## ¡Gracias!

Su contribución hace que este proyecto sea mejor para todos. ¡Gracias por su tiempo y esfuerzo!