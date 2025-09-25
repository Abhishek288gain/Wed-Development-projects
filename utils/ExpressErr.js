// Creating our custom error handler class
class ExpressErr extends Error{
    constructor(statusCode, msg){
        super(msg);
        this.statusCode = statusCode;
        this.msg = msg;
        this.name = "ExpressErr"; // optional, helps in debugging
    }
}
module.exports = ExpressErr;