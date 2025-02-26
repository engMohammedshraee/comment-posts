let basurl="https://tarmeezacademy.com/api/v1"

 let currentpage=1
 let lastpage=1
 //to do bignation give number of post in one time 
 window.addEventListener("scroll", ()=>{

            const  endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
        


        if(endOfPage && currentpage < lastpage){
            currentpage = currentpage + 1
           getposts(false,currentpage)

        }



 });

//get posts
getposts()
function getposts(reload=true,page=1){
    axios.get(`${basurl}/posts?limit=20&page=${page}`)

    .then(function(response){
     lastpage = response.data.meta.last_page

        let posts=response.data.data
       // console.log(lastpage)

       if(reload){
                document.getElementById("posts").innerHTML=""
            
           }
      
    
        for(post of posts){
            let user=getcurrentuser()
            let editbutton=''
            let deletbutton=''
            let ismypost= user!=null &&user.id== post.author.id
            if(ismypost){
             editbutton=`<button id="editbuton" class="btn btn-secondary" style="float:right" onclick="editpost('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`
             deletbutton=`<button id="deletbuton" class="btn btn-danger mr-2px" style="float:right;margin-right:5px" onclick="deletbuton('${encodeURIComponent(JSON.stringify(post))}')">delet</button>`
              
            }
         
            let content=`
                
                        <div class=" card shadow my-3 " >
                            <div class="card-header">
                                <span onclick="usercheck(${post.author.id})" style=cursor:pointer>
                                    <img class="border border-2" src="${post.author.profile_image}" alt="">
                    
                                    <b>  ${post.author.username}  </b> 
                                 </span>
                                
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
   
// to creat new post
function creatpost(){

        const messagalert="creat new post successfull "
    let postid=  document.getElementById("post-id").value
   
    let iscreat=postid ==null || postid ==""


        
        const bodypost=document.getElementById("post-body-input").value
        const titelpost=document.getElementById("post-titel-input").value
        const imagepost=document.getElementById("post-image-input").files[0]
        const formdata=new FormData()
        formdata.append("body",bodypost)
        formdata.append("title",titelpost)
        formdata.append("image",imagepost)


        let token=localStorage.getItem("token")
        const headers1={
            "authorization":`Bearer ${token}`,
            "Content-Type":"multipart/form-data"
        }
        let url=``

        if(iscreat){
             url=`${basurl}/posts`
         

        }
        else{
            formdata.append("_method","put")
            url=`${basurl}/posts/${postid}`
           
            showalert("update successfuly","success")




        }
        axios.post(url,formdata,{
            headers:headers1
        } ) 
        .then((response)=>{
        console.log(response) 
        const modal=document.getElementById("creatpost-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showalert("creat is successfuly","success")
        getposts()


        })
        .catch((error)=>{
            let messageerror=  error.response.data.message
            showalert(messageerror,"danger")
            modalInstance.hide()

        })

  

}
function usercheck(userid){
 
    window.location=`profile.html?userid=${userid}`

}

function showpostdetails(postid){
    //ارسال قيمة متغير من صفحة الى صفحة اخرى عن طريق كيورى باراميتر
  window.location=`posts.html?postid=${postid}`
  
}
//to edit owner post
function editpost(postobject){
    
    document.getElementById("modal-post-titel").innerHTML="edit post"
  
    //طريقة مستخمة لتحويل ابوجكت واستخامه في عنصرhtml
    let post=JSON.parse(decodeURIComponent(postobject))
    //TO CHANG TITEL from one modal to another
    //  استدعاء المودال من الjs
    // creatpost-modal هذا المودال الذي نريد اعادة استخدامه
    let editmodal=new bootstrap.Modal(document.getElementById("creatpost-modal"),{})
    editmodal.toggle()// this function to close and open modal

    document.getElementById("post-id").value=post.id
    document.getElementById("post-titel-input").value=post.title
    document.getElementById("post-body-input").value=post.body
    document.getElementById("post-button-submit").innerHTML="update"

    
}
//delet owen post
function deletbuton(postobject){
    let post=JSON.parse(decodeURIComponent(postobject))
    let editmodal=new bootstrap.Modal(document.getElementById("deletepost-modal"),{})
    editmodal.toggle()// this function to close and open modal

    let postid=post.id
    document.getElementById("delet-post-input-id").value=post.id
    //alert(postid)
    


    



}
function deletepost(){
    let postid= document.getElementById("delet-post-input-id").value
    let token=localStorage.getItem("token")
    const headers1={
        "authorization":`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
    }
        url=`${basurl}/posts/${postid}` 
        axios.delete(url,{
            headers:headers1
        }) 
        .then((response)=>{
         const modal=document.getElementById("deletepost-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showalert("delete successfuly","success")
        getposts()


        })
        .catch((error)=>{
             let messageerror=  error.response.data.message
             const modal=document.getElementById("deletepost-modal")
             const modalInstance = bootstrap.Modal.getInstance(modal)
             modalInstance.hide()
            showalert(messageerror,"danger")

        })



    


}
function addnewpost(){
    document.getElementById("modal-post-titel").innerHTML="creat new post"
  
    //طريقة مستخمة لتحويل ابوجكت واستخامه في عنصرhtml
    //TO CHANG TITEL from one modal to another
    //  استدعاء المودال من الjs
    // creatpost-modal هذا المودال الذي نريد اعادة استخدامه
    let editmodal=new bootstrap.Modal(document.getElementById("creatpost-modal"),{})
    editmodal.toggle()// this function to close and open modal

    document.getElementById("post-id").value=""
    document.getElementById("post-titel-input").value=""
    document.getElementById("post-body-input").value=""
    document.getElementById("post-button-submit").innerHTML="creat"
}


//alert ahow
function showalert(messag,type="success"){
    //function to buld alert messag 
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }

    appendAlert(messag, type)
    setTimeout(()=>{
        //todo:how to hidd alet
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
       // alert.close()

    },2000)
 
}
//to check of tokan state
function setup(){
    let addbuton=    document.getElementById("addicon")
    let logindiv=document.getElementById("unloginuser")
    let logoutdiv=  document.getElementById("loginuser")
    let token=localStorage.getItem("token")
    let editbutton=document.getElementById("editbutton")
    let deletbutton=document.getElementById("editbutton")

    if(token==null){
        if(addbuton != null){
            addbuton.style="display:none"
         


        } 

        logindiv .style="display:flex"
        logoutdiv.style="display:none"
    }else{
        if(addbuton != null){
            addbuton.style="display:flex"
            


        }

        logindiv.style="display:none"
        logoutdiv.style="display:flex"
        const user=getcurrentuser()
        document.getElementById("usernameinput").innerHTML=user.username
        document.getElementById("profile-image-input").src=user.profile_image


    }





}
//=====authentication function
//login check
let params={
    
}
function logincheck(){
    
    const messagalert="logend successfulu"
    let username=document.getElementById("username-input").value
    let password=document.getElementById("password-input").value
     let params={
        "username":username,
        "password":password

     }
     const url=`${basurl}/login`
     axios.post(url,params)
     .then((response)=>{
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify (response.data.user))
        const modal=document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        showalert(messagalert)

    setup()
   profilecurrentuser()

     
    })

}
// to registeration new user
function regestercheck(){
    const url=`${basurl}/register`

    const messagalert="regestration successfulu"
    let name=document.getElementById("regester-name-input").value

    let username=document.getElementById("regester-username-input").value
    let password=document.getElementById("regester-password-input").value
    let imag=document.getElementById("regester-image-input").files[0]
    let formData=new FormData()
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",imag)
    let headers1={
        "Content-Type":"multipart/form-data"
    }

    axios.post(url,formData,{
        headers:headers1
    } ) 
     .then((response)=>{
        console.log(response.data)
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify (response.data.user))
        const regestermodal=document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(regestermodal)
        modalInstance.hide()
        showalert(messagalert)
        setup()   
    }).catch((error)=>{
        let messageerror=  error.response.data.message
        showalert(messageerror,"danger")
        const regestermodal=document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(regestermodal)
        modalInstance.hide()

 


    })
}
//to registeration logout
function logoutcheck(){
    const messagalertout="logout successfulu"

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setup()
    profilecurrentuser()




    showalert(messagalertout)   
}
//get current user
function getcurrentuser(){
    let user=null
    let currentuser=localStorage.getItem("user")
    if(  currentuser !=null){
        user=JSON.parse(currentuser)
    }
return user
}
//this function to get profile for user that has the post

setup()
//function to check if user null cant go to profile page
function profilecurrentuser(){
    let user =getcurrentuser()
    if(user!=null){
        document.getElementById("profile").style="visibility: visibile;"
    }else{
        document.getElementById("profile").style="visibility: hidden;"

    }
}


// to check of login


//to shew alert message



//take username to posts page
