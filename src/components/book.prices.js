import React, { Component } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
//import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

class BookPrices extends Component {

  render() {
    return (
    <div>
        <Box sx={{ width: '100%', maxWidth: 650, bgcolor: '#fbfdff' }}>
            <List>
               <div style={{ fontSize:'18px' }}>
                <p>
                  <b>Search results: {this.state.searchQuery} found prices.</b>
                  <br/>(search done in <i>amazon.fr</i>)
                </p>
               </div>
                {this.state.prices.map(currentprice => {
                  const url_index = this.state.prices.indexOf(currentprice, this.state.prices.indexOf(currentprice))
                  const url = "https://amazon.fr"+this.state.links[url_index]
                  return (
                    <ListItem disablePadding key={Math.random()} >
                      <ListItemButton component="a" target="_blank" href={url}>
                        <ListItemText primary={currentprice+ " €"}  />
                      </ListItemButton>
                      <br/>
                    </ListItem>
                  )
                })}
            </List>              
          </Box>
    </div>
    )
  }
}

export default BookPrices;