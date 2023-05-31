import fs from 'fs';

export async function fileCheck() {
    if(!fs.existsSync(__dirname + '/../../../public/')){
    fs.mkdirSync(__dirname + '/../../../public/');
   }
}
export async function createFile(branchId: any){
	const uploadPath = __dirname + '/../../public/'
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
    }
if(!fs.existsSync(`${uploadPath}Images/`)){
    fs.mkdirSync(`${uploadPath}Images/`);
    }
if (!fs.existsSync(`${uploadPath}/Images/${branchId}/`)) {
    fs.mkdirSync(`${uploadPath}/Images/${branchId}/`);
    fs.mkdirSync(`${uploadPath}/Images/${branchId}/category/`);
    fs.mkdirSync(`${uploadPath}/Images/${branchId}/products`);
    fs.mkdirSync(`${uploadPath}/Images/${branchId}/logo/`);
    }
}

export async function  createImage(baseImage: string, branchId: any, filename:string,path: string){
    const uploadPath = __dirname + '/../../public';
    const localPath = `${uploadPath}/Images/${branchId}/${path}/`;
    const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));
    const fileType = baseImage.substring("data:".length, baseImage.indexOf("/"));
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    const base64Data = baseImage.replace(regex, "");
    fs.writeFileSync(localPath + `${filename}.${ext}`, base64Data, 'base64');
    return `https://api.digigarson.com/Images/${branchId}/${path}/${filename}.${ext}`;
}