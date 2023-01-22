let arrayCarrito = []; //Array de carrito sin elementos
let suma;

//funcion que suma en el arraycarrito

function sumaCarrito (){
  arrayCarrito.forEach((elemento) => {
    suma = suma + elemento.precio * elemento.cantidad;                  
  });

}

// si hay productos en el local storage los cargamos en al carrito

if (localStorage.getItem("arrayCarrito")) {
  arrayCarrito = JSON.parse(localStorage.getItem("arrayCarrito"));
}

//Generar Cards de productos en forma dinamica 

function cards() {
  const contenedor = document.getElementById("contenedor");

  const listado = "json/productos.json";
  fetch(listado)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      datos.forEach((elemento) => {
        const div = document.createElement("div");
        div.className = "div-card";
        contenedor.appendChild(div);
        div.innerHTML = `
                            <img class="img_cards" src="${elemento.img}" alt="">
                            <h2>$ ${elemento.precio}</h2>
                            <br>
                            <h3>${elemento.nombre}
                            <p>${elemento.Descripcion}</p> 
                            <br>
                            <button id="boton${elemento.id}" class="btn btn-primary">Agregar</button>`;

        // Crear boton agregar con su evento

        const boton = document.getElementById(`boton${elemento.id}`);                        //asigna id de los productos a los botones

        boton.onclick = () => {
          const id_card = elemento.id;                                                       // al presionar el boton guarda el id de la card
          const comprobarProducto = arrayCarrito.some((el) => el.id === id_card);          // verifica si en el array del carrito ya esta el producto
          if (comprobarProducto) {
            const indice = arrayCarrito.findIndex((elemento) => elemento.id === id_card);

            arrayCarrito[indice].cantidad++;
          } else {
            const newElement = JSON.parse(JSON.stringify(elemento));             // hace una copia del objeto original traido de fetch para que no se modifique la cantidad al modificar cantidad del objeto de refencia
            arrayCarrito.push(newElement);
           
          }
          suma = 0;

          sumaCarrito();                   // la suma tiene que estar dentro del foreach del boton, sino no funciona
          

          console.log(arrayCarrito);

          //Trabajamos con el localStorage:
          localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito));

          const totalCarrito = document.getElementById("totalCarrito");
          totalCarrito.innerText = `El total del carrito es: $ ${suma} `;

          Toastify({
            text: "Producto agregado!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
          }).showToast();
        };
      });
    });
}

cards();

//mostrar carrito

const btnMostrar = document.getElementById("mostrarCarrito");
const contenedorCarrito = document.getElementById("contenedorCarrito");


//funcion que dibuja el carrito:

function dibujarCarrito() {

  btnMostrar.onclick = () => {
    suma=0;
    sumaCarrito();
    totalCarrito.innerText = `El total del carrito es: $ ${suma} `;       
    contenedorCarrito.innerHTML = "";                                    // evita que de dupliquen la estructura de cards generada por el boton de ver el carrito.

    arrayCarrito.forEach((elemento) => {
      const cardCarrito = document.createElement("div");
      cardCarrito.className = "cardCarrito";
      contenedorCarrito.appendChild(cardCarrito);

      cardCarrito.innerHTML = `
      
                              <h1><strong>${elemento.nombre}</strong></h1>
                              <h5>Cantidad: ${elemento.cantidad}</h5>
                              <button id="btnEliminar${elemento.id}">Eliminar</button>
        `;
      const btnEliminar = document.getElementById(`btnEliminar${elemento.id}`);                       // al tener cada boton id distinta se pueden guardar en la misma constante
      btnEliminar.onclick = () => {
        const idCardCarrito = elemento.id;
        const indiceCardEliminar = arrayCarrito.findIndex((elemento) => elemento.id === idCardCarrito);
        arrayCarrito.splice(indiceCardEliminar, 1);
        localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito));
        suma = 0;
        sumaCarrito();                                                                          //si bien esta dentro de un foreach cada card generada con el foreach principal debe tener un boton con su foreach para sumar los elementos del carrito
        totalCarrito.innerText = `El total del carrito es: $ ${suma} `;
      };
    });
  };
}
                                                               

dibujarCarrito();

// vaciar el carrito

const vaciar = document.getElementById("vaciar");

vaciar.onclick = () => {
  //se lanza sweetalert
  Swal.fire({
    title: "Está seguro de vaciar el carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, seguro",
    cancelButtonText: "No, no quiero",
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarCarrito();                                                  // si se confirma se llama a la funcion que vacia el carrito
      Swal.fire({
        title: "Carrito Vacio!",
        icon: "success",
        text: "Se han eliminado todos los productos del carrito",
      });
    }
  });
};

//funcion para vaciar el carrito
function vaciarCarrito() {
  arrayCarrito = [];                                                     //vacia el array del carrito
  suma = 0;                                                             // deja en cero la suma del carrito
  totalCarrito.innerText = `El total del carrito es $: ${suma} `;      // actualiza el la leyenda que muestra el total
  contenedorCarrito.innerHTML = "";                                 //vuelve a dibujar la estructura de las card del carrito  en blanco
  localStorage.clear();
}
