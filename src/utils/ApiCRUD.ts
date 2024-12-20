import { Document, Model, Query } from "mongoose"

export class ApiCRUD<T> {
    dataStr:unknown
    query: Model<T>
    id: string | null
    constructor(dataStr:unknown,query:Model<T>,id:string|null=null){
        this.query = query
        this.dataStr = dataStr
        this.id = id

    }
      delete(){
           return  this.query.findByIdAndDelete(this.id)
            
    }
    create(){
            return this.query.create(this.dataStr);
    }
}