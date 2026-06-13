import conf from "../conf/conf";
import { Client,ID,Storage,Query, Databases,Permission,Role} from "appwrite";
import { Query } from "appwrite";

export class Service{
    client =new Client();
    databases;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.databases=new Databases(this.client);
    }
   async createProblem(data, userId){
    try{
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            data,
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
                Permission.create(Role.user(userId)),
            ]
        )
    }catch (error){
        console.log("Appwrite service :: createProblem :: error", error);
    }
}
       async getProblems(){
        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                   [
              Query.equal("userId", userId)  //  MAIN FIX
                  ]
               
            )
        }catch (error){
            console.log("Appwrite service :: getProblems:: error",error);
            return false;
        }
    }
    async deleteProblem(slug){
        try{
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch(error){
            console.log("Appwrite serivce :: deletePost :: error",error);
            return false;
        }
    }
    async getProblem(slug){
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        }catch (error){
            console.log("Appwrite service ::getProblem ::errro",error);
            return false;
        }
    }
    async updateProblem(id,data){
        try{
            return  await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                id,
                data
            )
        }catch (error){
            console.log("Appwrite service :: updateData :: error",error);
            return false;
        }
    }
}
const service=new Service();
export default service;