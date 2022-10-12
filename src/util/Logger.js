export default class Logger {

    static infoLog(message) {
        const currentDate = new Date().toLocaleString();
        console.log(`[INFO] -> ${message} - ${currentDate}`);
    }

    static warningLog(message) {
        const currentDate = new Date().toLocaleString();
        console.warn(`[WARNING] -> ${message} - ${currentDate}`);
    }

    static errorLog(message, error) {
        const currentDate = new Date().toLocaleString();
        console.error(`[ERROR] -> ${message} - "${error.message}" - '${currentDate}'`);
    }
    
}