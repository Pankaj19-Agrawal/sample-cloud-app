import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as corsModule from 'cors';

const cors = corsModule({origin:true});
// const cors = corsModule(origin:true);

const fn = 'function-1'
exports.fn = functions.https.onRequest((request,response)=>{
    cors(request,response,()=>{
        console.log('fn request',request);
        console.log('fn response',response);
        response.status(200).send({data:{success:true,message:'yeah!!!!!'}});
    })
});