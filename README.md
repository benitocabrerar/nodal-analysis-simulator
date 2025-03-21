# Simulador de Análisis Nodal en Ingeniería Petrolera

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-17.0.2-61DAFB?logo=react)](https://reactjs.org/)
[![Recharts](https://img.shields.io/badge/Recharts-2.1.9-22b5bf)](https://recharts.org/)

![Captura del simulador](docs/images/screenshot.png)

## 📋 Descripción

Este simulador de Análisis Nodal es una herramienta interactiva desarrollada para ingenieros petroleros, estudiantes y profesionales que trabajan en el diseño y optimización de sistemas de producción de petróleo y gas. Permite visualizar y analizar la interacción entre el comportamiento del yacimiento (curva IPR) y el sistema de producción (curva VLP/TPR).

## ✨ Características

- **Análisis Básico:** Visualización de las curvas IPR y VLP con cálculo automático del punto de operación.
- **Análisis de Tamaño de Tubería:** Evalúa el impacto de diferentes diámetros de tubería en la producción.
- **Simulación de Gas Lift:** Determina el efecto de implementar un sistema de levantamiento artificial por gas.
- **Comparación de Escenarios:** Compara múltiples configuraciones para identificar la óptima.
- **Recomendaciones Automáticas:** Sugerencias basadas en los resultados del análisis.

## 🚀 Instalación

### Prerrequisitos
- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)

### Pasos para la instalación

1. Clone el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nodal-analysis-simulator.git
   cd nodal-analysis-simulator
   ```

2. Instale las dependencias:
   ```bash
   npm install
   ```

3. Inicie la aplicación en modo desarrollo:
   ```bash
   npm start
   ```

4. Abra [http://localhost:3000](http://localhost:3000) para verla en su navegador.

## 🔧 Uso

1. **Seleccione un modo de análisis** (Básico, Tamaño de Tubería o Gas Lift) según lo que desee evaluar.

2. **Ajuste los parámetros** relevantes:
   - Presión del reservorio (psi)
   - Presión del punto de burbuja (psi)
   - Diámetro de tubería (pulgadas)
   - Activación y tasa de inyección de gas lift

3. **Visualice los resultados** en el gráfico que muestra la intersección de las curvas IPR y VLP.

4. **Analice los resultados cuantitativos** y las recomendaciones proporcionadas por el sistema.

## 📚 Base Teórica

El análisis nodal es una técnica sistemática utilizada en la ingeniería de producción para evaluar el rendimiento de los sistemas de producción de petróleo y gas. Se basa en la resolución de ecuaciones de flujo en un "nodo" seleccionado del sistema (generalmente el fondo del pozo).

### Curva IPR (Inflow Performance Relationship)
Representa la capacidad del yacimiento para aportar fluidos al pozo. Se utilizan diferentes correlaciones:
- **Ecuación de Darcy:** Para flujo monofásico en yacimientos subsaturados.
- **Ecuación de Vogel:** Para yacimientos saturados con presiones por debajo del punto de burbuja.
- **Método de Fetkovich:** Para ajustar curvas basadas en datos de pruebas.

### Curva VLP (Vertical Lift Performance)
Representa la capacidad del sistema de producción para transportar fluidos a la superficie. Se ve afectada por:
- Diámetro de la tubería de producción
- Propiedades de los fluidos
- Sistemas de levantamiento artificial (como gas lift)
- Presión en cabeza de pozo

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si desea contribuir al proyecto:

1. Haga un Fork del repositorio
2. Cree una rama para su característica (`git checkout -b feature/amazing-feature`)
3. Haga commit de sus cambios (`git commit -m 'Add some amazing feature'`)
4. Haga Push a la rama (`git push origin feature/amazing-feature`)
5. Abra un Pull Request

Por favor, lea [CONTRIBUTING.md](docs/CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - vea el archivo [LICENSE](LICENSE) para más detalles.

## 📌 Referencias y Recursos Adicionales

- Beggs, H.D. (1991). Production Optimization Using Nodal Analysis. OGCI Publications.
- Brown, K.E. (1977). The Technology of Artificial Lift Methods. PennWell Books.
- Economides, M.J., Hill, A.D., & Ehlig-Economides, C. (1993). Petroleum Production Systems. Prentice Hall.

## 👨‍💻 Autor

[Tu Nombre](https://github.com/benitocabrerar) - Contacto: benitocabrera@hotmail.com