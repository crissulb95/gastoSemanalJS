const formulario = document.getElementById('agregar-gasto');
const presupuestoUsuario = prompt('Indique el presupuesto de esta semana: ');
let cantidadPresupuesto;

console.log(presupuestoUsuario);

//CLASES

//Clase para presupuesto

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);//Número de presupuesto fijo
        this.restante = Number(presupuesto);//Presupuesto mutable usado como indicador del gasto
    }
    presupuestoRestante(cantidad = 0) {//método para aplicarle el gasto al indicador mutable
        return this.restante -= Number(cantidad);
    }
}

class Interfaz {
    insertarPresupuesto(cantidad) {
        const presupuestoSpan = document.querySelector('span#total');
        const restanteSpan = document.querySelector('span#restante');

        //se insertal el HTML

        presupuestoSpan.innerHTML = `${cantidad}`;
        restanteSpan.innerHTML = `${cantidad}`;
    };

    imprimirMensaje(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert'); //Bootstrap

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');//bootstrap
        } else {
            divMensaje.classList.add('alert-success')
        }
        //insertar el mensaje de error en el DOM
        divMensaje.appendChild(document.createTextNode(mensaje));
        document.querySelector('.primario').insertBefore(divMensaje,formulario);
        //con temporizador para que desaparezca
        setTimeout(function() {
            document.querySelector('.primario .alert').remove();
            formulario.reset();
        },3000);

    }

    //inserta los gastos a la lista del lado derecho
    agregarGastoListado(nombreGasto,cantidadGasto) {
        const gastoListado = document.querySelector('#gastos ul');
        //UL previamente ubicada en el lugar del DOM donde se insertarán dinámicamente 
        //elementos de la lista que resumira en qué se gasta y cuánto

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        //insertar gasto
        li.innerHTML = `${nombreGasto} <span class="badge badge-primary badge-pill p-2"> $${cantidadGasto}</span>`;

        //al HTML
        gastoListado.appendChild(li);
    }

    //muestra el presupuesto actual después de hacer gastos
    presupuestoRestante(cantidad) {
        const restante = document.getElementById('restante');  
        //actualizamos presupuesto restante
        const presupuestoRestanteUsuario = cantidadPresupuesto.presupuestoRestante(cantidad);
        restante.innerHTML = `${presupuestoRestanteUsuario}`;
        this.comprobarPresupuesto();
    }

    //cambiar el color de fondo a lo que se vaya gastando el presupuesto
    comprobarPresupuesto() {
        const presupuestoTotal = cantidadPresupuesto.presupuesto;
        const presupuestoActual = cantidadPresupuesto.restante;

        if((presupuestoTotal / 4) > presupuestoActual) {
            const restante = document.querySelector('.restante');
            restante.classList.remove('alert-success', 'alert-warning');
            restante.classList.add('alert-danger');
        } else if((presupuestoTotal / 2) > presupuestoActual) {
            const restante = document.querySelector('.restante');
            restante.classList.remove('alert-success');
            restante.classList.add('alert-warning');            
        }
    };
}



//EVENT LISTENERS

document.addEventListener('DOMContentLoaded', function()  {
    if(presupuestoUsuario === null || presupuestoUsuario === '') {
        window.location.reload();
    } else {
        //instanciar un presupuesto
        cantidadPresupuesto = new Presupuesto(presupuestoUsuario);
        //instanciar la clase de interfaz
        const ui = new Interfaz();
        ui.insertarPresupuesto(cantidadPresupuesto.presupuesto);
    }
});



formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    //leer el formulario de gastos
    const nombreGasto = document.getElementById('gasto').value;
    const cantidadGasto = document.getElementById('cantidad').value;
    //instanciar la interfaz(manipularla para hacer aparecer advertencias o nuevos daros)
    const ui = new Interfaz();
    //condicionales para manipular la interfaz instanciada
    if(nombreGasto === '' || cantidadGasto === '') {
        ui.imprimirMensaje('Hubo un error', 'error');//para cuando hagan submit con 
        //los campos vacíos, se utiliza un metodo de la clase
    } else {//para cuando los dos campos esten llenos y hagan submit
        //Se inserta en el html
        ui.imprimirMensaje('¡Excelente!', 'correcto');//Advierte que se ha impreso con éxito
        ui.agregarGastoListado(nombreGasto,cantidadGasto);
        ui.presupuestoRestante(cantidadGasto);//muesstra en el DOM lo que quede de presupuesto
    }
})