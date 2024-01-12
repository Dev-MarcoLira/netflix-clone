import { Response, Router } from 'express'
import User from '../models/userModel.ts'
import { publicEncrypt } from 'crypto'
import verifyToken from '../util/verifyToken.ts'

const router = Router()

router.put('/:id', verifyToken, async(req, res) => {

    if(req.body.id === req.params.id || req.body.isAdmin){
        if(req.body.password){
            req.body.password = publicEncrypt(
                process.env.SECRET_KEY || '',
                req.body.password
            ).toString()
        }        

        try{

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },
                { new: true }
            )

            res.status(200).send(updatedUser)
        }catch(err){
            res.status(500).send(err)
        }
    }else{
        res.status(403).send('Not authorized to update account.')
    }

})

router.delete('/:id', verifyToken, async (req, res) => {
    if (req.body.id === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted successfully');
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json('Not authorized to delete account');
    }
});

router.get('/find/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const info = user?.toObject();

        res.status(200).json(info);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/', async (req, res) => {
    const query = req.query.news

    if(req.body.isAdmin){
        try{

            const users = query
                ? await User.find().sort({ _id: -1 }).limit(5)
                : await User.find()

            res.status(200).send(users.reverse())

        }catch(err){
            res.status(500).json(err)
        }
    }else{

        res.status(403).send('Not authorized to see all users.')
    }

})

router.get('/stats', async (req, res) => {
    const today = new Date();
  
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: { $month: '$createdAt' },
          },
        },
        {
          $group: {
            _id: '$month',
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
});
  
export default router