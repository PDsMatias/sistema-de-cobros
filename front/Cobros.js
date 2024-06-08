const columna1 = document.getElementById('columna1');
const pageItems = document.getElementById('pageItems');
//---------------------------------------------------------------------------
const tabla = document.getElementById('tabla');
const mensajeNoEncontrado = document.getElementById('mensajeNoEncontrado');
const MensajeproductoRepetido = document.getElementById('MensajeproductoRepetido');
const MensajeproductoSinPeso = document.getElementById('MensajeproductoSinPeso');
const MensajefinalizarSinPeso = document.getElementById('MensajefinalizarSinPeso');
const MensajefinalizarSinProductos = document.getElementById('FinalizarSinProductos');
const MensajefinalizarSinPrecioEntextarea = document.getElementById('MensajefinalizarSinPrecioEntextarea');
const MensajefinalizarSinNombreEntextarea = document.getElementById('MensajefinalizarSinNombreEntextarea');

function VisibilidadDeAlertas(elemento, visible) {
  if (visible) 
    elemento.classList.remove('hidden');
  else 
    elemento.classList.add('hidden');
}
//----------------------------------------------------------------------------
const columna2 = document.getElementById('columna2');
const inputCodigoDeBarras = document.getElementById('inputCodigoDeBarras');
const inputNombre = document.getElementById('inputNombre');
const datalistProductos = document.getElementById('datalistProductos');
const finalizarButton = document.getElementById('finalizarButton')

inputCodigoDeBarras.focus();

// pagina de consulta de precios

const datalistProductosConsulta = document.getElementById('datalistProductosConsulta')
const paginaConsultaPrecios = document.getElementById('consultarPreciosDiv')
const inputCodigoConsulta   = document.getElementById('inputCodigoDeBarrasConsulta')
const inputNombreConsulta   = document.getElementById('inputNombreConsulta')
const precioConsultaDiv = document.getElementById('precioConsulta')

document.addEventListener('keydown', function(event) {
  if (event.key === "-") {
    
    event.preventDefault();
    paginaConsultaPrecios.classList.toggle('hidden');
    precioConsultaDiv.textContent = ''

    if (!paginaConsultaPrecios.classList.contains('hidden')) {
      inputCodigoConsulta.focus(); 
      pageItems.classList.add('blur')

        // seleccionar la busqueda por nombre
        paginaConsultaPrecios.addEventListener( 'keydown', (event) => {
          if (event.key === "/"){ 
            if (inputCodigoConsulta.focus) {
              event.preventDefault()
              inputNombreConsulta.focus()
            }
        } 
        })

        // seleccionar la busqueda por codigo de barra
        paginaConsultaPrecios.addEventListener( 'keydown', (event) => {
          if (event.key === "*"){ 
            if (inputNombreConsulta.focus) {
              event.preventDefault()
              inputCodigoConsulta.focus()
            }
        } 
        })
    }
    if (paginaConsultaPrecios.classList.contains('hidden')) {
      inputCodigoConsulta.value = ''
      inputCodigoConsulta.value = ''
      inputCodigoDeBarras.focus()
      pageItems.classList.remove('blur')
    }
  }
});

