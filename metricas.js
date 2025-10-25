// ============================================
// ESTADO GLOBAL
// ============================================
const AppState = {
    productos: [
        { id: 1, nombre: 'Pisco Quebranta', categoria: 'Licores', precio: 45.00 },
        { id: 2, nombre: 'Coca Cola', categoria: 'Gaseosas', precio: 3.50 },
        { id: 3, nombre: 'Vaso Cervecero', categoria: 'Vasos y Jarras', precio: 8.00 },
        { id: 4, nombre: 'Pisco Sour', categoria: 'Cócteles', precio: 28.00 },
        { id: 5, nombre: 'Chicha Morada', categoria: 'Bebidas Calientes', precio: 22.00 },
        { id: 6, nombre: 'Cerveza Pilsen', categoria: 'Cervezas', precio: 14.00 }
    ],
    // Ventas de ejemplo con fechas distribuidas por meses
    ventas: [
        // Enero
        { id: 1, fecha: '2025-01-05 18:30', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 3, total: 84.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 2, fecha: '2025-01-12 19:00', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 5, total: 70.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 3, fecha: '2025-01-20 20:15', productoId: 1, productoNombre: 'Pisco Quebranta', cantidad: 2, total: 90.00, metodoPago: 'Efectivo', estado: 'Completado' },
        // Febrero
        { id: 4, fecha: '2025-02-03 18:45', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 4, total: 112.00, metodoPago: 'Yape', estado: 'Completado' },
        { id: 5, fecha: '2025-02-14 19:30', productoId: 2, productoNombre: 'Coca Cola', cantidad: 10, total: 35.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 6, fecha: '2025-02-22 21:00', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 8, total: 112.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        // Marzo
        { id: 7, fecha: '2025-03-08 18:00', productoId: 1, productoNombre: 'Pisco Quebranta', cantidad: 3, total: 135.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 8, fecha: '2025-03-15 19:45', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 6, total: 168.00, metodoPago: 'Yape', estado: 'Completado' },
        { id: 9, fecha: '2025-03-28 20:30', productoId: 5, productoNombre: 'Chicha Morada', cantidad: 4, total: 88.00, metodoPago: 'Efectivo', estado: 'Completado' },
        // Abril
        { id: 10, fecha: '2025-04-05 19:00', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 12, total: 168.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 11, fecha: '2025-04-18 18:30', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 5, total: 140.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 12, fecha: '2025-04-25 21:00', productoId: 2, productoNombre: 'Coca Cola', cantidad: 15, total: 52.50, metodoPago: 'Yape', estado: 'Completado' },
        // Mayo
        { id: 13, fecha: '2025-05-10 19:15', productoId: 1, productoNombre: 'Pisco Quebranta', cantidad: 4, total: 180.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 14, fecha: '2025-05-20 20:00', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 10, total: 140.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 15, fecha: '2025-05-28 18:45', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 7, total: 196.00, metodoPago: 'Yape', estado: 'Completado' },
        // Junio
        { id: 16, fecha: '2025-06-05 19:30', productoId: 2, productoNombre: 'Coca Cola', cantidad: 20, total: 70.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 17, fecha: '2025-06-15 20:15', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 15, total: 210.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 18, fecha: '2025-06-25 21:00', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 8, total: 224.00, metodoPago: 'Yape', estado: 'Completado' },
        // Julio
        { id: 19, fecha: '2025-07-08 18:30', productoId: 1, productoNombre: 'Pisco Quebranta', cantidad: 5, total: 225.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 20, fecha: '2025-07-18 19:45', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 18, total: 252.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 21, fecha: '2025-07-28 20:30', productoId: 5, productoNombre: 'Chicha Morada', cantidad: 6, total: 132.00, metodoPago: 'Yape', estado: 'Completado' },
        // Agosto
        { id: 22, fecha: '2025-08-05 19:00', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 10, total: 280.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 23, fecha: '2025-08-15 20:15', productoId: 2, productoNombre: 'Coca Cola', cantidad: 25, total: 87.50, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 24, fecha: '2025-08-25 21:00', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 20, total: 280.00, metodoPago: 'Yape', estado: 'Completado' },
        // Septiembre
        { id: 25, fecha: '2025-09-10 18:45', productoId: 1, productoNombre: 'Pisco Quebranta', cantidad: 6, total: 270.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 26, fecha: '2025-09-20 19:30', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 12, total: 336.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 27, fecha: '2025-09-28 20:45', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 22, total: 308.00, metodoPago: 'Yape', estado: 'Completado' },
        // Octubre
        { id: 28, fecha: '2025-10-05 19:15', productoId: 4, productoNombre: 'Pisco Sour', cantidad: 15, total: 420.00, metodoPago: 'Efectivo', estado: 'Completado' },
        { id: 29, fecha: '2025-10-15 20:00', productoId: 2, productoNombre: 'Coca Cola', cantidad: 30, total: 105.00, metodoPago: 'Tarjeta', estado: 'Completado' },
        { id: 30, fecha: '2025-10-24 18:30', productoId: 6, productoNombre: 'Cerveza Pilsen', cantidad: 25, total: 350.00, metodoPago: 'Yape', estado: 'Completado' }
    ],
    charts: {}
};

// ============================================
// UTILIDADES
// ============================================
const Utils = {
    formatPrice: (price) => `S/. ${price.toFixed(2)}`,
    
    // Obtener mes de una fecha
    getMonth: (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.getMonth(); // 0-11
    },
    
    // Nombres de meses
    mesesNombres: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
};

// ============================================
// GESTIÓN DE MÉTRICAS
// ============================================
const MetricsManager = {
    update() {
        const totalVentas = AppState.ventas.reduce((sum, v) => sum + v.total, 0);
        const numVentas = AppState.ventas.length;
        const promedio = numVentas > 0 ? totalVentas / numVentas : 0;

        // Calcular producto más vendido
        const productosVendidos = AppState.ventas.reduce((acc, venta) => {
            acc[venta.productoNombre] = (acc[venta.productoNombre] || 0) + venta.cantidad;
            return acc;
        }, {});

        const [productoTop, maxVendido] = Object.entries(productosVendidos)
            .reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);

        // Actualizar métricas del día
        this.updateElement('metricVentasHoy', Utils.formatPrice(totalVentas));
        this.updateElement('metricTransacciones', `${numVentas} transacciones`);
        this.updateElement('metricPromedio', Utils.formatPrice(promedio));
        this.updateElement('metricProductoTop', productoTop || '-');
        this.updateElement('metricProductoTopUnidades', `${maxVendido} unidades`);

        // Actualizar resumen
        this.updateElement('ingresosTotales', Utils.formatPrice(totalVentas));
        this.updateElement('totalVentas', numVentas);
        this.updateElement('productosActivos', AppState.productos.length);
    },

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }
};

