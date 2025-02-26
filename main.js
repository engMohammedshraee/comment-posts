let basurl="https://tarmeezacademy.com/api/v1"


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
setup()
//creat or updat modal function
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
    getuserposts()
    getuserinfo()


    })
    // .catch((error)=>{
    //     let messageerror=  error.response.data.message
    //     showalert(messageerror,"danger")
    // const modalInstance = bootstrap.Modal.getInstance(modal)

    //     modalInstance.hide()

    // })



}
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
        getuserposts()
        getuserinfo()


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
