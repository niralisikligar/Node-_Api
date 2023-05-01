const express = require("express")
const router = express.Router()
const Student = require("../model/student")
const mongoose = require("mongoose")
const checkAuth = require("../middleware/check-auth")
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: "dspivjfn2",
  api_key: "651484634524147",
  api_secret: "9x_FkooMfphh_QoJ75lTNBgcyEs",
})

router.get("/", checkAuth, (req, res, next) => {
  // res.status(200).json({
  //     msg: "this is student get request"
  // })
  Student.find()
    .then((result) => {
      res.status(200).json({
        studentData: result,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
})

router.get("/:id", (req, res, next) => {
  console.log(req.params.id)
  Student.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        student: result,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
})

router.delete("/", (req, res, next) => {
  // console.log(req.params.id);
  const imageUrl = req.query.imageUrl
  const urlArray = imageUrl.split("/")
  console.log(urlArray)
  const image = urlArray[urlArray.length - 1]
  console.log(image)
  const imageName = image.split(".")[0]
  console.log(imageName)
  studentId = req.query.id
  Student.deleteOne({ _id: studentId })
    .then((result) => {
      cloudinary.uploader.destroy(imageName,(error,result)=>{
        console.log("====>",error,result);
      })
      res.status(200).json({
        message: "Student Deleted",
        result: result,
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      })
    })
  // Student.deleteOne({ _id: req.params.id })
  //   .then((result) => {
  //     res.status(200).json({
  //       message: "Student Deleted",
  //       result: result,
  //     })
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //     })
  //   })
})

router.post("/", (req, res, next) => {
  // console.log(req.body)
  const file = req.files.photo
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    // console.log("result",result);

    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      imagePath: result.url,
    })

    student
      .save()
      .then((result) => {
        console.log("1111", result)
        res.status(200).json({
          newStudent: result,
        })
      })
      .catch((err) => {
        console.log("222", err)
        res.status(500).json({
          error: err.message,
        })
      })
  })
})

router.put("/:id", (req, res, next) => {
  // console.log(req.params.id);
  Student.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        update_student: result,
      })
    })
    .catch((err) => {
      console.log("222", err)
      res.status(500).json({
        error: err,
      })
    })
})

module.exports = router
