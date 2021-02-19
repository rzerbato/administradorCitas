import Citas from './classes/Citas.js';
import UI from './classes/UI.js';

import { 
    contenedorCitas, 
    fechaInput, 
    formulario, 
    horaInput, 
    mascotaInput, 
    propiertarioInput, 
    sintomasInput, 
    telefonoInput 
} from './selectores.js'

let editando = false;
export let DB;

//Objetos
const ui = new UI();
const administrarCitas = new Citas();

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}



//Agrega datos al objeto cita
export function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

export function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}


//valida y agrega una nueva cita
export function nuevaCita(e){
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    //Valido campos completos
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ){
        ui.imprimirAlerta("Todos los campos son obligatiros", 'error');
        return;
    }

    if(editando){
        
        
        //Edito la cita
        administrarCitas.editarCita( { ...citaObj } ); //{ ...citaObj } => Inidica que pasa una copia del objeto citaObj

        // Editar registro en IndexedDb
        //=================================
        const transaction = DB.transaction(['citas'], 'readwrite');

        //Habilito el object Store
        const objectStore = transaction.objectStore('citas');

        //Edito la cita
        objectStore.put(citaObj);

        transaction.oncomplete = () => {
            ui.imprimirAlerta("Se modificó correctamente");

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un error');
        }

        //=================================


    }else{
    
        //Genero ID
        citaObj.id = Date.now();

        //Creo una nueva cita
        administrarCitas.agregarCita( { ...citaObj } ); //{ ...citaObj } => Inidica que pasa una copia del objeto citaObj

        
        // Insertar registro en IndexedDb
        //=================================
        const transaction = DB.transaction(['citas'], 'readwrite');
        
        //Habilito el object Store
        const objectStore = transaction.objectStore('citas');
        
        //Agrego la cita
        objectStore.add(citaObj);

        //El add se ejecuto OK
        transaction.oncomplete = () => {
            ui.imprimirAlerta("Se agregó correctamente");
            editando = false;
        }

        
        //=================================
        

        
    }

    

    //Reinicio el formulario
    formulario.reset();
    reiniciarObjeto();

    //Mostrar citas en el HTML
    ui.imprimirCitas();
}

export function eliminarCita(id){
    
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    transaction.oncomplete = () => {

        //Muestro mensaje
        ui.imprimirAlerta("La cita se eliminó correctamente");

        //Refresco las citas
        ui.imprimirCitas();

    }

    transaction.onerror = () => {
        console.log('Hubo un error');
    }

}

export function cargarEdicion(cita){
    
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //Cargo los inputs
    mascotaInput.value = mascota;
    propiertarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    
    //Asigo los valores al objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Modifico el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

export function crearDB(){
    
    //Creo DB version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    //Si hay error
    crearDB.onerror = () => {
        console.log('Ha ocurrido un error');
    }

    //Si se creo OK
    crearDB.onsuccess = () => {
        
        DB = crearDB.result;

        //Muestro las citas almacenadas en indexedDB
        ui.imprimirCitas();

    }

    //Defino el schema
    crearDB.onupgradeneeded = (e) => {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        //Defino las columnas
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

    }


}