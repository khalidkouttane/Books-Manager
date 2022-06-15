import React, { Component,  }  from 'react'
import { BrowserRouter as Router, Route, Routes/*instead of Switch*/, Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import cheerio from 'cheerio'
import '../App.css'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
//import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Button, Input, Stack} from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
  
const columns: GridColDef = [
  { field: 'col1', headerName: 'Book Title', width: 250, },
  { field: 'col2', headerName: 'Author', width: 200, headerClassName:'headerNameStyle' },
  { field: 'col3', headerName: 'Publication date', width: 150, headerClassName:'headerNameStyle' },
  { field: 'col4', headerName: 'Editor', width: 150, headerClassName:'headerNameStyle' },
  { field: 'col5', headerName: 'Genre', width: 150, headerClassName:'headerNameStyle' },
  { field: 'col6', headerName: 'Price', width: 150, headerClassName:'headerNameStyle' },
];

const styles= {
    bodyStyle: {
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addBookFormStyle: {
      marginTop: "60px",
      marginBottom: "80px",
    },
    inputStyle: {
      marginRight: "30px",
    }
  };

export default class home extends Component { 
  constructor(props){
    super(props)
    this.state = { 
      books: [],
      rw: [],
      isRowSelected: false,
      searchQuery: "",
      selectedId: "",
      selectedIndex: "",
      prices: [], links: [],
      bookTitle: "", author: "", publishDate: "", editor: "", genre: "", price: "",
    }   
  }

  onChangeBookTitle(e) {
    this.setState({
      bookTitle : e.target.value
    })
  }

  onChangeAuthor(e) {
    this.setState({
      author: e.target.value
    })
  }

  onChangePublishDate(e) {
    this.setState({
      publishDate: e.target.value
    })
  }

  onChangeEditor(e) {
    this.setState({
      editor : e.target.value
    })
  }

  onChangeGenre(e) {
    this.setState({
      genre : e.target.value
    })
  }

  onChangePrice(e) {
    this.setState({
      price : e.target.value
    })
  }

  componentDidMount() {
    //getting books from the DB
    axios.get('http://localhost:4000/books/')
      .then(response => {
        this.setState({ books: response.data })

        // filling the rw array with the books we got from DB
        // rw gonna serve as DataGrid rows
        this.state.books.map(currentbook => ( // i used ( instead of { to avoid the warning of excpected return
          this.setState({ 
            rw: [...this.state.rw, 
              {
                id: currentbook._id, 
                col1: currentbook.bookname, 
                col2: currentbook.author, 
                col3: currentbook.publishDate,
                col4: currentbook.editor, 
                col5: currentbook.genre,
                col6: currentbook.price
              } ] 
          })
        ));
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleGetPrice(e) {
    e.preventDefault()
    this.forceUpdate();
    let prices = []
    let links = []
    axios.get("https://cors-anywhere.herokuapp.com/https://www.amazon.fr/s?k="+this.state.searchQuery+"&i=stripbooks")
        .then(res => {
            const $= cheerio.load(res.data);
            // get the prices
            $(".a-price-whole").each((i, data) => {
                const price= $(data).text();
                const link = $(data).closest("a").attr("href")
                links.push(link)
                prices.push(price)
            })
        })
    this.setState({
      prices: prices,
      links: links
    })
    this.forceUpdate();
    console.log(this.state.links);
    console.log(this.state.prices);
  }


  handleDelete(e) {
    e.preventDefault()
    axios.delete(`http://localhost:4000/books/${this.state.selectedId}`)
      .then(res => console.log(res.data))

    var array = [...this.state.rw]; // make a separate copy of the array
    if (this.state.selectedIndex !== -1 && this.state.selectedIndex !== "") {
      array.splice(this.state.selectedIndex, 1);
      this.setState({rw: array});
    }
  }

  handleEdit(e) {
    e.preventDefault()
  }

  handleSubmit(e) {
    e.preventDefault()
    var newbook = {
      bookname: this.state.bookTitle,
      author: this.state.author,
      publishDate: this.state.publishDate,
      genre: this.state.genre,
      editor: this.state.editor,
      price: this.state.price,
    }
    this.setState({ 
      rw: [...this.state.rw, 
        {
          id: Math.random(), 
          col1: this.state.bookTitle,
          col2: this.state.author, 
          col3: this.state.publishDate,
          col4: this.state.editor, 
          col5: this.state.genre,
          col6: this.state.price
        }],
      bookTitle: "", author: "", publishDate: "", editor: "", genre: "", price: "",
    })
    
    

  render() {
    return (
    <div>
        <h1> Welcome reader ! </h1>
          <h2> Here are all the books available in our database now. </h2>

          <form style={styles.addBookFormStyle} onSubmit={this.handleSubmit.bind(this)} >
            {//<hr style={{width: '700px'}}/> <br/><br/>
            }
            <Input type="text" placeholder="Book Title" name="bookTitle" style={styles.inputStyle}
            value={this.state.bookTitle} onChange={this.onChangeBookTitle.bind(this)}
            />
            <Input type="text" placeholder="Author" name="author" style={styles.inputStyle} 
            value={this.state.author} onChange={this.onChangeAuthor.bind(this)}
            />
            <Input type="text" placeholder="Publish Date" name="publishDate" style={styles.inputStyle}
            value={this.state.publishDate} onChange={this.onChangePublishDate.bind(this)}
             />
            <Input type="text" placeholder="Editor" name="editor" style={styles.inputStyle} 
            value={this.state.editor} onChange={this.onChangeEditor.bind(this)}
            />
            <Input type="text" placeholder="Genre" name="genre" style={styles.inputStyle} 
            value={this.state.genre} onChange={this.onChangeGenre.bind(this)}
            />
            <Input type="text" placeholder="Price" name="price" style={styles.inputStyle} 
            value={this.state.price} onChange={this.onChangePrice.bind(this)}
            />
            <Button type="submit" value="Add book" variant="outlined" style={styles.inputStyle}>  Add book </Button>
          </form>

          <Box sx={{ height: 400, width: '80%', marginBottom: '50px', '& .headerNameStyle':{fontWeight: 'bold'}}}>
            <DataGrid 
              rows={this.state.rw}
              columns={columns}
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRowData = this.state.rw.filter((row) =>
                  selectedIDs.has(row.id.toString())
                );
                (typeof selectedRowData[0] !== 'undefined' && selectedRowData[0]) ?
                this.setState({
                  searchQuery: selectedRowData[0].col1 + " " + selectedRowData[0].col2,
                  selectedId: selectedRowData[0].id,
                  selectedIndex: this.state.rw.indexOf(selectedRowData[0]),
                  isRowSelected: true
                })
                : this.setState({
                  searchQuery: "",
                  selectedId: "",
                  selectedIndex: "",
                  isRowSelected: false
                })
              }} 
            />            
          </Box>

          <br/><br/><br/>
          <Stack direction="row" spacing={3}>
            <Button disabled={!this.state.isRowSelected} onClick={this.handleGetPrice.bind(this)} variant="contained" color="success" endIcon={<AttachMoneyIcon />} texttransform="none">
              Get book price
            </Button>
            <Button disabled={!this.state.isRowSelected} onClick={this.handleEdit.bind(this)} variant="contained" endIcon={<EditIcon />}>
              Edit book infos
            </Button>
            <Button disabled={!this.state.isRowSelected} onClick={this.handleDelete.bind(this)} variant="contained" color="error" endIcon={<DeleteIcon />}>
              Delete book
            </Button>
          </Stack>

          <Box sx={{ width: '100%', maxWidth: 650, bgcolor: '#fbfdff' }}>
          <Link 
            to={{
              pathname: "/page",
              state:  this.state.prices
            }}
          >
          prices
          </Link>
            {/*<List>
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
            </List> */}             
          </Box>
          <br/><br/>
    </div>
    );
  }
}
