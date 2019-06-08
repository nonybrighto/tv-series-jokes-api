const joi = require('joi');

const addComment = {
    
    body: {
        // @ts-ignore
        content: joi.string().trim().max(500).required().error(_ => {
            return {
              message: "comment should be less than 500"
            };
          }),
        anonymousName: joi.string().trim().min(2)
    }
}

export default {addComment}