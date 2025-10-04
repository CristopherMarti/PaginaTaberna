// gestion.js - Script para gestión de gráficas

// Gráfica de Ventas Mensuales
const ctxVentas = document.getElementById('ventasMensuales').getContext('2d');
new Chart(ctxVentas, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
        datasets: [{
            label: 'Ventas (S/.)',
            data: [12500, 15200, 18700, 16300, 19800, 22400, 21000, 24500, 23200, 26800],
            borderColor: '#720008',
            backgroundColor: 'rgba(114, 0, 8, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'S/. ' + value.toLocaleString();
                    }
                }
            }
        }
    }
});

// Gráfica de Stock por Categoría
const ctxStock = document.getElementById('stockCategoria').getContext('2d');
new Chart(ctxStock, {
    type: 'bar',
    data: {
        labels: ['Licores', 'Gaseosas', 'Insumos', 'Vasos y Jarras'],
        datasets: [{
            label: 'Unidades en Stock',
            data: [145, 89, 234, 156],
            backgroundColor: [
                'rgba(114, 0, 8, 0.8)',
                'rgba(68, 68, 68, 0.8)',
                'rgba(114, 0, 8, 0.6)',
                'rgba(68, 68, 68, 0.6)'
            ],
            borderColor: [
                '#720008',
                '#444444',
                '#720008',
                '#444444'
            ],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Gráfica de Productos más Vendidos
const ctxProductos = document.getElementById('productosMasVendidos').getContext('2d');
new Chart(ctxProductos, {
    type: 'doughnut',
    data: {
        labels: ['Pisco Sour', 'Cerveza Pilsen', 'Monkey Special', 'Chicha Morada', 'Otros'],
        datasets: [{
            data: [285, 198, 167, 142, 208],
            backgroundColor: [
                '#720008',
                '#8B0010',
                '#A50018',
                '#C00020',
                '#444444'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            }
        }
    }
});

// Gráfica de Métodos de Pago
const ctxPago = document.getElementById('metodosPago').getContext('2d');
new Chart(ctxPago, {
    type: 'pie',
    data: {
        labels: ['Efectivo', 'Tarjeta', 'Yape', 'Plin'],
        datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
                '#720008',
                '#444444',
                '#8B0010',
                '#666666'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});