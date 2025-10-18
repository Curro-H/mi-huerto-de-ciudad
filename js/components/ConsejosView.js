/**
 * Componente ConsejosView
 * Vista completa con consejos y guías para el huerto en Málaga
 */

function ConsejosView() {
  const h = React.createElement;
  const mesActual = new Date().getMonth();
  const nombreMesActual = window.MESES[mesActual];
  const infoMesActual = window.CALENDARIO_MALAGA[mesActual];

  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' } },
    
    // Clima de Málaga
    h('div', { className: 'card' },
      h('div', { className: 'card-body' },
        h('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)', 
            marginBottom: 'var(--space-4)' 
          } 
        },
          h(window.Icons.Sun, { size: 32 }),
          h('h2', { className: 'heading-2', style: { margin: 0 } }, 'Clima de Málaga')
        ),
        h('p', { className: 'text-body', style: { marginBottom: 'var(--space-4)' } },
          'Málaga goza de un clima mediterráneo excepcional con más de 300 días de sol al año. Los inviernos son suaves con temperaturas de 15-18°C y los veranos cálidos superan los 30°C.'
        ),
        
        h('div', { className: 'info-box' },
          h('div', { className: 'info-box-header' },
            h(window.Icons.AlertCircle, { size: 20 }),
            h('span', null, 'Época actual (' + nombreMesActual + ')')
          ),
          h('div', { className: 'info-box-content' },
            h('p', { style: { marginBottom: 'var(--space-2)' } },
              h('strong', null, 'Siembra directa: '),
              infoMesActual.siembraDirecta.join(', ')
            ),
            h('p', { style: { margin: 0 } }, infoMesActual.clima)
          )
        )
      )
    ),

    // Riego
    h('div', { className: 'card' },
      h('div', { className: 'card-body' },
        h('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)', 
            marginBottom: 'var(--space-4)' 
          } 
        },
          h(window.Icons.Droplet, { size: 32 }),
          h('h2', { className: 'heading-2', style: { margin: 0 } }, 'Riego en Clima Mediterráneo')
        ),
        
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' } },
          // Verano
          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#DBEAFE', 
              borderRadius: 'var(--radius-lg)' 
            } 
          },
            h('h3', { 
              className: 'heading-4', 
              style: { color: '#1E40AF', marginBottom: 'var(--space-2)' } 
            }, '☀️ Verano (Junio-Septiembre)'),
            h('ul', { style: { marginLeft: 'var(--space-6)', marginBottom: 0 } },
              h('li', null, h('strong', null, 'Riego diario o cada 2 días'), ' según temperaturas'),
              h('li', null, h('strong', null, '1 litro por planta al día'), ' para tomates, calabacines, berenjenas'),
              h('li', null, h('strong', null, 'Horario:'), ' temprano por la mañana o al atardecer'),
              h('li', null, 'Evitar regar en horas de máximo calor para prevenir evaporación')
            )
          ),

          // Otoño-Invierno
          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#D1FAE5', 
              borderRadius: 'var(--radius-lg)' 
            } 
          },
            h('h3', { 
              className: 'heading-4', 
              style: { color: '#065F46', marginBottom: 'var(--space-2)' } 
            }, '🍂 Otoño-Invierno'),
            h('ul', { style: { marginLeft: 'var(--space-6)', marginBottom: 0 } },
              h('li', null, h('strong', null, 'Reducir frecuencia'), ' - el suelo retiene más humedad'),
              h('li', null, h('strong', null, 'Adaptar a lluvias'), ' naturales de la temporada'),
              h('li', null, 'Riego moderado según condiciones meteorológicas')
            )
          ),

          // Técnicas
          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#F3E8FF', 
              borderRadius: 'var(--radius-lg)' 
            } 
          },
            h('h3', { 
              className: 'heading-4', 
              style: { color: '#6B21A8', marginBottom: 'var(--space-2)' } 
            }, '💡 Técnicas de Ahorro'),
            h('ul', { style: { marginLeft: 'var(--space-6)', marginBottom: 0 } },
              h('li', null, h('strong', null, 'Mulching o acolchado:'), ' paja, hojas secas o compost para retener humedad'),
              h('li', null, h('strong', null, 'Riego por goteo:'), ' sistema eficiente que ahorra agua'),
              h('li', null, h('strong', null, 'Programador de riego:'), ' mantiene regularidad sin desperdicios')
            )
          )
        )
      )
    ),

    // Rotación de Cultivos
    h('div', { className: 'card' },
      h('div', { className: 'card-body' },
        h('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)', 
            marginBottom: 'var(--space-4)' 
          } 
        },
          h(window.Icons.Sprout, { size: 32 }),
          h('h2', { className: 'heading-2', style: { margin: 0 } }, 'Rotación y Asociación')
        ),
        h('p', { className: 'text-body', style: { marginBottom: 'var(--space-4)' } },
          'La rotación de cultivos es fundamental para mantener la salud del suelo y prevenir enfermedades. Evita plantar la misma familia de hortalizas en el mismo bancal dos años consecutivos.'
        ),
        
        h('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'var(--space-4)' 
          } 
        },
          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#FED7AA', 
              borderRadius: 'var(--radius-lg)', 
              borderLeft: '4px solid #9A3412' 
            } 
          },
            h('h4', { 
              className: 'heading-5', 
              style: { color: '#9A3412', marginBottom: 'var(--space-2)' } 
            }, '🥕 Cultivos de Raíz'),
            h('p', { className: 'text-small' }, 'Zanahorias, remolachas, rabanitos, nabos')
          ),

          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#D1FAE5', 
              borderRadius: 'var(--radius-lg)', 
              borderLeft: '4px solid #065F46' 
            } 
          },
            h('h4', { 
              className: 'heading-5', 
              style: { color: '#065F46', marginBottom: 'var(--space-2)' } 
            }, '🥬 Cultivos de Hoja'),
            h('p', { className: 'text-small' }, 'Lechugas, espinacas, acelgas, coles')
          ),

          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#FEE2E2', 
              borderRadius: 'var(--radius-lg)', 
              borderLeft: '4px solid #991B1B' 
            } 
          },
            h('h4', { 
              className: 'heading-5', 
              style: { color: '#991B1B', marginBottom: 'var(--space-2)' } 
            }, '🍅 Cultivos de Fruto'),
            h('p', { className: 'text-small' }, 'Tomates, pimientos, berenjenas, calabacines')
          ),

          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#ECFCCB', 
              borderRadius: 'var(--radius-lg)', 
              borderLeft: '4px solid #365314' 
            } 
          },
            h('h4', { 
              className: 'heading-5', 
              style: { color: '#365314', marginBottom: 'var(--space-2)' } 
            }, '🌱 Leguminosas'),
            h('p', { className: 'text-small' }, 'Habas, guisantes, judías (enriquecen el suelo con nitrógeno)')
          )
        )
      )
    ),

    // Tomates
    h('div', { className: 'card' },
      h('div', { className: 'card-body' },
        h('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)', 
            marginBottom: 'var(--space-4)' 
          } 
        },
          h('span', { style: { fontSize: '2rem' } }, '🍅'),
          h('h2', { className: 'heading-2', style: { margin: 0 } }, 'Tomates: El Rey del Huerto')
        ),
        
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#FEE2E2', 
              borderRadius: 'var(--radius-lg)' 
            } 
          },
            h('p', { 
              className: 'text-semibold', 
              style: { marginBottom: 'var(--space-2)' } 
            }, '📅 Calendario del Tomate'),
            h('ul', { 
              style: { 
                marginLeft: 'var(--space-6)', 
                marginBottom: 0, 
                fontSize: 'var(--font-size-sm)' 
              } 
            },
              h('li', null, h('strong', null, 'Semillero:'), ' Enero-Marzo (protegido)'),
              h('li', null, h('strong', null, 'Trasplante:'), ' Abril-Mayo (T° nocturna > 10°C)'),
              h('li', null, h('strong', null, 'Temperatura ideal:'), ' 20-35°C'),
              h('li', null, h('strong', null, 'Sol necesario:'), ' 6-10 horas diarias')
            )
          ),
          
          h('div', { 
            style: { 
              padding: 'var(--space-4)', 
              background: '#DBEAFE', 
              borderRadius: 'var(--radius-lg)' 
            } 
          },
            h('p', { 
              className: 'text-semibold', 
              style: { marginBottom: 'var(--space-2)' } 
            }, '💧 Riego de Tomates'),
            h('p', { className: 'text-small', style: { margin: 0 } },
              h('strong', null, 'Verano:'), 
              ' 1 litro diario por planta, o 2-3 litros cada 2-3 días. En Málaga se pueden cultivar tomates todo el año gracias al clima favorable.'
            )
          )
        )
      )
    ),

    // Plantas Aromáticas
    h('div', { className: 'card' },
      h('div', { className: 'card-body' },
        h('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)', 
            marginBottom: 'var(--space-4)' 
          } 
        },
          h('span', { style: { fontSize: '2rem' } }, '🌿'),
          h('h2', { className: 'heading-2', style: { margin: 0 } }, 'Plantas Aromáticas')
        ),
        
        h('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: 'var(--space-3)' 
          } 
        },
          [
            { name: 'Albahaca', season: 'Primavera (Mar-May). Mínimo 6h sol', color: '#10B981' },
            { name: 'Romero', season: 'Primavera u otoño. Muy resistente', color: '#8B5CF6' },
            { name: 'Perejil', season: 'Todo el año. Mejor Feb-Sep', color: '#84CC16' },
            { name: 'Cilantro', season: 'Otoño en climas cálidos como Málaga', color: '#14B8A6' },
            { name: 'Orégano', season: 'Primavera u otoño. Temperatura 20°C', color: '#EC4899' }
          ].map((planta, idx) =>
            h('div', { 
              key: idx,
              style: { 
                padding: 'var(--space-3)', 
                borderLeft: '4px solid ' + planta.color,
                background: 'var(--color-neutral-50)',
                borderRadius: 'var(--radius-md)'
              } 
            },
              h('p', { 
                className: 'text-bold', 
                style: { color: planta.color, marginBottom: 'var(--space-1)' } 
              }, '🌱 ' + planta.name),
              h('p', { 
                className: 'text-small text-muted', 
                style: { margin: 0 } 
              }, planta.season)
            )
          )
        )
      )
    ),

    // Preparación del Suelo
    h('div', { className: 'card' },
      h('div', { className: 'card-body' },
        h('div', { 
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-3)', 
            marginBottom: 'var(--space-4)' 
          } 
        },
          h('span', { style: { fontSize: '2rem' } }, '🌍'),
          h('h2', { className: 'heading-2', style: { margin: 0 } }, 'Preparación del Suelo')
        ),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
          h('p', { className: 'text-semibold' }, 'Antes de cada temporada de siembra:'),
          h('ul', { style: { marginLeft: 'var(--space-6)' } },
            h('li', { style: { display: 'flex', gap: 'var(--space-2)' } },
              h('span', { style: { color: 'var(--color-success)' } }, '✓'),
              h('span', null, h('strong', null, 'Laborear'), ' la tierra con horca de cavar')
            ),
            h('li', { style: { display: 'flex', gap: 'var(--space-2)' } },
              h('span', { style: { color: 'var(--color-success)' } }, '✓'),
              h('span', null, h('strong', null, 'Añadir estiércol curado'), ' de caballo o compost maduro')
            ),
            h('li', { style: { display: 'flex', gap: 'var(--space-2)' } },
              h('span', { style: { color: 'var(--color-success)' } }, '✓'),
              h('span', null, h('strong', null, 'Dejar reposar'), ' la tierra antes del trasplante')
            ),
            h('li', { style: { display: 'flex', gap: 'var(--space-2)' } },
              h('span', { style: { color: 'var(--color-success)' } }, '✓'),
              h('span', null, 'Asegurar ', h('strong', null, 'buen drenaje'), ' y nutrientes necesarios')
            )
          )
        )
      )
    )
  );
}

window.ConsejosView = ConsejosView;