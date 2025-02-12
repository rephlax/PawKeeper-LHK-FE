import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";



const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";
const webToken = localStorage.getItem("authToken");


const AddPetForm = () => {
    const { userId } = useParams();
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState(0);
  const [petSpecies, setPetSpecies] = useState("");
  const nav = useNavigate();
  

  async function handleCreatePet(e) {
    e.preventDefault();

    
    if (webToken) {
      try {
        const newPet = {
          petName,
          petAge,
          petSpecies,
          owner: userId
        };
        axios.post(`${BACKEND_URL}/pets/${userId}`, newPet, {
          headers: {
            authorization: `Bearer ${webToken}`,
          },
        });

        alert("Pet Added Sucessfully!")
        nav(`/users/user/${userId}`)
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      <form className="form" onSubmit={handleCreatePet}>
        <label>
          Pet Name:
          <input
            type="text"
            value={petName}
            onChange={(e) => {
              setPetName(e.target.value);
            }}
          />
        </label>
        <label>
          Pet Age:
          <input
            type="number"
            value={petAge}
            onChange={(e) => {
              setPetAge(e.target.value);
            }}
          />
        </label>
        <label>
          Pet Species:
          <input
            type="text"
            value={petSpecies}
            onChange={(e) => {
              setPetSpecies(e.target.value);
            }}
          />
        </label>
        <button>Add Pet</button>
      </form>
    </div>
  );
};
export default AddPetForm;
