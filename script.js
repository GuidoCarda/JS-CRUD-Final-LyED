//registro con datos precargados para ejemplificar
//para evitar su carga al iniciar el programa eliminar o comentar la linea 66 del codigo
const stockModelo = [
    ['11118','componentes','Targeta grafica amd','3','300250','32131','332371'],
    ['23517','perifericos','Webcam Trust 1080p','30','20000','4200','332371'],
    ['33582','componentes','Targeta grafica nvidia','5','300250','32131','332371'],
    ['21212','notebooks','Hp Pavilion 18"','3','300250','32131','332371'],
    ['30258','componentes','Procesador Inter i5 5500k','10','92000','19320','111320'],
    ['16475','monitores','Monitor ultrawide LG 32"','3','10000','2100','12100'],
    ['33587','componentes','RTX 3080 Ti','3','300250','32131','332371'],
    ['12358','perifericos','Auriculares SONY H350','10','10000','2100','12100'],
    ['77574','monitores','Monitor samsung 19"','3','150000','35000','185000'],
    ['73235','notebooks','HP pavilion 19" i7 6gb RAM','3','125000','12500','137500'],
    ['95123','componentes','RTX 3060 SUPER','3','200000','41000','241000'],
    ['12357','monitores','Monitor lg 23"','22','300250','32131','332371'],
    ['12345','perifericos','Parlantes edifier Xpr','1','10000','2100','12100'],
    ['54321','perifericos','Auriculares Logitech G-PRO','10','50000','1500','51500'],
]

const categories = ['componentes','perifericos','monitores','notebooks'];

//Funcion para abrir el modal con el formulario para agregar un producto
const openModal = ()=> {
    document.querySelector('.modal-overlay').classList.add('show-modal');
    document.body.classList.add('modal-open'); //Evita scroll vertical cuando el modal esta abierto
}

// Custom dropdown menu para las categorias
const select = document.querySelector('.select');
const options = document.querySelector('.options');
const selectContent = document.querySelector('.select-content');
const hiddenInput = document.querySelector('#catProd')

document.querySelectorAll('.options > .option').forEach( option => {
    option.addEventListener('click', (e)=>{
        e.preventDefault();
        selectContent.innerHTML = e.target.innerHTML;
        hiddenInput.value = e.target.innerText;
        select.classList.toggle('active');
        options.classList.toggle('active');
    })
})

select.addEventListener('click', ()=>{
    select.classList.toggle('active');
    options.classList.toggle('active');
})


//Funcion para cerrar el modal con el formulario para agregar un producto
const closeModal = ()=> {
    clearFields()
    document.querySelector('.modal-overlay').classList.remove('show-modal');
    document.body.classList.remove('modal-open');

    select.classList.remove('active');
    options.classList.remove('active');
}

//Logica del sistema ABM - CRUD create read update delete

const getLocalStorage = (key)=> JSON.parse(localStorage.getItem(key)) ?? []; 
const setLocalStorage = (key,data)=> localStorage.setItem(key, JSON.stringify(data));

//Comentar esta linea para evitar la carga de registros, en caso de querer comenzar de 0 los registros
setLocalStorage('stock', stockModelo);


//El parametro KEY refiere a el identificador del registro en localStorage - es un string
//El parametro PRODUCT refiere al arreglo generado con los datos de cada producto - es un array
//El paramtro INDEX refiere a el indice del elemento que se quiere modificar / eliminar - es un entero

//Agrego un nuevo producto al registro
const createProduct = function(key,product){
    const arreglo = getLocalStorage(key);
    arreglo.push(product);
    setLocalStorage(key,arreglo);
};

//Leo los productos que ya estan guardados en el registro de localStorage
const readProducts = (key) => getLocalStorage(key);

//Actualizo un producto en especifico, lo identifico con su indice en el registro
const updateProduct = function(key,product,index){
    const arreglo = readProducts(key);
    arreglo[index] = product;   
    setLocalStorage(key,arreglo);
};

