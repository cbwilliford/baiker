import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    document.querySelector(`.${styles.result}`).textContent = "Generating your recipe!"
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }


const displayRecipe = (result) => {
  const recipeData = JSON.parse(result);
  return (
    <>
      <h3>{recipeData.name}</h3>
      <div>
        <h4>Ingredients:</h4>
        <ul>
          {recipeData.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Recipe:</h4>
        <ol>
          {recipeData.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </>
  );
}



  return (
    <div>
      <Head>
        <title>bAIker - Your Baking Recipe Generator</title>
        <link rel="icon" href="/baiker_bread.png" />
      </Head>

      <main className={styles.main}>
        <img src="/baiker_bread.png" className={styles.icon}/>
        <h3>bAIker</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="What do you want to bake?"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Bake!" />
        </form>
        <div className={styles.result}>
          {result && result !== '' ? displayRecipe(result.trim()) : ''}
        </div>
      </main>
    </div>
  );
}
