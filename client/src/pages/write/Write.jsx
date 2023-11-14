import React, { useContext, useState, useEffect } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [categories, setCategories] = useState([]); 
  const { user } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка на заполнение всех обязательных полей
    if (!selectedCategory || !title || !desc) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }
    

    try {
      const existingPost = await axios.get(`/posts?title=${title}`);
      if (existingPost.data.length > 0) {
        setErrorMessage("Post with the same title already exists.");
        
      }
    } catch (error) {
      console.error("Error checking for existing post:", error);
      setErrorMessage("Error checking for existing post.");
      return;
    }

    const newPost = {
      username: user.username,
      categories: [selectedCategory],
      title,
      desc,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
    try {
      const res = await axios.post("/posts", newPost);
      window.location.replace("/post/" + res.data._id);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };
  
  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeSelectContainer">
          <select
            className="writeSelect"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}