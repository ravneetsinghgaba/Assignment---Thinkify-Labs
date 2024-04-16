import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [backgroundColors, setBackgroundColors] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [creatives, setCreatives] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [filterByColor, setFilterByColor] = useState('');

  //currently doing form validation manually, we can also use React Hook From library for the same

  useEffect(() => {
    fetch('https://random-flat-colors.vercel.app/api/random?count=5')
      .then(response => response.json())
      .then(data => {
        if (data && data.colors && Array.isArray(data.colors)) {
          setBackgroundColors(data.colors);
        } else {
          throw new Error('Invalid data format received');
        }
      })
      .catch(error => {
        console.error('Error fetching background colors:', error.message);
      });
  }, []);

  useEffect(() => {
    setLoadingProgress((creatives.length / 5) * 100);
  }, [creatives]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    validateForm();
  };

  const handleSubtitleChange = (e) => {
    setSubtitle(e.target.value);
    validateForm();
  };

  const handleBackgroundChange = (color) => {
    setBgColor(color);
    validateForm();
  };

  const validateForm = () => {
    if (title.trim() !== '' && subtitle.trim() !== '' && bgColor !== '') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && subtitle && bgColor && creatives.length < 5) {
      const newCreative = { title, subtitle, bgColor };
      setCreatives([...creatives, newCreative]);
      setTitle('');
      setSubtitle('');
      setBgColor('');
      setDrawerOpen(false);
    }
  };

  const handleColorFilter = (color) => {
    setFilterByColor(color);
  };

  const filteredCreatives = filterByColor ? creatives.filter(creatives => creatives.bgColor === filterByColor) : creatives;

  return (
    <div className="App">
      <h2>Filter By:</h2>
      <h4>Color</h4>
      <div className="color-filters">
        {backgroundColors.map((color, index) => (
          <div
            key={index}
            className={`color-box ${filterByColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorFilter(color)}
          ></div>
        ))}
      </div>
      <div className='title-filter'>
        <h4>Title/Subtitle</h4>
        <input type='text' placeholder='search across title and subtitle'></input>
      </div>
      <div>
        <span>{creatives.length} / 5 Creatives</span>
        <div className="loading-bar">
          <div className="progress" style={{ width: `${loadingProgress}%` }}></div>
        </div>
      </div>
      <button onClick={toggleDrawer} disabled={drawerOpen || creatives.length === 5} className="add-creative-btn">
        + Add Creative
      </button>
      <div className="preview-list">
        {creatives.map((creative, index) => (
          <div
            key={index}
            className="preview-item"
            style={{ backgroundColor: creative.bgColor }}
          >
            <h3>{creative.title}</h3>
            <p>{creative.subtitle}</p>
          </div>
        ))}
      </div>
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <h2>Creative Creation</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>title</label>
            <input type="text" value={title} onChange={handleTitleChange} required placeholder='Enter Text' />
          </div>
          <div className='form-group'>
            <label>subtitle</label>
            <input type="text" value={subtitle} onChange={handleSubtitleChange} placeholder='Enter Text' required />
          </div>
          <div className="color-boxes">
            <label>background color </label>
            {backgroundColors.map((color, index) => (
              <div
                key={index}
                className={`color-box ${bgColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleBackgroundChange(color)}
              ></div>
            ))}
          </div>
          <button className='done-btn' type="submit" disabled={!formValid}>Done</button>
        </form>
      </div>
    </div>
  );
}

export default App;
