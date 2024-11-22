import React, { useEffect, useState } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState("");
  const [hello, setHello] = useState([]);
  const [edit, setEdit] = useState(-1);
  const [editTitle, setEditTitle] = useState("");

  const url = "https://todo-server-silk.vercel.app/api/todos";

  const handlePost = () => {
    if (title.trim() !== "") {
      fetch(`${url}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ title }),
      }).then((res) => {
        if (res.ok) {
          setSuccess("Item successfully added!");
          setTitle("");
          fetchData();
          setTimeout(() => setSuccess(""), 3000);
        }
      });
    } else {
      setSuccess("Please fill the field.");
    }
  };

  const handleUpdate = () => {
    if (editTitle.trim() !== "") {
      fetch(`${url}/update/${edit}`, {
        method: "PUT",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ title: editTitle }),
      }).then((res) => {
        if (res.ok) {
          setSuccess("Item successfully updated!");
          fetchData();
          setTimeout(() => setSuccess(""), 3000);
        }
      });
      setEdit(-1);
    } else {
      setSuccess("Please fill the field.");
    }
  };

  const handleDelete = (id) => {
    fetch(`${url}/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/JSON" },
    }).then((res) => {
      if (res.ok) {
        setSuccess("Item successfully deleted!");
        fetchData();
        setTimeout(() => setSuccess(""), 3000);
      }
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}/receive`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setHello(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      {/* Title */}
      <div className="text-center mt-6 text-2xl font-extrabold font-serif text-white bg-blue-700 py-4 rounded-md">
        TODO LIST
      </div>

      {/* Add Item */}
      <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full md:w-2/3 px-4 py-2 border-2 border-pink-600 rounded-md outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          onClick={handlePost}
        >
          Add
        </button>
      </div>

      {/* Item List */}
      <ul className="flex flex-col items-center mt-10 space-y-4">
        {hello.map((item) => (
          <li
            key={item._id}
            className="w-full md:w-2/3 flex items-center justify-between p-4 bg-blue-100 rounded-md shadow"
          >
            {edit !== item._id ? (
              <>
                <span className="text-lg font-semibold">{item.title}</span>
                <div className="flex space-x-2">
                  <button
                    className="bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600"
                    onClick={() => setEdit(item._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder={item.title}
                  className="w-full md:w-2/3 px-4 py-2 border rounded-md outline-none"
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600"
                    onClick={() => setEdit(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Success Message */}
      {success && (
        <div className="mt-6 text-center text-green-600 font-medium">
          {success}
        </div>
      )}
    </div>
  );
}

export default Todo;
