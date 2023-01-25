// @desc getAll Bootcamps
// @route GET /api/v1/bootcamps
// @access Public

exports.getBootcamps=(req,res)=>{
    res.status(200).json({success:true,msg:"Get All bootcamps",hello:req.hello});
}

// @desc get Single Bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public

exports.getBootcamp=(req,res)=>{
    res.status(200).json({success:true,msg:`Get single bootcamp with id ${req.params.id}`});
    
}

// @desc create bootcamp
// @route POST /api/v1/bootcamps
// @access Private

exports.createBootcamp=(req,res)=>{
    res.status(201).json({success:true,msg:"create bootcamp"});
}

// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private

exports.updateBootcamp=(req,res)=>{
    res.status(200).json({success:true,msg:`Update single bootcamp with id ${req.params.id}`});
}

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private

exports.deleteBootcamp=(req,res)=>{
    res.status(200).json({success:true,msg:`Delete single bootcamp with id ${req.params.id}`});
}