const express=require("express")

const router=express.Router();

router.get("/",(req,res)=>{
    res.status(200).json({success:true,msg:"Get All bootcamps"});
})
router.post("/",(req,res)=>{
    res.status(200).json({success:true,msg:"create bootcamp"});
})
router.get("/:id",(req,res)=>{
    res.status(200).json({success:true,msg:`Get single bootcamp with id ${req.params.id}`});
})
router.put("/:id",(req,res)=>{
    res.status(200).json({success:true,msg:`Update single bootcamp with id ${req.params.id}`});
})
router.delete("/:id",(req,res)=>{
    res.status(200).json({success:true,msg:`Delete single bootcamp with id ${req.params.id}`});
})

module.exports=router;