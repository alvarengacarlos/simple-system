export default class Logger {

    //Use it to log general informations
    static infoLog(message) {
        const currentDate = new Date().toLocaleString();
        console.log(`[INFO] -> ${message} - ${currentDate}`);
    }

    //Use it to log errors or something like that and not stop the application execution
    static warningLog(message) {
        const currentDate = new Date().toLocaleString();
        console.warn(`[WARNING] -> ${message} - ${currentDate}`);
    }

    //Use it to log erros that stop the application execution
    static errorLog(message, error) {
        const currentDate = new Date().toLocaleString();
        console.error(`[ERROR] -> ${message} - "${error.message}" - '${currentDate}'`);
    }
    
}