import React, { useEffect, useState } from 'react'
import Search from './components/search'
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {

    const [searchItem,SetSearchItem] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const[movieList,setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounsedSearchItem, setDebounsedSearchItem] = useState('');

    useDebounce(() => {setDebounsedSearchItem(debounsedSearchItem)}, 1000);

    const fetchMovies = async (query = '') => {

        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint =  query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

            const response = await fetch(endpoint, API_OPTIONS)

            if(!response.ok){
                throw new Error('Could not fetch movies from API')
            }

            const data = await response.json();

            if(data.Response === 'false'){
                setErrorMessage(data.Response || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if(query && data.results.length >0) {
                await updateSearchCount(query, data.results[0]);
            }
        }
        catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);

        }
        catch(error){
            console.error(`Error fetching trending movies: ${error}`)
        }
    }

    useEffect(() => {
        fetchMovies(searchItem)

    },[searchItem])

    useEffect(() => {
        loadTrendingMovies();
    },[])


    return (
        <main>
            <div className = 'pattern' />

            <div className = 'wrapper'>
                <header>
                    <img src="/hero.png" alt="hero main poster" />
                    <h1>Find your Fav <span className="text-gradient">Movies</span> without any Stress</h1>
                    <Search searchItem={searchItem} SetSearchItem={SetSearchItem}/>
                </header>

                {trendingMovies.length > 0 && (
                    <section className = 'trending'>
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className = 'all-movies'>
                    <h2> All Movies</h2>

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p  className="text-red-500">{errorMessage}</p>
                    ): (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>


            </div>
        </main>
    )
}
export default App
