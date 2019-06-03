import models from '../../src/app/models'

async function clearMockDB(){

   await models.sequelize.sync({force: true});

   await Promise.all([
    models.User.destroy({ truncate: {cascade: true} }),
    models.JwtTokenBlacklist.destroy({ truncate: {cascade: true} }),
    models.Movie.destroy({ truncate: {cascade: true} }),
    models.Joke.destroy({ truncate: {cascade: true} }),
    models.UserJokeLike.destroy({ truncate: {cascade: true} }),
    models.Comment.destroy({ truncate: {cascade: true} }),
   ]);
}


export {clearMockDB}