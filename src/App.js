import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box, Typography, Button, Modal, Fade, Tooltip } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import Drawers from './Drawer';
import './App.css';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Snackbar from '@mui/material/Snackbar';
import { Navigate,useNavigate} from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const showAlert = sessionStorage.getItem("alert") === 'true';
  const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");
  const defaultTheme = storedTheme || (getSystemTheme() ? "darkTheme" : "lightTheme");
  // const storedTheme = localStorage.getItem("theme") === "lightTheme" ? "lightTheme" : "darkTheme";
  // const [darkMode, setDarkMode] = useState(storedTheme === "darkTheme");
  const [darkMode, setDarkMode] = useState(defaultTheme === "darkTheme");
  const [nextQuote, setnextQuote] = useState("Welcome to the Quote me Up!");
  const [nextQuoteBut, setnextQuoteBut] = useState("Show the first quote :)");
  const [like, setLike] = useState(false);

  const [counter, setCounter] = useState(0);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [id, setId] = useState('');

  // const handleClick = () => {
  //     setnextQuote("-Next quote-");
  //     setnextQuoteBut("Change quote again :(");
  // };

  
  
  const handleLogo = () => {
    window.location.reload();
  };
  useEffect(() => {
    // Attach the event listener when the component mounts
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', handleLogo);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (logo) {
        logo.removeEventListener('click', handleLogo);
      }
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [okay, setOkay] = useState(false);


  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [Snackbarmes, setSnackbarmes] = React.useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true); // Open the modal after 1 second
    }, 500);

    // Close the modal after 5 seconds
    const closeTimer = setTimeout(() => {
      setOpen(false); // Close the modal after 5 seconds
    }, 2500);

    // Cleanup timers when component unmounts or when the modal is closed
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, []);

  const fetchQuote = async () => {
    
    setLoading(true);
    setError(null); // Reset error before making the request
    try {
      
      let response;
      // console.log("Making API request...");
      if ((await fetch('https://dummyjson.com/quotes/random')).ok) { setCounter(0); }
      if (counter <= 0) {
        // console.log('First api was good');
        response = await fetch('https://dummyjson.com/quotes/random'); // Use the new API URL
      }
      else {
        // console.log('2nd api was good');
        response = await fetch('https://quotes-api-self.vercel.app/quote');
      }
      if (response.ok) {
        
        setOkay(true);
        const data = await response.json();
        // console.log("Fetched data:", data); // Check the response data in the console
        // Assuming the response contains a quote and an author
        if (data && data.quote && data.author) {

          if (data.quote.length > 100) {
            fetchQuote();
            // console.log("Too big quote");
          }
          else {
            setLike(false);
            setQuote(data.quote);
            setAuthor(data.author);
            setId(data.id);
            // setnextQuote(`"${data.quote}"\n - ${data.author}`);
            setnextQuote(`“${data.quote}”\n - ${data.author}`);
            setnextQuoteBut("Change quote :)");
          }
        } else {
          // setError("Quote or author missing in the response");
          setnextQuote("There was a problem loading the quote");
        }
      } else {
        setOkay(false);
        setCounter(counter + 1);
        // setError("Failed to fetch quote");
        setnextQuote("There was a problem connecting to the server");
        setError("Sorry for the incovinience :(")
        setnextQuoteBut("Please try again!");
      }
    } catch (err) {
      setOkay(false);
      setnextQuote("There was a problem loading the quote");
      // console.error("Error fetching quote:", err);
      // setError("Error fetching quote");
      setError("Sorry for the incovinience :(")
      setnextQuoteBut("Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate('/favorites')
  }
  const handlelike = () => {
    if(!like){ 
      setSnackbarmes('You liked this quote')
      const storedQuotes = JSON.parse(localStorage.getItem('quotes')) || []; 
      const newQuote = { quote: quote , author: author, id: id  };
      const updatedQuotes = [...storedQuotes, newQuote];
      localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
     }
    else{
       setSnackbarmes('You unliked this quote');

    }
    setTimeout(() => {
      setOpen1(true); // Open the Snackbar again with the updated message
    }, 100); // Delay in ms to allow the Snackbar to close
    setLike(!like);
    
  };


  const toggleTheme = () => {
    const newTheme = darkMode ? "lightTheme" : "darkTheme";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme); // Save to localStorage
  };

  useEffect(() => {
    // Sync the theme with localStorage on mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "lightTheme") {
      setDarkMode(false);
    }
  }, []);

  document.addEventListener("contextmenu", (event) => {
    if (event.target.tagName === "IMG") {
      event.preventDefault();
    }
  });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
          <Snackbar
          sx={{width:'fit-content',marginInline:'auto',textAlign:'center',padding:0,}}
    open={open1}
    autoHideDuration={2300}
    onClose={handleClose1}
    message={Snackbarmes}
    action={
      <Button
      
      padding='0'
        color="text.primary"
        size="small"
        onClick={handleViewAll}
      >
        View all
      </Button>
    }
  />
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
        >
          <Fade in={open}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              color: 'background.default',
              bgcolor: 'text.primary',
              border: '2px solid #000',
              outline: 'none',
              textAlign: 'center',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                The site is under construction!
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Moysiadis George :)
              </Typography>
            </Box>
          </Fade>
        </Modal>
        <Typography variant="div" className="logo" style={{ fontFamily: 'Pacifico-Regular ,Audiowide, Ruslan Display,Chelsea Market, sans-serif' }}>
          Quote me up!
        </Typography>
        <Button
          variant="contained"
          onClick={toggleTheme}
          className="Butt"
          sx={{
            fontSize: '17px',
            backgroundColor: 'text.primary',
            position: 'fixed', // Fixed positioning
            top: '1.3rem',       // Top distance
            right: '2.3rem',     // Right distance
            color: 'background.default'
            // ,fontFamily: 'Chelsea Market, sans-serif'
          }}
        >
          {/* {darkMode ? 'white' : 'blue'} */}
          <Tooltip title='Change theme color'>
            {storedTheme === 'lightTheme' ?
              <DarkModeOutlinedIcon /> :
              <WbSunnyOutlinedIcon />}
          </Tooltip>
        </Button>

        <Box
          sx={{
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            gap: '1rem',
            border: '5px solid',
            borderColor: 'text.primary',
            borderRadius: '10px',
            width: '60vw',
            minWidth: '200px',
            height: 'fit-content'
          }}
          >
           {okay && (
  <Box 
  // sx={{ marginInline: 'auto' }}
  sx={{
    display: 'flex',
    justifyContent: 'center', // Centers the "Quote" text
    alignItems: 'center', // Vertically centers all content
    position: 'relative', // Required for the absolute positioning of the heart icon
    marginInline: 'auto',
    width: '100%', // Adjust width as needed
    // maxWidth: '400px',
  }}
  >
    Quote
    {like ? (
      <FavoriteIcon  onClick={handlelike} sx={{
        position: 'absolute', 
        right: 0, fontSize: '20px'
      }}  /> 
    ) : (
      <FavoriteBorderIcon onClick={handlelike} sx={{
        position: 'absolute', 
        right: 0, fontSize: '20px'
      }}  /> 
    )}
  </Box>
)}

          <Typography sx={{ marginInline: 'auto', fontSize: '1.5rem', textAlign: 'center' }}>
            {/* {loading ? 'Loading...' : nextQuote} */}
            {nextQuote}
          </Typography>
          {error && <Typography sx={{ textAlign: 'center' }}>{error}</Typography>}
          {/* {response.ok ?  <Button>Like</Button> : null} */}
          <Button
            // onClick={handleClick}
            onClick={fetchQuote}
            // disabled={loading}
            sx={{
              textTransform: "none",
              width: 'fit-content',
              marginInline: 'auto',
              backgroundColor: 'text.primary',
              color: 'background.default'
              , padding: '.3rem',
              borderRadius: '.2rem'
            }}>
            {/* {nextQuoteBut} */}
            {loading ? 'Loading...' : nextQuoteBut}
          </Button>


        </Box>

        {/* <Box  sx={{
        marginTop: '1.5rem',
        backgroundColor: 'text.primary',
        color: 'background.default'
        ,padding: '.3rem',
        borderRadius: '.2rem'
       }}
        >Site is under construction!</Box> */}

        {/* <Drawers /> */}
        <Drawers onTheme={toggleTheme} />

      </Box>
    </ThemeProvider>
  );
}

export default App;
