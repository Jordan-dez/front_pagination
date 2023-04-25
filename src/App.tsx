import { useEffect, useState } from 'react'
import './App.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { uid } from 'uid';
import { IoMdArrowDropupCircle,IoMdArrowDropdownCircle } from "react-icons/io";

export interface data {
  data: Film[];
  nowPage: number;
  totalPage: number;
  i: number
}

export interface Film {
  film_id: number
  Nom_du_film: string
  Prix_de_location: number
  Classement: string
  total_films: number
  Nom_du_genre: string
  Nombre_de_locations: number
}
function App() {

  const [allData, setAllData] = useState<data>();
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);

  const [titleFilter,setTitleFilter]=useState("Nom_du_film");

  const [titleOrderFilter,setTitleOrderFilter]=useState();
  const [categoryOrderFilter,setCategoryFilter]=useState();
  const [NombreLocationOrderFilter,SetNombreLocationFilter]=useState();


  useEffect(() => {
    const getData = async () => {
      let sortBy = titleOrderFilter ?? categoryOrderFilter ?? NombreLocationOrderFilter ?? "ASC"
      console.log("sortBy",sortBy)
      fetch(`http://localhost:3000/film?page=${currentPage}&postPerPage=${postPerPage}&sortBy=${titleFilter}&OrderBy=${sortBy}`).then(resp => resp.json()).then(data => {

        setAllData(data);
        setCurrentPage(data.nowPage)
      })
    }
    getData()
  }, [
        currentPage,
        postPerPage,
        titleFilter,
        titleOrderFilter,
        categoryOrderFilter,
        NombreLocationOrderFilter
      ]
    )
  console.log(titleFilter)
  const pageNumbers = [];

  if (allData?.totalPage <= 5) {
    for (let i = 1; i <= allData?.totalPage; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(allData?.totalPage);
    } else if (currentPage >= allData?.totalPage - 2) {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = allData?.totalPage - 4; i <= allData?.totalPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(allData?.totalPage);
    }
  }

  function handlePageChange(page: any) {
    console.log("page", page)
    if (typeof page == "number") {
      setCurrentPage(page);
    }
  }

  const nbpost = (e: ChangeEvent) => {
    setPostPerPage(e.target.value)
  }
  const handlefilterTitle=()=>{
    setTitleFilter("Nom_du_film")
    if(titleOrderFilter==="DESC"){
      setTitleOrderFilter("ASC")
    }else if(categoryOrderFilter==undefined){
      setCategoryFilter("ASC");
    }
    else{
      setTitleOrderFilter("DESC")
    }
    SetNombreLocationFilter();
    setCategoryFilter();
  }
  const handlefilterCtegory=()=>{
    setTitleFilter("Nom_du_genre")
    if(categoryOrderFilter==="DESC"){
      setCategoryFilter("ASC");
    }else if(categoryOrderFilter==undefined){
      setCategoryFilter("ASC");
    }
    else{
      setCategoryFilter("DESC")
    }
    SetNombreLocationFilter();
    setTitleOrderFilter();
  }
  const handlefilterLocation=()=>{
    setTitleFilter("Nombre_de_locations")
    if(NombreLocationOrderFilter=="DESC"){
      SetNombreLocationFilter("ASC")
    }else if(categoryOrderFilter==undefined){
      setCategoryFilter("ASC");
    }else{
      SetNombreLocationFilter("DESC")
    }
    setCategoryFilter();
    setTitleOrderFilter();
    console.log('NombreLocationFilter',NombreLocationOrderFilter)

  }

  return (
    <>
      <div className="container">
        <div className='d-flex justify-content-center'>
          <div>
            <label htmlFor="postperpage">
              nombre de film(s) par page
            </label>
            <input type="number" onChange={nbpost} />
          </div>
          <div className="justify-content-between">
            <button 
              onClick={()=>handlefilterTitle()}
            >
              titre du film 
              <span> {titleOrderFilter==="DESC" ?<IoMdArrowDropdownCircle/>:<IoMdArrowDropupCircle/>} </span>
            </button>
            <button 
              onClick={()=>handlefilterCtegory()}
            >
              catégorie 
              <span> {categoryOrderFilter==="DESC" ?<IoMdArrowDropdownCircle/>:<IoMdArrowDropupCircle/>} </span>
            </button>
            <button onClick={()=>handlefilterLocation()}>nombre de location <span> {NombreLocationOrderFilter==="DESC" ?<IoMdArrowDropdownCircle/>:<IoMdArrowDropupCircle/>} </span></button>
          </div>
          <div>
            <p>nombre d'élément(s) par page: {postPerPage} </p>

          </div>

        </div>
        {allData?.data &&
          <ul className='row'>{allData?.data.map((movie) => (
            <li className='col-md-3' key={movie.film_id}>
              <div className="card">
                <div className="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                  <img src={`https://picsum.photos/300/300?random=$/${movie.film_id}.webp`} className="img-fluid" alt={`${movie.Nom_du_film}`} />
                  <a href="#!">
                    <div className="mask" style={{ "backgroundColor": "rgba(251, 251, 251, 0.15)" }}></div>
                  </a>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{movie.Nom_du_film}</h5>
                  <div className="card-text">
                    <p>catégorie : {movie.Nom_du_genre}</p>
                    <p>Nombre location: {movie.Nombre_de_locations}</p>
                    <p>Prix location: {movie.Prix_de_location} £</p>
                  </div>
                  <a href="#!" className="btn btn-primary">Button</a>
                </div>
              </div>

            </li>))}
          </ul>
        }
      </div>


      <nav aria-label="Page navigation example">
        <ul className="pagination pagination-circle pg-blue">
          {pageNumbers.map((number) => (
            <li
              key={uid(32)}
              className={`${number === currentPage ? "page-item active" : "page-item"}`}
              onClick={() => handlePageChange(number)}
            >
              <a href={`?page=#${number}`}
                className="page-link"
              >
                {number}
              </a>
            </li>

          ))}
        </ul>
      </nav>
    </>
  )
}

export default App
