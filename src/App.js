import React from 'react';
import NodalAnalysis from './components/NodalAnalysis';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1>
            <span className="App-icon">⛽</span> 
            Simulador de Análisis Nodal para Ingeniería Petrolera
          </h1>
          <p className="App-subtitle">
            Herramienta interactiva para la evaluación y optimización de sistemas de producción
          </p>
        </div>
      </header>
      
      <main className="App-main">
        <NodalAnalysis />
      </main>
      
      <footer className="App-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Acerca de</h3>
              <p>
                Esta herramienta ha sido desarrollada para ayudar a ingenieros petroleros en el análisis 
                y optimización de sistemas de producción mediante técnicas de análisis nodal.
              </p>
            </div>
            
            <div className="footer-section">
              <h3>Referencias</h3>
              <ul>
                <li>Beggs, H.D. (1991). Production Optimization Using Nodal Analysis.</li>
                <li>Brown, K.E. (1977). The Technology of Artificial Lift Methods.</li>
                <li>Economides, M.J. et al. (1993). Petroleum Production Systems.</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Enlaces</h3>
              <ul>
                <li><a href="https://github.com/benitocabrerar/nodal-analysis-simulator" target="_blank" rel="noopener noreferrer">Código fuente en GitHub</a></li>
                <li><a href="https://github.com/benitocabrerar/nodal-analysis-simulator/issues" target="_blank" rel="noopener noreferrer">Reportar problemas</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Simulador de Análisis Nodal. Todos los derechos reservados.</p>
            <p>Desarrollado con <span role="img" aria-label="heart">❤️</span> por <a href="https://github.com/benitocabrerar" target="_blank" rel="noopener noreferrer">Ing. Benito Cabrera R., MBA</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;