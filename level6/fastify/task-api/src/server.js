import app from './app.js';

const start = async () => {
    try{
        await app.listen({ 
            port:3000,
            host:'0.0.0.0'
        })
        app.log.info('Server is running on http://localhost:3000')
        // console.log(app.printRoutes());

    }catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()