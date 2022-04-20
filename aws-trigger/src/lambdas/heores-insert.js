
const uuid = require('uuid');

class Handler {

    constructor({dynamoDbSvc}){
        this.dynamoDbSvc = dynamoDbSvc
        this.dynamoDBTable = process.env.DYNAMO_TABLE
    }



    prepareData(data){

        const databaseParams = {
            TableName: this.dynamoDBTable,
            Item: {
                body: data,
                id: uuid.v4(),
                createdAt: new Date().toISOString()
            }
        }

        return databaseParams
    }


    async insertItem(data){
        const createHero = this.dynamoDbSvc.put(data).promise()

        return createHero
    }

    handlerSuccesResponse(data){
        const response = {
            statusCode:200,
            body: JSON.stringify(data)
        }
        return response
    };

    handlerErrorResponse(data){

        return {
            status: data || 501,
            headers: {'Content-Type': 'text/plain'},
            body: 'Couldn\'t create item'
        }
    }




    async main(event){


        try {
            const data = JSON.stringify(event.body)

            const prepareData = this.prepareData(data);
            console.log('prepareData',prepareData);

            await this.insertItem(prepareData);
            return this.handlerSuccesResponse(createHeroe.Item);

        } catch (error) {
            
            console.log("Deu ruim****", error.stack)
            return this.handlerErrorResponse({statusCode: 500})
        }

    }
}

const aws = require('aws-sdk')
const dynamodb = new aws.DynamoDB.DocumentClient()

const handler = new Handler({
    dynamoDbSvc: dynamodb
})
module.exports = handler.main.bind(handler);

