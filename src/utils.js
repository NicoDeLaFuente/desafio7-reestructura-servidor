import {fileURLToPath} from 'url';
import { dirname} from 'path';
/* import bcrypt */
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* bcrypt */
//Genera una contraseña random de 10 caracteres
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//Compara la contraseña que ya esta guardad con la nueva, ambas son distintos hasheos de 10 caracteres, pero la librería las matchea.
export const isValidPassword = (savedPassword, password) => {
    return bcrypt.compareSync(password, savedPassword)
}

export default __dirname;