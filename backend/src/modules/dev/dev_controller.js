const devService = require('./dev_service');

class DevController{
    async resetDatabase(req, res){
        try{
            const result = await devService.resetDatabase();

            return res.status(200).json({
                message : result
            })
        }catch(err){
            return res.status(500).json({
                message : `Failed to reset database`,
                error : err
            })
        }
    }
}

module.exports = new DevController();