// ============================================
// GESTIÓN DE GRÁFICAS
// ============================================
const ChartManager = {
    config: {
        defaults: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#333',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        },
        colors: {
            primary: '#720008',
            secondary: '#a83e43',
            dark: '#444444',
            gray: '#666666',
            lightGray: '#999999',
            categorias: {
                'Licores': '#720008',
                'Cócteles': '#a83e43',
                'Cervezas': '#8b4513',
                'Gaseosas': '#ff6b6b',
                'Bebidas Calientes': '#c44569',
                'Botellas': '#596275',
                'Vasos y Jarras': '#95a5a6'
            }
        }
    },

    init() {
        this.initMonthlySales();
        this.updateCategorySales();
        this.updateTopProductsByMonth();
        this.updateTransactions();
    },

    destroyChart(name) {
        if (AppState.charts[name]) {
            AppState.charts[name].destroy();
            delete AppState.charts[name];
        }
    },

    // Gráfica de Ingresos Mensuales
    initMonthlySales() {
        const canvas = document.getElementById('ventasMensuales');
        if (!canvas) return;

        this.destroyChart('ventasMensuales');

        // Calcular ventas por mes
        const ventasPorMes = Array(12).fill(0);
        AppState.ventas.forEach(venta => {
            const mes = Utils.getMonth(venta.fecha);
            ventasPorMes[mes] += venta.total;
        });

        AppState.charts.ventasMensuales = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: Utils.mesesNombres,
                datasets: [{
                    label: 'Ingresos 2025 (S/.)',
                    data: ventasPorMes,
                    borderColor: this.config.colors.primary,
                    backgroundColor: 'rgba(114, 0, 8, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: this.config.colors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                ...this.config.defaults,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => Utils.formatPrice(value)
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Ingresos: ${Utils.formatPrice(context.parsed.y)}`
                        }
                    }
                }
            }
        });
    },

    // Gráfica de Número de Transacciones
    updateTransactions() {
        const canvas = document.getElementById('transaccionesMensuales');
        if (!canvas) return;

        this.destroyChart('transaccionesMensuales');

        // Calcular transacciones por mes
        const transaccionesPorMes = Array(12).fill(0);
        AppState.ventas.forEach(venta => {
            const mes = Utils.getMonth(venta.fecha);
            transaccionesPorMes[mes]++;
        });

        AppState.charts.transaccionesMensuales = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: Utils.mesesNombres,
                datasets: [{
                    label: 'Transacciones 2025',
                    data: transaccionesPorMes,
                    backgroundColor: this.config.colors.primary,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                ...this.config.defaults,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    },

    // NUEVA: Gráfica de Ventas por Categoría (Cantidad de productos)
    updateCategorySales() {
        const canvas = document.getElementById('ventasPorCategoria');
        if (!canvas) return;

        this.destroyChart('ventasPorCategoria');

        // Obtener todas las categorías únicas
        const categorias = [...new Set(AppState.productos.map(p => p.categoria))];
        
        // Crear datasets por cada categoría
        const datasets = categorias.map(categoria => {
            const ventasPorMes = Array(12).fill(0);
            
            // Calcular ventas por mes para esta categoría
            AppState.ventas.forEach(venta => {
                const producto = AppState.productos.find(p => p.nombre === venta.productoNombre);
                if (producto && producto.categoria === categoria) {
                    const mes = Utils.getMonth(venta.fecha);
                    ventasPorMes[mes] += venta.cantidad;
                }
            });

            return {
                label: categoria,
                data: ventasPorMes,
                borderColor: this.config.colors.categorias[categoria] || this.config.colors.gray,
                backgroundColor: `${this.config.colors.categorias[categoria] || this.config.colors.gray}33`,
                tension: 0.4,
                fill: false,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: this.config.colors.categorias[categoria] || this.config.colors.gray,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            };
        });

        AppState.charts.ventasPorCategoria = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: Utils.mesesNombres,
                datasets: datasets
            },
            options: {
                ...this.config.defaults,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad Vendida (unidades)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            stepSize: 5
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y} unidades`
                        }
                    }
                }
            }
        });
    },

    // NUEVA: Gráfica de Producto más vendido por mes
    updateTopProductsByMonth() {
        const canvas = document.getElementById('productosPorMes');
        if (!canvas) return;

        this.destroyChart('productosPorMes');

        // Obtener top 5 productos más vendidos en general
        const productosTotal = AppState.ventas.reduce((acc, venta) => {
            acc[venta.productoNombre] = (acc[venta.productoNombre] || 0) + venta.cantidad;
            return acc;
        }, {});

        const top5Productos = Object.entries(productosTotal)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([nombre]) => nombre);

        // Generar colores para los productos
        const colores = [
            this.config.colors.primary,
            this.config.colors.secondary,
            this.config.colors.dark,
            '#8b4513',
            '#c44569'
        ];

        // Crear datasets por cada producto
        const datasets = top5Productos.map((producto, index) => {
            const ventasPorMes = Array(12).fill(0);
            
            // Calcular ventas por mes para este producto
            AppState.ventas.forEach(venta => {
                if (venta.productoNombre === producto) {
                    const mes = Utils.getMonth(venta.fecha);
                    ventasPorMes[mes] += venta.cantidad;
                }
            });

            return {
                label: producto,
                data: ventasPorMes,
                backgroundColor: colores[index],
                borderColor: '#ffffff',
                borderWidth: 2,
                borderRadius: 6
            };
        });

        AppState.charts.productosPorMes = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: Utils.mesesNombres,
                datasets: datasets
            },
            options: {
                ...this.config.defaults,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad Vendida (unidades)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            stepSize: 5
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y} unidades`
                        }
                    }
                }
            }
        });
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    MetricsManager.update();
    ChartManager.init();

    console.log('✅ Sistema de Métricas cargado correctamente');
    console.log('📊 Gráficas inicializadas:', Object.keys(AppState.charts));
});