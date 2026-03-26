class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) FILTERING
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3) FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4) PAGINATION
    const page = this.queryString.page * 1 || 1; // page: 1, 2, 3, 4 etc. Default is 1 if not specified
    const limit = this.queryString.limit * 1 || 100; // limit: 10, 20, 50, 100 etc. Default is 100 if not specified
    const skip = (page - 1) * limit; // skip: 0, 10, 20, 30 etc. Default is 0 for page 1
    this.query = this.query.skip(skip).limit(limit); // skip: number of documents to skip, limit: number of documents to return

    return this;
  }
}

module.exports = APIFeatures;
