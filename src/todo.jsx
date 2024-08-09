import React, { useEffect, useState } from 'react'

function Todo() {
    const [title, setTitle]=useState("");
    const [description, setDesc] = useState("");
    const [success, setSuccess] = useState("");
    const [hello, setHello] = useState([]);
    const [edit, setEdit] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editdescription, setEditdescription] = useState("");


    // const url = "https://todo-server-sj5gbx2k6-lovely-sabeers-projects.vercel.app";
    const url = "https://todo-server-silk.vercel.app/api/todos";

    function handleclick(){
        // console.log(title)
        // console.log(description)
        if(title.trim() != ""){
            fetch(url+"/add",{
                method: "POST",
                headers:{'Content-Type':'application/JSON'},
                body: JSON.stringify({title})   
            })
            .then((res, err)=>{
                if(res.ok){
                    setSuccess("Item successfully Added")
                    setTitle("");
                    fetchData();
                    setTimeout(()=>{
                        setSuccess("")
                    },3000)
                }}
            )
        }else{
            setSuccess("Please fill all the fields")
        }
	}
	
    function handleUpdate(){
        // console.log(editTitle)
        // console.log(editdescription)
        if(editTitle.trim() != ""){
            fetch(url+"/update/"+edit,{
                method: "PUT",
                headers:{'Content-Type':'application/JSON'},
                body: JSON.stringify({title: editTitle})   
            })
            .then((res, err)=>{
                if(res.ok){
                    setSuccess("Item successfully updated")
                    fetchData();
                    setTimeout(()=>{
                        setSuccess("")
                    },3000)
                }}
            )
            setEdit(-1)
            setTimeout(()=>{
                setSuccess("")
            },3000)
        }else{
            setSuccess("Please fill all the fields")
        }
    }

    function handledelete(id){
        console.log(id)
        fetch(url+"/delete/"+id,{
            method: "DELETE",
            headers:{'Content-Type':'application/JSON'},
        })
        .then((res)=>{
            if(res.ok){
                setSuccess("Item successfully deleted")
                fetchData()
                setTimeout(()=>{
                    setSuccess("")
                },3000)
            }
        })
    }

async function fetchData() {
    try {
        const response = await fetch(`${url}/receive`); // Corrected endpoint path
        if (!response.ok) { // Check if the response is not OK
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHello(data);
        document.getElementById('inp').value = ""; // Clear input field
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

    useEffect(()=>{
        fetchData()
    },[])
    
  return (
    <>
    {/* TITLE */}
        <div className='text-center mt-10 text-xl font-extrabold font-serif p-4 border-1 border-black bg-slate-700 w-13 text-red-100  '>TODO LIST </div>
    
    {/* ADD ITEMS */}
        <div className='w-full mt-10 flex justify-center'>
            <div className='w-1/3 flex flex-row items-center justify-between'>
                <input type="text" placeholder="Title" id='inp' className='w-4/6 h-10 outline-none text-black rounded-md border-2 border-pink-600 text-center ' onChange={(e)=>{setTitle(e.target.value);}}/>
                <button className='add-btn' onClick={handleclick}>Add</button>
            </div>
        </div>
    
    {/* SEE ITEMS */}
        <ul className='flex flex-col items-center m-16 gap-2'>
            {
                hello.map((item)=>
                    <div className=' w-3/6 flex justify-around border-1 bg-blue-400 p-5 rounded-md ' key={item._id}>
                        {
                            edit == -1 || edit !== item._id ?
                            < div className='h-16 flex w-full items-center justify-around'>
                                <div className=' ov rounded-md w-2/6 h-1/2 text-xl font-bold bg-white flex justify-center items-center' > {item.title}</div>
                                {/* <div className=' border-green-500 rounded-md w-1/4 border-2 bg-white flex justify-center items-center'>{item.description}</div> */}
                                <button className=' btn-btn bg-orange-500' onClick={()=>setEdit(item._id)} >edit</button>
                                <button className='btn-btn bg-red-600 ' onClick={()=>{handledelete(item._id)}}>remove</button>
                            </div>:
                            <div className='h-16 flex w-full items-center justify-around'>
                                <input type="text" className='rounded-md w-2/6 h-1/2 text-xl font-bold bg-white flex justify-center items-center text-center outline-none' placeholder={item.title} onChange={(e)=>setEditTitle(e.target.value)}  />
                                {/* <input type="text" className=' border-green-500 rounded-md w-1/4 border-2 bg-white text-center' placeholder={item.description} onChange={(e)=>{setEditdescription(e.target.value) }} /> */}
                                <button className='btn-btn bg-green-600 ' onClick={handleUpdate} >update</button>
                                <button className='btn-btn bg-red-600  ' onClick={()=>setEdit(-1)}>cancel</button>

                                {/* defaultValue={item.title} 
                                defaultValue={item.description}*/}
                            </div>
                        }
                    </div>
                )
                
            }
        </ul>
        {success && <div>{success}</div>}

    </>
  )
}

export default Todo