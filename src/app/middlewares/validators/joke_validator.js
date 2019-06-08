const Joi = require('joi');

const addJoke = {
    
    body: {
        title: Joi.string().trim().min(3).required().label('Title should be 3 characters or more'),
        tmdbMovieId: Joi.number().integer().required().label('Please provide a movie'),
        text: Joi.string().trim().min(20).label('text should be more than 20 characters')
    }
}

export default {addJoke};