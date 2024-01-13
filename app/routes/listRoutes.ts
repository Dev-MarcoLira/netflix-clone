import { Router, Express } from "express";
import List from "../models/listModel.ts";
import verify from "../util/verifyToken.ts";
import { Aggregate } from "mongoose";

const router = Router()

router.post('/', verify, async (req, res) => {
    if (req.body.isAdmin) {
        const newList = new List(req.body);

        try {
        const savedList = await newList.save();
        res.status(201).json(savedList);
        } catch (err) {
        res.status(500).json(err);
        }
    } else {
        res.status(403).json('Not authorized to create lists');
    }
});


router.delete('/:id', verify, async (req, res) => {
    if (req.body.isAdmin) {
        try {
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json('List deleted successfully');
        } catch (err) {
        res.status(500).json(err);
        }
    } else {
        res.status(403).json('Not authorized to delete lists');
    }
});

router.get('/', verify, async (req, res) => {

    const typeQuery = req.query.type
    const genreQuery = req.query.genre
    let list: Aggregate<typeof List>[]

    try{
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    { $sample: { size: 5 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ])
            }else{
                list = await List.aggregate([
                    { $sample: { size: 5 } },
                    { $match: { type: typeQuery } }
                ])
            }
        }else{
            list = await List.aggregate([
                { $sample: { size: 5 } }
            ])
        }

        res.status(200).send(list)
    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/all', verify, async (req, res) => {
    let list = [];
    if (req.body.isAdmin) {
      try {
        list = await List.find();
        res.status(200).json(list.reverse());
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json('Not authorized to view all lists');
    }
});

router.put('/:id', verify, async (req, res) => {
    if(req.body.isAdmin){
        try{

            const updatedList = await List.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            )

        }catch(err){

            res.status(500).send(err)
        }
    }else{

        res.status(403).send('Not authorized to update lists')
    }
})

export default (app: Express) => {
    app.use('/lists', router)
}