//Elimino un producto en especifico, lo identifico con su indice en el registro
const deleteProduct = function(key,index){
    const arreglo = readProducts(key);
    arreglo.splice(index,1); 
    setLocalStorage(key,arreglo);
};

//Valido los campos del formulario para los productos
function isValidField(){
    let productCode = document.getElementById('codigoProd').value.replace(/\s+/g, '');
    let productCategory = document.getElementById('catProd').value.toLowerCase();
    let productName = document.getElementById('producto').value;
    let productStock = document.getElementById('stockProd').value;
    let productCost = document.getElementById('costoProd').value;

    
    if(!productCode){
        return alert('Campo de codigo vacio');
    }
    if(isNaN(productCode)){
        return alert('El codigo no es un numero');
    }
    if(productCode.length > 5){
        return alert('El codigo es demasiado largo')
    }
    if(document.getElementById('codigoProd').dataset.index == 'new'){
        if(productExists(productCode)){
            return alert(`Error! El codigo ${productCode} ya esta siendo usado para un producto`)
        }
    }
    if(!productCategory){
        return alert('Campo de categoria vacio');
    }
    if(!productName){
        return alert('Campo de producto vacio');
    }
    if(!productStock){
        return alert('Campo de stock vacio');
    }
    if(isNaN(productStock)){
        return alert('El stock no es un numero');
    }
    if(productStock<1){
        return alert('El stock no puede ser menor a 1')
    }
    if(!productCost){
        return alert('Campo de costo vacio');
    }
    if(isNaN(productCost)){
        return alert('El costo no es un numero')
    }
    if(productCost<1){
        return alert('El costo no puede ser un valor negativo o 0');
    }
    return true;
};


//Esta funcion checkea si el codigo ingresado ya existe en el arreglo
function productExists(productCode){
    const products = readProducts('stock');
    if(products.length === 0) return false;
    for(let f=0;f<products.length;f++){
        if(products[f][0]==productCode){
            return true;
        }
    }
    return false
}
   
//Limpio los campos del furmulario
function clearFields(){

    const fields = document.querySelectorAll('.modal-field');
    fields.forEach( field => field.value = '' );
    
    selectContent.innerHTML = `<span class="categoria"></span>`;

    document.getElementById('codigoProd').dataset.index = 'new';
}

//Guardo los datos, ya validados anteriormente, en el registro y los muestro en pantalla
function saveProduct(){
    let isValid = isValidField();
    if(isValid){
        let codigo = parseInt(document.getElementById('codigoProd').value.replace(/\s+/g, ''));
        let categoria = document.getElementById('catProd').value.toLowerCase();
        let producto = document.getElementById('producto').value;
        let stock = parseInt(document.getElementById('stockProd').value);
        let costo = parseFloat(document.getElementById('costoProd').value);
        let iva = costo * 21 / 100;
        let costoTotal = costo + iva;
        let product = [codigo,categoria,producto,stock,costo,iva,costoTotal];
        
        const index = document.getElementById('codigoProd').dataset.index

        console.log(index)

        if( index === 'new'){
            createProduct('stock',product)
            updateTable();
            updateAnalytics();
            closeModal();
        }else{
            updateProduct('stock',product,index)
            updateTable();
            updateAnalytics();
            closeModal();
        }
    }
}

//Creo una fila en HTML por cada producto en el registro y lo anexo a la tabla 
function createRow(producto, index){
    const newRow = document.createElement('tr');
    let [codigo,categoria,nombreProd,stock,costo,iva,costoTotal] = producto;
    newRow.innerHTML = `
        <td>${codigo}</td>
        <td><span class="categoria ${categoria}">${categoria}</span></td>
        <td>${nombreProd}</td>
        <td>${stock}</td>
        <td>${costo}</td>
        <td>${iva}</td>
        <td>${costoTotal}</td>
        <td class="row-options">
            <button type="button" class="deleteProd-btn" id="delete-${index}">BORRAR</button>
            <button type="button" class="editProd-btn" id="edit-${index}">EDITAR</button>
        </td>
    `
    document.getElementById('products-table-body').appendChild(newRow);
}

