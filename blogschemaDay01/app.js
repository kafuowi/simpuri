var express = require('express')
var path = require('path')
var fs = require('fs')
var bodyParser = require('body-parser')
const {PythonShell} = require('python-shell')
const fileUpload = require('express-fileupload')
var app = express()
const parse = require('parse-url')
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true    
});
const PhotoPost = require('./models/PhotoPost')
let port  = process.env.PORT;
if(port==null || port=="")
{
    port =4000;
}
app.locals.pretty = true
app.use(express.urlencoded({extended:false}))
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade')
app.use(fileUpload())
app.use(express.static(path.join(__dirname, './public')))
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csvWriter = createCsvWriter({
    path: './public/csv/1.csv',
    header:[
        {id:'placename', title:'PLACENAME'},
        {id:'waitpeople', title:'WAITING'},
    ],
})
sendaddPhoto = []
app.get('/index', function(req,res){
    //PhotoPost.find({location:'Daegu'},function(err,results){
    PhotoPost.find({}, function(err, results){
        if(err) return console.log(err)
        else{
            //console.log(results);
            for(var i in results){
                sendaddPhoto.push(i.name);
            }
            res.render('./index.ejs',{photopost:results, addPhoto:sendaddPhoto});
        }
    });
    //res.render('./index.ejs',{photopost:results});
});
var i = 0;
var list = "";
var txtfilepath = path.resolve(__dirname, 'public/img/photopost.txt');
var list_imgName = [];
app.post('/photo/store', function(req,res){
    const locationNames = {'1':'Seoul', '2':'Gwanju'}
    let image = req.files.image;
    image.mv(path.resolve(__dirname, 'public/img', image.name), async(error)=>{
        await PhotoPost.create({
            name: '/img/'+image.name,
            location:'Daegu',
            category:'love',
        });
        PhotoPost.find({}, function(err, results){
            if(err) return console.log(err)
            else{
                results.forEach(function(elements){
                    //console.log(elements + ", ")
                    elements = String(elements.name);
                    list += elements+"\n";
                    //fs.writeFile(path.resolve(__dirname, 'public/img/photopost.txt'), elements+"\n", function(err){
                    fs.writeFile(txtfilepath, list, function(err){
                        if(err) throw err;
                        //console.log("get image name success!");
                        var arrays = fs.readFileSync(txtfilepath).toString().split('\n');

                        var arrays_tmp;
                        for(var i in arrays){
                            arrays_tmp = arrays[i].replace(/\r/gm,"");
                            arrays[i] = arrays_tmp;
                        }
                        
                        list_imgName = []
                        for(var i=0;i<arrays.length;i+=1){
                            list_imgName.push(arrays[i]);
                        }
                        
                    })
                })
                
            }
        })
        res.render('./showResult.ejs',{list:list_imgName});
        //res.redirect('/index');
        //res.write(`<b>${locationNames}</b>`);
    });
});
app.get('/showResult', function(req,res){
    list = []
    res.render('./showResult.ejs',{list:list});
})
app.post('/idx', function(req,res){
    var color_value = req.body.color_value;
    console.log(color_value);
    res.render('./idx.ejs', {skinName:color_value});
})
app.get('/mappage', function(req,res){
    res.render('./map.ejs');
});
app.get('/homepage', function(req,res){
    res.render('./home.ejs');
});
app.get("/basic",function(req,res){
    res.render('./basic.ejs');
})
app.listen(4000, function(req,res){
    console.log(`Connected to http://localhost:${port}/index`)
})
