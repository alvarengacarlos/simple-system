export default class Logger {

    static infoLog(message) {
        console.log(`[INFO] -> ${message}`);
    }

    static warningLog(message) {
        console.warn(`[WARNING] -> ${message}`);
    }

    static errorLog(message, error) {
        console.error(`[ERROR] -> ${message} - "${error.message}"`);
    }
    
}