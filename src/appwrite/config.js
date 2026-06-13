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
  async createProblem(data){
    try{
        const user = await authService.getCurrentUser()

        if (!user) throw new Error("User not logged in")

        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            {
                ...data,
                userId: user.$id,
            },
            [
                Permission.read(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id)),
            ]
        )
    }catch (error){
        console.log("Appwrite service :: createProblem :: error", error);
    }
}


async getProblems(userId){
    try{
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
                Query.equal("userId", userId) //  now valid main fix yha krna tha
                
            ]
        )
    }catch (error){
        console.log("Appwrite service :: getProblems:: error", error);
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