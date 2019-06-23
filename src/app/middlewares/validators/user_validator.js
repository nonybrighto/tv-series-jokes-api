import joi from 'joi';


const addUser = {
    
    body: {
        // @ts-ignore
        username: joi.string().lowercase().trim().min(3).required().error(_=> {
            return {
              message: "Username should be three characters or more"
            };
          }),
        // @ts-ignore
        email: joi.string().lowercase().trim().email().required().error(_ => {
            return {
              message: "Please use a valid email"
            };
          }),
        password: joi.string().min(4)
                // @ts-ignore
                .required().error(_ => {
                    return {
                      message: "Your password should be 4 or more characters"
                    };
                  })
    }
}

const changePassword = {

    body: {
        oldPassword:joi.string().min(3).required(),
        newPassword:joi.string().min(4)
        // @ts-ignore
        .required().error(_ => {
            return {
              message: "Your password should be 4 or more characters"
            };
          })

    }
}

const forgotPasswordRequest = {

    body: {
        email: joi.string().trim().email().required()
    }
}

const changePasswordWithToken = {

    body: {
        token: joi.string().min(7).required(), //TODO: set the correct token pattern after deciding
        newPassword: joi.string().regex(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/)
        .required()
    }
}


export default {addUser, changePassword, forgotPasswordRequest, changePasswordWithToken}