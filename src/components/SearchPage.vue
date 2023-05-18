<template>
    <div class="my-search">
        <div class="my-search-head">
            <div class="title">IMAGE SEARCH DEMO</div>
            <el-button
                @click="showFavorites"
                type="success" size="small"
                icon="el-icon-star-on"></el-button>
        </div>
        <!--        <div :class="{ 'image-search-show': showFavorite }" class="image-search">-->
        <div :class="{ 'image-search-show': showFavorite }" class="image-search">
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
                        <!--                        <el-button>upload</el-button>-->
                        <div class="el-upload__text">drag and drop image here or <em>click to upload</em></div>
                    </el-upload>
                </el-card>
                <el-card class="search-button">
                    <div class="search-filter">
                        <el-select
                            filterable
                            allow-create
                            default-first-option
                            v-model="selectNum.value" placeholder="please select or input">
                            <el-option
                                v-for="item in selectNum.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button type="primary" style="margin-left: 20px" @click="searchImg">
                            <el-icon class="el-icon-search">
                            </el-icon>&nbsp;Search</el-button>
                    </div>
                    <div class="search-filter">
                        <div v-if="checkedTags.length>0"
                             style="text-align: left;
                             margin-left: 15px;margin-bottom: 10px;
                             color: #999999;font-size: 16px;
                             font-weight: bolder" >related tags:</div>
                        <div style="overflow-x: hidden;overflow-y: scroll;height: 82px;">
                            <el-checkbox-group v-if="checkedTags.length>0" :min="1" v-model="checkedTags" size="mini">
                                <el-checkbox-button
                                    v-for="(tag,index) in imgTags"
                                    @change="chooseTag($event,index)"
                                    :label="tag" :key="index"><span>{{tag}}</span></el-checkbox-button>
                            </el-checkbox-group>
                        </div>
                    </div>
                </el-card>
            </el-card>
            <div>
                <div v-if="allResults.length > 0 " class="results-container">
                    <div class="result-num">
                        <span>The search resulted in {{ this.allResults.length }} matches</span>
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            content="clear">
                            <template v-slot:reference>
                                &nbsp;<svg t="1682144811398" @click="clearResults"
                                     class="icon" viewBox="0 0 1024 1024"
                                     style="position: relative;top: 20%;transform: translateY(20%);"
                                     version="1.1" xmlns="http://www.w3.org/2000/svg"
                                     p-id="2824" width="30" height="30">
                                    <path d="M899.1 869.6l-53-305.6H864c14.4 0 26-11.6
            26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26
            11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53
            305.6c-0.3 1.5-0.4 3-0.4 4.4 0 14.4 11.6 26 26 26h723c1.5 0 3-0.1 4.4-0.4 14.2-2.4
            23.7-15.9 21.2-30zM204 390h272V182h72v208h272v104H204V390z m468
            440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4
             0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z" p-id="2825">
                                    </path>
                                </svg>
                            </template>
                        </el-popover>
                    </div>
                    <el-form>
                        <el-row :gutter="40" style="height: 480px;clear: both">
                            <el-col :span="8" v-for="(item,index) in showResults" :key="index">
                                <el-card style="margin-bottom: 10px" v-if="item!=='.'">
                                    <el-image
                                        style="width: 200px; height: 150px"
                                        :src="item"
                                        :preview-src-list="allResults">
                                    </el-image>
                                    <div class="img-name">
                                        <time class="time">{{ item.slice(item.indexOf('im')) }}</time>
                                        <i @click="handleFavorites($event,item)"
                                           style="margin-left: 5px;margin-top: 8px;font-size: 20px"
                                           v-if="showResultsIsFavorite[index]===false"
                                           class="el-icon-star-off"></i>
                                        <i @click="handleFavorites($event,item)"
                                           style="margin-left: 5px;margin-top: 8px;color: red;font-size: 20px"
                                           v-else class="el-icon-star-on"></i>
                                    </div>
                                </el-card>
                                <div v-else style="width: 300px"></div>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-pagination
                        background
                        style="margin-bottom: 30px;margin-top: 10px"
                        :page-size="pageSize"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="curPage"
                        layout="prev, pager, next"
                        :total="this.allResults.length">
                    </el-pagination>
                </div>
                <div v-else-if="loading===false&&allResults.length===0" class="no-results">No results found.</div>
                <div v-else
                     style="height: 300px"
                     v-loading="loading"
                     element-loading-text="searching"
                     element-loading-spinner="el-icon-loading">
                </div>
            </div>
        </div>
        <el-card class="my-favorite" v-if="showFavorite">
            <div class="favorite-head">
                My Favorite
                <i class="el-icon-menu"
                   v-if="showFavoriteList"
                   style="margin-left: 70px;font-size: 20px"
                   @click="()=>{this.showFavoriteList = !this.showFavoriteList}"></i>
                <i class="el-icon-s-unfold"
                   v-else
                   style="margin-left: 70px;font-size: 20px"
                   @click="()=>{this.showFavoriteList = !this.showFavoriteList}"></i>
                <i class="el-icon-close"
                   style="margin-left:10px;font-size: 20px"
                   @click="()=>{this.showFavorite = !this.showFavorite}"></i>
            </div>
            <div class="favorite-imgs">
                <div v-if="this.showFavoriteList===false">
                    <div v-for="(item,index) in favorites" :key="index">
                        <el-card class="favorite-img">
                            <el-image
                                style="width: 205px"
                                :src="item"
                                :preview-src-list="favorites">
                            </el-image>
                            <time class="time">{{ item.slice(item.indexOf('im')) }}</time>
                            <i class="el-icon-error" style="margin-left: 10px;margin-top: 3px" @click="removeFavorite(index)"></i>
                        </el-card>
                    </div>
                    <div v-if="favorites.length===0" class="no-results" style="margin-bottom: 40px">
                        no image
                    </div>
                    <div style="height: 20px"></div>
                </div>
                <div v-else style="margin-top: 10px">
                    <div v-for="(item,index) in favorites" :key="index">
                        <div style="clear: both" class="favorite-img-list">
                            <div style="float: left;margin-left: 10px">
                                {{ item.slice(item.indexOf('im')) }}
                            </div>
                            <div style="float: right;margin-right: 10px">
                                <i class="el-icon-error" style="margin-left: 10px;margin-top: 3px" @click="removeFavorite(index)"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
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
            allResults:[],
            showResults:[],
            showResultsIsFavorite:[false,false,false,false,false,false],
            curPage:1,
            pageSize:6,
            resultWithTag: { },
            imgTags:[],
            checkedTags:[],
            showTags:[],
            favorites:[],
            showFavorite:false,
            showFavoriteList:false,
            selectType: {
                options: [
                    {value: '1', label: 'dog'},
                    {value: '2', label: 'flower'}
                ],
                value: ''
            },
            selectNum: {
                options: [
                    {value: '10', label: '10'},
                    {value: '15', label: '15'},
                    {value: '25', label: '25'},
                    {value: '50', label: '50'},
                ],
                value: ''
            }
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
        handleFavorites(event,url){
            let key=url.slice(url.indexOf('im'));
            if(localStorage.getItem(key)==null) {
                localStorage.setItem(key, url);
            }else{
                localStorage.removeItem(key)
            }
            this.colorFavorite()
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
            const file = this.upload.fileList[0].raw;
            const formData = new FormData();
            this.fileName = file.name
            const blob = new Blob([file], { type: file.type });
            formData.append('file', blob, file.name);
            let k = this.selectNum.value
            if(k === ''){
                k=10
            }
            formData.append('k',k)
            console.log(this.selectNum.value)
            await this.axios({
                method:"POST",
                url:"http://127.0.0.1:5000/imgUpload",
                data: formData,
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res=>{
                // console.log(res.data)
                this.allResults = []
                this.checkedTags = []
                this.imgTags = []
                this.showTags = []
                this.resultWithTag = res.data
                for(let image in res.data){
                    this.allResults.push('http://127.0.0.1:5000' + image.replace('\\','/'))
                    console.log('http://127.0.0.1:5000' +image.replace('\\','/'))
                    this.imgTags = this.imgTags.concat(res.data[image])
                }
                this.imgTags = Array.from(new Set(this.imgTags))
                console.log(this.imgTags)
                this.checkedTags = this.imgTags
                for(let i in this.imgTags){
                    i,
                        this.showTags.push(true)
                }
                this.getData()
                this.colorFavorite()
            }).catch(e=>{
                console.log(e)
            }).finally(()=>{
                this.loading = false
            })
        },
        colorFavorite(){
            // this.showResultsIsFavorite = []
            let temp = [false,false,false,false,false,false]
            for (let i = 0; i < localStorage.length; i++) {
                console.log(localStorage.key(i))
                for (let ii in this.showResults){
                    if(this.showResults[ii].indexOf(localStorage.key(i))>=0){
                        // this.$set(this.showResultsIsFavorite,ii,true)
                        console.log('show - ' + ii)
                        temp[ii] = true
                    }
                }
            }
            this.showResultsIsFavorite = temp
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.curPage = val;
            this.getData()
            this.colorFavorite()
        },
        clearResults(){
            this.allResults = []
            this.showResults = []
            this.resultWithTag= { }
            this.imgTags=[]
            this.checkedTags=[]
            this.showTags=[]
            this.upload.fileList = []
        },
        getData(){
            this.showResults = []
            for (let i = (this.curPage - 1)*this.pageSize; i<this.curPage*this.pageSize;i++){
                if(i>=this.allResults.length) {
                    this.showResults.push('.')
                }
                else {
                    this.showResults.push(this.allResults[i])
                }
            }
        },
        chooseTag(value,index){
            this.showTags[index] = value
            this.allResults = []
            for(let image in this.resultWithTag){
                let flag = false
                for(let i in this.showTags){
                    // value = false 包含该tag的图片不加入
                    if(this.showTags[i]===false){
                        if(this.resultWithTag[image].includes(this.imgTags[i])){
                            flag = true
                            break
                        }
                    }
                }
                if(!flag){
                    this.allResults.push('http://127.0.0.1:5000' + image.replace('\\','/'))
                }
            }
            this.getData()
        }
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
/deep/.el-loading-spinner{
    font-size: 48px;
}
/deep/.el-popover__content {
    width: 50px; /* 或任何您需要的宽度 */
}
/deep/ .el-upload .el-upload-dragger{
    height: 60px;
    line-height: 60px;
}
.el-checkbox-button{
    zoom: 90%;
    width: 75px;
    overflow: hidden;
    border-radius: 4px;
    margin-left: 1px;
    margin-bottom: 1px;
    border: 1px whitesmoke solid;
}
>>>.el-checkbox-button__inner{
    width: 75px;
    padding: 0;
    border: 1px whitesmoke solid;

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
.results-container {
    margin: 30px auto 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 900px;
    clear: both;
}
.img-name {
    margin-top: 10px;
}
.result-num{
    font-size: 24px;
    color: grey;
    margin-bottom: 20px;
}
.no-results {
    margin-top: 50px;
    font-size: 24px;
    color: grey;
}
.my-favorite{
    width: 290px;
    float: right ;
    margin-left: 30px;
    max-height: 95vh;
    z-index: 999;
    left: 880px;
    top:10px;
    background-color: white;
    position: absolute;
}
.favorite-head{
    /*text-align: right;*/
    /*font-size: 36px;*/
    margin-bottom: 20px;
    font-weight: bolder;
}
.favorite-imgs{
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
}
.favorite-img{
    margin-bottom: 20px;
    width: 245px;
}
.favorite-img-list{
    border: 1px #999999 solid;
    border-radius: 5px;
    height: 40px;
    line-height: 40px;
    margin-bottom: 8px;
}
.favorite-img-list:hover{
    /*background-color: #f0f0f0;*/
    border: 1px #409EFF solid;
    color: #409EFF;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
</style>
