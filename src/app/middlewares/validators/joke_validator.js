const Joi = require('joi');

const addJoke = {
    
    body: {
        // @ts-ignore
        tmdbMovieId: Joi.number().integer().required().error(_ => {
            return {
              message: "Please provide a movie"
            };
          }),
        // @ts-ignore
        text: Joi.string().trim().min(10).error(_ => {
            return {
              message: "text should be more than 10 characters"
            };
          })
    }
}

export default {addJoke};