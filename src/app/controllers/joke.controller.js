import createError from 'http-errors';
import models from '../models';
import listResponse from '../helpers/list_response';


//const User = models.User;
const Joke = models.Joke;
const UserJokeLike = models.UserJokeLike;


async function getJokes(req, res, next){

    try{
    //let currentUserId = (req.user)? req.user.id: null;
    let scopes = ['withAssociations']
    if(req.path === '/popular'){
        scopes.push('popular')
    }

        await listResponse({
            itemCount: await Joke.count(),
            getItems: async (skip, limit) => await  Joke.scope(scopes).findAll({ offset: skip, limit: limit}),
            errorMessage: 'Error occured while getting jokes'
        })(req, res, next);

    }catch(err){
        console.log(err);
        next(createError('Internal error occured while getting jokes'));
    }

}

async function getJokeLikers(req, res, next){

    try{
    //let currentUserId = (req.user)? req.user.id: null;
    // let scopes = ['withAssociations']
    // if(req.path === '/popular'){
    //     scopes.push('popular')
    // }

    //     await listResponse({
    //         itemCount: await Joke.count(),
    //         getItems: async (skip, limit) => await  Joke.scope(scopes).findAll({ offset: skip, limit: limit}),
    //         errorMessage: 'Error occured while getting jokes'
    //     })(req, res, next);

    //    let jokeLikes = await UserJokeLike.findAll({where:{jokeId: 1}, 
    //     attributes: [],
    //     include: [
    //        {
    //            model: models.User,
    //            as: 'liker'
    //        }
    //    ]});
    //     let likers = jokeLikes.map((jokeLike) => jokeLike.liker)


    // let likers = await UserJokeLike.findAll({
    //     include: [
    //         {
    //             model: models.User,
    //             as: 'liker',                
    //         }
    //     ],
    //     limit: 1,
        
    // })

    // let likers = await Joke.findOne({where: {id: 1}, include: [
    //     {
    //         model: models.User,
    //         as: 'likers',
    //         required: false,
    //         through: { attributes: [] },
    //         limit: 2
    //     }

    // ]})

    // models.sequelize.query('select 1 as `foo.bar.baz`', {nest:true}).then(rows => {
    //     console.log(JSON.stringify(rows))
    //     res.send(rows);
    //   })


        let likers = await UserJokeLike.likers(1);
        res.send(likers);
       

    }catch(err){
        console.log(err);
        next(createError('Internal error occured while getting jokes'));
    }

}

// async function list(req, res, next){
       
//     try{        
//         await listResponse({
//             itemCount: await User.count(),
//             getItems: async (skip, limit) => await  User.findAll({ offset: skip, limit: limit }),
//             errorMessage: 'Error occured while getting users'
//         })(req, res, next);
//     }catch(error){
//         next(createError('Error occured while getting users'));
//     }  
// }

// async function changePassword(req, res, next){

//     try{
//         let oldPassword = req.body.oldPassword;
//         let newPassword = req.body.newPassword;

//         // @ts-ignore
//         let user = await User.canLogin(req.user.username, oldPassword);
//         if(user){
//                 // @ts-ignore
//                let changed = await user.changePassword(newPassword);
//                if(changed){
//                     res.sendStatus(200);
//                }else{
//                     throw new Error('Could not change password');
//                }
//         }else{
//             next(createError(httpStatus.FORBIDDEN, 'not permitted to change password'));
//         }
//     }catch(error){
//         console.log(error);
//         next(createError('Error occured while changing password'));
//     }

// }

export default {getJokes, getJokeLikers};