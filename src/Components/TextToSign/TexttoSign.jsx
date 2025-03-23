import React, { useState } from "react";
import "./TexttoSign.css";

function TexttoSign() {
  const [word, setWord] = useState("");
  const [inputText, setInputText] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isl_gif = ['A', 'address', 'ahemdabad', 'all', 'any questions', 'are you angry', 'are you hungry', 'assam', 'august', 'B', 'banana', 'banaras', 'banglore', 'be careful', 'bridge', 'C', 'cat', 'christmas', 'church', 'cilinic', 'D', 'dasara', 'december', 'did you finish homework', 'do you have money', 'do you want something to drink', 'do you watch TV', 'dont worry', 'E', 'F', 'flower is beautiful', 'G', 'good afternoon', 'good morning', 'good question', 'grapes', 'H', 'hello', 'hindu', 'hyderabad', 'i am a clerk', 'i am fine', 'i am sorry', 'i am thinking', 'i am tired', 'i go to a theatre', 'i had to say something but I forgot', 'i like pink colour', 'i love to shop', 'job', 'july', 'june', 'karnataka', 'kerala', 'krishna', 'L', 'lets go for lunch', 'M', 'mango', 'may', 'mile', 'mumbai', 'nagpur', 'nice to meet you', 'open the door', 'P', 'pakistan', 'please call me later', 'police station', 'post office', 'pune', 'punjab', 'saturday', 'shall I help you', 'shall we go together tommorow', 'shop', 'sign language interpreter', 'sit down', 'stand up', 'T', 'take care', 'temple', 'there was traffic jam', 'thursday', 'toilet', 'tomato', 'tuesday', 'usa', 'village', 'wednesday', 'what is the problem', "what is today's date", 'what is your father do', 'what is your name', 'whats up', 'where is the bathroom', 'where is the police station', 'Y', 'you are wrong', 'Z'];

  const handleSpeechRecognition = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/recognize", { method: "POST" });
      const data = await response.json();
      if (data.word && isl_gif.includes(data.word.toLowerCase())) {
        setWord(data.word);
        setGifUrl(`http://127.0.0.1:5000/get_gif/${data.word}`);
      } else {
        setWord("Not Found");
        setGifUrl("");
      }
    } catch (error) {
      console.error("Error recognizing speech:", error);
    }
  };

  const handleTextSubmit = () => {
    if (!inputText.trim()) {
      alert("Please enter a word");
      return;
    }
    if (isl_gif.includes(inputText.toLowerCase())) {
      setWord(inputText);
      setGifUrl(`http://127.0.0.1:5000/get_gif/${inputText}`);
    } else {
      setWord("Not Found");
      setGifUrl("");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    
    if (value.length > 0) {
      const filtered = isl_gif.filter((word) =>
        word.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTextSubmit();
    }
  };

  return (
    <div className="container_gif">
      <div className="content_gif">
        <button onClick={handleSpeechRecognition}>🎤 Start Speech Recognition</button>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type a word"
            value={inputText}
            onChange={handleChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={handleKeyPress}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="suggestion-box">
              {filteredSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => {
                  setInputText(suggestion);
                  setShowSuggestions(false);
                }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={handleTextSubmit} className="sub_button">Submit</button>
      </div>
      <div className="gif_img">
        {word === "Not Found" ? (
          <h2>Word not found</h2>
        ) : (
          gifUrl && <img src={gifUrl} alt={word} className="gif" />
        )}
      </div>
    </div>
  );
}

export default TexttoSign;