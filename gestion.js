import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GestionTaberna = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([
    { id: '001', nombre: 'Pisco Quebranta', categoria: 'Licores', stock: 25, precio: 45.00 },
    { id: '002', nombre: 'Coca Cola', categoria: 'Gaseosas', stock: 5, precio: 3.50 },
    { id: '003', nombre: 'Vaso Cervecero', categoria: 'Vasos', stock: 50, precio: 8.00 },
    { id: '004', nombre: 'Pisco Sour', categoria: 'Licores', stock: 30, precio: 28.00 },
    { id: '005', nombre: 'Monkey Special', categoria: 'Licores', stock: 20, precio: 35.00 },
    { id: '006', nombre: 'Chicha Morada', categoria: 'Gaseosas', stock: 15, precio: 22.00 },
    { id: '007', nombre: 'Cerveza Pilsen', categoria: 'Licores', stock: 40, precio: 14.00 }
  ]);

  const [ventas, setVentas] = useState([
    { id: 'V001', hora: '18:30', producto: 'Pisco Sour', cantidad: 3, total: 84.00, metodoPago: 'Efectivo', estado: 'Completado' },
    { id: 'V002', hora: '18:45', producto: 'Cerveza Pilsen', cantidad: 1, total: 14.00, metodoPago: 'Tarjeta', estado: 'Completado' },
    { id: 'V003', hora: '19:15', producto: 'Monkey Special', cantidad: 1, total: 35.00, metodoPago: 'Efectivo', estado: 'Pendiente' }
  ]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', categoria: '', stock: 0, precio: 0
  });

  const [nuevaVenta, setNuevaVenta] = useState({
    producto: '', cantidad: 1, metodoPago: 'Efectivo'
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [showVentaForm, setShowVentaForm] = useState(false);

  const agregarProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.categoria || nuevoProducto.stock < 0 || nuevoProducto.precio <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    const id = String(productos.length + 1).padStart(3, '0');
    setProductos([...productos, { id, ...nuevoProducto }]);
    setNuevoProducto({ nombre: '', categoria: '', stock: 0, precio: 0 });
    setShowProductForm(false);
    alert('Producto agregado exitosamente');
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const registrarVenta = () => {
    const producto = productos.find(p => p.nombre === nuevaVenta.producto);
    
    if (!producto) {
      alert('Selecciona un producto válido');
      return;
    }

    if (producto.stock < nuevaVenta.cantidad) {
      alert('Stock insuficiente');
      return;
    }

    setProductos(productos.map(p => 
      p.nombre === nuevaVenta.producto 
        ? { ...p, stock: p.stock - nuevaVenta.cantidad }
        : p
    ));

    const now = new Date();
    const hora = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const id = `V${String(ventas.length + 1).padStart(3, '0')}`;
    const total = producto.precio * nuevaVenta.cantidad;

    setVentas([...ventas, {
      id,
      hora,
      producto: nuevaVenta.producto,
      cantidad: nuevaVenta.cantidad,
      total,
      metodoPago: nuevaVenta.metodoPago,
      estado: 'Completado'
    }]);

    setNuevaVenta({ producto: '', cantidad: 1, metodoPago: 'Efectivo' });
    setShowVentaForm(false);
    alert('Venta registrada exitosamente');
  };

  const ventasCompletadas = ventas.filter(v => v.estado === 'Completado');
  const ventasHoy = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
  const promedioVenta = ventasCompletadas.length > 0 ? ventasHoy / ventasCompletadas.length : 0;

  const ventasPorProducto = {};
  ventasCompletadas.forEach(v => {
    ventasPorProducto[v.producto] = (ventasPorProducto[v.producto] || 0) + v.cantidad;
  });
  const productoMasVendido = Object.keys(ventasPorProducto).length > 0
    ? Object.keys(ventasPorProducto).reduce((a, b) => 
        ventasPorProducto[a] > ventasPorProducto[b] ? a : b
      )
    : 'N/A';

  const stockPorCategoria = {};
  productos.forEach(p => {
    stockPorCategoria[p.categoria] = (stockPorCategoria[p.categoria] || 0) + p.stock;
  });

  const dataStockCategoria = Object.keys(stockPorCategoria).map(cat => ({
    name: cat,
    stock: stockPorCategoria[cat]
  }));

  const metodosPagoData = {};
  ventasCompletadas.forEach(v => {
    metodosPagoData[v.metodoPago] = (metodosPagoData[v.metodoPago] || 0) + 1;
  });

  const dataMetodosPago = Object.keys(metodosPagoData).map(metodo => ({
    name: metodo,
    value: metodosPagoData[metodo]
  }));

  const dataProductosVendidos = Object.keys(ventasPorProducto).map(prod => ({
    name: prod,
    cantidad: ventasPorProducto[prod]
  })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);

  const dataVentasMensuales = [
    { mes: 'Ene', ventas: 12500 },
    { mes: 'Feb', ventas: 15200 },
    { mes: 'Mar', ventas: 18700 },
    { mes: 'Abr', ventas: 16300 },
    { mes: 'May', ventas: 19800 },
    { mes: 'Jun', ventas: 22400 },
    { mes: 'Jul', ventas: 21000 },
    { mes: 'Ago', ventas: 24500 },
    { mes: 'Sep', ventas: 23200 },
    { mes: 'Oct', ventas: Math.round(ventasHoy) }
  ];

  const COLORS = ['#720008', '#8B0010', '#A50018', '#C00020', '#444444'];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-gray-700 to-red-900 text-white p-8 mb-8 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Panel de Gestión</h1>
          <p className="text-lg opacity-90">Control de Productos y Ventas</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b-2">
            <button
              onClick={() => setActiveTab('productos')}
              className={`p-4 text-center transition-all ${
                activeTab === 'productos'
                  ? 'bg-white text-red-900 border-b-4 border-red-900 font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-white'
              }`}
            >
              <div className="text-2xl mb-1">📦</div>
              <div>Productos</div>
            </button>
            <button
              onClick={() => setActiveTab('ventas')}
              className={`p-4 text-center transition-all ${
                activeTab === 'ventas'
                  ? 'bg-white text-red-900 border-b-4 border-red-900 font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-white'
              }`}
            >
              <div className="text-2xl mb-1">💰</div>
              <div>Ventas</div>
            </button>
            <button
              onClick={() => setActiveTab('reportes')}
              className={`p-4 text-center transition-all ${
                activeTab === 'reportes'
                  ? 'bg-white text-red-900 border-b-4 border-red-900 font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-white'
              }`}
            >
              <div className="text-2xl mb-1">📊</div>
              <div>Reportes</div>
            </button>
          </div>

          {activeTab === 'productos' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 border-red-900 pb-2 inline-block">
                Control de Productos
              </h2>

              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-red-900 text-white px-6 py-3 rounded-lg mb-6 hover:bg-red-800 transition-all font-bold"
              >
                ➕ {showProductForm ? 'Cancelar' : 'Agregar Nuevo Producto'}
              </button>

              {showProductForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Nombre del Producto</label>
                      <input
                        type="text"
                        value={nuevoProducto.nombre}
                        onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-900 focus:outline-none"
                        placeholder="Ej: Pisco Acholado"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Categoría</label>
                      <select
                        value={nuevoProducto.categoria}
                        onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-900 focus:outline-none"
                      >
                        <option value="">Seleccionar...</option>
                        <option>Licores</option>
                        <option>Gaseosas</option>
                        <option>Insumos</option>
                        <option>Vasos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Stock Inicial</label>
                      <input
                        type="number"
                        value={nuevoProducto.stock}
                        onChange={(e) => setNuevoProducto({...nuevoProducto, stock: parseInt(e.target.value) || 0})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-900 focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Precio (S/.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={nuevoProducto.precio}
                        onChange={(e) => setNuevoProducto({...nuevoProducto, precio: parseFloat(e.target.value) || 0})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-900 focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={agregarProducto}
                    className="mt-4 bg-red-900 text-white px-6 py-3 rounded-lg hover:bg-red-800 font-bold"
                  >
                    Guardar Producto
                  </button>
                </div>
              )}

              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-red-900 to-gray-700 text-white">
                    <tr>
                      <th className="p-4 text-left">ID</th>
                      <th className="p-4 text-left">Producto</th>
                      <th className="p-4 text-left">Categoría</th>
                      <th className="p-4 text-left">Stock</th>
                      <th className="p-4 text-left">Precio</th>
                      <th className="p-4 text-left">Estado</th>
                      <th className="p-4 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{producto.id}</td>
                        <td className="p-4">{producto.nombre}</td>
                        <td className="p-4">{producto.categoria}</td>
                        <td className="p-4">{producto.stock}</td>
                        <td className="p-4">S/. {producto.precio.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            producto.stock > 10 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {producto.stock > 10 ? 'DISPONIBLE' : 'BAJO STOCK'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => eliminarProducto(producto.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ventas' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-red-900 pb-2 inline-block">
                Control de Ventas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-900">
                  <h4 className="text-gray-600 text-sm mb-2">Ventas de Hoy</h4>
                  <div className="text-3xl font-bold text-red-900">S/. {ventasHoy.toFixed(2)}</div>
                  <span className="text-gray-500 text-sm">{ventasCompletadas.length} transacciones</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-900">
                  <h4 className="text-gray-600 text-sm mb-2">Promedio por Venta</h4>
                  <div className="text-3xl font-bold text-red-900">S/. {promedioVenta.toFixed(2)}</div>
                  <span className="text-gray-500 text-sm">Actualizado en tiempo real</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-900">
                  <h4 className="text-gray-600 text-sm mb-2">Producto más Vendido</h4>
                  <div className="text-2xl font-bold text-red-900">{productoMasVendido}</div>
                  <span className="text-gray-500 text-sm">{ventasPorProducto[productoMasVendido] || 0} unidades</span>
                </div>
              </div>

              <button
                onClick={() => setShowVentaForm(!showVentaForm)}
                className="bg-red-900 text-white px-6 py-3 rounded-lg mb-6 hover:bg-red-800 transition-all font-bold"
              >
                ➕ {showVentaForm ? 'Cancelar' : 'Registrar Nueva Venta'}
              </button>

              {showVentaForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Producto</label>
                      <select
                        value={nuevaVenta.producto}
                        onChange={(e) => setNuevaVenta({...nuevaVenta, producto: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-900 focus:outline-none"
                      >
                        <option value="">Seleccionar producto...</option>
                        {productos.map(p => (
                          <option key={p.id} value={p.nombre}>
                            {p.nombre} - S/. {p.precio.toFixed(2)} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={nuevaVenta.cantidad}
                        onChange={(e) => setNuevaVenta({...nuevaVenta, cantidad: parseInt(e.target.value) || 1})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Método de Pago</label>
                      <select
                        value={nuevaVenta.metodoPago}
                        onChange={(e) => setNuevaVenta({...nuevaVenta, metodoPago: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-900 focus:outline-none"
                      >
                        <option>Efectivo</option>
                        <option>Tarjeta</option>
                        <option>Yape</option>
                        <option>Plin</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={registrarVenta}
                    className="mt-4 bg-red-900 text-white px-6 py-3 rounded-lg hover:bg-red-800 font-bold"
                  >
                    Registrar Venta
                  </button>
                </div>
              )}

              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-red-900 to-gray-700 text-white">
                    <tr>
                      <th className="p-4 text-left">ID Venta</th>
                      <th className="p-4 text-left">Hora</th>
                      <th className="p-4 text-left">Producto</th>
                      <th className="p-4 text-left">Cantidad</th>
                      <th className="p-4 text-left">Total</th>
                      <th className="p-4 text-left">Método Pago</th>
                      <th className="p-4 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((venta) => (
                      <tr key={venta.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{venta.id}</td>
                        <td className="p-4">{venta.hora}</td>
                        <td className="p-4">{venta.producto}</td>
                        <td className="p-4">{venta.cantidad}</td>
                        <td className="p-4">S/. {venta.total.toFixed(2)}</td>
                        <td className="p-4">{venta.metodoPago}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            venta.estado === 'Completado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {venta.estado.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reportes' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-red-900 pb-2 inline-block">
                Reportes y Estadísticas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg border">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-red-900 pb-2">
                    📈 Ventas Mensuales
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataVentasMensuales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => `S/. ${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="ventas" stroke="#720008" strokeWidth={3} name="Ventas (S/.)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-red-900 pb-2">
                    📦 Stock por Categoría
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataStockCategoria}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stock" fill="#720008" name="Unidades en Stock" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-red-900 pb-2">
                    🏆 Productos más Vendidos
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dataProductosVendidos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                      >
                        {dataProductosVendidos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-red-900 pb-2">
                    💳 Métodos de Pago
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dataMetodosPago}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataMetodosPago.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionTaberna;