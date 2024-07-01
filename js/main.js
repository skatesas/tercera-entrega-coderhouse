class Producto {
    constructor(id,img,nombre,categoria,precio){
        this.id = id;
        this.img = img;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
    }
}

let productos = []

productos.push(new Producto("1","./img/procesador1.jpg","Procesador Intel Core i5","Procesadores",500))
productos.push(new Producto("2","./img/procesador2.webp","Procesador AMD Ryzen 5","Procesadores",400))
productos.push(new Producto("3","./img/placama1.png","Placa Madre ASUS PRIME","Placas Madre",200))
productos.push(new Producto("4","./img/placama2.png","Placa Madre MSI GAMING","Placas Madre",300))
productos.push(new Producto("5","./img/ram1.jpg","Memoria RAM Corsair 16GB","RAMs",60))
productos.push(new Producto("6","./img/ram2.jpg","Memoria RAM Kingston 32GB","RAMs",100))
productos.push(new Producto("7","./img/placavi1.webp","Placa De Video MSI Geforce Rtx 3050 Ventus 8gb","Placas de Video",500))
productos.push(new Producto("8","./img/placavi2.webp","Placa De video AMD PowerColor Red Devil RX 6900 XT 16GB","Placas de Video",900))

const contenedor_productos = document.querySelector("#contenedor-productos")
const botones_categorias = document.querySelectorAll(".boton-categoria")
const titulo_principal = document.querySelector("h2")
let producto_agregar = document.querySelectorAll(".producto-agregar")
const numerito = document.querySelector("#cantidad")
const boton_cerrar_sesion = document.querySelector(".cerrar-sesion")

function cargar_productos(productos_elegidos) {
    contenedor_productos.innerHTML = "";
    productos_elegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-img" src="${producto.img}" alt="${producto.nombre}">
            <div class="producto-propiedades">
                <h3 class="producto-nombre">"${producto.nombre}"</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button
                class="producto-agregar" id="${producto.id}">Agregar al carrito</button>
            </div>
        `;
        contenedor_productos.append(div);
    })
    actualizar_producto_agregar();
}
cargar_productos(productos);

botones_categorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botones_categorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id!= "todos") {
            const producto_categoria = productos.find(producto => producto.categoria === e.currentTarget.id);
            titulo_principal.innerText = producto_categoria.categoria;
            const productos_boton = productos.filter(producto => producto.categoria === e.currentTarget.id);
            cargar_productos(productos_boton);
        } else {
            titulo_principal.innerText = "Todos los Productos"
            cargar_productos(productos);
        }
        
    })
})

function actualizar_producto_agregar() {
    producto_agregar = document.querySelectorAll(".producto-agregar");
    producto_agregar.forEach(boton => {
        boton.addEventListener("click", agregar_al_carrito);
    });
}

let productos_en_carrito;

let productos_en_carrito_ls = localStorage.getItem("productos-en-carrito");
if (productos_en_carrito_ls) {
    productos_en_carrito = JSON.parse(productos_en_carrito_ls);
    actualizar_numerito();
} else {
    productos_en_carrito = [];
}


function agregar_al_carrito(e) {
    const id_boton = e.currentTarget.id;
    const producto_agregado = productos.find(producto => producto.id === id_boton);

    if(productos_en_carrito.some(producto => producto.id === id_boton)) {
        const index = productos_en_carrito.findIndex(producto => producto.id === id_boton);
        productos_en_carrito[index].cantidad++;
    } else {
        producto_agregado.cantidad = 1;
        productos_en_carrito.push(producto_agregado);
    }
    actualizar_numerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productos_en_carrito));
}

function actualizar_numerito() {
    let nuevo_numerito = productos_en_carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevo_numerito;
}

boton_cerrar_sesion.addEventListener("click", cerrar_sesion);

function cerrar_sesion() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
    buttonsStyling: false
    });
    return swalWithBootstrapButtons.fire({
        title: "Cerrar sesion",
        text: "¿Estas seguro de que deseas cerrar sesion? Se borrará todo el progreso.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, cerrar sesion",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productos_en_carrito.length = 0;
            localStorage.removeItem("productos-en-carrito");
            window.location.href = "./login.html";
            swalWithBootstrapButtons.fire({
                title: "Sesion cerrada",
                text: "Has cerrado sesion correctamente.",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "¡Puedes seguir comprando!",
                icon: "error"
            });
        }
    });
}