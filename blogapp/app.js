var express= require("express")
var app=express()
var expressSanitizer=require("express-sanitizer")
var methodOverride = require("method-override")
var mongoose=require("mongoose")
var bodyparser=require("body-parser")
var Request=require("request")

mongoose.connect("mongodb://localhost:27017/blogs",{ useNewUrlParser: true });

app.use(bodyparser.urlencoded({extended:true}))
app.use(expressSanitizer())
app.use(express.static("public"))
app.set("view engine","ejs")
app.use(methodOverride("_method"))

var blogSchema = mongoose.Schema({
    title:String,
    image:String,
    content:String,
    created:{type:Date, default:Date.now}
})

var Blog=mongoose.model("blogs",blogSchema)

// Blog.create({
//     title:"testing blog",
//     image:"https://images.unsplash.com/photo-1558174685-430919a96c8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     content:"just for testing"
// },function(err,blog){
//     if(err){
//         console.log(err)
//     } else {
//         console.log("blog created")
//         console.log(blog)
//     }
// })

// Blog.find({title:"abdul"},function(err,blog){
//     if(err){
//         console.log(err)
//     } else{
//         console.log("found")
//         console.log(blog[0]["_id"])
//     }
// })


app.get("/",function(req,res){
    res.redirect("/blogs")
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err)
        } else{
            res.render("blogs",{blogs:blogs})
        }
    })
})
app.get("/blogs/new",function(req,res){
    res.render("new")
})

app.post("/blogs",function(req,res){
    var data=req.body
    console.log(data)
    // data.content=req.sanitize(data.content)
    // console.log("============")
    console.log(data)
    Blog.create(data,function(err,blog){
        if(err){
            console.log(err)
        } else{
            res.redirect("/blogs")
        }
    })
})

app.get("/blogs/:id",function(req,res){
    var id=req.params.id
    Blog.find({_id:id},function(err,blog){
        if(err || blog==null){
            console.log(err)
        } else{
            res.render("show",{"blog":blog[0]})
        }
        
    })

})
app.get("/blogs/:id/edit",function(req,res){
    var id=req.params.id
    Blog.find({_id:id},function(err,blog){
        if(err || blog==null){
            console.log(err)
        } else{
            res.render("edit",{"blog":blog[0]})
        }
        
    })

})

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body,function(err,blog){
        if(err){
            console.log(err)
            alert("something is wrong")
            res.redirect("/blogs/:id/edit")
        } else{
            console.log(blog)
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,blogs){
        if(err){
            console.log(err)
        } else{
            console.log("one item deleted")
            res.redirect("/blogs")
        }
    })

})






app.listen(3000,function(){
    console.log("http://localhost:3000")
});


