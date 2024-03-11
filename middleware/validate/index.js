export default (validators)=> async (ctx,next) => {
 
    try{
        const validationErrors = [];

        for(let validator of validators)
        {
            const err = await validator(ctx,next)

            if(err)
                validationErrors.push(err)
        }
        if(validationErrors.length)
        {
            return ctx.body = {status : 204, msg : validationErrors}
        }
        await next();
    }catch(err)
    {
        console.log(err);
    }
}