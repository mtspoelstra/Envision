const express = require('express')
const router = express.Router()
const dotenv = require("dotenv")
const { ensureAuthh } = require("../middleware/auth")
const upload = require("../config/multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");




const Goal = require('../models/Goal')


// @desc Create Goal Page
// @route GET to /create

router.get('/create', ensureAuthh, (req, res) => {
    res.render('goals/create')
})

// @desc Show Edit Goal Page
// @route GET to /edit

router.get('/edit/:id', ensureAuthh, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
        }).lean()
    
        if(!goal) {
            return res.render('error/404')
        }
    
        if(goal.user != req.user.id){
            res.redirect('/mygoals')
        } else {
            res.render('goals/edit', {
                goal,
            })
        }
    
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
    
})

// @desc process new Goal form AKA create goal
// @route POST to /addGoal

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
    });
    const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "envision",
        allowedFormats: ["jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    }
    
    });

// const parser = multer({ storage: storage });

router.post('/addGoal', ensureAuthh, upload.single('image'), async (req, res) => {

  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

  console.log(obj); // { title: 'product' }
  // console.log(req.body)
 
     try {
         
         const result = await cloudinary.uploader.upload(req.file.path);
     
         // console.log(result)
         let goal = new Goal({
             
             imageURL: result.secure_url,
             imageId: result.asset_id,
             goalTitle: obj.goalTitle,
             goalBriefDes: obj.goalBriefDes,
             goalDetailDes: obj.goalDetailDes,
             status: obj.status,
             user: req.user.id
             
              
           });
     
           
           await goal.save();
     
           res.redirect('/mygoals')
 
     } catch (err) {
         console.error(err)
         res.render('error/500')
         
     }
 })




// @desc Update/Edit Goal Image
// @route PUT to /goals/:id
router.post('/image/:id', ensureAuthh, upload.single('edit-image'), async (req, res) => {

    
    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  
  //   console.log(obj); 
  
      
  
      try {
  
          const result = await cloudinary.uploader.upload(req.file.path);
          let goal = await Goal.findById(req.params.id).lean()
          console.log(req.params)
  
      if(!goal) {
          return res.render('error/404')
      }
  
      if(goal.user != req.user.id) {
          res.redirect('/mygoals')
      } else {
          goal = await Goal.findOneAndUpdate({ _id: req.params.id }, {imageURL: result.secure_url,
              imageId: result.asset_id}, {
              new: true,
              runValidators: true
          })
  
          res.redirect('/mygoals')
      }
  
      } catch (error) {
          console.error(error)
          return res.render('error/500')
      }
  
      
  })


// @desc Update/Edit Goal Body
// @route PUT to /goals/:id

router.put('/:id', ensureAuthh, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id).lean()

    if(!goal) {
        return res.render('error/404')
    }

    if(goal.user != req.user.id) {
        res.redirect('/mygoals')
    } else {
        goal = await Goal.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })

        res.redirect('/mygoals')
    }

    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

    
})




// @desc Update Completed to True
// @route PUT to /goals/:id/completed

router.put('/:id/completed', ensureAuthh, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id).lean()

    if(!goal) {
        return res.render('error/404')
    }

    if(goal.user != req.user.id) {
        res.redirect('/mygoals')
    } else {
        goal = await Goal.findOneAndUpdate({ _id: req.params.id }, {
           completed: true
        })

        res.redirect('back')
    }

    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

    
})

// @desc Update Completed to False
// @route PUT to /goals/:id/notcompleted

router.put('/:id/notcompleted', ensureAuthh, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id).lean()

    if(!goal) {
        return res.render('error/404')
    }

    if(goal.user != req.user.id) {
        res.redirect('/mygoals')
    } else {
        goal = await Goal.findOneAndUpdate({ _id: req.params.id }, {
           completed: false
        })

        res.redirect('back')
    }

    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

// @desc Delete Goal
// @route DELETE to /goals/:id

router.delete('/:id/delete', ensureAuthh, async (req, res) => {
    try {
        await Goal.remove({ _id: req.params.id })
        res.redirect('/mygoals')
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }

})


// @desc Goal Feed Page
// @route GET to /feed

router.get('/feed', ensureAuthh, async (req, res) => {
    
    try {
        const goals = await Goal.find({ status: 'public' })
            .populate('user')
            .sort({ createAt: 'desc' })
            .lean()

            console.log(req.user.image)

            res.render('goals/feed', {
                goals,
                name: req.user.displayName,
                image: req.user.image,
                user: req.user
            })
   } catch (error) {
        console.error(error)
        res.render('error/500')
   }
})

// @desc Show Single Goal
// @route GET to /:id

router.get('/:id', ensureAuthh, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id)
            .populate('user')
            .lean()

            if(!goal) {
                return res.render('error/404')
            }

            res.render("goals/single", {
                goal
            })
   } catch (error) {
        console.error(error)
        res.render('error/404')
   }

})






// Testing cloudinary with Image






module.exports = router