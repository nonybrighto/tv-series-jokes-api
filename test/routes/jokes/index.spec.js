
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/app';
import models from '../../../src/app/models/';
import {clearMockDB} from '../../config/mock_db_config';

chai.use(chaiHttp);

const Joke = models.Joke;
const User = models.User;
const Movie = models.Movie;
const expect = chai.expect;


describe('jokes/', function(){

    before(async function(){
        await clearMockDB();
    });

    describe('GET', function(){


        it('Should return 200 on success with no jokes', async function(){


               let response = await chai.request(app)
                .get('/api/v1/jokes/')
                .set('Content-Type','application/json');
                expect(response).to.have.status(200);
                expect(response.body).to.have.property('results').with.lengthOf(0);
        });

        it('Should return 200 on success with 2 joke', async function(){

                let ownerProperties = {username:'Peter', email:'peter@gmail.com', password:'password@1'};

                let owner = await User.create(ownerProperties);

                let movieProperties = {name:'The movie',
                tmdbMovieId:1,
                overview: 'overview',
                jokeCount:1,
           };
                let movie = await Movie.create(
                    movieProperties);

                let jokeProperties = {
                    title:'Joke title',
                    text:'joke text',
                    commentCount: 22,
                    likeCount: 5,
                    movieId: movie.id,
                    ownerId: owner.id,
                    imageUrl: 'http://imageUrl'
                };
                await Joke.create(jokeProperties)

               let response = await chai.request(app)
                .get('/api/v1/jokes/')
                .set('Content-Type','application/json');
                expect(response).to.have.status(200);
                expect(response.body).to.have.property('results').with.lengthOf(1);
                expect(response.body.results[0].title).to.be.equals(jokeProperties.title);
                expect(response.body.results[0].movie.name).to.be.equals(movieProperties.name);
                expect(response.body.results[0].owner.username).to.be.equals(ownerProperties.username);
        });

    });


    describe('jokes/popular', function(){

        it('Should return 200 on success with user with most likes above', async function(){

            let ownerProperties = {username:'Peter', email:'peter@gmail.com', password:'password@1'};

            let owner = await User.create(ownerProperties);

            let movieProperties = {name:'The movie',
            tmdbMovieId:1,
            overview: 'overview',
            jokeCount:1,
             };
            let movie = await Movie.create(
                movieProperties);

            let morePopularJokeProperties = {
                title:'popular Joke title',
                text:'joke text',
                commentCount: 22,
                likeCount: 50000,
                movieId: movie.id,
                ownerId: owner.id,
                imageUrl: 'http://imageUrl'
            };
            let secondMostPopular = {
                title:'Joke title',
                text:'joke text',
                commentCount: 22,
                likeCount: 5000,
                movieId: movie.id,
                ownerId: owner.id,
                imageUrl: 'http://imageUrl'
            };
            Joke.create(morePopularJokeProperties);
            Joke.create(secondMostPopular);

           let response = await chai.request(app)
            .get('/api/v1/jokes/')
            .set('Content-Type','application/json');
            expect(response).to.have.status(200);
            expect(response.body.results[0].title).to.be.equals(morePopularJokeProperties.title);
            expect(response.body.results[1].title).to.be.equals(secondMostPopular.title);
    });
        });

    });