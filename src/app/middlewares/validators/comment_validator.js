const joi = require('joi');

const addComment = {
    
    body: {
        content: joi.string().trim().max(500).required().label('comment should be less than 500'),
        anonymousName: joi.string().trim().min(2)
    }
}

export default {addComment}