//Con esta funcion limpio todas las filas en el HTML de la tabla antes de actualizarla para evitar filas duplicadas
function clearTable(){
    const rows = document.querySelectorAll('#products-table-body>tr');
    rows.forEach( row => row.parentNode.removeChild(row));
}

//Relleno los formularios con los datos del producto a modificar
function fillFields(product){
    console.log(product)
    const [ codigo, categoria, nombreProd, stock, costo] = product;
    document.getElementById('codigoProd').value  = codigo;
    document.getElementById('catProd').value  = categoria;
    selectContent.innerHTML = `<span class="categoria ${categoria}">${categoria}</span>`;
    document.getElementById('producto').value  = nombreProd;
    document.getElementById('stockProd').value = stock;
    document.getElementById('costoProd').value = costo;
}

//Edito el producto que corresponde al indice que recibe la función
function editProduct(index){
    const product = readProducts('stock')[index]; //Leemos el localStorage y seleccionamos unicamente el producto que vamos a editar mediante el indice que obtenemos en la funcion editOrDelete()
    //console.log(index);
    document.getElementById('codigoProd').dataset.index = index;
    fillFields(product);
    openModal();
}

//Actualizo el HTML de la tabla con los datos disponibles en el registro de localStorage
function updateTable(){
    clearTable();
    const arreglo = readProducts('stock');
    arreglo.forEach(createRow)
}

//Checkeo si se clickeo el boton de editar o liminar, ejecuto las funciones correspondientes
function editOrDelete(e){
  if(e.target.type == 'button'){
      const [ action , index ] = e.target.id.split('-');
        
      if(action=='edit'){
          editProduct(index);
      }else{
          const product = readProducts('stock')[index] 
          const respuesta = confirm(`Esta seguro que quiere elminar el producto:\n${product[0]} - ${product[1]} - ${product[2]}`);
          if(respuesta){
              deleteProduct('stock', index);
              
              updateTable();
              updateAnalytics();
              console.log(`Eliminando el producto ${index}`)
          }
      }
  }

}

//Calcular datos

//Esta funcion calcula el stock total por cada categoria
function caltulateCategoryTotal( category ){
    const products = readProducts('stock');
    let categoryTotalStock = 0;
    products.forEach( product => {
        if(product[1] === category){
            categoryTotalStock += parseInt(product[3]);
            console.log(categoryTotalStock)
        }
    })
    return categoryTotalStock;
}

//Esta funcion calcula el stock total de productos
function calculateTotalStock(){
    const products = readProducts('stock');
    let totalStock = 0;
    products.forEach( product =>{
        totalStock += parseInt(product[3]);  
    })
    return totalStock;
}

//Esta funcion actualiza la interfaz de las analiticas: stock total y total por cada categoria
function updateAnalytics(){
  const analytics = document.querySelectorAll('.analytic');
  
  analytics.forEach( (analytic, index) => {
    if(index==0){
        analytic.querySelector('.analytic-total').innerHTML = calculateTotalStock();
    }else{
        console.log(categories[index-1]);
        analytic.querySelector('.analytic-total').innerHTML = caltulateCategoryTotal(categories[index-1]);   
    }  
  })
}






//Esta funcion, actualizara el HTML de la tabla con los datos del localStorage al momento que se cargue todo el HTML de la pagina.
//Esto permite que al abrir la pagina, ya este cargado el registro de stock en la interfaz


window.addEventListener('DOMContentLoaded', updateTable());

updateAnalytics();

//EventListeners

document.querySelector('#guardarProd')
    .addEventListener('click', saveProduct );

document.querySelector('#create-prod-btn')
    .addEventListener('click', openModal);

document.querySelector('#modal-close-btn')
    .addEventListener('click', closeModal);

document.querySelector('#cancelarProd')
    .addEventListener('click', closeModal);

document.querySelector('#products-table-body')
    .addEventListener('click', editOrDelete);


