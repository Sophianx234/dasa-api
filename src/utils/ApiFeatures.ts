import { Request } from "express";
import User from "../models/userModel";
import { Query } from "mongoose";
import { reqQueryType } from "../controllers/authController";

export class ApiFeatures<T> {
  queryStr: Record<string, any>;
  query: Query<T[], T>;
  constructor(queryStr: Record<string, any>, query: Query<T[], T>) {
    this.queryStr = queryStr;
    this.query = query;
  }
  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["field", "page", "sort", "limit","fileType"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let query;
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      let sortField: reqQueryType =
        typeof this.queryStr.sort === "string" ? this.queryStr.sort : null;
      if (sortField?.includes(",")) sortField = sortField.split(",").join(" ");
      this.query = this.query.sort(sortField);
    }
    return this
  }
  limit(){

    if (this.queryStr.field) {
      let field: reqQueryType =
      typeof this.queryStr.field === "string" ? this.queryStr.field : null;
      
      if (field?.includes(",")) field = field.split(",").join(" ");
      if (field) this.query = this.query.select(field);
    }
    return this;
  }

  pagination() {
    const page = Number(this.queryStr.page);
    const limit = Number(this.queryStr.limit);
    const skip = page && limit && (page - 1) * limit;
    if (page) this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  search(){
    if(this.queryStr.fileType){
      const searchField =  this.queryStr.fileType.includes(',')? this.queryStr.fileType.split(',').join(' '):this.queryStr.fileType
      console.log(this.queryStr.fileType)
      console.log(searchField)
      this.query = this.query.find({fileType:searchField})
      
    }
    return this
  }
}
