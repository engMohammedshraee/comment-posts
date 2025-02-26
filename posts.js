
let urlparam = new URLSearchParams(window.location.search)
//id for every post
const id=urlparam.get("postid")
console.log(id)
getposts()
//get post
function getposts(){
    axios.get(`${basurl}/posts/${id}`)

    .then(function(response){

        let post=response.data.data
        let comments=post.comments
        //let author=post.author

        document.getElementById("usernamespan").innerHTML=""
       document.getElementById("usernamespan").innerHTML=post.author.username
       // console.log(lastpage)

       let content=`
                
       <div class=" card shadow my-3 ">
            <div class="card-header">
              <img class="border border-2" src="${post.author.profile_image}" alt="">

              <b>
                @ ${post.author.username}
              </b>
            </div> 
          
            <div class="card-body">
                  <img class="w-100" src="${post.image}" alt="">
                  <h6>${post.created_at}</h6>
                  <p>
                  ${post.title}
                  </p>
                  <p>
                  ${post.body}
                  </p>
                  <hr>
                  <div>
                    comment-account
                    <span>${post.comments_count}</span>
                    <br>

                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                      <span>
                          ${post.author.created_at}
                          
                          <span id="post-tags-${post.id}">
                      

                          </span>
                      </span>
                      <hr>
                      <div class="commentdiv" id="commentdiv">

                       </div>
                    <div class="input-group mb-3" id="add-comment-input">
                            <input type="text" class="form-control" id="comment-body-input" placeholder="input your comment"></input>
                            <button class="btn btn-outline-primary"  type="button" onclick="createnewcomment()" id="adddcomment">send</button>
                    </div>

                    

                  </div>
             
          
              </div>
         </div>


`
document.getElementById("posts").innerHTML=""
document.getElementById("posts").innerHTML=content
let posttitel=""

if(post.title != null){
  posttitel=post.title
}
         
  for(comment of comments){
    let commentbody=
        `
        <div class="card-header" id="comentheader">
        <img class="border border-2" src="${comment.author.profile_image}" alt="">
    
        <b>${comment.author.username}</b>
        </div> 
    
        <div class="card-body">
        ${comment.body}
    
        </div>
    
    
        `
        document.getElementById("commentdiv").innerHTML+=commentbody

  }
  const currentposttagid=`post-tags-${post.id}`

  for(tag of post.tags){  
             
    console.log("mohammed")
            let contenttages=`

                <button class="btn btn-sm rounded-5" style="background-color: gray;color: white;">
                  ${tag.name}
                </button>
            
            
            `
        document.getElementById(currentposttagid).innerHTML +=contenttages
    
        }

    
    })
    
 }
 //creat new comment 
 function createnewcomment(){
  let commentbody=document.getElementById("comment-body-input").value 
  console.log(commentbody)
  let params={
    "body":commentbody
  }
  let token=localStorage.getItem("token")

  let headers1={
    
    "authorization":`Bearer ${token}`,

    "Content-Type":"multipart/form-data",
   
       
  }
 
  console.log(token)
  let url=`${basurl}/posts/${id}/comments`
  axios.post(url,params,{
  headers:headers1
  
   
  })
  .then((response)=>{
  console.log(response.data)
  showalert("creat comment succe","success")
  getposts()

  })
  .catch((error) =>{
  let errormesage=error.response.data.message
  showalert(errormesage,"danger")

})


 }
 setup()
