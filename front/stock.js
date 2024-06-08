const columna1 = document.getElementById('columna1');
const tabla = document.getElementById('tabla');

//----------------------------------------------------------------------------
const columna2 = document.getElementById('columna2');
const inputCodigoDeBarras = document.getElementById('inputCodigoDeBarras');
const inputNombre = document.getElementById('inputNombre');
const finalizarButton = document.getElementById('finalizarButton')
const inputCategoría = document.getElementById('categoría')

if (inputCategoría.focus) {
  da
}

// obtención de los productos desde la base de datos



const obtenerProductos = async () => {
try {
    const response = await fetch(`http://localhost:3000/productos`);
  if (response.ok) {
      const productosJson = await response.json();
      agregarProductoATabla(productosJson)
    }
  } catch (error) {
    console.error('Error al comunicarse con el servidor:', error);
    return null;
  }
};

obtenerProductos()

// añadir los productos a la tabla

function agregarProductoATabla(productos) {

for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    
    const row = tabla.insertRow();

    row.insertCell().textContent = producto.codigo;
    row.insertCell().textContent = producto.nombre;

    if(producto.precioPorUnidad === '0'){
        row.insertCell().textContent = producto.precioPorPeso;
        row.insertCell().textContent = producto.cantidadPeso;
    }

    if (producto.precioPorPeso=== '0') {
        row.insertCell().textContent = producto.precioPorUnidad;
        row.insertCell().textContent = producto.cantidadUnidad;
    }

    row.classList.add('nueva-fila');
  }}
