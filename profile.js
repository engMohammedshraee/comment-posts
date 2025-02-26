let urlparam = new URLSearchParams(window.location.search)
//id for every post
const iduser=urlparam.get("userid")
let user=getcurrentuser()
let userid=""

if(user==null){
    userid=iduser
    
}else{
    userid=user.id
}

//get post
function getuserinfo(){

 

   // alert(userid)
    
    axios.get(`${basurl}/users/${userid}`)

    .then((response)=>{

        let datauser=response.data.data
    
        document.getElementById("userinformation").innerHTML=""
       let content=`
         <div  class="row justify-content-evenly">
                                <div class="col-2 ">
                                <img id="imageprofile"  src="${datauser.profile_image}" alt="" style="height:150px;width:150px ; border-radius:200px !important" >


                                </div>
                            
                            
                            
                                <div  class="col-4 d-flex flex-column justify-content-evenly" >
                                    <div class="info-card">
                                        ${datauser.name}
                                    </div>
                                    <div class="info-card">
                                        ${datauser.username}
                                    </div>
                                    <div class="info-card">
                                       ${datauser.email}
                                    </div>

                                
                                
                            
                                </div>
                                <div  class="col-4 d-flex flex-column justify-content-evenly" >
                                    <div class="info">
                                       <span> ${datauser.comments_count}</span> coment
                                    </div>
                                    <div class="info">
                                      <span> ${datauser.posts_count}</span>  post 
                                    </div>
                                    

                                
                                
                            
                                </div>
                                  
                        </div>`
    document.getElementById("userinformation").innerHTML=content




    })

}
getuserinfo()

//get current user
 function getcurrentuser(){
    let user=null
    let currentuser=localStorage.getItem("user")
    if(  currentuser !=null){
        user=JSON.parse(currentuser)
    }
   return user
}
//get all post that spicilaize to usere
function getuserposts(){
    // console.log(user)


        axios.get(`${basurl}/users/${userid}/posts`)
        .then((response)=>{
            let posts=response.data.data
            let user=getcurrentuser()
         
          
           
            let content=``
            document.getElementById("posts").innerHTML=""

            for(post of posts){
                let editbutton=''
                let deletbutton=''
                let ismypost= user!=null &&userid== post.author.id
                if(ismypost){
                 editbutton=`<button id="editbuton" class="btn btn-secondary" style="float:right" onclick="editpost('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`
                 deletbutton=`<button id="deletbuton" class="btn btn-danger mr-2px" style="float:right;margin-right:5px" onclick="deletbuton('${encodeURIComponent(JSON.stringify(post))}')">delet</button>`
                  
                }
            
                content=`
                                    <div class=" card shadow my-3 " >
                                        <div class="card-header">
                                            <img class="border border-2" src="${post.author.profile_image}" alt="">
                            
                                            <b>  ${post.author.username}  </b> 
                                              ${editbutton}
                                              ${deletbutton}
                                        </div> 
                                    
                                        <div class="card-body"onclick=showpostdetails(${post.id}) style=cursor:pointer>
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

                                                
                        
                                            </div>
                                        
                                    
                                        </div>
                                    </div>

                            
                                `
                //inter post to div posts    

                document.getElementById("posts").innerHTML+=content
                const currentposttagid=`post-tags-${post.id}`
                document.getElementById(currentposttagid).innerHTML=""
            
                //get tags of the post 
                for(tag of post.tags){  
            
                   let contenttages=`
   
                       <button class="btn btn-sm rounded-5" style="background-color: gray;color: white;">
                         ${tag.name}
                       </button>
                   
                   
                   `
                  document.getElementById(currentposttagid).innerHTML +=contenttages
           
                }


           
        

        
 

        }



             
        
    })

}
getuserposts()

setup()