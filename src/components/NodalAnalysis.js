import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import './NodalAnalysis.css';

const NodalAnalysis = () => {
  // Estados para controlar los parámetros
  const [selectedTab, setSelectedTab] = useState('basic');
  const [tubingSize, setTubingSize] = useState(3.5);
  const [isGasLiftActive, setIsGasLiftActive] = useState(false);
  const [gasLiftRate, setGasLiftRate] = useState(1.0);
  const [showComparisonCurves, setShowComparisonCurves] = useState(false);
  const [reservoirPressure, setReservoirPressure] = useState(3000);
  const [bubblePointPressure, setBubblePointPressure] = useState(1800);
  const [productivityIndex, setProductivityIndex] = useState(1.2);

  // Parámetros base del sistema
  const baseParams = {
    reservoirPressure: reservoirPressure, // psi
    bubblePointPressure: bubblePointPressure, // psi
    productivity: productivityIndex, // STB/d/psi
    maxFlowRate: 700, // STB/d
    wellheadPressure: 150 // psi
  };

  // Función para calcular curva IPR (Vogel)
  const calculateIPR = () => {
    const data = [];
    const { reservoirPressure, bubblePointPressure, productivity, maxFlowRate } = baseParams;
    
    // Puntos para la curva
    for (let flowRate = 0; flowRate <= maxFlowRate; flowRate += maxFlowRate / 40) {
      let pressure;
      
      if (reservoirPressure <= bubblePointPressure) {
        // Caso completamente saturado (Vogel)
        pressure = reservoirPressure * (1 - 0.2 * (flowRate / maxFlowRate) - 0.8 * Math.pow(flowRate / maxFlowRate, 2));
      } else {
        // Sistema combinado: subsaturado + saturado
        if (flowRate <= productivity * (reservoirPressure - bubblePointPressure)) {
          // Región subsaturada - Relación lineal (Darcy)
          pressure = reservoirPressure - (flowRate / productivity);
        } else {
          // Región saturada - Ecuación de Vogel
          const qb = productivity * (reservoirPressure - bubblePointPressure);
          const ratio = (flowRate - qb) / (maxFlowRate - qb);
          pressure = bubblePointPressure * (1 - 0.2 * ratio - 0.8 * Math.pow(ratio, 2));
        }
      }
      
      data.push({
        flowRate,
        iprPressure: Math.max(0, pressure)
      });
    }
    
    return data;
  };

  // Función para calcular curva VLP (Vertical Lift Performance)
  const calculateVLP = (tubingDiameter, useGasLift, gasLiftRatio) => {
    const data = calculateIPR();
    const { wellheadPressure } = baseParams;
    
    // Parámetros que afectan la forma de la curva VLP
    let a = 1500 - (tubingDiameter * 120); // Factor para el punto mínimo
    let b = 0.8 - (tubingDiameter * 0.05); // Factor de curvatura
    let c = 150 + (tubingDiameter * 20); // Factor de inclinación inicial
    
    // Ajustes para gas lift (reduce densidad del fluido)
    if (useGasLift) {
      a = a * (1 - 0.25 * gasLiftRatio); // Menor columna hidrostática
      b = b * (1 + 0.15 * gasLiftRatio); // Mayor fricción a altos caudales
      c = c * (1 - 0.1 * gasLiftRatio); // Menor caída inicial
    }
    
    // Calcular presión VLP para cada punto
    data.forEach(point => {
      if (point.flowRate < 10) {
        // A caudales muy bajos, domina la presión hidrostática
        point.vlpPressure = wellheadPressure + a - 10;
      } else {
        // Forma de U característica
        point.vlpPressure = wellheadPressure + a - (c * Math.pow(point.flowRate / 100, 0.5)) + 
                           (b * Math.pow(point.flowRate / 100, 2) * 100);
      }
    });
    
    return data;
  };

  // Función para encontrar el punto de operación
  const findOperatingPoint = (data) => {
    for (let i = 1; i < data.length; i++) {
      const prev = data[i-1];
      const curr = data[i];
      
      // Buscar el punto donde las curvas se cruzan
      if ((prev.iprPressure > prev.vlpPressure && curr.iprPressure < curr.vlpPressure) ||
          (prev.iprPressure < prev.vlpPressure && curr.iprPressure > curr.vlpPressure)) {
        
        // Interpolación lineal para encontrar el punto exacto
        const ratio = (prev.vlpPressure - prev.iprPressure) / 
                     ((curr.iprPressure - prev.iprPressure) - (curr.vlpPressure - prev.vlpPressure));
        
        const opRate = prev.flowRate + ratio * (curr.flowRate - prev.flowRate);
        const opPressure = prev.iprPressure + ratio * (curr.iprPressure - prev.iprPressure);
        
        return {
          flowRate: opRate,
          pressure: opPressure
        };
      }
    }
    
    // Si no se encuentra intersección
    return null;
  };

  // Obtener los datos para el gráfico actual
  const getCurrentData = () => {
    return calculateVLP(tubingSize, isGasLiftActive, gasLiftRate);
  };

  // Punto de operación actual
  const operatingPoint = findOperatingPoint(getCurrentData());
  
  // Obtener datos para comparación de tubings
  const getTubingSizeComparisonData = () => {
    return {
      small: calculateVLP(2.5, isGasLiftActive, gasLiftRate),
      medium: calculateVLP(3.5, isGasLiftActive, gasLiftRate),
      large: calculateVLP(4.5, isGasLiftActive, gasLiftRate)
    };
  };
  
  // Obtener datos para comparación de gas lift
  const getGasLiftComparisonData = () => {
    return {
      noGasLift: calculateVLP(tubingSize, false, 0),
      lowGasLift: calculateVLP(tubingSize, true, 0.5),
      highGasLift: calculateVLP(tubingSize, true, 1.5)
    };
  };

  // Renderizar curvas de comparación para tubings
  const renderTubingComparisonCurves = () => {
    const comparisonData = getTubingSizeComparisonData();
    
    return (
      <>
        <Line 
          data={comparisonData.small} 
          type="monotone" 
          dataKey="vlpPressure" 
          stroke="#87CEFA" 
          name='VLP (2.5\")'
          dot={false}
          strokeWidth={1}
          strokeDasharray="5 5"
        />
        <Line 
          data={comparisonData.large} 
          type="monotone" 
          dataKey="vlpPressure" 
          stroke="#0000CD" 
          name='VLP (4.5\")'
          dot={false}
          strokeWidth={1}
          strokeDasharray="5 5"
        />
      </>
    );
  };

  // Renderizar curvas de comparación para gas lift
  const renderGasLiftComparisonCurves = () => {
    const comparisonData = getGasLiftComparisonData();
    
    return (
      <>
        <Line 
          data={comparisonData.noGasLift} 
          type="monotone" 
          dataKey="vlpPressure" 
          stroke="#87CEFA" 
          name="Sin Gas Lift" 
          dot={false}
          strokeWidth={1}
          strokeDasharray="5 5"
        />
        <Line 
          data={comparisonData.highGasLift} 
          type="monotone" 
          dataKey="vlpPressure" 
          stroke="#32CD32" 
          name="Gas Lift Alto" 
          dot={false}
          strokeWidth={1}
          strokeDasharray="5 5"
        />
      </>
    );
  };

  // Calcular puntos operativos para comparación
  const getComparisonOperatingPoints = () => {
    if (!showComparisonCurves) return {};
    
    if (selectedTab === 'tubing') {
      const data = getTubingSizeComparisonData();
      return {
        small: findOperatingPoint(data.small),
        current: operatingPoint,
        large: findOperatingPoint(data.large)
      };
    } else if (selectedTab === 'gaslift') {
      const data = getGasLiftComparisonData();
      return {
        noGasLift: findOperatingPoint(data.noGasLift),
        current: operatingPoint,
        highGasLift: findOperatingPoint(data.highGasLift)
      };
    }
    
    return {};
  };

  // Renderizar el contenido según la pestaña seleccionada
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'tubing':
        return (
          <div className="tab-content">
            <h3>Efecto del Tamaño de Tubería en el Análisis Nodal</h3>
            <p>
              El diámetro de la tubería de producción afecta significativamente el comportamiento del sistema. 
              A medida que el diámetro disminuye:
            </p>
            <ul>
              <li>Aumenta la fricción a altos caudales</li>
              <li>Se requiere mayor presión para elevar el fluido a la superficie</li>
              <li>El punto mínimo de la curva VLP tiende a desplazarse hacia caudales menores</li>
            </ul>
            
            <div className="control-group">
              <label>Diámetro de Tubería (pulgadas):</label>
              <input
                type="range"
                min="2"
                max="5"
                step="0.5"
                value={tubingSize}
                onChange={(e) => setTubingSize(Number(e.target.value))}
              />
              <span>{tubingSize} pulgadas</span>
            </div>
            
            <div className="control-checkbox">
              <input
                type="checkbox"
                id="compare-tubing"
                checked={showComparisonCurves}
                onChange={() => setShowComparisonCurves(!showComparisonCurves)}
              />
              <label htmlFor="compare-tubing">Comparar diferentes tamaños de tubería</label>
            </div>
            
            <div className="info-box">
              <h4>¿Por qué es importante?</h4>
              <p>
                La selección del tamaño óptimo de tubería es crucial para maximizar la producción. 
                Una tubería demasiado grande puede reducir la velocidad del fluido causando acumulación de líquidos, 
                mientras que una tubería demasiado pequeña aumenta la presión por fricción limitando el caudal.
              </p>
            </div>
          </div>
        );
        
      case 'gaslift':
        return (
          <div className="tab-content">
            <h3>Sistema de Gas Lift</h3>
            <p>
              El gas lift es un método de levantamiento artificial que reduce la densidad de la columna de fluido 
              mediante la inyección de gas a diferentes profundidades, disminuyendo así la presión hidrostática.
            </p>
            
            <div className="control-group">
              <div className="control-checkbox">
                <input
                  type="checkbox"
                  id="gas-lift-active"
                  checked={isGasLiftActive}
                  onChange={() => setIsGasLiftActive(!isGasLiftActive)}
                />
                <label htmlFor="gas-lift-active">Sistema de Gas Lift Activo</label>
              </div>
              
              {isGasLiftActive && (
                <div>
                  <label>Tasa de Inyección de Gas (MMscf/d):</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={gasLiftRate}
                    onChange={(e) => setGasLiftRate(Number(e.target.value))}
                  />
                  <span>{gasLiftRate.toFixed(1)} MMscf/d</span>
                </div>
              )}
            </div>
            
            <div className="control-checkbox">
              <input
                type="checkbox"
                id="compare-gaslift"
                checked={showComparisonCurves}
                onChange={() => setShowComparisonCurves(!showComparisonCurves)}
              />
              <label htmlFor="compare-gaslift">Comparar diferentes tasas de inyección</label>
            </div>
            
            <div className="info-box">
              <h4>Beneficios del Gas Lift:</h4>
              <ul>
                <li>Puede aumentar significativamente la producción en pozos con alta presión hidrostática</li>
                <li>Tolerante a la producción de arena y sólidos</li>
                <li>Puede operar en un amplio rango de condiciones de pozo</li>
                <li>Menor costo operativo comparado con otros sistemas de levantamiento artificial</li>
              </ul>
            </div>
          </div>
        );
        
      default: // Caso básico
        return (
          <div className="tab-content">
            <h3>Análisis Nodal Básico</h3>
            <p>
              El análisis nodal es una técnica que permite predecir el comportamiento del sistema de producción 
              mediante la intersección de dos curvas:
            </p>
            <ul>
              <li><strong>Curva IPR:</strong> Representa cómo el yacimiento aporta fluidos al pozo</li>
              <li><strong>Curva VLP/TPR:</strong> Representa cómo el sistema de producción transporta los fluidos a superficie</li>
            </ul>
            <p>
              El punto de intersección de ambas curvas determina las condiciones de operación del sistema (caudal y presión).
            </p>
            
            <div className="controls-grid">
              <div className="control-group">
                <label>Presión del Reservorio (psi):</label>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="100"
                  value={reservoirPressure}
                  onChange={(e) => setReservoirPressure(Number(e.target.value))}
                />
                <span>{reservoirPressure} psi</span>
              </div>
              
              <div className="control-group">
                <label>Presión del Punto de Burbuja (psi):</label>
                <input
                  type="range"
                  min="500"
                  max={reservoirPressure}
                  step="100"
                  value={bubblePointPressure}
                  onChange={(e) => setBubblePointPressure(Number(e.target.value))}
                />
                <span>{bubblePointPressure} psi</span>
              </div>
              
              <div className="control-group">
                <label>Índice de Productividad (STB/d/psi):</label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={productivityIndex}
                  onChange={(e) => setProductivityIndex(Number(e.target.value))}
                />
                <span>{productivityIndex.toFixed(1)} STB/d/psi</span>
              </div>
            </div>
          </div>
        );
    }
  };

  // Renderizar el gráfico principal
  // Renderizar el gráfico principal
  const renderMainChart = () => {
    const data = getCurrentData();
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="flowRate" 
            label={{ value: 'Q = STB/d', position: 'insideBottom', offset: -5 }} 
            domain={[0, baseParams.maxFlowRate * 1.1]}
          />
          <YAxis 
            label={{ value: 'Presión (psi)', angle: -90, position: 'insideLeft' }} 
            domain={[0, baseParams.reservoirPressure * 1.1]}
          />
          <Tooltip 
            formatter={(value, name) => [value.toFixed(2), name === 'iprPressure' ? 'IPR' : 'VLP']}
            labelFormatter={(value) => `Caudal: ${value.toFixed(2)} STB/d`}
          />
          <Legend />
          
          {/* Curva IPR */}
          <Line 
            type="monotone" 
            dataKey="iprPressure" 
            stroke="#8B4513" 
            name="IPR" 
            dot={false} 
            strokeWidth={2}
          />
          
          {/* Curva VLP */}
          <Line 
            type="monotone" 
            dataKey="vlpPressure" 
            stroke="#00BFFF" 
            name="VLP" 
            dot={false}
            strokeWidth={2}
          />
          
          {/* Líneas de referencia */}
          <ReferenceLine 
            y={baseParams.reservoirPressure} 
            stroke="black" 
            strokeDasharray="5 5"
            label={{ value: 'Pr', position: 'left', fill: 'black', fontSize: 12 }}
          />
          
          <ReferenceLine 
            y={baseParams.bubblePointPressure} 
            stroke="blue" 
            strokeDasharray="5 5"
            label={{ value: 'Pb', position: 'right', fill: 'blue', fontSize: 12 }}
          />
          
          {/* Punto de operación */}
          {operatingPoint && (
            <>
              <ReferenceLine 
                x={operatingPoint.flowRate} 
                stroke="red" 
                strokeDasharray="5 5" 
                label={{ value: 'Qop', position: 'top', fill: 'red', fontSize: 12 }}
              />
              <ReferenceLine 
                y={operatingPoint.pressure} 
                stroke="red" 
                strokeDasharray="5 5"
                label={{ value: 'Pwf', position: 'left', fill: 'red', fontSize: 12 }}
              />
            </>
          )}
          
          {/* Gráficos de comparación */}
          {showComparisonCurves && selectedTab === 'tubing' && renderTubingComparisonCurves()}
          {showComparisonCurves && selectedTab === 'gaslift' && renderGasLiftComparisonCurves()}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Renderizar tabla de resultados
  const renderResultsTable = () => {
    const comparisonPoints = getComparisonOperatingPoints();
    const hasComparisonData = Object.keys(comparisonPoints).length > 0;
    
    return (
      <div className="results-section">
        <h3>Resultados del Análisis Nodal</h3>
        
        <div className="results-current">
          <h4>Punto de Operación Actual:</h4>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Caudal: </span>
              <span className="result-value">{operatingPoint ? operatingPoint.flowRate.toFixed(2) : "N/A"} STB/d</span>
            </div>
            <div className="result-item">
              <span className="result-label">Pwf: </span>
              <span className="result-value">{operatingPoint ? operatingPoint.pressure.toFixed(2) : "N/A"} psi</span>
            </div>
            <div className="result-item">
              <span className="result-label">Draw Down: </span>
              <span className="result-value">{operatingPoint ? (baseParams.reservoirPressure - operatingPoint.pressure).toFixed(2) : "N/A"} psi</span>
            </div>
            <div className="result-item">
              <span className="result-label">Estado del fluido: </span>
              <span className="result-value">
                {operatingPoint && operatingPoint.pressure < baseParams.bubblePointPressure ? "Saturado" : "Subsaturado"}
              </span>
            </div>
          </div>
        </div>
        
        {hasComparisonData && showComparisonCurves && (
          <div className="results-comparison">
            <h4>Comparación de Escenarios:</h4>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Caso</th>
                  <th>Caudal (STB/d)</th>
                  <th>Pwf (psi)</th>
                  <th>Draw Down (psi)</th>
                  <th>Mejora en Caudal (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparisonPoints).map(([key, point]) => {
                  if (!point) return null;
                  
                  const nameMap = {
                    small: "Tubería 2.5\"",
                    current: tubingSize + "\"" + (isGasLiftActive ? " + Gas Lift" : ""),
                    large: "Tubería 4.5\"",
                    noGasLift: "Sin Gas Lift",
                    highGasLift: "Gas Lift Alto"
                  };
                  
                  // Calcular mejora respecto al caso base
                  const basePoint = comparisonPoints.noGasLift || comparisonPoints.small || comparisonPoints.current;
                  const improvement = basePoint && point.flowRate > 0 ? 
                    ((point.flowRate - basePoint.flowRate) / basePoint.flowRate * 100) : 0;
                  
                  return (
                    <tr key={key} className={key === 'current' ? "current-row" : ""}>
                      <td>{nameMap[key] || key}</td>
                      <td className="numeric">{point.flowRate.toFixed(2)}</td>
                      <td className="numeric">{point.pressure.toFixed(2)}</td>
                      <td className="numeric">{(baseParams.reservoirPressure - point.pressure).toFixed(2)}</td>
                      <td className="numeric">
                        {key === Object.keys(comparisonPoints)[0] ? 
                          'Base' : 
                          (improvement > 0 ? '+' : '') + improvement.toFixed(2) + '%'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Renderizar la sección de recomendaciones
  const renderRecommendations = () => {
    if (selectedTab === 'basic') return null;
    
    const comparisonPoints = getComparisonOperatingPoints();
    
    // Verificar si tenemos datos suficientes para hacer recomendaciones
    if (!operatingPoint || Object.keys(comparisonPoints).length <= 1) return null;
    
    let recommendationText = '';
    let actionItems = [];
    
    if (selectedTab === 'tubing') {
      const smallPoint = comparisonPoints.small;
      const largePoint = comparisonPoints.large;
      
      if (smallPoint && largePoint) {
        if (largePoint.flowRate > operatingPoint.flowRate && 
            largePoint.flowRate > smallPoint.flowRate) {
          recommendationText = "Se recomienda aumentar el diámetro de la tubería de producción para incrementar el caudal.";
          actionItems = [
            "Evaluar la viabilidad técnica de reemplazar la tubería actual por una de 4.5\"",
            "Realizar un análisis económico considerando costos de intervención vs. incremento de producción",
            "Verificar que la velocidad del fluido sea suficiente para evitar acumulación de líquidos"
          ];
        } else if (smallPoint.flowRate > operatingPoint.flowRate) {
          recommendationText = "La tubería más pequeña podría optimizar la producción en este caso específico.";
          actionItems = [
            "Analizar si la presión de fondo resultante está dentro de los límites operativos",
            "Evaluar el desgaste potencial por alta velocidad de fluidos",
            "Considerar un programa de monitoreo de presión más frecuente"
          ];
        } else {
          recommendationText = "El tamaño de tubería actual parece ser el óptimo para este pozo.";
          actionItems = [
            "Mantener el tamaño de tubería actual",
            "Considerar otras optimizaciones como sistemas de levantamiento artificial"
          ];
        }
      }
    } else if (selectedTab === 'gaslift') {
      const noGasLiftPoint = comparisonPoints.noGasLift;
      const highGasLiftPoint = comparisonPoints.highGasLift;
      
      if (isGasLiftActive && highGasLiftPoint) {
        if (highGasLiftPoint.flowRate > operatingPoint.flowRate) {
          recommendationText = "Incrementar la tasa de inyección de gas lift podría aumentar la producción.";
          actionItems = [
            `Aumentar gradualmente la inyección de gas hacia ${gasLiftRate + 0.5} MMscf/d`,
            "Monitorear la relación incremental gas-petróleo para identificar el punto óptimo",
            "Verificar que las instalaciones de superficie puedan manejar el volumen adicional de gas"
          ];
        } else {
          recommendationText = "La tasa actual de inyección de gas lift parece estar cerca del óptimo.";
          actionItems = [
            "Mantener la tasa actual de inyección",
            "Optimizar la profundidad de las válvulas de gas lift si es posible"
          ];
        }
      } else if (!isGasLiftActive && operatingPoint) {
        recommendationText = "Implementar un sistema de gas lift podría incrementar significativamente la producción.";
        actionItems = [
          "Diseñar un sistema de gas lift adecuado para las condiciones del pozo",
          "Evaluar la disponibilidad de gas para inyección",
          "Realizar un análisis económico del proyecto"
        ];
      }
    }
    
    if (!recommendationText) return null;
    
    return (
      <div className="recommendations-section">
        <h3>Recomendaciones</h3>
        <p>{recommendationText}</p>
        
        {actionItems.length > 0 && (
          <>
            <h4>Acciones sugeridas:</h4>
            <ul>
              {actionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="nodal-analysis-container">
      <h2>Simulador de Análisis Nodal en Ingeniería Petrolera</h2>
      
      {/* Pestañas de navegación */}
      <div className="tabs">
        <button 
          className={`tab ${selectedTab === 'basic' ? 'active' : ''}`}
          onClick={() => {
            setSelectedTab('basic');
            setShowComparisonCurves(false);
          }}
        >
          Análisis Básico
        </button>
        <button 
          className={`tab ${selectedTab === 'tubing' ? 'active' : ''}`}
          onClick={() => {
            setSelectedTab('tubing');
            setShowComparisonCurves(false);
          }}
        >
          Tamaño de Tubería
        </button>
        <button 
          className={`tab ${selectedTab === 'gaslift' ? 'active' : ''}`}
          onClick={() => {
            setSelectedTab('gaslift');
            setShowComparisonCurves(false);
          }}
        >
          Gas Lift
        </button>
      </div>
      
      {/* Contenido de la pestaña seleccionada */}
      {renderTabContent()}
      
      {/* Gráfico principal */}
      <div className="chart-container">
        {renderMainChart()}
      </div>
      
      {/* Tabla de resultados */}
      {operatingPoint && renderResultsTable()}
      
      {/* Recomendaciones */}
      {renderRecommendations()}
    </div>
  );
};

export default NodalAnalysis;