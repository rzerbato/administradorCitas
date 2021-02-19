import { datosCita, nuevaCita, crearDB } from '../funciones.js';

import { 
    contenedorCitas, 
    fechaInput, 
    formulario, 
    horaInput, 
    mascotaInput, 
    propiertarioInput, 
    sintomasInput, 
    telefonoInput 
} from '../selectores.js';

class App{
    constructor(){
        this.initApp();
    }

    initApp(){
        mascotaInput.addEventListener('change', datosCita);
        propiertarioInput.addEventListener('change', datosCita);
        telefonoInput.addEventListener('change', datosCita);
        fechaInput.addEventListener('change', datosCita);
        horaInput.addEventListener('change', datosCita);
        sintomasInput.addEventListener('change', datosCita);
        formulario.addEventListener('submit', nuevaCita);

        crearDB();
    }
}

export default App;