inputCodigoConsulta.addEventListener('input', async () =>{
	
    
    let codigo = inputCodigoConsulta.value;
	await new Promise(resolve => setTimeout(resolve, 500));
	const producto = await obtenerProductoConsulta(codigo, "codigo");

    if (producto) {
    
  if (producto.precioPorPeso != "0") {
    precioConsultaDiv.textContent = producto.nombre + ': $' +  producto.precioPorPeso
  }

  if (producto.precioPorUnidad != "0") {
    precioConsultaDiv.textContent =  producto.nombre + ': $' + producto.precioPorUnidad
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
  precioConsultaDiv.textContent = ''
}

  inputCodigoConsulta.value = ''
  inputCodigoConsulta.focus()
})

inputNombreConsulta.addEventListener("input", function() {
  const consulta = inputNombreConsulta.value; if (consulta.length >= 2) { mostrarOpcionesConsulta(consulta)
}})

async function mostrarOpcionesConsulta(consulta) {
  
  const searchTerm = consulta.toLowerCase();
  
 const productos = await obtenerProductosPorNombre(searchTerm);
    datalistProductosConsulta.innerHTML = '';
          
    productos.forEach((producto) => {
      const option = document.createElement('option');
      option.value = producto.nombre;
      datalistProductosConsulta.appendChild(option);
    });
}

inputNombreConsulta.addEventListener('input', async function agregarPorNombreConsulta(event) {

  const selectedProductName = event.target.value;
    
    obtenerProductosPorNombre(selectedProductName).then(matchedProducts => {
    const matchedProduct = matchedProducts.find(product => product.nombre === selectedProductName);
  
      if (matchedProduct) {
        inputNombreConsulta.value = '';
        datalistProductosConsulta.innerHTML = '';

        const precioConsulta = document.getElementById('precioConsulta')

        if (matchedProduct.precioPorUnidad === '0') {
          precioConsulta.textContent = matchedProduct.nombre + ': $' + matchedProduct.precioPorPeso
        }
      
        if (matchedProduct.precioPorPeso === '0') {
          precioConsulta.textContent = matchedProduct.nombre + ': $' + matchedProduct.precioPorUnidad
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    precioConsultaDiv.textContent = ''
});

const obtenerProductoConsulta = async (valor, tipo) => {

        const response = await fetch(`http://localhost:3000/producto/${tipo}/${valor}`);
        let productoJson;
		
        if (!response.ok) {
            if (response.status === 404) {
                console.log('404');
				return;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }
		
		const responseBody = await response.text();
        productoJson = responseBody ? JSON.parse(responseBody) : null;

        inputCodigoConsulta.value = '';
        return productoJson;
};
 
function obtenerMitadDelString(cadena) {
  
  var longitud = cadena.length;
  
  var mitad = Math.floor(longitud / 2);
  
  var mitadDeCadena = cadena.substring(0, mitad);

  return mitadDeCadena;
}

function dividirStringEntreTres(cadena) {
  
  var longitud = cadena.length;
  
  var dividir3 = Math.floor(longitud / 3);
  
  var cadenaDivididoTres = cadena.substring(0, dividir3);

  return cadenaDivididoTres;
}

// obtención del producto desde la base de datos
const obtenerProducto = async (valor, tipo) => {
	
	if(valor.length > 13 && valor.length <= 26){
	const repetido2 = obtenerMitadDelString(valor);
	
	if(repetido2){
		
		try {
        const response = await fetch(`http://localhost:3000/producto/${tipo}/${repetido2}`);

        if (!response.ok) {
            if (response.status === 404) {
                console.log('error de server');
				agregarProductoDesconocido(repetido2);
				return;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        inputCodigoConsulta.value = '';
        inputCodigoDeBarras.value = '';

        let productoJson;

        try {
            const responseBody = await response.text();
            productoJson = responseBody ? JSON.parse(responseBody) : null;
        } catch (jsonError) {
            console.error(jsonError);
            throw new Error('Error parsing JSON');
        }

        // if(productoJson.codigo == 7798119220183){
		   // const speeds = [{id: 152, nombre: 'Speed x 250ml', codigo: '7798119220183', precioPorPeso: '0', precioPorUnidad: '450'},{id: 153, nombre: 'Speed x 473ml', codigo: '7798119220183', precioPorPeso: '0', precioPorUnidad: '690'}]
		   // speeds.forEach((producto) => {
			   	  // const filaExistente = encontrarProductoEnTabla(producto.nombre);
                  // if (filaExistente) {
                  // actualizarCantidad(filaExistente);
				  // return
                  // }					  
			   // agregarProductoATabla(producto);
		   // });
		   // return
	   // }

        VisibilidadDeAlertas(mensajeNoEncontrado, false);
        return productoJson;
    } catch (error) {
        console.log('404');
        VisibilidadDeAlertas(mensajeNoEncontrado, true);
		agregarProductoDesconocido(repetido2);
    }
		return
	}
    }
	
	if(valor.length > 26){
	const repetido3 = dividirStringEntreTres(valor)
	
	if(repetido3){
		
		try {
        const response = await fetch(`http://localhost:3000/producto/${tipo}/${repetido3}`);

        if (!response.ok) {
            if (response.status === 404) {
                console.log('error de server');
				agregarProductoDesconocido(repetido3);
				return;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        inputCodigoConsulta.value = '';
        inputCodigoDeBarras.value = '';

        let productoJson;

        try {
            const responseBody = await response.text();
            productoJson = responseBody ? JSON.parse(responseBody) : null;
        } catch (jsonError) {
            console.error(jsonError);
            throw new Error('Error parsing JSON');
        }

        if(productoJson.codigo == 7798119220183){
		   const speeds = [{id: 152, nombre: 'Speed x 250ml', codigo: '7798119220183', precioPorPeso: '0', precioPorUnidad: '450'},{id: 153, nombre: 'Speed x 473ml', codigo: '7798119220183', precioPorPeso: '0', precioPorUnidad: '690'}]
		   speeds.forEach((producto) => {
			   	  const filaExistente = encontrarProductoEnTabla(producto.nombre);
                  if (filaExistente) {
                  actualizarCantidad(filaExistente);
				  return
                  }					  
			   agregarProductoATabla(producto);
		   });
		   return
	   }

        VisibilidadDeAlertas(mensajeNoEncontrado, false);
        return productoJson;
    } catch (error) {
        console.log('404');
        VisibilidadDeAlertas(mensajeNoEncontrado, true);
		agregarProductoDesconocido(repetido3);
    }
		return
	}
	}

		
    try {
        const response = await fetch(`http://localhost:3000/producto/${tipo}/${valor}`);

        if (!response.ok) {
            if (response.status === 404) {
                console.log('error de server');
				agregarProductoDesconocido(valor);
				return;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        inputCodigoConsulta.value = '';
        inputCodigoDeBarras.value = '';

        let productoJson;

        try {
            const responseBody = await response.text();
            productoJson = responseBody ? JSON.parse(responseBody) : null;
        } catch (jsonError) {
            console.error(jsonError);
            throw new Error('Error parsing JSON');
        }

        if(productoJson.codigo == 7798119220183){
		   const speeds = [{id: 152, nombre: 'Speed x 250ml', codigo: '7798119220183', precioPorPeso: '0', precioPorUnidad: '450'},{id: 153, nombre: 'Speed x 473ml', codigo: '7798119220183', precioPorPeso: '0', precioPorUnidad: '690'}]
		   speeds.forEach((producto) => {
			   	  const filaExistente = encontrarProductoEnTabla(producto.nombre);
                  if (filaExistente) {
                  actualizarCantidad(filaExistente);
				  return
                  }					  
			   agregarProductoATabla(producto);
		   });
		   return
	   }

        VisibilidadDeAlertas(mensajeNoEncontrado, false);
        return productoJson;
    } catch (error) {
        VisibilidadDeAlertas(mensajeNoEncontrado, true);
		agregarProductoDesconocido(valor);
    }
};

// procesos para añadir un producto a la tabla
function agregarProductoDesconocido(codigo){
	
	if(codigo == null){
	return
	}
	
	if(codigo == '+'){
	return
	}
	
	const filaExistente = encontrarProductoEnTabla(codigo)
  
	if (filaExistente) {
	actualizarCantidad(filaExistente);
	return
	}
	
	  const row = tabla.insertRow();
	  // codigo null
      const cellCodigo = row.insertCell();
	  cellCodigo.textContent = codigo;
	  cellCodigo.style.fontSize = '10px';
	  // nombre input
	 
	  const cellNombre = row.insertCell();
      const textareaNombre = document.createElement('textarea');
    
      textareaNombre.placeholder = '(nombre)';
      textareaNombre.classList.add('mi-textarea-estilos');
      textareaNombre.style.marginRight = '5px';
	  textareaNombre.style.marginTop = '5px';
	  
	  row.classList.add('desconocido');
	  
      cellNombre.appendChild(textareaNombre)
	  textareaNombre.focus(); 
	  
	  textareaNombre.addEventListener('input', function() {
		VisibilidadDeAlertas(MensajefinalizarSinNombreEntextarea, false)
		VisibilidadDeAlertas(mensajeNoEncontrado, false)
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	  });
	  
	  textareaNombre.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
		event.preventDefault()
        textareaPrecio.focus()
      }
	  });
	  
	  // precio input
	  
	  const cellPrecio = row.insertCell();
      const textareaPrecio = document.createElement('textarea');
    
      textareaPrecio.placeholder = '(precio)';
      textareaPrecio.classList.add('mi-textarea-estilos')
	  textareaPrecio.style.marginLeft = '5px';
	  textareaPrecio.style.marginTop = '5px';
      
      textareaPrecio.addEventListener('input', calcularTotal)
      cellPrecio.appendChild(textareaPrecio)
	  
	  textareaPrecio.addEventListener('input', function() {
	  VisibilidadDeAlertas(MensajefinalizarSinPrecioEntextarea, false)
	  VisibilidadDeAlertas(mensajeNoEncontrado, false)
		
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
		
		var valorActual = event.target.value;
		var soloNumeros = valorActual.replace(/[^0-9]/g, '');
		event.target.value = soloNumeros;
		
		calcularTotal();
		});
	  
	  textareaPrecio.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        inputCodigoDeBarras.focus()
      }
	  });
	  // cantidad 
	  
	  const cellCantidad = row.insertCell();
      const cellRestar = row.insertCell();
      const cellSumar= row.insertCell();
    
      cellCantidad.textContent = 1;
      const sumarBtn = document.createElement('button');
      const restarBtn = document.createElement('button');

      restarBtn.textContent = '-';
      sumarBtn.textContent = '+';

      restarBtn.classList.add('button')
      restarBtn.classList.add('btn')

      sumarBtn.classList.add('button')
      sumarBtn.classList.add('btn')

      cellRestar.appendChild(restarBtn);
      cellSumar.appendChild(sumarBtn);

      row.classList.add('nueva-fila');
      restarBtn.addEventListener('click', () => restarCantidad(row, cellCantidad));
      sumarBtn.addEventListener('click', () => actualizarCantidad(row));
      sumarBtn.addEventListener('click', () => {
		  VisibilidadDeAlertas(mensajeNoEncontrado,false);
	  });
      calcularTotal();
}
function agregarProductoATabla(producto) {
	

  if (producto.precioPorUnidad === "0") {
    agregarProductoPorPeso(producto)
    return;
  }
  

  const filaExistente = encontrarProductoEnTabla(producto.nombre);
  
  if (filaExistente) {
    actualizarCantidad(filaExistente);
  }
  
  if(producto.nombre){
    const row = tabla.insertRow();
    const cellcodigo = row.insertCell()
    cellcodigo.textContent = producto.codigo;
    cellcodigo.style.fontSize = '10px';
    row.insertCell().textContent = producto.nombre;
    row.insertCell().textContent = producto.precioPorUnidad;
    const cellCantidad = row.insertCell();
    const cellRestar = row.insertCell();
    const cellSumar= row.insertCell();
	
	row.classList.add('unidad');
    
    cellCantidad.textContent = 1;
    const sumarBtn = document.createElement('button');
    const restarBtn = document.createElement('button');

    restarBtn.textContent = '-';
    sumarBtn.textContent = '+';

    restarBtn.classList.add('button')
    restarBtn.classList.add('btn')

    sumarBtn.classList.add('button')
    sumarBtn.classList.add('btn')

    cellRestar.appendChild(restarBtn);
    cellSumar.appendChild(sumarBtn);

    row.classList.add('nueva-fila');
    restarBtn.addEventListener('click', () => restarCantidad(row, cellCantidad));
    sumarBtn.addEventListener('click', () => actualizarCantidad(row));
  
  inputNombre.value = '';
  datalistProductos.innerHTML = '';
  VisibilidadDeAlertas(MensajeproductoRepetido, false)
  VisibilidadDeAlertas(MensajefinalizarSinProductos, false)
  VisibilidadDeAlertas(mensajeNoEncontrado, false)

  calcularTotal();
  return;
  }
  agregarProductoDesconocido()
}
function agregarProductoPorPeso(producto){

  const filaExistente = encontrarProductoEnTabla(producto.nombre);
    
    if (filaExistente) {
      VisibilidadDeAlertas(MensajeproductoRepetido, true)
      return;
    } 
    else {
  
      const row = tabla.insertRow();
      row.insertCell().textContent = ""
      row.insertCell().textContent = producto.nombre;
      row.insertCell().textContent = producto.precioPorPeso;
      const cellCantidad = row.insertCell();
    
      const input = document.createElement('input');
    
      input.placeholder = '(gramos)';
      input.className = 'form-control';
      input.classList.add('inputPeso')
      input.classList.add('product-input')
      
      
    
      input.addEventListener('input', calcularTotal)
      cellCantidad.appendChild(input)
    
      const cellRestar = row.insertCell();
      const restarBtn = document.createElement('button');
      restarBtn.classList.add('button')
      restarBtn.classList.add('btn')
      row.insertCell().textContent = ""
    
      restarBtn.textContent = '-';
      restarBtn.addEventListener('click', () => {
      const rowToRemove = restarBtn.parentNode.parentNode;
      
      rowToRemove.parentNode.removeChild(rowToRemove);
      VisibilidadDeAlertas(MensajeproductoSinPeso, false);
	  
      calcularTotal();
	  })
      cellRestar.appendChild(restarBtn);
        
      row.classList.add('nueva-fila');
      row.classList.add('peso');
    
      inputNombre.value = '';
      datalistProductos.innerHTML = '';
      input.focus()
      VisibilidadDeAlertas(MensajeproductoRepetido, false)
      VisibilidadDeAlertas(MensajefinalizarSinProductos, false)
    
      calcularTotal();
    }
}
const agregarPorCodigo = async () => {

    const codigo = inputCodigoDeBarras.value;
    await new Promise(resolve => setTimeout(resolve, 500));
    const producto = await obtenerProducto(codigo, "codigo");
  
    if (producto) {
  
      const filaExistente = encontrarProductoEnTabla(producto.codigo);
        if (filaExistente) {
          actualizarCantidad(filaExistente);
          inputCodigoDeBarras.value = '';} 
        else {
          agregarProductoATabla(producto);} 
          inputCodigoDeBarras.value = '';}
        else {
          await new Promise(resolve => setTimeout(resolve, 500));
          inputCodigoDeBarras.value = '';
        }
  
    if (inputNombre.value) {
      }
      
      inputCodigoDeBarras.value = '';
}
async function obtenerProductosPorNombre(nombre) {
  if (!nombre) {
    return null; 
  }
  try {
    const response = await fetch(`http://localhost:3000/productos?nombre=${nombre}`);
    if (response.ok) {
      const productosJson = await response.json();
      const filteredProductos = productosJson.filter(producto => comienzaConLetra(producto.nombre, nombre));
      return filteredProductos.length > 0 ? filteredProductos : null; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error al buscar productos por nombre:', error);
    return null; 
  }
}
async function mostrarOpciones(consulta) {
  const searchTerm = consulta.toLowerCase();

  try {
    const matchedProducts = await obtenerProductosPorNombre(searchTerm);
    datalistProductos.innerHTML = '';
          
    matchedProducts.forEach((producto) => {
      const option = document.createElement('option');
      option.value = producto.nombre;
      datalistProductos.appendChild(option);
    });
  } catch (error) {
    console.error('Error al buscar productos por nombre:', error);
  }
}
function comienzaConLetra(nombreProducto, letra) {
  return nombreProducto.toLowerCase().startsWith(letra.toLowerCase());
}
function encontrarProductoEnTabla(codigo) {

  const filas = tabla.getElementsByTagName('tr');
  for (let i = 0; i < filas.length; i++) {
    const cell = filas[i].cells[0];
    if (cell.textContent === codigo) {
      return filas[i];
    }
  }
  for (let i = 0; i < filas.length; i++) {
    const cell = filas[i].cells[1];
    if (cell.textContent === codigo) {
      return filas[i];
    }
  }
  return null;
}

inputNombre.addEventListener('input', function agregarPorNombre(event) {

const selectedProductName = event.target.value;
  
  obtenerProductosPorNombre(selectedProductName).then(matchedProducts => {
  const matchedProduct = matchedProducts.find(product => product.nombre === selectedProductName);

    if (matchedProduct) {
      inputNombre.value = '';
      datalistProductos.innerHTML = '';
      agregarProductoATabla(matchedProduct);

      
    }
  });
});
inputNombre.addEventListener("input", function() {
  
  const consulta = inputNombre.value;
   
    if (consulta.length >= 2) {
    mostrarOpciones(consulta)
}})

let temporizador;

function enviarUnSoloCodigo(){
	agregarPorCodigo()
}

inputCodigoDeBarras.addEventListener('input', function(){
	clearTimeout(temporizador);
	
	temporizador = setTimeout(enviarUnSoloCodigo, 200);
});

// modificar valores de la tabla
function actualizarCantidad(fila) {
  
  const cellCantidad = fila.cells[3];
  const cantidadActual = parseInt(cellCantidad.textContent);
  cellCantidad.textContent = cantidadActual + 1;
  inputCodigoDeBarras.focus()
  if (cantidadActual === 0) {
    tabla.deleteRow(fila.rowIndex);
  }
  VisibilidadDeAlertas(MensajefinalizarSinNombreEntextarea,false);
  VisibilidadDeAlertas(MensajefinalizarSinPeso,false);
  VisibilidadDeAlertas(MensajefinalizarSinPrecioEntextarea,false);
  VisibilidadDeAlertas(mensajeNoEncontrado,false);
  VisibilidadDeAlertas(MensajeproductoRepetido,false);
  VisibilidadDeAlertas(MensajefinalizarSinProductos,false);
  VisibilidadDeAlertas(MensajefinalizarSinPeso,false);
  
  calcularTotal();
}
function restarCantidad(fila, cellCantidad) {
  
  var cantidad = parseInt(cellCantidad.textContent);
  if (cantidad > 0) {
    cantidad--;
    cellCantidad.textContent = cantidad;
    inputCodigoDeBarras.focus()
    if (cantidad === 0) {
      fila.remove();
      inputCodigoDeBarras.focus()
    }
  }
  
  VisibilidadDeAlertas(MensajefinalizarSinNombreEntextarea,false);
  VisibilidadDeAlertas(MensajefinalizarSinPeso,false);
  VisibilidadDeAlertas(MensajefinalizarSinPrecioEntextarea,false);
  VisibilidadDeAlertas(mensajeNoEncontrado,false);
  VisibilidadDeAlertas(MensajeproductoRepetido,false);
  VisibilidadDeAlertas(MensajefinalizarSinProductos,false);
  VisibilidadDeAlertas(MensajefinalizarSinPeso,false);

  calcularTotal();
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.target.classList.contains('product-input')) {
    event.preventDefault();
    const camposInput = document.querySelectorAll('.product-input');
    const indiceActual = Array.from(camposInput).indexOf(event.target);
    const siguienteIndice = (indiceActual + 1) % camposInput.length;
    const siguienteInput = camposInput[siguienteIndice];

    if (siguienteInput && !siguienteInput.value) {
      siguienteInput.focus();
    } else{
      inputNombre.focus()
    }
  }
});

// finalizar la operación

async function finalizarCompra() {
//obtención de filas de la tabla
const filas = document.querySelectorAll('#tabla tr');

//verificación de la existencia de productos
if (!filas) {
  VisibilidadDeAlertas(MensajefinalizarSinProductos, true)
  return;
}

if (filas.length < 1) {
  VisibilidadDeAlertas(MensajefinalizarSinProductos, true)
  return;
} 

// variables para almacenar información sobre los productos
const listaProductos = [];
let totalCompra = 0;


// ciclo para recorrer las filas de la tabla
for(fila of filas){
	
	// declaración de celdas
	const cellCantidad = fila.cells[3];
	const cellPrecio =  fila.cells[2];
	const cellNombre = fila.cells[1];
	
	// si no contiene un textarea y un input, entoces es un producto unitario registrado
	var textAreaNombre = cellNombre.querySelector('textarea');
    var inputEnCelda = cellCantidad.querySelector('input');

if (!textAreaNombre && !inputEnCelda){
		
		const nombre = cellNombre.textContent;
		const precio = cellPrecio.textContent;
		const cantidad = cellCantidad.textContent;
		
		listaProductos.push({
		nombre,
		precio,
		cantidad,
		});
		
	localStorage.setItem('listaProductos', JSON.stringify(listaProductos));
	totalCompra += precio * cantidad;
	}
	
	// si contiene un input, entonces es un producto por peso
	var contieneInput = Array.from(cellCantidad.getElementsByTagName('input')).length > 0;

	if(contieneInput){
	var inputEnCelda = cellCantidad.querySelector('input');
	
	const cantidadPeso = inputEnCelda.value;
	const nombre = cellNombre.textContent;
	const precio = cellPrecio.textContent;
	
	
	listaProductos.push({
		nombre,
		precio,
		cantidadPeso,
	});
	
	localStorage.setItem('listaProductos', JSON.stringify(listaProductos));
	totalCompra += precio * cantidadPeso / 1000;
	}
	
	//si la celda nombre contiene un textarea, es un producto desconocido unitario
	 
	if(textAreaNombre){
	var textAreaNombreEnCelda = cellNombre.querySelector('textarea');
	var textAreaPrecioEnCelda = cellPrecio.querySelector('textarea');
	
	if (textAreaNombreEnCelda && textAreaPrecioEnCelda) {
        const cantidad = cellCantidad.textContent;
        const nombre = textAreaNombreEnCelda.value;  
        const precio = textAreaPrecioEnCelda.value;

        listaProductos.push({
            nombre,
            precio,
            cantidad,
        });

        localStorage.setItem('listaProductos', JSON.stringify(listaProductos));
        totalCompra += precio * cantidad;
    }
 }
}	
  localStorage.setItem('totalCompra', totalCompra.toString());
  
  try {
    const newWindow = window.open('file:///E:\\MinimercadoBoro\\Sistema-De-Cobros\\front\\ticket.html?filasData=' + JSON.stringify({ listaProductos }), '_blank');
    await new Promise(resolve => newWindow.onload = resolve);
	window.location.reload();
  } catch (error) {
    console.error('Error:', error);
	return;
  }
}

function calcularTotal() {
  const filas = tabla.getElementsByTagName('tr');
  let total = 0;

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
	
    const cantidadCell = fila.cells[3];
    const precioCell = fila.cells[2];
	
    const cantidadInput = cantidadCell.querySelector('input');
    const cantidad = cantidadInput ? parseInt(cantidadInput.value) : parseInt(cantidadCell.textContent);
	
    if (!cantidad) {
      if (!filas) {
        return;
      }
      VisibilidadDeAlertas(MensajeproductoSinPeso, true)
    } else {VisibilidadDeAlertas(MensajeproductoSinPeso,false); VisibilidadDeAlertas(MensajefinalizarSinPeso,false);
	}
	
	const textareas = precioCell.querySelector('textarea');
	let precioTextarea;
	if(textareas){
	precioTextarea = parseFloat(textareas.value);
	}
	
    const precio = parseFloat(precioCell.textContent)

    if (fila.classList.contains('peso')) { 
      total += (cantidad / 1000) * precio; 
    }  
	if(fila.classList.contains('unidad')){
      total += cantidad * precio;
	}
	if(fila.classList.contains('desconocido')){
	   total += cantidad * precioTextarea;
	}
  }

  const totalElement = document.getElementById('total');
  if (isNaN(total)) {
    totalElement.textContent = `Total: ---$`;
  } else {

  totalElement.textContent = `Total: $${total.toFixed(2)}`;}
}
function recargarPagina() {
  window.location.reload();
}


//finalizar la compra presionando control
 
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === "Control") {
		
        if (!paginaConsultaPrecios.classList.contains('hidden')) {
            return;
        }

        const filas = document.querySelectorAll('#tabla tr');
        for (fila of filas) {
            const cellNombre = fila.cells[1];
            const cellPrecio = fila.cells[2];
			const cellCantidad = fila.cells[3]

            var textAreaNombreEnCelda = cellNombre.querySelector('textarea');
            var textAreaPrecioEnCelda = cellPrecio.querySelector('textarea');
			
			var inputcantidad = cellCantidad.querySelector('input');
			
			if(inputcantidad){
			if(inputcantidad.value == ""){
				VisibilidadDeAlertas(MensajefinalizarSinPeso,true)
				inputcantidad.focus();
				return;
			}}

            if (textAreaNombreEnCelda && textAreaPrecioEnCelda) {
                if (textAreaNombreEnCelda.value.trim() === "") {
                    VisibilidadDeAlertas(MensajefinalizarSinNombreEntextarea, true);
                    textAreaNombreEnCelda.focus();
                    return;
                }

                if (textAreaPrecioEnCelda.value.trim() === "") {
                    VisibilidadDeAlertas(MensajefinalizarSinPrecioEntextarea, true);
                    textAreaPrecioEnCelda.focus();
                    return;
                }
            }
        }

        finalizarCompra();
    }
});

inputCodigoDeBarras.addEventListener('keydown', function(event) {
if (event.key === "-") {
    event.preventDefault();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === "+") {
	  event.preventDefault();
    agregarProductoDesconocido(0000000000)
  }
});


// seleccionar la busqueda por nombre
pageItems.addEventListener( 'keydown', (event) => {
  if (event.key === "/"){ 
    if (inputCodigoDeBarras.focus) {
      event.preventDefault()
      inputNombre.focus()
    }
} 
})

// seleccionar la busqueda por codigo de barra
pageItems.addEventListener( 'keydown', (event) => {
  if (event.key === "*"){ 
    if (inputNombre.focus) {
      event.preventDefault()
      inputCodigoDeBarras.focus()
    }
} 
})
  
// routing
const crearProductoBtn = document.getElementById("crearProductoBtn");
crearProductoBtn.addEventListener("click", function() {
  window.location.href = "crear-producto.html"; 
});

const cambiarPrecios = document.getElementById('cambiarPreciosBtn')
cambiarPrecios.addEventListener('click', function() {
  window.location.href = "cambiar-precios.html"; 
})

const paginaPrincipal = document.getElementById('paginaPrincipalBtn')
paginaPrincipal.addEventListener('click', function() {
  recargarPagina();
  return
})
