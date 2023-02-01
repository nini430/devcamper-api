const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  const removedItems = ['select', 'sort', 'page', 'limit'];

  removedItems.forEach((item) => delete reqQuery[item]);
  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = model.find(JSON.parse(queryStr));
  if (req.query.select) {
    query = query.select(req.query.select.split(',').join(' '));
  }

  if (req.query.sort) {
    query = query.sort(req.query.sort.split(',').join(' '));
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  const pagination = {};

  query=query.skip(startIndex).limit(limit);

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if(populate) {
    query=query.populate(populate)
  }

  const resources = await query;

  res.advancedResults={
    success:true,
    count:resources.length,
    pagination,
    data:resources
  }

  next();
};

module.exports=advancedResults;
