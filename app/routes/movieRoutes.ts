import { Router, Express } from "express";
import Movie from "../models/movieModel.ts";
import verify from "../util/verifyToken.ts";

const router = Router()

router.post('/', verify, async (req, res) => {
    if (req.body.isAdmin) {
      const newMovie = new Movie(req.body);
  
      try {
        const savedMovie = await newMovie.save();
        res.status(201).send(savedMovie);
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(403).send('Not authorized to create movies');
    }
});

router.put('/:id', verify, async(req, res) => {
    if(req.body.isAdmin){
        try{

            const updatedMovie = await Movie.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            )

            res.status(200).send(updatedMovie)

        }catch(err){

            res.status(500).send(err)
        }
    }else{

        res.status(403).send('Not authorized to update movies.')
    }
})

router.delete('/:id', verify, async (req, res) => {
    if (req.body.isAdmin) {
      try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json('Movie deleted successfully');
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json('Not authorized to delete movies');
    }
});

router.get('/find/:id', verify, async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/', verify, async(req, res) => {
    if(req.body.isAdmin){

        const query = req.query.news

        try{

            const movies = query
                ? await Movie.find().sort({ _id: -1 }).limit(5)
                : await Movie.find()

            res.status(200).send(movies.reverse())
        }catch(err){

            res.status(500).send(err)
        }

    }else{

        res.status(403).send('Not authorized to view all movies.')
    }
})

router.get('/random', verify, async(req, res) => {

    const type = req.query.type
    let movie

    try{

        if(type === 'series'){
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ])
        }else{
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ])
        }

        res.status(200).send(movie)
    }catch(err){
        res.status(500).send(err)
    }
})

export default (app: Express) => {
    app.use('/movies', router)
}