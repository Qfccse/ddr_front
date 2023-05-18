<template>
    <div class="my-search">
        <div class="my-search-head">
            <div class="title">DDR DEMO</div>
        </div>
        <div class="image-search">
            <el-card class="search-container">
                <el-card class="search-upload">
                    <el-upload
                        name="file"
                        accept="JPG, .PNG, .JPEG,.jpg, .png, .jpeg, .bmp"
                        :on-preview="handlePreview"
                        list-type="picture"
                        :multiple="false"
                        :auto-upload="false"
                        action="#" drag
                        :on-change="fileChange"
                        :before-remove="removeFile"
                        :file-list="upload.fileList">
                        <div class="el-upload__text">拖拽图片或 <em>点击上传</em></div>
                    </el-upload>
                </el-card>
                <el-card class="search-button">
                    <div class="search-filter">
                        <el-button type="primary" style="margin-left: 20px" @click="searchImg">
                            <el-icon class="el-icon-search">
                            </el-icon>&nbsp;Search</el-button>
                    </div>
                    <div class="search-filter">
                        <div class="ddr-label">
                            <span class="label-name">MA</span>:&nbsp;<i style="background-color: yellow;width: 20px;border-radius: 5px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
                        </div>
                        <div class="ddr-label">
                            <span class="label-name">HE</span>:&nbsp;<i style="background-color: green;width: 20px;border-radius: 5px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
                        </div>
                        <div class="ddr-label">
                            <span class="label-name">EX</span>:&nbsp;<i style="background-color: red;width: 20px;border-radius: 5px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
                        </div>
                        <div class="ddr-label">
                            <span class="label-name">SE</span>:&nbsp;<i style="background-color: blue;width: 20px;border-radius: 5px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
                        </div>
                    </div>
                </el-card>
            </el-card>
            <el-card v-if="imageList.length>0">
                <div v-for="(url,index) in this.imageList" :key="index"
                     style="float: left;margin-left: 18px;margin-right: 18px">
                    <el-image
                        style="width: 250px; height: 250px"
                        :src="url"
                        :preview-src-list="imageList">
                    </el-image>
                    <div v-if="index===0">原图</div>
                    <div v-if="index===1">识别结果</div>
                    <div v-if="index===2">对照</div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchPage",
    data(){
        return {
            upload:{
                fileList:[]
            },
            loading:false,
            fileName:"",
            imageList:[
                "http://127.0.0.1:5000/uploads/007-4885-300.jpg",
                "http://127.0.0.1:5000/colored/007-4885-300.png",
                "http://127.0.0.1:5000/boxed/007-4885-300.jpg",
            ]
        }
    },
    methods:{
        fileChange(file, fileList) {
            if (fileList.length > 1) {
                fileList.splice(0, 1);
            }
            this.upload.fileList = fileList
        },
        removeFile(file, fileList) {
            this.upload.fileList = fileList//此处fileList为删除文件后，剩余的文件
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        showFavorites(){
            this.colorFavorite()
            this.favorites=[];
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i); //获取本地存储的Key
                let url=localStorage.getItem(key);
                if(url.startsWith("http")) {
                    this.favorites.push(url.replace("result", "database/dataset"));
                }
            }
            // console.log(this.favorites[0]);
            // this.showFavorite=true;
            this.showFavorite = !this.showFavorite
        },
        removeFavorite(index){
            console.log(index)
            const url =this.favorites[index]
            localStorage.removeItem(url.slice(url.indexOf('im')))
            this.favorites.splice(index,1)
            this.colorFavorite()
        },
        async searchImg(){
            this.loading = true
            this.imageList = []
            const file = this.upload.fileList[0].raw;
            const formData = new FormData();
            const blob = new Blob([file], { type: file.type });
            formData.append('file', blob, file.name);
            let k = '123123'
            if(k === ''){
                k=10
            }
            formData.append('k',k)
            await this.axios({
                method:"POST",
                url:"http://127.0.0.1:5000/imgUpload",
                data: formData,
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res=>{
                console.log(res.data)
                this.imageList.push("http://127.0.0.1:5000/uploads/" + res.data + '.jpg')
                this.imageList.push("http://127.0.0.1:5000/colored/" + res.data + '.png')
                this.imageList.push("http://127.0.0.1:5000/boxed/" + res.data + '.jpg')
            }).catch(e=>{
                console.log(e)
            }).finally(()=>{
                this.upload.fileList = []
            })
        },

    }
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 3px;
    margin-left: 2px;
    background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
    background-color: #999;
}
.my-search{
    width: 900px;
    margin: 0 auto;
    text-align: center;
    min-height: 100vh;
    /*overflow: hidden;*/
    position: relative;
    clear: both;
    z-index: 1;
}
.image-search {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
}
.image-search-show {
    float: left;
}
.ddr-label{
    margin-top: 5px;
    margin-bottom: 5px;
}
.label-name{
    display: inline-block;
    width: 30px;
    text-align: left;
}
.my-search-head{
    width: 500px;
    margin: 30px auto 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    height: 80px;
}
.title {
    font-size: 36px;
    font-weight: bolder;
    float: left;
    margin-right: 10px;
}
.search-container {
    margin: 30px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 900px;
    height: 240px;
    clear: both;
}
/deep/ .el-upload .el-upload-dragger{
    height: 60px;
    line-height: 60px;
}

.search-upload{
    margin-top: 0;
    width: 410px;
    float: left;
    height: 200px;
}
.search-button{
    margin-left: 20px;
    margin-top: 0;
    width: 410px;
    float: left;
    height: 200px;
}
.search-filter{
    margin: 0 auto 10px;
    width: 370px;
    /*border: 1px red solid;*/
}
</style>
